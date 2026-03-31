<script setup>

    const appStore                  = useAppStore()
    const usersStore                = useUsersStore()
    const toastStore                = useToastStore()
    const {  showJsonEntities }     = storeToRefs(appStore)
    const {  user,  detailUserId }  = storeToRefs(usersStore)
    const {  getUserDetailData,
        addNewUser, saveUser }      = usersStore

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

    const keys = function (e)   
    {
        let ctrl = navigator.userAgentData.platform.match("Mac") ? e.metaKey : e.ctrlKey   
        if (e.code === 'KeyS' && ctrl) { confirmSave();  e.preventDefault(); }
    }

	KeyboardListeners(keys);

    // Lifecycle & Watches  ==========================================================================

    onMounted(()    => 
    {
        getUserDetail()

    })

    watch(() => detailUserId.value, (newVal, oldVal) => 
    {
        // console.log('User userId newval: ' + newVal + ' oldVal: ' + oldVal)

        if(newVal === oldVal) 
            return

        getUserDetail()  
    });

    // ===============================================================================================

</script>

<template>

    <div class="flex flex-wrap gap-5" id="UsersDetailView">

        <ConfirmControl v-model="showConfirmSave" message="Save User Data?" 
			@confirmResult="saveUserDetail"  />

        <div class="w-full flex justify-between items-center">

            <h2 class="text-2xl font-display font-bold flex-grow">{{ userTitle || 'Users'}}</h2>

            <span class="flex flex-wrap gap-3">   

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

</template>
