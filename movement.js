//<rectangle class definition>
function rect(ex,yee,w,h,idee,s)
{
    if(w<0)
    {
	this.x=ex+w;
    }
    else
    {
	this.x=ex;
    }
    if(h<0)
    {
	this.y=yee+h;
    }
    else
    {
	this.y=yee;
    }
    this.width=Math.abs(w);
    this.height=Math.abs(h);
    this.id=idee;
    this.borderColor="#B2AFAF";
    this.fillColor="#CECBCB";
    this.scale=s;
    this.img=null;
    //methods
    
    this.within=within;
    this.setWidth=setWidth;
    this.setHeight=setHeight;
    this.setX=setX;
    this.setY=setY;
    this.resetScaler=resetScaler;
    this.draw=draw;
    
    function within(x,y)
    {
	return x<=this.x+this.width &&
	    x>=this.x &&
	    y<=this.y+this.height &&
	    y>=this.y;
    }

    function setX(ex)
    {
	this.x=ex;
	this.resetScaler();
    }

    function setY(yee)
    {
	this.y=yee;
	this.resetScaler();
    }
    
    function setWidth(w)
    {
	if(w<0)
	    this.x=this.x+w;
	this.width=Math.abs(w);
	this.resetScaler();
    }

    function setHeight(h)
    {
	if(h<0)
	    this.y=this.y+h;
	this.height=Math.abs(h);
	this.resetScaler();
    }

    function resetScaler()
    {
	this.scale.x=this.x+this.width-this.scale.width;
	this.scale.y=this.y+this.height-this.scale.height;
    }

    function draw(context)
    {
	context.beginPath();
	context.rect(this.x,this.y,this.width,this.height);
	context.fillStyle=this.fillColor;
	context.fill();
	context.lineWidth=3;
	context.strokeStyle=this.borderColor;
	context.stroke();
	if(this.img!=null)
	{
	    this.img.draw(this.x,this.y,this.width,this.height,context);
	}
    }
}

//<\rectangle>

//<scaleRect> a rect which is used to scale another rect

function scaleRect(h,w,r)
{
    this.rect=r;
    this.height=h;
    this.width=w;
    this.x=rect.x+rect.width-this.width;
    this.y=rect.y+rect.height-this.height;
    this.borderColor="#000000";
    this.fillColor="#000000";

    //methods
    this.setX=setX;
    this.setY=setY;
    this.within=within;
    this.draw=draw;

    function setX(ex)
    {
	this.x=ex;
	this.rect.width=this.x+this.width-this.rect.x;
    }

    function setY(yee)
    {
	this.y=yee;
	this.rect.height=this.y+this.height-this.rect.y;
    }

    function within(x,y)
    {
	return x<=this.x+this.width &&
	    x>=this.x &&
	    y<=this.y+this.height &&
	    y>=this.y;
    }

    function draw(context)
    {
	context.beginPath();
	context.rect(this.x,this.y,this.width,this.height);
	context.fillStyle=this.fillColor;
	context.fill();
	context.lineWidth=3;
	context.strokeStyle=this.borderColor;
	context.stroke();
    }
}

function coverImage(imgSrc)
{
    this.img = document.getElementById(imgSrc+"-image");

    //methods
    this.draw=draw;

    function draw(x,y,w,h,context)
    {
	context.drawImage(this.img,x,y,w,h);
    }
}

function transistionImage(imgStart,imgEnd)
{
    this.start = document.getElementById(imgStart+"-image");
    this.end = document.getElementById(imgEnd+"-image");
    this.soFar = 0.0;
    
    //methods
    this.draw = draw;

    function draw(x,y,w,h,context)
    {
	var remainder = 1-this.soFar;
	context.drawImage(this.start,x,y,w,h);
	if(this.soFar!=0)
	    context.drawImage(this.end,
			      remainder*getImageWidth(this.end),//sx
			      0,//sy
			      this.soFar*getImageWidth(this.end),//swidth
			      getImageHeight(this.end),//sheight
			      w-this.soFar*w+x,//x
			      y,//y
			      this.soFar*w,
			      h);
    }
}

function finalShow(ex,yee,w,h,img)
{
    this.x=ex;
    this.y=yee;
    this.width=w;
    this.height=h;
    this.img=null;

    //methods
    this.draw=draw;

    function draw(context)
    {
	if(this.img!=null)
	    this.img.draw(this.x,this.y,this.width,this.height,context);
    }
}

function getImageHeight(imgElement)
{
    var newImage = new Image()
    newImage.src=imgElement.src;
    return newImage.height;
}

