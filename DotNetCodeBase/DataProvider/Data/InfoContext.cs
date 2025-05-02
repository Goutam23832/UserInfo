using DataProvider.Model;
using Microsoft.EntityFrameworkCore;

namespace DataProvider.Data 
{
    public class InfoContext : DbContext                                  
    {
        public InfoContext(DbContextOptions<InfoContext> options) 
            : base(options) 
        {
        }

        public DbSet<Employee>   Employees   { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Student>    Students    { get; set; }
        public DbSet<Grade>      Grades      { get; set; }
        public DbSet<User>       Users       { get; set; }
    }
}
     