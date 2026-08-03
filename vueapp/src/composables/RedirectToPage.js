
export function RedirectToPage(path, toPath)
{
	onBeforeMount (() => 
	{
		const router = useRouter()

		if(router.currentRoute.value.path.toLowerCase() === path.toLowerCase())
			router.replace(toPath)
	})
}

/*
	Used by parent/index page routes to redirect to their default child routes
	in a mount-safe lifecycle hook.

	While this works, prefer using 'extendRoutes' redirects. see router.js
*/
	