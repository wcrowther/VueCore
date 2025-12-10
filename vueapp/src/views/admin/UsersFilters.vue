<script setup>

    const props = defineProps(
    {
        listPager: { type: PagerModel, required: true },
        defaultPageSize: { type: Number, default: 15 }
    })
   
    const emits = defineEmits(['showAdvancedSearch'])
    const showAdvancedSearch = () => emits('showAdvancedSearch')
        
    const advancedFilters = computed(() => 
    {
        let filterList = []
        
        let roleFilter = props.listPager.Search.RoleFilter
        if(roleFilter && roleFilter.length > 0)
            filterList.push(roleFilter)

        let pageSize = props.listPager.PageSize
        if(pageSize && pageSize !== props.defaultPageSize) // do not show if default 
            filterList.push(`Page Size ${pageSize}`)                

        return filterList.join(', ')
    })

</script> 

<template>   

    <div v-if="advancedFilters.length > 0" 
        class="text-sm text-gray-400 mt-3 cursor-pointer" @click=showAdvancedSearch>
        <span class="font-bold pl-1">Filters: </span> 
        <span class="italic">{{ advancedFilters }}</span>
    </div>

</template>


<!-- Usage: AccountFilters usage to come 
    Filters: {{ usStatesList[props.listPager.Search.StateProvinceFilter] }}
-->
