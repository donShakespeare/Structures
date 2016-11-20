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
    for (i = 0, l = my_selects.length;   i < l; ++i) {
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

function tinyBlocksSave(trigger, opt){
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
      // result.find(".tb-wrapper-tlb").each(function(){
      //   $(this).removeClass("s-t").attr("class", "s-t " + $(this).attr("class"));
      // });
      var tinyClasses = tinyBlocksHiddenBlockClass + " " + tinyBlocksRowClass + " " + tinyBlocksNewBlockClass + " " + tinyBlocksShrinkBlockClass + " mceEditable";
      // result.find(".tinyBlocksRowTempHolderClass").find(".tinyBlocksRowTempHolderClass").contents().unwrap();
      result.find("textarea.tb-tiny-rc-sub").each(function(){
        var val;
        var parent = $(this).parents(".tb-wrapper-tlb");
        var parentSub = $(this).parents(".tb-tiny-rc");

        if(parentSub[0].nodeName == "PRE" || parentSub[0].nodeName == "CODE"){
          val = tinymce.html.Entities.encodeAllRaw($(this).val());
        }
        else{
          parent.attr("markdown", 1);
          val = $(this).val();
        }

        $(this).parent().html(val);
      });
      result.find(".tb-unwrap").each(function(){
        var tempClassNames = $(this).attr("class");
        var tempTitle = $(this).attr("data-tb-title");
        $(this).children(":first").addClass(tempClassNames).attr("data-tb-title", tempTitle).unwrap();
      });
      result.find(".tinyBlocksRowTempHolderClass").find(".tinyBlocksRowTempHolderClass").children().not("[class*=tb-tiny-]").remove();
      result.find(".tinyBlocksRowTempHolderClass .tinyBlocksRowTempHolderClass").contents().unwrap();
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
      result.find(".tb-tv").each(function(){
        var thisContent = $(this).html();
        var thisID = "tv" + $(this).data("tv-id");
        if($(".galleryXTYPE" + thisID).length){
          $(".galleryXTYPE" + thisID).attr("id", thisID); //galleryXTYPE not galleryXTYPEtv
          if($("input.galleryXTYPE" + thisID + "[type=hidden]").length){
            // Ext.get("galleryXTYPE" + thisID).set({id: thisID});
            Ext.get(thisID).set({value: thisContent, id: "galleryXTYPE" + thisID});
          }
          else{
            Ext.get(thisID).dom.value = thisContent; // set({value: ...})  will not work here - strange beans!!!
          }
          console.log(thisID + "...cause ExtJS 'dom' of null error to prevent MODX from resetting TV data");
        }
      }).remove();      
      result.find("[id^=mce_]").removeAttr('id');
      result.find(".tinyBlocksCE, [data-mce-bogus], .mce-shim, .coder").remove();
      result.find('*')
        .removeAttr("data-tb-rapid twprecodemanagerprecss contenteditable data-mce-href data-mce-selected data-mce-src data-mce-style")
        .removeClass(tinyClasses )
        .alterClass("tinyBlocks* mce-* tb-custom-*","");
      result.find('[class*="tb-tiny-"]')
        .removeAttr("spellcheck style width height contenteditable");
      result.find('[class=""]').removeAttr('class');
      var pure = result.find('.tb-tiny-pure');
      if(pure.length > 1){
        pure.not(":first").prepend("[[-"+tinyBlocksProjectNameUC+"]]");
      }
      if(pure.length){
        pure.contents().unwrap();
      }

      var resultContent = result.html().replace(/(?:&amp;gt;|&gt;)/g, ">");
      if(trigger == "update"){
        // for later
        document.getElementById(tinyBlocksMainWrapperId+"_HTML").value = resultContent;
        tinyBlocksThrobber(0);
      }
      else{
        tinyBlocksSaveUpdateCurrent = document.getElementById(tinyBlocksOriginalSourceId).value = resultContent; // cache and save to #ta for example
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
function tinyBlocksRestore(opt){
  tinyBlocksThrobber(1);
  tinyBlocksToolsMenu();
  function prepare(content){
    var tbRWC = $(".tinyBlocksRowsWrapperClass");
    tbRWC.html(content);
    tinyBlocksPrepareTLB(tbRWC.find(".tb-wrapper-tlb"));
    tinyBlocksPrepareAceBlock(tbRWC.find(".tb-tiny-rc"));
    tinyBlocksTinyMCE();
    tinyBlocksRawCode();
    tinyBlocksThrobber(0);
  }
  if(opt == "saved"){
    if(typeof tinyBlocksSaveUpdateCurrent == "undefined"){
      tinymce.get("tmpTempEditor").windowManager.alert("Nothing Saved Yet");
    }
    else{
      // tinyBlocksClearAll("temp");
      document.getElementById(tinyBlocksMainWrapperId+"_HTML").value = tinyBlocksSaveUpdateCurrent;
      prepare(tinyBlocksSaveUpdateCurrent);
      tinymce.get("tmpTempEditor").windowManager.alert("Restored Last Saved Content");
    }
  }
  else if(opt == "manually"){
    prepare(document.getElementById(tinyBlocksMainWrapperId+"_HTML").value);
    tinymce.get("tmpTempEditor").windowManager.alert("Restored From Textarea");
  }
  else{
    // tinyBlocksClearAll("temp");
    document.getElementById(tinyBlocksMainWrapperId+"_HTML").value = tinyBlocksOriginalContent;
    prepare(tinyBlocksOriginalContent);
    tinymce.get("tmpTempEditor").windowManager.alert("Restored Original Content");
  }
  tinyBlocksThrobber(0);
}
if(typeof autoFileBrowser == "undefined" || autoFileBrowser.name == "modxNativeBrowser"){
  autoFileBrowser = function(field_name, url, type, win, gallery) {
    $(".modx-browser").remove();
    var path;
    if(url){
      path = url.substring(0,url.lastIndexOf("/")+1); // use later
    }
    var w = MODx.load({
      xtype: "modx-browser",
      multiple: true, // true is troublesome
      openTo:  path || MODx.config.manager_url + "index.php?a=" + MODx.action.browser + "&source=" + MODx.config.default_media_source, //remove ExtJS and MODX direct code
      listeners: {
        "select": {
          fn:function(data) {
            if(gallery == "createGal"){
              tinymce.get("tinyJSONfield").windowManager.confirm("Use thumbnails in your \"thumb/\" folder for this Gallery View?", function(s){
                if(s){
                  rebuildGalleryFromMODX(data, ".modx-browser-thumb-wrap", "browser", "on");
                }
                else{
                  rebuildGalleryFromMODX(data, ".modx-browser-thumb-wrap", "browser", "off");
                }
              });
              // if(field_name){
              //   var folderUrl = data.fullRelativeUrl;
              //   if(win){
              //     win.document.getElementById(field_name).value = folderUrl.substring(0,folderUrl.lastIndexOf("/")+1);
              //   }
              //   else{
              //     document.getElementById(field_name).value = folderUrl.substring(0,folderUrl.lastIndexOf("/")+1);
              //   }
              // }
            }
            else if(gallery == "addGalFiles"){
              var folderUrl = data.fullRelativeUrl;
              document.getElementById(field_name).value = folderUrl.substring(folderUrl.lastIndexOf("/")+1);
            }
            else{
              win.document.getElementById(field_name).value = data.fullRelativeUrl;
            }
            MODx.fireEvent("select",data);
        },scope:this}
      }
    });
    w.show();
  };
}
function tinyBlocksGallery(origin){
  if(typeof TinyJSONGallery == "undefined"){
     // tinymce.get("tmpTempEditor").windowManager.alert("Error! TinyJSONGallery is not loaded");
     return false;
  }
  if(origin == "begin"){
    exitedGalleryToUseElementTree = 0;
    tinyJSONGalleryTABtitle = tinyBlocksProjectName + " Gallery";
    $(document).on("mouseenter", ".modx-window, .tvJSONGalleries", function () {
      var extraTitleadd, chunkContentId;
      if($(this).hasClass("tvJSONGalleries")){
        if(exitedGalleryToUseElementTree == 1){
          $(".tvJSONGalleries").parent().addClass("tvChunkGalleries-parent");
        }
        extraTitleadd = " TV: "+$(this).parents(".modx-tv").find(".modx-tv-caption").text();
        chunkContentId = $(this).attr("id");
        $(this).on("dblclick",function(){
          if(chunkContentId && exitedGalleryToUseElementTree == 1 && !$("#tinyJSONGalleryWrapper").length){
            popGal(chunkContentId, tinyJSONGalleryTABtitle+extraTitleadd);
          }
        });
      }
      else{
        if(exitedGalleryToUseElementTree == 1){
          $(this).find("textarea[name=snippet]").parents(".modx-window").addClass("tvChunkGalleries-parent");
        }
        $(this).find("textarea[name=snippet]:visible").addClass("chunkJSONGalleries");
        chunkContentId = $(this).find("textarea[name=snippet]").attr("id");
        extraTitleadd = " Chunk: "+$(this).find(".x-window-header-text > span").text(); //code eats up header title
        // var extraTitleadd = " Chunk: "+$(this).find("input[name=name]").val();
        $(this).find(".chunkJSONGalleries").on("dblclick",function(){
          if(chunkContentId && exitedGalleryToUseElementTree == 1 && !$("#tinyJSONGalleryWrapper").length){
            popGal(chunkContentId, tinyJSONGalleryTABtitle+extraTitleadd);
          }
        });
      }
    });
  }
  else{
    if(origin == "on" || exitedGalleryToUseElementTree === 0){
      exitedGalleryToUseElementTree = 1;
      $("#modx-tv-tabs textarea:not(.modx-richtext, .tb-gallery-tv)").addClass("tvJSONGalleries").parent().addClass("tvChunkGalleries-parent");
      if(origin == "on" && typeof globalSONGalleries == "undefined"){
        tinymce.get("tmpTempEditor").windowManager.alert("Global Gallery ON: just dblclick chunks textarea");
        globalSONGalleries = 1;
      }
      else if(origin !== "on"){
        tinymce.get("tmpTempEditor").windowManager.alert("Global TV/Chunk Gallery ON");
        globalSONGalleries = 1;
      }
    }
    else {
      exitedGalleryToUseElementTree = 0;
      $(".tvJSONGalleries").removeClass("tvJSONGalleries");
      $(".tvChunkGalleries-parent").removeClass("tvChunkGalleries-parent");
      tinymce.get("tmpTempEditor").windowManager.alert("Global Gallery is now OFF");
    }
  }
}
function tinyBlocksGalleryGetChunk(id){
  tinyBlocksThrobber(1);
  MODx.Ajax.request({ // thanks to @rtripault
    url: MODx.config.connector_url,
    params: {
      action: 'element/chunk/get',
      id: id
    },
    listeners: {
      'success': {
        fn: function(r) {
          var w = MODx.load({
            xtype: 'modx-window-quick-update-chunk',
            record: r.object,
            listeners: {
              'success': {
                fn: function(r) {
                  // console.log('update succeeded with response', r);
                  // this.refreshNode(id);
                  // var newTitle = '<span dir="ltr">' + r.f.findField("name").getValue() + ' (' + w.record.id + ')</span>';
                  // w.setTitle(w.title.replace(/<span.*\/span>/, newTitle));
                },
                scope:this
              },
              'hide':{fn:function() {this.destroy();}}
            }
          });
          w.title += ': <span id="tjg-' +  w.record.id + '" dir="ltr">' + w.record.name + ' ('+ w.record.id + ')</span>';
          w.setValues(r.object);
          w.show();
          var extraTitleadd = " Chunk: "+ w.record.name + " ("+ w.record.id + ")";
          var cid = ($("#tjg-" +  w.record.id).parents(".modx-window").find("textarea[name=snippet]").attr("id"));
          tinyBlocksThrobber(0);
          popGal(cid, tinyJSONGalleryTABtitle+extraTitleadd);

        }
      },
      'failure': {
        fn: function(r) {
          // tinymce.get("tmpTempEditor").windowManager.alert("No data for Gallery");
          tinyBlocksThrobber(0);
        }
      }
    }
  });
}
function tinyBlocksDefaultGalleryInit(){
  if($(".galleryXTYPEtv"+tinyBlocksDefaultGallery).attr("id", "tv"+tinyBlocksDefaultGallery).length){
    popGal("tv"+tinyBlocksDefaultGallery, tinyBlocksProjectName + " Gallery TV");
  }
  else{
    tinymce.get("tmpTempEditor").windowManager.alert("Gallery TV " +tinyBlocksDefaultGallery + " is not currently visibly attached to this Resource");
  }
}
function tinyBlocksBlurAll(origin){
  $("#"+tinyBlocksMainWrapperId + " [contenteditable]").blur();
  $("input, textarea, [tabindex]").blur();
  window.getSelection().removeAllRanges();
  if(origin == "focus"){
    document.getElementById(tinyBlocksMainWrapperId).focus();
  }
}
function tinyBlocksGalleryTinyJSON(){
  function errorGal(message){
    tinymce.get("tmpTempEditor").windowManager.alert("Error! " + message, tinyBlocksTitle);
  }
  if($(".tinyBlocksActive").length){
    var chunkTVname = $(".tinyBlocksActive").find('.tb-title').text();
    // var chunkTVname = $(editor.getBody()).parent().find('.tb-title').text(); // for future Standalone TinyMCE plugin
    var tvChunkName = chunkTVname.replace(/[^a-zA-Z0-9\- ]/g, "").replace(/\s/g, '');
    if(typeof TinyJSONGallery !== "undefined"){
      if(tvChunkName){
        tvChunkName = tvChunkName.toLowerCase().substr(tvChunkName.lastIndexOf('-') + 1);
        if (tvChunkName.indexOf('tv') >= 0) {
          if (isNaN(tvChunkName) && !isNaN(tvChunkName.substr(tvChunkName.lastIndexOf('tv') + 2))) {
            var extraTitleadd = " TV: "+$("#"+tvChunkName).parents(".modx-tv").find(".modx-tv-caption").text();
            if($("#"+tvChunkName).length){
              popGal(tvChunkName, tinyJSONGalleryTABtitle+extraTitleadd);
            }
            else{
              errorGal("'"+tvChunkName+"'" + " is not currently visibly attached to this Resource");
            }
          }
          else{
            errorGal("Valid title: etc-TV34");
          }
        }
        else if (tvChunkName.indexOf('ch') >= 0) {
          tvChunkName = tvChunkName.substr(tvChunkName.lastIndexOf('ch') + 2);
          if (!isNaN(tvChunkName)) {
            // tinyBlocksGallery("on");
            tinyBlocksGalleryGetChunk(tvChunkName);
          }
          else{
            errorGal("Valid title: etc-CH34");
          }
        }
        else{
          errorGal("Valid title: CH23 or TV34 or 'Title-CH23' or 'Another Title-TV34'");
        }
      }
      else{
        errorGal("Valid title: CH23 or TV34 or 'Title-CH23' or 'Another Title-TV34'");
      }
    }
    else{
      tinymce.get("tmpTempEditor").windowManager.alert("Error! TinyJSONGallery is not loaded");
    }
  }
  else{
    tinymce.get("tmpTempEditor").windowManager.alert("Needs an active block: hovered");
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
    var tbRapidCallback = function(btn, text) { //use assignment instead of declaration
      var current, existingFilename;
      if(btn == "ok"){
        if (text) {
          current = text;
          formData.append('file', blobInfo.blob(), current);
          xhr.send(formData);
          tinymce.activeEditor.getParam("tbRapidImageSettings",{}).tempFilename = current;
          existingFilename = $(tinymce.activeEditor.getBody()).find("img").each(function(){
            if($(this).attr("src").indexOf('blob:') >= 0){
              $(this).attr("data-tb-rapid", current);
            }
          });
        }
        else if($(tinymce.activeEditor.getBody()).find("img[src*='blob:'][data-tb-rapid]").length){
          current = $(tinymce.activeEditor.getBody()).find("img[src*='blob:'][data-tb-rapid]").data("tb-rapid");
          formData.append('file', blobInfo.blob(), current);
          xhr.send(formData);
          tinymce.activeEditor.getParam("tbRapidImageSettings",{}).tempFilename = current;
        }
        else{
          if($(tinymce.activeEditor.getBody()).find("img[src*='blob:']").length){
            current = blobInfo.filename();
            formData.append('file', blobInfo.blob(), current);
            xhr.send(formData);
            tinymce.activeEditor.getParam("tbRapidImageSettings",{}).tempFilename = current;
            existingFilename = $(tinymce.activeEditor.getBody()).find("img").each(function(){
              if($(this).attr("src").indexOf('blob:') >= 0){
                $(this).attr("data-tb-rapid", current);
              }
            });
          }
        }
      }
      else{
        $(tinymce.activeEditor.getBody()).find("img[src*='blob:']").remove();
      }
    };

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
  }
}
function tinyBlocksToolsMenu(){
  $(".mce-tinyBlocksTools").prependTo("#tinyBlocksControlButtonsWrapper").hide();
  tinyBlocksMouseHoverTraffic = 0;
}
function tinyBlocksClearAll(mode, action){
  var tbMain = document.getElementById(tinyBlocksMainWrapperId);
  var tbTHC  = $(tbMain).find(".tinyBlocksRowTempHolderClass");
  var tbTHC_ui  = $(tbMain).find(".tinyBlocksRowTempHolderClass.ui-selected");
  if(tbTHC.length || mode){
    var selectedBlocks = "<b>Every</b> Block will be removed";
    if(tbTHC_ui.length){
      selectedBlocks = "<b>"+tbTHC_ui.length+"</b> Selected Block(s) will be removed";
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
    };
    if(mode == "temp"){
      rowAction("ok");
      tinyBlocksRestore(action); // remove all editors before attempting
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
  if($(".tinyBlocksHTMLwrapper:visible").length){
    tinyBlocksToolsMenu();
    tinyBlocksThrobber(1);
    var protectedMixture = "\\[\\[-"+tinyBlocksProjectNameUC+"]]";
    var regexp = new RegExp(protectedMixture, "gi");
    setTimeout(function(){
      var content = document.getElementById(tinyBlocksMainWrapperId+"_HTML").value;
      var tbMain = document.getElementById(tinyBlocksMainWrapperId);
      var tbRWC = $(tbMain).find(".tinyBlocksRowsWrapperClass");
      if(tinyBlocksPure){
        tinyBlocksThrobber(0);
        MODx.msg.alert("Pure Content!", "You are currently in '"+tinyBlocksPure+"' mode");
        return;
      }
      if(content.indexOf("[[-"+tinyBlocksProjectNameUC+"]]")>=0 || content.indexOf("[[-"+tinyBlocksProjectNameUC+"-SINGLE]]")>=0){
        var newContent = tinyBlocksImportWrapper.replace("[[+content]]", content.replace(regexp, tinyBlocksImportMarker ).replace("[[-"+tinyBlocksProjectNameUC+"-SINGLE]]", ""));
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
        Ext.MessageBox.show({
          title : "Import Manager",
          msg : "<p><b>Prepare raw UnStructured Content:</b></p><br><p> 2) Copy [[-"+tinyBlocksProjectNameUC+"]] to wherever you want sections</p><br><p> 3) OR Copy [[-"+tinyBlocksProjectNameUC+"-SINGLE]] to anywhere if you do not want sections</p>",
          width : 400,
          buttons : Ext.MessageBox.OK,
        });
      }
    }, 200);
  }
}
function tinyBlocksInsert(event, el, tv, id, name) {
  if(tv && $("[data-tv-id="+id+"]").length){
    var tvPindex = $("[data-tv-id="+id+"]").parents(".tinyBlocksRowTempHolderClass").index() + 1;
    tinymce.get("tmpTempEditor").windowManager.alert("This TV is already associated with structure #"+tvPindex);
    return;
  }
  if(tv && !$(".galleryXTYPEtv"+id).length){
    tinymce.get("tmpTempEditor").windowManager.alert("This TV is not currently visibly attached to this Resource");
    return;
  }
  var tinyblockssnippet;
  if(event == "shortcut"){
    tinyblockssnippet = el;
  }
  else{
    tinyblockssnippet = el.attr("data-tinyblocks-trigger");
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
  var activeRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parent(".tinyBlocksRowTempHolderClass");
  if(activeRow.hasClass("tb-nested-yes")){ //assumes that BEGIN already prepared the ground
    snippetTpl.removeClass("tb-nested-no").addClass("tb-nested-yes").prepend("<div class=tb-select title='Drag to Sort; dbl/Click to Toggle Select/All'></div>");
    if(tlb.hasClass("tb-tiny-rc") || tlb.find(".tb-tiny-rc").length){
      tlb.removeClass("tb-wrapper-tlb tb-unwrap tb-mini tinyBlocksShrinkBlockClass " + tinyBlocksShrinkBlockClass);
    }
    else if(tlb.find("[class^=tb-tiny-]").length){
      tlb.contents().unwrap();
    }
    else{
      tlb.removeClass("tb-wrapper-tlb tb-unwrap tb-mini tinyBlocksShrinkBlockClass " + tinyBlocksShrinkBlockClass);
    }
    snippetTpl.html(tlb);
    if(activeRow.hasClass("tb-nested-yes")){
      snippetTpl.prepend("<div class=tb-select title='To move use Esc, UP / DOWN arrows; dbl/Click to Toggle Select/All'></div>");
    }
  }
  if(tinyBlocksPure == "fc" || tinyBlocksPure == "md" || tinyBlocksPure == "rc"){
    tlb.alterClass("tb-tiny-*", "").addClass("tb-tiny-" + tinyBlocksPure + " tb-tiny-pure");
  }
  if(event == "click" || event == "shortcut"){
    if(!activeRow.length || tv){
      if(tv){
        var tvContent = $(".galleryXTYPEtv"+id).val();
        tlb.attr("data-tv-id", id).addClass("tb-tv").html(tvContent);
        snippetTpl.addClass("ui-selected").find(".tb-title").attr({"contenteditable": false, "title":"Remote temporary TV editor"}).html("[[*" + name + "]] &nbsp;&nbsp;&nbsp;&nbsp;TV");
      }
      $(snippetTpl).prependTo(".tinyBlocksRowsWrapperClass");
    }
    else{
      if(activeRow.hasClass("tb-nested-no")){
        activeRow.children(".tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
      }
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
function tinyBlocksQuickInsert(num, destination, name){
  if(name){
    var nItem = $("#blockSnippetBar").find("[data-tinyblocks-trigger="+name+"]");
    nItem.trigger("click");
  }
  else{
    num = num - 1;
    var item = $("#blockSnippetBar").find("[data-tinyblocks-trigger]:eq("+num+")");
    var itemNext = $("<div>").prepend($("#blockSnippetBar").find("[data-tinyblocks]:eq("+num+")").clone().alterClass("tb-*","").removeClass("tinyBlocksShrinkBlockClass "+tinyBlocksShrinkBlockClass).removeAttr('data-tinyblocks data-tb-title').addClass("tb-mini"));
    itemNext.find(".tb-mini").children().addClass("mceEditable");
    itemNext = itemNext.html();
    if(item.length){
      if(itemNext && destination == "mini" && tinymce.activeEditor.id !=="tmpTempEditor"){
        tinymce.activeEditor.focus();
        tinymce.activeEditor.insertContent(itemNext);
      }
      else if(!destination){
        item.trigger("click");
      }
    }
  }
}
function tinyBlocksPrepareTLB(el) {
  el.each(function(){
    var tempTLB = '';
    var tlbChildren = $(this).find("[class^=tb-tiny-]:not(.tb-tiny-rc)");
    if(tlbChildren.length){
      $(this).addClass("tb-nested-wrapper");
      tlbChildren.wrap("<div class='"+tinyBlocksRowTempHolderClass+" tinyBlocksRowTempHolderClass tb-nested-yes'></div>");
      tlbChildren.parent().prepend(
        $('<div>', {
          'class': 'tb-select tb-nested-yes',
          'title': 'To move use Esc, UP / DOWN arrows; dbl/Click to Toggle Select/All'
        })
      );
    }
    if($(this).hasClass('tb-unwrap')){
      var tempTitle = $(this).data("tb-title");
      var tempBlockID = $(this).data("tinyblocks");
      var tempClassNames = $.grep(this.className.split(" "), function(v, i){
        return v.indexOf('tb-') === 0;
      }).join(" ");
      $(this).alterClass("tb-*", "").removeAttr("data-tinyblocks");
      // $(this).alterClass("tb-*", "").removeAttr("data-tinyblocks data-tb-title");
      // tempTLB = "<div class='" + tempClassNames + " " + tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass' data-tinyblocks='"+tempBlockID+"' data-tb-title='"+tempTitle+"'></div>";
      tempTLB = "<div class='" + tempClassNames + "' data-tinyblocks='"+tempBlockID+"' data-tb-title='"+tempTitle+"'></div>";
    }
    else{
      if($("#"+tinyBlocksMainWrapperId + " .tb-wrapper-tlb").length > 1){
        // $(this).addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass"); //experimental - remove default behaviour
      }
    }
    var wrapper = "<div class='tinyBlocksRowTempHolderClass tb-nested-no "+tinyBlocksRowTempHolderClass+"'>" + tempTLB + "</div>";
    $(this).wrap(wrapper);
    var text;
    if($(this).attr('data-tb-title')){
      text = $(this).attr('data-tb-title').replace(/'|\"/g, "");
    }
    else{
      text = "";
    }
    $(this).parents(".tinyBlocksRowTempHolderClass").prepend(
    // .before(
      // $('<div>', {
      //   'class': 'tb-ui-drag-handle'
      // }),
      $('<div>', {
        'class': 'tb-select tb-nested-no',
        'title': 'Drag to Sort; dbl/Click to Toggle Select/All'
      }),
      $('<div class=tb-spacer><div class=tb-name title=Type></div><div class=tb-title title="Edit Title" contenteditable=true>'+text+'</div></div>')
    );
  });
}
function tinyBlocksPrepareAceBlock(el) {
  if(!tinyBlocksPure || tinyBlocksPure == "rc"){
    el.each(function(){
      var content, html;
      if($(this)[0].nodeName !== "PRE"){
        html = $(this).html().replace(/(?:&amp;gt;|&gt;)/g, ">");
        content = tinymce.html.Entities.encodeAllRaw(html);
      }
      else{
        html = $(this).html();
        content = tinymce.html.Entities.decode(html);
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
  var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parent(".tinyBlocksRowTempHolderClass");
  if(thisRow){
    if(!thisRow.find("[data-tv-id]").length){
      tinyBlocksToolsMenu();
      if(thisRow.hasClass("tb-nested-no")){
        $(".tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
      }
      var thisClone = thisRow.clone(true, true);
      var tlb = thisClone.find(".tb-wrapper-tlb");
      if(thisRow.hasClass("tb-nested-no")){
        tlb.prev(".tb-spacer").addClass(tinyBlocksNewBlockClass, tinyBlocksDuplicateBlockClass + " tinyBlocksNewBlockClass tinyBlocksDuplicateBlockClass");
      }
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
    else{
      tinymce.get("tmpTempEditor").windowManager.alert("Oops. This is a TV structure");
    }
  }
}
function tinyBlocksDelete(){
  var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parent(".tinyBlocksRowTempHolderClass");
  if(thisRow.length){
    var ind = thisRow.index()+1;
    var rowAction = function(btn) {
      if(btn == "ok"){
        tinyBlocksToolsMenu();
        thisRow.find(".mce-content-body").each(function() { $(this).tinymce().remove();});
        thisRow.fadeOut().delay(500).remove();
        tinyBlocksLoneOrNoBlock();
      }
    };
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
function tinyBlocksInsertTV(id, name){
  tinyBlocksMouseHoverTraffic = 1;
  var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parent(".tinyBlocksRowTempHolderClass");
  var thisRowTLB = thisRow.find(".tb-wrapper-tlb");
  var stIndex = thisRow.index() + 1;
  var tbTitle = thisRow.find(".tb-title");
  if($("[data-tv-id="+id+"]").length){ //prevent duplicates
    var tvPindex = $("[data-tv-id="+id+"]").parents(".tinyBlocksRowTempHolderClass").index() + 1;
    tinymce.get("tmpTempEditor").windowManager.alert("This TV is already associated with structure #"+tvPindex);
    return false;
  }
  else if(!thisRowTLB.length){
    tinymce.get("tmpTempEditor").windowManager.alert("Error! No active structure to bind to. Add or hover a structure");
    return false;
  }
  else if(!thisRowTLB.hasClass("mce-content-body")){
    tinymce.get("tmpTempEditor").windowManager.alert("Error! Supported editors: unnested RTE and MD");
    return false;
  }
  else{
    if(thisRow.length){
      tinymce.get("tmpTempEditor").windowManager.confirm("Permanently replace Structure #"+stIndex + " with this TV", function(s){
        if(s){
          $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parent(".tinyBlocksRowTempHolderClass").addClass("ui-selected");
          var tvContent = $(".galleryXTYPEtv"+id).val();
          thisRowTLB.tinymce().remove();
          thisRowTLB.attr("data-tv-id", id).addClass("tb-tv").html(tvContent);
          tinyBlocksTinyMCE();
          tbTitle.attr({"contenteditable": false, "title":"Remote temporary TV editor"}).html("[[*" + name + "]] &nbsp;&nbsp;&nbsp;&nbsp;TV");
        }
      });
    }
  }
}
function tinyBlocksShortcutJSON(){
  function prepareJSON(js){
    js = js.replace(/\n\s*$/, '').replace(/\n/g, ',');
    js = '[' + js + ']';
    js = tinymce.util.JSON.parse(js);
    return js;
  }
  tinyBlocksShortcut = '';
  tinyBlocksTemplateMenu = '';
  tinyBlocksTvMenu = '';
  $('#blockSnippetBar').find('[data-tinyblocks-trigger]').each(function (index) {
    index = index + 1;
    var title = $(this).attr('data-tinyblocks-trigger');
    var text = $(this).text().trim();
    var click = $(this).data('tinyblocks-trigger');
    tinyBlocksShortcut += '{text: "' + index + ". " + text + '", onclick: function(){tinyBlocksInsert("shortcut","' + click + '")}}\n';
    // var itemNext = $("<div>").prepend($('#blockSnippetBar').find('.tb-mini[data-tinyblocks='+title+']').clone().alterClass("tb-*","").removeClass("tinyBlocksShrinkBlockClass "+tinyBlocksShrinkBlockClass).removeAttr('data-tinyblocks data-tb-title').addClass("tb-mini"));
    // itemNext.find(".tb-mini").children().addClass("mceEditable");
    // itemNext = itemNext.html();
    // tinyBlocksTemplateMenu += '{title: "' + text + '", content: "' + JSON.stringify(itemNext).slice(1, -1) + '"}\n';
  });
  $('#blockSnippetBar').find('.tb-mini[data-tinyblocks]').each(function () {
    var title = $(this).attr('data-tinyblocks');
    var text = $('#blockSnippetBar').find('[data-tinyblocks-trigger='+title+']').text().trim();
    var itemNext = $("<div>").prepend($(this).clone().alterClass("tb-*","").removeClass("tinyBlocksShrinkBlockClass "+tinyBlocksShrinkBlockClass).removeAttr('data-tinyblocks data-tb-title').addClass("tb-mini"));
    itemNext.find(".tb-mini").children().addClass("mceEditable");
    itemNext = itemNext.html();
    tinyBlocksTemplateMenu += '{title: "' + text + '", content: "' + JSON.stringify(itemNext).slice(1, -1) + '"}\n';
  });


  tinyBlocksTVs = "gal***" + tinyBlocksDefaultGallery + "," + tinyBlocksTVs;
  tinyBlocksTVs = tinyBlocksTVs.split(",");
  var tvindex = 1;
  $.each(tinyBlocksTVs, function(i, v) {
    // v0 = tuscan***
    // v1 = 22
    // v2 = ***richtext"
    // tinyBlocksInsert("shortcut", "richtext", "tv", 23, "tuscan4")
    v = v.split("***");
    if($("#tv" + v[1]).length){
      // $("#tv" + v[1]).addClass("galleryXTYPEtv"+v[1]).attr("id", "galleryXTYPEtv"+v[1]); // hmmm!!!!
      $("#tv" + v[1]).addClass("galleryXTYPEtv"+v[1]);
      // var tvValue = JSON.stringify($("#tv" + v).val()).slice(1, -1);
      if(v[1] == tinyBlocksDefaultGallery){
        $("#tv"+tinyBlocksDefaultGallery + ":visible").addClass("tb-gallery-tv");
        $(".tb-gallery-tv").parent().addClass("tb-gallery-tv").on("click", tinyBlocksDefaultGalleryInit);
      }
      else{
        if(v[2]){
          // tinyBlocksTvMenu += '{text: "' + tvindex + ". " + v[0] + '", onclick: function(){tinyBlocksQuickInsert(null, null, \''+v[2]+'\', '+v[1]+')}}\n';
          tinyBlocksTvMenu += '{text: "' + tvindex + ". " + v[0] + '", onclick: function(){tinyBlocksInsert(\'shortcut\', \''+v[2]+'\', \'tv\', \''+v[1]+'\', \''+v[0]+'\')}}\n';
        }
        else{
          tinyBlocksTvMenu += '{text: "' + tvindex + ". " + v[0] + '*", onclick: function(){tinyBlocksInsertTV('+v[1]+', \''+v[0]+'\')}}\n';
        }
        tvindex++;
      }
    }
  });
  tinyBlocksTvMenu = prepareJSON(tinyBlocksTvMenu);
  tinyBlocksShortcut = prepareJSON(tinyBlocksShortcut);
  tinyBlocksTemplateMenu = prepareJSON(tinyBlocksTemplateMenu);
}
function tinyBlocksUpAndDown(direction){
  tinyBlocksMouseHoverTraffic = 1;
  var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parent(".tinyBlocksRowTempHolderClass");
  // var thisRow = $("#"+tinyBlocksMainWrapperId).find(".tinyBlocksRowTempHolderClass.tinyBlocksActive");
  if(thisRow.hasClass("tb-nested-no")){
    $("#"+tinyBlocksMainWrapperId).find(".ui-selected").removeClass("ui-selected");
    thisRow.addClass("ui-selected");
  }
  var prev = thisRow.prev();
  var next = thisRow.next();
  // tinyBlocksToolsMenu();
  if(thisRow.hasClass("tb-nested-no")){
    $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
  }
  if(direction == "ArrowUp" && prev.length){
    thisRow.insertBefore(prev);
  }
  else if(direction == "ArrowDown" && next.length){
    thisRow.insertAfter(next);
  }
}
function tinyBlocksRecordSequence() {
  Mousetrap.record(function(sequence) {
    var seq = sequence.join('').replace(/alt|\+/g, "");
    if($(tinymce.activeEditor.getBody()).hasClass("mce-edit-focus")){
      tinyBlocksQuickInsert(seq, "mini");
    }
    else{
      tinyBlocksQuickInsert(seq);
    }
  });
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
    Mousetrap.bindGlobal('option', function () {
      tinyBlocksRecordSequence();
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
      'a': function() {
        $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowTempHolderClass").addClass("ui-selected");
      },
      '0': tinyBlocksCountAll,
      'b': tinyBlocksDebug,
      'c': tinyBlocksDuplicate,
      'd': tinyBlocksDisable,
      'h': tinyBlocksGuide,
      'g t': tinyBlocksDefaultGalleryInit,
      'g 1': tinyBlocksGalleryTinyJSON,
      'g g': tinyBlocksGallery,
      'i m': tinyBlocksImport,
      'r t': function(){
        if(tinyBlocksRandomTip){
          tinymce.get("tmpTempEditor").windowManager.alert(tinyBlocksRandomTip);
        }
      },
      's': tinyBlocksShowHTML,
      't': tinyBlocksTitle,
      'del 1': tinyBlocksDelete,
      'del a': tinyBlocksClearAll,
      'home': function (e) {
        if($(".tinyBlocksDistraction").length){
          $(".tinyBlocksDistraction").removeClass("tinyBlocksDistraction");
          if (!$('#modx-leftbar:visible').length) {
            $(".x-layout-mini.x-layout-mini-west").trigger("click");
          }
        }
        else{
          $("#modx-header, #modx-action-buttons, #modx-content, #modx-action-buttons, #modx-resource-tabs, #modx-resource-tabs .x-tab-panel-header.x-tab-panel-header-noborder.x-unselectable.x-tab-panel-header-plain, #modx-resource-content > .x-panel-header").addClass("tinyBlocksDistraction");
          if ($('#modx-leftbar:visible').length) {
            $(".x-layout-mini.x-layout-mini-west").trigger("click");
          }
        }
      }
    });
  }
}

// *******
function tinyBlocksTempEditorManager(){
  if(!$("#tmpTempEditor").length){
    $("body").append("<div id=tmpTempEditor style=display:none;height:0;width:0;opacity:0;visibility:hidden></div>");
    tinymce.init({
      selector: "#tmpTempEditor",
      skin_url: tinyBlocksTinymceSkinUrl,
      inline:true,
      forced_root_block : "",
      force_br_newlines : false,
      force_p_newlines : false
    });
  }
}
function tinyBlocksLoneOrNoBlock(){
  var loneBlock = $(".tinyBlocksRowsWrapperClass .tinyBlocksRowTempHolderClass");
  if(loneBlock.length < 2){
    $(".tinyBlocksRowsWrapperClass").addClass("tb-lone-block");
    loneBlock.addClass("tb-lone-block"); //also hides (in CSS) the block menu - for cleaner look (make sure not to affect functionality)
    // document.styleSheets[0].addRule('.tinyBlocksRowsWrapperClass .tinyBlocksRowTempHolderClass.tb-lone-block:before','display:none;');
  }
  else{
    // loneBlock.removeClass("tb-lone-block");
    $(".tb-lone-block").removeClass("tb-lone-block");
  }
  // if (!$('.tinyBlocksRowsWrapperClass') [0].hasChildNodes()) {
  if (!$('.tinyBlocksRowsWrapperClass').children(".tinyBlocksRowTempHolderClass").length){
    if(tinyBlocksDefaultBlock){
      $('.tinyBlocksRowsWrapperClass').html(tinyBlocksDefaultBlock);
      tinyBlocksPrepareTLB($(".tinyBlocksRowsWrapperClass .tb-wrapper-tlb"));
      tinyBlocksPrepareAceBlock($(".tinyBlocksRowsWrapperClass .tb-tiny-rc"));
      if($(".mce-tinyBlocksTools").length){
        tinyBlocksTinyMCE();
        tinyBlocksRawCode();
      }
      tinyBlocksLoneOrNoBlock();
    }
    else{
      $('.tinyBlocksRowsWrapperClass').html(tinyBlocksHelp);
    }
  }
  else{
    if(!tinyBlocksDefaultBlock){
      $('.tinyBlocksRowsWrapperClass .tb-guide').remove();
    }
  }

}
function tinyBlocksTitle() {
  var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass").find(".tb-wrapper-tlb");
  var thisTitle = $(".mce-tinyBlocksTools").parents(".tinyBlocksRowTempHolderClass").find(".tb-title");
  if(!thisRow.data("tv-id")){
    var rowAction = function(btn, text) {
      if(btn == "ok"){
        if(text){
          // var text = text.replace(/\s/g, "-").replace(/'|\"/g, "");
          text = text.replace(/'|\"/g, "");
          thisRow.attr("data-tb-title", text);
          thisTitle.text(text);
        }
        else{
          thisRow.removeAttr("data-tb-title");
          thisTitle.text("");
        }
      }
    };
    Ext.MessageBox.prompt("Title","<span id=tb-alert-title>Special weird Characters are removed</span>",rowAction);
    $(".ext-mb-input").val(thisRow.attr("data-tb-title"));
  }
  else{
    tinymce.get("tmpTempEditor").windowManager.alert("Oops. This is a TV structure");
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
  if(power === 0){
    setTimeout(function(){
      $("#tinyBlocksThrobber").remove();
    }, delay);
  }
  else if(power == 1){
    $("#tinyBlocksThrobber").remove();
    $("#" + tinyBlocksMainWrapperId).prepend('<div id="tinyBlocksThrobber"></div>');
  }
}
function tinyBlocksDebug(){
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
function tinyBlocksDisable(){
  var rowAction = function(btn){
    if(btn == "ok"){
      location.href = tinyBlocksThisPageUrl+"&"+tinyBlocksProjectName.toLowerCase()+"=disabled";
    }
  };
  Ext.MessageBox.show({
    title : "Disable " + tinyBlocksProjectName,
    msg : "This Page is about to Refresh",
    width : 280,
    buttons : Ext.MessageBox.OKCANCEL,
    fn : rowAction,
    icon : Ext.MessageBox.WARNING
  });
}
function tinyBlocksShowHTML() {
  var tbMain = document.getElementById(tinyBlocksMainWrapperId+"_HTML");
  var tbMainS = $(tbMain).parent();
  if($(tbMainS).is(":hidden")){
    $(tbMainS).fadeIn();
    document.getElementById(tinyBlocksMainWrapperId).scrollIntoView();
  }
  else{
    $(tbMainS).fadeOut();
    tinyBlocksBlurAll();
  }
}
function tinyBlocksCountAll(){
  var tbMain = document.getElementById(tinyBlocksMainWrapperId);
  var tbTHC  = $(tbMain).find(".tinyBlocksRowTempHolderClass");
  var tbTHClength = tbTHC.length;
  if(tbTHClength){
    tinymce.get("tmpTempEditor").windowManager.alert("Total number of "+tinyBlocksProjectName+": "+tbTHClength+"");
  }
}
// *******

//begin
function tinyBlocks(sourceFeed, originalSourceId, rowClass, rowTempHolderClass, rowsWrapperClass, newBlockClass, hiddenBlockClass, duplicateBlockClass, shrinkClass, saveButtonTpl, importWrapper, importMarker, defaultBlock, defaultGallery, tvs, thisPageUrl, tinymceSkinUrl, pure, help, randomTip, projectName) {
  if(typeof tinyBlocksItems == "undefined"){
    tinyBlocksItems = {};
  }
  //two ways to initiate TinyBlocks
  tinyBlocksSourceFeed = tinyBlocksItems.sourceFeed || sourceFeed;
  tinyBlocksOriginalSourceId = tinyBlocksItems.originalSourceId || originalSourceId;
  tinyBlocksMainWrapperId = "tinyBlocksMainWrapperId_" + tinyBlocksOriginalSourceId;
  tinyBlocksRowClass = tinyBlocksItems.rowClass || rowClass;
  tinyBlocksRowTempHolderClass = tinyBlocksItems.rowTempHolderClass || rowTempHolderClass;
  tinyBlocksRowsWrapperClass = tinyBlocksItems.rowsWrapperClass || rowsWrapperClass;
  tinyBlocksNewBlockClass = tinyBlocksItems.newBlockClass || newBlockClass;
  tinyBlocksHiddenBlockClass = tinyBlocksItems.hiddenBlockClass || hiddenBlockClass;
  tinyBlocksDuplicateBlockClass = tinyBlocksItems.duplicateBlockClass || duplicateBlockClass;
  tinyBlocksShrinkBlockClass = tinyBlocksItems.shrinkClass || shrinkClass;
  tinyBlocksSaveButtonTpl = tinyBlocksItems.saveButtonTpl || saveButtonTpl;
  tinyBlocksImportWrapper = tinyBlocksItems.importWrapper || importWrapper;
  tinyBlocksImportMarker = tinyBlocksItems.importMarker || importMarker;
  tinyBlocksDefaultBlock = tinyBlocksItems.defaultBlock || defaultBlock || "";
  tinyBlocksTVs = tinyBlocksItems.TVs || tvs || "";
  tinyBlocksDefaultGallery = tinyBlocksItems.defaultGallery || defaultGallery || "";
  tinyBlocksPure = tinyBlocksItems.pure || pure;
  tinyBlocksHelp = tinyBlocksItems.help || help;
  tinyBlocksThisPageUrl = tinyBlocksItems.thisPageUrl || thisPageUrl;
  tinyBlocksTinymceSkinUrl = tinyBlocksItems.tinymceSkinUrl || tinymceSkinUrl;
  tinyBlocksRandomTip = tinyBlocksItems.randomTip || randomTip || "";
  tinyBlocksProjectName = tinyBlocksItems.projectName || projectName;
  tinyBlocksProjectNameUC = tinyBlocksProjectName.toUpperCase();
  tinyBlocksProjectNameLC = tinyBlocksProjectName.toLowerCase();
  tinyBlocksOriginalContent = document.getElementById("ta").value;

  if(tinyBlocksOriginalSourceId && tinyBlocksMainWrapperId && tinyBlocksRowClass && tinyBlocksRowTempHolderClass && tinyBlocksRowsWrapperClass){
    tinyBlocksThrobber(1);

    $("."+tinyBlocksRowsWrapperClass).addClass("tinyBlocksRowsWrapperClass").parents(".x-panel-body.main-wrapper").addClass("tb-modx-main-wrapper").css("width", function(i){return $(this).width() + 30;});

    $("<div id=tinyBlocksControlButtonsWrapper></div><div id=tinyBlocksBubbleBar></div>").prependTo("body");

    tinyBlocksTempEditorManager();

    $("#" + tinyBlocksMainWrapperId).prepend("<div class='tinyBlocksHTMLwrapper' style=display:none><textarea id='"+tinyBlocksMainWrapperId+"_HTML' class='tinyBlocksHTML'></textarea><div id='"+tinyBlocksMainWrapperId+"_HTML_btn' class='tinyBlocksHTMLbtn'></div></div>");
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
      type: "button",
      text: "HTML",
      style: "margin-right:1em",
      onclick: function(){
        tinyBlocksSave("update");
      }
    }).renderTo(document.getElementById(tinyBlocksMainWrapperId+"_HTML_btn"));
    tinymce.ui.Factory.create({
      type: "menubutton",
      text: "Restore ",
      style: "margin-right:1em",
      classes:"tinyBlocksHTMLTools",
      menu: [{
        text: "Original Content",
        onclick: function(){
          // tinyBlocksRestore();
          tinyBlocksClearAll("temp", null);
        }
      }, {
        text: "Last Saved Content",
        onclick: function(){
          tinyBlocksClearAll("temp", "saved");
          // tinyBlocksRestore("saved");
        }
      }, {
        text: "Manually from Textarea",
        onclick: function(){
          tinyBlocksClearAll("temp", "manually");
          // tinyBlocksRestore("saved");
        }
      }]
    }).renderTo(document.getElementById(tinyBlocksMainWrapperId+"_HTML_btn"));
    tinymce.ui.Factory.create({
      type: "button",
      text:"Import (i + m) ",
      classes:"tinyBlocksHTMLTools",
      onclick: tinyBlocksImport,
      // onPostRender:function(){ //taken over by tempEditor
      //   tinymce.DOM.loadCSS(tinyBlocksTinymceSkinUrl+'/skin.min.css'); //dubious
      // },
    }).renderTo(document.getElementById(tinyBlocksMainWrapperId+"_HTML_btn"));
    if($("#tinyBlocksTVButtonHolder").length && tinyBlocksTvMenu.length){
      tinymce.ui.Factory.create({
        type: "menubutton",
        text: "TVs",
        classes: "tinyBlocksButton",
        autohide:true,
        menu: tinyBlocksTvMenu
      }).renderTo(document.getElementById("tinyBlocksTVButtonHolder"));
    }
    if($("#tinyBlocksButtonHolder").length){
      tinymce.ui.Factory.create({
        type: "menubutton",
        // text: tinyBlocksProjectName.substring(0,2),
        text: tinyBlocksProjectName,
        classes: "tinyBlocksButton",
        icon: "table",
        tooltip: "Content Manager",
        hidden:true,
        autohide:true,
        onPostRender: function(){
          if(tinyBlocksRandomTip){
            $("#tb-random-tip").text(tinyBlocksRandomTip).delay(1400).fadeIn("slow");
          }
          $("#tinyBlocksButtonHolder, .mce-tinyBlocksButton").delay(1400).fadeIn("slow");
        },
        menu:[
          {
            text: "Gallery Manager",
            classes:"tb-gallery",
            menu: [
            {
              text: "Main Gallery For this Document (g + t)",
              classes:"tb-tv-gallery",
              onclick: tinyBlocksDefaultGalleryInit
            },
            {
              text: "Gallery for Current Row/Block (g + 1)",
              classes:"tb-o-gallery",
              onclick: tinyBlocksGalleryTinyJSON,
            },
            {
              text: "Toggle Global Gallery (g + g)",
              classes:"tb-gallery",
              onclick: tinyBlocksGallery,
            },
            ]
          },
          {
            text: "Delete All Rows (del + a)",
            onclick: tinyBlocksClearAll
          },
          {
            text: "Quick Insert (1 - 9)",
            menu: tinyBlocksShortcut,
            classes: "quickInsert",
            onPostRender: function(){
              if(!tinyBlocksShortcut.length){
                $(".mce-quickInsert").remove();
              }
            }
          },
          {
            text: "Template Variables",
            classes: "tb-block-shortcut attachTv",
            menu: tinyBlocksTvMenu,
            onPostRender: function(){
              if(!tinyBlocksTvMenu.length){
                $(".mce-attachTv").remove();
              }
            }
          },
          {
            text: "Restore / Import ...",
            menu: [ {
              text: "Restore / Import (s)",
              onclick: tinyBlocksShowHTML
            },
            {
              text: "Debug Info (b)",
              classes:"debug",
              tooltip : "appears in "+tinyBlocksProjectName+" sidebar",
              onclick: tinyBlocksDebug
            },
            {
              text: "Disable " + tinyBlocksProjectName + " (d)",
              classes:"disable",
              onclick: tinyBlocksDisable
            },{
              text: "About",
              onclick: function(){
                tinymce.get("tmpTempEditor").windowManager.alert(tinyBlocksProjectName + " 3.0.1-beta1; tinyBlocks.js; by donShakespeare 2016");
              }
            }]
          },{
            text: "Help (h)",
            onclick: tinyBlocksGuide
          }]
      }).renderTo(document.getElementById("tinyBlocksButtonHolder"));
    }
    tinymce.ui.Factory.create({
      type: "menubutton",
      hidden: true,
      // icon:"fullpage",
      classes:"tinyBlocksTools",
      onPostRender: function(){
        tinyBlocksTinyMCE();
        tinyBlocksRawCode();
        tinyBlocksThrobber(0);
        tinyBlocksGallery("begin");
        setTimeout(function(){
          tinyBlocksBlurAll();
        },500);
        // $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowsWrapperClass, .tb-nested-wrapper") // it i spointles, inconvenient and cumbersome to have drag n drop for nested blocks, seriously!
        $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowsWrapperClass")
        .sortable({
            handle: ".tb-select.tb-nested-no",
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
              visibleSelected  = $("#" + tinyBlocksMainWrapperId + " .ui-selected.tb-nested-no:visible").length;
              if(visibleSelected > 1){
                ui.item.siblings(".ui-selected").addClass("tinyBlocksEnRouteSibling");
                $(".tinyBlocksEnRouteSibling:not(.tb-ui-multiple-select)").hide().wrapAll("<div class='tinyBlocksTempUI' style='display:none' />");
                ui.item.addClass("tb-ui-multiple-select ui-selected");
              }
              else{
                ui.item.addClass("tb-ui-single-select");
              }
              // $(".mce-widget.mce-tooltip").addClass("hideTooltip");
              tinyBlocksMouseHoverTraffic = 1;
                // $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
              if(ui.item.hasClass("tb-nested-yes")){
                 ui.item.parent().find(".tinyBlocksRowTempHolderClass").find("[class^=tb-tiny-]").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
                 ui.item.parent().css({"height": ui.item.parent().outerHeight(true), "overflow":"hidden"});
              }
              else{
                ui.item.parent().find(".tinyBlocksRowTempHolderClass").find(".tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
              }
            },
            stop: function(event,ui){
              tinyBlocksClickReady = 1;
              tinyBlocksMouseHoverTraffic = 0;
              ui.item.parent().removeAttr("style");
              ui.item.removeAttr("style");
              $("body").removeClass('ui-drag');
              var valid = $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowTempHolderClass").length;
              var validcheck = $("#" + tinyBlocksMainWrapperId + " .tinyBlocksRowTempHolderClass.ui-selected").length;
              // if(!$(".ui-state-highlight").length && $(".tb-ui-multiple-select").length){
              //   $(".tinyBlocksTempUI").prependTo('.tinyBlocksRowsWrapperClass');
              //   $(".tinyBlocksTempUI").contents().unwrap();
              //   alert("abberation")
              // }
              // $(".tinyBlocksActive").parent().find(".tinyBlocksRowTempHolderClass").children("[class^=tb-tiny-]").removeClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
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
            revertDuration: 30,
            // revert: false,
            receive: function(event, ui) {
              tinyBlocksInsert("drag", $(ui.item));
            }
        })
        .css("position","relative")
        .selectable({
          // filter: ".tinyBlocksRowTempHolderClass, tb-nested-wrapper [class^=tb-tiny-]",
          filter: ".tinyBlocksRowTempHolderClass.tb-nested-no", // disable nested drag-to-select : user can still click to select each or delete parent block
          cancel: ".tb-guide,.tinyBlocksRowTempHolderClass > *, .tb-nested-yes", //covers external Inline Ace plugin
          // cancel: ".tb-guide,.tinyBlocksRowTempHolderClass.tb-nested-no > *:not(.tb-nested-wrapper)",
          // cancel: ".tb-wrapper-tlb, .tb-title-spacer, .tb-ui-drag-handle, .mce-tinyBlocksTools"
          start: function() {
            tinyBlocksBlurAll();
          }
        });

        $("[data-tinyblocks-trigger]")
        .draggable({
          connectToSortable: "#" + tinyBlocksMainWrapperId + " .tinyBlocksRowsWrapperClass",
          // helper: "clone",
          helper: function(e) {
            var original = $(e.target).hasClass("ui-draggable") ? $(e.target) : $(e.target).closest(".ui-draggable");
            original.addClass("tb-onRoute").parent().addClass("tb-onRoute");
            return original.clone().addClass('tb-ui-drag-helper').css({
              width: original.width()
            });
          },
          revert: "invalid",
          zIndex:99999,
          containment:"window",
          delay: 5,
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
            // $(ui.helper).addClass('tb-ui-drag-helper');
            $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
          },
          stop:function(event,ui){
            $("body, #blockSnippetBar").removeClass('ui-drag');
            $(".tb-onRoute").removeClass('tb-onRoute');
            // $(".tb-ui-drag-helper").hide(); //too quick
            tinyBlocksClickReady = 1;
          }
        });
        $("#blockSnippetBar, #blockSnippetBar [data-tinyblocks-trigger]").disableSelection();
      },
      menu:[
        {
          text: "Duplicate (c)",
          classes:"tb-duplicate",
          onclick: tinyBlocksDuplicate,
          onPostRender: function(){
            $(".mce-tb-duplicate").parent().addClass('mce-tinyBlocksTools-menu'); //double parents does not work
          }
        },
        {
          text: "Delete (del + 1)",
          classes:"tb-trash",
          onclick: tinyBlocksDelete
        },
        {
          text: "Resize (all: -/+)",
          classes:"tb-enlarge",
          onclick: function() {
            var thisRow = $("#"+tinyBlocksMainWrapperId + " .mce-tinyBlocksTools").parent(".tinyBlocksRowTempHolderClass").find(".tb-wrapper-tlb");
            if(thisRow.hasClass("tinyBlocksShrinkBlockClass")){
              thisRow.removeClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
            }
            else{
              thisRow.addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
            }
          }
        },
        {
          text: "Add/edit Title (t)",
          classes:"tb-title-spacer",
          onclick: tinyBlocksTitle
        },
        {
          text: "Gallery (g + 1)",
          classes: "tb-block-gallery",
          onclick: tinyBlocksGalleryTinyJSON
        },
        {
          text: "Quick Insert (1-9)",
          classes: "tb-block-shortcut quickInsert",
          menu: tinyBlocksShortcut,
          onPostRender: function(){
            if(!tinyBlocksShortcut.length){
              $(".mce-quickInsert").remove();
            }
          }
        },
        {
          text: "Template Variables",
          classes: "tb-block-shortcut attachTv",
          menu: tinyBlocksTvMenu,
          onPostRender: function(){
            if(!tinyBlocksTvMenu.length){
              $(".mce-attachTv").remove();
            }
          }
        }
      ]
    }).renderTo(document.getElementById("tinyBlocksControlButtonsWrapper"));

    // $(document).on("mouseenter", ".tb-title", function(){
    //   $("#" + tinyBlocksMainWrapperId + " .tb-wrapper-tlb").addClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
    // });
    $("#"+tinyBlocksMainWrapperId).on("click", ".tb-select", function(){
      if(tinyBlocksClickReady){
        tinyBlocksMouseHoverTraffic = 0;
        var par = $(this).parent(".tinyBlocksRowTempHolderClass");
        if (par.hasClass("ui-selected")){
          par.removeClass("ui-selected");
        }
        else{
          par.addClass("ui-selected");
        }
        tinyBlocksBlurAll();
      }
    });
    $("#"+tinyBlocksMainWrapperId).on("dblclick", ".tb-select", function(){
      if(tinyBlocksClickReady){
        var par = $(this).parent().parent().find(".tinyBlocksRowTempHolderClass");
        if (par.hasClass("ui-selected")){
          par.removeClass("ui-selected");
        }
        else{
          par.addClass("ui-selected");
        }
        tinyBlocksBlurAll();
      }
    });

    $("#"+tinyBlocksMainWrapperId).on("click", ".tb-wrapper-tlb, [class^=tb-tiny-]", function(){
      tinyBlocksMouseHoverTraffic = 0;
      var $this = $(this);
      $this.removeClass(tinyBlocksShrinkBlockClass + " tinyBlocksShrinkBlockClass");
      setTimeout(function(){
        $this.prev(".tb-spacer").removeClass(tinyBlocksNewBlockClass + " tinyBlocksNewBlockClass");
      }, 2500);
    });
    // $("#"+tinyBlocksMainWrapperId).on("mouseenter click", ".tinyBlocksRowsWrapperClass .tinyBlocksRowTempHolderClass:not(.tb-nested)", function(){
    $("#"+tinyBlocksMainWrapperId).on("mouseenter click", ".tinyBlocksRowTempHolderClass", function(){
      if(tinyBlocksMouseHoverTraffic === 0 && !$(".mce-tinyBlocksTools-menu:visible").length){ //prevent block menu from jumping around
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
    // $("#"+tinyBlocksMainWrapperId).on("keyup",function(e){
    $(document).on("keyup",function(e){
      if(e.keyCode == 27){
        tinyBlocksBlurAll("focus");
      }
    });
  }
  else{
    MODx.msg.alert("Alert!", "An important selector class or id was not supplied");
  }
}