using coreData.Interfaces;
using coreData.Models;
using coreLibrary.Models;
using coreLogic.Adapters;
using coreLogic.Interfaces;
using coreLogic.Models;
using bCrypt = BCrypt.Net.BCrypt;

namespace coreLogic.Managers;

// =====================================================================
// WARNING: In a PRODUCTION system you will need to authorize that
// users have rights to modify users based on particular roles.
// This is not implemented in this simplified version of the code.
// =====================================================================

public class UserManager(IUserRepo userRepo, ICookieManager cookieManager, ITokenManager tokenManager)
    : IUserManager
{
    public UserVm GetUserByUsername(string username)
    {
        var user = userRepo.GetUserByUserName(username);
        PopulateAuditableNames(user);
        return user.ToUserVm();
    }

    public UserVm GetUserById(int id)
    {
        var user = userRepo.GetUserById(id);
        PopulateAuditableNames(user);
        return user.ToUserVm();
    }

    public IEnumerable<UserVm> GetAllUsers()
    {
        return userRepo.GetAllUsers().ToUserVmList();
    }

    public PagedList<UserVm, SearchForUser> GetPagedUsers(Pager<SearchForUser> pager)
    {
        pager ??= new Pager<SearchForUser>();
        var pagedUsers = userRepo.GetPagedUsers(pager);
        return new PagedList<UserVm, SearchForUser>
        {
            Pager     = pagedUsers.Pager,
            ListItems = pagedUsers.ListItems?.ToUserVmList()
        };
    }

    // SEE ABOVE FOR USER CAUTIONS
    public UserVm SaveUser(UserVm userVm)
    {
        var user = userVm.ToUser();
        var saved = userRepo.SaveUser(user);
        PopulateAuditableNames(saved);
        return saved.ToUserVm();
    }

    // SEE ABOVE FOR USER CAUTIONS
    public UserVm CreateUser(UserToCreate userToCreate)
    {
        tokenManager.CreateNewRefreshTokenForUser(userToCreate);
        var createdUser = userRepo.CreateUser(userToCreate, bCrypt.HashPassword(userToCreate.Password));
        cookieManager.SetRefreshTokenCookie(createdUser.RefreshToken);
        return createdUser.ToUserVm();
    }

    public UserVm UpdateUserRefreshToken(UserVm userVm)
    {
        var user = userVm.ToUser();
        tokenManager.CreateNewRefreshTokenForUser(user);
        var saved = userRepo.UpdateRefreshToken(user);
        cookieManager.SetRefreshTokenCookie(saved.RefreshToken);
        return saved.ToUserVm();
    }

    // ==========================================================================================

    private void PopulateAuditableNames(User user)
    {
        if (user is null) return;
        user.CreatorName  = userRepo.GetUsernameById(user.CreatorId);
        user.ModifierName = userRepo.GetUsernameById(user.ModifierId);
    }
}

