console.log("entering index.js");
var socket = io();
socket.on("val", function(data){
	// console.log(data);
	$('#val').text(data.msg);
	$("#val").animate({
		duration:500,
		opacity:1
		},{
			complete: function(){
			$('#val').animate({
				duration:500,
				opacity: 0
			});
		}
	});
})