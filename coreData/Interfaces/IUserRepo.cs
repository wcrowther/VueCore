using coreData.Models;
using coreLibrary.Models;

namespace coreData.Interfaces;

public interface IUserRepo
{
	IEnumerable<User> GetAllUsers();

	User GetUserByUserName(string username);

	User GetUserById(int userId);

	string GetUsernameById(int userId);

	User CreateUser(UserToCreate model, string passwordHash);

	PagedList<User, SearchForUser> GetPagedUsers(Pager<SearchForUser> pager);

	User SaveUser(User user);
}

