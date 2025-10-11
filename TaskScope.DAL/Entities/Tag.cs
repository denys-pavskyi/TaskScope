using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskScope.DAL.Entities;

public class Tag
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
    public ICollection<TaskEntityTag> TaskTags { get; set; } = new List<TaskEntityTag>();
}