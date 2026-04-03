<script setup>

    import { useDraggable } from '@vueuse/core'    

    const appStore              = useAppStore()
    const { activeFloater  }    = storeToRefs(appStore)

    const props = defineProps({
        name:       { type: String,  required: true },
        initialX:   { type: Number,  default: 0 },
        initialY:   { type: Number,  default: 0 },
        show:       { type: Boolean, default: false },
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

    <Teleport v-if="show" to="#modals" >

        <div :id="props.name" ref="floater" v-bind="$attrs" 
            :style="style" @mousedown="bringToFront"
            :class="['absolute  w-[200px] drop-shadow-xl border select-none',
                activeFloater === props.name ? 'z-[2000]' : 'z-[1000]']">

            <slot></slot>

        </div>

    </Teleport>

</template>


<!-- Usage: 

    <FloaterControl :show="true" name="FloaterTwo"
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

    

