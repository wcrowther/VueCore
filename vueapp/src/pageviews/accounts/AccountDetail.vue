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
    const detailInput               = ref(null)

    //const swipe                     = ref('')
    //const accountDetailRef          = useTemplateRef('accountDetail');
    
	const v$ = useVuelidate(accountValidator, account)

    const accountTitle = computed(() => 
    { 
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

    const keys = 
    {
		'Ctrl+KeyS': () => trySave(),
		'Meta+KeyS': () => trySave(),
    	'End':       () => detailInput.value?.focus()
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
    <div  id="AccountDetailView" ref="accountDetail"
        class="" >
        
        <ConfirmControl v-if="showConfirmControl" v-model="showConfirmControl"
			message="Save Account Data?" @confirmResult="saveAccountDetail"  />

        <PageTitleBox :pageTitle="accountTitle || 'Accounts'">

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

        </PageTitleBox>

        <InfoBox>
            This panel displays the details for a single Account, including contact information and billing address.
            Use the <b>Add</b> button to create a new Account, or select an existing Account from the list to view and edit it.
            Changes are tracked automatically — the <b>Save</b> button activates when unsaved edits are detected.
        </InfoBox>

        <HelpBox>
            <b>Keyboard Shortcuts:</b> Press <b>Ctrl+S</b> (or <b>Cmd+S</b> on Mac) to save the current record at any time.
            Press <b>Esc</b> to collapse the left navigation panel and give yourself more working space.
            <br /><br />
            <b>Saving &amp; Resetting:</b> The <b>Save</b> button only becomes active once you've made a change to the record — 
            this prevents accidental saves. If you've made changes and want to discard them, click the <b>Reset</b> button 
            to revert all fields back to the last saved state. A confirmation prompt will appear before any save is committed.
            <br /><br />
            <b>Adding Accounts:</b> Click <b>Add</b> to create a new Account. Fill in the required fields — Account Name, 
            Email, and Phone — then save. Click <b>Cancel</b> at any time to discard the new entry and return to the 
            previously selected account.
        </HelpBox>

        <div class="flex flex-wrap gap-5">
            <JsonTreeControl v-if="showJsonEntities"
                label="Account Detail Json" :json="account" class="w-full"
                :isOpen="false" :showRawJson="false" />
            <div v-if="(!account || account.AccountId === 0)  && !isAddingAccount"
                class="basis-[300px] font-bold">
                No Account to display
            </div>
            <div v-if="account && account.AccountId > 0 || isAddingAccount"  id="AccountInfo"
                class="basis-[300px] min-w-[200px] p-5 flex-1 border border-color-blue-gray bg-white">
                <TitleBox v-if="!isAddingAccount">
                    <span>{{account.AccountName}}</span>
                    <span>Account Id: {{account.AccountId}}</span>
                </TitleBox>
                <CreatorBox v-if="!isAddingAccount" :IAuditable="account" />
                <TextInput ref="detailInput" labelName="Account Name" v-model="account.AccountName" :v$ />
                <TextInput  labelName="Main Email" ruleName="AccountEmail" v-model="account.AccountEmail" :v$ />
                <PhoneInput labelName="Main Phone" ruleName="AccountPhone" v-model="account.AccountPhone" :v$ />
                <TextAreaInput labelName="Notes" ruleName="Notes" v-model="account.Notes" :v$ />
                <div class="mt-3 mb-5 flex flex-wrap justify-between gap-5">
                    <CheckboxInput labelName="Is Active"  v-model="account.IsActive" compact />
                    <CheckboxInput labelName="Is Invoice" v-model="account.IsInvoice" compact />
                    <CheckboxInput labelName="Is AutoPay" v-model="account.IsAutoPay" compact />
                </div>
            </div>

            <!-- ALT VERSION FOR MULTIPLE ADDRESSES - NOT YET IMPLEMENTED
            
            <div v-if="account && account.AccountId > 0 || isAddingAccount" id="MultiAddress"
                class="basis-[300px] min-w-[200px] flex-1 border pt-2 border-color-blue-gray bg-white ">
                <TabsOverflowControl :tabList="['Account', 'Second', 'Third']" altDesign
                    class="w-full">
            
                    <template #Account>
                        <div class="m-5">
                            <TextInput labelName="Street Address" v-model="account.StreetAddress" :v$ />
                            <TextInput labelName="City" ruleName="City" v-model="account.City" :v$ />
            
                            <div class="flex justify-between gap-3">
                                <SelectInput labelName="State / Province" ruleName="StateProvince" v-model="account.StateProvince"
                                    :optionsList="usStatesList" defaultText="-- Pick a State --" :v$ />
                                <TextInput labelName="Postal Code" ruleName="PostalCode" v-model="account.PostalCode" :v$ />
                            </div>
                        </div>
                    </template>
                </TabsOverflowControl>
            </div>
            -->

            <div v-if="account && account.AccountId > 0 || isAddingAccount"  id="Address"
                class="basis-[300px] min-w-[200px] flex-1 border border-color-blue-gray bg-white p-5">
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