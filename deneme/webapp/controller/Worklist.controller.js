/*global location history */
sap.ui.define([
	"deneme/deneme/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"deneme/deneme/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, MessageToast) {
	"use strict";

	return BaseController.extend("deneme.deneme.controller.Worklist", {

		onInit: function() {
			var oViewModel = new JSONModel({
				page: {
					busy: false,
					editable: true
				},
				data: {
					items: [{}],
					attachments: []
				}
			});
			// this.setModel(oViewModel, "createView");
			this.getView().setModel(oViewModel, "createView");
			// var sServiceUrl = "/sap/opu/odata/sap/ZHE_GOS_SRV";
			this._oModelVariant = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHE_GOS_SRV/", true);
		},
		onAfterRendering: function(oEvent) {
			this._onGetData();
		},
		startUpload: function() {
			var oUploadSet = this.byId("UploadSet");
			var cFiles = oUploadSet.getIncompleteItems().length;
			if (cFiles > 0) {
				oUploadSet.upload();
			}
		},
		onBeforeUploadStarts: function(oEvent) {
			oEvent.getSource().removeAllHeaderFields();
			var sFileName = oEvent.getParameter("item").getProperty("fileName");
			var oCustomerHeaderSlug = new sap.ui.core.Item({
				key: "slug",
				text: encodeURI(sFileName)
			});
			oEvent.getSource().addHeaderField(oCustomerHeaderSlug);
			var oModel = this.getView().getModel();
			var sToken = oModel.getSecurityToken();
			var oCustomerHeaderToken = new sap.ui.core.Item({
				key: "x-csrf-token",
				text: sToken
			});
			oEvent.getSource().addHeaderField(oCustomerHeaderToken);
		},
		onUploadCompleted: function(oEvent) {
			// this.getModel("worklistView").refresh(true);
			// this.getView().getElementBinding().refresh(true);

			var status = oEvent.getParameters("item").item.getProperty("uploadState");

			if (status === "Complete") {
				this._onGetData();
				MessageToast.show("File upload successful");
			}
		},
		onOrderPress: function(oEvent) {
			var oViewModel = this.getView().getModel("createView");
			oViewModel.setProperty("/page/busy", true);
		},
		onRead: function(oEvent) {
			var documentId = oEvent.getSource().getBindingContext("documentModel").getProperty().FileId;
			var that = this;
			var vButton = "Read";
			// var sUrl = "/AttachmentSet(DocumentId='" + documentId + "')/$value";
			var sUrl = "/AttachmentSet(DocumentId='" + documentId + "',Button='" + vButton + "')/$value";
			window.open(that.getModel().sServiceUrl + sUrl, "_blank");
		},
		onDownload: function(oEvent) {
			var documentId = oEvent.getSource().getBindingContext("documentModel").getProperty().FileId;
			var that = this;
			var vButton = "Download";
			var sUrl = "/AttachmentSet(DocumentId='" + documentId + "',Button='" + vButton + "')/$value";
			window.open(that.getModel().sServiceUrl + sUrl, "_blank");

		},
		onDelete: function(oEvent) {
			// var documentId = "FOL42000000000004EXT47000000000159";
			// var vPath = oEvent.getSource().getParent().getBindingContext().getPath();
			// var vPath = oEvent.getSource().getParent().getBindingContextPath();
			// var vPath =	oEvent.getSource().getParent().getBindingContextPath()[1];
			// var vPath = oEvent.getSource().getBindingContext("documentModel").getPath().split("/")[1];

			this.vFileId = oEvent.getSource().getBindingContext("documentModel").getProperty("FileId");
			this._getDialog().open();
			// var that = this;
			// sap.ui.core.BusyIndicator.show();
		/*	this._oModelVariant.remove("/FileSet(FileId='" + vFileId + "')", {
				success: function(oData, oResponse) {
					that._onGetData();
					MessageToast.show("File deletion successful");
				},
				error: function(oResponse) {
				}
			});*/
			// sap.ui.core.BusyIndicator.hide();

		},
		_getDialog: function() {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("deneme.deneme.fragment.approval", this);

				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;

		},
		onCloseDialog: function() {
			this._getDialog().close();
		},
		onSave: function(oEvent) {
			var that = this;
			// sap.ui.core.BusyIndicator.show();
			// var vFileId = oEvent.getSource().getBindingContext("documentModel").getProperty("FileId");
			// var oModel = this.getView().getModel("documentModel").getData();
			// this.getView().setModel(new JSONModel(oModel), "documentModel");
			// var vFileId = oEvent.getSource().getBindingContext("documentModel").getProperty("FileId");
			
			this._oModelVariant.remove("/FileSet(FileId='" + this.vFileId + "')", {
				success: function(oData, oResponse) {
					that._onGetData();
					MessageToast.show("File deletion successful");
					that._getDialog().close();
				},
				error: function(oResponse) {}
			});
		},
		_onGetData: function() {
			var that = this;
			this._oModelVariant.read("/FileSet", {
				sorters: null,
				async: true,
				success: function(oData, oResponse) {
					var oDocument = [];
					for (var i = 0; oData.results.length > i; i++) {
						var oDocumentModel = {
							Name: oData.results[i].Name,
							fileext: oData.results[i].fileext,
							FileDate: oData.results[i].FileDate,
							FileCreator: oData.results[i].FileCreator,
							FileId: oData.results[i].FileId
						};
						oDocument.push(oDocumentModel);
						// that.getView().setModel(new JSONModel(oDocument), "documentModel");
					}
						that.getView().setModel(new JSONModel(oDocument), "documentModel");
				},
				error: function(oResponse) {
				}
			});
		}
	});
});