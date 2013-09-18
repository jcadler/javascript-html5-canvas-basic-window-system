var showList = new Array();

function updateShowList(num,check)
{
    if(check.value)
	showList.push(num);
    else
    {
	for(var i=0;i<showList.length;i++)
	{
	    if(showList[i]==check.id)
	    {
		showList.splice(i,1);
		break;
	    }
	}
    }
}

var showForm = document.getElementById("showForm");
var showInput = document.getElementById("showInput");

function newSlideshow()
{
    setImageAndRect();
    var name = prompt("Enter the name of the new slideshow.");
    if(name==null)
	return;
    showInput.value=name+":";
    showForm.submit();
}

function modifyShow(cmd)
{
    switch(cmd)
    {
    case "swap":
	swapFrames();
	break;
    case "remove":
	removeFrames();
	break;
    case "delete":
	deleteShow();
	break;
    case "download":
	downloadShow();
	break;
    case "new":
	newSlideshow();
	break;
    default:
	alert("You must select an option.");
	return;
    }
}

function swapFrames()
{
    setImageAndRect();
    if(showList.length!=2)
    {
	alert("You can only select exactly two images to swap.");
	return;
    }
    var strArray = slideShowArray();
    var start = showList[0]+1;
    var end = showList[1]+1;
    var tmp = strArray[start];
    strArray[start]=strArray[end];
    strArray[end]=tmp;
    submit(strArray);
}

function removeFrames()
{
    if(showList.length==0)
    {
	alert("You must select some frames to remove.");
	document.getElementById("editDropdown").selectedIndex=0;
	return;
    }
    setImageAndRect();
    var strArray = slideShowArray();
    for(var i=strArray.length-1;i>=1;i--)
    {
	if(showList.indexOf(i-1)!=-1)
	    strArray.splice(i,1);
    }
    submit(strArray);
}

function deleteShow()
{
    setImageAndRect();
    showInput.name="deleteShow";
    showInput.value=document.getElementById("showTitle").innerHTML;
    showForm.submit();
}

function downloadShow()
{
    setImageAndRect();
    var editDrop = document.getElementById("editDropdown");
    if(rectRet==null && img==null)
    {
	alert("You need to have a background and a slideshow rectangle in order to download show.");
	editDrop.selectedIndex=0;
	return;
    }
    else if(rectRet==null)
    {
	alert("You need to have a slideshow rectangle in order to download your show.");
	editDrop.selectedIndex=0;
	return;
    }
    else if(img==null)
    {
	alert("You need to have a background in order to download your show.");
	editDrop.selectedIndex=0;
	return;
    }
    showInput.name="downloadShow";
    showInput.value=makeSlideShowString();
    showForm.submit();
}

function slideShowArray()
{
    var ret = makeSlideShowString().split(":");
    ret.splice(ret.length-1,1);
    return ret;
}

function submit(strArray)
{
    var str="";
    for(var i=0;i<strArray.length;i++)
	str+=strArray[i]+":";
    showInput.value=str;
    showForm.submit();
}

function openSlideShow(show)
{
    setImageAndRect();
    showInput.name="openShow";
    showInput.value=show;
    showForm.submit();
}

function addFrames()
{
    setImageAndRect();
    if(document.getElementById("showTitle")==null)
    {
	alert("You can only add frames to an open slideshow");
	return;
    }
    else if(imgList.length==0)
    {
	alert("You need to select frames to add");
	return;
    }
    var str = makeSlideShowString();
    for(var i=0;i<imgList.length;i++)
	str+=imgList[i]+"\t"+"0:";
    showInput.value=str;
    showForm.submit();
}

function save()
{
    setImageAndRect();
    var str = makeSlideShowString();
    showInput.value=str;
    showForm.submit();
}

function previewShow()
{
    showStringToShowList(makeSlideShowString());
    preview();
}

function frame(image,t)
{
    this.img=image
    this.time=t;
}

function showStringToShowList(str)
{
    var strArray = str.split(":");
    strArray.splice(strArray.length-1,1);
    showList = new Array();
    for(var i=1;i<strArray.length;i++)
    {
	var crrnt = strArray[i].split("\t");
	showList.push(new frame(crrnt[0],parseInt(crrnt[1])));
    }
}

function setImageAndRect()
{
    var imageSubmit = document.createElement("input");
    imageSubmit.type="hidden";
    imageSubmit.id="backgroundInput";
    showForm.appendChild(imageSubmit);
    var rectSubmit = document.createElement("input");
    rectSubmit.type="hidden";
    rectSubmit.id="rectangleInput";
    showForm.appendChild(rectSubmit);
    if(img==null)
	showForm.removeChild(imageSubmit);
    else
    {
	imageSubmit.name="crrntBackground";
	imageSubmit.value=img.id.substring(0,img.id.lastIndexOf("-"))
    }
    if(rectRet==null)
	showForm.removeChild(rectSubmit);
    else
    {
	rectSubmit.name="crrntRect";
	rectSubmit.value=rectRet.x+":"+rectRet.y+":"+rectRet.width+":"+rectRet.height+":";
    }
}

function makeSlideShowString()
{
    var str = "";
    var title = document.getElementById("showTitle");
    if(title==null)
	return null;
    str+=title.innerHTML +":";
    var time;
    var img;
    var i=0;
    time = document.getElementById("time-"+i);
    img = document.getElementById("img-"+i);
    while(time!=null && img !=null)
    {
	str+=img.title+"\t"+1000*parseFloat(time.value)+":";
	i++;
	time = document.getElementById("time-"+i);
	img = document.getElementById("img-"+i);
    }
    return str;
}