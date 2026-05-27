using coreData.Models;
using coreLibrary.Models;
using coreLogic.Models;

namespace coreLogic.Interfaces;

public interface IUserManager
{
    UserVm GetUserByUsername(string username);

    UserVm GetUserById(int id);

    IEnumerable<UserVm> GetAllUsers();

    PagedList<UserVm, SearchForUser> GetPagedUsers(Pager<SearchForUser> pager);

    UserVm SaveUser(UserVm user);

    UserVm CreateUser(UserToCreate userToCreate);

    UserVm UpdateUserRefreshToken(UserVm user);
}

