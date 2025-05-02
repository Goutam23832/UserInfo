using DataProvider.Data;
using DataProvider.Interface;
using Microsoft.AspNetCore.Mvc;

namespace DotNetCodeBase.Controllers
{
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly ILogger<StudentController> _logger;
        private readonly IStudent                   _student;
        public StudentController(ILogger<StudentController> logger,
            IStudent student)
        {
            _logger  = logger;
            _student = student;
        }
        [HttpGet]
        [Route("api/v1/student/getallstudent")]
        public async Task<IActionResult> GetAllStudent()
        {
            try
            {
                var result = await _student.GetAllStudent();
                if (result.Any())
                {
                    return Ok(result);
                }
                return Ok("No active user is found");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(GetAllStudent)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        [Route("api/v1/student/getstudent/{id}")]
        public IActionResult GetStudent(int id)
        {
            try
            {
                if (id != 0)
                {
                    var result = _student.GetSelectedUser(id);
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
                _logger.LogError($"Exception in {nameof(GetStudent)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost]
        [Route("api/v1/student/addnewstudent")]
        public IActionResult AddNewstudent (Student student)
        {
            try
            {
                if (student != null)
                {
                    var result = _student.Add(student);
                    if (result.Length != 0)
                    {  
                        return Ok(result); 
                    }
                }
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(GetStudent)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut]
        [Route("api/v1/student/updatethestudent/{id}")]
        public IActionResult UpdateTheStudent(Student student, int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(StatusCodes.Status400BadRequest);
                }
                var result = _student.Update(student, id);
                if (result == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(UpdateTheStudent)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred");
            }
        }

        [HttpDelete]
        [Route("api/v1/student/deletethestudent/{id}")]
        public IActionResult DeleteStudent(int id) 
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest(StatusCodes.Status400BadRequest);
                }
                var result = _student.Delete(id);
                if (result == true)
                {
                    return Ok(result);
                }
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception in {nameof(UpdateTheStudent)}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred");
            }
        }
    }
}
