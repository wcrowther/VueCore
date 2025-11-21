<script setup>

    const listPager     = defineModel('listPager')
    const showModal     = defineModel('showModal')

    const emits         = defineEmits(["getListData"])
    const emitData     = (newVal, oldVal) => 
    { 
        if (newVal != oldVal) // use != as oldVal may be string '10'
        {
            console.log('newVal: ', newVal, 'oldVal: ', oldVal)
            useDebounceFn(() => emits('getListData'), 1000)()
        } 
    }

    const resetAdvSearch = () => 
    {
        console.log('resetAdvSearch')

        listPager.value.PageSize    = 15
        listPager.value.Search.RoleFilter  = ''

        emits('getListData')
    }

    // Watches   ==============================================================================

    watch(() => listPager.value.PageSize,           (newVal, oldVal) => emitData(newVal, oldVal))
    watch(() => listPager.value.Search.RoleFilter,   (newVal, oldVal) => emitData(newVal, oldVal))

    // Keyboard Listeners  ================================================
	
	DisableLayoutEscapeKey(showModal.value) // disable Esc key if modal is showing

    const keys = function (e)   
    {
		if (e.code === 'Escape'){ showModal.value=false; e.preventDefault(); } 
    }

	KeyboardListeners(keys)

</script> 

<template>   

	<ModalControl :showModal="showModal" title="Advanced Search" id="UserAdvSearch"
        height="400px" width="500px" @closeModal="showModal=false">

        <div class="p-5 pb-0">

            <SelectInput labelName="PageSize" v-model="listPager.PageSize" 
                :optionsList="pagerPageSize" :showDefault="false"  
                title="Change how many records in each page of data." />

            <SelectInput labelName="Roles" v-model="listPager.Search.RoleFilter" 
                :optionsList="rolesList" :showDefault="true"  
                title="Filter by the users role" />
        </div>

        <template #footer>
            <button class="btn-primary"  @click="resetAdvSearch">Reset</button>
            <button class="btn-delete"   @click="showModal=false">Close</button>
        </template>

	</ModalControl>

</template>


<!-- 
Usage:
    <UserAdvSearch v-model:show="showAdvSearch" v-model:listPager="listPager" 
        @getListData="getListData"></UserAdvSearch>
-->
