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

        return filterList.join(', ')
    })

</script>

<template>

    <div class="text-sm text-gray-400 mt-3 cursor-pointer" @click="showAdvancedSearch">
        <span v-if="advancedFilters.length > 0" class="font-bold whitespace-nowrap">
            Filters/Sort: 
            <span class="italic mr-3">{{ advancedFilters }}</span>
        </span>
        <span class="italic">
            {{ props.disableShortcuts ? 'Shortcuts&nbsp;Disabled' : '' }}
        </span>
    </div>


</template>
