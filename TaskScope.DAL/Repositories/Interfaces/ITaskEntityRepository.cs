using TaskScope.DAL.Entities;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.DAL.Repositories.Interfaces;

public interface ITaskEntityRepository: IRepositoryBase<TaskEntity>
{
    Task<IEnumerable<TaskEntity>> GetAllByUserIdAsync(
        Guid userId,
        DateTime? startDate = null,
        DateTime? endDate = null);
}