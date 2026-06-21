using POS.Domain.Entities;
using POS.Domain.Interfaces;

namespace POS.Infrastructure.Persistence.Repositories;

public class TenantRepository : ITenantRepository
{
    private readonly AppDbContext _context;

    public TenantRepository(AppDbContext context) => _context = context;

    public async Task AddAsync(Tenant tenant, CancellationToken ct = default)
        => await _context.Tenants.AddAsync(tenant, ct);
}
