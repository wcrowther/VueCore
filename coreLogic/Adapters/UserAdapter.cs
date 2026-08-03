using coreData.Models;
using coreLogic.Models;

namespace coreLogic.Adapters;

public static partial class Adapter
{
	public static AuthUser ToAuthResponse(this User user, string token, DateTime expiration)
	{
		return user == null ? null : new AuthUser(user, token, expiration);
	}

	public static UserVm ToUserVm(this User user)
	{
		return user == null ? null :
			new UserVm
			{
				UserId       = user.UserId,
				UserName     = user.UserName,
				FirstName    = user.FirstName,
				LastName     = user.LastName,
				UserEmail    = user.UserEmail,
				Role         = user.Role,
				IsActive     = user.IsActive,
				DateCreated  = user.DateCreated,
				DateModified = user.DateModified,
				CreatorId    = user.CreatorId,
				ModifierId   = user.ModifierId,
				CreatorName  = user.CreatorName,
				ModifierName = user.ModifierName
			};
	}

	public static List<UserVm> ToUserVmList(this IEnumerable<User> users) => users.Select(u => u.ToUserVm()).ToList();

	public static User ToUser(this UserVm vm)
	{
		return vm == null ? null :
			new User
			{
				UserId       = vm.UserId,
				UserName     = vm.UserName,
				FirstName    = vm.FirstName,
				LastName     = vm.LastName,
				UserEmail    = vm.UserEmail,
				Role         = vm.Role,
				IsActive     = vm.IsActive,
				DateCreated  = vm.DateCreated,
				DateModified = vm.DateModified,
				CreatorId    = vm.CreatorId,
				ModifierId   = vm.ModifierId
			};
	}
}
