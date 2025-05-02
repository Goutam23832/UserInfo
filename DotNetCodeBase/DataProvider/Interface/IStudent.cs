using DataProvider.Data;

namespace DataProvider.Interface
{
    public interface IStudent
    {
        public string Add(Student student);
        public Student Update(Student student, int id);
        public bool Delete(int studentId);
        public Student GetSelectedUser(int studentId);
        Task<IEnumerable<Student>> GetAllStudent();
    }
}