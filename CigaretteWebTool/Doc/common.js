// -------------------------------- Select Box ----------------------------------------
function listChange(sourcelist,declist,recSrc,resDec,strSplitChr) {
  blnonchg=true;
  for(var i=0;i<sourcelist.length;i++){
    if(sourcelist.options[i].selected){
      var option=document.createElement("OPTION");
      option.text=sourcelist.options[i].text;
      option.value=sourcelist.options[i].value;
      declist.add(option);
    }
  }
  for(var i=sourcelist.length-1;i>=0;i--){
    if(sourcelist.options[i].selected){
      sourcelist.remove(i);
    }
  }
//  recSrc.value=fGetSelList(sourcelist,strSplitChr);
//  resDec.value=fGetSelList(declist,strSplitChr);
}

function listChangeAll(sourcelist,declist,recSrc,resDec,strSplitChr){
  blnonchg=true;
  for(var i=0;i<sourcelist.length;i++){
    var option=document.createElement("OPTION");
    option.text=sourcelist.options[i].text;
    option.value=sourcelist.options[i].value;
    declist.add(option);
  }
  for(var i=sourcelist.length-1;i>=0;i--){
    sourcelist.remove(i);
  }
  //recSrc.value=fGetSelList(sourcelist,strSplitChr);
  //resDec.value=fGetSelList(declist,strSplitChr);
}
//隐藏Lookup IFRAME
function fhiddenifLookupTB()
{
  document.all.ifLookupTB.style.visibility = 'hidden';
  document.all.ifLookupTB.style.pixelTop = 1;
  document.all.ifLookupTB.style.pixelLeft = 1;
  document.all.ifLookupTB.style.pixelHeight = 1;
  document.all.ifLookupTB.style.pixelWidth = 1;
}

