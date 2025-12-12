<script setup>

    // NOT CURRENTLY WORKING - WOULD LIKE TO BRING SEARCH INTO ITS OWN COMPONENT
    // INSTEAD OF PASSING IN THESE MODELS - TRY USING THE STORE VERSIONS...

    const listPager     = defineModel('listPager',     { type: PagerModel, required: true })
    const showAdvSearch = defineModel('showAdvSearch', { type: Boolean, default: false })

</script>

<template>

    <div class="px-5 pb-3 flex flex-wrap justify-between items-center border-t border-r border-slate-300
           bg-gradient-side shadow-[0_10px_30px_-5px_rgb(0,0,0,0.4)] xxs:shadow-none">

        <div class="flex gap-x-1 pt-5 w-full">
            <SearchInput ref="searchInput" v-model="pager.Search.Filter" v-model:showAdvSearch="showAdvSearch" />
        </div>

        <UsersFilters :listPager @showAdvancedSearch="showAdvSearch = true" />

        <div class="w-full flex justify-between items-center select-none my-3">
            <ListPager class="mr-2" id='listPager' v-bind:pager="listPager" />
            <span class="text-sm xs:hidden md:inline whitespace-nowrap">
                Total: {{ listPager.TotalCount || 0 }}
            </span>
        </div>

        <InfoBox class="mb-3">
            Enter a UserId or search text for the start of an User First or Last Name.
        </InfoBox>

        <HelpBox :compact="true">
            You can add multiple conditions separated by a comma.
            Click on the + sign for the Advanced Search with additional options.
        </HelpBox>

        <MobilePagerPrevNext :pager="listPager" />

    </div>

</template>
