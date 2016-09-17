// Load Web fonts
WebFontConfig = {
  google: {
    families: ['Lato:300,400,500,700']
  }
};
(function(d) {
  var wf = d.createElement('script'),
    s = d.scripts[0];
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
  s.parentNode.insertBefore(wf, s);
})(document);

// IIFE -> Within this function, $ will always refer to jQuery
(function($) {
  /* Execute on DOM ready */
  $(function() {
    // # Create self-referencing heading anchors in the content section
    var hanchor = function(str) {
      var $anchor = '';
      var trimmed = $.trim(str);
      $anchor = trimmed.replace(/[^a-z0-9-]/gi, '-').
      replace(/-+/g, '-').
      replace(/^-|-$/g, '');
      return $anchor.toLowerCase();
    }

    var ellip = function(str, length) {
      var ending = "...";
      if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
      } else {
        return str;
      }
    };  
    // # Dynamic sidebar
    $(".sidebar-nav").attr("id","toc").toc({
      'selectors': 'h1,h2,h3', //elements to use as headings
      'container': '#content', //element to find all selectors in
      // 'smoothScrolling': false, //enable or disable smooth scrolling on click
      'prefix': '-', //prefix for anchor tags and class names
      'onHighlight': function(el) {
        // var ele = $(el).find("a");
        // var ele = $(el).find("a").attr("href");
        // $(ele).next().css("text-shadow", "0 0 15px cyan");
        // $(ele).next().css("text-shadow", "0 0 15px cyan");
      }, //called when a new section is highlighted 
      'highlightOnScroll': true, //add class to heading that is currently in focus
      'highlightOffset': 100, //offset to trigger the next headline
      'anchorName': function(i, heading, prefix) { //custom function for anchor name
          return hanchor((i+1)+prefix+$(heading).text());
      },
      'headerText': function(i, heading, $heading) { //custom function building the header-item text
          return ellip($heading.text(), 100);
      },
      'itemClass': function(i, heading, $heading, prefix) { // custom function for item class
        return "toc-"+$heading[0].tagName.toLowerCase();
      }
    });

    // # Toggle layout
    $(".toggle-layout").click(function() {
      $("body").toggleClass("two-cols");
      $("aside").toggleClass("shrink-source");
    });

    // # Toggle sidebar
    $(".toggle-sidebar").click(function(e) {
      e.preventDefault();
      $(".sidebar").toggleClass("sidebar-open");
    });
    // Hide sidebar when content area is clicked
    $(".content-inner").click(function(e) {
      if ($(".sidebar").hasClass("sidebar-open")){
        $(".sidebar").removeClass("sidebar-open");
      }
    });

    // # Morph mobile search icon
    $(".toggle-search").click(function(f) {
      $("i",this).toggleClass("icon-tt-ios-close-empty icon-tt-ios-search");
    });

    // # Prevent empty searches
    $('#search-form').submit(function(s) {
      var search = $(this).find("#term").val($.trim($(this).find("#term").val()));
      if (!search.val()) {
        s.preventDefault();
        $('#term').focus();
      }
    });

    // Target headings within .content-col, except .subtitle
    $(".content-col").find("h1, h2, h3, h4").not( ".subtitle  " ).each(function(i) {
      var heading = $(this);
      var headingtext = heading.text();
      var anchortext = hanchor(headingtext);
      var link = '<a href="#' + anchortext + '" class="section-link">&sect;</a>';
      heading.attr("id", anchortext).addClass("has-section-link").append(link);
    });

  });

  /* Execute later */

  // # Back to Top
  // Credits: https://codyhouse.co/gem/back-to-top/
  // browser window scroll (in pixels) after which the "back to top" link is shown
  var offset = 300,
    //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
    offset_opacity = 1200,
    //duration of the top scrolling animation (in ms)
    scroll_top_duration = 700,
    //grab the "back to top" link
    $back_to_top = $('.page-top');

  // hide or show the "back to top" link
  $(window).scroll(function(){
    ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('visible') : $back_to_top.removeClass('visible faded');
    if( $(this).scrollTop() > offset_opacity ) {
      $back_to_top.addClass('faded');
    }
  });

  // # Smooth Scrolling
  $('a[href*=#]:not([href=#],[data-slide=next])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
  // window.Tether = ''; // when using src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js
})(jQuery);