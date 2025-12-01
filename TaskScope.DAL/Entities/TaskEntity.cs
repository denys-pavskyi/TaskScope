using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskScope.DAL.Enums;

namespace TaskScope.DAL.Entities;

public class TaskEntity
{
    [Key]
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public TaskEntityStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public ICollection<TaskEntityTag> TaskTags { get; set; } = new List<TaskEntityTag>();
}