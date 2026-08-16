<script setup>

    const listPager = defineModel('listPager', { type: PagerModel, required: true })
    const showModal = defineModel('showModal', { type: Boolean, required: true })

    const emits     = defineEmits(['getListData'])
    const emitData  = (newVal, oldVal) => 
    { 
        if (newVal != oldVal) // use != as oldVal may be string '10'
            useDebounceFn(() => emits('getListData'), 3000)()
    }

    const resetAdvSearch = () => 
    {
        console.log('resetAdvSearch')

        listPager.value.Search.FilterType           = 'startswith'
        listPager.value.PageSize                    = 15
        listPager.value.Search.StateProvinceFilter  = []
        listPager.value.Search.PostalCodeFilter     = ''

        emits('getListData')
    }

    // Watches   ==============================================================================

    watch(() => listPager.value.FilterType,                 (newVal, oldVal) => emitData(newVal, oldVal))
    watch(() => listPager.value.PageSize,                   (newVal, oldVal) => emitData(newVal, oldVal))
    watch(() => listPager.value.Search.StateProvinceFilter, (newVal, oldVal) => emitData(newVal, oldVal))
    watch(() => listPager.value.Search.PostalCodeFilter,    (newVal, oldVal) => emitData(newVal, oldVal))

	// Keyboard Listeners  ================================================

    // DisableGlobalKeys(showModal) // disable Esc key if modal is showing

	const keys = 
    {
		'Escape': () => showModal.value = false
    }

	KeyboardListeners(keys, () => !showModal.value)

</script> 

<template>   

	<ModalControl id="AccountAdvSearch" v-model="showModal" 
        title="Advanced Search" height="600px" width="600px" 
        @closeModal="showModal=false" >

        <div class="p-5 pb-0">

            <SelectInput labelName="Search Type" v-model="listPager.Search.FilterType" 
                :optionsList="filterTypesList" :showDefault="false"  
                title="Filter AccountName by 'Starts With', 'Contains' or 'Ends With'." />

            <SelectInput labelName="Page Size" v-model="listPager.PageSize" 
                :optionsList="pageSizeList" :showDefault="false"  
                title="Change how many records are in each page of data." />

            <MultiSelectInput labelName="State / Province Filter" 
                v-model="listPager.Search.StateProvinceFilter" :optionsList="usStatesList" 
                :showSelectAll="false" :showSelectNone="true" :hideSelected="false" 
                title="Filter to one or more States or Provinces." />

            <TextInput labelName="Postal Code Filter" placeholder="30000" 
                v-model="listPager.Search.PostalCodeFilter" 
                title="Filter to a Postal (or Zip) Code" />
        </div>

        <template #footer>
            <button class="btn-primary"  @click="resetAdvSearch">Reset</button>
            <button class="btn-delete"   @click="showModal=false">Close</button>
        </template>

	</ModalControl>

</template>


<!-- Usage:

    <AccountAdvSearch v-model:show="showAdvSearch" v-model:listPager="listPager" 
        @getListData="getListData">
    </AccountAdvSearch>
-->
