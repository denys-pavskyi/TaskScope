using System.ComponentModel.DataAnnotations.Schema;

namespace TaskScope.DAL.Entities;

public class TaskEntityTag
{
    public Guid TaskId { get; set; }
    public TaskEntity Task { get; set; } = null!;
    public Guid TagId { get; set; }
    public Tag Tag { get; set; } = null!;
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
}