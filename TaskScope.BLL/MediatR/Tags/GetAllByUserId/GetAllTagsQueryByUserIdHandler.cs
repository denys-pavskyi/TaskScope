using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.MediatR.Tasks.GetAllByUserId;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tags.GetAll;

public class GetAllTagsQueryByUserIdHandler : IRequestHandler<GetAllTagsByUserIdQuery, Result<IEnumerable<TagDto>>>
{
    private readonly IRepositoryWrapper _repositoryWrapper;
    private readonly IMapper _mapper;

    public GetAllTagsQueryByUserIdHandler(IRepositoryWrapper repositoryWrapper, IMapper mapper)
    {
        _repositoryWrapper = repositoryWrapper;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TagDto>>> Handle(GetAllTagsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var tags = await _repositoryWrapper.TaskRepository.GetAllAsync(
            predicate: t => t.UserId.Equals(request.UserId));
        var tagsDtos = _mapper.Map<IEnumerable<TagDto>>(tags);
        return Result.Ok(tagsDtos);
    }

}