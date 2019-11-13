jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"benlem/zfirebase/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","benlem/zfirebase/model/models","./Firebase"],function(e,i,t,n){"use strict";return e.extend("benlem.zfirebase.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device");this.setModel(n.initializeFirebase(),"firebase")}})});
},
	"benlem/zfirebase/Firebase.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel"],function(e){const a={apiKey:"AIzaSyDaeDU5nCQU-PZnuw0XxbDIqxvJEHIHrEU",authDomain:"quickstart-db279.firebaseapp.com",databaseURL:"https://quickstart-db279.firebaseio.com",projectId:"quickstart-db279",storageBucket:"quickstart-db279.appspot.com",messagingSenderId:"558160337014",appId:"1:558160337014:web:8fa0ab50136028c65d2757",measurementId:"G-MFMZQLW48G"};return{initializeFirebase:function(){firebase.initializeApp(a);const i=firebase.firestore();const t={firestore:i};var s=new e(t);return s}}});
},
	"benlem/zfirebase/controller/Main.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox"],function(e,t){const o="add";const i="edit";return e.extend("benlem.zfirebase.controller.Main",{onInit:function(){const e=this.getView().getModel("firebase").getData().firestore;this.collRefEmployees=e.collection("employees");var t={employees:[]};var o=new sap.ui.model.json.JSONModel(t);this.getView().setModel(o);this.getRealTimeEmployees()},getEmployees:function(){this.collRefEmployees.get().then(e=>{var t=this.getView().getModel();var o=t.getData();var i=e.docs.map(e=>{return e.data()});o.employees=i;this.getView().byId("employeesTable").getBinding("items").refresh()},e=>{this._displayError(e.message)})},getRealTimeEmployees:function(){this.collRefEmployees.onSnapshot(e=>{var t=this.getView().getModel();var o=t.getData();e.docChanges().forEach(e=>{var t=e.doc.data();t.id=e.doc.id;switch(e.type){case"added":o.employees.push(t);break;case"modified":let i=o.employees.map(e=>{return e.id}).indexOf(t.id);o.employees[i]=t;break;case"removed":let a=o.employees.map(e=>{return e.id}).indexOf(t.id);o.employees.splice(a,1);break;default:break}});this.getView().getModel().refresh(true);this.getView().byId("employeesTable").getBinding("items").refresh()},e=>{this._displayError(e.message)})},onDelete:function(e){var t=this.getView().getModel();var o=e.getSource().getParent().getParent().getBindingContextPath();var i=t.getObject(o).id;this.collRefEmployees.doc(i).delete().then(e=>{t.refresh()},e=>{this._displayError(e.message)})},onPressItem:function(e){var t=e.getParameter("listItem").getBindingContextPath();this._getEmployeeDetail(t);if(!this._oDetailsPopover){this._oDetailsPopover=sap.ui.xmlfragment("employeeDetailsFragment","benlem.zfirebase.view.fragment.empDetails",this);this.getView().addDependent(this._oDetailsPopover);sap.ui.core.Fragment.byId("employeeDetailsFragment","detailsPopover").bindElement({path:"/",model:"detailsModel"})}this._oDetailsPopover.openBy(e.getParameter("listItem"))},onOpenDialog:function(e){var t=e.getSource().getId();if(t.includes("addButton")){this._cleanFormModel()}else if(t.includes("editButton")){var o=e.getSource().getParent().getBindingContext().getPath();this._bindEmployeeFormModel(o)}if(!this._oFormDialog){this._oFormDialog=sap.ui.xmlfragment("formFragment","benlem.zfirebase.view.fragment.dialog",this);this.getView().addDependent(this._oFormDialog);sap.ui.core.Fragment.byId("formFragment","addSimpleForm").bindElement({path:"/",model:"formModel"})}this._oFormDialog.open()},onCancel:function(){this._oFormDialog.close()},onSubmit:function(){var e=this.getOwnerComponent().getModel("formModel").getData();e.gender=sap.ui.core.Fragment.byId("formFragment","maleGenderRadio").getSelected()?"M":"F";switch(e.mode){case o:this._addEmployee(e);break;case i:this._updateEmployee(e);break;default:break}},_addEmployee:function(e){this.collRefEmployees.add({first_name:e.first_name,last_name:e.last_name,email:e.email,gender:e.gender}).then(e=>{this._oFormDialog.close()},e=>{this._displayError(e.message)})},_updateEmployee:function(e){this.collRefEmployees.doc(e.id).update({first_name:e.first_name,last_name:e.last_name,email:e.email,gender:e.gender}).then(e=>{this._oFormDialog.close()},e=>{this._displayError(e.message)})},_cleanFormModel:function(){var e=this.getOwnerComponent().getModel("formModel");var t={first_name:"",last_name:"",email:"",gender:"M",mode:o};e.setData(t)},_getEmployeeDetail:function(e){var t=this.getView().getModel().getObject(e);var o=this.getOwnerComponent().getModel("detailsModel");o.setData({});this.collRefEmployees.doc(t.id).get().then(e=>{if(e.exists)o.setData(e.data());else this._displayError("Employee does not exist")},e=>{this._displayError(e.message)})},_bindEmployeeFormModel:function(e){var t=this.getView().getModel().getObject(e);t.mode=i;this.getOwnerComponent().getModel("formModel").setData(t)},_displayError:function(e){return t.show(e,{title:"Error",icon:t.Icon.ERROR})}})});
},
	"benlem/zfirebase/i18n/i18n.properties":'title=UI5 CRUD with Firebase\nappTitle=UI5 & Firebase\nappDescription=UI5 app using Firebase backend\n\nEmployees=Employees\nEmployeeLastname=Lastname\nEmployeeFirstname=Firstname\nEmployeeEmail=Email\nEmployeeGender=Gender\nActions=Actions\n\n# Dialog\nTitleDialog=Employee\nLastnameDialog=Lastname\nFirstnameDialog=Firstname\nEmailDialog=Email\nGenderDialog=Gender\nMaleDialog=Male\nFemaleDialog=Female\nSubmitButtonDialog=Submit\nCancelButtonDialog=Cancel',
	"benlem/zfirebase/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"benlem.zfirebase","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"ui5template.basicSAPUI5ApplicationProject","version":"1.40.12"}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"benlem.zfirebase.view.Main","type":"XML","async":true,"id":"Main"},"dependencies":{"minUI5Version":"1.65.6","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"benlem.zfirebase.i18n.i18n"}},"formModel":{"type":"sap.ui.model.json.JSONModel","settings":{"defaultBindingMode":"TwoWay"}},"detailsModel":{"type":"sap.ui.model.json.JSONModel"}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"benlem.zfirebase.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteMain","pattern":"RouteMain","target":["TargetMain"]}],"targets":{"TargetMain":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Main","viewName":"Main"}}}}}',
	"benlem/zfirebase/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"benlem/zfirebase/view/Main.view.xml":'<mvc:View controllerName="benlem.zfirebase.controller.Main" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m"><Shell id="shell"><App id="app"><pages><Page id="page" title="{i18n>title}"><content><Table id="employeesTable" items="{path: \'/employees\', sorter: { path: \'last_name\' }}" itemPress="onPressItem"><headerToolbar><Toolbar><content><Title text="{i18n>Employees}" level="H2"/><ToolbarSpacer/><Button id="addButton" icon="sap-icon://add" press="onOpenDialog"/></content></Toolbar></headerToolbar><columns><Column><Text text="{i18n>EmployeeLastname}"/></Column><Column><Text text="{i18n>EmployeeFirstname}"/></Column><Column><Text text="{i18n>EmployeeEmail}"/></Column><Column hAlign="Center"><Text text="{i18n>EmployeeGender}"/></Column><Column><Text text="{i18n>Actions}"/></Column></columns><items><ColumnListItem type="Active"><cells><Text text="{last_name}"/><Text text="{first_name}"/><Text text="{email}"/><Text text="{gender}"/><HBox><items><Button id="editButton" icon="sap-icon://edit" press="onOpenDialog" type="Transparent"/><Button icon="sap-icon://delete" press="onDelete" type="Transparent"/></items></HBox></cells></ColumnListItem></items></Table></content></Page></pages></App></Shell></mvc:View>',
	"benlem/zfirebase/view/fragment/dialog.fragment.xml":'<core:FragmentDefinition id="employeeFormFragment" xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form"><Dialog id="employeeDialog" title="{i18n>TitleDialog}"><content><f:SimpleForm id="addSimpleForm" editable="true" layout="ResponsiveGridLayout" labelSpanXL="3" labelSpanL="3" labelSpanM="3" labelSpanS="12"\n\t\t\t\tadjustLabelSpan="false" emptySpanXL="4" emptySpanL="4" emptySpanM="4" emptySpanS="0" columnsXL="1" columnsL="1" columnsM="1"\n\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="{i18n>LastnameDialog}"/><Input value="{formModel>last_name}"/><Label text="{i18n>FirstnameDialog}"/><Input value="{formModel>first_name}"/><Label text="{i18n>EmailDialog}"/><Input value="{formModel>email}"/><Label text="{i18n>GenderDialog}"/><HBox><items><RadioButton id="maleGenderRadio" groupName="Gender" text="{i18n>MaleDialog}" selected="{= ${formModel>gender} === \'M\'}"/><RadioButton id="femaleGenderRadio" groupName="Gender" text="{i18n>FemaleDialog}" selected="{= ${formModel>gender} === \'F\'}"/></items></HBox></f:content></f:SimpleForm></content><beginButton><Button text="{i18n>SubmitButtonDialog}" press="onSubmit"/></beginButton><endButton><Button text="{i18n>CancelButtonDialog}" press="onCancel"/></endButton></Dialog></core:FragmentDefinition>',
	"benlem/zfirebase/view/fragment/empDetails.fragment.xml":'<core:FragmentDefinition id="employeeDetailsFragment" xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.ui.layout.form"><Popover id="detailsPopover" title="{detailsModel>last_name} {detailsModel>first_name}" class="sapUiContentPadding" placement="HorizontalPreferredLeft"><Image src="{detailsModel>pictureUrl}" width="15em" densityAware="false"/></Popover></core:FragmentDefinition>'
}});
