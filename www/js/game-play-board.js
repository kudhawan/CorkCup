$(document).ready(function(){

    // window.sessionStorage.setItem("checked", "false");


      // var is_aggressive = $('#cmn-toggle-4').is(':checked') ? 'y': 'n';
      $("#cmn-toggle-4").attr("checked", window.sessionStorage.getItem("checked") == 'true');


    $('#cmn-toggle-4').change(function(){
        window.sessionStorage.setItem("checked", this.checked);
    });
    
    var score1 = window.sessionStorage.getItem("1") ? window.sessionStorage.getItem("1") : 0;
    var score2 = window.sessionStorage.getItem("2") ? window.sessionStorage.getItem("2") : 0;

    $("input[name=" + "'quant[1]']").val(score1);
	$("input[name=" + "'quant[2]']").val(score2);

	$(".input-group select").hide();
	
	$(".input-group .input-number").click(function() {
		$(".input-group select[name='" + $(this).attr('name')+"']").toggle();
		$("input[name='" + $(this).attr('name') + "']").toggle();
	});
});

function updateScore(sign, id) {
	var initial;
	var val = $(".input-group select[name='quant["+id+"]']").val();

	if(!window.sessionStorage.getItem("initial")) {
		initial = true;
		window.sessionStorage.setItem("initial", "false");
	} else {
		initial = false;
	}


	$.ajax({
		url: 'http://45.79.7.27:81/corkcup/team/updateScore.php?id=' +id+ "&sign=" + sign + "&initial=" + initial + "&select_score=" + val,
		success: function(result) {
			if(result){
				$("input[name=" + "'quant[" + result.id + "]']").val(result.scores);
				$("input[name=" + "'quant[" + result.id + "]']").trigger('click');
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