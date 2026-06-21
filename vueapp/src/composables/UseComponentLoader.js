
export function useComponentLoader(globResult)
{
    const componentMap = Object.fromEntries
	(
        Object.entries(globResult).map(([path, loader]) => 
		[
            path.split('/').pop().replace('.vue', ''), loader
        ])
    )

    function getComponent(name)
    {
        const loader = componentMap[name]

        if (!loader)
            return null

        return defineAsyncComponent(loader)
    }

    return {
        getComponent,
        componentNames: Object.keys(componentMap)
    }
}