function getImageWidth(imgElement)
{
    var newImage = new Image();
    newImage.src=imgElement.src;
    return newImage.width;
}

var canvas = document.getElementById("drawCanvas");
var context = canvas.getContext("2d");
//list of rects to draw;
var drawList = [];
//position indicator for drawing rects
var x=-1;
var y=-1;
//indicates if the mouse has been pressed
var down=false;
//rect to move
var move=null;
//the difference between the top left position
//and mouse point to maintain
var dx=0;
var dy=0;
var id=0;
//the rectangle info to return to the server
var rectRet=null;
//the background image
var img=null;
//the rectangle which is used to display the images for the final slide show
var imgRect=null;

function getId()
{
    id++;
    return id-1;
}

//draws all rectangles in drawList
function draw()
{
    context.clearRect(0,0,canvas.width,canvas.height);
    if(img!=null)
	context.drawImage(img,0,0,canvas.width,canvas.height);
    for(var i=0;i<drawList.length;i++)
    {
	var r = drawList[i];
	r.draw(context);
    }
}

//gets the current position of the mouse on the canvas
function getMousePos(e)
{
    var rect = canvas.getBoundingClientRect();
    return {
	xpos:e.clientX-rect.left,
	ypos:e.clientY-rect.top
    };
}

function mouseDown(e)
{
    down=true;
    var mouse = getMousePos(e);
    for(var i=0;i<drawList.length;i++)
    {
	var r=drawList[i];
	if(r.within(mouse.xpos,mouse.ypos))
	    move=r;
    }
    if(move==null)
    {
	down=true;
	var scale = new scaleRect(10,10,move);
	move = new rect(mouse.xpos,mouse.ypos,0,0,getId(),scale);
	scale.rect=move;
	drawList.length=0;
	drawList.push(move);
	drawList.push(scale);
	rectRet=move;
    }
    else
    {
	dx=move.x-mouse.xpos;
	dy=move.y-mouse.ypos;
	down=false;
    }
    draw();
}

function drawRect(x,y,w,h)
{
    var scale = new scaleRect(10,10,move);
    move = new rect(x,y,w,h,getId(),scale);
    scale.rect=move;
    drawList.length=0;
    drawList.push(move);
    drawList.push(scale);
    rectRet=move;
    move=null;
    draw();
}

function mouseMove(e)
{
    if(move!=null)
    {
	var mouse = getMousePos(e);
	if(down)
	{
	    move.setWidth(mouse.xpos-move.x);
	    move.setHeight(mouse.ypos-move.y);
	}
	else
	{
	    move.setX(dx+mouse.xpos);
	    move.setY(dy+mouse.ypos);
	}
	draw();
    }
}

function mouseUp(e)
{
    move=null;
    down=false;
    draw();
}

function mouseOut(e)
{
    if(down)
    {
	mouseUp(e);
    }
}

function setBackground()
{
    if(imgList.length!=1)
	window.alert("Exactly one image must be chosen for the background!");
    else
	img=document.getElementById(imgList[0]+"-image");
    draw();
}

var showList=new Array();
var pos=0;
var crrnt=0;

function setShowList(lst)
{
    showList=lst;
}

/**Slideshow Preview**/
var timePerScroll=1000 //transition speed
var fps=50;
var start;

function preview()
{
    if(pos>=showList.length)
	pos=0;
    var next = pos+1;
    if(next>=showList.length)
	next=0;
    if(showList.length==0)
	return;
    rectRet.img=new coverImage(showList[pos].img);
    draw();
    crrnt=pos;
    setTimeout(function(){start=new Date().getTime();
			  previewTransistion(new transistionImage(showList[crrnt].img,showList[next].img));},showList[crrnt].time);
    pos++;
}

function previewTransistion(transImg)
{
    var time=new Date().getTime();
    rectRet.img=transImg;
    transImg.soFar=(time-start)/timePerScroll;
    if(transImg.soFar>=1.0)
    {
	preview();
	return;
    }
    else if(transImg.soFar!=0)
	draw();
    setTimeout(function(){previewTransistion(transImg);},1000/fps);
}

function clear()
{
    drawList.length=0;
    draw();
}

canvas.onmousedown=function(event){mouseDown(event)};
canvas.onmouseup=function(event){mouseUp(event);};
canvas.onclick=function(){clear();};
canvas.onmousemove=function(event){mouseMove(event);};
canvas.onmouseout=function(event){mouseOut(event);};
canvas.onselectstart=function(){return false;};
//document.getElementById("clear").onclick=function(){clear();};
