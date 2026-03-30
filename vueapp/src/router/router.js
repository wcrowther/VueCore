// Uses 'unplugin-vue-router'. Create your site structure in the 'pages' folder 
// and it will automatically use vue-router to create the routes for you.

import { createRouter, createWebHistory } 	from 'vue-router/auto'

const DEFAULT_TITLE = 'VueCore';

const router = createRouter(
{
	// linkActiveClass: 'active',
	extendRoutes(routes)
	{
		const redirectMapByName =
		{
			'/home/': '/home/intro',
			'/accounts/': '/accounts/main',
			'/admin/': '/admin/users',
			'/content': '/content/main'
		}

		function applyRedirects(routeList)
		{
			for (const route of routeList)
			{
				if (route?.name && redirectMapByName[route.name])
					route.redirect = redirectMapByName[route.name]

				if (route?.children?.length)
					applyRedirects(route.children)
			}
		}

		applyRedirects(routes)

		const hasRootPath = routes.some((route) => route?.path === '/')
		if (!hasRootPath)
		{
			routes.unshift({ path: '/', name: 'RootRedirect', redirect: '/home/intro' })
		}

		return routes
	},
	history: createWebHistory()
})
	
router.beforeEach(async (to) => 
{
	// AuthStore must be created here because we are in .js not .vue file

	const publicPages 	= ['/','/home','/home/intro','/home/vuenotes','/home/dotnetnotes','/auth/login','/panzoom']
	const authRequired 	= !publicPages.includes(to.path)
	const authStore		= useAuthStore() 

	if (!authStore.isAuthChecked)
		await authStore.fetchCurrentUser()

	if (authRequired && !authStore.isLoggedIn) 
	{
		authStore.returnUrl = to.fullPath	
		return '/auth/login'
	}
});

router.afterEach(() =>  // (to, from)
{
	// nextTick see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609

	nextTick(() => 
	{		
		document.title =  DEFAULT_TITLE // + (to.name ? ' - '+ to.name : '');
	});
});

export default router 

	