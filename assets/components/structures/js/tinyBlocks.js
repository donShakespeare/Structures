/*
https://github.com/donShakespeare/
http://www.leofec.com/modx-revolution/
(c) 2016 by donShakespeare: MODX & Content Editor Specialist
Deo Gratias!

ROADMAP
1. add lexicon for all messages
2. make ExtJS dialogs TinyMCE or custom == skinable
3. enable frontend 
4. be more fantastic
*/



// http://stackoverflow.com/questions/7391930/jquery-html-does-not-copy-contents-of-textareas-or-inputs
// https://raw.githubusercontent.com/spencertipping/jquery.fix.clone/master/jquery.fix.clone.js
(function (original) {
  jQuery.fn.clone = function () {
    var result           = original.apply(this, arguments),
      my_textareas     = this.find('textarea').add(this.filter('textarea')),
      result_textareas = result.find('textarea').add(result.filter('textarea')),
      my_selects       = this.find('select').add(this.filter('select')),
      result_selects   = result.find('select').add(result.filter('select'));

    for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
    for (var i = 0, l = my_selects.length;   i < l; ++i) {
      for (var j = 0, m = my_selects[i].options.length; j < m; ++j) {
        if (my_selects[i].options[j].selected === true) {
          result_selects[i].options[j].selected = true;
        }
      }
    }
    return result;
  };
}) (jQuery.fn.clone);

// *******

// alterClass https://gist.github.com/peteboere/1517285
$.fn.alterClass = function ( removals, additions ) {
 var self = this;
 if ( removals.indexOf( '*' ) === -1 ) {
  // Use native jQuery methods if there is no wildcard matching
  self.removeClass( removals );
  return !additions ? self : self.addClass( additions );
 }
 var patt = new RegExp( '\\s' + 
   removals.
    replace( /\*/g, '[A-Za-z0-9-_]+' ).
    split( ' ' ).
    join( '\\s|\\s' ) + 
   '\\s', 'g' );
 self.each( function ( i, it ) {
  var cn = ' ' + it.className + ' ';
  while ( patt.test( cn ) ) {
   cn = cn.replace( patt, ' ' );
  }
  it.className = $.trim( cn );
 });
 return !additions ? self : self.addClass( additions );
};

// *******

