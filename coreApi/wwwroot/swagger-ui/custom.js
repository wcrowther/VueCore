
// Prefixes the Swagger Authorize modal JWT Token with 'Bearer ' if needed.
(() => {
    const patchAuthorizeInputs = () => {
	   const inputs = document.querySelectorAll("input[placeholder='Bearer <token>']");
	   inputs.forEach(input => {
		  input.addEventListener("change", () => {
			 let value = input.value.trim();
			 if (value && !value.toLowerCase().startsWith("bearer ")) {
				input.value = "Bearer " + value;
			 }
		  });
	   });
    };

    // Run it when Swagger UI loads
    const observer = new MutationObserver(patchAuthorizeInputs);
    observer.observe(document.body, { childList: true, subtree: true });
})();