using coreData;
using coreData.Interfaces;
using coreData.Repos;
using coreLogic.Interfaces;
using coreLogic.Managers;

namespace coreApi.Helpers;

public static class ServicesHelper
{
	public static void AddMyServices(this IServiceCollection services)
    {
		services.AddDbContext<DataContext>();

		// Logic Services
		services.AddScoped<ICurrentUserProvider,	UserClaimsManager>();
		services.AddScoped<IAccountManager,		AccountManager>();
        services.AddScoped<IUserManager,		UserManager>();
		services.AddScoped<IAuthManager,		AuthManager>();
		services.AddScoped<IContentManager,		ContentManager>();
		services.AddScoped<ITokenManager,		TokenManager>();
		services.AddScoped<ICookieManager,		CookieManager>();
		services.AddScoped<IUserClaimsManager,	UserClaimsManager>();
		services.AddScoped<IMessageManager,		MessageManager>();

		// Data Services
		services.AddScoped<IAccountRepo,		AccountRepo>();
		services.AddScoped<IUserRepo,			UserRepo>();
		services.AddScoped<IContentRepo,		ContentRepo>();
		services.AddScoped<IMessageRepo,		MessageRepo>();
	}
}
