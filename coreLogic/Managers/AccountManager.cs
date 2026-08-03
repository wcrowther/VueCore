using coreData.Interfaces;
using coreData.Models;
using coreLibrary.Models;
using coreLogic.Adapters;
using coreLogic.Interfaces;
using coreLogic.Models;

namespace coreLogic.Managers;

public class AccountManager(IAccountRepo accountRepo, IUserRepo userRepo)
    : IAccountManager
{
    public async Task<List<AccountVm>> GetAllAccounts()
    {
        var accounts = await accountRepo.GetAllAccounts();
        return accounts.ToAccountVmList();
    }

    public async Task<AccountVm> GetAccountById(int accountId)
    {
        var account = await accountRepo.GetAccountById(accountId);
        PopulateAuditableNames(account);
        return account.ToAccountVm();
    }

    public async Task<PagedList<AccountVm, SearchForAccount>> GetPagedAccounts(Pager<SearchForAccount> pager)
    {
        pager ??= new Pager<SearchForAccount>();
        var pagedAccounts = await accountRepo.GetPagedAccounts(pager);
        return new PagedList<AccountVm, SearchForAccount>
        {
            Pager     = pagedAccounts.Pager,
            ListItems = pagedAccounts.ListItems?.ToAccountVmList()
        };
    }

    public async Task<AccountVm> SaveAccount(AccountVm accountVm)
    {
        var account = accountVm.ToAccount();
        var saved   = await accountRepo.SaveAccount(account);
        PopulateAuditableNames(saved);
        return saved.ToAccountVm();
    }

    // ==========================================================================================

    private void PopulateAuditableNames(Account account)
    {
        if (account is null) return;
        account.CreatorName  = userRepo.GetUsernameById(account.CreatorId);
        account.ModifierName = userRepo.GetUsernameById(account.ModifierId);
    }
}

