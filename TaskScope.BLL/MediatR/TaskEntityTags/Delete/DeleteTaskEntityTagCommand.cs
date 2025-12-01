using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.TaskEntityTags;

namespace TaskScope.BLL.MediatR.TaskEntityTags.Delete;

public record DeleteTaskEntityTagCommand(Guid TaskId, Guid TagId) : IRequest<Result<TaskEntityTagDto>>;
