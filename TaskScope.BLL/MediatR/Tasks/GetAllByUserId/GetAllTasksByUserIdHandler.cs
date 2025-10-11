using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.GetAllByUserId;

public class GetAllTasksByUserIdHandler : IRequestHandler<GetTasksByUserIdQuery, Result<IEnumerable<TaskEntityDto>>>
{
    private readonly IRepositoryWrapper _repositoryWrapper;
    private readonly IMapper _mapper;

    public GetAllTasksByUserIdHandler(IRepositoryWrapper repositoryWrapper, IMapper mapper)
    {
        _repositoryWrapper = repositoryWrapper;
        _mapper = mapper;
    }   

    public async Task<Result<IEnumerable<TaskEntityDto>>> Handle(GetTasksByUserIdQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _repositoryWrapper.TaskRepository.GetAllByUserIdAsync(request.UserId, request.StartDate, request.EndDate);
        var taskDtos = _mapper.Map<IEnumerable<TaskEntityDto>>(tasks);
        return Result.Ok(taskDtos);
    }

}