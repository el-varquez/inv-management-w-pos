using POS.Domain.Entities;

namespace POS.Domain.Interfaces;

public interface ITenantRepository
{
    Task AddAsync(Tenant tenant, CancellationToken ct = default);
}
