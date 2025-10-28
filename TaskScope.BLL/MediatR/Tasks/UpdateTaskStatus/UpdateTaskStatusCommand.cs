using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Enums;

namespace TaskScope.BLL.MediatR.Tasks.UpdateTaskStatus;

public record UpdateTaskStatusCommand(Guid TaskId, TaskEntityStatus NewStatus) : IRequest<Result<TaskEntityDto>>;