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

            //if (e.Url.AbsolutePath != "blank")
            //{
            //}
            //else
            //{
            //    string contentHtml = this.webBrowser.Document.GetElementsByTagName("HTML")[0].OuterHtml;
            //    if (contentHtml.Contains("$(document).ready") == false)
            //    {
                    
            //    }
            //}
            
            try
            {
                //IsOrderFrameLoaded = false;
                HtmlDocument frameDocument = this.webBrowser.Document;
                HtmlElement headElement = frameDocument.GetElementsByTagName("head")[0];

                HtmlElement scriptElement = frameDocument.CreateElement("script");
                IHTMLScriptElement element = (IHTMLScriptElement)scriptElement.DomElement;
                element.text = InitializeOnLoadEvent().Replace("//function1", CheckWheterRefreshPage()).
                    Replace("//runfunction1", "CheckWheterRefreshPage();");
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
            string result = "function CheckWheterRefreshPage() { var subs = \'次供货限量\';\r\nvar content = $(\"body\").html();\r\nif(content.indexOf(subs) < 0) {\r\n    $(window).attr(\'location\',\'http://www.tobaccotj.com/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do\');\r\n}}";
            return result;
        }

        private string TestPage()
        {
            string result = "function TestPage() { alert('hello'); }  TestPage();";
            return result;
        }
    }
}
