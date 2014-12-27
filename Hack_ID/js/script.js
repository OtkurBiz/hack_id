
$( document ).ready( function(){ 






/* 
purpose: given the one page nature of chrome apps
	this is a help function designed to display a 
	particular section. It takes the ID of the section to 
	be displayed. 
input: sectionID to be displayed
effect: hides all sections except section to be displayed
*/ 
var displaySection = function(sectionID) {
	var sections = ["SCANID", "REGISTRATION", "USERINFO", "SETUP"];
	$.each(sections, function(index, value){
		$("#" + value).addClass("hidden");

	})
	$("#" + sectionID).removeClass("hidden");

};

var populateRegistration = function(attendeeInfo) {
	$("#registerEmail").val(attendeeInfo.email);
	$("#registerName").val(attendeeInfo.name);
	$("#registerPhone").val(attendeeInfo.phone);
	$("#registerAge").val(attendeeInfo.age);
	$("#registerNotes").val(attendeeInfo.notes);

}


/*
purpose: allows a user to go back to the setup page if something
	happens are they connect to the wrong RFID
*/
$(".settingsButton").click(function(){
	displaySection("SETUP"); 
})
$(".scanButton").click(function(){
	displaySection("SCANID"); 
	$("#inputRFID").val("");
	$("#inputRFID").focus();
})

/*
purpose: puts a click listener on the settings page to update 
	settings
*/
$("#updateSettings").click(function(){
	// #TODO save setting parameters 
	// #TODO login user
	var port = $("#rfidPort").val(); 
	connectToPort(port);
	displaySection("SCANID"); 
	
})

/*
purpose: searches the database for a particular user based on email
	this is a event fired function and will pull the email from the
	input field
*/
$(".userSearch").click(function(){
	
	var searchEmail = $("#SearchEmail").val();
	$.get("http://162.243.227.48/hack_id/api/index.php/getAttendeeInfo/" + searchEmail,
		function( data ) {
			var attendeeInfo = $.parseJSON(data); 

			if(attendeeInfo.status === "found"){
				swal({   title: "User Found!",   text: "verify their information",   type: "success",   confirmButtonText: "Yes My Liege" });	
			
				populateRegistration(attendeeInfo);
			} else {
				swal({   title: "User Not Found!",   text: "Go ahead and register them",   type: "error",   confirmButtonText: "Cool" });	
			}
		});

});


/*
TODO: this is the event that will eventually be 
	tied into reading from the serial port. This 
	is here for testing purposes for now
*/
var getRFID = function(){
	var id = $("#inputRFID").val();
	$.get( "http://162.243.227.48/hack_id/api/index.php/getRFIDState/" + id, 
		function( data ) {
		var val = $.parseJSON(data); 
		// $( ".info" ).html( data );
		if(val.status === "not registered") {
  			displaySection("REGISTRATION"); 
  			swal({   title: "Band Not Registered!",   type: "info",   confirmButtonText: "I know" });
  		} else if(val.status === "registered") {
  			displaySection("BUTTONS"); 
  			displaySection("USERINFO"); 
		}	
	});
};

$("#inputRFID").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        getRFID();
    }
});

$("#inputRFID").focus();

/**************
 RFID SCRIPTS 

 these scripts make use of the chrome serial library
 to load and handle the RFID reader 
 **************/ 


// GET SERIAL DEVICES AND APPEND 
// var onGetDevices = function(ports) {
//   	for (var i=0; i<ports.length; i++) {
//   		var old = $(".info").html();
//     	$("#rfidPort").append(" <option>"  + ports[i].path + " </option>") ;
//   	}
// }
// chrome.serial.getDevices(onGetDevices);


// var onConnect = function(connectionInfo) {
//    // The serial port has been opened. Save its id to use later.
//   _this.connectionId = connectionInfo.connectionId;
// }

// var stringReceived = '';

// var onReceiveCallback = function(info) {
//     if (info.connectionId == expectedConnectionId && info.data) {
//       var str = convertArrayBufferToString(info.data);
//       if (str.charAt(str.length-1) === '\n') {
//         stringReceived += str.substring(0, str.length-1);
//         onLineReceived(stringReceived);
//         stringReceived = '';
//       } else {
//         stringReceived += str;
//       }
//     }
//     console.log("received:" + stringReceived);
//   };

// var connectToPort  = function(port){
// 		chrome.serial.connect(port, {bitrate: 115200}, onConnect);
// 		chrome.serial.onReceive.addListener(onReceiveCallback);
// }

// function onDeviceFound(devices) {
//   this.devices=devices;
//   if (devices) {
//     if (devices.length > 0) {
//       console.log("Device(s) found: "+devices.length);
//     } else {
//       console.log("Device could not be found");
//     }
//   } else {
//     console.log("Permission denied.");
//   }
// }
// chrome.usb.getDevices({"vendorId": 53, "productId": 65535}, onDeviceFound);

/**** 
END RFID SCRIPTS 
*****/

});