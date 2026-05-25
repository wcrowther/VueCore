<script setup>

    import { useSessionStorage } from '@vueuse/core'

    const props = defineProps(
    {
        id: { type: String, default: 'WizardControl' },        
		tabList: { type: Array, default: () => ['One', 'Two', 'Three'] },
        useKeyControls: { type: Boolean, default: true },
        persistActiveTab: { type: Boolean, default: true },
        showBorder: { type: Boolean, default: true }
	})

    const activeTab = props.persistActiveTab 
        ? useSessionStorage(`${props.id}-activeTab`, props.tabList[0]) 
        : ref(props.tabList[0])
    
    // Ensure activeTab is still valid in tabList
    if (props.persistActiveTab && !props.tabList.includes(activeTab.value)) 
    {
        activeTab.value = props.tabList[0]
    }

    const isActive	    = (tab) => tab === activeTab.value
    const currentIndex  = computed(() => props.tabList.indexOf(activeTab.value)+1 ?? 1) // 1-based 
    const prevTab       = () => activeTab.value = props.tabList[currentIndex.value <= 1  ? props.tabList.length-1  : currentIndex.value-2];
    const nextTab       = () => activeTab.value = props.tabList[currentIndex.value >= props.tabList.length ? 0 : currentIndex.value]

    if(props.useKeyControls)
    {
        const keys = function (e)  
	    {
	    	if      (e.code === 'ArrowLeft')  { prevTab(); e.preventDefault();}
	    	else if (e.code === 'ArrowRight') { nextTab(); e.preventDefault();}
	    }

	    KeyboardListeners(keys);
    }

</script>

<template>

    <div :id="props.id" class="h-full">

        <!-- Tabs -->
        <div class="flex justify-start gap-px w-fit m-auto mb-5 rounded-full overflow-hidden">
        
            <template v-for="(tab,idx) in props.tabList" :key="idx">
                <div :class="['py-1 px-2 first:pl-3 last:pr-3 first:xs:pl-5 last:xs:pr-5 xs:px-5 '+
                    'font-bold tracking-wide select-none cursor-pointer', 
                    isActive(tab) ? 'bg-color-mid-blue text-white' :'bg-color-light-blue text-black']" 
                    @click="activeTab = tab">
                    <span>{{ tab }}</span>
                </div>
            </template>

        </div>

        <!-- Content -->
        <div :class="['relative z-10 h-full min-h-60 opacity-100 pb-3 bg-transparent',
            'overflow-y-auto scrollbar-thin box-border', showBorder ? 'border border-black p-7': 'mt-7']">

           <template v-for="(tab,idx) in props.tabList" :key="idx">
                <template v-if="activeTab == tab">
                    <slot :name="tab"></slot>
                </template>
           </template>  

           <slot>
                <div :class="['group text-right font-bold absolute flex items-center justify-end',
                    'hover:underline hover:text-orange underline-offset-2 w-fit select-none', 
                    showBorder ? 'top-7 right-7' : 'top-0 right-5']"
                    @click="nextTab" >
                    Next  
                    <IconSymbol class="text-black group-hover:text-orange ml-1"
                        title="Next Wizard Item" width="24px" icon="material-symbols-light:play-arrow" />
                </div>
           </slot>
        </div>

    </div>

</template>

<!-- USAGE: 

    Note: In the WizardControl the slots are all loaded but kept hidden. 
    In the TabControl, the slots content is not loaded until the tab is selected.

    <WizardControl class="mb-10" :tabList="['First', 'Second', 'Third']" >

        <div class="text-center p-3 border">Default slot</div>

        <template #First>       
            <div class="font-bold mb-3">First Content</div>
        </template>

        <template #Second>       
            <div class="font-bold mb-3">Second Content</div>
        </template>

        <template #Third>       
            <SomeControl />
        </template>

    </WizardControl>
-->