using System.Transactions;
using TaskScope.DAL.Persistence;
using TaskScope.DAL.Repositories.Interfaces;
using TaskScope.DAL.Repositories.Interfaces.Base;

namespace TaskScope.DAL.Repositories.Realizations.Base;

public class RepositoryWrapper: IRepositoryWrapper
{
    private readonly TaskScopeDbContext _dbContext;

    private IUserRepository _userRepository;
    private ITaskEntityRepository _taskRepository;
    private ITagRepository _tagRepository;
    private ITaskEntityTagRepository _taskTagRepository;
    public RepositoryWrapper(TaskScopeDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IUserRepository UserRepository
    {
        get
        {
            if (_userRepository is null)
            {
                _userRepository = new UserRepository(_dbContext);
            }
                
            return _userRepository;
        }
    }

    public ITaskEntityRepository TaskRepository
    {
        get
        {
            if (_taskRepository is null)
            {
                _taskRepository = new TaskEntityRepository(_dbContext);
            }
                
            return _taskRepository;
        }
    }

    public ITagRepository TagRepository
    {
        get
        {
            if (_tagRepository is null)
            {
                _tagRepository = new TagRepository(_dbContext);
            }
                
            return _tagRepository;
        }
    }

    public ITaskEntityTagRepository TaskTagRepository
    {
        get
        {
            if (_taskTagRepository is null)
            {
                _taskTagRepository = new TaskEntityTagRepository(_dbContext);
            }
                
            return _taskTagRepository;
        }
    }

    public int SaveChanges()
    {
        return _dbContext.SaveChanges();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _dbContext.SaveChangesAsync();
    }

    public TransactionScope BeginTransaction()
    {
        return new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
    }

}