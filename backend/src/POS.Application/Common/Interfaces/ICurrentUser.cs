namespace POS.Application.Common.Interfaces;

public interface ICurrentUser
{
    Guid Id { get; }
    string Role { get; }

    /// <summary>Current tenant from the JWT. Null for SuperAdmin / anonymous.</summary>
    Guid? TenantId { get; }
}