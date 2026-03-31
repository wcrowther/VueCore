<script setup>

    const appStore                  = useAppStore()    
    const toastStore                = useToastStore()
    const accountsStore             = useAccountsStore()

    const { showJsonEntities }      = storeToRefs(appStore)
    const { account,    
            detailAccountId,    
            accountIsDirty  }       = storeToRefs(accountsStore)
    const { getAccountDetailData,   
            addNewAccount,  
            saveAccount,    
            resetAccount }          = accountsStore
        
    const isAddingAccount           = ref(false)
    const showConfirmControl        = ref(false)

    //const swipe                     = ref('')
    //const accountDetailRef          = useTemplateRef('accountDetail');
    
	const v$ = useVuelidate(accountValidator, account)

    const accountTitle = computed(() => { 
        return isAddingAccount.value
            ? 'Add new Account' 
            : (hasKeys(account.value) ? account.value?.AccountName : 'Accounts') 
    }) 

    const getAccountDetail = async () =>
    {
        isAddingAccount.value   = false
        getAccountDetailData(detailAccountId.value)
    }

    const addAccount = () =>
    {
       isAddingAccount.value = true 
       addNewAccount()
    }

    const cancelAdd = () =>
    {
       isAddingAccount.value = false 
       v$.value.$reset()
       getAccountDetail()
    }

    const trySave = () =>
    {
        if (accountIsDirty.value)
            confirmSave()
        else
            toastStore.showWarning('No changes to Save.')
    }

    const confirmSave = async () =>
    {
        const isValidAccount = await v$.value.$validate()
        if(isValidAccount)
        {
            showConfirmControl.value = true
        }
    }

    const saveAccountDetail = async (confirmResult) =>
    {
        if(!confirmResult)  // cancelled
        {
            showConfirmControl.value = false
            return
        }
        
        saveAccount()
        isAddingAccount.value = false 
        showConfirmControl.value = false
    }

    // Keyboard Listeners  =====================================================================

    const keys = function (e)   
    {
        let ctrl = navigator.userAgentData.platform.match("Mac") ? e.metaKey : e.ctrlKey   
        if (e.code === 'KeyS' && ctrl ){ trySave(); e.preventDefault(); }
        // else if (e.code === 'End')  { detailInput.value.focusInput();    e.preventDefault();} 
    }

	KeyboardListeners(keys)    

    // Lifecycle & Watches  ===================================================================

    onMounted(() => 
    { 
        getAccountDetail() 
    })

    watch(() => detailAccountId.value, (newVal, oldVal) => 
    {
        if(newVal === oldVal) 
            return

        getAccountDetail()  
    });

    // EXPERIMENTAL BELOW

    // Swipe Left / Right =====================================================================
    // import { useSwipe } from '@vueuse/core';
    // const handleSwiped = (event, direction) => 
    // {
	// 	if (direction === 'RIGHT') 
	// 		swipe.value = '-->'
	// 	else if (direction === 'LEFT') 
	// 		swipe.value = '<--'    
    // }
    // useSwipe(accountDetailRef, { onSwipeEnd: handleSwiped, threshold: 50 });

    // Unsaved Guard   ========================================================================
    // -- stops navigation away if there are unsaved changes
    // const { createConfirm } = useConfirmControl();
    // let customMessage = 'You have unsaved changes to this Account. Leave the page?'
    // 
    // useUnsavedGuard(accountIsDirty, () => createConfirm(customMessage), true) 

</script>

