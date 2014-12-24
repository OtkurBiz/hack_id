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
	var sections = ["SCANID", "REGISTRATION", "USERINFO"];
	$.each(sections, function(index, value){
		$("#" + value).addClass("hidden");

	})
	$("#" + sectionID).removeClass("hidden");

};

var populateRegistration = function(attendeeInfo) {
	$("#registerEmail").val(attendeeInfo.email);
	$("#registerName").val(attendeeInfo.name);
	$("#registerPhone").val(attendeeInfo.contactNum);
	$("#registerAge").val(attendeeInfo.age);
	$("#registerNotes").val(attendeeInfo.notes);

}

/*
TODO: this is the event that will eventually be 
	tied into reading from the serial port. This 
	is here for testing purposes for now
*/
$(".userSearch").click(function(){
	
	var searchEmail = $("SearchEmail").val();
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

$(".testRFID").click(function(){
	var id = "123qdjd123";
	$("#registerRFID").val(id);
	$.get( "http://162.243.227.48/hack_id/api/index.php/getRFIDState/" + id, 
		function( data ) {
		var val = $.parseJSON(data); 
		// $( ".info" ).html( data );
		if(val.status === "not registered") {
  			displaySection("REGISTRATION"); 
  			swal({   title: "Band Not Registered!",   type: "info",   confirmButtonText: "I know" });
  		} else if(val.status === "registered") {
  			displaySection("USERINFO"); 
		}	
	});
});


});