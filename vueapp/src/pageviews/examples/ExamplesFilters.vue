<script setup>

    const props = defineProps(
    {
        sortType: { type: String, default: 'default' },
        disableShortcuts: { type: Boolean, default: false }
    })

    const emits = defineEmits(['showAdvancedSearch'])
    const showAdvancedSearch = () => emits('showAdvancedSearch')

    const advancedFilters = computed(() =>
    {
        const filterList = []

        if (props.sortType === 'alphabetical')
            filterList.push('Alphabetical')

        if (props.disableShortcuts)
            filterList.push('Shortcuts Disabled')

        return filterList.join(', ')
    })

</script>

<template>

    <div v-if="advancedFilters.length > 0"
        class="text-sm text-gray-400 mt-3 cursor-pointer" @click="showAdvancedSearch">
        <span class="font-bold">Filters/Sort: </span>
        <span class="italic">{{ advancedFilters }}</span>
    </div>

</template>
