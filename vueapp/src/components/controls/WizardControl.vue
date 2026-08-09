<script setup>

    import { useSessionStorage } from '@vueuse/core'

    const emit = defineEmits(['navigation-attempt', 'navigation-blocked', 'tab-change'])

    const props = defineProps(
    {
        id: { type: String, default: 'WizardControl' },        
		tabList: { type: Array, default: () => ['One', 'Two', 'Three'] },
        useKeyControls: { type: Boolean, default: true },
        persistActiveTab: { type: Boolean, default: true },
		showBorder: { type: Boolean, default: true },
		wrap: { type: Boolean, default: true },
		beforeChange: { type: Function, default: null }
	})

    const activeTab = props.persistActiveTab 
        ? useSessionStorage(`${props.id}-activeTab`, props.tabList[0]) 
        : ref(props.tabList[0])
    
    // Ensure activeTab is still valid in tabList
    if (props.persistActiveTab && !props.tabList.includes(activeTab.value)) 
    {
        activeTab.value = props.tabList[0]
    }

    const isNavigating  = ref(false)
    const isActive	    = (tab) => tab === activeTab.value
    const currentTabIndex = computed(() =>
    {
        const idx = props.tabList.indexOf(activeTab.value)
        return idx >= 0 ? idx : 0
    })
    const canGoPrev = computed(() => props.wrap || currentTabIndex.value > 0)
    const canGoNext = computed(() => props.wrap || currentTabIndex.value < props.tabList.length - 1)

    const navigateTo = async (toTab, trigger = 'manual') =>
    {
        if (isNavigating.value) return false

        const fromTab = activeTab.value
        const fromIndex = currentTabIndex.value
        const toIndex = props.tabList.indexOf(toTab)

        if (toIndex < 0) return false

        const direction = toIndex > fromIndex ? 'next' : toIndex < fromIndex ? 'prev' : 'stay'
        const payload =
        {
            fromTab,
            toTab,
            fromIndex,
            toIndex,
            direction,
            trigger,
            wrap: props.wrap
        }

        emit('navigation-attempt', payload)

        if (direction === 'stay') return true

        try
        {
            isNavigating.value = true

            if (props.beforeChange)
            {
                const canContinue = await props.beforeChange(payload)
                if (!canContinue)
                {
                    emit('navigation-blocked', payload)
                    return false
                }
            }

            activeTab.value = toTab
            emit('tab-change', payload)
            return true
        }
        finally
        {
            isNavigating.value = false
        }
    }

    const stepTab = (offset, trigger) =>
    {
        const target = currentTabIndex.value + offset
        const last = props.tabList.length - 1
        const idx = props.wrap
            ? (target < 0 ? last : target > last ? 0 : target)
            : Math.min(last, Math.max(0, target))
        return navigateTo(props.tabList[idx], trigger)
    }

    const nextTab = (trigger = 'next-button') => canGoNext.value && stepTab(1, trigger)
    const prevTab = (trigger = 'prev-button') => canGoPrev.value && stepTab(-1, trigger)

    const setActiveTab = async (tab) => await navigateTo(tab, 'tab-click')
    
    
    const keys =
    {
        'ArrowLeft': 	() => prevTab('keyboard-prev'),
        'ArrowRight': 	() => nextTab('keyboard-next')
    }

    KeyboardListeners(keys, computed(() => !props.useKeyControls))

    const displayName = (tab) => tab.replaceAll('_', ' ')

</script>

<template>

    <div :id="props.id" class="h-full">

        <!-- Tabs -->
        <div class="flex justify-start gap-px w-fit m-auto mb-5 rounded-full overflow-hidden">
        
            <template v-for="(tab,idx) in props.tabList" :key="idx">

                <div :class="['py-1 px-2 first:pl-3 last:pr-3 first:xs:pl-5 last:xs:pr-5 xs:px-5 '+
                    'font-bold tracking-wide select-none cursor-pointer', 
                    isActive(tab) ? 'bg-color-mid-blue text-white' :'bg-color-light-blue text-black']" 
                    @click="setActiveTab(tab)">
                    <span>{{ displayName(tab) }}</span>
                </div>
                
            </template>

        </div>

        <!-- Content -->
        <div :class="['relative z-10  h-full min-h-60 opacity-100 pb-3 bg-transparent',
            'overflow-y-auto overflow-x-hidden scrollbar-thin box-border', showBorder ? 'border border-black p-7': 'mt-7']">

           <template v-for="(tab,idx) in props.tabList" :key="idx">
                <template v-if="activeTab == tab">
                    <slot :name="tab"></slot>
                </template>
           </template>  

           <slot :nextTab="nextTab" :prevTab="prevTab" :activeTab="activeTab" :currentIndex="currentTabIndex + 1">
                <div :class="['absolute flex items-center gap-4 font-bold select-none',
                    showBorder ? 'top-[38px] right-10' : 'top-[10px] right-4']">

                    <div :class="['group flex items-center underline-offset-2 text-color-mid-blue',
                        canGoPrev ? 'cursor-pointer hover:underline hover:text-orange' : 'opacity-50 cursor-not-allowed']"
                        @click="prevTab">
                        <IconSymbol class="mr-1"
                            :class="canGoPrev ? 'text-color-mid-blue group-hover:text-orange' : 'text-gray-400'"
                            title="Previous Wizard Item" width="24px" icon="material-symbols-light:arrow-back-2" />
                        Prev
                    </div>

                    <div :class="['group flex items-center underline-offset-2 text-color-mid-blue',
                        canGoNext ? 'cursor-pointer hover:underline hover:text-orange' : 'opacity-50 cursor-not-allowed']"
                        @click="nextTab">
                        Next
                        <IconSymbol class="ml-1"
                            :class="canGoNext ? 'text-color-mid-blue group-hover:text-orange' : 'text-gray-400'"
                            title="Next Wizard Item" width="24px" icon="material-symbols-light:play-arrow" />
                    </div>

                </div>
           </slot>
        </div>

    </div>

</template>

<!-- USAGE: 

    Note: In the WizardControl the slots are all loaded but kept hidden. 
    In the TabsControl, the slots content is not loaded until the tab is selected.

    <WizardControl class="mb-10" :tabList="['First', 'Second', 'Third']"
        :wrap="true"
        :beforeChange="beforeWizardChange"
        @navigation-attempt="onWizardAttempt"
        @navigation-blocked="onWizardBlocked"
        @tab-change="onWizardChanged" >

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

    Event / Guard hook-up details:
    1) beforeChange(payload) is called before every navigation (tab click, next, prev, keyboard).
       Return true to allow navigation, false to block it.
    2) @navigation-attempt fires first for telemetry/logging.
    3) @navigation-blocked fires when beforeChange returns false.
    4) @tab-change fires after activeTab is updated.

    Payload shape:
    {
        fromTab, toTab,
        fromIndex, toIndex,
        direction,      // 'next' | 'prev' | 'stay'
        trigger,        // 'next-button' | 'prev-button' | 'keyboard-next' | 'keyboard-prev' | 'tab-click'
        wrap
    }
-->