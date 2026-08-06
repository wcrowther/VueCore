<script setup>

    const { platform }			    = usePlatform()
    const appStore                  = useAppStore()
    const usersStore                = useUsersStore()
    const toastStore                = useToastStore()
    const { showJsonEntities }      = storeToRefs(appStore)
    const { user,  detailUserId }   = storeToRefs(usersStore)
    
    const { getUserDetailData, addNewUser, saveUser } = usersStore

    const isAddingUser      = ref(false)
    const showConfirmSave   = ref(false)
    const userFullName      = computed(() => user.value.LastName ? `${user.value.FirstName} ${user.value.LastName}` : '')
    const userTitle         = computed(() => isAddingUser.value ? 'Add new User' : userFullName.value )

    // const rules = computed(() => userValidator) <-- Needed if userValidator is dynamic
	const v$ = useVuelidate(userValidator, user) 

    const getUserDetail = async () =>
    {
        if(detailUserId.value === 0)
            return

        isAddingUser.value   = false

        getUserDetailData(detailUserId.value)
    }

    const addUser = () =>
    {
       isAddingUser.value = true 
       addNewUser()
    }

    const cancelAdd = () =>
    {
       isAddingUser.value = false 
       v$.value.$reset()
       getUserDetail()
    }

    const confirmDelete = () => alert('Delete not implemented.')
    
    const confirmSave = async () =>
    {
        const isValidUser = await v$.value.$validate()

        if(isValidUser)
        {
            showConfirmSave.value = true
        }
        else
        {
            let message = 'Cannot save as user is not valid.'
            toastStore.showError(message) 
        }    
    }

    const saveUserDetail = async (confirmResult) =>
    {        
        if(!confirmResult) // cancelled
        {
             showConfirmSave.value = false
             return
        }
  
        saveUser()
        isAddingUser.value = false 
        showConfirmSave.value = false
        v$.value.$reset()
    }

    // Listeners   =============================================================================
``
    const keys = 
    {
        'Ctrl+KeyS': () => onfirmSave()
    }

	KeyboardListeners(keys);

    // Lifecycle & Watches  ==========================================================================

    onMounted(() => getUserDetail())

    watch(() => detailUserId.value, (newVal, oldVal) => 
    {
        // console.log('User userId newval: ' + newVal + ' oldVal: ' + oldVal)

        if(newVal === oldVal) return
        getUserDetail()  
    });

    // ===============================================================================================

</script>

<template>

    <div id="UsersDetailView" class="">

        <ConfirmControl v-model="showConfirmSave" message="Save User Data?" 
			@confirmResult="saveUserDetail"  />

        <PageTitleBox :pageTitle="userTitle || 'Users'">

            <template v-if="isAddingUser || hasKeys(user) && user.UserId > 0">
                <IconSymbol width="22px" @click="confirmSave" title="Save User"
                    class="text-color-mid-blue hover:text-white mt-[2px]" icon="fa-solid:save" />
            </template>

            <IconSymbol v-if="isAddingUser" width="28px" @click="cancelAdd" title="Cancel"
                class="text-color-mid-blue hover:text-white" icon="heroicons:x-circle-16-solid" />
            <IconSymbol v-else width="28px" @click="addUser" title="Add User"
                class="text-color-mid-blue hover:text-white" icon="heroicons:plus-circle-16-solid" />

            <template v-if="isAddingUser || hasKeys(user) && user.UserId > 0">
                <IconSymbol width="28px" @click="confirmDelete" title="Delete User"
                    class="text-color-mid-blue hover:text-white -ml-[4px]" icon="heroicons:trash-16-solid" />
            </template>

        </PageTitleBox>

        <InfoBox>
            This panel displays the details for a single User, including their name, email, role, and account status.
            Use the <b>Add</b> button to create a new User, or select an existing User from the list to view and edit their profile.
            Changes must be saved explicitly — a confirmation prompt will appear before any save is committed.
        </InfoBox>

        <HelpBox>
            <b>Keyboard Shortcuts:</b> Press <b>Ctrl+S</b> (or <b>Cmd+S</b> on Mac) to trigger a save at any time.
            Press <b>Esc</b> to collapse the left navigation panel for more working space.
            <br /><br />
            <b>Validation:</b> Required fields such as First Name, Last Name, and Email are validated before saving.
            If any field is invalid a toast notification will indicate the issue and the save will be blocked until corrected.
            <br /><br />
            <b>Adding Users:</b> Click <b>Add</b> to create a new User. Fill in the required fields, assign a Role,
            and set the account to Active before saving. Click <b>Cancel</b> at any time to discard the new entry
            and return to the previously selected user.
        </HelpBox>

        <div class="relative flex flex-wrap gap-5">
        
            <JsonTreeControl v-if="showJsonEntities" :json="user" class="w-full"
                label="User Detail Json" :isOpen="false" />

            <div v-if="(!user || user.UserId === 0)  && !isAddingUser" class="w-[300px] font-bold">
                No User to display
            </div>
            <div v-if="user && user.UserId > 0 || isAddingUser"
                class="w-[300px] flex-1 border border-color-blue-gray bg-white p-5 min-w-[200px] grow">
                <TitleBox v-if="!isAddingUser">
                    <span class="text-color-dark-blue font-bold whitespace-nowrap text-l">
                        UserName: {{user.UserName}}
                    </span>
                    <span class="text-color-dark-blue font-bold whitespace-nowrap text-l">
                        UserId: {{user.UserId}}
                    </span>
                </TitleBox>
                <CreatorBox v-if="!isAddingUser" :IAuditable="user" />
                <template v-if="isAddingUser">
                    <TextInput labelName="UserName"     v-model="user.UserName"     :v$ />
                    <TextInput labelName="UserPassword" v-model="user.UserPassword" :v$ />
                </template>
                <TextInput labelName="First Name" v-model="user.FirstName" :v$ />
                <TextInput labelName="Last Name"  v-model="user.LastName"  :v$ />
                <TextInput labelName="UserEmail"  v-model="user.UserEmail" :v$ />
                <SelectInput labelName="Role"     v-model="user.Role" :optionsList="rolesList" :v$ />
            </div>
            
        </div>

    </div>

</template>
