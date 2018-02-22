using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using mshtml;

namespace CigaretteWebTool
{
    public partial class Main : Form
    {

        public static string MainOrderUrl { get; } =
            "http://www.tobaccotj.com/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do";

        public bool IsOrderFrameLoaded { get; set; }
        public int CountForNav { get; set; }

        public Main()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            webBrowser.ScriptErrorsSuppressed = false; //禁用错误脚本提示 
            webBrowser.IsWebBrowserContextMenuEnabled = false; //禁用右键菜单 
            //webBrowser.WebBrowserShortcutsEnabled = false; //禁用快捷键 
            webBrowser.AllowWebBrowserDrop = false;//禁止拖拽
            //webBrowser.ScrollBarsEnabled = false;//禁止滚动条

            this.webBrowser.Navigate("http://www.tobaccotj.com/ebp/");
        }

        private void webBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            if (CountForNav == 0)
            {
                return;
            }

            if (e.Url.AbsolutePath != (sender as WebBrowser).Url.AbsolutePath || MainOrderUrl.Contains((sender as WebBrowser).Url.AbsolutePath) == false)
                return;

            try
            {
                //IsOrderFrameLoaded = false;
                HtmlDocument frameDocument = this.webBrowser.Document;
                HtmlElement headElement = frameDocument.GetElementsByTagName("head")[0];

                HtmlElement scriptElement = frameDocument.CreateElement("script");
                IHTMLScriptElement element = (IHTMLScriptElement)scriptElement.DomElement;
                string scriptContent = InitializeOnLoadEvent();
                scriptContent = scriptContent.Replace("//function7", QtyDemandChange());
                scriptContent = scriptContent.Replace("//function1", CheckWheterRefreshPage());
                scriptContent = scriptContent.Replace("//function2", CompareWithStock());
                scriptContent = scriptContent.Replace("//function3", MyRandom());
                scriptContent = scriptContent.Replace("//function4", ExcecuteForAppointedTr());
                scriptContent = scriptContent.Replace("//function5", GetTrArry());
                scriptContent = scriptContent.Replace("//function6", Start());
                //scriptContent.Replace("//function6", "");
                scriptContent = scriptContent.Replace("//runfunction1", "var confirm = function () { return true; }");
                scriptContent = scriptContent.Replace("//runfunction2", "var trArry = GetTrArry();");
                scriptContent = scriptContent.Replace("//runfunction3", "var currentIndex = 0;");
                scriptContent = scriptContent.Replace("//runfunction4", "Start();");
                scriptContent = scriptContent.Replace("//runfunction5", "//runfunction5");
                //scriptContent.Replace("//runfunction6", "");
                element.text = scriptContent;
                headElement.AppendChild(scriptElement);
                //frameDocument.InvokeScript("TestPage");
                //string conttent = frameDocument.InvokeScript("getFrameHtml").ToString();
                string r = this.webBrowser.Document.GetElementsByTagName("HTML")[0].OuterHtml;
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
            }
        }

        private void webBrowser_Navigating(object sender, WebBrowserNavigatingEventArgs e)
        {
            if (e.Url.AbsoluteUri == MainOrderUrl)
            {
                if (CountForNav == 0)
                {
                    this.webBrowser.Navigate("http://www.tobaccotj.com/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do");
                    IsOrderFrameLoaded = true;
                    CountForNav++;
                }
            }
        }

        private string InitializeOnLoadEvent()
        {
            string result = new StringUtil().OnLoadScriptForOuter();
            return result;
        }

        private string CheckWheterRefreshPage()
        {
            string result = "function CheckWheterRefreshPage() {\r\n                    var subs = \'次供货限量\';\r\n                    var content = $(\"body\").html();\r\n                    alert(content.indexOf(subs) + \"aaa\");\r\n                    if (content.indexOf(subs) < 0) {\r\n                        $(window).attr(\'location\', \'http://www.tobaccotj.com/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do\');\r\n                        return;\r\n                    }\r\n                }";
            return result;
        }

        private string QtyDemandChange()
        {
            string result = "function qtyDemandChange(obj, id) {\r\n                    if (null != event && event.keyCode == 0) {\r\n                        event.keyCode = 13;\r\n                    }\r\n                    if (isNaN(obj.value)) {\r\n                        alert(\"请输入数字\");\r\n                        document.forms[0].elements[\"orderSdDetail[\" + id + \"].qtyReq\"].value = \"\";\r\n                        return;\r\n                    }\r\n                    if (obj.value == \"\") obj.value = 0;\r\n                    var productIDObj = \"orderSdDetail[\" + id + \"].productId\";\r\n                    var productPriceObj = \"orderSdDetail[\" + id + \"].price\";\r\n                    var qtyDemandObj = \"orderSdDetail[\" + id + \"].qtyReq\";\r\n                    var qtyOrderdObj = \"orderSdDetail[\" + id + \"].qtyOrder\";\r\n                    var amtdObj = \"orderSdDetail[\" + id + \"].amtOrder\";\r\n                    var qty1Obj = \"orderSdDetail[\" + id + \"].qtyOther1\";   //合理定量\r\n                    var qty6Obj = \"orderSdDetail[\" + id + \"].qtyOther6\";   //剩余量\r\n                    var tag6Obj = \"orderSdDetail[\" + id + \"].tag6\";   //卷烟类型：1推荐品牌；2顺销烟；3紧俏烟\r\n                    if (document.forms[0].elements[productIDObj].value == \"\") {\r\n                        clearRow(eval(\"document.all.dataRow\" + id))\r\n                        return false;\r\n                    }\r\n                    var qty1Val = document.forms[0].elements[qty1Obj].value; //合理定量\r\n                    var qty6Val = document.forms[0].elements[qty6Obj].value; //剩余量\r\n                    var atyDemandVal = document.forms[0].elements[qtyDemandObj].value; //需求量\r\n                    var tag6Val = document.forms[0].elements[tag6Obj].value; //卷烟类型\r\n\r\n                    if (qty1Val == \"\" && qty6Val == \"\") qty1Val = 99999;   //如果是放开品牌的话，可以随便订烟\r\n                    if (qty1Val == \"\") qty1Val = qty6Val;\r\n                    if (qty6Val == \"\") qty6Val = qty1Val;\r\n                    qty1Val = Math.min(qty1Val * 1, qty6Val * 1);  //取合理定量和剩余量的小值 \r\n                    //在需求量大于剩余量或者合理定量时 顺销品牌：大、中型客户自动生成的订单量等于合理定量乘以110%；普通客户自动生成的订单量等于合理定量乘以115%。\r\n                    if (tag6Val * 1 == 2 && 　atyDemandVal * 1 > qty1Val) {\r\n                        //判断是否是在投放区域中xiangcr\r\n                        if (kharea * 1 == 1) {\r\n                            /*\r\n                            switch(khdc*1) {\r\n                                case 6:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 7:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 8:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;  \r\n                                case 9:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 10:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 11:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 12:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 13:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 14:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 15:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 16:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                                case 17:\r\n                                    qty1Val = Math.floor(qty1Val*BUSINESS_STRATEGY_TWO,0);\r\n                                    break;\r\n                               }\r\n                               */\r\n                        } else {\r\n                            switch (CUSTOMER_GRADE * 1) {\r\n                                case 5:\r\n                                    qty1Val = Math.floor(qty1Val * BUSINESS_STRATEGY_ONE, 0);\r\n                                    break;\r\n                                case 6:\r\n                                    qty1Val = Math.floor(qty1Val * BUSINESS_STRATEGY_ONE, 0);\r\n                                    break;\r\n                                case 7:\r\n                                    qty1Val = Math.floor(qty1Val * BUSINESS_STRATEGY_TWO, 0);\r\n                                    break;\r\n                            }\r\n                        }\r\n                    }\r\n                    if (tag6Val * 1 != 1 && tag6Val * 1 != 2 && tag6Val * 1 != 3 && tag6Val * 1 != 4)// \r\n                    {\r\n                        qty1Val = 9999;\r\n                    }\r\n\r\n                    //比较是否小于单品限量\r\n                    qty1Val = FormatNumber(Math.max(Math.min(qty1Val * 1, PRODUCT_UP * 1), 0), 0);\r\n                    if (atyDemandVal * 1 > qty1Val * 1 && qty1Val != \"\") {\r\n                        showChaPrd(document.forms[0].elements[productIDObj].value, qty1Val * 1, id);\r\n                    }\r\n\r\n                    var price = document.forms[0].elements[productPriceObj].value * 1;\r\n                    document.forms[0].elements[qtyOrderdObj].value = Math.min(atyDemandVal * 1, qty1Val * 1);\r\n                    /*********************************************************************/\r\n                    var productIDObj = \"orderSdDetail[\" + id + \"].productId\";\r\n                    var productDescObj = \"orderSdDetail[\" + id + \"].productDesc\";\r\n                    var productID = document.forms[0].elements[productIDObj].value;\r\n                    var qtyOrderObj = document.forms[0].elements[qtyOrderdObj];\r\n                    var deptID = document.forms[0].elements[\"companyId\"].value;  //公司\r\n                    var productDesc = document.forms[0].elements[productDescObj].value;\r\n                    var getStock = 1;// 是否查询货源剩余量\r\n                    if (getStock == 1) {\r\n                        compareWithStockLocal(productID, deptID, productDesc, qtyOrderObj, id);\r\n                    }\r\n                    /*********************************************************************/\r\n                    var qtyOrderd = document.forms[0].elements[qtyOrderdObj].value;\r\n                    document.forms[0].elements[amtdObj].value = FormatNumber(qtyOrderd * 1 * price, 2);\r\n                    qtyOrderChange(document.forms[0].elements[\"orderSdDetail[\" + id + \"].qtyOrder\"], id);\r\n                }";
            return result;
        }

        private string CompareWithStock()
        {
            string result = "function compareWithStockLocal(productID, deptID, name, obj, id) {\n                    var order_id = document.forms[0].elements[\"rowId\"].value;\n                    var order_date = document.forms[0].elements[\"orderDate\"].value;\n                    var productPriceObj = \"orderSdDetail[\" + id + \"].price\";\n                    var amtdObj = \"orderSdDetail[\" + id + \"].amtOrder\";\n                    $.ajax({\n                        type: \"POST\",\n                        url: ctx + \"/jsp/eb/ctp/orderSdTJ/getProductStock.jsp\",\n                        data: \"productID=\" + productID + \"&deptID=\" + deptID + \"&order_id=\" + order_id + \"&order_date=\" + order_date,\n                        error: function (XMLHttpRequest, textStatus, errorThrown) {\n                            alert(errorThrown);\n                        },\n                        success: function (remain) {\n                            //alert('ajax check done');\n                            if (remain * 1 <= 0) {\n                                remain = 0;\n                                art.dialog({\n                                    title: '\u63D0\u793A',\n                                    content: name + '\u7684\u8D27\u6E90\u91CF\u4E3A' + remain + '\u6761,\u5DF2\u81EA\u52A8\u5E2E\u60A8\u66F4\u6539\u3002'\n                                });\n                                obj.value = remain;\n                                var price = document.forms[0].elements[productPriceObj].value * 1;\n                                document.forms[0].elements[amtdObj].value = FormatNumber(obj.value * 1 * price, 2);\n                                setStyleAfterCheckStock(id);\n\n                                //alert('failed, contiue to next row.');\n                                $('.d-outer').parent().css(\"visibility\", \"hidden\");\n                                \n                                var theTd = $(trArry[currentIndex]).children().first().next().next().next().next();\n                                theTd.next().children().first().val(\"\");\n\n                                currentIndex++;\n                                if (currentIndex < trArry.length) {\n                                    ExcecuteForAppointedTr(currentIndex, trArry[currentIndex]);\n                                } else {\n                                    alert('Over');\n                                }\n\n                            } else if (obj.value * 1 > remain * 1) //\u5982\u679C\u5927\u4E8E\u5E93\u5B58\u91CF\u5219\u81EA\u52A8\u5C06\u8BA2\u8D27\u91CF\u6539\u5C0F\u3002\n                            {\n                                art.dialog({\n                                    title: '\u63D0\u793A',\n                                    content: name + '\u7684\u8D27\u6E90\u91CF\u4E3A' + remain + '\u6761,\u5DF2\u81EA\u52A8\u5E2E\u60A8\u66F4\u6539\u3002'\n                                });\n                                obj.value = remain;\n                                var price = document.forms[0].elements[productPriceObj].value * 1;\n                                document.forms[0].elements[amtdObj].value = FormatNumber(obj.value * 1 * price, 2);\n                                setStyleAfterCheckStock(id);\n\n                                //alert('failed, contiue to next row.');\n                                $('.d-outer').parent().css(\"visibility\", \"hidden\");\n                                var theTd = $(trArry[currentIndex]).children().first().next().next().next().next();\n                                theTd.next().children().first().val(\"\");\n                                \n                                currentIndex++;\n                                if (currentIndex < trArry.length) {\n                                    ExcecuteForAppointedTr(currentIndex, trArry[currentIndex]);\n                                } else {\n                                    alert('Over');\n                                }\n\n                            } else {\n                                //\u8BF4\u660E\u6210\u529F\n                                $(\"#save\").click();\n                            }\n                        }\n                    });\n                }";
            return result;
        }

        private string TestPage()
        {
            string result = "function TestPage() { alert('hello'); }  TestPage();";
            return result;
        }

        private string MyRandom()
        {
            string result = "function MyRandom() {\r\n                    var x = 99;\r\n                    var y = 100;\r\n                    var rand = parseInt(Math.random() * (x - y + 1) + y);\r\n                    return rand;\r\n                }";
            return result;
        }

        private string ExcecuteForAppointedTr()
        {
            string result = "function ExcecuteForAppointedTr(index, domTr) {\r\n                    var theTr = $(domTr);\r\n                    var theTd = theTr.children().first().next().next().next().next();\r\n                    var amount = MyRandom();\r\n                    theTd.next().children().first().val(amount);\r\n                    var content = $(domTr).html();\r\n                    var startIndex1 = content.indexOf(\'orderSdDetail[\');\r\n                    var startIndex2 = content.indexOf(\'].rowId\');\r\n                    var valueLenght = startIndex2 - startIndex1 - 14;\r\n                    var indexForCheck = content.substr(startIndex1 + 14, valueLenght);\r\n                    var intIndexForCheck = parseInt(indexForCheck);\r\n                    qtyDemandChange(theTd.next().children().first()[0], intIndexForCheck);\r\n                }";
            return result;
        }

        private string GetTrArry()
        {
            string result = "function GetTrArry() {\r\n                    var arr = [];\r\n                    //$(\"#dataTable tbody tr\").each(function (index, domTr) {\r\n                    //    if (index < 1010) {\r\n                    //        var theTr = $(domTr);\r\n                    //        var theTd = theTr.children().first().next().next().next().next();\r\n                    //        if (theTd.children().first().val() === \"\" &&\r\n                    //        (theTd.next().next().children().first().val() === \"\" ||\r\n                    //            theTd.next().next().children().first().val() === \"0\")) {\r\n                    //            arr.push(domTr);\r\n                    //        }\r\n                    //    }\r\n                    //});\r\n                    var jTr = $(\"input[value=\'兰州(硬精品)\']\").parent().parent();\r\n                    arr.push(jTr[0]);\r\n                    return arr;\r\n                }";
            return result;
        }

        private string Start()
        {
            string result = "function Start() {\r\n                    var subs = \'次供货限量\';\r\n                    var content = $(\"body\").html();\r\n                    if (content.indexOf(subs) < 0) {\r\n                        setTimeout(function() {\r\n                            $(window).attr(\'location\', \'http://www.tobaccotj.com/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do\');\r\n                        }, 1000);\r\n                    } else {\r\n                        ExcecuteForAppointedTr(currentIndex, trArry[currentIndex]);\r\n                    }\r\n                }";
            return result;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            this.webBrowser.Navigate("http://www.tobaccotj.com/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do");
            IsOrderFrameLoaded = true;
            CountForNav++;
        }
    }
}
