using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.TaskEntityTags;

namespace TaskScope.BLL.MediatR.TaskEntityTags.Create;

public record CreateTaskEntityTagCommand(CreateTaskEntityTagDto NewTaskEntityTag) : IRequest<Result<TaskEntityTagDto>>;
