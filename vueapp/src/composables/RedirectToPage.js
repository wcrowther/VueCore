
export function RedirectToPage(path, toPath)
{
	onBeforeMount (() => 
	{
		const router = useRouter();

		if(router.currentRoute.value.path.toLowerCase() === path.toLowerCase())
			router.replace(toPath); 
	})
}

/*
	NO LONGER USING THIS COMPOSABLE
	Instead have an empty page like /index.vue or /accounts/index.vue with a 'router.replace'

	Redirects to a sub-page when the current path matches a parent route, 
	e.g., /accounts → /accounts/main. Useful for directing users to default sub-pages.
*/
	