
// Prefixes the Swagger Authorize modal JWT Token with 'Bearer ' if needed.
(function () {
    const interval = setInterval(() =>
    {
        if (!window.ui?.authActions?.authorize) return;

        clearInterval(interval);

        const original = window.ui.authActions.authorize;

        window.ui.authActions.authorize = function (auth)
        {
            for (const key in auth)
            {
                let value = auth[key]?.value ?? "";

                if (value && !value.toLowerCase().startsWith("bearer "))
                {
                    auth[key].value = "Bearer " + value.trim();
                }
            }

            return original.call(this, auth);
        };
    }, 200);
})();