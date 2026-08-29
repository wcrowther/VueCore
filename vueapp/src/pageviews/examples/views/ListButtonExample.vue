<script setup>

    // INDEXES
    const listIndex     = ref(0)
    const animal        = ref(0)
    const color         = ref(0)
    const boolIndex     = ref(0)
    const webPageIndex  = ref(0)

    // SELECTED VALUES
    const selectedAnimal = ref(null)
    const selectedBool   = ref(null)
    const selectedPage   = ref(null)

    // LISTS
    const rangeList     = ['0','1','2','3','4','5','6','7','8','9']
    const animalList    = ['Cats','Dogs','Tigers','Bears','Lions']
    const colors        = ['Red','Yellow','Blue','Green','Orange']
    const boolList      = [ { name: 'BOOL: ON ', value: true},
							{ name: 'BOOL: OFF', value: false} ]
    const webPages 		= 
    [
        { name: 'Cnn',      url: 'https://www.cnn.com'},
        { name: 'Time',     url: 'https://www.time.com'},
        { name: 'UsaToday', url: 'https://www.usatoday.com'},
    ]

</script>

<template>

    <div class="w-full">

        <PageTitleBox pageTitle="List Index Button" />

        <InfoBox>
            The <b>ListButton</b> is a lightweight prev/next navigator for stepping through any array. 
            It binds to a zero-based index via <code>v-model</code> and accepts any array as <code>:rangeList</code>. 
            By default it displays the item's <code>name</code> property, but you can override this with the 
            <code>textName</code> prop. Set <code>:wrapBack="false"</code> to prevent cycling past the first or last item.
        </InfoBox>
        
        <div class="basis-full mb-5">
            <ListButton v-model="listIndex" :rangeList class="w-fit mb-2" />
            List Index ({{ listIndex }}) - zero-based : {{ rangeList[listIndex] }}
        </div>
        <div class="basis-full mb-5">
            <ListButton v-model="animal" :rangeList="animalList" class="w-fit mb-2" />
            Animal Ordinal - 1-based ({{ animal+1 }}): {{ animalList[animal] }}
        </div>
        <div class="basis-full mb-5">
            <ListButton v-model="boolIndex" :rangeList="boolList"
				class="w-[96px] mb-2" />
			Bool Ordinal - with description - Bool: ({{ boolIndex }}) {{ boolList[boolIndex].value }}
		</div>
        <div class="basis-full mb-5">
            <ListButton v-model="color" :rangeList="colors" :wrapBack="false" class="w-fit mb-2" />
            Color ({{ color+1 }}) - does not wrap: {{ colors[color] }}
        </div>
        <div class="basis-full flex flex-wrap gap-2">
            <ListButton v-model="webPageIndex" :rangeList="webPages" 
                class="w-fit mb-2 inline-block"/>
            <ListButton v-model="webPageIndex" :rangeList="webPages" textName="url" 
                class="w-fit mb-2 inline-block" />
            <div class="basis-full flex-none">
                Web Pages ({{ webPageIndex }}) : {{ webPages[webPageIndex].url }}
            </div>
        </div>

        <InfoBox class="mt-5">
            <code>selectedValue</code> is a second, two-way model that mirrors the selected item itself, 
            so the parent doesn't need to look up the item from the index.
        </InfoBox>

        <div class="basis-full mb-5">
            <ListButton v-model:selectedValue="selectedAnimal" :rangeList="animalList" class="w-fit mb-2" />
            Selected animal (no index needed): {{ selectedAnimal }}
        </div>
        <div class="basis-full mb-5">
            <ListButton v-model:selectedValue="selectedBool" :rangeList="boolList" class="w-[96px] mb-2" />
            Selected bool item: {{ selectedBool?.value }}
        </div>
        <div class="basis-full mb-5">
            <ListButton v-model="webPageIndex" v-model:selectedValue="selectedPage" :rangeList="webPages" class="w-fit mb-2" />
            Index and item both bound - index ({{ webPageIndex }}): {{ selectedPage?.url }}
        </div>

    </div>

</template>