using coreData.Models;
using coreLibrary.Models;
using coreLogic.Models;

namespace coreLogic.Interfaces;

public interface IAuthManager
{
	Returns<UserVm> GetCurrentUser();

	Returns<AuthUser> Authenticate(AuthRequest authRequest);

	Returns<AuthUser> Signup(UserToCreate userToCreate);

	Returns<AuthUser> RefreshAuth(AuthRefreshRequest request);

	void RevokeRefreshToken();
}
