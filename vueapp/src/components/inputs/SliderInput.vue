<script setup>

    const props = defineProps(
    {
        labelName:  { type: String, required: true },
		hideLabel:  { type:Boolean, default: true},
        minName:  	{ type: String, default: '' },
        maxName:  	{ type: String, default: '' },
        min:        { type: Number, default: 0 },
        max:        { type: Number, default: 100 },
        step:       { type: Number, default: 1 },
    })

    const modelValue = defineModel()

    const ticks = computed(() => 
    {
        const count = Math.round((props.max - props.min) / props.step)
        return Array.from({ length: count + 1 })
    })

</script>

<template>
    <div class="mb-3 w-full">

        <div v-if="!props.hideLabel"
            class="pb-1 flex justify-between items-baseline">
            <label class="text-color-dark-blue font-bold whitespace-nowrap text-xs"
                :for="props.labelName">
                {{ props.labelName }}
            </label>
        </div>

        <div class="flex items-center gap-3" 
            :title="`${props.minName} to ${props.maxName} by ${props.step}px steps.`">

			<div class="relative flex-1 min-w-0">

                <div class="absolute left-0 right-0 top-1/2 h-5 -translate-y-1/2 z-[1] flex items-center justify-between">
                    <div v-for="(_, i) in ticks" :key="i" class="h-4 w-[1px] bg-[#bbb]"></div>
                </div>

                <input type="range" v-model.number="modelValue"
                    :id="props.labelName" :name="props.labelName"
                    :min="props.min" :max="props.max" :step="props.step"
                    class="range-input relative z-[2] block w-full accent-blue-500" />
            </div> 

			<div class="w-fit min-w-[40px]">
				{{ modelValue }}px
			</div>
            
		</div>

    </div>
</template>

<style>
/* Reset the default appearance of the range input */
input.range-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: #ddd;
  outline: none;
}

/* Style the thumb for WebKit/Blink browsers (Chrome, Safari, Edge) */
input.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 5px;
  height: 20px;
  background: black; /* #007bff; */
  cursor: pointer;
  border-radius: 0; /* This makes it a rectangle */
}

/* Style the thumb for Firefox */
input.range-input::-moz-range-thumb {
  width: 5px;
  height: 20px;
  background: black; /* #007bff; */
  cursor: pointer;
  border-radius: 0; /* This makes it a rectangle */
  border: none;
}
</style>

<!--
EXAMPLES:
    <SliderInput labelName="Volume" v-model="volume" />
    <SliderInput labelName="Volume" v-model="volume" :min="0" :max="100" :step="10" />
    <SliderInput labelName="Size" v-model="size" :min="80" :max="240" :step="20" hideLabel />
-->