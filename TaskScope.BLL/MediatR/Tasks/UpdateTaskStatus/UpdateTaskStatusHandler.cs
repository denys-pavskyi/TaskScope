using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.MediatR.Tasks.Update;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Entities;
using TaskScope.DAL.Enums;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.UpdateTaskStatus;

public class UpdateTaskStatusHandler : IRequestHandler<UpdateTaskStatusCommand, Result<TaskEntityDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;
    public UpdateTaskStatusHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TaskEntityDto>> Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
    {
        var task = await _repositoryWrapper.TaskRepository.GetFirstOrDefaultAsync(t => t.Id.Equals(request.TaskId));
        if (task == null)
        {
            return Result.Fail("Task not found");
        }

        if (task.Status == request.NewStatus)
        {
            return Result.Fail("Task already has this status");
        }
        if(task.Status == TaskEntityStatus.Done && request.NewStatus != TaskEntityStatus.Done)
        {
            task.CompletedAt = null;
        }

        task.Status = request.NewStatus;

        if (task.Status == TaskEntityStatus.Done)
        {
            task.CompletedAt = DateTime.UtcNow;
        }

        _repositoryWrapper.TaskRepository.Update(task);

        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;
        if (resultIsSuccess)
        {
            return Result.Ok(_mapper.Map<TaskEntityDto>(task));
        }

        return Result.Fail("Failed to change status of the task");
    }
}