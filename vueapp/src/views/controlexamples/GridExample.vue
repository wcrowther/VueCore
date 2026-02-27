<script setup>

    const listIndex     = ref(0)
    const animal        = ref(0)
    const color         = ref(0)
    const webPageIndex  = ref(0)
    const gridIndex     = ref(2)
    const rangeList     = ['0','1','2','3','4','5','6','7','8','9']
    const animalList    = ['Cats','Dogs','Tigers','Bears','Lions']
    const colors        = ['Red','Yellow','Blue','Green','Orange']
    const webPages = 
    [
        { name: 'Cnn',      url: 'https://www.cnn.com'},
        { name: 'Time',     url: 'https://www.time.com'},
        { name: 'UsaToday', url: 'https://www.usatoday.com'},
    ]
    const gridSizes =
    [
        { name: 'Grid Size 4x4',   rows: 4, cols: 4 },
        { name: 'Grid Size 6x6',   rows: 6, cols: 6 }, 
        { name: 'Grid Size 8x8',   rows: 8, cols: 8 }, 
        { name: 'Grid Size 10x10', rows: 10, cols: 10 },
    ]

</script>

<template>

    <div class="flex flex-wrap">

        <div class="font-bold mb-5 basis-full flex-none">Grid Control</div>

        <div class="mb-5 basis-full flex-none">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident 
            dolor ullam voluptas error esse necessitatibus quis deleniti nesciunt? 
            Illum officia corporis dignissimos nam consequatur!
        </div>
        
        <div class="md:w-1/2 mb-5">                
            <ListIndexButton v-model="gridIndex" :rangeList="gridSizes" class="w-fit p-3 mb-3" />
            <GridControl :rows="gridSizes[gridIndex].rows" :cols="gridSizes[gridIndex].cols" />
        </div>

        <div class="w-full md:w-1/2 p-5 mb-5 flex flex-wrap gap-1 bg-blue-100 border-b-2">
            <div class="basis-full font-bold mb-5">
                List Index Button
            </div>
            <div class="mb-5 basis-full flex-none">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident 
                dolor ullam voluptas error esse necessitatibus quis deleniti nesciunt? 
                Illum officia corporis dignissimos nam consequatur!
            </div>
            <div class="basis-full mb-5">
                <ListIndexButton v-model="listIndex" :rangeList class="w-fit mb-2" />
                List Index ({{ listIndex }}) - zero-based : {{ rangeList[listIndex] }}
            </div>
            <div class="basis-full mb-5">
                <ListIndexButton v-model="animal" :rangeList="animalList" class="w-fit mb-2" />
                Animal Ordinal - 1-based ({{ animal+1 }}): {{ animalList[animal] }}
            </div>
            <div class="basis-full mb-5">
                <ListIndexButton v-model="color" :rangeList="colors" :wrapBack="false" class="w-fit mb-2" />
                Color ({{ color+1 }}) - does not wrap: {{ colors[color] }}
            </div>
            <div class="basis-full flex flex-wrap gap-2">
                <ListIndexButton v-model="webPageIndex" :rangeList="webPages" 
                    class="w-fit mb-2 inline-block"/>
                <ListIndexButton v-model="webPageIndex" :rangeList="webPages" textName="url" 
                    class="w-fit mb-2 inline-block" />
                <div class="basis-full flex-none">
                    Web Pages ({{ webPageIndex }}) : {{ webPages[webPageIndex].url }}
                </div>
            </div>
        </div>

    </div>


</template>