/* global firebase:true */
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"./FirebaseConfig"
], function (JSONModel, FirebaseConfig) {

	return {
		initializeFirebase: function () {
			// Initialize Firebase with the Firebase-config
			const firebaseConfig = FirebaseConfig.getFirebaseConfig();
			firebase.initializeApp(firebaseConfig);
			
			// Create a Firestore reference
			const firestore = firebase.firestore();
			
			// Firebase services object
			const oFirebase = {
				firestore: firestore
			};
			
			// Create a Firebase model out of the oFirebase service object which contains all required Firebase services
			var fbModel = new JSONModel(oFirebase);
			
			// Return the Firebase Model
			return fbModel;
		}
	};
});