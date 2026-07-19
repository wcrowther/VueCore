using coreData.Interfaces;
using coreLogic.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace coreLogic.Managers;

public class UserClaimsManager(IHttpContextAccessor accessor)
: IUserClaimsManager, ICurrentUserProvider
{
	public int? GetCurrentUserId()
	{
		if(accessor.HttpContext?.User?.Identity?.IsAuthenticated == false)
			return null;

		var nameIdentifier = accessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;

		return int.TryParse(nameIdentifier, out int userId) ? userId : null;
	}

	public string GetCurrentUsername()
	{
		if (accessor.HttpContext?.User?.Identity?.IsAuthenticated == false)
			return null;

		return accessor.HttpContext.User.Identity.Name;
	}
}
