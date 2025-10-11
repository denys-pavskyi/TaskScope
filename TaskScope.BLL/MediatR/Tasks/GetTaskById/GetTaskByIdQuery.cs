using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.GetTaskById;

public record GetTaskByIdQuery(Guid TaskId) : IRequest<Result<TaskEntityDto>>;