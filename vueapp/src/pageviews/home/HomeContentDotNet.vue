<template>
	<div class="flex flex-wrap gap-y-5 bg-white p-10" id="HomeContentDotNet">

		<h3 class="font-bold text-lg">DotNet Minimal Api Server Backend</h3>

		<p class="w-full">
			The c# Asp.net Minimal API project is built with simple but powerful examples of
			features that can used to get you started building out your own project.
		</p>

		<h4 class="text-base font-bold tracking-wide">Features</h4>

		<ol class="ol-list">
			<li>
				<span>SQLite</span>
				We use Entity Framework accessing a SQLite database but should be
				easy to convert to another database like SQL server or MySQL.
			</li>
			<li>
				<span>JWT Tokens</span>
				Role-based user authentication using JWT tokens in .NET for securing Vue.js API
				requests, backed by an editable user table.
			</li>
			<li>
				<span>PagedList</span>
				Custom PagedList examples for an example Account entity using Linqkit PredicateBuilder making
				it easy to customize and add in multiple search conditions.
			</li>
			<li>
				<span>Attribute Validation</span>
				Our custom Minimal API model validation uses a simple validation routine to evaluate
				server model property attributes (this is not available in .NET 9).
			</li>
			<li>
				<span>Debug Middleware</span>
				We added a custom middleware debugging component to help troubleshoot incoming HttpContext requests.
				It is especially useful for diagnosing model binding and API issues. When the request is an
				HttpContext.Request.Post and includes a JSON body, the payload is captured with sensitive values masked.
			</li>
			<li>
				<span>Server Event Logging</span>
				File-based logging of events using ILogger with Serilog.
			</li>
			<li>
				<span>Endpoint Registration</span>
				Works with a custom simple convention-based registration of endpoints to declutter your Program.cs file.
			</li>
			<li>
				<span>DI Registration</span>
				Service registration moved to an external file to simplify your Program.cs.
			</li>
			<li>
				<span>API Documentation</span>
				Out of the box Swagger endpoints documentation with authorization and look-and-feel customization.
			</li>

		</ol>

	</div>

</template>

<style lang="postcss" scoped>

    .ol-list                { @apply w-full list-decimal pl-8 }
    .ol-list li             { @apply mb-3 }
    .ol-list li span        { @apply text-base font-bold mr-1 text-color-dark-blue }
    .ol-list li span:after  { content: '\00a0 \00a0- ' }

</style>