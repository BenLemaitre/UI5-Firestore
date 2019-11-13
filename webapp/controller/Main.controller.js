sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	const ADD_EMP = "add";
	const EDIT_EMP = "edit";
	
	return Controller.extend("benlem.zfirebase.controller.Main", {
		
		/**
		 * Initiatilisation of the app
		 */
		onInit: function () {
			// Create a Firestore reference
			const firestore = this.getView().getModel("firebase").getData().firestore;
			// Create a collection reference to the employees collection
			this.collRefEmployees = firestore.collection("employees");

			// Initialize an array for the employees of the collection as an object
			var oEmployees = {
				employees: []
			};

			// Create and set the created object to the the oEmployees
			var employeeModel = new sap.ui.model.json.JSONModel(oEmployees);
			this.getView().setModel(employeeModel);

			// Get single set of employees once
			// this.getEmployees(collRefEmployees);

			// Get realtime employees
			this.getRealTimeEmployees();
		},
		
		/**
		 * Get single set of employees once at a time
		 */
		getEmployees: function () {
			this.collRefEmployees.get().then(collection => {
				var employeeModel = this.getView().getModel();
				var employeeData = employeeModel.getData();
				var employees = collection.docs.map(docEmployee => {
					return docEmployee.data();
				});
				employeeData.employees = employees;
				this.getView().byId("employeesTable").getBinding("items").refresh();
			}, error => {
				this._displayError(error.message);
			});
		},
		
		/**
		 * Get set of employees in real time
		 */
		getRealTimeEmployees: function () {
			// The onSnapshot the keep the data up to date in case of added, 
			// modified or removed data in the Firestor database
			this.collRefEmployees.onSnapshot(snapshot => {
				// Get the employee model
				var employeeModel = this.getView().getModel();
				// Get all the employees
				var employeeData = employeeModel.getData();

				// Get the current added/modified/removed document (employee) 
				// of the collection (employees)
				snapshot.docChanges().forEach(change => {
					// set id (to know which document is modifed and
					// replace it on change.Type == modified) 
					// and data of firebase document
					var oEmployee = change.doc.data();
					oEmployee.id = change.doc.id;

					switch (change.type) {
						case "added":
							// Added document (employee) add to array
							employeeData.employees.push(oEmployee);
							break;
						case "modified":
							// Modified document (find its index and change current doc 
							// with the updated version)
							let i = employeeData.employees.map(employee => {
								return employee.id;
							}).indexOf(oEmployee.id);
							employeeData.employees[i] = oEmployee;
							break;
						case "removed":
							 // Removed document (find index and remove it from the employees array)
							let index = employeeData.employees.map(employee => {
								return employee.id;
							}).indexOf(oEmployee.id);
							employeeData.employees.splice(index, 1);
							break;
						default:
							break;
					}
				});

				//Refresh your model and the binding of the items in the table
				this.getView().getModel().refresh(true);
				this.getView().byId("employeesTable").getBinding("items").refresh();
			}, error => {
				this._displayError(error.message);
			});
		},
		
		/**
		 * Delete a user from cloud firestore
		 * @param	{sap.ui.base.Event} oEvent : Event
		 */
		onDelete: function (oEvent) {
			var oModel = this.getView().getModel();
			var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
			var sId = oModel.getObject(sPath).id;
		
			this.collRefEmployees.doc(sId)
				.delete()
				.then(res => {
					oModel.refresh();
				}, error => {
					this._displayError(error.message);
				});
		},
		
		/**
		 * Opens popover on click
		 * @param	{sap.ui.base.Event} oEvent Event
		 */
		onPressItem: function (oEvent) {
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			
			this._getEmployeeDetail(sPath);
			
			if (!this._oDetailsPopover) {
				this._oDetailsPopover = sap.ui.xmlfragment("employeeDetailsFragment", "benlem.zfirebase.view.fragment.empDetails", this);
				this.getView().addDependent(this._oDetailsPopover);
				
				sap.ui.core.Fragment.byId("employeeDetailsFragment", "detailsPopover").bindElement({
					path: "/",
					model: "detailsModel"
				});
			}
			
			this._oDetailsPopover.openBy(oEvent.getParameter("listItem"));
		},
		
		/**
		 * Opens dialog on click
		 * @param	{sap.ui.base.Event} oEvent Event
		 */
		onOpenDialog: function (oEvent) {
			var sAction = oEvent.getSource().getId();
			
			// Get actions from button clicked
			if (sAction.includes("addButton")) {
				this._cleanFormModel();
			} else if (sAction.includes("editButton")) {
				var sPath = oEvent.getSource().getParent().getBindingContext().getPath();
				this._bindEmployeeFormModel(sPath);
			}
			
			if (!this._oFormDialog) {
				this._oFormDialog = sap.ui.xmlfragment("formFragment", "benlem.zfirebase.view.fragment.dialog", this);
				this.getView().addDependent(this._oFormDialog);
				
				sap.ui.core.Fragment.byId("formFragment", "addSimpleForm").bindElement({
					path: "/",
					model: "formModel"
				});
			}

			this._oFormDialog.open();
		},
		
		/**
		 * Close dialog
		 */
		onCancel: function () {
			this._oFormDialog.close();
		},
		
		/**
		 * Called when the "submit" button is pressed
		 * Determine wheter the action is an edit or an add
		 */
		onSubmit: function () {
			var oData = this.getOwnerComponent().getModel("formModel").getData();
			oData.gender = sap.ui.core.Fragment.byId("formFragment", "maleGenderRadio").getSelected() ? "M" : "F";
			
			switch (oData.mode) {
				case ADD_EMP:
					this._addEmployee(oData);
					break;
				case EDIT_EMP:
					this._updateEmployee(oData);
					break;
				default:
					break;
			}
		},
		
		/**
		 * Create an employee in the firestore database
		 * @param	{obj}	oData Employee to create
		 */
		_addEmployee: function (oData) {
			this.collRefEmployees.add({
			    first_name: oData.first_name,
			    last_name: oData.last_name,
			    email: oData.email,
			    gender: oData.gender
			  }).then( res => {
				this._oFormDialog.close();
			  }, error => {
				this._displayError(error.message);
			  });
		},
		
		/**
		 * Update an employee with the given id
		 * @param {obj}	oData employee to update
		 */
		_updateEmployee: function (oData) {
	        this.collRefEmployees.doc(oData.id).update({
				first_name: oData.first_name,
				last_name: oData.last_name,
				email: oData.email,
				gender: oData.gender
	        }).then( res => {
				this._oFormDialog.close();
	        }, error => {
				this._displayError(error.message);
	        });
		},
		
		/**
		 * Used to clear the model for a create action
		 */
		_cleanFormModel: function () {
			var oModel = this.getOwnerComponent().getModel("formModel");
			var oData = {
				first_name: "",
				last_name: "",
				email: "",
				gender: "M",
				mode: ADD_EMP
			};
			
			oModel.setData(oData);
		},
		
		/**
		 * Query firestore db for an employee with the given ID
		 * @param	{string}	sPath Path in the model to the employee selected 
		 */
		_getEmployeeDetail: function (sPath) {
			var oEmployee = this.getView().getModel().getObject(sPath);
			var oModel = this.getOwnerComponent().getModel("detailsModel");
			
			// Clear data before query
			oModel.setData({});
			
			this.collRefEmployees.doc(oEmployee.id)
				.get()
				.then(doc => {
					if (doc.exists)
						oModel.setData(doc.data());
					else
						this._displayError("Employee does not exist");
		        }, error => {
					this._displayError(error.message);
	        });
		},
		
		/**
		 * Binds the selected user to the form model
		 * @param	{string}	sPath Path in the model to the employee selected 
		 */
		_bindEmployeeFormModel: function (sPath) {
			var oEmpToEdit = this.getView().getModel().getObject(sPath);
			oEmpToEdit.mode = EDIT_EMP;
			this.getOwnerComponent().getModel("formModel").setData(oEmpToEdit);
		},
		
		/**
		 * Displays error message in message box 
		 * @param	{string} sError Message to be displayed
		 * @returns {sap.m.MessageBox}	MessageBox to display
		 */
		_displayError: function (sError) {
			return MessageBox.show(sError, {
				title: "Error",
				icon: MessageBox.Icon.ERROR
			});
		}
	});
});