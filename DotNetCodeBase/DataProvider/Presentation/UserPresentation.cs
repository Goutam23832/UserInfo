using ClosedXML.Excel;
using iText.IO.Image;
using iText.Kernel.Pdf;
using iText.StyledXmlParser.Jsoup.Nodes;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Xceed.Document.NET;
using Xceed.Drawing;
using Xceed.Words.NET;
using Paragraph = iText.Layout.Element.Paragraph;
using Table = iText.Layout.Element.Table;
using OfficeOpenXml;
using OfficeOpenXml.Drawing;
using System.IO;
using ClosedXML.Excel.Drawings;
using DataProvider.Interface;
using DataProvider.Data;
using DataProvider.Model;
using DataProvider.Enum;
using DataProvider.HelperClass;

namespace DataProvider.Presentation
{
    public class UserPresentation : IUsers
    {
        private readonly InfoContext _context;
        public UserPresentation(InfoContext context)
        {
            _context = context;
        }
        public string Add(User user)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                ArgumentNullException.ThrowIfNull(user);
                _context.Users.Add(user);
                _context.SaveChanges();
                transaction.Commit();
                return "save the new entry";
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        public User GetSelectedUser(int id)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Id == id) 
                    ?? throw new Exception($" Selected User is not found");
                return user;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public User Update(User user, int id)
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var findUser = _context.Users.Find(id);

