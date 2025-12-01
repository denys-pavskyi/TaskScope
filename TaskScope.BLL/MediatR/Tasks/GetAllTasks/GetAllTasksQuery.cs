using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.GetAll;

public record GetAllTasksQuery(DateTime? StartDate, DateTime? EndDate)
    : IRequest<Result<IEnumerable<TaskEntityDto>>>;