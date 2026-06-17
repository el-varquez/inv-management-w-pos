using POS.Domain.Entities;

namespace POS.Domain.Interfaces;

public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IList<Transaction>> GetAllAsync(
        DateTime? from,
        DateTime? to,
        CancellationToken ct = default);
    Task<int> GetCountForTodayAsync(CancellationToken ct = default);
    Task AddAsync(Transaction transaction, CancellationToken ct = default);
    Task UpdateAsync(Transaction transaction, CancellationToken ct = default);
}