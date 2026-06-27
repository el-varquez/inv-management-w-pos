using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using POS.Application.Profile.Queries.GetProfile;
using POS.Application.Profile.Commands.ChangePassword;
using POS.Application.Profile.Commands.UpdateProfile;
using POS.Application.Platform.Commands.CreateTenant;
using POS.Domain.Entities;
using POS.Domain.Exceptions;
using POS.Infrastructure.Persistence;
using POS.Infrastructure.Persistence.Repositories;
using POS.Infrastructure.Services;
using POS.Infrastructure.Tests.Fakes;
using Xunit;

namespace POS.Infrastructure.Tests;

public class ProfileModuleTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly AppDbContext _ctx;
    private readonly UserRepository _users;
    private readonly TenantRepository _tenants;
    private readonly UnitOfWork _uow;
    private readonly PasswordHasher _hasher = new();

    public ProfileModuleTests()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        _ctx = new AppDbContext(options, new FakeCurrentUser { TenantId = null });
        _ctx.Database.EnsureCreated();

        _users = new UserRepository(_ctx);
        _tenants = new TenantRepository(_ctx);
        _uow = new UnitOfWork(_ctx);
    }

    private async Task<Guid> SeedTenantAsync(string email = "owner@store.ph", int cap = 5)
        => await new CreateTenantCommandHandler(_tenants, _users, _uow, _hasher).Handle(
            new CreateTenantCommand("Store", "Owner", email, "password123", cap),
            CancellationToken.None);

    private async Task<User> AdminOf(Guid tenantId)
        => await _ctx.Users.SingleAsync(u => u.TenantId == tenantId && u.Role == "Admin");

    private async Task AddCashierAsync(Guid tenantId, string email, bool active = true)
    {
        await _users.AddAsync(new User
        {
            Name = "Cashier",
            Email = email,
            PasswordHash = _hasher.Hash("password123"),
            Role = "Cashier",
            IsActive = active,
            TenantId = tenantId
        });
        await _uow.SaveChangesAsync();
    }

    [Fact]
    public async Task GetProfile_returns_account_and_business_with_active_cashier_count()
    {
        var tenantId = await SeedTenantAsync(cap: 5);
        var admin = await AdminOf(tenantId);
        await AddCashierAsync(tenantId, "a@store.ph", active: true);
        await AddCashierAsync(tenantId, "b@store.ph", active: false);

        var handler = new GetProfileQueryHandler(
            new FakeCurrentUser { Id = admin.Id, Role = "Admin", TenantId = tenantId },
            _users, _tenants);

        var result = await handler.Handle(new GetProfileQuery(), CancellationToken.None);

        Assert.Equal(admin.Id, result.Account.Id);
        Assert.Equal("owner@store.ph", result.Account.Email);
        Assert.Equal("Admin", result.Account.Role);
        Assert.Equal("Store", result.Business.Name);
        Assert.Equal(5, result.Business.CashierCap);
        Assert.Equal(1, result.Business.ActiveCashiers);
    }

    private ChangePasswordCommandHandler ChangePasswordHandler(Guid userId) =>
        new(new FakeCurrentUser { Id = userId, Role = "Admin" }, _users, _uow, _hasher);

    [Fact]
    public async Task ChangePassword_with_wrong_current_is_rejected_and_hash_unchanged()
    {
        var tenantId = await SeedTenantAsync();
        var admin = await AdminOf(tenantId);
        var originalHash = admin.PasswordHash;

        await Assert.ThrowsAsync<DomainException>(() =>
            ChangePasswordHandler(admin.Id).Handle(
                new ChangePasswordCommand("wrongpassword", "newpassword123"),
                CancellationToken.None));

        var unchanged = await _ctx.Users.SingleAsync(u => u.Id == admin.Id);
        Assert.Equal(originalHash, unchanged.PasswordHash);
    }

    [Fact]
    public async Task ChangePassword_with_correct_current_rehashes()
    {
        var tenantId = await SeedTenantAsync();
        var admin = await AdminOf(tenantId);

        await ChangePasswordHandler(admin.Id).Handle(
            new ChangePasswordCommand("password123", "newpassword123"),
            CancellationToken.None);

        var updated = await _ctx.Users.SingleAsync(u => u.Id == admin.Id);
        Assert.True(_hasher.Verify("newpassword123", updated.PasswordHash));
    }

    [Fact]
    public async Task ChangePassword_rejects_reusing_current_password()
    {
        var tenantId = await SeedTenantAsync();
        var admin = await AdminOf(tenantId);

        await Assert.ThrowsAsync<DomainException>(() =>
            ChangePasswordHandler(admin.Id).Handle(
                new ChangePasswordCommand("password123", "password123"),
                CancellationToken.None));
    }

    [Fact]
    public void ChangePassword_validator_rejects_short_new_password()
    {
        var result = new ChangePasswordCommandValidator()
            .Validate(new ChangePasswordCommand("password123", "short"));
        Assert.False(result.IsValid);
    }

    private UpdateProfileCommandHandler UpdateProfileHandler(Guid userId) =>
        new(new FakeCurrentUser { Id = userId, Role = "Admin" }, _users, _uow);

    [Fact]
    public async Task UpdateProfile_changes_name()
    {
        var tenantId = await SeedTenantAsync();
        var admin = await AdminOf(tenantId);

        await UpdateProfileHandler(admin.Id).Handle(
            new UpdateProfileCommand("Renamed Owner"),
            CancellationToken.None);

        var updated = await _ctx.Users.SingleAsync(u => u.Id == admin.Id);
        Assert.Equal("Renamed Owner", updated.Name);
    }

    [Fact]
    public void UpdateProfile_validator_rejects_blank_name()
    {
        var result = new UpdateProfileCommandValidator()
            .Validate(new UpdateProfileCommand("  "));
        Assert.False(result.IsValid);
    }

    public void Dispose()
    {
        _ctx.Dispose();
        _connection.Dispose();
    }
}
