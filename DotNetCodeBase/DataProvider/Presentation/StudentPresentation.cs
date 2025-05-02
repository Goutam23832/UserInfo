using DataProvider.Data;
using DataProvider.Interface;
using Microsoft.EntityFrameworkCore;

namespace DataProvider.Presentation
{
    public class StudentPresentation : IStudent
    {
        private readonly InfoContext _context;
        public StudentPresentation( InfoContext context)
        {
            _context = context;
        }

        public bool Delete(int studentId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {

                try
                {
                    var student = _context.Students.Find(studentId);

                    if (student != null)
                    {
                        _context.Students.Remove(student);
                        _context.SaveChanges();
                        transaction.Commit();
                        return true;
                    }
                    transaction.Rollback();
                    return false;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                } 
            }
        }

        string IStudent.Add(Student student)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {

                try
                {
                    _context.Students.Add(student);
                    _context.SaveChanges();
                    transaction.Commit();
                    return "save the new student information.";
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                } 
            }
        }

        async Task<IEnumerable<Student>> IStudent.GetAllStudent()
        {
            try
            {
                var studentsList = await _context.Students.ToListAsync()
                        ?? throw new Exception(" No active user is found");
                return studentsList;
            }
            catch (Exception)
            {

                throw;
            }
        }

        Student IStudent.GetSelectedUser(int studentId)
        {
            try
            {
                var findStudent = _context.Students.FirstOrDefault(id => id.StudentId == studentId)
                     ?? throw new Exception("Student is not found");
                return findStudent;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public Student Update(Student student, int id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {

                try
                {
                    var findStudent = _context.Students.Find(id);

                    if (findStudent != null)
                    {
                        if (student.PhoneNumber != 0) { findStudent.PhoneNumber = student.PhoneNumber; }
                        if (student.Name != null) { findStudent.Name = student.Name; }
                        if (student.JoiningDate != null) { findStudent.JoiningDate = student.JoiningDate; }
                        if (student.Title != null) { findStudent.Title = student.Title; }
                        if (student.Location != null) { findStudent.Location = student.Location; }
                        if (student.GradeID != 0) { findStudent.GradeID = student.GradeID; }

                        _context.SaveChanges();

                        transaction.Commit();

                        return _context.Students.FirstOrDefault(u => u.StudentId == id)
                            ?? throw new Exception($" Selected User not found"); ;
                    }
                    return new Student() { };
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                } 
            }
        }
    }
}