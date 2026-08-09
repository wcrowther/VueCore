<script setup>

    const fullScreen = ref(false)

</script>

<template>

    <div ref="parentBox" class="w-full">

    	<PageTitleBox pageTitle="Conway's Life" />

		<InfoBox>
			A fully playable Conway's Life game built on <b>GridControl</b>'s scoped slot. Click cells to toggle their state —
			live cells are highlighted. The game evolves according to Conway's rules.
		</InfoBox>

		<ConwaysLifeGame :fullScreen  />

    </div>

</template>

