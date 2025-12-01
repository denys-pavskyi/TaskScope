using AutoMapper;
using FluentResults;
using MediatR;
using TaskScope.BLL.MediatR.Tasks.GetAll;
using TaskScope.BLL.Models.Dtos.Tags;
using TaskScope.BLL.Models.Dtos.Tasks;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.BLL.MediatR.Tags.GetAll;

public class GetAllTagsHandler : IRequestHandler<GetAllTagsQuery, Result<IEnumerable<TagDto>>>
{
    private readonly IRepositoryWrapper _repositoryWrapper;
    private readonly IMapper _mapper;

    public GetAllTagsHandler(IRepositoryWrapper repositoryWrapper, IMapper mapper)
    {
        _repositoryWrapper = repositoryWrapper;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TagDto>>> Handle(GetAllTagsQuery request, CancellationToken cancellationToken)
    {
        var tags = await _repositoryWrapper.TaskRepository.GetAllAsync();
        var tagsDtos = _mapper.Map<IEnumerable<TagDto>>(tags);
        return Result.Ok(tagsDtos);
    }

}