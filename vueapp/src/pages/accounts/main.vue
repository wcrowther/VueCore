
<script setup></script>

<template>
    <div class="flex" id="accounts-main">

        <MainSidebar>
            <AccountsList />
        </MainSidebar>     
        
        <MainRight class="bg-gradient-main">
            <AccountDetail />
        </MainRight>   

        <!-- 
        // ALTERNATIVE APPROACH: Using SidebarControl (Not yet working) 
        <SidebarControl :showSideBar="sideBarHidden">

            <template #sidebar>
                <div class="bg-orange w-full h-full p-5">sidebar</div>
            </template>

            <template #default>
                <div class="bg-yellow w-full h-full p-5">default</div>
            </template>

        </SidebarControl>	
        -->

    </div>
</template> 

