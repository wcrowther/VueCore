// Uses 'unplugin-vue-router'. Create your site structure in the 'pages' folder 
// and it will automatically use vue-router to create the routes for you.

import { createRouter, createWebHistory } 	from 'vue-router/auto'

const DEFAULT_TITLE = 'VueCore';

const router = createRouter(
{
	// linkActiveClass: 'active',
	// extendRoutes(routes) { routes.push( { path: '/About', name: 'AboutRedirect', redirect: '/About/How' } ) },
	history: createWebHistory()
})
	
router.beforeEach(async (to) => 
{
	// AuthStore must be created here because we are in .js not .vue file

	const publicPages 	= ['/','/home','/home/intro','/home/vuenotes','/home/dotnetnotes','/auth/login','/panzoom']
	const authRequired 	= !publicPages.includes(to.path)
	const authStore		= useAuthStore() 

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

	