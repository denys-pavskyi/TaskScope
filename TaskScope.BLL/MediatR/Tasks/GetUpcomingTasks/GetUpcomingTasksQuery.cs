using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;

namespace TaskScope.BLL.MediatR.Tasks.GetUpcomingTasks;

public record GetUpcomingTasksQuery() : IRequest<Result<List<TaskEntityDto>>>;
