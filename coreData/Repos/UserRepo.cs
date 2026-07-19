using coreLibrary.Helpers;
using coreData.Interfaces;
using coreData.Models;
using coreLibrary.Models;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using WildHare.Extensions;

namespace coreData.Repos;

public class UserRepo(DataContext dataContext)
: IUserRepo, IDisposable
{
	private bool _disposed;

	public IEnumerable<User> GetAllUsers()
	{
		return dataContext.Users;
	}

	public User GetUserByUserName(string username)
	{
		return dataContext.Users.FirstOrDefault(x => x.UserName.ToLower() == username.ToLower());
	}

	public User GetUserById(int userId)
	{
		return dataContext.Users.FirstOrDefault(x => x.UserId == userId);
	}

	public string GetUsernameById(int userId)
	{
		return GetUserById(userId)?.UserName ?? "Unknown";
	}

	public User CreateUser(UserToCreate model, string passwordHash)
	{
		var newUser = new User
		{
			UserName               = model.UserName,
			FirstName              = model.FirstName,
			LastName               = model.LastName,
			UserEmail              = model.UserEmail,
			RefreshToken           = model.RefreshToken,
			RefreshTokenExpiration = model.RefreshTokenExpiration,
			Role                   = model.Role,
			PasswordHash           = passwordHash,
		};

		dataContext.Add(newUser);
		dataContext.SaveChanges();

		return newUser;
	}

	public PagedList<User, SearchForUser> GetPagedUsers(Pager<SearchForUser> pager)
	{
		var predicate = BuildPredicate(pager);

		var query = dataContext.Users.Where(predicate);

		pager.TotalCount = query.Count();
		var listItems = query.OrderBy(p => p.LastName ?? "")
							.Skip(pager.FirstRecordInPage - 1)
							.Take(pager.PageSize)
							.ToList();

		var pagedList = new PagedList<User, SearchForUser>
		{
			ListItems = listItems,
			Pager     = pager
		};

		return pagedList;
	}

	public User SaveUser(User user)
	{
		// Only update the columns that saveUser is responsible for - leave auth fields untouched

		dataContext.Users
			.Where(u => u.UserId == user.UserId)
			.ExecuteUpdate(s => s
				.SetProperty(u => u.UserName,     user.UserName)
				.SetProperty(u => u.FirstName,    user.FirstName)
				.SetProperty(u => u.LastName,     user.LastName)
				.SetProperty(u => u.UserEmail,    user.UserEmail)
				.SetProperty(u => u.Role,         user.Role)
				.SetProperty(u => u.IsActive,     user.IsActive)
				.SetProperty(u => u.DateModified, user.DateModified)
				.SetProperty(u => u.ModifierId,   user.ModifierId)
			);

		return user;
	}

	public User UpdateRefreshToken(User user)
	{
		// Only update the refresh token fields - leave all other user data untouched

		dataContext.Users
			.Where(u => u.UserId == user.UserId)
			.ExecuteUpdate(s => s
				.SetProperty(u => u.RefreshToken,           user.RefreshToken)
				.SetProperty(u => u.RefreshTokenIssuedAt,   user.RefreshTokenIssuedAt)
				.SetProperty(u => u.RefreshTokenExpiration, user.RefreshTokenExpiration)
				.SetProperty(u => u.RefreshTokenRevokedAt,  user.RefreshTokenRevokedAt)
			);

		return user;
	}

	// =======================================================================================

	private static ExpressionStarter<User> BuildPredicate(Pager<SearchForUser> pager, bool search = true)
	{
		var options = StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries;

		// 'search' true means start with all, otherwise will start with empty.
		// PredicateBuilder with no parameter will start with an empty list
		// or populate with true to include all records

		var predicate    = search ? PredicateBuilder.New<User>(true) : PredicateBuilder.New<User>();
		string[] filters = pager.Search.Filter.Split(',', options);

		foreach (string filter in filters)
		{
			if (filter.IsNullOrSpace())
				continue;

			if (filter.IsNumeric())
			{
				predicate = predicate.Or(p => p.UserId == filter.ToInt(0));
			}
			else
			{
				predicate = predicate.Or(UserNameFilter(filter));
				predicate = predicate.Or(p => p.FirstName.StartsWith(filter));
				predicate = predicate.Or(p => p.LastName.StartsWith(filter));
				predicate = predicate.Or(p => p.UserEmail.StartsWith(filter));
			}
		}

		if (!pager.Search.RoleFilter.IsNullOrSpace())
		{
			predicate = predicate.And(account => account.Role.Equals(pager.Search.RoleFilter));
		}

		return predicate;
	}

	private static Expression<Func<User, bool>> UserNameFilter(string f)
	{
		return p => p.UserName.StartsWith(f);
	}

	protected virtual void Dispose(bool disposing)
	{
		if (!_disposed)
		{
			if (disposing)
				dataContext.Dispose();

			_disposed = true;
		}
	}

	public void Dispose()
	{
		Dispose(true);
		GC.SuppressFinalize(this);
	}
}

