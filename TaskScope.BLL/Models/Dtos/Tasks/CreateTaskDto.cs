using TaskScope.DAL.Enums;

namespace TaskScope.BLL.Models.Dtos.Tasks;

public class CreateTaskDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public TaskEntityStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
}
