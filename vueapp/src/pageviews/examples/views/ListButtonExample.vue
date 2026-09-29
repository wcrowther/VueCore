<script setup>

    const animal            = ref(0)
    const color             = ref(0)
    const webPageIndex      = ref(0)
    const selectedAnimal    = ref(null)

    const animalList        = ['Cats','Dogs','Tigers','Bears','Lions']
    const colors            = ['Red','Yellow','Blue','Green','Orange']

    const webPages 		    = 
    [
        { name: 'Cnn',      url: 'https://www.cnn.com'},
        { name: 'Time',     url: 'https://www.time.com'},
        { name: 'UsaToday', url: 'https://www.usatoday.com'},
    ]

    const swatchIndex        = ref(0)

</script>


<template>

    <div class="font-bold mb-1">ListButton</div>
    
    <p class="mb-4">
        A lightweight prev/next navigator for stepping through any array. Binds to a zero-based index via 
        <code>v-model:index</code> and/or the matching item via <code>v-model:value</code>, accepts any array 
        as <code>:rangeList</code>, displays the item's <code>name</code> property by default (override with 
        <code>textName</code>), can stop instead of wrapping with <code>:wrapBack="false"</code>, and steps 
        backward on right-click.
    </p>

    <div class="mb-4">
        <ListButton v-model:index="animal" :rangeList="animalList" class="w-fit mb-2" />
        <div class="text-xs">Ordinal, 1-based ({{ animal+1 }}): {{ animalList[animal] }}</div>
    </div>

    <div class="mb-4">
        <ListButton v-model:index="color" :rangeList="colors" :wrapBack="false" class="w-fit mb-2" />
        <div>Does not wrap ({{ color+1 }}): {{ colors[color] }}</div>
    </div>

    <div class="mb-4">
        <div class="flex flex-wrap gap-2 mb-2">
            <ListButton v-model:index="webPageIndex" :rangeList="webPages" class="w-fit inline-block" />
            <ListButton v-model:index="webPageIndex" :rangeList="webPages" textName="url" class="w-fit inline-block" />
        </div>
        <div>Dual-bound index ({{ webPageIndex }}): {{ webPages[webPageIndex].url }}</div>
    </div>

    <div>
        <ListButton v-model:value="selectedAnimal" :rangeList="animalList" class="w-fit mb-2" />
        <div>Value-only, no index needed: {{ selectedAnimal }}</div>
    </div>

</template>