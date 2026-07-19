using coreData.Interfaces;
using coreData.Models;
using Microsoft.EntityFrameworkCore;

namespace coreData;

public class DataContext(DbContextOptions<DataContext> options,
						ICurrentUserProvider currentUserProvider)
: DbContext(options)
{
	public override int SaveChanges()
	{
		ApplyAuditInfo();
		return base.SaveChanges();
	}

	public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
	{
		ApplyAuditInfo();
		return await base.SaveChangesAsync(cancellationToken);
	}

	public DbSet<Account> Accounts { get; set; }

	public DbSet<User> Users { get; set; }

	public DbSet<Message> Messages { get; set; }

	// ============================================================================================================

	private void ApplyAuditInfo()
	{
		var now    = DateTime.Now;
		var userId = currentUserProvider.GetCurrentUserId();

		if (userId == null)
			return;

		foreach (var entry in ChangeTracker.Entries<IAuditable>())
		{
			if (entry.State == EntityState.Added)
			{
				entry.Entity.DateCreated = now;
				entry.Entity.CreatorId   = userId.Value;
			}

			if (entry.State == EntityState.Added || entry.State == EntityState.Modified)
			{
				entry.Entity.DateModified = now;
				entry.Entity.ModifierId   = userId.Value;
			}
		}
	}
}
