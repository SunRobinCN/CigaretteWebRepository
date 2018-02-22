using System.Text;

namespace CigaretteWebTool
{
    public class StringUtil
    {
        public string OnLoadScript()
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(
                "$(document).ready(\r\nfunction() {\r\n\r\n//function1\r\n\r\n//function2\r\n\r\n " +
                "//function3\r\n\r\n//function4\r\n\r\n //function5\r\n\r\n//function6\r\n\r\n  " +
                "//function7\r\n\r\n//function8\r\n\r\n //function9\r\n\r\n\r\n\r\n" +
                "//runfunction1\r\n\r\n//runfunction2\r\n\r\n//runfunction3\r\n\r\n" +
                "//runfunction4\r\n\r\n//runfunction5\r\n\r\n//runfunction6\r\n\r\n" +
                "//runfunction7\r\n\r\n//runfunction8\r\n\r\n//runfunction9\r\n\r\n }); \r\n\r\n");
            return builder.ToString();
        }

        public string OnLoadScriptForOuter()
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(
                "//function1\r\n\r\n//function2\r\n\r\n " +
                "//function3\r\n\r\n//function4\r\n\r\n //function5\r\n\r\n//function6\r\n\r\n  " +
                "//function7\r\n\r\n//function8\r\n\r\n //function9\r\n\r\n\r\n\r\n" +
                "//runfunction1\r\n\r\n//runfunction2\r\n\r\n//runfunction3\r\n\r\n" +
                "//runfunction4\r\n\r\n//runfunction5\r\n\r\n//runfunction6\r\n\r\n" +
                "//runfunction7\r\n\r\n//runfunction8\r\n\r\n//runfunction9\r\n\r\n");
            return builder.ToString();
        }
    }
}