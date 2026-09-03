<script setup>
	
	const activeTab 		= ref('First')
	const flowIndex 		= useLocalStorage('TabsFlowControlExampleFlowIndex', 0)
	const keepAlive 		= useLocalStorage('TabsFlowControlExampleKeepAlive', false)
	const contentBorder 	= useLocalStorage('TabsFlowControlExampleBorder', true)
	const flattenHideNames 	= useLocalStorage('TabsFlowControlExampleFlattenHideNames', true)
	const rangeList 		= ['scroll', 'menu', 'flatten']

</script>

<template>

	<PageTitleBox pageTitle="TabsFlowControl Example">

		<ListButton v-model:index="flowIndex" :rangeList
			class="w-fit !bg-white border border-color-dark-blue !text-color-dark-blue" />

	</PageTitleBox>

	<div class="mb-4 flex flex-wrap gap-3">
		<button type="button" class="px-3 py-1 text-xs font-bold rounded-full border border-gray-400"
			@click="keepAlive = !keepAlive">
			KeepAlive: {{ keepAlive ? 'ON' : 'OFF' }}
		</button>

		<button type="button" class="px-3 py-1 text-xs font-bold rounded-full border border-gray-400"
			@click="contentBorder = !contentBorder">
			Border: {{ contentBorder ? 'ON' : 'OFF' }}
		</button>

		<button type="button" class="px-3 py-1 text-xs font-bold rounded-full border border-gray-400"
			@click="flattenHideNames = !flattenHideNames">
			Flatten Hide Names: {{ flattenHideNames ? 'ON' : 'OFF' }}
		</button>
	</div>

	<TabsFlowControl v-model:activeTab="activeTab" 
		:tabList="['First','Second','Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Nineth', 'Tenth', 'Eleventh']" 
		:keepAlive :contentBorder :flattenHideNames :flow="rangeList[flowIndex]" 
		class="mb-7">

        <template #First>       
            <div class="p-4">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus.
			</div>
        </template>
        <template #Second>       
            <div class="p-4">
				Sit amet consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus.
			</div>
        </template>
        <template #Third>       
            <div class="p-4">
				Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
			</div>        
		</template>
		<template #Fourth>       
            <div class="p-4">
				 obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus.
			</div>
        </template>
		<template #Fifth>       
        	<div class="p-4">
				consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus. Lorem ipsum dolor, sit amet 
			</div>        
		</template>
		<template #Sixth>       
            <div class="p-4">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
			</div>       
		</template>
        <template #Seventh>       
            <div class="p-4">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus.				
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus.
			</div>
        </template>
		<template #Eighth>       
            <div class="p-4">
				Obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus.
			</div>
        </template>
		<template #Nineth>       
            <div class="p-4">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus. 
			</div>
        </template> 
		<template #Tenth>       
            <div class="p-4">
				nisi ex quidem aspernatur quod consequatur minus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 				
				nisi ex quidem aspernatur quod consequatur minus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 				
				nisi ex quidem aspernatur quod consequatur minus. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 			
			</div>        
		</template>
		<template #Eleventh>       
            <div class="p-4">
				 Alias unde quo a enim 
				voluptate quos odit magnam tenetur, obcaecati possimus est reprehenderit sequi 
				nisi ex quidem aspernatur quod consequatur minus.Lorem ipsum dolor, sit amet consectetur adipisicing elit.
			</div>
        </template> 

	</TabsFlowControl>

</template>