//隐藏Lookup IFRAME并清除页面
function fhiddenParifLookupTB()
{
  parent.document.all.ifLookupTB.style.visibility = 'hidden';
  parent.document.all.ifLookupTB.style.pixelTop = 1;
  parent.document.all.ifLookupTB.style.pixelLeft = 1;
  parent.document.all.ifLookupTB.style.pixelHeight = 1;
  parent.document.all.ifLookupTB.style.pixelWidth = 1;
  parent.document.all.ifLookupTB.src='';
}
//显示Lookup IFRAME
function fLookupTB(objSender,strUrl,width,height){
var top = objSender.offsetTop+objSender.offsetHeight;
var left = objSender.offsetLeft;
if (document.all.ifLookupTB.style.visibility == 'hidden')
  {
  document.all.ifLookupTB.src =strUrl;
  document.all.ifLookupTB.style.pixelWidth = 300;
  document.all.ifLookupTB.style.pixelHeight = 300;
  for (objSender=objSender.offsetParent; objSender != null; objSender=objSender.offsetParent) {
    top = objSender.offsetTop + top;
    left = objSender.offsetLeft + left;
  }
  document.all.ifLookupTB.style.pixelTop= top;
  document.all.ifLookupTB.style.pixelLeft = left;
  document.all.ifLookupTB.style.visibility = '';
  document.all.ifLookupTB.focus();
  }
  else
  {
  document.all.ifLookupTB.style.visibility = 'hidden';
  document.all.ifLookupTB.style.pixelTop = 1;
  document.all.ifLookupTB.style.pixelLeft = 1;
  document.all.ifLookupTB.style.pixelHeight = 1;
  document.all.ifLookupTB.style.pixelWidth = 1;
  }
}
//隐藏ListBox IFRAME
function fhiddenifListBox()
{
  document.all.ifListBox.style.visibility = 'hidden';
  document.all.ifListBox.style.pixelTop = 1;
  document.all.ifListBox.style.pixelLeft = 1;
  document.all.ifListBox.style.pixelHeight = 1;
  document.all.ifListBox.style.pixelWidth = 1;
}
//隐藏ListBox IFRAME并清除页面
function fhiddenParifListBox()
{
  parent.document.all.ifListBox.style.visibility = 'hidden';
  parent.document.all.ifListBox.style.pixelTop = 1;
  parent.document.all.ifListBox.style.pixelLeft = 1;
  parent.document.all.ifListBox.style.pixelHeight = 1;
  parent.document.all.ifListBox.style.pixelWidth = 1;
  parent.document.all.ifListBox.src='';
}
//显示ListBox IFRAME
function fListBox(objSender,strUrl,width,height)
{
var top = objSender.offsetTop+objSender.offsetHeight;
var left = objSender.offsetLeft;
if (document.all.ifListBox.style.visibility == 'hidden')
  {
  document.all.ifListBox.src =strUrl;
  document.all.ifListBox.style.pixelWidth = width;
  document.all.ifListBox.style.pixelHeight = height;
  for (objSender=objSender.offsetParent; objSender != null; objSender=objSender.offsetParent) {
    top = objSender.offsetTop + top;
    left = objSender.offsetLeft + left;
  }
  document.all.ifListBox.style.pixelTop= top;
  document.all.ifListBox.style.pixelLeft = left;
  document.all.ifListBox.style.visibility = '';
  document.all.ifListBox.focus();
  }
  else
  {
  document.all.ifListBox.style.visibility = 'hidden';
  document.all.ifListBox.style.pixelTop = 1;
  document.all.ifListBox.style.pixelLeft = 1;
  document.all.ifListBox.style.pixelHeight = 1;
  document.all.ifListBox.style.pixelWidth = 1;
  }
}
 function fShowFrameMsg(strMsg,autoHidden)
 {
   //var url = document.all.ifMessageBox.title;
   //document.all.ifMessageBox.src =url+"?msg="+strMsg+"&autoHidden="+autoHidden;
   var msg = strMsg.substr(strMsg.indexOf(":")+1)
   var icon  = strMsg.split(':')[0];
   if (icon==3)
   		msg = "很抱歉，系统发生故障，请与系统管理员联系！";
   if(msg.length>0)
		alert(trim(msg));
   //alert(document.all.ifMessageBox.src);
   //   document.all.ifMessageBox.style.visibility = '';
 }
 function fShowFrameMessage(icon,strMsg,autoHidden)
 {
   if(strMsg.length>0)
   {
       dlblShowMessage.style.visibility='visible';
       dlblShowMessage.style.left=0;
       dlblShowMessage.style.top=0;
       lblShowMessage1.innerHTML=strMsg;

       document.all.chenggong.style.display = 'none';
       document.all.chucuo.style.display = 'none';
       document.all.info.style.display = 'none';
       document.all.yanzhongcuowu.style.display = 'none';
       document.all.working.style.display = 'none';
       document.all.closediv.style.display = 'none';
       document.all.showrow.style.display = 'none';
       document.all.detailrow.style.display = 'none';
       if (icon==0) document.all.chucuo.style.display = '';
       if (icon==1) {document.all.chenggong.style.display = ''; autoHidden = 1;}
       if (icon==2) document.all.info.style.display = '';
       if (icon==3)
       {
         document.all.yanzhongcuowu.style.display = '';
         document.all.showrow.style.display = '';
         lblShowMessage1.innerHTML="很抱歉，系统发生故障，请与系统管理员联系！<br>";
         lblShowMessage2.innerHTML=strMsg;
       }
       if (icon==5)
       {
         document.all.info.style.display = '';
         document.all.working.style.display = '';
         autoHidden = 0 ;
       }
   if ((autoHidden==1)&&(icon!=4))
   {
        if (document.images)
         {
             parselimit=limit.split(":");
             parselimit=parselimit[0]*60+parselimit[1]*1+1;
         }
          fTimeFrameHidden()
   }
   else if(icon !=5) document.all.closediv.style.display = '';
   }
 }
