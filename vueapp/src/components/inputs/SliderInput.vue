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

</script>

<template>
    <div class="mb-3 w-full">

        <div v-if="!props.hideLabel"
            class="pb-1 flex justify-between items-baseline">
            <label class="text-color-dark-blue font-bold whitespace-nowrap text-xs"
                :for="props.labelName">
                {{ props.labelName }}
            </label>
            <span class="text-xs text-color-dark-gray tabular-nums">
				{{ modelValue }} px
			</span>
        </div>

        <div class="flex items-center gap-3">
			<div class="w-fit">
				{{ props.minName }}
			</div>
			<input type="range" v-model.number="modelValue"
				:id="props.labelName" :name="props.labelName"
				:min="props.min" :max="props.max" :step="props.step"
				class="range-input w-full accent-blue-500 flex-1" />
			<div class="w-fit">
				{{ props.maxName }}
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
  background: #007bff;
  cursor: pointer;
  border-radius: 0; /* This makes it a rectangle */
}

/* Style the thumb for Firefox */
input.range-input::-moz-range-thumb {
  width: 5px;
  height: 20px;
  background: #007bff;
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