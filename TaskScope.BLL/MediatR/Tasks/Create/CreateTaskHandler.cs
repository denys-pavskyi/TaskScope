using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Entities;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.Create;

public class CreateTaskHandler : IRequestHandler<CreateTaskCommand, Result<TaskEntityDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;
    public CreateTaskHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TaskEntityDto>> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var taskEntity = _mapper.Map<TaskEntity>(request.NewTask);
        var createdTask = await _repositoryWrapper.TaskRepository.CreateAsync(taskEntity);
        var createdTaskDto = _mapper.Map<TaskEntityDto>(createdTask);

        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;
        if (resultIsSuccess)
        {
            return Result.Ok(_mapper.Map<TaskEntityDto>(createdTaskDto));
        }

        return Result.Fail("Failed to create task");
    }
}