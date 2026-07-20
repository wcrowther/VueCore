<script setup>

    import { useDraggable } from '@vueuse/core'    

    const appStore              = useAppStore()
    const { activeFloater  }    = storeToRefs(appStore)

    const showFloater = defineModel({ type: Boolean, default: false })

    const props = defineProps({
        name:       { type: String,  required: true },
        title:      { type: String,  default: null },
        initialX:   { type: Number,  default: 0 },
        initialY:   { type: Number,  default: 0 },
    })

    defineOptions({ inheritAttrs: false })

    const xRef      = ref(useLocalStorage(`${props.name}_x`, props.initialX))
    const yRef      = ref(useLocalStorage(`${props.name}_y`, props.initialY))
    const floater   = ref(null)

    const { x,y,style } = useDraggable(floater, 
    {
        initialValue: { x: xRef, y: yRef },
    })

    const bringToFront = () => activeFloater.value = props.name 

    watchEffect(() => 
    { 
        xRef.value = x.value
        yRef.value = y.value
    })
 
</script>

<template>

    <Teleport v-if="showFloater" to="#modals" >

        <div :id="props.name" ref="floater" v-bind="$attrs" 
            :style="style" @mousedown="bringToFront"
            :class="['absolute  w-[200px] drop-shadow-xl border select-none',
                activeFloater === props.name ? 'z-[2000]' : 'z-[1000]']">

            <slot name="header">
                <div class="p-2 bg-color-blue text-white font-bold select-none flex 
                    justify-between items-center">
                    <span>{{ title || 'Title' }}</span>
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

    <FloaterControl v-model="showFloaterTwo" name="FloaterTwo" title="Floater Two"
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

    

