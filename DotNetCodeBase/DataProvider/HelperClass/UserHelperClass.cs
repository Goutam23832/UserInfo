using iText.IO.Image;
using iText.Layout.Element;

namespace DataProvider.HelperClass
{
    public class UserHelperClass
    {
        public static Image GetImage(string imagePath)
        {
            ImageData imageData = iText.IO.Image.ImageDataFactory.Create($"D:/InfoApp/InfoSolution/InfoSolution/wwwroot{imagePath}");
            Image img           = new(imageData);
            img.ScaleToFit(100, 100); // Resize the image to fit within 300x300
            img.SetHorizontalAlignment(iText.Layout.Properties.HorizontalAlignment.CENTER); 
            return img;
        }
    }
}                                                                                       