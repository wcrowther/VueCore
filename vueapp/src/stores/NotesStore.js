
export const useNotesStore = defineStore('ImageStore', () =>
{
	// STATE ------------------------------------------------------------------

	const notesWindowWidth = ref(null)

	// GETTERS ----------------------------------------------------------------

	// ACTIONS ----------------------------------------------------------------

	// EXPOSE PUBLIC API ------------------------------------------------------

	return {
		notesWindowWidth,
	}
})
