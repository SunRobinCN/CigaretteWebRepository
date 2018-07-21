var currentRow = 0; //全局变量   行号

function init() {
	if(PRODUCT_CODE != null && PRODUCT_CODE != "") {
		if(document.getElementById("dataTable").rows.length>1){//有数据时再搜索。
			searchProduct(PRODUCT_CODE);
		}
	} else {
		if(document.forms[0].elements["orderSdDetail[0].qtyReq"]!= null)
			document.forms[0].elements["orderSdDetail[0].qtyReq"].focus()
	}
}

function getValidNumInput2(lngKeyCode,txtValue)
{
    if (lngKeyCode > 57 || lngKeyCode < 46) {
		if (lngKeyCode!=13)
			return false;
	}
	if (lngKeyCode == 47)   //除号
		return false;
	if (lngKeyCode == 46)  //点号
		return false;
	if (lngKeyCode == 45)  //减号
		return false;
	return true;
}

//处理回车换行
function on_keypress(http,id,currCol,nextCol) {
	var qtyObj = document.forms[0].elements["orderSdDetail["+id+"].qtyReq"];
	if(qtyObj.value!=""&&isNaN(qtyObj.value)) {
		alert("请输入数字!");
		document.forms[0].elements["orderSdDetail[" + id + "].qtyReq"].value = "";
		return;
	}
	if ((currCol=="qtyReq" || currCol=="qtyOrder") && !getValidNumInput2(event.keyCode,"")) {
		event.keyCode=0;
	}
  
	if (event.keyCode==13 ) {
		window.event.keyCode=0;
		if (currCol=="qtyReq") {
			var rows = document.getElementById('dataTable').getElementsByTagName('tr');
			/*
			for(var j=id+1;j<rows.length;j++) {
				if(rows(j).style.display==""){
					id = j-1;
					break;
				} else if(j==rows.length-1&&rows(j).style.display=="none"){
					document.getElementById("jyhce").focus();
					return;   
				}
			}
			*/
			if(id+2==rows.length){
				qtyObj.blur();
				document.getElementById("save").focus();
				return;
			} else {
				setFocus("orderSdDetail",id+1,nextCol);
				return;
			}
		}else{
			setFocus("orderSdDetail",id+1,nextCol);
		}
	}
}
//处理UP,DOWN使光标在行之间上下移动
function on_keydown(obj,id) {
	var qtyObj = document.forms[0].elements["orderSdDetail["+id+"].qtyReq"];
	if(qtyObj.value!=""&&isNaN(qtyObj.value)) {
	    alert("请输入数字!");
	    qtyObj.value = "";
	    return;
	} 

	var vname=obj.name;
	var prefix=vname.substr(0,vname.indexOf("["));
	var colname=vname.substr(vname.indexOf(".")+1);
	var rows = document.getElementById('dataTable').getElementsByTagName('tr');
	
    //向上
	if (event.keyCode==38 ) {
		window.event.keyCode=0;
        for(var j=id-1;j>=0;j--) {
        	if(rows(j).style.display==""||rows(j).style.display=="block"){
	            id = j;
	            break;
            }else if(rows(j).style.display=="none"&&j==0){
            	return;
            }
        }
      	setFocus(prefix,id,colname);
    } else if (event.keyCode==40 ) {
    	window.event.keyCode=0;
       	for(var j=id+1;j<rows.length;j++) {
            if(rows(j).style.display==""||rows(j).style.display=="block"){
	            id = j;
	            break;
	        }else if(rows(j).style.display=="none"&&j==rows.length-1){
	        	return;
	        }
       	}
    	setFocus(prefix,id,colname);
    }
}
//显示隐藏的行 id：行ID
function showHiddenRow(id) {
   var row= eval("document.all.dataRow"+id);
   if (typeof(row)!="object") return false;
   showRow(row);
   return true;
}


function qtyDemandChange(obj,id) {
    if(null!=event&&event.keyCode==0){
       event.keyCode=13;
     }
    if(isNaN(obj.value)){
       alert("请输入数字");
       document.forms[0].elements["orderSdDetail[" + id + "].qtyReq"].value = "";
       return;
    }
    if (obj.value=="") obj.value=0;

    var productIDObj= "orderSdDetail[" + id + "].productId";
    var productPriceObj= "orderSdDetail[" + id + "].price";
    var qtyDemandObj= "orderSdDetail[" + id + "].qtyReq";
    var qtyOrderdObj= "orderSdDetail[" + id + "].qtyOrder";
    var amtdObj= "orderSdDetail[" + id + "].amtOrder";
    var qty1Obj= "orderSdDetail[" + id + "].qtyOther1";   //合理定量
    var qty6Obj= "orderSdDetail[" + id + "].qtyOther6";   //剩余量
    var tag6Obj= "orderSdDetail[" + id + "].tag6";   //卷烟类型：1推荐品牌；2顺销烟；3紧俏烟

    if (document.forms[0].elements[productIDObj].value=="") {
        clearRow(eval("document.all.dataRow"+id))
        return false;
    }

    var qty1Val = document.forms[0].elements[qty1Obj].value; //合理定量
    var qty6Val = document.forms[0].elements[qty6Obj].value; //剩余量
    var atyDemandVal = document.forms[0].elements[qtyDemandObj].value; //需求量
    var tag6Val = document.forms[0].elements[tag6Obj].value; //卷烟类型
    
    if(qty1Val == "" && qty6Val == "") qty1Val = 99999;   //如果是放开品牌的话，可以随便订烟
    if(qty1Val == "") qty1Val = qty6Val;
    if(qty6Val == "") qty6Val = qty1Val;
    qty1Val=Math.min(qty1Val*1,qty6Val*1);  //取合理定量和剩余量的小值 
    
    //在需求量大于剩余量或者合理定量时 顺销品牌：大、中型客户自动生成的订单量等于合理定量乘以110%；普通客户自动生成的订单量等于合理定量乘以115%。
    if(tag6Val*1 == 2 &&　atyDemandVal*1 > qty1Val) {
		//判断是否是在投放区域中xiangcr
        if (kharea*1==1)
        {
        /*
    	switch(khdc*1) {
    		case 6:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    		case 7:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    		case 8:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;  
			case 9:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    		case 10:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    		case 11:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
			case 12:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    		case 13:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    		case 14:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
			case 15:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    		case 16:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    		case 17:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;
    	   }
		   */
		} else {
			switch(CUSTOMER_GRADE*1) {
    		case 5:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_ONE,0);
    			break;
    		case 6:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_ONE,0);
    			break;
    		case 7:
    			qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);
    			break;   			    			    			    			
        	}
		}
    }
    if(tag6Val*1!= 1&&tag6Val*1!=2&&tag6Val*1!=3&&tag6Val*1!=4)// 
    {
    	qty1Val = 9999;
    }
   
    //比较是否小于单品限量
    qty1Val = FormatNumber(Math.max(Math.min(qty1Val*1,PRODUCT_UP*1),0),0);    
    if (atyDemandVal*1 > qty1Val*1 && qty1Val != "") {
        showChaPrd(document.forms[0].elements[productIDObj].value,qty1Val*1,id);
    }
		
    var price =  document.forms[0].elements[productPriceObj].value *1;
    document.forms[0].elements[qtyOrderdObj].value = Math.min(atyDemandVal*1,qty1Val*1);
    /*********************************************************************/
    var productIDObj= "orderSdDetail[" + id + "].productId";
    var productDescObj= "orderSdDetail[" + id + "].productDesc";
    var productID =  document.forms[0].elements[productIDObj].value;
    var qtyOrderObj =  document.forms[0].elements[qtyOrderdObj];
	var deptID = document.forms[0].elements["companyId"].value;  //公司
	var productDesc = document.forms[0].elements[productDescObj].value;
	
	var getStock = 1;// 是否查询货源剩余量
	if(getStock == 1)
	{
		compareWithStock(productID,deptID,productDesc,qtyOrderObj,id);
	}
	/*********************************************************************/
    var qtyOrderd = document.forms[0].elements[qtyOrderdObj].value;
    document.forms[0].elements[amtdObj].value =  FormatNumber(qtyOrderd*1 *price,2);
    qtyOrderChange(document.forms[0].elements["orderSdDetail["+id+"].qtyOrder"],id);
}

