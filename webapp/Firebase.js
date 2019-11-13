/* global firebase:true */
sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
	
	// Firebase-config retrieved from the Firebase-console
	const firebaseConfig = {
		apiKey: "AIzaSyDaeDU5nCQU-PZnuw0XxbDIqxvJEHIHrEU",
	    authDomain: "quickstart-db279.firebaseapp.com",
	    databaseURL: "https://quickstart-db279.firebaseio.com",
	    projectId: "quickstart-db279",
	    storageBucket: "quickstart-db279.appspot.com",
	    messagingSenderId: "558160337014",
	    appId: "1:558160337014:web:8fa0ab50136028c65d2757",
	    measurementId: "G-MFMZQLW48G"
	};

	return {
		initializeFirebase: function () {
			// Initialize Firebase with the Firebase-config
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