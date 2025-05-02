using DataProvider.Enum;
using DataProvider.Interface;
using DataProvider.Model;
using Microsoft.AspNetCore.Mvc;

namespace DotNetCodeBase.Controllers
{
    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;
        private readonly IUsers                  _users;

        public UserController(IUsers users, ILogger<UserController> logger)
        {
            _logger = logger;
            _users  = users;
        }

        [HttpPost]
        [Route("api/v1/user/addnewuser")]
        public IActionResult AddNewUser([FromForm] User user, IFormFile ImagePath)
        {
            try
            {
                if (ImagePath != null && ImagePath.Length > 0)
                {
                    //Save the image to the file system
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImagePath.FileName);
                    var filePath = Path.Combine("wwwroot/images", fileName);
                    Directory.CreateDirectory("wwwroot/images"); // Ensure the directory exists
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        ImagePath.CopyTo(stream);
                    }
                    //Update the User model
                    user.ImagePath = $"/images/{fileName}";
                }
                else
                {
                    user.ImagePath = string.Empty;
                }
                var result = _users.Add(user);

                if (result == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(AddNewUser)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("api/v1/user/getallusers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var result = await _users.GetAllUsers();
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(GetAllUsers)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("api/v1/user/getuser/{id}")]
        public IActionResult GetUser([FromRoute] int id)
        {
            try
            {
                if (id != 0)
                {
                    var result = _users.GetSelectedUser(id);
                    if (result == null)
                    {
                        return NotFound();
                    }
                    return Ok(result);
                }
                return BadRequest(StatusCodes.Status400BadRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(GetUser)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpDelete]
        [Route("api/v1/user/deletetheuser/{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(StatusCodes.Status400BadRequest);
                }
                var result = _users.Delete(id);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(DeleteUser)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred");
            }
        }

        [HttpPut]
        [Route("api/v1/user/updatetheuser/{id}")]
        public IActionResult UpdateTheUser([FromForm] User user, int id, IFormFile ImagePath)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(StatusCodes.Status400BadRequest);
                }
                if (ModelState.IsValid)
                {
                    if (ImagePath != null && ImagePath.Length > 0)
                    {
                        //Save the image to the file system
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImagePath.FileName);
                        var filePath = Path.Combine("wwwroot/images", fileName);
                        Directory.CreateDirectory("wwwroot/images"); // Ensure the directory exists
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            ImagePath.CopyTo(stream);
                        }
                        //Update the User model
                        user.ImagePath = $"/images/{fileName}";
                    }
                    else
                    {
                        user.ImagePath = string.Empty;
                    }
                    var result = _users.Update(user, id);

                    return Ok(result);
                }
                return BadRequest(StatusCodes.Status400BadRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(DeleteUser)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred");
            }
        }

        [HttpGet]
        [Route("api/v1/user/exportthereport/{type}")]
        public IActionResult ExportTheReport(string type)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    byte[] getTheFileData = _users.ExportThereport(type);

                    if (getTheFileData != null) 
                    {
                        if (type == Report.pdf.ToString())
                        {
                            return File(getTheFileData, "application/pdf", "user_report.pdf");
                        }
                        else if(type == Report.excel.ToString())
                        {
                            return File(getTheFileData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                                "user_report.xlsx");
                        }
                        else if(type == Report.textfile.ToString())
                        {
                            return File(getTheFileData, "text/plain", "user_report.txt");
                        }
                        else  
                        {
                            return File(getTheFileData, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
                                "user_report.docx");
                        }
                    }  
                }
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error generating {type}.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(ExportTheReport)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An Unepected error occurred");
            }
        }
    }
}
