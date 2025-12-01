using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Enums;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.GetTodayAndOverdueGroupedByStatus;

public class GetTodayAndOverdueTasksGroupedByStatusHandler : IRequestHandler<GetTodayAndOverdueTasksGroupedByStatusQuery, Result<Dictionary<TaskEntityStatus, List<TaskEntityDto>>>>
{ 
    private readonly IRepositoryWrapper _repositoryWrapper; 
    private readonly IMapper _mapper;
    
    public GetTodayAndOverdueTasksGroupedByStatusHandler(IRepositoryWrapper repositoryWrapper, IMapper mapper) 
    { 
        _repositoryWrapper = repositoryWrapper; 
        _mapper = mapper;
    } 
    public async Task<Result<Dictionary<TaskEntityStatus, List<TaskEntityDto>>>> Handle(GetTodayAndOverdueTasksGroupedByStatusQuery request, CancellationToken cancellationToken) 
    { 
        var utcPlus2 = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
        var today = TimeZoneInfo.ConvertTime(DateTime.UtcNow, utcPlus2).Date;
        var tasks = await _repositoryWrapper.TaskRepository.GetTodayAndOverdueAsync(); 
        var taskDtos = _mapper.Map<IEnumerable<TaskEntityDto>>(tasks); 
        var grouped = taskDtos
            .GroupBy(t => t.Status)
            .ToDictionary(g => g.Key, g => g.ToList()); 
        return Result.Ok(grouped);
    }
}
