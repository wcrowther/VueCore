<script setup>

    const props = defineProps(
    {
        id: { type: String, default: 'TabControl' },
		tabList: { type: Array, default: () => ['One', 'Two', 'Three'] },
        keepAlive: { type: Boolean, default: false },
        contentBorder: { type: Boolean, default: false },
        altDesign: { type: Boolean, default: false },
	})

    const activeTabModel = defineModel('activeTab', { type: String, default: '' })
    const internalActiveTab = ref(props.tabList[0])

    const activeTab = computed(
    {
        get()
        {
            const modelTab = activeTabModel.value
            return props.tabList.includes(modelTab) ? modelTab : internalActiveTab.value
        },
        set(tab)
        {
            if (!props.tabList.includes(tab)) return

            internalActiveTab.value = tab
            activeTabModel.value = tab
        }
    })

    watch(() => props.tabList, (tabs) =>
    {
        const list = Array.isArray(tabs) ? tabs : []
        if (!list.length) return

        if (!list.includes(activeTab.value))
            activeTab.value = list[0]
    }, { immediate: true })

    const isActive	= (tab) => tab === activeTab.value

</script>

<template>

    <div :id="props.id" class="h-full">

        <!-- Tabs -->
        <div class="flex gap-2 justify-start h-9 z-20 pl-5 border-b border-slate-300">
        
            <template v-for="(tab,idx) in props.tabList" :key="idx">
                <div :class="[{ 'altDesign' : props.altDesign }, isActive(tab) ? 'tab-active' :'tab-other' ]" 
                    @click="activeTab = tab">
                    <span>{{ tab }}</span>
                </div>
            </template>

            <div class="ml-auto h-9">
                <slot name="Right" />
            </div>
        </div>

        <!-- Content -->
        <div class="z-10 h-full min-h-60 p-5 pb-7 opacity-100 bg-white 
            border-t-0 overflow-y-auto scrollbar-thin border-red"
            :class="{ 'border': props.contentBorder}">

           <slot></slot>

            <!-- persist state through tab changes -->
           <template v-if="props.keepAlive">
               <div v-for="(tab,idx) in props.tabList" :key="idx" 
                v-show="activeTab === tab" >
                   <slot :name="tab"></slot>
               </div>
           </template>        
           <!-- reloads tabs each tab change -->
           <template v-else>
               <template v-for="(tab,idx) in props.tabList" :key="idx">
                   <slot v-if="activeTab === tab" :name="tab"></slot>
               </template>
           </template>
        </div>

    </div>

</template>

<style lang="postcss" scoped>

    .tab-active { @apply mt-0 px-4 pt-[.4rem] rounded-t-md border bg-white border-slate-300 border-b-0 
        text-sm font-bold select-none relative bottom-[-1px] }
    .tab-other { @apply mt-1 mb-[.2rem] px-4 select-none leading-7 rounded-full border 
        border-transparent text-sm font-bold hover:bg-slate-300 }
    .altDesign.tab-active { @apply !rounded-none}
    .altDesign.tab-other  { @apply !rounded-none}
</style> 

<!-- USAGE:
    
    Note: In TabControl the slots do not 'KeepAlive' their state. While the WizardControl they do.

    <TabControl class="mb-10" :tabList="['First', 'Second', 'Third']" >

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

    </TabControl>
-->