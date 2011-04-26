function swapContent(content) {
    var head = "";
    var body = content;
    var contentContainer = $('.text_content');
    if (content.indexOf("\n~~~~\n") >= 0) {
        content = content.split("\n~~~~\n",2);
        head = content[0];
        body = content[1];
    }
    
    // set header and body content
    $('.subhead_content').html(head);
    contentContainer.html(body);
    
    // add class to style empty Content area
    if (contentContainer.text().length <= 3) {
      contentContainer.addClass('empty');
      } else { contentContainer.removeClass('empty');
    }
}

function getInfo() {
    var url = window.location.pathname +'/info.txt';
    $.ajax({
       type: "GET",
       url: url,
       success: swapContent
    });
    return;
}

function pageLandingInteractions(){
    getInfo();
}

function editCallback(data) {
    var data = jQuery.parseJSON(data);
    if (data.Code == 1) {
        swapContent(data.Message);
    }
}

jQuery(document).ready(function($) {
  var pageLanding = new pageLandingInteractions();
  
  $('body').noisy({
    opacity: 0.07
  });
  
  // show "finish edit" target when editing
  $('.text_content, .subhead_content').focus(function() {
    $('article').prepend("<div class='finish_edit'>finish edit</div>");
  });
  
  // save content on click out of content editable area
  $('.text_content, .subhead_content').blur(function() {
      var content = $('.text_content').html();
      if ($('.subhead_content').html() !== "") {
          content = $('.subhead_content').html() + "\n~~~~\n" + content;
      }
      $.ajax({
         type: "POST",
         url: window.location.pathname,
         data: "text=" + escape(content) + "&action=write",
         success: editCallback
      });
      $('.finish_edit').fadeOut(300);
      setTimeout(function(){
        $('.finish_edit').remove();
      }, 300);
  });
  
  // force Content links to go to URL on click instead of edit content
  $('*[contenteditable="true"] a').live('click', function(){
    window.location=$(this).attr('href');
  });
  
  // breadcrumb create page
  var breadcrumbs = $('.breadcrumbs');
  $('input', breadcrumbs).focus(function(){
    $('button', breadcrumbs).show();
  });
  $('input', breadcrumbs).blur(function(){
    setTimeout(function(){
      $('button', breadcrumbs).fadeOut(1000);
    }, 1500);
  });
  $('button', breadcrumbs).click(function(){
    var newPage = $('input', breadcrumbs).val();
    window.location=window.location.pathname+'/'+newPage;
  });
  
});