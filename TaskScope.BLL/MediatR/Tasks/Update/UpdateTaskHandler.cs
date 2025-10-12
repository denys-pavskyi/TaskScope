using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.MediatR.Tasks.Create;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Entities;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.Update;

public class UpdateTaskHandler : IRequestHandler<UpdateTaskCommand, Result<TaskEntityDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;
    public UpdateTaskHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TaskEntityDto>> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        var taskEntity = _mapper.Map<TaskEntity>(request.NewTask);
        
        _repositoryWrapper.TaskRepository.Update(taskEntity);
        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;
        if (resultIsSuccess)
        {
            return Result.Ok(_mapper.Map<TaskEntityDto>(taskEntity));
        }

        return Result.Fail("Failed to create task");
    }
}