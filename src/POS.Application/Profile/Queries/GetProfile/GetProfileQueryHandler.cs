using MediatR;
using POS.Application.Common.Interfaces;
using POS.Domain.Exceptions;
using POS.Domain.Interfaces;

namespace POS.Application.Profile.Queries.GetProfile;

public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, ProfileDto>
{
    private readonly ICurrentUser _currentUser;
    private readonly IUserRepository _userRepository;
    private readonly ITenantRepository _tenantRepository;

    public GetProfileQueryHandler(
        ICurrentUser currentUser,
        IUserRepository userRepository,
        ITenantRepository tenantRepository)
    {
        _currentUser = currentUser;
        _userRepository = userRepository;
        _tenantRepository = tenantRepository;
    }

    public async Task<ProfileDto> Handle(GetProfileQuery request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(_currentUser.Id, ct)
            ?? throw new NotFoundException("User", _currentUser.Id);

        var tenantId = user.TenantId
            ?? throw new NotFoundException("Tenant", _currentUser.Id);

        var tenant = await _tenantRepository.GetByIdAsync(tenantId, ct)
            ?? throw new NotFoundException("Tenant", tenantId);

        var activeCashiers = await _userRepository.CountActiveCashiersAsync(tenantId, ct);

        return new ProfileDto(
            new ProfileAccountDto(user.Id, user.Name, user.Email, user.Role),
            new ProfileBusinessDto(tenant.Id, tenant.Name, tenant.CashierCap, activeCashiers));
    }
}
