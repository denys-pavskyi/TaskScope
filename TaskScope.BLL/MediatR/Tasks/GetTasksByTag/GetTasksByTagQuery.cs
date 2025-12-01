using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.GetTasksByTag;

public record GetTasksByTagQuery(Guid TagId) : IRequest<Result<IEnumerable<TaskEntityDto>>>;