function fHiddenFrameMessage()
{
   var targWin = self.parent.document.all[self.name];
   if(targWin != null)
   {
     self.parent.document.all.ifMessageBox.src="";
     self.parent.document.all.ifMessageBox.style.visibility ='hidden';
   }
}
function fTimeFrameHidden()
{
    if (!document.images)    return;
    if (parselimit==1)
        fHiddenFrameMessage()
    else{
        parselimit-=1;
        curmin=Math.floor(parselimit/60);
        cursec=parselimit%60;
        if (curmin!=0)
            curtime=curmin+"分"+cursec+"秒！"
        else
            curtime=cursec+"秒！";
        document.all.lblShowSeconds.innerHTML=curtime;
//        window.status=curtime;
        setTimeout("fTimeFrameHidden()",1000);
    }
}

function fShowMsg(strMsg,autoHidden)
{
  var icon=1;
  var msg="没有返回信息！";
  icon  = strMsg.split(':')[0];
  msg = strMsg.split(':')[1];
  if(icon.length<1)
  {
    icon = 4;
    msg = strMsg;
  }
  fShowMessage(icon,msg,autoHidden)
}

function fListBox2(objSender,strUrl,width,height)
{
var top = objSender.offsetTop+objSender.offsetHeight;
var left = objSender.offsetLeft-350;
if (document.all.ifListBox.style.visibility == 'hidden')
  {
  document.all.ifListBox.src =strUrl;
  document.all.ifListBox.style.pixelWidth = width;
  document.all.ifListBox.style.pixelHeight = height;
  for (objSender=objSender.offsetParent; objSender != null; objSender=objSender.offsetParent) {
    top = objSender.offsetTop + top;
    left = objSender.offsetLeft + left;
  }
  document.all.ifListBox.style.pixelTop= top;
  document.all.ifListBox.style.pixelLeft = left;
  document.all.ifListBox.style.visibility = '';
  document.all.ifListBox.focus();
  }
  else
  {
  document.all.ifListBox.style.visibility = 'hidden';
  document.all.ifListBox.style.pixelTop = 1;
  document.all.ifListBox.style.pixelLeft = 1;
  document.all.ifListBox.style.pixelHeight = 1;
  document.all.ifListBox.style.pixelWidth = 1;
  }
}

function fShowMessage(icon,strMsg,autoHidden)
{
  if(strMsg.length>0)
  {
      dlblShowMessage.style.visibility='visible';
      dlblShowMessage.style.left=(window.screen.width*0.4)/2+20;
      dlblShowMessage.style.top=document.body.scrollTop+160;
      lblShowMessage1.innerHTML=strMsg;

      document.all.chenggong.style.display = 'none';
      document.all.chucuo.style.display = 'none';
      document.all.info.style.display = 'none';
      document.all.yanzhongcuowu.style.display = 'none';
      document.all.working.style.display = 'none';
      document.all.closediv.style.display = 'none';
      if (icon==1) document.all.chenggong.style.display = '';
      if (icon==2) document.all.chucuo.style.display = '';
      if (icon==3) document.all.info.style.display = '';
      if (icon==4) document.all.yanzhongcuowu.style.display = '';
      if (icon==5)
      {
        document.all.info.style.display = '';
        document.all.working.style.display = '';
        autoHidden = 0 ;
      }
  if ((autoHidden==1)&&(icon!=4))
  {
       if (document.images)
        {
            parselimit=limit.split(":");
            parselimit=parselimit[0]*60+parselimit[1]*1+1;
        }
         fTimeHidden()
  }
  else if(icon !=5) document.all.closediv.style.display = '';
  }
}
function fHiddenMessage()
{
  dlblShowMessage.style.visibility='hidden';
}
function fTimeHidden()
{
    if (!document.images)    return;
    if (parselimit==1)
        fHiddenMessage()
    else{
        parselimit-=1;
        curmin=Math.floor(parselimit/60);
        cursec=parselimit%60;
        if (curmin!=0)
            curtime=curmin+"分"+cursec+"秒！"
        else
            curtime=cursec+"秒！";
        lblShowSeconds.innerHTML=curtime;
//        window.status=curtime;
        setTimeout("fTimeHidden()",1000);
    }
}

