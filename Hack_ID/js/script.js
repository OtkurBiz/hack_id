$( document ).ready( function(){ 


$(".testRFID").click(function(){
	$("#registerRFID").val("3453gh232hsje13");
	$("#REGISTRATION").toggleClass("hidden");
	$("#SCANID").toggleClass("hidden");
});

/*
$.get( "http://162.243.227.48/SMU_Nav/api/index.php/getBuildingNames", function( data ) {
  $( ".result" ).html( data );
  alert( "Load was performed." );
}); */ 

});