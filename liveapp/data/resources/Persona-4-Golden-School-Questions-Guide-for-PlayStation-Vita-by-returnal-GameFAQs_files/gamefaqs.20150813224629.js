/* jQuery UI dialog clickoutside */
$.widget( "ui.dialog", $.ui.dialog, {
  options: {
    clickOutside: false, // Determine if clicking outside the dialog shall close it
    clickOutsideTrigger: "" // Element (id or class) that triggers the dialog opening 
  },

  open: function() {
    var clickOutsideTriggerEl = $( this.options.clickOutsideTrigger );
    var that = this;
    
    if (this.options.clickOutside){
      // Add document wide click handler for the current dialog namespace
      $(document).on( "click.ui.dialogClickOutside" + that.eventNamespace, function(event){
        if ( $(event.target).closest($(clickOutsideTriggerEl)).length == 0 && $(event.target).closest($(that.uiDialog)).length == 0){
          that.close();
        }
      });
    }
    
    this._super(); // Invoke parent open method
  },
  
  close: function() {
    var that = this;
    
    // Remove document wide click handler for the current dialog
    $(document).off( "click.ui.dialogClickOutside" + that.eventNamespace );
    
    this._super(); // Invoke parent close method 
  },  

});

function submit_login()
{
	if (!$('#login_email').val())
	{
		$('#login_email').effect('highlight', 1000);
		$('#login_email').focus();
		return false;
	}
	if (!$('#login_password').val())
	{
		$('#login_password').effect('highlight', 1000);
		$('#login_password').focus();
		return false;
	}
	return true;
}

function show_signup()
{
	if($(document).width() < 500)
		var box_width = "98%";
	else
		var box_width = "60%";
	$.ajax({
		type: 'GET',
        url: '/features/user_signup/pick.php',
        success: function(response)
		{
			if(response=='')
			{
				window.location = ('/user/register.html');
			}
			else
			{
				$('#site_dialog').html(response);
				$('#site_dialog').dialog({	resizable: false, dialogClass: "reg_dialog", closeText: "X", height: "auto", width: box_width, modal: true});
			}
        }

    });
    return false;
}
function show_login()
{
	if($(document).width() < 500)
		var box_width = "98%";
	else
		var box_width = "30%";
	$('#login_dialog').dialog({	resizable: false, dialogClass: "reg_dialog", closeText: "X", height: "auto", width: box_width, modal: true});
	return false;
}

function submit_report()
{
	if(!$("input[name='reason']:checked").val())
	{
		alert('You must select a reason to report this post to the moderation staff.');
		return false;
	}
}

function show_msg_report(mnum,mid,firstmid)
{
	$('.report_dialog input[name="reason"]').prop('checked',false);
	$('.report_dialog input[name="reason_text"]').val('');
	$('.report_dialog input[name="rid"]').val('');
	$('.report_dialog input[name="ignore"]').attr('checked',false);
	$('.report_dialog h2.title').html('Report Message - <span data-msgid="'+mid+'">Post #' + mnum + '</span>');
	$('.report_dialog form[name="report_mod"]').each(function(){
		$(this).attr('action', $(this).attr('action') + mid);
	});
	$('input[name="msgid"]').val(mid);
	if(mid!=firstmid)
	{
		$('#m7').parent().hide();
	}
	else
	{
		$('#m7').parent().show();
	}

	if($(document).width() < 500)
		var box_width = "75%";
	else
		var box_width = "35%";
	$('.report_dialog').dialog({ resizable: false, dialogClass: "reg_dialog", closeText: "X", height: "auto", width: box_width, modal: true});
	return false;
}

function show_msg_sticky()
{
	if($(document).width() < 500)
		var box_width = "75%";
	else
		var box_width = "35%";
	$('.sticky_dialog').dialog({ resizable: false, dialogClass: "reg_dialog", closeText: "X", height: "auto", width: box_width, modal: true});
	return false;
}

function show_mygames_nouser_dialog()
{
	if($(document).width() < 500)
		var box_width = "98%";
	else
		var box_width = "30%";
	$('#mygames_nouser_dialog').dialog({resizable: false, dialogClass: "reg_dialog", closeText: "X", height: "auto", width: box_width, modal: true});
	return false;
}

function show_faqsearch_dialog(fixed,mobile)
{
	var module = "";
	var dialogclass = "reg_dialog";
	if(fixed)
		dialogclass += " fixed_dialog";
	if($(document).width() < 500)
		var box_width = "98%";
	else
		var box_width = "30%";
	$('.faqsearch_dialog').dialog({clickOutside: true, clickOutsideTrigger: '.togglesearch', resizable: false, dialogClass: dialogclass, closeText: "X", height: "auto", width: box_width, position: { my: "left+15 top", at: "right top+30"}, modal: false});
	if($('ul.faq_results li').length>0)
		$('input[name="faqsearch"]').blur();
	if(mobile==1)
		module = "faq-search-mob";
	else
		module = "faq-search";
	_gaq.push(['_trackEvent', 'faq-search', 'module-open', module]);
	return false;
}

function track_event(event_id)
{
	if(typeof omniture=='undefined' || !joparms)
		return;

//	omniture.trackClickEvent(joparms, [event_id], 46, 'eventTrack');
}

function post_click(url, action, key, target_id, target_text)
{
	var newForm = $('<form>', {
		'action': url,
		'method': 'post'
	});
	newForm.append($('<input>', {
		'name': 'key',
		'value': key,
		'type': 'hidden'
	}));
	newForm.append($('<input>', {
		'name': 'action',
		'value': action,
		'type': 'hidden'
	}));
	if(target_id)
	{
		newForm.append($('<input>', {
			'name': 'target_id',
			'value': target_id,
			'type': 'hidden'
		}));
	}
	if(target_text)
	{
		newForm.append($('<input>', {
			'name': 'target_text',
			'value': target_text,
			'type': 'hidden'
		}));
	}
	newForm.appendTo( document.body );
    newForm.submit();
}