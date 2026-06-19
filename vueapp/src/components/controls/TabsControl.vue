<script setup>

    import { useNormalizedTabList } from '@/composables/UseNormalizedTabList'

    const props = defineProps(
    {
        id:             { type: String, default: 'TabsControl' },
        tabList:        { type: [Array, Object], default: () => ['One', 'Two', 'Three'] },
        tabFieldName:   { type: String,  default: '' },
        keepAlive:      { type: Boolean, default: false },
        contentBorder:  { type: Boolean, default: false },
        altDesign:      { type: Boolean, default: false },
        minHeight:      { type: Number,  default: 240 }
	})

    const activeTabModel = defineModel('activeTab', { type: [String, Number], default: '' })
    const internalActiveTab = ref('')

    const normalizedTabList = useNormalizedTabList(() => props.tabList, () => props.tabFieldName)

    const activeTab = computed(
    {
        get()
        {
            const modelTab = activeTabModel.value
            const modelEntry = normalizedTabList.value.find(tab => tab.id === modelTab)
            if (modelEntry)
                return modelEntry.id

            const internalEntry = normalizedTabList.value.find(tab => tab.id === internalActiveTab.value)
            if (internalEntry)
                return internalEntry.id

            return normalizedTabList.value[0]?.id ?? null
        },
        set(tab)
        {
            const entry = normalizedTabList.value.find(normalizedTab => normalizedTab.id === tab)
            if (!entry) return

            internalActiveTab.value = entry.id
            activeTabModel.value = entry.id
        }
    })

    watch(normalizedTabList, tabs =>
    {
        if (!tabs.length) return

        if (!tabs.some(tab => tab.id === activeTab.value))
            activeTab.value = tabs[0].id
    }, { immediate: true, deep: true })

    const isActive	= (tabId) => tabId === activeTab.value

</script>

<template>

    <div :id="props.id" class="h-full">

        <!-- Tabs -->
        <div class="flex gap-2 justify-start h-9 z-20 pl-5 border-b border-gray-400"
            :class="{ 'bg-color-light-blue ' : props.altDesign}">
        
            <template v-for="(tab,idx) in normalizedTabList" :key="idx">
                <div :class="[{ altDesign : props.altDesign }, isActive(tab.id) ? 'tab-active' :'tab-other' ]" 
                    @click="activeTab = tab.id">
                    <span>{{ tab.label }}</span>
                </div>
            </template>

            <div class="ml-auto h-9">
                <slot name="Right" />
            </div>
        </div>

        <!-- Content -->
        <div class="z-10 h-full p-5 pb-7 opacity-100 bg-white 
            border-t-0 overflow-y-auto scrollbar-thin border-gray-400"
            :class="{ 'border': props.contentBorder}" 
            :style="{ minHeight: minHeight + 'px'}">

           <slot></slot>

            <!-- persist state through tab changes -->
           <template v-if="props.keepAlive">
               <div v-for="(tab,idx) in normalizedTabList" :key="idx" 
                v-show="activeTab === tab.id" >
                   <slot :name="tab.slotName"></slot>
               </div>
           </template>        
           <!-- reloads tabs each tab change -->
           <template v-else>
               <template v-for="(tab,idx) in normalizedTabList" :key="idx">
                   <slot v-if="activeTab === tab.id" :name="tab.slotName"></slot>
               </template>
           </template>
        </div>

    </div>

</template>

<style lang="postcss" scoped>

    .tab-active { @apply mt-0 px-4 pt-[.4rem] rounded-t-md border bg-white border-gray-400 border-b-0 
        text-sm font-bold select-none -mb-px}
    .tab-other { @apply mt-1 mb-[.2rem] px-4 select-none leading-7 rounded-full border 
        border-transparent text-sm font-bold hover:bg-gray-200 }
    .altDesign.tab-active { @apply !rounded-none }
    .altDesign.tab-other  { @apply !rounded-none }
</style> 

<!-- USAGE:

        .tab-active { @apply mt-0 px-4 pt-[.4rem] rounded-t-md border bg-white border-gray-400 border-b-0 
        text-sm font-bold select-none relative bottom-[-1px] }
    
    Note: In TabsControl the slots do not 'KeepAlive' their state. While the WizardControl they do.

    <TabsControl class="mb-10" :tabList="['First', 'Second', 'Third']" >

        <div class="text-center p-3 border">Default slot</div>
        <template #First>       
            <div class="p-5">
                <div class="font-bold mb-3">First Content</div>
            </div>
        </template>
        <template #Second>       
            <div class="p-5">
                <div class="font-bold mb-3">Second Content</div>
            </div>
        </template>
        <template #Third>       
            <div class="p-5">
                <div class="font-bold text-red mb-3">Important</div>
            </div>
        </template>

    </TabsControl>
-->