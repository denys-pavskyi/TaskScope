using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.MediatR.Tasks.GetAll;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.GetAll;

public class GetAllTasksHandler : IRequestHandler<GetAllTasksQuery, Result<IEnumerable<TaskEntityDto>>>
{
    private readonly IRepositoryWrapper _repositoryWrapper;
    private readonly IMapper _mapper;

    public GetAllTasksHandler(IRepositoryWrapper repositoryWrapper, IMapper mapper)
    {
        _repositoryWrapper = repositoryWrapper;
        _mapper = mapper;
    }   

    public async Task<Result<IEnumerable<TaskEntityDto>>> Handle(GetAllTasksQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _repositoryWrapper.TaskRepository.GetAllAsync(request.StartDate, request.EndDate);
        var taskDtos = _mapper.Map<IEnumerable<TaskEntityDto>>(tasks);
        return Result.Ok(taskDtos);
    }

}