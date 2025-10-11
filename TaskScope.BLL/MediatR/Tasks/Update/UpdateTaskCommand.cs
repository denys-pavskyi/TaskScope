using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.Update;

public record UpdateTaskCommand(TaskEntityDto NewTask) : IRequest<Result<TaskEntityDto>>;