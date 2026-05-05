<script setup>

    import { ref } from 'vue'

    const props = defineProps({
        id: { type: String, default: 'TabControl' },
		tabList: { type: Array, default: () => ['One', 'Two', 'Three'] }
	})

    const activeTab = ref(props.tabList[0])
    const isActive	= (tab) => tab === activeTab.value

</script>

<template>

    <div :id="props.id" class="h-full">

        <!-- Tabs -->
        <div class="flex gap-2 justify-start h-9 z-20 pl-5 border-b-2 border-slate-300">
        
            <template v-for="(tab,idx) in props.tabList" :key="idx">
                <div :class="[ isActive(tab) ? 'tab-active' :'tab-other' ]" @click="activeTab = tab">
                    <span>{{ tab }}</span>
                </div>
            </template>

        </div>

        <!-- Content -->
        <div class="z-10 h-full min-h-60 p-5 opacity-100 pb-3 bg-white 
             border-t-0 overflow-y-auto scrollbar-thin">

           <slot></slot>
           <template v-for="(tab,idx) in props.tabList" :key="idx">
               <slot v-if="activeTab == tab" :name="tab"></slot>
           </template>

        </div>

    </div>

</template>

<style lang="postcss" scoped>

    .tab-active { @apply mt-0 px-4 pt-[.4rem] rounded-t-md border-2 bg-white border-slate-300 border-b-0 
        text-sm font-bold select-none relative bottom-[-2px] }
    .tab-other { @apply mt-1 mb-[.2rem] px-4 select-none leading-7 rounded-full border-2 
        border-transparent text-sm font-bold hover:bg-slate-300 }

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