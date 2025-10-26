using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Enums;

namespace TaskScope.BLL.MediatR.Tasks.GetTodayAndOverdueGroupedByStatus;

public record GetTodayAndOverdueTasksGroupedByStatusQuery(Guid UserId)
 : IRequest<Result<Dictionary<TaskEntityStatus, List<TaskEntityDto>>>>;
