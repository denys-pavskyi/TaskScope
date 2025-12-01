using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.Update;

public record UpdateTaskCommand(UpdateTaskDto NewTask) : IRequest<Result<TaskEntityDto>>;