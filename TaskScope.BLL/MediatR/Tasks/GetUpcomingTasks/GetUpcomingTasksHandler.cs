using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.GetUpcomingTasks;

public class GetUpcomingTasksHandler : IRequestHandler<GetUpcomingTasksQuery, Result<List<TaskEntityDto>>>
{
    private readonly IRepositoryWrapper _repositoryWrapper;
    private readonly IMapper _mapper;

    public GetUpcomingTasksHandler(IRepositoryWrapper repositoryWrapper, IMapper mapper)
    {
        _repositoryWrapper = repositoryWrapper;
        _mapper = mapper;
    }

    public async Task<Result<List<TaskEntityDto>>> Handle(GetUpcomingTasksQuery request, CancellationToken cancellationToken)
    {
        var utcPlus2 = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
        var today = TimeZoneInfo.ConvertTime(DateTime.UtcNow, utcPlus2).Date;
        var tasks = await _repositoryWrapper.TaskRepository.GetAllAsync(startDate: today.AddDays(1));
        var taskDtos = _mapper.Map<List<TaskEntityDto>>(tasks);

        return Result.Ok(taskDtos);
    }
}
