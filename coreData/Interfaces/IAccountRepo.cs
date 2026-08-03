using coreData.Models;
using coreLibrary.Models;

namespace coreData.Interfaces;

public interface IAccountRepo
{
	Task<List<Account>> GetAllAccounts();

	Task<Account> GetAccountById(int accountId);

	Task<PagedList<Account, SearchForAccount>> GetPagedAccounts(Pager<SearchForAccount> pager);

	Task<Account> SaveAccount(Account account);
}

