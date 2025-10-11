using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.Create;

public record CreateTaskCommand(TaskEntityDto NewTask) : IRequest<Result<TaskEntityDto>>;
