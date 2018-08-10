var sign, id, select_score;
     
$(document).ready(function(){

    // window.sessionStorage.setItem("checked", "false");


	  // var is_aggressive = $('#cmn-toggle-4').is(':checked') ? 'y': 'n';
	  if(!window.sessionStorage.getItem("checked")) {
		window.sessionStorage.setItem("checked", true);
	  }

	  $("#cmn-toggle-4").attr("checked", window.sessionStorage.getItem("checked") == 'true');


    $('#cmn-toggle-4').change(function(){
        window.sessionStorage.setItem("checked", this.checked);
    });
    
    var score1 = window.sessionStorage.getItem("TeamA_score") ? window.sessionStorage.getItem("TeamA_score") : 0;
    var score2 = window.sessionStorage.getItem("TeamB_score") ? window.sessionStorage.getItem("TeamB_score") : 0;

    $("input[name=TeamA_score]").val(score1);
	$("input[name=TeamB_score]").val(score2);

	$(".input-group .btn-number").click(function() {
		sign = $(this).data('type');
		id = $(this).data('field');
		valuesSheet();
	});
});

var callback = function(buttonIndex) {
    setTimeout(function() {
	  	if (buttonIndex <= 2) {
	 		select_score = buttonIndex == 1 ? 1 : 0.5;	 	
	 		updateScore(sign, id, select_score)
	 	}
    });
};

function valuesSheet() {
	var options = {
		title: 'Select value',
		buttonLabels: ['1', '0.5'],
		addCancelButtonWithLabel: 'Cancel',
		androidEnableCancelButton : true,
		winphoneEnableCancelButton : true,
	};
	window.plugins.actionsheet.show(options, callback);
}

function updateScore(sign, id, select_score) {
	var initial;
	
	if(!window.sessionStorage.getItem("initial")) {
		initial = true;
		window.sessionStorage.setItem("initial", "false");
	} else {
		initial = false;
	}

	var data = {
		"user_id": device.uuid,
		"play_team": id,
		"sign" : sign,
		"select_score": select_score,
		"initial": initial
	};
	
	$.ajax({
		url: 'http://45.79.7.27:81/corkcup/team/updateTeamScore.php',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		dataType: 'JSON',
		success: function(result) {
			console.log(result, data);
			if(result.success == 1){
				$("input[name=TeamA_score]").val(result['TeamA_score']);
				$("input[name=TeamB_score]").val(result['TeamB_score']);
				window.sessionStorage.setItem('TeamA_score', result['TeamA_score']);
				window.sessionStorage.setItem('TeamB_score', result['TeamB_score']);
			}
		}, 
		error: function(error) {
			console.log(error);
		}
	});
}

function draw(id) {
	window.sessionStorage.setItem('playid', id);
}