function qtyOrderChange(obj,id)
{
    if (obj.value=="")
        return;
    var productIDObj= "orderSdDetail[" + id + "].productId";
    var productCodeObj= "orderSdDetail[" + id + "].productCode";
    var productDescObj= "orderSdDetail[" + id + "].productDesc";
    var productStatusObj= "orderSdDetail[" + id + "].productStatus";
    var productPriceObj= "orderSdDetail[" + id + "].price";
    var qtyDemandObj= "orderSdDetail[" + id + "].qtyReq";
    var qtyOrderdObj= "orderSdDetail[" + id + "].qtyOrder";
    var amtdObj= "orderSdDetail[" + id + "].amtOrder";
    var qty1Obj= "orderSdDetail[" + id + "].qtyOther1";
    
    var qty5Obj= "orderSdDetail[" + id + "].qtyOther5";
    var qty6Obj= "orderSdDetail[" + id + "].qtyOther6";

    if (document.forms[0].elements[productIDObj].value=="")
    {
        clearRow(eval("document.all.dataRow"+id))
        return false;
    }
    
    var qtyOrderd = document.forms[0].elements[qtyOrderdObj].value;
    document.forms[0].elements[qtyOrderdObj].style.fontWeight="bold";
    /*
    var objTable = document.getElementById('dataTable');
	*/

    if(obj.value>0){
    	 var font_color = "#035D47";
         document.forms[0].elements[productCodeObj].style.color=font_color;
         document.forms[0].elements[productDescObj].style.color=font_color;
         document.forms[0].elements[productPriceObj].style.color=font_color;
         document.forms[0].elements[productStatusObj].style.color=font_color;
         document.forms[0].elements[qtyDemandObj].style.color=font_color;
         document.forms[0].elements[qtyOrderdObj].style.color=font_color;
         document.forms[0].elements[amtdObj].style.color=font_color;
         
         document.forms[0].elements[qty1Obj].style.color=font_color;
         document.forms[0].elements[qty5Obj].style.color=font_color;
         document.forms[0].elements[qty6Obj].style.color=font_color;
    }else{
         document.forms[0].elements[productCodeObj].style.color="#000000";
         document.forms[0].elements[productDescObj].style.color="#000000";
         document.forms[0].elements[productStatusObj].style.color="#000000";
         document.forms[0].elements[productPriceObj].style.color="#000000";
         document.forms[0].elements[qtyDemandObj].style.color="#000000";
         document.forms[0].elements[qtyOrderdObj].style.color="#000000";
         document.forms[0].elements[amtdObj].style.color="#000000";
    }
    //var price =  document.forms[0].elements[productPriceObj].value *1;
    sumData("no",id);
}

/*
实时判断货源方法。
*/
function compareWithStock(productID,deptID,name,obj,id)
{
	var order_id = document.forms[0].elements["rowId"].value;
	var order_date = document.forms[0].elements["orderDate"].value;
	var productPriceObj= "orderSdDetail[" + id + "].price";
	var amtdObj= "orderSdDetail[" + id + "].amtOrder";
	
	$.ajax({
   		type: "POST",
   		url: ctx + "/jsp/eb/ctp/orderSdTJ/getProductStock.jsp",
   		data: "productID="+productID+"&deptID="+deptID+"&order_id="+order_id+"&order_date="+order_date,
   		success: function(remain){
     		//alert( "剩余量: " + remain );
   			if(remain*1<0){
   				remain=0;
   				art.dialog({
			  		title:'提示',
			    	content: name+'的货源量为'+remain+'条,已自动帮您更改。'
				}); 
				obj.value = remain;
				var price =  document.forms[0].elements[productPriceObj].value *1;
				document.forms[0].elements[amtdObj].value =  FormatNumber(obj.value*1*price,2);
				setStyleAfterCheckStock(id);
   			}else if(obj.value*1>remain*1)//如果大于库存量则自动将订货量改小。
     		{
     			art.dialog({
			  		title:'提示',
			    	content: name+'的货源量为'+remain+'条,已自动帮您更改。'
				}); 
				obj.value = remain;
				var price =  document.forms[0].elements[productPriceObj].value *1;
				document.forms[0].elements[amtdObj].value =  FormatNumber(obj.value*1*price,2);
				setStyleAfterCheckStock(id);
     		}
   		}
	});
	
}