//显示一行 obj:行对象
function showRow(obj)
{
   obj.style.display = "";
   return true;
}
//隐藏一行 obj:行对象
function hideRow(obj)
{
  obj.style.display = "none";
  return true;
}
//取当前表可显示的行数
function getShowRowCount(obj)
{
  var table = eval(obj);
  var maxShow=0;
  for (i=0; i < table.rows.length; i++)
     {
   		var t= table.rows(i);
   		if (t.style.display != "none")
   		  maxShow=maxShow+1;
     }
   return  maxShow;
}
function disableTable(obj)
{
  var table;
  if (obj  != "")	table = eval(obj);  // Assumes that the obj is THE OBJECT
  else return false;
  if (table == null) return false;;  // Check whether it's an object
  if (table.tagName != "TABLE") return false;;  // Check whether it's a table
  for (i=0; i < table.rows.length; i++) {
        for (j=0; j < table.rows(i).cells.length; j++) {
            disableRow(table.rows(i));
        }
   }
   return true;
}
//将一行中所有input disable
function disableRow(obj)
{
  var row= obj;
  var cellchildren;
   for (j=0; j < row.cells.length; j++) {
       cellchildren = row.cells(j).children;
	    for(m=0;m<cellchildren.length;m++)  {
	       var child = cellchildren(m);
	    	if (child.tagName=="INPUT") {
            child.disabled=true;
       		}
       	}
     }
	return true;
}

//删除一行 obj:行对象；isHiddenRow:是否隐藏行 true false
function deleteRow(obj,isHiddenRow)
{
  var cell = obj.parentElement;//取this父对象为CELL
  var row = cell.parentElement; //取cell父对象为ROW
  clearRow(row);//清除行中text的值
  if (isHiddenRow==true){
  	hideRow(row);//隐藏行
  }
  return true;
}
//清除一行中所有text的值 obj:行对象
function clearRow(obj)
{
  var row= obj;
  var cellchildren;
   for (j=0; j < row.cells.length; j++) {
       cellchildren = row.cells(j).children;
	    for(m=0;m<cellchildren.length;m++)  {
	       var child = cellchildren(m);
	    	if (child.tagName=="INPUT") {
	        	child.value = "";
       		}
       	}
     }
	return true;
}
//清除表中所有text的值 obj:表对象
function clearTable(obj)
{
  var table;
  if (obj  != "")	table = eval(obj);  // Assumes that the obj is THE OBJECT
  else return false;
  if (table == null) return false;;  // Check whether it's an object
  if (table.tagName != "TABLE") return false;;  // Check whether it's a table
  for (i=0; i < table.rows.length; i++) {
        for (j=0; j < table.rows(i).cells.length; j++) {
            clearRow(table.rows(i));
        }
   }
   return true;
}
//汇总指定sumColName的值到setColName
// obj 表；prefix前缀；nDec 格式化小数点 保留位数
//例：sumCol("dataTable","orderDetail","quantOrder","totQuantOrder",0)
function sumCol(obj,prefix,sumColName,setColName,nDec)
{
   var colname ="";
   var nRow;		// Various table stats
   var table;				// Table object
   var sumValue = 0;
   var colValue = 0;
	if (obj  != "")
	{
		table = eval(obj);  // Assumes that the obj is THE OBJECT
	}
	if (table == null) return;  // Check whether it's an object
	if (table.tagName != "TABLE") return;  // Check whether it's a table
	nRow = table.rows.length;// Setting the number of rows
	if (nRow < 1) return;// Should have at least 1 row
	// Loop through rows
	for (var i=0; i<nRow; i++)
	{
      if(prefix!="")
      {
        colname = prefix+"[" + i + "]." + sumColName;
      }
      colValue = document.forms[0].elements[colname].value;
      if (checkNumber(colValue))
        {
          if (colValue == "") { colValue =0;}
          sumValue = parseFloat(sumValue) + parseFloat(colValue);
         }
      else
      	{
          sumValue = -1;
          break;
        }
    }
   document.forms[0].elements[setColName].value =  FormatNumber(parseFloat(sumValue),nDec);
}
 //add by miaoag 20060203
