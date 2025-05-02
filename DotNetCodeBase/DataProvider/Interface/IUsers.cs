using DataProvider.Model;

namespace DataProvider.Interface
{
    public interface IUsers
    {
        public string Add(User user);
        public User Update(User user, int id);
        public string Delete(int id);
        public User GetSelectedUser(int id);
        Task <IEnumerable<User>> GetAllUsers();
        public byte[] ExportThereport(string type);
    }
}