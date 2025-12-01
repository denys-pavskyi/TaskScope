using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.Models.Dtos.TaskEntityTags;
using TaskScope.DAL.Entities;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.TaskEntityTags.Create;

public class CreateTaskEntityTagHandler : IRequestHandler<CreateTaskEntityTagCommand, Result<TaskEntityTagDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;

    public CreateTaskEntityTagHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TaskEntityTagDto>> Handle(CreateTaskEntityTagCommand request, CancellationToken cancellationToken)
    {
        var task = await _repositoryWrapper.TaskRepository.GetFirstOrDefaultAsync(
            t => t.Id.Equals(request.NewTaskEntityTag.TaskId));

        if (task is null)
        {
            return Result.Fail("Task not found");
        }

        var tag = await _repositoryWrapper.TagRepository.GetFirstOrDefaultAsync(
            t => t.Id.Equals(request.NewTaskEntityTag.TagId));

        if (tag is null)
        {
            return Result.Fail("Tag not found");
        }

        var taskEntityTag = new TaskEntityTag
        {
            TaskId = request.NewTaskEntityTag.TaskId,
            TagId = request.NewTaskEntityTag.TagId
        };

        var createdTaskEntityTag = await _repositoryWrapper.TaskTagRepository.CreateAsync(taskEntityTag);
        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;
        
        if (resultIsSuccess)
        {
            var mappedTaskEntityTag = _mapper.Map<TaskEntityTagDto>(createdTaskEntityTag);
            return Result.Ok(mappedTaskEntityTag);
        }

        return Result.Fail("Failed to create task entity tag");
    }
}
