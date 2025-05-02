namespace DataProvider.Data
{
    public class Department
    {
        public ICollection<Employee> Employee { get; set; }
        public int                   ID       { get; set; }
        public string                Name     { get; set; }  
    }
}         