//计算指定sumColName的记录数
//例：sumColCount("dataTable","orderDetail","quantOrder","productcount",0)
function sumColCount(obj,prefix,sumColName,setColName,nDec)
{
   var colname ="";
   var nRow;		// Various table stats
   var table;				// Table object
   var sumValue = 0;
   var colValue = 0;
	if (obj  != "")
	{
		table = eval(obj);  // Assumes that the obj is THE OBJECT
	}
	if (table == null) return;  // Check whether it's an object
	if (table.tagName != "TABLE") return;  // Check whether it's a table
	nRow = table.rows.length;// Setting the number of rows
	if (nRow < 1) return;// Should have at least 1 row
	// Loop through rows
	for (var i=0; i<nRow; i++)
	{
      if(prefix!="")
      {
        colname = prefix+"[" + i + "]." + sumColName;
      }
      colValue = document.forms[0].elements[colname].value;
      if (checkNumber(colValue))
        {
          if (colValue>0)
          sumValue = sumValue+1;
         }
      else
      	{
          sumValue = 0;
          break;
        }
    }
   document.forms[0].elements[setColName].value =  FormatNumber(parseFloat(sumValue),nDec);
}
//add by chenxj 20050518
//汇总指定sumColName的值到指定顶表的某行某列
// obj 表；prefix前缀；nDec 格式化小数点 保留位数
//例：sumCol("dataTable","orderDetail","quantOrder","TableNmae",0,4,0)
function sumTableCol(obj,prefix,sumColName,setTableName,row,col,nDec)
{
   var colname ="";
   var nRow;		// Various table stats
   var table;				// Table object
   var sumValue = 0;
   var colValue = 0;
	if (obj  != "")
	{
		table = eval(obj);  // Assumes that the obj is THE OBJECT
	}
	if (table == null) return;  // Check whether it's an object
	if (table.tagName != "TABLE") return;  // Check whether it's a table
	nRow = table.rows.length;// Setting the number of rows
	if (nRow < 1) return;// Should have at least 1 row
	// Loop through rows
	for (var i=0; i<nRow; i++)
	{
      if(prefix!="")
      {
        colname = prefix+"[" + i + "]." + sumColName;
      }
      colValue = document.forms[0].elements[colname].value;
      if (checkNumber(colValue))
        {
          if (colValue == "") { colValue =0;}
          sumValue = parseFloat(sumValue) + parseFloat(colValue);
         }
      else
      	{
          sumValue = -1;
          break;
        }
    }
    var setTable = eval(setTableName);
    setTable.rows(row).cells(col).innerText=FormatNumber(parseFloat(sumValue),nDec);
}
//指定光标位置
// prefix前缀；id每几行； col列名
//例：setFocus("orderDetail",id,"quantOrder");
function setFocus(prefix,id,col)
{
   
   if ((event.keyCode!=13 ) && (event.keyCode!=0 ))  return false;
    var colname ="";
    if((id>=0)&&(prefix!=""))
        colname = prefix+"[" + id + "]." + col;
    else
        colname = col;
    var focusControl = document.forms[0].elements[colname];
    if (typeof(focusControl)!="object")
         return false;
    if (focusControl.type == "hidden")
        return false;
    if (((focusControl.readOnly)||(focusControl.disabled)) && (id>=0))
    {
      id=id+1;
      setFocus(prefix,id,col);
    } else{
//    if (document.forms[0].elements[colname].style.display == "none")
//    if (id >11 )
//         return false;
    focusControl.focus();
    if (focusControl.tagName=="INPUT")
      focusControl.select();
    return true};
}
function httpGet(http,url)
{
   var strRet = "";
   if(url.length!=0)
   {
        http.open("GET",url,false);
        http.send();
        strRet = http.responseText;
    }
    strRet = trimNC(strRet);
    if (strRet.length==0)
	{
		 alert("系统查询失败！");
         return "";
	}
    return strRet;
}
function httpGet2(http,url)
{
   var strRet2 = "";
   if(url.length!=0)
   {
        http.open("GET",url,false);
        http.send();
        strRet = http.responseText;
    }
    strRet = trimNC(strRet);
    if (strRet.length==0)
	{
		 alert("系统查询失败！");
         return "";
	}
    return strRet;
}
function httpGetNR(http,url)
{
   var strRet = "";
   if(url.length!=0)
   {
        http.open("GET",url,false);
        http.send();
        strRet = http.responseText;
    }
    strRet = trimNR(strRet);
    if (strRet.length==0)
	{
         return "";
	}
    return strRet;
}