/*
 检测货源之后做的操作。
*/
function setStyleAfterCheckStock(id)
{
	sumData("no",id);
}
 function Hashtable()                                       //求和
 {
            this._hash        = new Object();
            this.add        = function(key,value){
                                if(typeof(key)!="undefined"){
                                    if(this.contains(key)==false){
                                        this._hash[key]=typeof(value)=="undefined"?null:value;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            }
            this.remove        = function(key){delete this._hash[key];}
            this.count        = function(){var i=0;for(var k in this._hash){i++;} return i;}
            this.items        = function(key){return this._hash[key];}
            this.contains    = function(key){ return typeof(this._hash[key])!="undefined";}
            this.clear        = function(){for(var k in this._hash){delete this._hash[k];}}

 }

 var hashTable = new Hashtable();//用于进行增量相加

function sumData(isAll,id)
{
    sumCol("dataTable","orderSdDetail","qtyReq","qtyDemand","qtyOrder","qtyOrder","amtOrder","amtOrder","tjj","proCount",2,isAll,id);
}

function sumCol(obj,prefix,sumColName,setColName,sumColName1,setColName1,sumColName2,setColName2,setColName3,setCountName,nDec,isAll,id)
{
    var prdCodeObj="";
    var tagObj ="";
    var colname ="";
    var colname1 ="";
    var colname2 ="";
    var nRow;		// Various table stats
    var table;				// Table object
    var sumValue = 0;
    var colValue = 0;
    var sumValue1 = 0;
    var colValue1 = 0;
    var sumValue2 = 0;
    var colValue2 = 0;
    var proCount = 0;

    var sumOther = 0;//异型烟总量

    if (obj  != "")
	{
		table = eval(obj);  // Assumes that the obj is THE OBJECT
	}
	if (table == null) return;  // Check whether it's an object
	if (table.tagName != "TABLE") return;  // Check whether it's a table
	nRow = table.rows.length;// Setting the number of rows
	if (nRow < 1) return;// Should have at least 1 row

    if(isAll!="no"){
    for (var i=0; i<nRow-1; i++)
	{
      if(prefix!="")
      {
          colname = prefix+"[" + i + "]." + sumColName;
          colname1 = prefix+"[" + i + "]." + sumColName1;
          colname2 = prefix+"[" + i + "]." + sumColName2;
          prdCodeObj = prefix+"[" + i + "].productCode";

      }
      colValue = document.forms[0].elements[colname].value;
      colValue1 = document.forms[0].elements[colname1].value;
      colValue2 = document.forms[0].elements[colname2].value;
      var prdcodeVal =  document.forms[0].elements[prdCodeObj].value;
      if (prdcodeVal == "")
          break;

          if (colValue == "") { colValue =0;}
          if (colValue1 == "") { colValue1 =0;}
          if (colValue2 == "") { colValue2 =0;}
 //         需求量不为0 加入hashtable
          if(colValue!=""){
             hashTable.add(prdcodeVal,colValue+"#"+colValue1+"#"+colValue2) ; //名prdcode 值 qtyDemand
          }
          sumValue = parseFloat(sumValue) + parseFloat(colValue);
          sumValue1 = parseFloat(sumValue1) + parseFloat(colValue1);
          sumValue2 = parseFloat(sumValue2) + parseFloat(colValue2);
          if(colValue1>0){
          proCount ++;
          }
     //异型烟求和
//        var tagObj= "orderDetail[" + i + "].operator";
//        if(document.forms[0].elements[tagObj].value=="1"){
//            sumOther = sumOther+parseFloat(colValue1);
//        }
    }
       //   将页面上已订商品的总和放入hashTable
         hashTable.add("sumValue",sumValue);
         hashTable.add("sumValue1",sumValue1);
         hashTable.add("sumValue2",sumValue2);
         hashTable.add("sumOther",sumOther);

   }else{     //处理页面记录的新增或者修改
      if(prefix!="")
      {
          colname = prefix+"[" + id + "]." + sumColName;
          colname1 = prefix+"[" + id + "]." + sumColName1;
          colname2 = prefix+"[" + id + "]." + sumColName2;
          prdCodeObj = prefix+"[" + id + "].productCode";
//          tagObj= prefix+"[" + id + "].operator";
      }
      colValue = document.forms[0].elements[colname].value;
      colValue1 = document.forms[0].elements[colname1].value;
      colValue2 = document.forms[0].elements[colname2].value;
       var prdcodeVal =  document.forms[0].elements[prdCodeObj].value;
      if(hashTable.contains(prdcodeVal)){
         var valueDesc =  hashTable.items(prdcodeVal);
         sumValue = parseFloat(hashTable.items("sumValue"))+parseFloat(colValue)-parseFloat(valueDesc.split("#")[0]);
         sumValue1 = parseFloat(hashTable.items("sumValue1"))+parseFloat(colValue1)-parseFloat(valueDesc.split("#")[1]);
         sumValue2 = parseFloat(hashTable.items("sumValue2"))+parseFloat(colValue2)-parseFloat(valueDesc.split("#")[2]);

         hashTable.remove("sumValue");
         hashTable.add("sumValue",sumValue);
         hashTable.remove("sumValue1");
         hashTable.add("sumValue1",sumValue1);
         hashTable.remove("sumValue2");
         hashTable.add("sumValue2",sumValue2);
         hashTable.remove(prdcodeVal);
          if(colValue!="0"&&colValue!=""){
            hashTable.add(prdcodeVal,colValue+"#"+colValue1+"#"+colValue2);
          }

//        if(document.forms[0].elements[tagObj].value=="1"){
//            sumOther = parseFloat(hashTable.items("sumOther"))+parseFloat(colValue1)-parseFloat(valueDesc.split("#")[1]);
//            hashTable.remove("sumOther");
//            hashTable.add("sumOther",sumOther);
//        }
      }else{
         hashTable.add(prdcodeVal,colValue+"#"+colValue1+"#"+colValue2);
         sumValue = parseFloat(hashTable.items("sumValue"))+parseFloat(colValue);
         sumValue1 = parseFloat(hashTable.items("sumValue1"))+parseFloat(colValue1);
         sumValue2 = parseFloat(hashTable.items("sumValue2"))+parseFloat(colValue2);
         hashTable.remove("sumValue");
         hashTable.add("sumValue",sumValue);
         hashTable.remove("sumValue1");
         hashTable.add("sumValue1",sumValue1);
         hashTable.remove("sumValue2");
         hashTable.add("sumValue2",sumValue2);
//         if(document.forms[0].elements[tagObj].value=="1"){
//            sumOther = parseFloat(hashTable.items("sumOther"))+parseFloat(colValue1);
//            hashTable.remove("sumOther");
//            hashTable.add("sumOther",sumOther);
//        }
      }
    }
    document.forms[0].elements[setColName].value =  FormatNumber(parseFloat(hashTable.items("sumValue")),nDec);
    document.forms[0].elements[setColName1].value = FormatNumber(parseFloat(hashTable.items("sumValue1")),nDec);
    document.forms[0].elements[setColName2].value = FormatNumber(parseFloat(hashTable.items("sumValue2")),nDec);
	document.forms[0].elements[setColName3].value = FormatNumber(isNaN(parseFloat(hashTable.items("sumValue2"))/parseFloat(hashTable.items("sumValue1")))==true?0:parseFloat(hashTable.items("sumValue2"))/parseFloat(hashTable.items("sumValue1")),nDec);
    document.forms[0].elements[setCountName].value =  hashTable.count()-4;
//    document.all.yxy.innerHTML=FormatNumber(parseFloat(hashTable.items("sumOther")),nDec);
    bankProcess(parseFloat(sumValue2));
}


//计算剩余金额
function bankProcess(amount){
         var jsfs =  document.forms[0].jsfs.value;
         if(jsfs.indexOf("银行")==-1){
             document.getElementById("kkqk").innerHTML=FormatNumber(amount,2);
         }else{
              var bankStatus = document.forms[0].bankStatus.value;
              if(bankStatus=="1"){       //银行故障
                  document.getElementById("kkqk").innerHTML=FormatNumber(-1*amount,2);
              }else{
                  document.getElementById("kkqk").innerHTML=FormatNumber(parseFloat(document.all.syje.value)-amount,2);
              }
         }
}

//检查日程
function checkCustomerPlan()
{		
        var ret = document.forms[0].ret.value;
        var orderDate = document.forms[0].orderDate.value;
        if (trimNC(ret) =="1"||trimNC(ret)=="0")
        {
            var msgCal = document.forms[0].msgCal.value;
            var dateArr = orderDate.split("-");
            var html = "<font color='#00559C' size='2px'>您的本次订货截止时间: </font><font color='red' size='2px'>"+dateArr[0]+"年"+dateArr[1]+"月"+dateArr[2]+"日  "+orderCloseTime+"</font>&nbsp;&nbsp;&nbsp;";
            html += "<font color='#00559C' size='2px'>本次订单结算日: </font><font color='red' size='2px'>"+dateArr[0]+"年"+dateArr[1]+"月"+dateArr[2]+"日</font>";
            document.getElementById("dateLeft").innerHTML= html;
        }else{
            disableAll();
        }
}

//求科学定量
  function kxdl()
  {
      var kxdlStr = document.forms[0].returnStrQty.value;
      if(kxdlStr.split(":")[0]=="OK"){
         var str = new Array();
         str = kxdlStr.split(":")[1].split("|");
         var mm1=str[1].indexOf("[");
         var nn1=str[1].indexOf("]");
         
         var mm2=str[2].indexOf("[");
         var nn2=str[2].indexOf("]");
         
         var mm3=str[3].indexOf("[");
         var nn3=str[3].indexOf("]");

         var mm4=str[4].indexOf("[");
         var nn4=str[4].indexOf("]");
                  
         MONTH_PER_ORDER = str[2].substring(mm2+1,nn2);
         MONTH_REMAIN = str[3].substring(mm3+1,nn3);
         PRODUCT_UP   = str[4].substring(mm4+1,nn4);
         //"<font color='#00559C' size='2px'>"+str[1].substring(0,mm1+1)+"</font><font color='red' size='2px'>"+str[1].substring(mm1+1,nn1)+"</font><font color='#00559C' size='2px'>"+str[1].substring(nn1,str[1].length)+"</font>" +
         document.all.monthlyQuota.innerHTML="<font color='#00559C' size='2px'>"+" 次供货限量["+"</font><font color='green' size='2px'>"+str[2].substring(mm2+1,nn2)+"</font><font color='#00559C' size='2px'>"+str[2].substring(nn2,str[2].length)+"</font>" +
         		"<font color='#00559C' size='2px'>"+" 月供货剩余限量["+"</font><font color='green' size='2px'>"+str[3].substring(mm3+1,nn3)+"</font><font color='#00559C' size='2px'>"+str[3].substring(nn3,str[3].length)+"</font>" +
         		"<font color='#00559C' size='2px'>"+" 单品供货限量["+"</font><font color='green' size='2px'>"+str[4].substring(mm4+1,nn4)+"</font><font color='#00559C' size='2px'>"+str[4].substring(nn4,str[4].length)+"</font>";
      }
  }


//判断是否是电子结算，并根据判断结果做相应显示
function balanceDisplay()
{
	document.getElementById("dataRight").style.display="none";//默认不显示银行余额按钮
    var bankStatus = document.forms[0].bankStatus.value;
    if(bankStatus=="1"){       //银行故障
        document.getElementById("jsfsMc").innerHTML="";
        document.getElementById("syjeMc").value="银行故障";
    }else if(bankStatus=="0"){
        var jsfs =  document.forms[0].jsfs.value;
        if(trim(jsfs)=="银行"){
        	document.getElementById("dataRight").style.display="";//显示银行余额
         	document.getElementById("syjeMc").value=FormatNumber(document.forms[0].syje.value,2);
        }else{
         document.getElementById("jsfsMc").innerHTML="结算方式";
         document.getElementById("syjeMc").value="现金";
        }
    }
}

//界面disable
function disableAll(){
try{
   document.getElementById("dataTable").disabled="true";
   document.getElementById("save").disabled="true";
   document.getElementById("fastOrder").disabled="true"; 
   for(var i=0;i<document.getElementById("dataTable").rows.length;i++){
       var demObj = document.forms[0].elements("orderDetail["+i+"].qtyDemand");
       if(demObj!=null) demObj.readOnly = true;
   }
    return  ;
   }catch(e){}
}




    //鼠标触发显示图片
 function onMouseoverBackgroundColor()
  {
      var name = ObjT.name;
      var code = name.split(".")[0]+".productCode";
      var supplier=name.split(".")[0]+".productStatus"; //厂家
      var retailprice=name.split(".")[0]+".qtyOther2"; //零售指导价
      var tarscalar=name.split(".")[0]+".tag3"; //焦油含量
      var tradeprice=name.split(".")[0]+".price"; // 批发价

      var productcode = document.forms[0].elements(code).value;
      var supplierName=document.forms[0].elements(supplier).value;      //厂家
      var retailPriceVal=document.forms[0].elements(retailprice).value; //零售指导价
      retailPriceVal = retailPriceVal.replace(",","");//去掉逗号
      var tarScalarVal=FormatNumber(1*document.forms[0].elements(tarscalar).value,1);     //焦油含量
      var tradePriceVal=document.forms[0].elements(tradeprice).value; // 批发价
      var rate=0;
      if(1*retailPriceVal!=0){
      	rate=FormatNumber((1*retailPriceVal-1*tradePriceVal)/retailPriceVal *100,2)  ;//毛利率
      }
      if(""==trim(productcode)||null==productcode) return;
      var strRet = "";
      var boRetIsOK="0";
		//STYLE="background-color:transparent;"
//      if(supplierName.length>13){
//      	supplierName=supplierName.substring(0,11)+'…';
//      }
      var strFrame="";
      strFrame += '<body  style="background-color:#ffffff; >' +
      		      '   <div  height="100%" width="100%" style="OVERFLOW-Y:hidden;OVERFLOW-X:hidden;border:1px #00559C solid;"   onselectstart="return false">';
      strFrame += '<table background='+ctx+'/images/bg_red.gif" cellsapcing="0" height="100%" width="100%" cellspadding="0" border="0" >';
      strFrame += '<tr>' ;
      strFrame += '<td align="center" vAlign="top"> ' +
      		      '  <table>' +
      		      '   <tr>' ;
      strFrame += '     <td align="center"><font size="2"><img src='+ctx+'/jsp/eb/ctp/order/online/getPicture.jsp?productcode='+productcode+' " alt="" width="100px" height="151px"></font></td>';
      strFrame += '   </tr> ' 
      strFrame += '    <tr><td align="left"><font color="#00559C" size="2">零售指导价：'+parseInt(retailPriceVal)+'元/条</font></td></tr>' ;
      strFrame += '    <tr><td align="left"><font  color="#00559C" size="2">焦油含量：'+parseInt(tarScalarVal)+'毫克</font></td></tr>' ;
      strFrame += '    <tr><td align="left"><font  color="#00559C" size="2">毛利率：'+rate+'%</font></td></tr>' ;
      strFrame += '    <tr><td align="left"><font  color="#00559C" size="2">厂家：'+supplierName+'</font></td></tr>' ;
      		      '  </table>' +
      		      '<td>' ;
      strFrame += '</tr>';
      strFrame += '</table>';
      strFrame += '</div></body>';

      document.frames("flowdiv").document.writeln(strFrame);
      document.frames("flowdiv").document.close();
      showList(ObjT);
  }
  
  function onMouseTime(obj){
       timer = 1;
       ObjT = obj;
      setTimeout('compare()',400);
  }
  function compare()
  {
      if(timer==1){
      onMouseoverBackgroundColor()
     }
  }
  
    function showList(Obj)
  {
      closeFrame();
      var EleFrame = document.getElementById("flowdiv").style;
      var th = Obj;

      var ttop = Obj.offsetTop;

      //TT控件的定位点高
      var thei = Obj.clientHeight;
      //TT控件本身的高
      var tleft = Obj.offsetLeft;
      //TT控件的定位点宽
      var ttyp = Obj.type;

      //TT控件的类型
      while (Obj = Obj.offsetParent) {
  //        ttop += Obj.offsetTop;
          tleft += Obj.offsetLeft;
      }
  //    var mouseleft = event.clientX;
  //    var mousetop = event.clientY;
      EleFrame.top = 40;
      EleFrame.left = tleft+200;
//      EleFrame.height =450;
      haodsObject = th;

      EleFrame.display = '';
  //    event.returnValue = false;
  }


  function showProductList(Obj)
  {
      closeFrame();
      var EleFrame = document.getElementById("flowdiv").style;
      var th = Obj;

      var ttop = Obj.offsetTop;

      //TT控件的定位点高
      var thei = Obj.clientHeight;
      //TT控件本身的高
      var tleft = Obj.offsetLeft;
      //TT控件的定位点宽
      var ttyp = Obj.type;

      //TT控件的类型
      while (Obj = Obj.offsetParent) {
          tleft += Obj.offsetLeft;
      }
      EleFrame.top = 80;
      EleFrame.left = tleft+170;
      EleFrame.height =300;
      EleFrame.width =280;     
      haodsObject = th;
      EleFrame.display = '';
  }


  function closeFrame() //这个层的关闭
  {
          timer = 0;
          ObjT = null;
          var tempObj = document.getElementById("flowdiv");
          if (tempObj != null)
              tempObj.style.display = "none";
  }

 function closeDIV(obj,id)
{
    if (flag==1)
    {
          closeFrame();
          flag=0;
    }
}

 var searchType = "product";
 var searchCondition = "";

 function checkRadio(obj)  //模糊搜索类型
 {
    searchType = obj;
 }

function setTimer(){
    if("0"==timer){
        timer="1";
        setTimeout('changeTimer()',2000);
        return true;
    }else{
        return false;
    }
}

function changeTimer(){
   timer = "0";
}

function on_enterkeypress(http,obj){
    if (event.keyCode==13 )
	  {
          window.event.keyCode=0;
          search();

      }
}

 function search()           //搜索
 {
    searchCondition = trim(document.all.searchCondition.value);
    if(searchType==""){
        alert("请选择查询类型!");
        return;
    }
    var Obj = eval("document.all.searchCondition");
    showRowChangeQuery(Obj,searchType);
 }

  function searchByQuJian(val,searchType)           //搜索
 {
    var Obj = eval("document.all.searchQuJianCondition");
    Obj.value= val;
    showRowChangeQuery(Obj,searchType);
 }

  function searchByCollection(){
    var obj = new Object();
    obj.value = "1";
    showRowChangeQuery(obj,"collection");
  }

 function searchByLastOrder(){
    var obj = new Object();
    obj.value = "1";
    showRowChangeQuery(obj,"lastOrder");
  }

 function searchByGy(val){
     var Obj = eval("document.all.searchGyCondition");
     Obj.value= val;
     showRowChangeQuery(Obj,"maker");
 }

function showRowChangeQuery(obj,searchType) {
    if(document.all.save.disabled==true) return;
    var showTypeVal = document.forms[0].elements["showTypeReq"].value;
    if (obj.value!="") {
        if(searchType=="product"){
             if(showTypeVal=="0"){
              hideRowFilterQuery("dataTable","orderSdDetail","productDesc",obj.value); // 按照商品名称模糊查询，
              changeSelectRowsBgColor();
             }else if(showTypeVal=="1"&&getStatus()){
              if(!setTimer()){return};
              searchByConInPrdStore("","",obj.value,""); //购物车中搜索
             }
        }
        if(searchType=="maker"){
            if(showTypeVal=="0"){
              hideRowFilterQuery("dataTable","orderSdDetail","productStatus",obj.value); // 按照产地模糊查询，
              changeSelectRowsBgColor();
            }else if(showTypeVal=="1"&&getStatus()){
              if(!setTimer()){return};  
              searchByConInPrdStore("","","",obj.value); //购物车中搜索
            }
        }
        if(searchType=="price"||searchType=="tag3"){
             if(showTypeVal=="0"){
                hideRowFilterQueryByQuJian("dataTable","orderSdDetail",searchType,obj.value);//按价格区间或者焦油搜索
                changeSelectRowsBgColor();
             }else if(showTypeVal=="1"&&getStatus()){
              if(!setTimer()){return};
                if(searchType=="price"){
                 searchByConInPrdStore(obj.value,"","","");//购物车中搜索
                }else{
                 searchByConInPrdStore("",obj.value,"","");//购物车中搜索
                }
             }
        }
        if(searchType=="collection"){
          if(showTypeVal=="0"){
              hideRowFilterQuery("dataTable","orderSdDetail","tag4",obj.value); // 按照产地模糊查询，
              changeSelectRowsBgColor();
            }else if(showTypeVal=="1"&&getStatus()){
              if(!setTimer()){return};
              searchByConInPrdStore("","","","",obj.value); //购物车中搜索
            }
        }
        if(searchType=="lastOrder"){
          if(showTypeVal=="0"){
              hideRowFilterQuery("dataTable","orderSdDetail","tag5",obj.value); // 上次订单
              changeSelectRowsBgColor();
            }else if(showTypeVal=="1"&&getStatus()){
              if(!setTimer()){return};
              searchByConInPrdStore("","","","","",obj.value); //购物车中搜索
            }
        }
    } else {
        if(showTypeVal=="0"){
         hideRowFilterQuery("dataTable","orderSdDetail","productDesc","all");
          changeSelectRowsBgColor();   
        }else if(showTypeVal=="1"&&getStatus()){
         searchByConInPrdStore("","","","","");
        }
    }

}

//购物车搜索
function searchByConInPrdStore(pricCon,jyCon,prdCon,facCon,collection,lastOrder){
     var priceB = "";
     var priceE = "";
     var jyConB = "";
     var jyConE = "";
     var productCon = "";
     var factoryCon = "";
     if(""!=pricCon){
         priceB = pricCon.split(":")[0];
         priceE = pricCon.split(":")[1];
     }else if(""!=jyCon){
         jyConB = jyCon.split(":")[0];
         jyConE = jyCon.split(":")[1];
     }else if(""!=prdCon){
         productCon = prdCon;
     }else if(""!=facCon){
         factoryCon = facCon;
     }
     var doWhat = document.forms[0].elements["doWhat"].value;
     document.frames("picFrame").location = ctx+"/jsp/eb/ctp/orderSd/productStore.jsp?priceB="+priceB+"&priceE="+priceE+"&jyConB="+jyConB+"&jyConE="+jyConE+"&productCon="+productCon+"&factoryCon="+factoryCon+"&collection="+collection+"&lastOrder="+lastOrder+"&doWhat="+doWhat;
}

function hideRowFilterQuery(obj,prefix,filterColName,filterValue)
{
   var filter_ColName="";
   var nRow;		// Various table stats
   var hide_Row;
   var table;				// Table object
   var filter_ColValue=0;
	if (obj  != "")
	{
		table = eval(obj);  // Assumes that the obj is THE OBJECT
	}
	if (table == null) return;  // Check whether it's an object
	if (table.tagName != "TABLE") return;  // Check whether it's a table
	nRow = table.rows.length;// Setting the number of rows
	if (nRow < 1) return;// Should have at least 1 row
	if (prefix=="") return;
	for (var i=0; i<nRow; i++)
	{
	  hide_Row=table.rows(i);
      filter_ColValue=document.forms[0].elements[prefix+"["+i+"]."+filterColName].value;
      if(filterValue=="all"){
           showRow(hide_Row);
      }else if(filter_ColValue.indexOf(filterValue)!=-1){
                       showRow(hide_Row);
                 }else{
                      hideRow(hide_Row);
                }
    }
}

function changeSelectRowsBgColor(){
   var hide_Row;
   var table = document.getElementById("dataTable"); 
   var nRow = table.rows.length;
   if (nRow < 1) return;
   var j=0;
   for (var i=0; i<nRow; i++){
      hide_Row=table.rows(i);
      if('none'!=hide_Row.style.display){
          if(j%2==0&&hide_Row.className!="alter"){
            hide_Row.className="alter";
            var productDescObj = document.forms[0].elements["orderSdDetail["+i+"].productDesc"];
            var productMakerObj = document.forms[0].elements["orderSdDetail["+i+"].productStatus"];
            var productPriceObj = document.forms[0].elements["orderSdDetail["+i+"].price"];
            var productQtyReq = document.forms[0].elements["orderSdDetail["+i+"].qtyReq"];
            var productQtyOrder = document.forms[0].elements["orderSdDetail["+i+"].qtyOrder"];
            var productAmtOrder = document.forms[0].elements["orderSdDetail["+i+"].amtOrder"];
            productDescObj.className = "editTextNoBorder1";
            productMakerObj.className = "editTextNoBorder1";
            productPriceObj.className = "editTextNoBorder1";
            productQtyReq.className = "editTextNoBorder1";
            productQtyOrder.className = "editTextNoBorder1";
            productAmtOrder.className = "editTextNoBorder1";
          }else if(j%2!=0&&hide_Row.className!="alter1"){
            hide_Row.className="alter1";
            var productDescObj = document.forms[0].elements["orderSdDetail["+i+"].productDesc"];
            var productMakerObj = document.forms[0].elements["orderSdDetail["+i+"].productStatus"];
            var productPriceObj = document.forms[0].elements["orderSdDetail["+i+"].price"];
            var productQtyReq = document.forms[0].elements["orderSdDetail["+i+"].qtyReq"];
            var productQtyOrder = document.forms[0].elements["orderSdDetail["+i+"].qtyOrder"];
            var productAmtOrder = document.forms[0].elements["orderSdDetail["+i+"].amtOrder"];
            productDescObj.className = "editTextNoBorder";
            productMakerObj.className = "editTextNoBorder";
            productPriceObj.className = "editTextNoBorder";
            productQtyReq.className = "editTextNoBorder";
            productQtyOrder.className = "editTextNoBorder";
            productAmtOrder.className = "editTextNoBorder";
          }
          j++;
      } 
   }
}

function  hideRowFilterQueryByQuJian(obj,prefix,filterColName,filterValue){
   var filter_ColName="";
   var nRow;
   var hide_Row;
   var table;
   var filter_ColValue=0;
	if (obj  != "")
	{
		table = eval(obj);
	}
	if (table == null) return;
	if (table.tagName != "TABLE") return;
	nRow = table.rows.length;
	if (nRow < 1) return;
	if (prefix=="") return;

    var filterValueB = filterValue.split(":")[0];
    var filterValueE = filterValue.split(":")[1];
	for (var i=0; i<nRow; i++)
	{
	  hide_Row=table.rows(i);
      filter_ColValue=document.forms[0].elements[prefix+"["+i+"]."+filterColName].value;
      if(filterValue=="all"){
           showRow(hide_Row);
      }else if(parseFloat(filter_ColValue)>=parseFloat(filterValueB)&&parseFloat(filter_ColValue)<=parseFloat(filterValueE)){
                       showRow(hide_Row);
                 }else{
                       hideRow(hide_Row);
                 }
    }
}

function changeBgColor(obj)
{
    obj.bgColor="#FF8F02";   //橙色
}

//恢复背景为白色
function recoverBgColorW(obj)
{
   obj.bgColor="#FFFFFF";
}

//切换显示类型 列表式 购物车式
function changeType(obj)
{
  var showTypeVal = document.forms[0].elements["showTypeReq"].value;
  var ret = document.forms[0].ret.value;
  if(showTypeVal=="1"&&getStatus()){
     obj.value='购物车';
     document.forms[0].elements["showTypeReq"].value = "0";
     document.getElementById("titleTab").style.display='block';
     document.getElementById("gridTab").style.display='block';
     document.getElementById("prdStore").style.display='none';
     document.frames("picFrame").location = "about:blank";
  }else if(showTypeVal=="0"&&getStatus()){
     obj.value='列表订单';;
     document.forms[0].elements["showTypeReq"].value = "1";
     document.getElementById("titleTab").style.display='none';
     document.getElementById("gridTab").style.display='none';
     document.getElementById("prdStore").style.display='block';
     document.frames("picFrame").location = ctx+"/jsp/eb/ctp/orderSd/productStore.jsp";
  }
}

function initStore(objType){
    var ret = document.forms[0].ret.value;
    if(document.forms[0].elements["showTypeReq"].value=="1"&&(trimNC(ret) =="1"||trimNC(ret)=="0")){
        document.frames("picFrame").location = ctx+"/jsp/eb/ctp/orderSd/productStore.jsp";
    }
}

function getStatus(){
   var ret = document.forms[0].ret.value;
   if(trimNC(ret) =="1"||trimNC(ret)=="0"){
       return true;
   }else{
       return false;
   }
}

function searchProduct(productID){
      var showTypeVal = document.forms[0].elements["showTypeReq"].value;
      if("1"==showTypeVal){
         closeFrame();
         return; 
      }
      for(var i=0;i<document.getElementById("dataTable").rows.length;i++){
          if(document.forms[0].elements["orderSdDetail["+i+"].productId"].value==productID){
                 hide_Row=document.getElementById("dataTable").rows(i);
                 showRow(hide_Row);
                 document.forms[0].elements["orderSdDetail["+i+"].qtyReq"].focus();
                 document.forms[0].elements["orderSdDetail["+i+"].qtyReq"].select();
                 closeFrame();
                 return;
          }
     }
      alert("此品牌不在列表中!");
}

  var floatDiv;




	// 隐藏浮动DIV
	function hiddenDiv()
	{
		if( floatDiv != null && floatDiv.style.display=="block") {
			floatDiv.style.display="none";
		}
	}

	// 保持浮动DIV为显示状态
	function keeDiv(obj){
		if( floatDiv != null && floatDiv.style.display=="none") {
			floatDiv.style.display="block";
		}
    }
    
function newPrdRecord(){
	var features = 'dialogWidth:800px;dialogHeight:500px;directories:no;localtion:no;menubar:no;status=no;toolbar=no;scrollbars:yes;Resizeable=no';
  	var url = ctx+"/ctp/orderSdTJ/newPrdTJAddEditIni.do?isNewPrd=1";
  	var fieldResult =window.showModalDialog(url,'',features);
  	
  	var tableRowCount=document.getElementById('dataTable').rows.length;  	
  	if(typeof(fieldResult)!="undefined"){
  		var lastRow=false;
  		for(var i=0;i<fieldResult.length;i++){
  			var flag=true;
  			for(var k=0;k<tableRowCount;k++){
  				var productid=document.getElementById("orderSdDetail["+k+"].productId").value;
  				if(productid==fieldResult[i].productId){		  		
    				var productObj= "orderSdDetail[" + k + "].productDesc";
         			if(document.forms[0].elements[productObj].style.color!="red"){
         				 document.forms[0].elements["orderSdDetail[" + k + "].productDesc"].style.color="blue";
				         document.forms[0].elements["orderSdDetail[" + k + "].price"].style.color="blue";
				         document.forms[0].elements["orderSdDetail[" + k + "].qtyOther5"].style.color="blue";
				         document.forms[0].elements["orderSdDetail[" + k + "].qtyOther6"].style.color="blue";
				         document.forms[0].elements["orderSdDetail[" + k + "].qtyOther1"].style.color="blue";
				         document.forms[0].elements["orderSdDetail[" + k + "].qtyReq"].style.color="blue";
				         document.forms[0].elements["orderSdDetail[" + k + "].qtyOrder"].style.color="blue";				         
				         document.forms[0].elements["orderSdDetail[" + k + "].amtOrder"].style.color="blue";
         			}
         			flag=false;
         			break;
  				}
  			}
			if( flag==true){
  				insertRow(fieldResult[i]);
  				lastRow=true;
  			} 				
  		}
  		if(fieldResult.length>0 && lastRow==true){
  			document.getElementById("orderSdDetail["+(1*document.getElementById('dataTable').rows.length-1)+"].qtyReq").focus();
  		}
  	} 	
}

/**
 * 插入一行记录
 * @param {} productInfo
 */
function insertRow(productInfo){
        var detailTable =  document.getElementById('dataTable');
        var length=detailTable.rows.length;
        var newRow=detailTable.insertRow(detailTable.rows.length);        //新建表格一行
        var color="blue";		
		newRow.id="dataRow"+length;
		if(length%2==0){
			newRow.className="alter";
		}else{
			newRow.className="alter1";
		}		
		newRow.height="32px";
	    newRow.style.display="block";
        var c1=newRow.insertCell(0);
        c1.width="25%";
        c1.align="left";
        // rowId  productId  productCode  baseunit qtyUnit  productStatus qtyOther2 tag1 tag2 tag3 tag4 tag5
        c1.innerHTML=
        "<input type='text' onmouseout='closeFrame()' onclick='onMouseTime(this)' style='cursor:pointer;width:99%;color:"+color+";' name='orderSdDetail["+length+"].productDesc' size='22'  readonly='true' class='editTextNoBorder' value="+productInfo.productDesc+" />"+
        "<input type='hidden'  name='orderSdDetail["+length+"].rowId' value="+productInfo.productDesc+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].productId' value="+productInfo.productId+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].productCode' value="+productInfo.productCode+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].baseunit' value="+productInfo.baseunit+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].qtyUnit' value="+productInfo.qtyUnit+" >"+     
        "<input type='hidden'  name='orderSdDetail["+length+"].productStatus' value="+productInfo.productStatus+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].qtyOther2' value="+productInfo.qtyOther2+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].tag1' value="+productInfo.tag1+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].tag2' value="+productInfo.tag2+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].tag3' value="+productInfo.tag3+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].tag4' value="+productInfo.tag4+" >"+
        "<input type='hidden'  name='orderSdDetail["+length+"].tag5' value="+productInfo.tag5+" >";
                
        var c2=newRow.insertCell(1);
        c2.align="right";
        c2.width="11%";
        c2.innerHTML="<input type='text' name='orderSdDetail["+length+"].price' size='6'  class='editTextNoBorder'  style='text-align:right;color:"+color+";' readonly='true' value="+productInfo.price+">";
        
        var c3=newRow.insertCell(2);
        c3.align="right";
        c3.width="11%";
        c3.innerHTML="<input  type='text'  name='orderSdDetail["+length+"].qtyOther5' size='6' class='editTextNoBorder'  style='text-align:right;color:"+color+"' readonly='true' value="+productInfo.qtyOther5+">";
        
        var c4=newRow.insertCell(3);
        c4.align="right";
        c4.width="11%";
        c4.innerHTML="<input type='text'  name='orderSdDetail["+length+"].qtyOther6' size='6' class='editTextNoBorder'  style='text-align:right;color:"+color+"' readonly='true' value="+productInfo.qtyOther6+">";
        
        var  c5=newRow.insertCell(4);
        c5.align="right";
        c5.width="11%";
        c5.innerHTML= "<input type='text'  name='orderSdDetail["+length+"].qtyOther1' size='6' class='editTextNoBorder'  style='text-align:right;color:"+color+"' readonly='true' value="+productInfo.qtyOther1+">";

        var c6=newRow.insertCell(5);
        c6.align="right";
        c6.width="11%";
        c6.innerHTML="<input type='text' name='orderSdDetail["+length+"].qtyReq' size='6' onchange='qtyDemandChange(this," + length + ")'  class='editTextNoBorder' onkeypress='on_keypress(http," + length + ",\"qtyReq\",\"qtyReq\")' onkeydown='on_keydown(this," + length + ")' style='text-align:center;width:98%'  >";

        var  c7=newRow.insertCell(6);
        c7.align="right";
        c7.width="10%";
        c7.innerHTML="<input type='text' name='orderSdDetail["+length+"].qtyOrder' size='6'  readonly='true'  class='editTextNoBorder'  style='text-align:center;width:98%' >";
        
        var c8=newRow.insertCell(7);
        c8.align="right";
        c8.width="10%";
        c8.innerHTML="<input type='text' name='orderSdDetail["+length+"].amtOrder' size='12' readonly='true' class='editTextNoBorder' style='text-align:right;color:"+color+";' >";
}
/*
*查询余额方法。
*/
function queryBalance()
{
	art.dialog({
			  		title:'余额查询',
			    	content: '<iframe width="480px" height="100%"  frameborder="0" scrolling="no" vspace="0" hspace="0" src="'+ctx+'/eb/ctp/orderTrace/bankPayCon.do" ></iframe>'
	}); 
}

