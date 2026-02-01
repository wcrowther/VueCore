    <script setup>

    const listValue = ref(0)
    const animalValue = ref(0)
    const colorValue = ref(0)
    const rangeList = ['0','1','2','3','4','5','6','7','8','9']
    const animalList = ['Cats','Dogs','Tigers','Bears','Lions']
    const colorList = ['Red','Yellow','Blue','Green','Orange']
    // const webPages = 
    // [
    //     { name: 'Cnn',      url: 'https://www.cnn.com'},
    //     { name: 'Time',     url: 'https://www.time.com'},
    //     { name: 'UsaToday', url: 'https://www.usatoday.com'},
    // ]

</script>

<template>

    <div class="font-bold mb-5">Second Content</div>
    <div class="flex gap-1 mb-5">
        <ListRangeButton v-model="listValue" />
        <ListRangeButton v-model="animalValue" :rangeList="animalList" />
        <ListRangeButton v-model="colorValue" :rangeList="colorList" />
        <!-- <ListRangeButton v-model="webPages" :rangeList="webPages" /> -->
    </div>
    <div class="">
        List Value: {{ listValue+1 }}
    </div>
    <div class="">
        Anima lValue: {{ animalValue+1 }}
    </div>
    <div class="">
        Color Value: {{ colorValue+1 }}
    </div>

    <GridControl :rows="5" :cols="7" 
        class="size-9 bg-white border border-blue aspect-square" >
        <GridCell :rangeList class="rounded-none size-8 leading-8 bg-orange-500" />
    </GridControl>

</template>