using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tasks.Delete;

public class DeleteTaskHandler : IRequestHandler<DeleteTaskCommand, Result<TaskEntityDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;

    public DeleteTaskHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TaskEntityDto>> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _repositoryWrapper.TaskRepository.GetFirstOrDefaultAsync(
            t => t.Id.Equals(request.Id));

        if (task is null)
        {
            return Result.Fail("Task not found");
        }

        if (!task.UserId.Equals(request.UserId))
        {
            return Result.Fail("User doesn't have access to this task");
        }

        _repositoryWrapper.TaskRepository.Delete(task);
        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;
        if (resultIsSuccess)
        {
            var mappedTask = _mapper.Map<TaskEntityDto>(task);
            return Result.Ok(mappedTask);
        }
        else
        {
            return Result.Fail("Deletion failed");
        }

    }
}