function tinyBlocksSave(options, status){
  if(typeof tinyBlocksCustomSave == "undefined"){
    if(!$("#tinyBlocksThrobber").length){
      tinyBlocksThrobber(1);
      if(tinymce.get(tinyBlocksOriginalSourceId)){
        tinymce.get(tinyBlocksOriginalSourceId).remove();
      }
      if($("#ace_wrapper_ta").length){
        ace.edit("ace_id_ta").destroy();
        $("#ace_wrapper_ta").remove();
      }
      tinyBlocksResult = $(".tinyBlocksRowsWrapperClass").clone(true, true);
      var result = $(".tinyBlocksRowsWrapperClass").clone(true, true);
      var tinyClasses = tinyBlocksHiddenBlockClass + " " + tinyBlocksRowClass + " " + tinyBlocksNewBlockClass + " " + tinyBlocksShrinkBlockClass + " ";
      result.find("textarea.tb-tiny-rc-sub").each(function(){
        var parent = $(this).parents(".tb-wrapper-tlb");
        var parentSub = $(this).parents(".tb-tiny-rc");

        if(parentSub[0].nodeName == "PRE" || parentSub[0].nodeName == "CODE"){
          var value = tinymce.html.Entities.encodeAllRaw($(this).val())
        }
        else{
          parent.attr("markdown", 1);
          var value = $(this).val();
        }

        $(this).parent().html(value);
      });
      result.find(".tb-unwrap").each(function(){
        var tempClassNames = $(this).attr("class");
        var tempTitle = $(this).attr("data-tb-title");
        $(this).children(":first").addClass(tempClassNames).attr("data-tb-title", tempTitle).unwrap();
      });
      result.find("iframe, .tb-wrapper-tlb").unwrap();
      result.html(result.children(".tb-wrapper-tlb")); //destroy surrounding stuffsss
      result.find(".tb-wrapper-tlb:not(:last)").after('\n'); //Markdown parser needs this
      result.find(".tb-tiny-md").each(function(){
        var thisContent = $(this).html();
        $(this).html(saveMyFootMarks(thisContent));
        // var tiny = $(this).attr('id');
        // $(this).html(tinymce.get(tiny).getContent({format:'text'})); //not trustworthy yet
        $(this).attr("markdown", 1);
      });
      result.find("[id^=mce_]").removeAttr('id');
      result.find(".tinyBlocksCE, [data-mce-bogus], [data-mce-style], .mce-shim, .coder").remove();
      result.find('*')
        .removeAttr("data-tb-rapid twprecodemanagerprecss contenteditable data-mce-href data-mce-selected data-mce-src")
        .removeClass(tinyClasses)
        .alterClass("tinyBlocks* mce-* tb-custom-*","");
      result.find('[class*="tb-tiny-"]')
        .removeAttr("spellcheck style width height contenteditable");
      result.find('[class=""]').removeAttr('class');
      var pure = result.find('.tb-tiny-pure');
      if(pure.length > 1){
        pure.not(":first").prepend("[[-TB-MARKER]]");
      }
      if(pure.length){
        pure.contents().unwrap();
      }


      var resultContent = result.html().replace(/(?:&amp;gt;|&gt;)/g, ">");
      if(status){
        document.getElementById(tinyBlocksMainWrapperId+"_HTML").value = resultContent;
        tinyBlocksThrobber(0);
      }
      else{
        document.getElementById(tinyBlocksOriginalSourceId).value = resultContent;
        setTimeout(function(){
          tinyBlocksThrobber(0);
          $("#modx-abtn-save").trigger("click");
        },500);
      }
    }
  }
  else{
    tinyBlocksCustomSave();
  }
}
function tinyBlocksRapidImage(blobInfo, success, failure) {
  if(typeof tinyBlocksCustomRapidImage == "undefined"){
    $("#tb-alert-input").show();
    var xhr, formData;
    var post = tinymce.activeEditor.getParam("tbRapidImageSettings",{}).uploadScriptUrl;
    var path = tinymce.activeEditor.getParam("tbRapidImageSettings",{}).uploadPath || "";
    var url = tinymce.activeEditor.getParam("tbRapidImageSettings",{}).uploadUrl || "";
    xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', post + "?path=" + path + "&url=" + url);

    xhr.onload = function() {
      var json;

      if (xhr.status != 200) {
        failure('HTTP Error: ' + xhr.status);
        return;
      }

      json = JSON.parse(xhr.responseText);

      if (!json || typeof json.location != 'string') {
        failure('Invalid JSON: ' + xhr.responseText);
        return;
      }

      success(json.location);
    };

    formData = new FormData();
    function tbRapidCallback(btn, text) {
      if(btn == "ok"){
        if (text) {
          var current = text;
          formData.append('file', blobInfo.blob(), current);
          xhr.send(formData);
          tinymce.activeEditor.getParam("tbRapidImageSettings",{}).tempFilename = current;
          var existingFilename = $(tinymce.activeEditor.getBody()).find("img").each(function(){
            if($(this).attr("src").indexOf('blob:') >= 0){
              $(this).attr("data-tb-rapid", current);
            }
          })
        }
        else if($(tinymce.activeEditor.getBody()).find("img[src*='blob:'][data-tb-rapid]").length){
          var current = $(tinymce.activeEditor.getBody()).find("img[src*='blob:'][data-tb-rapid]").data("tb-rapid");
          formData.append('file', blobInfo.blob(), current);
          xhr.send(formData);
          tinymce.activeEditor.getParam("tbRapidImageSettings",{}).tempFilename = current;
        }
        else{
          if($(tinymce.activeEditor.getBody()).find("img[src*='blob:']").length){
            var current = blobInfo.filename();
            formData.append('file', blobInfo.blob(), current);
            xhr.send(formData);
            tinymce.activeEditor.getParam("tbRapidImageSettings",{}).tempFilename = current;
            var existingFilename = $(tinymce.activeEditor.getBody()).find("img").each(function(){
              if($(this).attr("src").indexOf('blob:') >= 0){
                $(this).attr("data-tb-rapid", current);
              }
            })
          }
        }
      }
      else{
        $(tinymce.activeEditor.getBody()).find("img[src*='blob:']").remove();
      }
      // $("#tb-alert-input").hide();
    }

    var title = 'Valid <b>image.ext</b> names only';
    var msg = '<span id="tb-alert-input"><i>Identical</i> name will overwrite duplicate server image<br><i>Cancel</i> will remove present data image from editor<br></span>';
    var date = new Date();
    var timely = date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "__" +  date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
    var trimmedBlob = blobInfo.filename().substr(blobInfo.filename().lastIndexOf('.') + 1);
    var tempName = "temp_" + timely + "." + trimmedBlob;

    Ext.MessageBox.prompt(title,msg,tbRapidCallback);
    var existingFilename = $(tinymce.activeEditor.getBody()).find("img[src*='blob:']").data("tb-rapid") || $(tinymce.activeEditor.getBody()).find("img[data-mce-selected]").data("tb-rapid") || tempName;
    var inputPar = $("#tb-alert-input").parent().parent();
    inputPar.find("input").val(existingFilename);
    // inputPar.find("#tb-alert-input").remove();
    // var msg2 = '<p id="tb-alert-input"><br><i>Identical</i> name will overwrite image<br><i>Cancel</i> will remove image from editor</p>';
    // if(!inputPar.find("input").hasClass("tb-active")){
    //   inputPar.find("br").remove();
    //   inputPar.find("input").addClass("tb-active").after(msg2);
    // }
  }
}
function tinyBlocksToolsMenu(){
  $(".mce-tinyBlocksTools").prependTo("#tinyBlocksControlButtonsWrapper").hide();
  tinyBlocksMouseHoverTraffic = 0;
}
function tinyBlocksClearAll(mode, mainWrapperId, rowTempHolderClass, rowsWrapperClass){
  var tbMain = document.getElementById(tinyBlocksMainWrapperId);
  var tbTHC  = $(tbMain).find(".tinyBlocksRowTempHolderClass");
  var tbTHC_ui  = $(tbMain).find(".tinyBlocksRowTempHolderClass.ui-selected");
  if(tbTHC.length){
    var selectedBlocks = "<b>Every</b> Block will be removed";
    if(tbTHC_ui.length){
      var selectedBlocks = "<b>"+tbTHC_ui.length+"</b> Selected Block(s) will be removed";
    }
    var rowAction = function(btn) {
      if(btn == "ok"){
        tinyBlocksThrobber(1);
        setTimeout(function(){
          tinyBlocksToolsMenu();
          if(tbTHC_ui.length){
            tbTHC_ui.find(".mce-content-body").each(function() {
              $(this).tinymce().remove();
            });
            tbTHC_ui.remove();
            tinyBlocksLoneOrNoBlock();
            tinyBlocksThrobber(0);
          }
          else{
            tbTHC.find(".mce-content-body").each(function() {
              $(this).tinymce().remove();
            });
            tbTHC.parent().empty();
            tinyBlocksLoneOrNoBlock();
            tinyBlocksThrobber(0);
          }
        },100);
      }
    }
    if(mode == "temp"){
      rowAction("yes");
      return;
    }
    Ext.MessageBox.show({
      title : "Permanent Block Deletion!",
      msg : selectedBlocks,
      width : 300,
      buttons : Ext.MessageBox.OKCANCEL,
      fn : rowAction,
      icon : Ext.MessageBox.WARNING
    });
  }
  else{
    tbTHC.find(".tinyBlocksRowsWrapperClass").empty();
    tinyBlocksThrobber(0);
  }
}

