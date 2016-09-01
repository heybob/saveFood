 // Initialize Firebase
  //Move to app js file.
  var config = {
    apiKey: "AIzaSyDkT1Ozv1WFOVPG18AJylS7rsIxj46fjZc",
    authDomain: "save-food-cba1b.firebaseapp.com",
    databaseURL: "https://save-food-cba1b.firebaseio.com",
    storageBucket: "save-food-cba1b.appspot.com",
  };
  firebase.initializeApp(config);

// AngularJS App
var saveFood = angular.module('saveFood', ["firebase"]);