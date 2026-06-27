using MediatR;

namespace POS.Application.Profile.Queries.GetProfile;

public record GetProfileQuery() : IRequest<ProfileDto>;

public record ProfileAccountDto(Guid Id, string Name, string Email, string Role);

public record ProfileBusinessDto(Guid TenantId, string Name, int CashierCap, int ActiveCashiers);

public record ProfileDto(ProfileAccountDto Account, ProfileBusinessDto Business);