<template>
    <div class="flex flex-wrap gap-5" id="AccountDetailView" ref="accountDetail">
        
        <ConfirmControl v-if="showConfirmControl" v-model="showConfirmControl"
			message="Save Account Data?" @confirmResult="saveAccountDetail"  />

        <div class="w-full flex justify-between items-center">

            <h2 class="text-2xl font-display font-bold flex-grow">{{ accountTitle || 'Accounts'}}</h2>

            <span class="flex flex-wrap gap-1.5"> 

                <button v-if="!isAddingAccount && accountIsDirty && hasKeys(account) && account.AccountId > 0" 
                    class="btn-cancel flex items-center px-2" @click="resetAccount" 
                    title="Revert unsaved changes to Account">
                    <IconSymbol width="18px" class="text-warm-600"  icon="heroicons:arrow-left-20-solid" />
                </button>

                <button v-if="isAddingAccount || hasKeys(account) && account.AccountId > 0" 
                    class="btn-primary" :disabled="!accountIsDirty" @click="confirmSave">
                    Save
                </button>

                <button v-if="!isAddingAccount" class="btn-primary" @click="addAccount">
                    Add
                </button>    
                
                <button v-else class="btn-cancel" @click="cancelAdd">Cancel</button>

            </span>
        </div>

        <InfoBox>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Voluptates accusamus repudiandae quam officiis temporibus dicta ipsa iure? 
            Iusto dicta nulla error. Fugit aspernatur odit voluptate, quo libero id minus.
        </InfoBox>

        <HelpBox>
            Voluptates accusamus repudiandae quam officiis temporibus dicta ipsa iure? 
            Iusto dicta nulla error. Fugit aspernatur odit voluptate, quo libero id minus.
        </HelpBox>

        <JsonTreeControl v-if="showJsonEntities" :json="account" class="w-full" 
            label="Account Detail Json" :isOpen="false" :showRawJson="false" />

        <div v-if="(!account || account.AccountId === 0)  && !isAddingAccount" 
            class="w-[300px] font-bold">
            No Account to display
        </div>

        <div v-if="account && account.AccountId > 0 || isAddingAccount"  
            class="w-[300px] flex-1 border border-color-blue-gray bg-white p-5 min-w-[200px] grow ">

            <TitleBox v-if="!isAddingAccount">
                <span>{{account.AccountName}}</span>
                <span>Account Id: {{account.AccountId}}</span>
            </TitleBox>

            <CreatorBox v-if="!isAddingAccount" :IAuditable="account" />

            <TextInput  labelName="Account Name" v-model="account.AccountName" :v$ />
            <TextInput  labelName="Main Email" ruleName="AccountEmail" v-model="account.AccountEmail" :v$ />
            <PhoneInput labelName="Main Phone" ruleName="AccountPhone" v-model="account.AccountPhone" :v$ />

            <div class="mt-7 flex flex-wrap justify-between gap-5 mb-3">
                <CheckboxInput labelName="Is Active"  v-model="account.IsActive" />
                <CheckboxInput labelName="Is Invoice" v-model="account.IsInvoice" />
                <CheckboxInput labelName="Is AutoPay" v-model="account.IsAutoPay" />
            </div>

        </div>

        <div v-if="account && account.AccountId > 0 || isAddingAccount"  
            class="w-[300px] flex-1 border border-color-blue-gray bg-white p-5 min-w-[200px] grow">

            <!-- -->
            <TitleBox class="bg-transparent">
                <span>Account Address</span>
            </TitleBox> 
            
            <TextInput labelName="Street Address" v-model="account.StreetAddress" :v$ />
            <TextInput labelName="City" ruleName="City" v-model="account.City" :v$ />

            <div class="flex justify-between gap-3">
                <SelectInput labelName="State / Province" ruleName="StateProvince" v-model="account.StateProvince"
                    :optionsList="usStatesList" defaultText="-- Pick a State --" :v$ />
                <TextInput labelName="Postal Code" ruleName="PostalCode" v-model="account.PostalCode" :v$ />
            </div>
                 
        </div>

    </div>
</template>

<style lang="postcss" scoped></style> 

<!-- 
    <TextInput labelName="State / Province" ruleName="StateProvince" v-model="account.StateProvince" :v$></TextInput>
    <div class="mb-3">
        <span class="text-color-dark-blue font-bold whitespace-nowrap text-sm">States</span>
        <span v-for="error in v$.StateProvince.$errors" :key="error.$uid"
            class="italic font-bold text-right text-xs text-color-red">
            {{ error.$message }}
        </span>
        <select class="w-full p-2.5" name="states" id="states" v-model="account.StateProvince">
            <option value="">--- Select ---</option>
            <option v-for="(value,key) in usStatesList" :key="key" :value="key">{{ value }}</option>
        </select>
    </div> 
-->