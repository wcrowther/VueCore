using coreLibrary.Helpers;
using coreData.Interfaces;
using coreData.Models;
using coreLibrary.Models;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using WildHare.Extensions;

namespace coreData.Repos;

public class AccountRepo(DataContext dataContext) : IAccountRepo
{
	public virtual async Task<PagedList<Account, SearchForAccount>> GetPagedAccounts(Pager<SearchForAccount> pager)
	{
		var predicate = BuildPredicate(pager);

		var query = dataContext.Accounts.Where(predicate);

		// Debug.WriteLine($"GetPagedAccounts query: {query.ToQueryString()}");

		pager.TotalCount = await query.CountAsync();
		var listItems    = await query.OrderBy(p => p.AccountName)
								.Skip(pager.FirstRecordInPage - 1)
								.Take(pager.PageSize)
								.ToListAsync();

		var pagedList = new PagedList<Account, SearchForAccount>
		{
			ListItems = listItems,
			Pager     = pager
		};

		return pagedList;
	}

	public async Task<List<Account>> GetAllAccounts()
	{
		return await dataContext.Accounts.ToListAsync();
	}

	public async Task<Account> GetAccountById(int accountId)
	{
		var account = await dataContext
							.Accounts
							.FirstOrDefaultAsync(x => x.AccountId == accountId);
		return account;
	}

	public async Task<Account> SaveAccount(Account account)
	{
		dataContext.Update(account);
		await dataContext.SaveChangesAsync();

		return account;
	}

	// =======================================================================================

	private static ExpressionStarter<Account> BuildPredicate(Pager<SearchForAccount> pager, bool search = true)
	{
		// 'search' true means start with all, otherwise will start with empty.
		// PredicateBuilder with no parameter will start with an empty list
		// or populate with true to include all records

		var predicate    = search ? PredicateBuilder.New<Account>(true) : PredicateBuilder.New<Account>();
		string filterType = pager.Search.FilterType.ToLower();
		string[] filters  = pager.Search?.Filter.Split(",", true, true) ?? [];

		foreach (string filter in filters)
		{
			if (filter.IsNullOrSpace())
				continue;

			if (filter.IsNumeric())
				predicate = predicate.Or(p => p.AccountId == filter.ToInt(0));
			else
				predicate = predicate.Or(AccountNameFilter(filterType, filter.ToLower()));
		}

		var validStateProvinces = pager.Search.StateProvinceFilter?.Where(w => !string.IsNullOrWhiteSpace(w)).ToArray() ?? [];

		if (validStateProvinces.Length > 0)
		{
			predicate = predicate.And(account => validStateProvinces.Contains(account.StateProvince));
		}

		if (!pager.Search.PostalCodeFilter.IsNullOrSpace())
		{
			predicate = predicate.And(account => account.PostalCode.StartsWith(pager.Search.PostalCodeFilter));
		}

		return predicate;
	}

	private static Expression<Func<Account, bool>> AccountNameFilter(string filterType, string filter) =>
		filterType switch
		{
			""           => acct => acct.AccountName.StartsWith(filter), // Default if empty
			"startswith" => acct => acct.AccountName.StartsWith(filter),
			"contains"   => acct => acct.AccountName.ToLower().Contains(filter),
			"endswith"   => acct => acct.AccountName.EndsWith(filter),
			_ => throw new ArgumentException($"Unknown AccountName FilterType: {filterType}")
		};
}

// =================================================================================================================
// Use SeedPacket to generate list
// private List<Account> Accounts => new List<Account>().Seed(127, new Random(43454)).ToList();

