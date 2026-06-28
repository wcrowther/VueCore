<script setup>

    const props = defineProps (
    {
        compact:             { type: Boolean, default: true },  // hide label, etc
        labelName:           { type: String, default: ''},
        showAdvSearchButton: { type: Boolean, default: true },  
        inputTitle:          { type: String, default: 
            "Search the list for values that start with this text. " +
            "Add multiple conditions separated by a comma. Click on + for more options." }
    })

    const modelValue    = defineModel({ type: String, default: '' })
    const showAdvSearch = defineModel('showAdvSearch', { type: Boolean, default: false })
    const filterInput   = ref(null)

    // -------------------------------------------------------------------

    const resetFilter   = () => modelValue.value = ''
    const focusInput    = () => filterInput.value?.focus()

    defineExpose({ focusInput }) // exposes to Parent

</script>


<template>
    <div :class="['w-full', {'mb-3' : !props.compact}]">

        <div v-if="!props.compact" 
            class="pb-1 flex justify-between items-baseline">
            <label v-if="props.labelName" 
                class="text-color-dark-blue font-bold whitespace-nowrap text-xs"
                :for="props.labelName">
                {{props.labelName}}
            </label>
        </div>

        <div class="relative h-8">
            <input class="text-sm rounded-full w-full h-full pl-4 pr-5 sm:pr-9 select-all border-color-dark-gray"
                id="filterInput" type="text" v-model="modelValue" placeholder="Search" spellcheck="false"
                ref="filterInput" :title="props.inputTitle" />
            
            <div class="absolute top-0 right-0 pr-2 flex justify-end items-center gap-1 h-full w-auto">
                <div class="w-auto flex-center" @click="resetFilter">
                    <IconSymbol v-if="modelValue && modelValue.length > 0" 
                        class="xs:hidden sm:block text-color-dark-gray hover:text-color-mid-gray" width="20px" icon="heroicons:x-mark" />
                </div>
                <span v-if="showAdvSearchButton"
                    class="bg-color-mid-gray hover:bg-color-light-gray
                    flex-center rounded-full group" @click.prevent="showAdvSearch=true">
                    <IconSymbol class="text-black group-hover:text-color-mid-gray"
                        title="Advanced Search" width="22px" icon="heroicons:plus-20-solid" />
                </span>
            </div>
        </div>

    </div>
</template>

<!-- Usage (with custom inputTitle):

    <SearchInput v-model="listPager.Search.Filter" v-model:showAdvSearch="showAdvSearch" 
        inputTitle="Search Account list for values that start with this text."></SearchInput>

    <SearchInput v-model="listPager.Search.Filter" v-model:showAdvSearch="showAdvSearch" 
        :showAdvSearchButton="false" />   
-->

<!-- Search button if we manually submit
    <span v-if="false" class="size-[22px] bg-color-mid-gray hover:bg-color-light-gray
        flex-center rounded-full group" @click.prevent="submitChange">
        <div class="text-[20px]">?</div>
    </span>
--> 

