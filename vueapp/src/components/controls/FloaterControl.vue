<script setup>

    import { useDraggable }     from '@vueuse/core'    
    import { useKeepInView }    from '@/composables/UseKeepInView'

    defineOptions({ inheritAttrs: false })

    const appStore          = useAppStore()
    const { activeFloater } = storeToRefs(appStore)

    const props = defineProps(
    {
        name:       { type: String,  required: true },
        title:      { type: String,  default: null },
        initialX:   { type: Number,  default: 0 },
        initialY:   { type: Number,  default: 0 },
        fixed:      { type: Boolean, default: false },
        showXY:     { type: Boolean, default: false },
        keepInView: { type: Boolean, default: false }, 
    })

    const showFloater   = defineModel({ type: Boolean, default: false })
    const x             = useLocalStorage(`${props.name}_x`, props.initialX)
    const y             = useLocalStorage(`${props.name}_y`, props.initialY)
    const floater       = ref(null)
    const style         = computed(() => ({ left: `${x.value}px`, top: `${y.value}px` }))

    let lastClientX = 0
    let lastClientY = 0

    useDraggable(floater, 
    {
        onStart: (_pos, e) => { lastClientX = e.clientX; lastClientY = e.clientY },
        onMove:  (_pos, e) => 
        {
            x.value += e.clientX - lastClientX
            y.value += e.clientY - lastClientY
            lastClientX = e.clientX
            lastClientY = e.clientY
        },
    })

    const keepInView    = computed(() => props.fixed || props.keepInView)
    const bringToFront  = () => activeFloater.value = props.name 
    const resetPosition = () => { x.value = props.initialX; y.value = props.initialY }

    useKeepInView({ el: floater, x, y, enabled: keepInView, fixed: toRef(props, 'fixed') })
 
</script>

<template>

    <Teleport v-if="showFloater" to="#modals" >

        <div :id="props.name" ref="floater" v-bind="$attrs" 
            :style="style" @mousedown="bringToFront"
            :class="[props.fixed ? 'fixed' : 'absolute', 'w-[200px] drop-shadow-xl border select-none',
                activeFloater === props.name ? 'z-[2000]' : 'z-[1000]']">

            <slot name="header">
                <div class="flex justify-between items-center
                    p-2 bg-color-blue text-white font-bold select-none"
                    @contextmenu.prevent="resetPosition"
                    title="Right-click to reset position">
                    
                    <span>{{ title || 'Title' }}</span>

                    <span v-if="showXY"
                        class="text-color-mid-blue">
                        <span class="mr-2">x: {{x.toFixed(0)}}</span>
                        <span>y: {{y.toFixed(0)}}</span>
                    </span>

                    <div class="size-4 bg-white hover:bg-color-light-blue rounded-full flex-center" 
                        @click="showFloater = false">
                        <IconSymbol width="12px" class="text-color-dark-gray" icon="heroicons-solid:x" />
                    </div>
                </div>
            </slot>

            <slot></slot>

        </div>

    </Teleport>

</template>


<!-- Usage: 

    <FloaterControl v-model="showFloaterTwo" name="FloaterTwo" title="Floater Two" keepInView fixed
        class="bg-white w-[400px] h-[300px] p-5">
        Some floating content here.
    </FloaterControl>
-->

<!-- Could add this in markup above under <slot></slot> if needed to display position info:

    <div class="px-2 flex">
        <span class="w-1/2">x: {{x.toFixed(2)}}</span>
        <span class="w-1/2">y: {{y.toFixed(2)}}</span>
    </div>
-->

    

