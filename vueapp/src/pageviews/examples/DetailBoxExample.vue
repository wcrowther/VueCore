<script setup>

	const imageData = ref(null)

</script>

<template>

	<div class="mb-10">

		<div class="text-lg font-bold mb-5">DetailBox</div>
	
		<div class="flex flex-wrap justify-between mt-10 mb-5">


			<InfoBox>Experimental DetailBox</InfoBox>

			<DetailBox id="detailOne" title="Detail One">
				Content One
			</DetailBox>

			<DetailBox id="detail2"  title="Detail Two">
				<template #header>Customized Header Title</template>
				Content Two
			</DetailBox>

			<DetailBox title="Detail Three" hideCaret>
				Content Three
			</DetailBox>


		</div>


	</div>

</template>