//截取字符串前后的空字符回车符和换行符
function trimNR(strValue)
{
	var  i=0;
	var intLen;
	if (strValue.length == 0)return ""
	while (i == 0)
	  {
	    i = strValue.indexOf("\r",0);
	    strValue=strValue.replace("\r","")
	  }
    i=0;
	while (i == 0)
	  {
	    i = strValue.indexOf("\n",0);
	    strValue=strValue.replace("\n","")
	  }
	return strValue;
}

//截取字符串前后的空字符
function trim(strValue)
{
	var  i=0;
	var intLen;
	if (strValue.length == 0)return ""
	while (i == 0)
	  {
	    i = strValue.indexOf(" ",0);
	    strValue=strValue.replace(" ","")
	  }

    intLen = (strValue.length - 1)
    while (strValue.lastIndexOf(" ") == intLen)
      {
        strValue=strValue.substr(0,intLen-1)
        intLen = strValue.length
	  }
	return strValue;
}
//截取字符串前后的空字符回车符和换行符
function trimNC(strValue)
{
	var  i=0;
	var intLen;
	if (strValue.length == 0)return ""
	while (i == 0)
	  {
	    i = strValue.indexOf("\r",0);
	    strValue=strValue.replace("\r","")
	  }
    i=0;
	while (i == 0)
	  {
	    i = strValue.indexOf(" ",0);
	    strValue=strValue.replace(" ","")
	  }
    i=0;
	while (i == 0)
	  {
	    i = strValue.indexOf("\n",0);
	    strValue=strValue.replace("\n","")
	  }

    intLen = (strValue.length - 1)
    while (strValue.lastIndexOf(" ") == intLen)
      {
        strValue=strValue.substr(0,intLen-1)
        intLen = strValue.length
	  }
	return strValue;
}

//检查数字
function checkNumber(str) {
    var i;
    var len = str.length;
    var chkStr = "-1234567890.";
    if (len == 1) {
	if (chkStr.indexOf(str.charAt(i)) < 0) {
	    return false;
	}
    } else {
	if ((chkStr.indexOf(str.charAt(0)) < 0) || ((str.charAt(0) == "0")&&(str.charAt(1)!="."))) {
	    return false;
	}
	 for (i = 1; i < len; i++) {
		if (chkStr.indexOf(str.charAt(i)) < 0) {
			    return false;
		}
	}
    }
    return true;
}

