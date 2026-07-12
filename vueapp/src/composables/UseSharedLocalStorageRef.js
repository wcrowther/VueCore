const sharedLocalStorageRefMap = new Map()

export const useSharedLocalStorageRef = (key, initialValue) =>
{
    if (!sharedLocalStorageRefMap.has(key))
        sharedLocalStorageRefMap.set(key, useLocalStorage(key, initialValue))

    return sharedLocalStorageRefMap.get(key)
}
