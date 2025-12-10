<script setup>

    import { ref } from 'vue'

    const props = defineProps({
        id: { type: String, default: 'WizardControl' },        
		tabList: { type: Array, default: () => ['One', 'Two', 'Three'] }
	})

    const activeTab     = ref(props.tabList[0])
    const isActive	    = (tab) => tab === activeTab.value
    const currentIndex  = computed(() => props.tabList.indexOf(activeTab.value)+1 ?? 1)
    const nextTab       = () => activeTab.value = props.tabList[currentIndex.value >= props.tabList.length ? 0 : currentIndex.value]

</script>

<template>

    <div :id="props.id" class="h-full">

        <!-- Tabs -->
        <div class="flex justify-start gap-px w-fit m-auto mb-5 rounded-full overflow-hidden">
        
            <template v-for="(tab,idx) in props.tabList" :key="idx">
                <div :class="['py-1 px-5 font-bold tracking-wide select-none cursor-pointer', 
                    isActive(tab) ? 'bg-color-mid-blue text-white' :'bg-color-light-blue text-black']" 
                    @click="activeTab = tab">
                    <span>{{ tab }}</span>
                </div>
            </template>

        </div>

        <!-- Content -->
        <div class="relative border border-black p-5 z-10 h-full min-h-60 opacity-100 pb-3
            overflow-y-auto scrollbar-thin box-border">

           <template v-for="(tab,idx) in props.tabList" :key="idx">
                <div v-show="activeTab == tab" >
                    <slot :name="tab"></slot>
                </div>
           </template>  

           <slot>
                <div @click="nextTab" class="text-right font-bold absolute w-fit
                    flex justify-end top-5 right-5 hover:text-orange">
                    Next
                </div>
           </slot>
        </div>

    </div>

</template>

<!-- USAGE: 

    Note: In WizardControl the slots 'KeepAlive' their state. While the TabControl does not.

    <WizardControl class="mb-10" :tabList="['First', 'Second', 'Third']" >

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

    </WizardControl>
-->