<script setup>

    import { useConfirmControl } from '@/composables/UseConfirmControl';

    const isDirty               = ref(false)
    const enableGlobal           = useLocalStorage('enableGlobal', true)

    const { createConfirm }     = useConfirmControl();
    
    const handleSave = async () => 
    {
        if (!isDirty.value) // only confirm if there are unsaved changes
        {
            console.log('Nothing to save!') 
            return
        }   
        
        const confirmed = await createConfirm('Are you sure you want to save this item?')
    
        if (confirmed) 
            console.log('Item saved!') 
        else 
            console.log('Save cancelled.')
     }

    useUnsavedGuard(isDirty, () => createConfirm('You have unsaved data. Continue?'), enableGlobal.value)

    const inlineCallback = () => console.log('Inline Confirm with Callback.')

</script>

<template>
	<LayoutMain>
    
        <div class="bg-gray h-12 p-3 flex items-center gap-3">

            <!-- <PrimaryButton @click="sideBarHidden = !sideBarHidden" title="Show / Hide" /> -->

            <PrimaryButton @click="isDirty = !isDirty"> Is Dirty? {{ isDirty }}</PrimaryButton>  

            <PrimaryButton @click="enableGlobal = !enableGlobal"> Enable Global? {{ enableGlobal }}</PrimaryButton>   

            <PrimaryButton @click="handleSave" title="Save Something" class="bg-red" /> 

            <PrimaryButton @click="createConfirm('Call Inline Callback?', inlineCallback)" title="Inline Confirm"  /> 

        </div>

        <!-- LEGACY TEST CODE: <SwipeLeftRight /> -->

        <TabsControlExample />


    </LayoutMain>

</template>