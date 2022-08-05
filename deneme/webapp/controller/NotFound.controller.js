sap.ui.define([
		"deneme/deneme/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("deneme.deneme.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);