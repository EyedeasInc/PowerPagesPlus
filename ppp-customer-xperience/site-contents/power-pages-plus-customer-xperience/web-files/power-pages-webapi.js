(function (webapi, $) {
	function safeAjax(ajaxOptions) {
		var deferredAjax = $.Deferred();

		shell.getTokenDeferred().done(function (token) {
			// add headers for ajax
			if (!ajaxOptions.headers) {
				$.extend(ajaxOptions, {
					headers: {
						"__RequestVerificationToken": token
					}
				});
			} else {
				ajaxOptions.headers["__RequestVerificationToken"] = token;
			}
			$.ajax(ajaxOptions)
				.done(function (data, textStatus, jqXHR) {
					validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
				}).fail(deferredAjax.reject); //ajax
		}).fail(function () {
			deferredAjax.rejectWith(this, arguments); // on token failure, pass the token ajax and args
		});

		return deferredAjax.promise();
	}
	webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {}, jQuery)