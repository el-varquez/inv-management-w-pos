using POS.Domain.Entities;

namespace POS.Domain.Interfaces;

public interface IITemRepository
{
    Task<Item?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<Item>> GetAllAsync(CancellationToken ct = default);
    Task<List<Item>> GetLowStockAsync(CancellationToken ct = default);
    Task AddAsync(Item item, CancellationToken ct = default);
    Task UpdateAsync(Item item, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}