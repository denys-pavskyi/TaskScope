using System.ComponentModel.DataAnnotations;

namespace TaskScope.DAL.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Surname { get; set; }

    [Required]
    [MaxLength(30)]
    public string? UserName { get; set; }

    [Required]
    [MaxLength(60)]
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }

    [Required]
    [MaxLength(20)]
    public string Provider { get; set; } = "Local"; // "Local"/"Google"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TaskEntity> Tasks { get; set; } = new List<TaskEntity>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}