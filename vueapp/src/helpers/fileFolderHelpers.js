
// File Helpers ==========================================================

export	const toApiFolderPath = (path) => toPathSegments(path).join("/")

// Folder Helpers ========================================================

export const isRootName = (value) => String(value ?? "").trim() === "/"

export const toPathSegments = (path) =>
{
	const rawPath = String(path ?? "").trim()
	if (!rawPath || rawPath === "/") return []

	return rawPath.split("/").filter(Boolean)
}

export const joinPath = (parentPath, name) =>
{
	const parentSegments = toPathSegments(parentPath)
	const childName = String(name ?? "").trim()
	if (!childName)
		return parentSegments.length ? `/${parentSegments.join("/")}` : "/"

	return `/${[...parentSegments, childName].join("/")}`
}

export const normalizePath = (path) =>
{
	const segments = toPathSegments(path)
	return segments.length ? `/${segments.join("/")}` : "/"
}

export const toApiParentPath = (path) =>
{
	return toPathSegments(path).join("/")
}

export const hasPath = (nodes, targetPath, parentPath = "/") =>
{
	if (!targetPath) return false
	const normalizedTargetPath = normalizePath(targetPath)
	const sourceNodes = Array.isArray(nodes) ? nodes : []

	for (const node of sourceNodes)
	{
		const name = String(node?.name ?? node?.Name ?? "")
		if (!name) continue

		const currentPath = joinPath(parentPath, name)
		if (currentPath === normalizedTargetPath)
			return true

		const children = node?.children ?? node?.Children ?? []
		
		if (hasPath(children, targetPath, currentPath))
			return true
	}

	return false
}

export const findNodeByPath = (nodes, targetPath, parentPath = "/") =>
{
	if (!targetPath) return null

	const normalizedTargetPath = normalizePath(targetPath)
	const sourceNodes = Array.isArray(nodes) ? nodes : []

	for (const node of sourceNodes)
	{
		const name = String(node?.name ?? node?.Name ?? "")
		if (!name) continue

		const currentPath = joinPath(parentPath, name)
		if (currentPath === normalizedTargetPath)
			return node

		const children = node?.children ?? node?.Children ?? []
		const foundNode = findNodeByPath(children, normalizedTargetPath, currentPath)
		if (foundNode)
			return foundNode
	}

	return null
}

export const hasFilesInSubtree = (node) =>
{
	if (!node) return false

	const directFileCount = Number(node?.FileCount ?? node?.fileCount ?? 0)
	if (directFileCount > 0)
		return true

	const children = node?.children ?? node?.Children ?? []
	for (const child of Array.isArray(children) ? children : [])
	{
		if (hasFilesInSubtree(child))
			return true
	}

	return false
}
