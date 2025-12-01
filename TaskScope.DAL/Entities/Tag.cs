using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskScope.DAL.Entities;

public class Tag
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string Name { get; set; } = null!;

    [Required]
    [MaxLength(7)]
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<TaskEntityTag> TaskTags { get; set; } = new List<TaskEntityTag>();
}