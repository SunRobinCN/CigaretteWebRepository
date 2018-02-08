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
                scriptContent = scriptContent.Replace("//function1", CheckWheterRefreshPage());
                scriptContent = scriptContent.Replace("//function2", compareWithStock());
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
            string result = new StringUtil().OnLoadScript();
            return result;
        }

        private string CheckWheterRefreshPage()
        {
            string result = "function CheckWheterRefreshPage() {\r\n                    var subs = \'次供货限量\';\r\n                    var content = $(\"body\").html();\r\n                    alert(content.indexOf(subs) + \"aaa\");\r\n                    if (content.indexOf(subs) < 0) {\r\n                        $(window).attr(\'location\', \'http://www.tobaccotj.com/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do\');\r\n                        return;\r\n                    }\r\n                }";
            return result;
        }

        private string compareWithStock()
        {
            string result = "function compareWithStock(productID, deptID, name, obj, id) {\r\n                    var order_id = document.forms[0].elements[\"rowId\"].value;\r\n                    var order_date = document.forms[0].elements[\"orderDate\"].value;\r\n                    var productPriceObj = \"orderSdDetail[\" + id + \"].price\";\r\n                    var amtdObj = \"orderSdDetail[\" + id + \"].amtOrder\";\r\n                    $.ajax({\r\n                        type: \"POST\",\r\n                        url: ctx + \"/jsp/eb/ctp/orderSdTJ/getProductStock.jsp\",\r\n                        data: \"productID=\" + productID + \"&deptID=\" + deptID + \"&order_id=\" + order_id + \"&order_date=\" + order_date,\r\n                        success: function(remain) {\r\n                            //alert( \"剩余量: \" + remain );\r\n                            if (remain * 1 < 0) {\r\n                                remain = 0;\r\n                                art.dialog({\r\n                                    title: \'提示\',\r\n                                    content: name + \'的货源量为\' + remain + \'条,已自动帮您更改。\'\r\n                                });\r\n                                obj.value = remain;\r\n                                var price = document.forms[0].elements[productPriceObj].value * 1;\r\n                                document.forms[0].elements[amtdObj].value = FormatNumber(obj.value * 1 * price, 2);\r\n                                setStyleAfterCheckStock(id);\r\n                            } else if (obj.value * 1 > remain * 1) //如果大于库存量则自动将订货量改小。\r\n                            {\r\n                                art.dialog({\r\n                                    title: \'提示\',\r\n                                    content: name + \'的货源量为\' + remain + \'条,已自动帮您更改。\'\r\n                                });\r\n                                obj.value = remain;\r\n                                var price = document.forms[0].elements[productPriceObj].value * 1;\r\n                                document.forms[0].elements[amtdObj].value = FormatNumber(obj.value * 1 * price, 2);\r\n                                setStyleAfterCheckStock(id);\r\n                                alert(\'ajax check done\');\r\n                                if (!($(\'.d-outer\').parent().css(\"visibility\") === \'visible\' &&\r\n                                    $(\'.d-content\').html().indexOf(\'为0条\') > 0)) {\r\n                                    //说明成功\r\n                                    alert(\"dddd\");\r\n                                    alert(\'成功了，马上就要提交了\');\r\n                                    saveRecord();\r\n                                } else {\r\n                                    //失败了，关闭弹出窗口\r\n                                    alert(\'failed, contiue to next row.\');\r\n                                    //theTd.next().children().first().val(\"\");\r\n                                    $(\'.d-outer\').parent().css(\"visibility\", \"hidden\");\r\n                                }\r\n                                currentIndex++;\r\n                                if (currentIndex < trArry.length) {\r\n                                    ExcecuteForAppointedTr(currentIndex, trArry[currentIndex]);\r\n                                }\r\n                            }\r\n                        }\r\n                    });\r\n                }";
            return result;
        }

        private string TestPage()
        {
            string result = "function TestPage() { alert('hello'); }  TestPage();";
            return result;
        }

        private string MyRandom()
        {
            string result = "function MyRandom() {\r\n                    var x = 5;\r\n                    var y = 1;\r\n                    var rand = parseInt(Math.random() * (x - y + 1) + y);\r\n                    return rand;\r\n                }";
            return result;
        }

        private string ExcecuteForAppointedTr()
        {
            string result = "function ExcecuteForAppointedTr(index, domTr) {\r\n                    alert(index);\r\n                    var theTr = $(domTr);\r\n                    var theTd = theTr.children().first().next().next().next().next();\r\n                    var amount = MyRandom();\r\n                    theTd.next().children().first().val(amount);\r\n                    var content = $(domTr).html();\r\n                    var startIndex1 = content.indexOf(\'orderSdDetail[\');\r\n                    var startIndex2 = content.indexOf(\'].rowId\');\r\n                    var valueLenght = startIndex2 - startIndex1 - 14;\r\n                    var indexForCheck = content.substr(startIndex1 + 14, valueLenght);\r\n                    alert(indexForCheck);\r\n                    var intIndexForCheck = parseInt(indexForCheck);\r\n                    qtyDemandChange(theTd.next().children().first()[0], intIndexForCheck);\r\n                }";
            return result;
        }

        private string GetTrArry()
        {
            string result = "function GetTrArry() {\r\n                    var arr = [];\r\n                    $(\"#dataTable tbody tr\").each(function (index, domTr) {\r\n                        if (index < 11) {\r\n                            var theTr = $(domTr);\r\n                            var theTd = theTr.children().first().next().next().next().next();\r\n                            if (theTd.children().first().val() === \"\" &&\r\n                            (theTd.next().next().children().first().val() === \"\" ||\r\n                                    theTd.next().next().children().first().val() === \"0\")) {\r\n                                arr.push(domTr);\r\n                            }\r\n                        }\r\n                    });\r\n                    return arr;\r\n                }";
            return result;
        }

        private string Start()
        {
            string result = "function Start() {\r\n                    var subs = \'次供货限量\';\r\n                    var content = $(\"body\").html();\r\n                    if (content.indexOf(subs) < 0) {\r\n                        setTimeout(function() {\r\n                            $(window).attr(\'location\', \'http://www.tobaccotj.com/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do\');\r\n                        }, 1000);\r\n                    } else {\r\n                        ExcecuteForAppointedTr(currentIndex, trArry[currentIndex]);\r\n                    }\r\n                }";
            return result;
        }
    }
}
