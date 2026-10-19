<script setup>

    // radius and pixelSize are currently clunky and could be cleaned up.

    const props = defineProps(
    {
		pixelSize:  { type: Number, default: 40 },
		radius:     { type: String, default: '40px' },
        color:      { type: String, default: 'white' },
        background: { type: String, default: 'transparent' }
	})

    const size      = computed(() => `${props.pixelSize}px`)
    const radius    = ref(props.radius)
    const color     = ref(props.color)
    const styles    = computed(() => ({ width: size.value, height: size.value }) )

</script>

<template>
    <div class="corner absolute overflow-hidden" :style="styles"></div>
</template>


<style  scoped> 
    /* Important: Should not be scoped. Note: this is CSS NOT tailwind */
    .corner:before
    {
        content: "";
        display: block;
        width: 200%;
        height: 200%;
        position: absolute;
        border-radius: v-bind(radius);
        background-color: v-bind(background);
    }
    .corner:before
    {
        bottom: 0;
        right: 0;
        box-shadow: v-bind(size) v-bind(size) 0 0 v-bind(color);
    }
</style>
