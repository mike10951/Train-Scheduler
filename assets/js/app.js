// 1. Initialize Firebase
// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyAUy_Dv54AKwN8hSIzuY8rzgrexiKAc1G8",
authDomain: "trainscheduler-ecdb5.firebaseapp.com",
databaseURL: "https://trainscheduler-ecdb5.firebaseio.com",
projectId: "trainscheduler-ecdb5",
storageBucket: "trainscheduler-ecdb5.appspot.com",
messagingSenderId: "992683033815",
appId: "1:992683033815:web:e0bd2e39f7f4a988971c92"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 2. Create button for adding trains
$("#train-add-btn").on("click", function(evt) {
    evt.preventDefault();

    //Grab user input
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#train-destination").val().trim();
    var firstTrainTime = $("#train-first-time").val();
    var trainFrequency = $("#train-frequency").val();
    
    //Local object for holding data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        frequency: trainFrequency,
        firstTrainOfDay: firstTrainTime
      };

    //Uploads train data to the database
    database.ref().push(newTrain);

    //Clear textboxes
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-first-time").val("");
    $("#train-frequency").val("");
});

database.ref().on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);

    var firstTrainTime = moment(childSnapshot.val().firstTrainOfDay, 'HH:mm');
    var trainFrequency = childSnapshot.val().frequency;
    console.log(firstTrainTime);

      //Calculate next train departure hour
      do {
      firstTrainTime.add(trainFrequency, 'minutes');
      } while (moment().isSameOrBefore(firstTrainTime) === false);
      var nextTrain = firstTrainTime.format("HH:mm");
  
      // Calculate minutes remaining until next train
      var difference = firstTrainTime.diff(moment(), 'minutes');
  
    

    $("#train-table tbody").append("<tr class='train'><td class='train-name'> " +
      childSnapshot.val().name +
      " </td><td class='train-destination'> " + childSnapshot.val().destination +
      " </td><td class='train-frequency'> " + childSnapshot.val().frequency +
      " </td><td class='next-train'> " + nextTrain +
      " </td><td class='minutes-remaining'> " + difference +
      " </td></tr>");

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


