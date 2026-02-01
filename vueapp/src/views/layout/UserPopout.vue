<script setup>

    const authStore	        = useAuthStore()
    const appStore          = useAppStore()

    const { logout, refreshAuth }   = authStore
	const { firstInitial, 
            authUser, 
            isLoggedIn, 
            tokenExpiration, 
            lastRequestDatetime }   = storeToRefs(authStore)  
                  
    const { persistSearch,  
            showPrevNext, 
            showBreakpoints, 
            showNotification,
            altTheme, 
            pagerDebugger,
            showJsonEntities }      = storeToRefs(appStore) 
            
    const { resetLocalStorage   }   = appStore

    const showPopout        = ref(false)
    const pinPopout         = ref(false)

	const popoutToggle      = () => { if(!pinPopout.value) showPopout.value = !showPopout.value }
	const popoutClose       = () => { if(!pinPopout.value) showPopout.value = false }
    const logoutUser        = () => 
    {
        showPopout.value = false
        logout()
    }  

    const refreshAuthToken = () =>
    {
        let authRefreshRequest = new AuthRefreshRequest(authUser.value.UserId)
        refreshAuth(authRefreshRequest)
    }

    const fullName = computed(() => authUser.value.LastName ? `${authUser.value.FirstName} ${authUser.value.LastName}` : '---')

    // const numbers           = ref()
    // const filteredToNumbers = computed(
    // {
    //     get: () => numbers.value,
    //     set: (newValue) =>  numbers.value = numbersOnly(newValue)
    // });

</script>