// *******

function tinyBlocksImport(status) {
  tinyBlocksToolsMenu();
  tinyBlocksThrobber(1);
  setTimeout(function(){
    var content = document.getElementById(tinyBlocksMainWrapperId+"_HTML").value;
    var tbMain = document.getElementById(tinyBlocksMainWrapperId);
    var tbRWC = $(tbMain).find(".tinyBlocksRowsWrapperClass");
    if(tinyBlocksPure){
      tinyBlocksThrobber(0);
      MODx.msg.alert("Pure Content!", "You are currently in '"+tinyBlocksPure+"' mode");
      return;
    }
    if(content.indexOf("[[-TB-MARKER]]")>=0 || content.indexOf("[[-TB-MARKER-SINGLE]]")>=0){
      var newContent = tinyBlocksImportWrapper.replace("[[+content]]", content.replace(/(?:\[\[\-TB-MARKER\]\])/g, tinyBlocksImportMarker ).replace("[[-TB-MARKER-SINGLE]]", ""));
      tinyBlocksClearAll("temp");
      $(tbRWC).hide().html(newContent);
      tinyBlocksPrepareTLB($(tbRWC).find(".tb-wrapper-tlb"));
      tinyBlocksPrepareAceBlock($(tbRWC).find(".tb-tiny-rc"));
      tinyBlocksTinyMCE();
      tinyBlocksRawCode();
      tinyBlocksThrobber(0);
      $(tbRWC).fadeIn();
    }
    else{
      tinyBlocksThrobber(0);
      MODx.msg.alert("Alert!", "Place [[-TB-MARKER]] wherever you want sections<br> OR place [[-TB-MARKER-SINGLE]] anywhere if you do not want sections");
    }
  }, 200);
}
function tinyBlocksInsert(event, el) {
  if(event == "shortcut"){
    var tinyblockssnippet = el;
  }
  else{
    var tinyblockssnippet = el.attr("data-tinyblocks-trigger");
  }
  var snippetTpl = $("[data-tinyblocks="+tinyblockssnippet+"]").parents(".tinyBlocksRowTempHolderClass").clone(true, true); //crucial
  var tlb = snippetTpl.find(".tb-wrapper-tlb");
  tlb.removeAttr('data-tinyblocks').addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass").prev(".tb-spacer").addClass(tinyBlocksNewBlockClass + " tinyBlocksNewBlockClass");
  if(snippetTpl.find(".tb-tiny-rc-sub").length){
    if(typeof ace !== "undefined"){
      snippetTpl.find(".tb-tiny-rc-sub").uniqueId().parent().addClass('tb-no-ace');
    }
    else{
      MODx.msg.alert("Alert!", "No Ace!");
    }
  }
  var activeRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass");
  if(tinyBlocksPure == "fc" || tinyBlocksPure == "md" || tinyBlocksPure == "rc"){
    tlb.alterClass("tb-tiny-*", "").addClass("tb-tiny-" + tinyBlocksPure + " tb-tiny-pure");
  }
  if(event == "click" || event == "shortcut"){
    if(!activeRow.length){
      $(snippetTpl).prependTo(".tinyBlocksRowsWrapperClass");
    }
    else{
      activeRow.children(".tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
      $(snippetTpl).insertAfter(activeRow);
    }
  }
  else if(event == "drag"){
    $("#" + tinyBlocksMainWrapperId + " .tb-ui-drag-helper").replaceWith(snippetTpl);
  }
  tinyBlocksLoneOrNoBlock();
  tinyBlocksTinyMCE();
  tinyBlocksRawCode();
  // tinyBlocksIconPicker();
  tinyBlocksThrobber(0);
}
function tinyBlocksQuickInsert(num){
  var num = num - 1;
  var item = $("#blockSnippetBar").find("[data-tinyblocks-trigger]:eq("+num+")");
  if(item){
    item.trigger("click");
  }
}
function tinyBlocksPrepareTLB(el) {
  el.each(function(){
    var tempTLB = '';
    if($(this).hasClass('tb-unwrap')){
      var tempTitle = $(this).data("tb-title");
      var tempBlockID = $(this).data("tinyblocks");
      var tempClassNames = $.grep(this.className.split(" "), function(v, i){
        return v.indexOf('tb-') === 0;
      }).join(" ");
      $(this).alterClass("tb-*", "").removeAttr("data-tinyblocks");
      // $(this).alterClass("tb-*", "").removeAttr("data-tinyblocks data-tb-title");
      var tempTLB = "<div class='" + tempClassNames + " " + tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass' data-tinyblocks='"+tempBlockID+"' data-tb-title='"+tempTitle+"'></div>";
    }
    else{
      if($("#"+tinyBlocksMainWrapperId + " .tb-wrapper-tlb").length > 1){
        $(this).addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
      }
    }
    $(this).wrap("<div class='tinyBlocksRowTempHolderClass "+tinyBlocksRowTempHolderClass+"'>" + tempTLB + "</div>")
    if($(this).attr('data-tb-title')){
      var text = $(this).attr('data-tb-title').replace(/'|\"/g, "");
    }
    else{
      var text = "";
    }
    $(this).parents(".tinyBlocksRowTempHolderClass").prepend(
    // .before(
      // $('<div>', {
      //   'class': 'tb-ui-drag-handle'
      // }),
      $('<div>', {
        'class': 'tb-select',
        'title': 'Drag to Sort; Click to Toggle Select/All'
      }),
      $('<div class=tb-spacer><div class=tb-title title="Edit Title" contenteditable=true>'+text+'</div></div>')
    )
  });
}
function tinyBlocksPrepareAceBlock(el) {
  if(!tinyBlocksPure){
    el.each(function(){
      if(!$(this)[0].nodeName == "PRE"){
        var html = $(this).html().replace(/(?:&amp;gt;|&gt;)/g, ">");
        var content = tinymce.html.Entities.encodeAllRaw(html);
      }
      else{
        var html = $(this).html();
        var content = tinymce.html.Entities.decode(html);
      }
      $(this).html("<textarea style='display:none;' class='tb-tiny-rc-sub'>" + content + "</textarea>");
      // console.log(content);
    });
    $("#" + tinyBlocksMainWrapperId + " .tb-tiny-rc").addClass("tb-no-ace");
  }
}
/*function tinyBlocksTinyMCE(){
  // supplied externally
}
function tinyBlocksAceOrCM(){
  // supplied externally
}*/
function tinyBlocksRawCode() {
  $("#" + tinyBlocksMainWrapperId + " .tb-tiny-rc.tb-no-ace").each(function(){
    $(this).addClass("tb-custom-ace-parent").removeClass("tb-no-ace");
    var sub = $(this).find(".tb-tiny-rc-sub");
    sub.uniqueId();
    var thisID = sub.attr("id");
    sub.each(function(){
       tinyBlocksAceOrCM(thisID);
    });
  });
}
function tinyBlocksDuplicate() {
  var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass");
  if(thisRow){
    tinyBlocksToolsMenu();
    $(".tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
    var thisClone = thisRow.clone(true, true);
    var tlb = thisClone.find(".tb-wrapper-tlb");
    tlb.prev(".tb-spacer").addClass(tinyBlocksNewBlockClass, tinyBlocksDuplicateBlockClass + " tinyBlocksNewBlockClass tinyBlocksDuplicateBlockClass");
    thisClone.find(".tb-tiny-rc-sub").uniqueId().hide().parents(".tb-tiny-rc").addClass("tb-no-ace");

    // thisClone.find(".tb-tiny-md, .tb-tiny-md-mini").empty() // if there is trouble with encoding Markdown
    thisClone.find(".tb-tiny-md").each(function(){
      var tiny = $(this).attr('id');
      $(this).html(tinymce.get(tiny).getContent({format:'text'}));
    });
    thisClone.find(".ace_wrapper_modx").remove();
    thisClone.find("*:not(.tb-title)").removeAttr("id contenteditable style").alterClass("mce*","");
    thisClone.hide().insertAfter(thisRow).fadeIn();
    tinyBlocksTinyMCE();
    tinyBlocksRawCode();
    tinyBlocksLoneOrNoBlock();
    tinyBlocksThrobber(0);
  }
}
function tinyBlocksDelete(){
  var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass");
  if(thisRow.length){
    var ind = thisRow.index()+1;
    var rowAction = function(btn) {
      if(btn == "ok"){
        tinyBlocksToolsMenu();
        thisRow.find(".mce-content-body").each(function() { $(this).tinymce().remove();});
        thisRow.fadeOut().delay(500).remove();
        tinyBlocksLoneOrNoBlock();
      }
    }
    Ext.MessageBox.show({
      title : "Permanent Block Deletion!",
      msg : "This Block (#"+ind+") will be removed",
      width : 280,
      buttons : Ext.MessageBox.OKCANCEL,
      fn : rowAction,
      icon : Ext.MessageBox.WARNING
    });
  }
}
function tinyBlocksShortcutJSON(){
  tinyBlocksShortcut = '';
  $('#blockSnippetBar').find('[data-tinyblocks-trigger]').each(function () {
    var text = $(this).text().trim();
    var click = $(this).data('tinyblocks-trigger');
    tinyBlocksShortcut += '{text: "' + text + '", onclick: function(){tinyBlocksInsert("shortcut","' + click + '")}}\n';
  });
  tinyBlocksShortcut = tinyBlocksShortcut.replace(/\n\s*$/, '');
  tinyBlocksShortcut = '[' + tinyBlocksShortcut.replace(/\n/g, ',') + ']';
  tinyBlocksShortcut = tinymce.util.JSON.parse(tinyBlocksShortcut);
}
function tinyBlocksUpAndDown(direction){
  tinyBlocksMouseHoverTraffic = 1;
  var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass");
  // var thisRow = $("#"+tinyBlocksMainWrapperId).find(".tinyBlocksRowTempHolderClass.tinyBlocksActive");
  $("#"+tinyBlocksMainWrapperId).find(".ui-selected").removeClass("ui-selected");
  thisRow.addClass("ui-selected");
  var prev = thisRow.prev();
  var next = thisRow.next();
  // tinyBlocksToolsMenu();
  $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
  if(direction == "ArrowUp" && prev.length){
    thisRow.insertBefore(prev);
  }
  else if(direction == "ArrowDown" && next.length){
    thisRow.insertAfter(next);
  }
}

function tinyBlocksKeyBoard(){
  if(typeof tinyBlocksCustomKeyBoard == "undefined"){
    //only ExtJS can highjack ExtJS
    new Ext.KeyMap(document.body, {
      key  : Ext.EventObject.S,
      ctrl : true,
      fn   : function(keycode, e) {
        e.stopEvent();
        tinyBlocksSave();
      }
    });
    Mousetrap.bind(['up', 'down'], function(e) {
      tinyBlocksUpAndDown(e.code);
    });
    Mousetrap.bind(['1', '2', '3', '4', '5', '6', '7', '8', '9'], function(e) {
      var num = e.code.substr(e.code.length - 1);
      tinyBlocksQuickInsert(num);
    });
    Mousetrap.bind({
      '-': function () {
        $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
      },
      '+': function () {
        $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").removeClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
      },
      'h': tinyBlocksGuide,
      'm': tinyBlocksShowHTML,
      'i m': tinyBlocksImport,
      'a': function() {
        $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowTempHolderClass").addClass("ui-selected");
      },
      'del 1': tinyBlocksDelete,
      'del a': tinyBlocksClearAll,
      'c': tinyBlocksDuplicate,
      'home': function (e) {
        if($(".tinyBlocksDistraction").length){
          $(".tinyBlocksDistraction").removeClass("tinyBlocksDistraction");
          if (!$('#modx-leftbar:visible').length) {
            $(".x-layout-mini.x-layout-mini-west").trigger("click");
          }
        }
        else{
          $("#modx-header, #modx-action-buttons, #modx-content, #modx-action-buttons, #modx-resource-tabs .x-tab-panel-header.x-tab-panel-header-noborder.x-unselectable.x-tab-panel-header-plain").addClass("tinyBlocksDistraction");
          if ($('#modx-leftbar:visible').length) {
            $(".x-layout-mini.x-layout-mini-west").trigger("click");
          }
        }
      },
    });
  }
}

// *******

function tinyBlocksLoneOrNoBlock(){
  var loneBlock = $(".tinyBlocksRowsWrapperClass .tinyBlocksRowTempHolderClass");
  if(loneBlock.length < 2){
    loneBlock.addClass("tb-lone-block");
    // document.styleSheets[0].addRule('.tinyBlocksRowsWrapperClass .tinyBlocksRowTempHolderClass.tb-lone-block:before','display:none;');
  }
  else{
    loneBlock.removeClass("tb-lone-block");
  }
  if (!$('.tinyBlocksRowsWrapperClass') [0].hasChildNodes()) {
    $('.tinyBlocksRowsWrapperClass').html(tinyBlocksHelp);
  }
  else{
    $('.tinyBlocksRowsWrapperClass .tb-guide').remove();
  }

}
function tinyBlocksGuide() {
  Ext.MessageBox.show({
    title : 'Quick Guide and How To',
    msg : tinyBlocksHelp,
    width : 600,
    closable : true,
    buttons : Ext.MessageBox.OK,
    icon : Ext.Msg.QUESTION
  });
}
function tinyBlocksThrobber(power,delay){
  delay = delay ? delay : 0;
  if(power == 0){
    setTimeout(function(){
      $("#tinyBlocksThrobber").remove()
    }, delay)
  }
  else if(power == 1){
    $("#tinyBlocksThrobber").remove();
    $("#" + tinyBlocksMainWrapperId).prepend('<div id="tinyBlocksThrobber"></div>');
  }
}
function tinyBlocksShowHTML() {
  var tbMain = document.getElementById(tinyBlocksMainWrapperId+"_HTML");
  var tbMainS = $(tbMain).parent();
  if($(tbMainS).is(":hidden")){
    $(tbMainS).fadeIn();
  }
  else{
    $(tbMainS).fadeOut();
  }
}

// *******

//begin
function tinyBlocks(sourceFeed, originalSourceId, rowClass, rowTempHolderClass, rowsWrapperClass, newBlockClass, hiddenBlockClass, duplicateBlockClass, shrinkClass, saveButtonTpl, importWrapper, importMarker, thisPageUrl, pure, help) {
  if(typeof tinyBlocksItems == "undefined"){
    tinyBlocksItems = {};
  }
  //two ways to initiate TinyBlocks
  tinyBlocksSourceFeed = tinyBlocksItems["sourceFeed"] || sourceFeed;
  tinyBlocksOriginalSourceId = tinyBlocksItems["originalSourceId"] || originalSourceId;
  tinyBlocksMainWrapperId = "tinyBlocksMainWrapperId_" + tinyBlocksOriginalSourceId;
  tinyBlocksRowClass = tinyBlocksItems["rowClass"] || rowClass;
  tinyBlocksRowTempHolderClass = tinyBlocksItems["rowTempHolderClass"] || rowTempHolderClass;
  tinyBlocksRowsWrapperClass = tinyBlocksItems["rowsWrapperClass"] || rowsWrapperClass;
  tinyBlocksNewBlockClass = tinyBlocksItems["newBlockClass"] || newBlockClass;
  tinyBlocksHiddenBlockClass = tinyBlocksItems["hiddenBlockClass"] || hiddenBlockClass;
  tinyBlocksDuplicateBlockClass = tinyBlocksItems["duplicateBlockClass"] || duplicateBlockClass;
  tinyBlocksShrinkBlockClass = tinyBlocksItems["shrinkClass"] || shrinkClass;
  tinyBlocksSaveButtonTpl = tinyBlocksItems["saveButtonTpl"] || saveButtonTpl;
  tinyBlocksImportWrapper = tinyBlocksItems["importWrapper"] || importWrapper;
  tinyBlocksImportMarker = tinyBlocksItems["importMarker"] || importMarker;
  tinyBlocksPure = tinyBlocksItems["pure"] || pure;
  tinyBlocksHelp = tinyBlocksItems["help"] || help;
  tinyBlocksThisPageUrl = tinyBlocksItems["thisPageUrl"] || thisPageUrl;

  if(tinyBlocksOriginalSourceId && tinyBlocksMainWrapperId && tinyBlocksRowClass && tinyBlocksRowTempHolderClass && tinyBlocksRowsWrapperClass){
    tinyBlocksThrobber(1);
    $("."+tinyBlocksRowsWrapperClass).addClass("tinyBlocksRowsWrapperClass");

    $("<div id=tinyBlocksControlButtonsWrapper></div><div id=tinyBlocksTempEd style=display:none></div><div id=tinymceWrapperBubbleBar></div>").prependTo("body");

    $("#" + tinyBlocksMainWrapperId).prepend("<div class='tinyBlocksHTMLwrapper' style=display:none><div id='"+tinyBlocksMainWrapperId+"_HTML_btn' class='tinyBlocksHTMLbtn'></div><textarea id='"+tinyBlocksMainWrapperId+"_HTML' class='tinyBlocksHTML'></textarea></div>");
    $("#"+tinyBlocksMainWrapperId+"_HTML").val($("#"+tinyBlocksOriginalSourceId).val());

    tinyBlocksKeyBoard();
    tinyBlocksPrepareTLB($(".tb-wrapper-tlb"));
    tinyBlocksPrepareAceBlock($(".tb-tiny-rc"));

    //remove this from TinyBlocks.js OR make it user variable
    $(tinyBlocksSaveButtonTpl).prependTo("#modx-action-buttons .x-toolbar-left-row");

    tinyBlocksLoneOrNoBlock();
    tinyBlocksShortcutJSON();
    
    tinyBlocksClickReady = 1;
    $("[data-tinyblocks-trigger]").on("click",function(){
      if(tinyBlocksClickReady){
        tinyBlocksInsert("click", $(this));
      }
    });

    tinyBlocksMouseHoverTraffic = 0;
    tinymce.ui.Factory.create({
      type: "menubutton",
      text:"Import / Debug / Disable",
      classes:"tinyBlocksHTMLTools",
      onPostRender:function(){
        tinymce.DOM.loadCSS(tinyBlocksItems["sourceBTNcss"]);
      },
      menu:[
        {
          text: "Import/Convert Source",
          classes:"import",
          onclick: tinyBlocksImport
        },
        {
          text: "Toggle Debug Info in SideBar",
          classes:"debug",
          onclick: function(){
            if($(".tinyBlocksDebug").length){
              if($(".tinyBlocksDebug:hidden").length){
                $(".tinyBlocksDebug").fadeIn();
              }
              else{
                $(".tinyBlocksDebug").fadeOut();
              }
            }
            else{
              MODx.msg.alert("Alert!","Debug Info is switched off for this Template");
            }
          }
        },
        {
          text: "Disable Structures",
          classes:"disable",
          onclick: function(){
            var rowAction = function(btn){
              if(btn == "ok"){
                location.href = tinyBlocksThisPageUrl+"&structures=disabled";
              }
            }
            Ext.MessageBox.show({
              title : "Disable Structures",
              msg : "This Page is about to Refresh",
              width : 280,
              buttons : Ext.MessageBox.OKCANCEL,
              fn : rowAction,
              icon : Ext.MessageBox.WARNING
            });
          }
        }
      ]
    }).renderTo(document.getElementById(tinyBlocksMainWrapperId+"_HTML_btn"));
    tinymce.ui.Factory.create({
      type: "menubutton",
      hidden: true,
      // icon:"fullpage",
      classes:"tinyBlocksTools",
      onPostRender: function(){
        tinyBlocksTinyMCE();
        tinyBlocksRawCode();
        tinyBlocksThrobber(0);
        $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowsWrapperClass")
        .sortable({
            handle: ".tb-select",
            // handle: ".tb-ui-drag-handle",
            // cancel: ".tinyBlocksRowTempHolderClass > *:not(.tb-ui-drag-handle)", //same as above
            placeholder: "ui-state-highlight",
            helper: "ui-state-helper",
            cursorAt: {top: 15},
            delay: 5,
            appendTo: document.body,
            // containment:"window", //trouble for draggable
            tolerance: "intersect",
            // forcePlaceholderSize: true,
            // forceHelperSize: true,
            axis: "y",
            opacity: 0.85,
            start: function(event, ui){
              tinyBlocksClickReady = 0;
              // tinyBlocksToolsMenu();
              $("body").addClass('ui-drag');
              visibleLi  = $('.tinyBlocksRowTempHolderClass.ui-selected').length;
              visibleSelected  = $(".ui-selected:visible").length;
              if($(".ui-selected:visible").length > 1){
                ui.item.siblings(".ui-selected").addClass("tinyBlocksEnRouteSibling");
                $(".tinyBlocksEnRouteSibling:not(.tb-ui-multiple-select)").hide().wrapAll("<div class='tinyBlocksTempUI' style='display:none' />");
                ui.item.addClass("tb-ui-multiple-select ui-selected");
              }
              else{
                ui.item.addClass("tb-ui-single-select");
              }
              // $(".mce-widget.mce-tooltip").addClass("hideTooltip");
              tinyBlocksMouseHoverTraffic = 1;
              $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
            },
            stop: function(event,ui){
              tinyBlocksClickReady = 1;
              tinyBlocksMouseHoverTraffic = 0;
              ui.item.removeAttr("style");
              $("body").removeClass('ui-drag');
              var valid = $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowTempHolderClass").length;
              var validcheck = $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowTempHolderClass.ui-selected").length;
              // if(!$(".ui-state-highlight").length && $(".tb-ui-multiple-select").length){
              //   $(".tinyBlocksTempUI").prependTo('.tinyBlocksRowsWrapperClass');
              //   $(".tinyBlocksTempUI").contents().unwrap();
              //   alert("abberation")
              // }
              if(!$(".tinyBlocksTempUI").find(".tb-ui-multiple-select").length && $(".tb-ui-multiple-select").length){ //normal
                $(".tinyBlocksTempUI").insertAfter(".tb-ui-multiple-select");
                $(".tinyBlocksTempUI").contents().unwrap();
                console.log("TinyBlocks.js expected jQuery UI multiple Select/Sortable behaviour");
              }
              if($(".tinyBlocksTempUI").find(".tb-ui-multiple-select").length){
                $(".tinyBlocksTempUI > .tinyBlocksRowTempHolderClass:not(.tb-ui-multiple-select)").wrapAll("<div class=tinyBlocksTempUItemp />");
                $(".tinyBlocksTempUItemp").insertAfter(".tb-ui-multiple-select");
                $(".tinyBlocksTempUItemp").contents().unwrap();
                // $(".tinyBlocksTempUI").insertAfter(".tb-ui-multiple-select");
                $(".tinyBlocksTempUI").contents().unwrap();
                console.log("TinyBlocks.js just solved jQuery UI Sortable headache: child containing parent");
              }
              $(".tinyBlocksEnRouteSibling").fadeIn().removeClass("tinyBlocksEnRouteSibling");
              $(".tb-ui-multiple-select, .tb-ui-single-select").removeClass("tb-ui-multiple-select tb-ui-single-select");
              // console.log("TinyBlocks.js completed jQuery UI multiple Select/Sortable");
            },
            revert: "invalid",
            revertDuration: 50,
            // revert: false,
            receive: function(event, ui) {
              tinyBlocksInsert("drag", $(ui.item));
            }
        })
        .css("position","relative")
        .selectable({
          filter: ".tinyBlocksRowTempHolderClass",
          cancel: ".tb-guide,.tinyBlocksRowTempHolderClass > *", //covers external Inline Ace plugin
          // cancel: ".tb-wrapper-tlb, .tb-title-spacer, .tb-ui-drag-handle, .mce-tinyBlocksTools"
        });

        $("[data-tinyblocks-trigger]")
        .draggable({
          connectToSortable: "#" + tinyBlocksMainWrapperId + " .tinyBlocksRowsWrapperClass",
          helper: "clone",
          revert: "invalid",
          zIndex:99999,
          containment:"window",
          delay: 10,
          cancel:false, // for <buttons>
          // forcePlaceholderSize: true,
          // forceHelperSize: true,
          tolerance: "intersect",
          revertDuration: 50,
          appendTo: document.body,
          cursorAt: {top:15},
          scroll: false,
          start:function(event,ui){
            tinyBlocksToolsMenu();
            $(".tinyBlocksRowsWrapperClass .ui-selected").removeClass("ui-selected");
            $("body, #blockSnippetBar").addClass('ui-drag');
            tinyBlocksClickReady = 0;
            $(ui.helper).addClass('tb-ui-drag-helper');
            $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
          },
          stop:function(event,ui){
            $("body, #blockSnippetBar").removeClass('ui-drag');
            // $(".tb-ui-drag-helper").hide(); //too quick
            tinyBlocksClickReady = 1;
          }
        });
        $("#blockSnippetBar, #blockSnippetBar [data-tinyblocks-trigger]").disableSelection();
      },
      menu:[
        {
          icon: false,
          text: "Duplicate",
          classes:"tb-duplicate",
          onclick: tinyBlocksDuplicate,
          onPostRender: function(){
            $(".mce-tb-duplicate").parent().addClass('mce-tinyBlocksTools-menu'); //double parents does not work
          }
        },
        {
          icon: false,
          text: "Delete",
          classes:"tb-trash",
          onclick: tinyBlocksDelete
        },
        {
          icon: false,
          text: "Resize",
          classes:"tb-enlarge",
          onclick: function() {
            var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass").find(".tb-wrapper-tlb");
            if(thisRow.hasClass("tinyBlocksShrinkBlockClass")){
              thisRow.removeClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
            }
            else{
              thisRow.addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
            }
          }
        },
        // {
        //   icon: false,
        //   text: "Resize All",
        //   classes:"tb-resize-all",
        //   onclick: function() {
        //     var all = $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb");
        //     if(all.hasClass('tinyBlocksShrinkBlockClass')){
        //       all.removeClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
        //     }
        //     else{
        //       all.addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
        //     }
        //   }
        // },
        {
          icon: false,
          text: "Add/edit Title",
          classes:"tb-title-spacer",
          onclick: function() {
           var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass").find(".tb-wrapper-tlb");
            var thisTitle = $(".mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass").find(".tb-title");
            var rowAction = function(btn, text) {
              if(btn == "ok"){
                if(text){
                  // var text = text.replace(/\s/g, "-").replace(/'|\"/g, "");
                  var text = text.replace(/'|\"/g, "");
                  thisRow.attr("data-tb-title", text);
                  thisTitle.text(text);
                }
                else{
                  thisRow.removeAttr("data-tb-title");
                  thisTitle.text("");
                }
              }
            }
            Ext.MessageBox.prompt("Title","<span id=tb-alert-title>Special Characters are removed</span>",rowAction);
            $(".ext-mb-input").val(thisRow.attr("data-tb-title"));
          }
        },
        {
          icon: false,
          text: "Quick Insert",
          classes: "tb-block-shortcut",
          menu: tinyBlocksShortcut
        }
      ]
    }).renderTo(document.getElementById("tinyBlocksControlButtonsWrapper"));

    // $(document).on("mouseenter", ".tb-title", function(){
    //   $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
    // });
    $("#"+tinyBlocksMainWrapperId).on("click", ".tinyBlocksRowsWrapperClass .tb-select", function(){
      if(tinyBlocksClickReady){
        tinyBlocksMouseHoverTraffic = 0;
        var par = $(this).parents(".tinyBlocksRowTempHolderClass");
        if (par.hasClass("ui-selected")){
          par.removeClass("ui-selected");
        }
        else{
          par.addClass("ui-selected");
        }
      }
    });
    $("#"+tinyBlocksMainWrapperId).on("dblclick", ".tinyBlocksRowsWrapperClass .tb-select", function(){
      if(tinyBlocksClickReady){
        var par = $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowTempHolderClass");
        if (par.hasClass("ui-selected")){
          par.removeClass("ui-selected");
        }
        else{
          par.addClass("ui-selected");
        }
      }
    });
    $("#"+tinyBlocksMainWrapperId).on("click", ".tb-wrapper-tlb", function(){
      tinyBlocksMouseHoverTraffic = 0;
      var $this = $(this);
      $this.removeClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
      setTimeout(function(){
        $this.prev(".tb-spacer").removeClass(tinyBlocksNewBlockClass + " tinyBlocksNewBlockClass");
      }, 2500);
    });
    $("#"+tinyBlocksMainWrapperId).on("mouseenter click", ".tinyBlocksRowsWrapperClass .tinyBlocksRowTempHolderClass", function(){
      if(tinyBlocksMouseHoverTraffic == 0 && !$(".mce-tinyBlocksTools-menu:visible").length){
        $(".mce-tinyBlocksTools").prependTo($(this)).show();
        $(".tinyBlocksActive").removeClass("tinyBlocksActive");
        $(this).addClass("tinyBlocksActive");
        // $(".mce-widget.mce-tooltip").removeClass("hideTooltip");
      }
    });
    $("#"+tinyBlocksMainWrapperId).on("keyup mouseup mousedown mouseleave", ".tb-title", function(){
      var title = $(this).text().replace(/'|\"/g, "");
      var par = $(this).parents(".tinyBlocksRowTempHolderClass").find(".tb-wrapper-tlb");
      if(title){
        par.attr("data-tb-title", title);
      }
      else{
        par.removeAttr("data-tb-title");
      }
    });
    $("#"+tinyBlocksMainWrapperId).on("keyup",function(e){
      if(e.keyCode == 27){
        $("#"+tinyBlocksMainWrapperId + " [contenteditable]").blur();
        window.getSelection().removeAllRanges();
      }
    });
  }
  else{
    MODx.msg.alert("Alert!", "An important selector class or id was not supplied");
  }
}