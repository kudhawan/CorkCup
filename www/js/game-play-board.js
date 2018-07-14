var sign, id, select_score;
     
$(document).ready(function(){

    // window.sessionStorage.setItem("checked", "false");


	  // var is_aggressive = $('#cmn-toggle-4').is(':checked') ? 'y': 'n';
	  $("#cmn-toggle-4").attr("checked", window.sessionStorage.getItem("checked") == 'true');


    $('#cmn-toggle-4').change(function(){
        window.sessionStorage.setItem("checked", this.checked);
    });
    
    var score1 = window.sessionStorage.getItem("1") ? window.sessionStorage.getItem("1") : 0;
    var score2 = window.sessionStorage.getItem("2") ? window.sessionStorage.getItem("2") : 0;

    $("input[name=1]").val(score1);
	$("input[name=2]").val(score2);

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


	$.ajax({
		url: 'http://45.79.7.27:81/corkcup/team/updateScore.php?id=' +id+ "&sign=" + sign + "&initial=" + initial + "&select_score=" + select_score,
		success: function(result) {
			if(result){
				$("input[name=" + "'" + result.id + "']").val(result.scores);
				window.sessionStorage.setItem(result.id, result.scores);
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