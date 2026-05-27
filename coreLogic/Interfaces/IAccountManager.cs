using coreData.Models;
using coreLibrary.Models;
using coreLogic.Models;

namespace coreLogic.Interfaces;

public interface IAccountManager
{
    Task<List<AccountVm>> GetAllAccounts();

    Task<AccountVm> GetAccountById(int id);

    Task<PagedList<AccountVm, SearchForAccount>> GetPagedAccounts(Pager<SearchForAccount> pager);

    Task<AccountVm> SaveAccount(AccountVm account);
}