//打开窗口
function openDialog(WINurl,WINwidth,WINheight,xyPosition)
{
 if(xyPosition==0)//屏幕中央
   {
    showx = (window.screen.availWidth  - WINwidth)/2;
    showy = (window.screen.availHeight - WINheight)/2;
   }
 else//事件附近
   {
	   showx = event.screenX - event.offsetX - 4 - WINwidth ; // + deltaX;
	   showy = event.screenY - event.offsetY + 18; // + deltaY;
	  }
	newWINwidth = WINwidth + 4 + 18;
	var features =
		'dialogWidth:'  + newWINwidth  + 'px;' +
		'dialogHeight:' + WINheight + 'px;' +
		'dialogLeft:'   + showx     + 'px;' +
		'dialogTop:'    + showy     + 'px;' +
		'directories:no; localtion:no; menubar:no; status=no; toolbar=no;scrollbars:yes;Resizeable=no';
	var vDialog = window.showModalDialog(WINurl, " ", features);
	return vDialog;
}
//检查两个日期比较
function checkDateCompare(obj1,obj2)
{
 var d1=obj1.value;
 var d2=obj2.value;
 if(d1.length!=0&&d2.length!=0)
   {
    var flag = false;
    if(parseInt(d1.split('-')[0])<=parseInt(d2.split('-')[0]))
       if(parseInt(d1.split('-')[1])<=parseInt(d2.split('-')[1]))
          if(parseInt(d1.split('-')[2])<=parseInt(d2.split('-')[2]))
             flag = true;
    if(flag)
       return true;
    else
       alert('起始日期大于终止日期！');
   }
 else
     return true;
}
//比较二个日期的差额
function getBetweenDatedays (beginDate,endDate)
{
    var len = beginDate.length;
    if(len==0) return 0;
    var len = endDate.length;
    if(len==0) return 0;

    var DATEBegin=new Date(beginDate);
    var DATEEnd=new Date(endDate);

    var date = DATEEnd.getTime() - DATEBegin.getTime();
    var days = Math.floor(date / (1000 * 60 * 60 * 24));

    return days;
}

//数字格式化函数
function FormatNumber(srcStr,nAfterDot){
    var srcStr,nAfterDot;
    var resultStr,nTen;
    srcStr = ""+srcStr+"";
    strLen = srcStr.length;
    dotPos = srcStr.indexOf(".",0);
    if (dotPos == -1){
       if (nAfterDot==0) return  srcStr;
        resultStr = srcStr+".";
        for (i=0;i<nAfterDot;i++){
            resultStr = resultStr+"0";
        }
        return resultStr;
    } else {
         if ((strLen - dotPos - 1) >= nAfterDot){
              nAfter = dotPos + nAfterDot + 1;
              nTen =1;
              for(j=0;j<nAfterDot;j++){
                   nTen = nTen*10;
              }
              resultStr = Math.round(parseFloat(srcStr)*nTen)/nTen;
                  return resultStr;
          }else{
              resultStr = srcStr;
              for (i=0;i<(nAfterDot - strLen + dotPos + 1);i++){
                  resultStr = resultStr+"0";
              }
              return resultStr;
          }
     }
 }

function ExportExcel()
{
  var cell1;
  cell1=document.all("objCellID");
  cell1.DoExportExcelFile("");

}
function onprint()
{
  var cell1;
  cell1=document.all("objCellID");
  cell1.DoPrint(1);
}
function onprintpreview()
{
  var cell1;
  cell1=document.all("objCellID");
  cell1.DoPrintPreview(1);
}
//叛断是否为一整数
function isPostiveInt(_str)
	{
		str=trim(_str);
    	var i,j;
    	var len = str.length;
    	if(len==0) return false;
    	var first_check_str = "+123456789";
    	var check_str = "1234567890";
    	if(len==1)
    	{
			if(check_str.indexOf(str.charAt(i))<0) return false;
    	}
    	else
    	{
			if((first_check_str.indexOf(str.charAt(0))<0) || (str.charAt(0)=="0")) return false;
	 		for(i=1;i<len;i++) if(check_str.indexOf(str.charAt(i))<0) return false;
    	}
    	return true;
	}