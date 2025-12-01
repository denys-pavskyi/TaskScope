using System.Transactions;

namespace TaskScope.DAL.Repositories.Interfaces.Base;

public interface IRepositoryWrapper
{
    ITaskEntityRepository TaskRepository { get; }
    ITagRepository TagRepository { get; }
    ITaskEntityTagRepository TaskTagRepository { get; }

    public int SaveChanges();

    public Task<int> SaveChangesAsync();

    public TransactionScope BeginTransaction();
}