using System.ComponentModel.DataAnnotations;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.DAL.Entities;
using TaskScope.DAL.Enums;

namespace TaskScope.BLL.Models.Dtos.Tasks;

public class TaskEntityDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public TaskEntityStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }

    public List<TagDto> Tags { get; set; } = new();
}