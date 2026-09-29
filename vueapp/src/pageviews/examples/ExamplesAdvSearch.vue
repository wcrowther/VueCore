<script setup>

    const sortType = defineModel('sortType', { type: String, required: true })
    const showModal = defineModel('showModal', { type: Boolean, required: true })

    const emits = defineEmits(['getListData'])

    const examplesStore = useExamplesStore()
    const { disableExamplesShortcuts } = storeToRefs(examplesStore)

    const sortOptionsList = 
    {
        default: 'Default',
        alphabetical: 'Alphabetical'
    }

    const emitData = (newVal, oldVal) =>
    {
        if (newVal !== oldVal)
            useDebounceFn(() => emits('getListData'), 300)()
    }

    const resetAdvSearch = () =>
    {
        sortType.value = 'default'
        disableExamplesShortcuts.value = false
        emits('getListData')
    }

    watch(() => sortType.value, (newVal, oldVal) => emitData(newVal, oldVal))

    // Keyboard Listeners  ================================================

    const keys = 
    {
        'Escape': () => showModal.value = false
    }

    KeyboardListeners(keys)

</script>

<template>

    <ModalControl id="ExamplesAdvSearch" v-model="showModal"
        title="Advanced Search" height="320px" width="500px"
        @closeModal="showModal=false">

        <div class="p-5 pb-0">
            <SelectInput labelName="Sort Type" v-model="sortType"
                :optionsList="sortOptionsList" :showDefault="false"
                title="Choose how examples are sorted in the list." />

            <CheckboxInput labelName="Disable Keyboard Shortcuts" v-model="disableExamplesShortcuts"
                class="mt-5" title="Enable/disable keyboard shortcuts for this list" />
        </div>

        <template #footer>
            <button class="btn-primary" @click="resetAdvSearch">Reset</button>
            <button class="btn-delete" @click="showModal=false">Close</button>
        </template>

    </ModalControl>

</template>