Date.prototype.Format = function(fmt)   
{ //author: meizz    
  var o = {   
    "M+" : this.getMonth()+1,                 //月份    
    "d+" : this.getDate(),                    //日    
    "h+" : this.getHours(),                   //小时    
    "m+" : this.getMinutes(),                 //分    
    "s+" : this.getSeconds(),                 //秒    
    "q+" : Math.floor((this.getMonth()+3)/3), //季度    
    "S"  : this.getMilliseconds()             //毫秒    
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  
function getServerTime(){  
    var xmlHttp = false;  
    try {  
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
    } catch (e) {  
      try {  
         xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
      } catch (e2) {  
         xmlHttp = false;  
      }  
    }  
     
    if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {  
      xmlHttp = new XMLHttpRequest();  
    }  
     
    xmlHttp.open("GET", window.location.href.toString(), false);  
    xmlHttp.setRequestHeader("Range", "bytes=-1");  
    xmlHttp.send(null);  
     
    var severtime=new Date(xmlHttp.getResponseHeader("Date"));  
    return severtime  
}  


function checkValidTime(){
	var deptID = document.forms[0].elements["companyId"].value;  //公司
	$.ajax({
   		type: "POST",
   		url: ctx + "/jsp/eb/ctp/orderSdTJ/getOrderParameter.jsp",
   		data: "deptID="+deptID,
   		success: function(isStop){
   			if(isStop==1){
   				alert("当前正在分配货源,请稍后再订货！");
   				return;
   			}else{
   				if(orderRowId!="0"){
   				   var timenow=getServerTime().Format("yyyy-MM-dd hh:mm:ss");
   				   var current_date =timenow;
   				    var beginTime = document.all.createdTime.value==""?current_date:document.all.createdTime.value;
   				    var endTime = current_date;
   				    var beginTimes = beginTime.substring(0, 10).split('-');
   				    var endTimes = endTime.substring(0, 10).split('-');
   				    if (document.all.createdTime.value=="")
   				        document.all.createdTime.value=current_date;	        
   				    beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
   				    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
   				   var intDiff =  valid_time -(Date.parse(endTime) - Date.parse(beginTime)) /1000;
   				    if(intDiff<0){
   				    	document.all.save.disabled=true;
   				    	document.all.save.src=ctx+"/images/order_disabled.gif";
   				   	    document.all.save.alt="订单修改时间已过";
   				   	    alert("订单修改时间已过！");
   				   	    return;
   				    }else{
   					 document.all.save.disabled=true;
   		    	    var totNum = FormatNumber(parseFloat(hashTable.items("sumValue1")),2);
   		    	    if( is_five ="0"&&(totNum%5)!=0) {
   		    	        if( is_five =="1"){
   		    	            if(!confirm("交易总量为 "+totNum+" 条,不是5的倍数,确定是否要提交?")){
   		    	              document.all.save.disabled=false ;
   		    	              return;
   		    	            }
   		    	        }else if( is_five =="2"){
   		    	            alert("非异形烟交易总量为"+totNum+",不是5的倍数!");
   		    	            document.all.save.disabled=false ;
   		    	            return;
   		    	        }
   		    	    }
   		    	    if(totNum < 1) {
   		    	    	alert("亲！您还没订货呢，快选择您要的品牌！");
   		    	    	document.all.save.disabled=false ;
   		    	    	return false;
   		    	    }    
   		    	    //剩余量+已订货量（未订货时为0）
   		    	    if(totNum>MONTH_REMAIN*1+qtyOrder*1) {
   		    	    	alert("交易总量为 "+totNum+" 条,大于当月剩余量"+(MONTH_REMAIN*1+qtyOrder*1)+"条，请调整！");
   		    	    	document.all.save.disabled=false ;
   		    	    	return false;
   		    	    }

   		    	    if(totNum>MONTH_PER_ORDER*1) {
   		    	    	alert("交易总量为 "+totNum+" 条,大于次供货量"+MONTH_PER_ORDER+"条，请调整！");
   		    	    	document.all.save.disabled=false ;
   		    	    	return false;
   		    	    }
   		    	        
   		    	    if (confirm("提交以后将生成正式订单，确定是否要提交?")) {
   		    	       document.forms[0].action=ctx+"/ctp/orderSdTJ/orderSdTJAddEdit.do";
   		    	       showProcessMsg("提交中，请稍后……",false,true,true);
   		    		   document.forms[0].submit();
   		    	    }else{
   		    	       document.all.save.disabled=false ;
   		    	    }
   		    	
   				    }
   				}else{
   				 document.all.save.disabled=true;
 	    	    var totNum = FormatNumber(parseFloat(hashTable.items("sumValue1")),2);
 	    	    if( is_five!="0"&&(totNum%5)!=0) {
 	    	        if( is_five =="1"){
 	    	            if(!confirm("交易总量为 "+totNum+" 条,不是5的倍数,确定是否要提交?")){
 	    	              document.all.save.disabled=false ;
 	    	              return;
 	    	            }
 	    	        }else if( is_five =="2"){
 	    	            alert("非异形烟交易总量为"+totNum+",不是5的倍数!");
 	    	            document.all.save.disabled=false ;
 	    	            return;
 	    	        }
 	    	    }
 	    	    if(totNum < 1) {
 	    	    	alert("亲！您还没订货呢，快选择您要的品牌！");
 	    	    	document.all.save.disabled=false ;
 	    	    	return false;
 	    	    }    
 	    	    //剩余量+已订货量（未订货时为0）
 	    	    if(totNum>MONTH_REMAIN*1+qtyOrder*1) {
 	    	    	alert("交易总量为 "+totNum+" 条,大于当月剩余量"+(MONTH_REMAIN*1+qtyOrder*1)+"条，请调整！");
 	    	    	document.all.save.disabled=false ;
 	    	    	return false;
 	    	    }

 	    	    if(totNum>MONTH_PER_ORDER*1) {
 	    	    	alert("交易总量为 "+totNum+" 条,大于次供货量"+MONTH_PER_ORDER+"条，请调整！");
 	    	    	document.all.save.disabled=false ;
 	    	    	return false;
 	    	    }
 	    	        
 	    	    if (confirm("提交以后将生成正式订单，确定是否要提交?")) {
 	    	       document.forms[0].action= ctx+"/ctp/orderSdTJ/orderSdTJAddEdit.do";
 	    	       showProcessMsg("提交中，请稍后……",false,true,true);
 	    		   document.forms[0].submit();
 	    	    }else{
 	    	       document.all.save.disabled=false ;
 	    	      }
   				}  				
   			}
   		}
	});	
}