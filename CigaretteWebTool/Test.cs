using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;

namespace CigaretteWebTool
{
    public partial class Test : Form
    {
        public Test()
        {
            InitializeComponent();
        }

        private void Test_Load(object sender, EventArgs e)
        {
            var settings = new CefSettings();
            CefSharp.Cef.Initialize(settings);
            ChromiumWebBrowser browser = new ChromiumWebBrowser("")
            {
                Location = new Point(0, 0),
                Dock = DockStyle.Fill
            };
            this.Controls.Add(browser);
            browser.IsBrowserInitializedChanged += new EventHandler<IsBrowserInitializedChangedEventArgs>(OnIsBrowserInitializedChanged);
            browser.FrameLoadEnd += new EventHandler<FrameLoadEndEventArgs>(OnLoadEnd);
            
        }

        void OnLoadEnd(object sender, EventArgs e)
        {
        }

        private void OnIsBrowserInitializedChanged(object sender, IsBrowserInitializedChangedEventArgs args)
        {
            
                if (sender is ChromiumWebBrowser browser && browser.IsBrowserInitialized)
                {
                    browser.ShowDevTools();
                Task.Factory.StartNew(() =>
                    {
                        browser.LoadHtml(StringUtil.CONTENT, "http://www.tobaccotj.com", Encoding.UTF8); 
                    });
                
                }
        }
    }
}