                if (findUser != null)
                {
                    if (user.Name != null)
                    {
                        findUser.Name = user.Name;
                    }
                    if (user.Email != null)
                    {
                        findUser.Email = user.Email;
                    }
                    if (user.Roll != null)
                    {
                        findUser.Roll = user.Roll;
                    }
                    if (user.ImagePath != null)
                    {
                        findUser.ImagePath = user.ImagePath;
                    }

                    _context.SaveChanges();
                    transaction.Commit();

                    var result = _context.Users.FirstOrDefault(u => u.Id == id)
                        ?? throw new Exception($" Selected User not found");
                    return result;
                }
                return new User() { };
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            try
            {
                var list = await _context.Users.ToListAsync() 
                    ?? throw new Exception(" No active user is found");
                return (IEnumerable<User>)list;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string Delete(int id)
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var user = _context.Users.Find(id);
                if (user != null)
                {
                    _context.Remove(user);
                    _context.SaveChanges();
                    transaction.Commit();
                    return "Deleted the User";
                }
                transaction.Rollback();
                return $"No  item found with the id {id}";
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        public byte[] ExportThereport(string type)
        {
            try
            {
                var listOfUsers = _context.Users.ToList();
                if (listOfUsers.Count != 0)
                {
                    if (type == Report.pdf.ToString())
                    {
                        return PdfGenerator(listOfUsers);
                    }
                    else if(type == Report.excel.ToString())
                    {
                        return 
                            //ExcelGenarate.ExcelGenarates();
                            //GenarateTheExcelFile.ExcelGenerator(listOfUsers);
                            ExcelGenerator(listOfUsers);
                    }
                    else if(type == Report.textfile.ToString())
                    {
                        return TextFileGenerator(listOfUsers);
                    }
                    else
                    {
                        return WordFileGenerator(listOfUsers);
                    }
                }
                return Array.Empty<byte>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static byte[] PdfGenerator (List<User> listOfUsers) 
        {
            try
            {
                using MemoryStream ms = new();
                using (PdfWriter pdf  = new(ms))
                {
                    using PdfDocument pdfDocument  = new(pdf);
                    iText.Layout.Document document = new(pdfDocument);

                    // Add data from the database to the PDF
                    document.Add(new Paragraph("Users Information").SetFontSize(16));
                    document.Add(new Paragraph("Details"));

                    // Create a table
                    Table table = new(4); 
                    table.SetWidth(100);

                    // Add table headers
                    table.AddHeaderCell("Name");
                    table.AddHeaderCell("Email");
                    table.AddHeaderCell("Roll");
                    table.AddHeaderCell("Photo");

                    // Add user data to the table
                    foreach (var user in listOfUsers)
                    {
                        table.AddCell(user.Name);
                        table.AddCell(user.Email);
                        table.AddCell(user.Roll);

                        if (!string.IsNullOrEmpty(user.ImagePath) && !string.IsNullOrWhiteSpace(user.ImagePath))
                        {
                            table.AddCell(UserHelperClass.GetImage(user.ImagePath)); 
                        }
                        else
                        {
                            table.AddCell(""); // Add an empty cell if no image is available
                        }
                    }
                    document.Add(table);

                    document.Close();
                }
                return ms.ToArray();
            }
            catch (Exception)
            {
                throw;
            }
        }
        public static byte[] ExcelGenerator(List<User> listOfUsers)
        {
            try
            {
                using var workbook = new XLWorkbook();
                var worksheet      = workbook.Worksheets.Add("Sheet1");

                string[] desiredProperties = { "Name", "Email", "Roll", "ImagePath" };

                // Add header
                for (int i = 0; i < desiredProperties.Length; i++)
                {
                    worksheet.Cell(1, i + 1).Value = desiredProperties[i];
                }

                for (int row = 0; row < listOfUsers.Count; row++)
                {
                    for (int col = 0; col < desiredProperties.Length; col++)
                    {
                        var propertyInfo = typeof(User).GetProperty(desiredProperties[col]);
                        var value        = propertyInfo?.GetValue(listOfUsers[row])?.ToString();

                        int excelRow = row + 2;
                        int excelCol = col + 1;

                        if (desiredProperties[col] == "ImagePath")
                        {
                            var cell = worksheet.Cell(row + 2, col + 1);

                            if (!string.IsNullOrWhiteSpace(value))
                            {
                                var fullImagePath = Path.Combine("D:/InfoApp/InfoSolution/InfoSolution/wwwroot", value.TrimStart('/'));

                                if (File.Exists(fullImagePath))
                                {
                                    // Set standard cell dimensions
                                    worksheet.Column(col + 1).Width = 18;
                                    worksheet.Row(row + 2).Height = 80;

                                    // Add image
                                    var picture = worksheet.AddPicture(fullImagePath)
                                                           .MoveTo(cell, 10, 10) // Offset: X=10, Y=10 to center
                                                           .WithPlacement(XLPicturePlacement.Move);

                                    picture.Width  = 60;
                                    picture.Height = 60;
                                }
                                else
                                {
                                    cell.Value = "Image not found";
                                }
                            }
                            else
                            {
                                cell.Value = "";
                            }

                            // Optional: Center align other content too
                            cell.Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                            cell.Style.Alignment.SetVertical(XLAlignmentVerticalValues.Center);
                        }

                        else
                        {
                            worksheet.Cell(excelRow, excelCol).Value = value;
                        }
                    }
                }

                worksheet.Columns().AdjustToContents();

                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
            catch (Exception ex)
            {
                throw new Exception("Excel generation failed", ex);
            }
        }

        public static byte[] TextFileGenerator (List<User> listOfUsers) 
        {
            try
            {
                using var stream = new MemoryStream();
                using var writer = new StreamWriter(stream);
                // Add header
                string[] desiredProperties = { "Name", "Email", "Roll", "Photo" };
                writer.WriteLine(string.Join("\t", desiredProperties));

                // Populate data
                foreach (var user in listOfUsers)
                {
                    var values = new List<string>();
                    foreach (var property in desiredProperties)
                    {
                        var propertyInfo = typeof(User).GetProperty(property);
                        var value        = propertyInfo?.GetValue(user)?.ToString() ?? string.Empty;

                        // Sanitize value to remove any special characters
                        value = value.Replace("\t", " ")
                                     .Replace("\n", " ") 
                                     .Replace("\r", " ");
                        values.Add(value); 
                    }
                    writer.WriteLine(string.Join("\t", values));
                }

                writer.Flush();
                stream.Position = 0;
                return stream.ToArray();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static byte[] WordFileGenerator (List<User> listOfUsers) 
        {
            try
            {
                using var stream   = new MemoryStream();
                using var document = DocX.Create(stream);

                // Add title
                document.InsertParagraph("User Report")
                        .FontSize(20).Bold().Alignment = Xceed.Document.NET.Alignment.center;

                // Add table
                var table    = document.AddTable(listOfUsers.Count + 1, 4);
                table.Design = TableDesign.LightShadingAccent1;
                  
                // Add header
                table.Rows[0].Cells[0].Paragraphs[0].Append("Name").Bold();
                table.Rows[0].Cells[1].Paragraphs[0].Append("Email").Bold();
                table.Rows[0].Cells[2].Paragraphs[0].Append("Roll").Bold();
                table.Rows[0].Cells[3].Paragraphs[0].Append("Photo").Bold();

                // Populate data
                for (int i = 0; i < listOfUsers.Count; i++)
                {
                    table.Rows[i + 1].Cells[0].Paragraphs[0].Append(listOfUsers[i].Name);
                    table.Rows[i + 1].Cells[1].Paragraphs[0].Append(listOfUsers[i].Email);
                    table.Rows[i + 1].Cells[2].Paragraphs[0].Append(listOfUsers[i].Roll);

                    if (!string.IsNullOrEmpty(listOfUsers[i].ImagePath) && !string.IsNullOrWhiteSpace(listOfUsers[i].ImagePath))
                    {
                        var image = $"D:/InfoApp/InfoSolution/InfoSolution/wwwroot{listOfUsers[i].ImagePath}";
                        // Insert the image
                        Xceed.Document.NET.Image img = document.AddImage(image);
                        Picture picture              = img.CreatePicture();

                        // Resize the image to fit within 100x100
                        picture.Width  = 100;
                        picture.Height = 100;
                        table.Rows[i + 1].Cells[3].Paragraphs[0].AppendPicture(picture);
                    }
                    else
                    {
                        table.Rows[i + 1].Cells[3].Paragraphs[0].Append(""); // Add an empty cell if no image is available
                    }
                }                                                                                                       
                   
                document.InsertTable(table); 
                document.Save();
                return stream.ToArray();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}                        