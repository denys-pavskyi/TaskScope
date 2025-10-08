namespace TaskScope.DAL.Entities;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<TaskEntityTag> TaskTags { get; set; } = new List<TaskEntityTag>();
}