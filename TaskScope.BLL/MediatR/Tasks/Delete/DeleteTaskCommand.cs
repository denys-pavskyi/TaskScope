using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.Delete;

public record DeleteTaskCommand(Guid Id) : IRequest<Result<TaskEntityDto>>;
