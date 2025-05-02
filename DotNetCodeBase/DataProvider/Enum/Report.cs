using System.ComponentModel;

namespace DataProvider.Enum
{
    public enum Report
    {
        [Description("pdf")]
        pdf,
        [Description("excel")]
        excel,
        [Description("textfile")]
        textfile,
        [Description("word")]
        word
    }
}