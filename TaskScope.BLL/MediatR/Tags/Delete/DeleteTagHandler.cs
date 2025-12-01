using AutoMapper;
using FluentResults;
using MediatR;
using TagScope.BLL.MediatR.Tags.Delete;
using TaskScope.BLL.MediatR.Tags.Delete;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TagScope.BLL.MediatR.Tags.Delete;

public class DeleteTagHandler : IRequestHandler<DeleteTagCommand, Result<TagDto>>
{
    private readonly IMapper _mapper;
    private readonly IRepositoryWrapper _repositoryWrapper;

    public DeleteTagHandler(IMapper mapper, IRepositoryWrapper repositoryWrapper)
    {
        _mapper = mapper;
        _repositoryWrapper = repositoryWrapper;
    }

    public async Task<Result<TagDto>> Handle(DeleteTagCommand request, CancellationToken cancellationToken)
    {
        var tag = await _repositoryWrapper.TagRepository.GetFirstOrDefaultAsync(
            t => t.Id.Equals(request.Id));

        if (tag is null)
        {
            return Result.Fail("Tag not found");
        }

        _repositoryWrapper.TagRepository.Delete(tag);
        var resultIsSuccess = await _repositoryWrapper.SaveChangesAsync() > 0;
        if (resultIsSuccess)
        {
            var mappedTag = _mapper.Map<TagDto>(tag);
            return Result.Ok(mappedTag);
        }
        else
        {
            return Result.Fail("Deletion failed");
        }

    }
}