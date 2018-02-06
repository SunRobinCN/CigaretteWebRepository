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

        public Main()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            webBrowser.ScriptErrorsSuppressed = true; //禁用错误脚本提示 
            webBrowser.IsWebBrowserContextMenuEnabled = false; //禁用右键菜单 
            //webBrowser.WebBrowserShortcutsEnabled = false; //禁用快捷键 
            webBrowser.AllowWebBrowserDrop = false;//禁止拖拽
            //webBrowser.ScrollBarsEnabled = false;//禁止滚动条

            this.webBrowser.Navigate("http://www.tobaccotj.com/ebp/");
        }

        private void webBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            if (IsOrderFrameLoaded)
            {
                IsOrderFrameLoaded = false;
                HtmlElement headElement = webBrowser.Document.GetElementsByTagName("head")[0];
                HtmlElement scriptElementJquery = webBrowser.Document.CreateElement("script");
                scriptElementJquery.SetAttribute("src", "http://libs.baidu.com/jquery/1.10.2/jquery.min.js");
                headElement.AppendChild(scriptElementJquery);


                HtmlElement scriptElement = webBrowser.Document.CreateElement("script");
                IHTMLScriptElement element = (IHTMLScriptElement)scriptElement.DomElement;
                element.text = "function sayHello() { alert($('q')); }";
                headElement.AppendChild(scriptElement);
                webBrowser.Document.InvokeScript("sayHello");
            }
            //string r = this.webBrowser.Document.Window.Frames["main"].Document.Body.InnerHtml;
            /string r = this.webBrowser.Document.GetElementsByTagName("HTML")[0].OuterHtml;
        }

        private void webBrowser_Navigating(object sender, WebBrowserNavigatingEventArgs e)
        {
            if (e.Url.AbsoluteUri == MainOrderUrl)
            {
                IsOrderFrameLoaded = true;
            }
        }

        private string RefreshPage()
        {
            string result = "function refreshPage() { document.getElementsByName(\"mainFrame\")[0].src=\'/ebp/ctp/orderSdTJ/orderSdTJAddEditIni.do\'; }";
        }
    }
}
