using coreApi.Data.Interfaces;
using coreApi.Models;
using coreApi.Models.Generic;
using coreLogic.Helpers;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq.Expressions;
using WildHare.Extensions;

namespace coreApi.Data;

public class AccountRepo(CoreApiDataContext coreApiDataContext) : IAccountRepo
{
	public virtual async Task<PagedList<Account,SearchForAccount>> GetPagedAccounts(Pager<SearchForAccount> pager)
	{
		var predicate = BuildPredicate(pager);

		var query = coreApiDataContext.Accounts.Where(predicate);

		// Debug.WriteLine($"GetPagedAccounts query: {query.ToQueryString()}");

		pager.TotalCount = await query.CountAsync();
		var listItems	 = await query.OrderBy(p => p.AccountName)
								.Skip(pager.FirstRecordInPage - 1)
								.Take(pager.PageSize)
								.ToListAsync();

		var pagedList = new PagedList<Account,SearchForAccount>
		{
			ListItems   = listItems,
			Pager       = pager
		};

		return pagedList;
	}

	public async Task<List<Account>> GetAllAccounts()
	{
		return await coreApiDataContext.Accounts.ToListAsync();
	}

	public async Task<Account> GetAccountById(int accountId)
	{
		var account =    await coreApiDataContext
								.Accounts
								.FirstOrDefaultAsync(x => x.AccountId == accountId);
		return account;
	}

	public async Task<Account> SaveAccount(Account account)
	{
		coreApiDataContext.Update(account);
		await coreApiDataContext.SaveChangesAsync();

		return account;
	}

	// =======================================================================================

	private static ExpressionStarter<Account> BuildPredicate(Pager<SearchForAccount> pager, bool search = true)
	{
		// 'search' true means start with all, otherwise will start with empty.
		// PredicateBuilder with no parameter will start with an empty list
		// or populate with true to include all records

		var predicate		= search ? PredicateBuilder.New<Account>(true) : PredicateBuilder.New<Account>();
		string filterType	= pager.Search.FilterType.ToLower();
		string[] filters	= pager.Search?.Filter.Split(",", true, true) ?? [];

		foreach (string filter in filters)
		{
			if (filter.IsNullOrSpace())
				continue;

			if (filter.IsNumeric())
				predicate = predicate.Or(p => p.AccountId == filter.ToInt(0));
			else
				predicate = predicate.Or(AccountNameFilter(filterType, filter.ToLower()));
		}

		if (pager.Search.StateProvinceFilter?.Length > 0)
		{
			predicate = predicate.And(account => pager.Search.StateProvinceFilter.Contains(account.StateProvince));
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
			""			 => acct => acct.AccountName.StartsWith(filter), // Default if empty
			"startswith" => acct => acct.AccountName.StartsWith(filter),
			"contains"	 => acct => acct.AccountName.ToLower().Contains(filter),
			"endswith"   => acct => acct.AccountName.EndsWith(filter), 
			_ => throw new ArgumentException($"Unknown AccountName FilterType: {filterType}")
		};

	private static Expression<Func<Account, bool>> AccountNameFilterOld(string f)
	{
		return p => p.AccountName.Contains(f);
	}
}

// =================================================================================================================
// Use SeedPacket to generate list
// private List<Account> Accounts => new List<Account>().Seed(127, new Random(43454)).ToList();
