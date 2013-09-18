var inputButton = document.getElementById("inputButton");
var fileInputForm = document.getElementById("fileInputForm");
var fakeInputButton = document.getElementById("fileInputButton");

var removeFile = document.getElementById("fileRemoveButton");

fakeInputButton.onclick = function()
{
    inputButton.click();
}

inputButton.onchange = function()
{
    fileInputForm.submit();
}

var imgList = new Array();

function updateCheck(check)
{
    if(check.checked)
	imgList.push(check.id);
    else
    {
	for(var i=0;i<imgList.length;i++)
	{
	    if(imgList[i] == check.id)
	       {
		   imgList.splice(i,1);
		   break;
	       }
	}
    }
}

function remFiles(button)
{
    var str="";
    for(var i=0;i<imgList.length;i++)
	str+=imgList[i]+"\t";
    button.value=str;
    var form = document.getElementById("fileRemoveForm");
    submitRemForm(form);
    return false;
}