<template>

    <div class="relative" id="userPopout" @mouseleave="popoutClose()">

        <div v-if="isLoggedIn" @click="popoutToggle(true)" title="Show user popout" id="popout"
            class="relative z-[100] text-white size-10 tracking-wider 
                rounded-full bg-gray-700 flex-center hover:bg-opacity-30">
            <span class="text-sm m-auto">{{firstInitial}}</span>
        </div>

        <router-link v-if="!isLoggedIn" title="Login" to='/auth/login'
            class="flex pt-px px-4 items-center relative h-[28px] text-sm font-semibold rounded-full tracking-wider
                text-theme-footer-text/80 hover:theme-footer-text bg-white/30 hover:bg-white/0">
            Login 
        </router-link>
        
        <div v-if="showPopout"
            class="z-[90] absolute min-h-[520px] w-[385px] top-0 rounded-tl-[20px] 
                border border-color-gray bg-gradient-main shadow-lg shadow-color-mid-gray">
            
            <IconSymbol v-if="pinPopout" class="icon-symbol" @click="pinPopout=!pinPopout" icon="heroicons:lock-closed-20-solid" />
            <IconSymbol v-else           class="icon-symbol" @click="pinPopout=!pinPopout" icon="heroicons:lock-open-20-solid" />

            <div class="px-7 pt-10 pb-10">
                <div class="flex gap-x-2 my-5">
                    <button class="btn-delete" title="Log out user" @click="logoutUser">Logout</button>
                    <button class="btn-delete" title="Refresh user auth token" @click="refreshAuthToken">Refresh Token</button>
                    <button class="btn-delete" title="Reset App preferences" @click="resetLocalStorage">Reset</button>
                </div>
                <div class="label-row">
                    <div class="label-title"
                        title="Logged-in UserId">UserId:</div>
                    <div class="label-value">{{ authUser.UserId || 0 }}</div>
                </div>
                <div class="label-row">
                    <div class="label-title"
                        title="Logged-in UserName">UserName:</div>
                    <div class="label-value">{{ authUser.UserName }}</div>
                </div>
                <div class="label-row">
                    <div class="label-title"
                        title="Logged-in Full Name">Full Name:</div>
                    <div class="label-value">{{ fullName }}</div>
                </div>
                <div class="label-row">
                    <div class="label-title"
                        title="Logged-in UserEmail">User Email:</div>
                    <div class="label-value">{{ authUser.UserEmail }}</div>
                </div>
                <div class="label-row">
                    <div class="label-title" 
                        title="User Role">User Role:</div>
                    <div class="label-value">{{ authUser.Role }}</div>
                </div>
                <div class="label-row">
                    <div class="label-title"
                        title="JWT token expiration date">Expiration:</div>
                    <div class="label-value">{{ dateTimeFormat(tokenExpiration) }}</div>
                </div>
                <div class="label-row">
                    <div class="label-title"
                        title="JWT token expiration date">Last Request:</div>
                    <div class="label-value">{{ dateTimeFormat(lastRequestDatetime) || '---' }}</div>
                </div>
                <!-- 
                <div class="label-row">
                    <div class="label-title" 
                        title="JWT Token">Token:</div>
                    <div class="label-value flex items-center">{{ tokenDisplay }}
                        <IconSymbol class="text-color-mid-blue ml-2 hover:text-gray-700" title="Copy JWT Token" 
                            @click="tokenToClipboard()" width="16px" icon="heroicons:clipboard-20-solid" />
                    </div>
                </div> 
                -->
                <div class="label-row">
                    <div class="label-title" 
                        title="Prev/Next buttons for mobile pager (only show at low res)">Prev / Next:</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="showPrevNext" />
                    </div>
                </div>
                <div class="label-row">
                    <div class="label-title" 
                        title="Show breakpoints in lower left">Breakpoints:</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="showBreakpoints" />
                    </div>
                </div> 
                <div class="label-row">
                    <div class="label-title" 
                        title="Toggle on/off alternate color scheme.">Alt Theme:</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="altTheme" />
                    </div>
                </div>
                <div class="label-row">
                    <div class="label-title" 
                        title="Toggle on/off alternate color scheme.">Pager Debugger:</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="pagerDebugger" />
                    </div>
                </div>
                <div class="label-row">
                    <div class="label-title" 
                        title="Show breakpoints in lower left">ShowNotification:</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="showNotification" />
                    </div>
                </div>
                <div class="label-row">
                    <div class="label-title" 
                        title="Show main entites as Json">Show Json Entities:</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="showJsonEntities" />
                    </div>
                </div>
                <div class="label-row">
                    <div class="label-title" 
                        title="Persist search on page load">Persist Search</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="persistSearch" />
                    </div>
                </div>    
                
               <!--  
                <div class="label-row">
                    <div class="label-title" 
                        title="Show New Chats button">ShowNewChatMessages:</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="showNewChatMessages" />
                    </div>
                </div>  
                <div class="flex">
                    <div class="label-title">Numbers Only:</div>
                    <div class="label-value flex flex-col">
                        <input class="" type="text" v-model="filteredToNumbers" spellcheck="false" />
                        <div class="ml-2 mt-2">{{ numbersOnly(numbers, '-.,') }}</div>
                        <div class="ml-2 mt-2">{{ usPhoneFormat(numbers) }}</div>
                    </div>
                </div> 
                <div class="label-row">
                    <div class="label-title" 
                        title="Persist search on page load">Persist Search</div>
                    <div class="label-value">
                        <CheckboxInput labelName="" v-model="persistSearch" />
                    </div>
                </div>    
                <SwitchButton class="mt-3 bg-color-blue-gray text-white font-bold w-[100px]" title="Toggle Pin"  
                    buttonName="PinPopout" v-model="pinPopout" /> 
                -->  
            </div>
        </div>
    </div>

</template>

<style lang="postcss" scoped>

    .label-row      { @apply flex h-8 items-center }
    .label-title    { @apply w-1/2 font-bold whitespace-nowrap }
    .label-value    { @apply flex-grow whitespace-nowrap }
    .icon-symbol    { @apply absolute top-3 right-3 text-color-mid-blue hover:text-gray-700}

</style> 
 
