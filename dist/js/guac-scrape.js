$(document).ready(function(){
	
	$("#manual_form").hide();
	$("#schedule_form").hide();
	$("#scrape_body").hide();
	$("#upload_body").hide();
	$("#classify_body").hide();
	$("#activity_body").hide();
	$("#sdg_body").hide();

	$(".btn-danger").attr("disabled","disabled");

	$("input[name$='query_radio']").click(function() {
		if ($(this).val()=="build") {
			$("#build_form").slideDown();
			$("#manual_form").slideUp();
		} 
		if ($(this).val()=="manual") {
			$("#build_form").slideUp();
			$("#manual_form").slideDown();
		} 
	});

	$("input[name$='scrape_radio'").click(function() {
		if ($(this).val()=="now") {
			$("#now_form").slideDown();
			$("#schedule_form").slideUp();
		}
		if ($(this).val()=="schedule") {
			$("#now_form").slideUp();
			$("#schedule_form").slideDown();
		}
	});

	$("input[name$='src_radio'").click(function() {
		if ($(this).val()=="scrape") {
			$("#scrape_body").slideDown();
			$("#upload_body").slideUp();
		}
		if ($(this).val()=="upload") {
			$("#scrape_body").slideUp();
			$("#upload_body").slideDown();
		}
	});

	$("input[id$='classify_check'").click(function() {
		if ($(this).is(":checked")) {
			$('#classify_body').slideDown();
		} else {
			$('#classify_body').slideUp();	
		}
	});

	$("input[id$='activity_check'").click(function() {
		if ($(this).is(":checked")) {
			$('#activity_body').slideDown();
		} else {
			$('#activity_body').slideUp();	
		}
	});

	$("input[id$='sdg_check'").click(function() {
		if ($(this).is(":checked")) {
			$('#sdg_body').slideDown();
		} else {
			$('#sdg_body').slideUp();	
		}
	});

	var ct = 1;
	$('#add_class').on('click', function() {
	    ct++;
	    var div = $(this).prev().clone(true, true);
	    $(this).before(div);
	    $(".btn-danger").attr("disabled", false)
 	});

	$(".btn-danger").click(function() {
		if (ct>=2) {
			ct--;
			$(this).parent().remove();
		}
		if (ct==1) {
			$(".btn-danger").attr("disabled", "disabled")
		}
	});

	$('input[name="uploadfile"]').change(function(){
	    var fileName = $(this).val();
	    
	});

});
