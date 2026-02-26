<script setup>

    const listIndex     = ref(0)
    const animal        = ref(0)
    const color         = ref(0)
    const webPageIndex  = ref(0)
    const gridIndex     = ref(1)
    const rangeList     = ['0','1','2','3','4','5','6','7','8','9']
    const animalList    = ['Cats','Dogs','Tigers','Bears','Lions']
    const colors        = ['Red','Yellow','Blue','Green','Orange']
    const webPages      = 
    [
        { name: 'Cnn',      url: 'https://www.cnn.com'},
        { name: 'Time',     url: 'https://www.time.com'},
        { name: 'UsaToday', url: 'https://www.usatoday.com'},
    ]
    const gridSizes     =
    [
        { name: 'Grid Size 10x10', rows: 10, cols: 10 }, 
        { name: 'Grid Size 8x8',   rows: 8, cols: 8 }, 
        { name: 'Grid Size 6x6',   rows: 6, cols: 6 }, 
        { name: 'Grid Size 4x4',   rows: 4, cols: 4 }
    ]

</script>

<template>

    <div class="font-bold mb-5">Second Content</div>
    <div class="flex gap-1 mb-5">
        <ListRangeButton v-model="listIndex" :rangeList />
        <ListRangeButton v-model="animal" :rangeList="animalList" />
        <ListRangeButton v-model="color" :rangeList="colors" :wrapBack="false" />
        <ListRangeButton v-model="webPageIndex" :rangeList="webPages" />
        <ListRangeButton v-model="webPageIndex" :rangeList="webPages" textName="url" />
        <ListRangeButton v-model="gridIndex" :rangeList="gridSizes" />
    </div>
    <div class="">
        List Index ({{ listIndex }}) - zero-based : {{ rangeList[listIndex] }}
    </div>
    <div class="">
        Animal Ordinal - 1-based ({{ animal+1 }}): {{ animalList[animal] }}
    </div>
    <div class="">
        Color ({{ color+1 }}) - does not wrap: {{ colors[color] }}
    </div>
    <div class="">
        Web Pages ({{ webPageIndex }}): {{ webPages[webPageIndex].url }}
    </div>

    <GridControl :rows="gridSizes[gridIndex].rows" :cols="gridSizes[gridIndex].cols" class="" />

</template>