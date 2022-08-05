/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"deneme/deneme/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"deneme/deneme/test/integration/pages/Worklist",
	"deneme/deneme/test/integration/pages/Object",
	"deneme/deneme/test/integration/pages/NotFound",
	"deneme/deneme/test/integration/pages/Browser",
	"deneme/deneme/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "deneme.deneme.view."
	});

	sap.ui.require([
		"deneme/deneme/test/integration/WorklistJourney",
		"deneme/deneme/test/integration/ObjectJourney",
		"deneme/deneme/test/integration/NavigationJourney",
		"deneme/deneme/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});