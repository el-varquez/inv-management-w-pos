using Microsoft.EntityFrameworkCore;
using POS.Application.Common.Interfaces;
using POS.Domain.Entities;

namespace POS.Infrastructure.Persistence;

/// <summary>
/// Seeds the default users. Idempotent — only inserts a user when no row with
/// the same email exists, so it is safe to run on every startup.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(
        AppDbContext db,
        IPasswordHasher passwordHasher,
        CancellationToken ct = default)
    {
        await EnsureUserAsync(db, passwordHasher,
            name: "Administrator", email: "admin@pos.local",
            password: "Admin123!", role: "Admin", ct);

        await EnsureUserAsync(db, passwordHasher,
            name: "Cashier", email: "cashier@pos.local",
            password: "Cashier123!", role: "Cashier", ct);

        await db.SaveChangesAsync(ct);
    }

    private static async Task EnsureUserAsync(
        AppDbContext db,
        IPasswordHasher passwordHasher,
        string name,
        string email,
        string password,
        string role,
        CancellationToken ct)
    {
        if (await db.Users.AnyAsync(u => u.Email == email, ct))
            return;

        db.Users.Add(new User
        {
            Name = name,
            Email = email,
            PasswordHash = passwordHasher.Hash(password),
            Role = role,
            IsActive = true
        });
    }
}
