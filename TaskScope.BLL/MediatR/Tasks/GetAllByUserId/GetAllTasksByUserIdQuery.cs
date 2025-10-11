using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.GetAllByUserId;

public record GetTasksByUserIdQuery(Guid UserId, DateTime? StartDate, DateTime? EndDate)
    : IRequest<Result<IEnumerable<TaskEntityDto>>>;