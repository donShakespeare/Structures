/*!!
Awesome TinyJSONGallery for TinymceWrapper, Structures et al
http://www.leofec.com/modx-revolution/
-donshakespeare in the MODX forum
Copyright 2016

This MODX Extra would be impossible without
jQuery UI, colorbox.js, tinysort.js, fastLiveFilter.js and most importantly, the most powerful json2html.js
*/
TinyJSONGallery = [];
TinyJSONGallery.version = "2.0";
TinyJSONGallery.base_url = TinyJSONGalleryBase;
TinyJSONGallery.gallery_url = TinyJSONGalleryGallery;
TinyJSONGallery.tinymce_skin_url = TinyJSONGalleryGallerySkin;
TinyJSONGallery.default_tv = TinyJSONGalleryDefaultTV;

if (TinyJSONGallery.gallery_url.indexOf(TinyJSONGallery.base_url) >= 0 && TinyJSONGallery.base_url.length > 1) {
  TinyJSONGallery.gallery_rel_url = TinyJSONGallery.gallery_url.substr(TinyJSONGallery.gallery_url.lastIndexOf(TinyJSONGallery.base_url) + TinyJSONGallery.base_url.length);
} else if (TinyJSONGallery.base_url == "/") {
  TinyJSONGallery.gallery_rel_url = TinyJSONGallery.gallery_url.substr(1);
}
tinyJSONGalleryDirLocation = TinyJSONGallery.gallery_rel_url + "images/nature/&autoCreateThumb=0&justJSON=1&options=w=178,h=117,zc=t";
var scriptLoader = new tinymce.dom.ScriptLoader();

tinymce.DOM.loadCSS(TinyJSONGallery.gallery_url + "colorbox/colorbox.css," + TinyJSONGallery.gallery_url + "css/TinyJSONGallery.css,https://cdnjs.cloudflare.com/ajax/libs/jquery-tagsinput/1.3.6/jquery.tagsinput.min.css");

if (typeof json2html == "undefined") {
  scriptLoader.add(TinyJSONGallery.gallery_url + "js/json2html.js");
}

scriptLoader.add("https://cdnjs.cloudflare.com/ajax/libs/jquery.colorbox/1.6.4/jquery.colorbox-min.js");

if (typeof jQuery.ui == "undefined") {
  tinymce.DOM.loadCSS("https://code.jquery.com/ui/1.8.24/themes/smoothness/jquery-ui.css");
  scriptLoader.add("https://code.jquery.com/ui/1.11.4/jquery-ui.min.js");
}

scriptLoader.add("https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.3.6/tinysort.min.js");

scriptLoader.add("https://cdnjs.cloudflare.com/ajax/libs/jquery-tagsinput/1.3.6/jquery.tagsinput.min.js");

$(document).on("dblclick", "#mce-modal-block", gallOpenFileTree);
$(document).on("focus", ".mce-gal-add-images input:visible", function() {
  $(".temp-gal-add-file").removeClass("temp-gal-add-file");
  $(this).addClass("temp-gal-add-file");
});
$(document).on("dblclick", ".mce-gal-add-images input:visible", function() {
  autoFileBrowser(this.id, $(".mce-tinyJSONfolder").val(), "", "", "addGalFiles");
});

var galvalidExts = ["png", "gif", "jpg"];
$(document).on("mouseenter", "[ext\\:tree-node-id]", function() {
  var folderUrl = $(this).attr("ext:tree-node-id");
  var ext =  folderUrl.substr(folderUrl.length - 3);
  var filename =  folderUrl.substring(folderUrl.lastIndexOf("/")+1);
  if ($("#modx-file-tree:visible").length && $(".mce-tinyJSONfolder:visible").length && folderUrl.indexOf(".") > 1 && $(this).hasClass("x-tree-node-leaf") && folderUrl.indexOf("thumb/") < 1){
    var id = $(this).attr("id");
    var location = folderUrl.substring(0,folderUrl.lastIndexOf("/")+1);
    if($.inArray(ext, galvalidExts) > -1){
      if ($(".mce-gal-add-images:visible").length){
        $(".temp-gal-add-file").val(filename);
      }
      $(".mce-tinyJSONfolder").attr("data-node-id", id).val(location);
    }
  }
});

// fastLiveFilter forked and hammered by donshakespeare: Original idea by Anthony Bush @ http://anthonybush.com/projects/jquery_fast_live_filter/
jQuery.fn.fastLiveFilter = function(getAttr, list, options) {
  options = options || {};
  list = jQuery(list);
  var input = this;
  var timeout = options.timeout || 0;
  var callback = options.callback || function() {};
  var keyTimeout;
  var lis = list.children();
  var len = lis.length;
  var oldDisplay = len > 0 ? lis[0].style.display : "inline-block";
  callback(len);
  input.change(function() {
    var filter = input.val().toLowerCase();
    var li;
    var numShown = 0;
    for (var i = 0; i < len; i++) {
      li = lis[i];
      if (li.querySelector("a").getAttribute(getAttr).toLowerCase().indexOf(filter) >= 0) {
        if (li.style.display == "none") {
          li.style.display = oldDisplay;
          $(li).find("a").addClass("cboxElement").removeClass("fHidden");
        }
        numShown++;
      } else {
        if (li.style.display != "none") {
          li.style.display = "none";
          $(li).find("a").removeClass("cboxElement").addClass("fHidden");
        }
      }
    }
    callback(numShown);
    return false;
  }).keydown(function() {
    clearTimeout(keyTimeout);
    keyTimeout = setTimeout(function() {
      input.change();
    }, timeout);
  });
  return this;
};

function gallOpenFileTree() {
  if($(".mce-popGal").length && $("#mce-modal-block:visible").length){
    $("#mce-modal-block").fadeOut();
    if (!$('#modx-leftbar:visible').length) {
      $(".x-layout-mini.x-layout-mini-west").trigger("click");
    }
    var tabs = Ext.getCmp("modx-leftbar-tabpanel");
    var propertiesTab = tabs.find("id","modx-file-tree");
    tabs.setActiveTab(propertiesTab[0]);
  }
}

function toggleLiveEdit(editor) {
  if (galleryLiveEdit == 1) {
    galleryLiveEdit = 0;
    editor.windowManager.alert("OFF: JSON changes will NOT affect Gallery");
  } else {
    galleryLiveEdit = 1;
    editor.windowManager.alert("ON: JSON changes WILL affect Gallery immediately");
  }
}

function pasteSampleCode(editor) {
  editor.windowManager.confirm("Reset current JSON to sample code, from which you may Rebuild", function(s) {
    if (s) {
      tinymce.get("tinyJSONfield").setContent('[{"Location": "' + TinyJSONGallery.gallery_rel_url + 'images/nature/&autoCreateThumb=0&justJSON=1&options=w=178,h=117,zc=t"}]');
      galleryModified(1);
    }
  });
}

function toggleHelpInstructions() {
  if ($("#gallHelp:hidden").length) {
    $("#gallHelp").css("display", "block !important").fadeIn();
  } else {
    $("#gallHelp").css("display", "none !important").fadeOut();
  }
}

function rebuildFromCurrent(editor, textareaForJSON, autoCreateThumb) {
  // if(wizard){
  //     var chunkVal = tinymce.get("tinyJSONfield").getContent();
  //     chunkTransformer(chunkVal, textareaForJSON);
  //     runFilter("data-desc");
  // }
  // else{
    // editor.windowManager.confirm("About to alter Gallery data", function(s) {
      // if (s) {
        loadingThrobber(1);
        var chunkVal = tinymce.get("tinyJSONfield").getContent();
        chunkTransformer(chunkVal, textareaForJSON, "", autoCreateThumb);
        runFilter("data-desc");
      // }
    // });
  // }
}
/*
0 url = assets/components/tinymcewrapper/gallery/stockImages/nature/
1 auto = &autoCreateThumb=1
2 just = &justJSON=1
3 options = &options=w=178,h=117,zc=t
*/
function rebuildAddFiles(){
  tinymce.get("tmpTempEditor").windowManager.open({
    title: 'Add Images',
    classes: 'gal-add-images',
    onSubmit: rebuildGalleryAddFiles,
    body: [ {
        type: "container",
        html: "<div style='width:400px;font-size:90%!important;white-space: normal !important'>- dblclick overlay to access File Tree, then hover images of choice to fill focused field; hit tab to move quickly to next field<br><br>- dblclick input field to access File Browser, then select image to fill field</div>",
      }, 
      {
        type: "textbox",
        autofocus: true,
      }, {
        type: "textbox",
      }, {
        type: "textbox",
      }, {
        type: "textbox",
      }, {
        type: "textbox",
      }, {
        type: "textbox",
      }, {
        type: "textbox",
      }, {
        type: "textbox",
      }, {
        type: "textbox",
      }, {
        type: "textbox",
      } ]
    });
}
function rebuildLocation(content, quid) {
  var newChunk, location, splitted;
  if(!content){
    if(tinymce.get("tinyJSONfield")){
      newChunk = tinymce.get("tinyJSONfield").getContent();
    }
    location = tinyJSONGalleryDirLocation;
    splitted = location.split("&");
    if (newChunk && qcJSON(newChunk)) {
      var data = JSON.parse(newChunk, function(k, v) {
        if (k === "Location") {
          location = v.replace(/&amp;/g, "&");
        }
      });
    }
  }
  else{
    location = content;
    splitted = location.split("&");
  }
  if(quid == "url" ){
    location = splitted[0];
  }
  else if(quid == "thumb" ){
    if(rebuildLocation("", "auto") == "1"){
      location = "thumb/";
    }
    else{
      location = "";
    }
  }
  else if(quid == "auto" ){
    location = splitted[1].split("autoCreateThumb=");
    location = location[1];
  }
  else if(quid == "just" ){
    location = splitted[2].split("justJSON=");
    location = location[1];
  }
  else if(quid == "options" ){
    location = splitted[3].split("options=");
    location = location[1];
  }
  return location;
}
function rebuildFromMODxTree(url, nodeID){
 //  $("#"+nodeID).parent().parent("ul").find("li").find("> .x-tree-node-leaf").filter(function(){
 //   return $(this).attr("ext:tree-node-id").match(/.gif$|.png$|.jpg$/);
 // }).fadeOut();
  tinymce.get("tinyJSONfield").windowManager.confirm("Use thumbnails in your \"thumb/\" folder for this Gallery View?", function(s){
    var fileElements = $("#"+nodeID).parent().parent("ul").find("> li").find("> .x-tree-node-leaf:first-child").addClass("gal-ready-tree");
    if(s){
      rebuildGalleryFromMODX(url, ".gal-ready-tree", "tree", "on");
    }
    else{
      rebuildGalleryFromMODX(url, ".gal-ready-tree", "tree", "off");
    }
  });
}
function rebuildGalleryAddFiles(){
  var editor = tinymce.get("tinyJSONfield");
  var jsonSrc = "[";
  var comma = "";
  var src = MODx.config.base_url + $(".mce-tinyJSONfolder").val();
  var index = $("#list_to_filter li img").length || 0;
  $(".mce-gal-add-images input:visible").each(function(){
    var id = $(this).val();
    index++;
    if(id){
      jsonSrc += comma + '{"id":"' + id + '","title":"' + id + '","folder":"' + src +'","hidden":"0","desc":"' + id + '","index":"' + index + '","tag":"","lerror":"0"}';
      comma =",";
    }
  });
  jsonSrc += ']';
  var json1 = JSON.parse(editor.getContent());
  var json2 = JSON.parse(jsonSrc);
  var result = json1.concat(json2);
  editor.setContent(JSON.stringify(result));
  rebuildFromCurrent(editor, TinyJSONGallery.default_tv);
  galleryModified(1);
}
function rebuildGalleryFromMODX(data, fileElements, origin, autoCreateThumb){
  if(autoCreateThumb == "on"){
    fthumb = 1;
  }
  else{
    fthumb = 0;
  }
  var comma = "";
  var thumb = "";
  var relativeUrl, id;
  // var thumb = "thumb/";
  // var src = $("input.modx-browser-filepath").val();  // multiple instances destroy this method
  var editor = tinymce.get("tinyJSONfield");

  if(origin == "browser"){
    $(".mce-tinyJSONfolder").removeAttr("data-node-id");
    relativeUrl = data.fullRelativeUrl;
  }
  else{
    relativeUrl = data;
  }
  var src = MODx.config.base_url + relativeUrl;
  var folderUrl = relativeUrl;
  var index = 1;
  src = src.substring(0,src.lastIndexOf("/")+1);
  folderUrl = folderUrl.substring(0,folderUrl.lastIndexOf("/")+1);
  var jsonSrc = '[{"Location": "'+folderUrl+'&autoCreateThumb='+fthumb+'&justJSON=1&options=w=178,h=117,zc=t"},';
  $(".mce-tinyJSONfolder").val(folderUrl);
  // console.log("how many elementss  ... " + $(fileElements).length);
  $(fileElements).each(function(){
    if(origin == "browser"){
      id = this.id;
    }
    else{
      var title = $(this).attr("ext:tree-node-id");
      id = title.substring(title.lastIndexOf("/")+1);
    }
    jsonSrc += comma + '{"id":"' + id + '","title":"' + id + '","folder":"' + src +'","hidden":"0","desc":"' + id + '","index":"' + index + '","tag":"","lerror":"0"}';
  comma =",";
  index++;
  }).removeClass("gal-ready-tree");
  jsonSrc += "]";
  editor.setContent(jsonSrc);
  rebuildFromCurrent(editor, TinyJSONGallery.default_tv, autoCreateThumb); //removed wizard???
  galleryModified(1);
}
function rebuildFromServer(editor) {
  var newChunk = tinymce.get("tinyJSONfield").getContent();
  tinyJSONGalleryDirLocation = "";
  if (newChunk) {
    var data = JSON.parse(newChunk, function(k, v) {
      if (k === "Location") {
        tinyJSONGalleryDirLocation = v.replace(/&amp;/g, "&");
        $("#tinyJSONLocationSettings").html("<b>Your current location and setting:</b><br><i>" + tinyJSONGalleryDirLocation + "</i><br><br>");
      }
    });
  }
  if (tinyJSONGalleryDirLocation) {
    editor.windowManager.confirm("Rebuild, really?", function(s) {
      if (s) {
        loadingThrobber(1);
        editor.windowManager.open({
          title: "Data from Server",
          width: 410,
          height: 400,
          url: TinyJSONGallery.gallery_url + "php/TinyJSONGalleryConnector.php?path=" + tinyJSONGalleryDirLocation
        });
      }
    });
  } else {
    editor.windowManager.alert("Invalid or no JSON in code textarea");
    // $("#gallHelp").fadeIn();
  }
}

function addCommas(num) {
  num = String(num);
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(num)) {
    num = num.replace(rgx, "$1" + "," + "$2");
  }
  return num;
}

function tinyDesc(editor) {
  tinymce.init({
    selector: ".mce-newDesc",
    skin_url: TinyJSONGallery.tinymce_skin_url,
    menubar: false,
    plugins: "bubbleBar contextmenu code",
    toolbar: "code undo redo bold italic underline ",
    forced_root_block: "",
    contextmenu: "code undo redo bold italic underline ",
    setup: function(editor) {
      editor.on("change keyup", function() {
        $(".mce-srcC").parents("li").find("a").attr("data-desc", $(editor.getBody()).html());
        galleryModified(1);
      });
    }
  });
}

function nextPrevSubmit(el, clean) {
  el.attr({
    href: $(".mce-newLink").val(),
    "data-id": $(".mce-newId").val(),
    "data-src": $(".mce-newSrc").val(),
    "data-index": $(".mce-newIndex").val(),
    "data-title": $(".mce-newTitle").val(),
    "data-tag": $(".mce-newTag").val(),
    "data-desc": $(".mce-newDesc").val()
  }).children("img").attr("src", TinyJSONGalleryBase + rebuildLocation("", "url") + rebuildLocation("", "thumb") + $(".mce-newId").val()+"?c="+Math.random()).parents("li").find(".imageIndex").html($(".mce-newIndex").val()).parents("li").find(".twgTitle").html($(".mce-newTitle").val()).parents("li").find(".tagger").attr("data-tag", $(".mce-newTag").val()).html($(".mce-newTag").val());
  $("#tinyTIP img").attr("src", TinyJSONGalleryBase + rebuildLocation("", "url") + $(".mce-newId").val()+"?c="+Math.random());
  if (clean) {
    $(".allSRC").removeClass("allSRC");
    $(".thisSRC").removeClass("thisSRC");
  }
}

function myColorbox() {
  $("#list_to_filter li a").colorbox({
    rel: "li a",
    current: false,
    opacity: 0.8,
    transition: "none",
    reposition: true,
    speed: 100,
    scalePhotos: false,
    overlayClose: false,
    maxWidth: $(window).width() * 0.93,
    maxHeight: $(window).height() * 0.93,
    title: false,
    onOpen: function() {
      $("#tinyOverlay").fadeIn();
      cSet = 0;
      if ($("#tinyG").length) {} else {
        $("body").append('<div id="tinyG"><div id="tinyGinner"><span id="cindex" data-label="index #:" class="tinyCs"></span><span id="ctitle" data-label="title:" class="tinyCs"></span><span id="ctag" data-label="tag:" class="tinyCs"></span><div id="cdesc" data-label="desc:" class="tinyCs"></div></div></div>');
        $("#cboxOverlay").replaceWith('<div id="tinyOverlay"></div>');
        $("#tinyG").hide();
        setTimeout(function() {
          tinymce.init({
            selector: ".tinyCs",
            skin_url: TinyJSONGallery.tinymce_skin_url,
            inline: true,
            forced_root_block: "",
            force_br_newlines: true,
            force_p_newlines: false,
            menubar: false,
            toolbar: false,
            setup: function(editor) {
              editor.on("change", function() {
                galleryModified(1);
              });
              editor.on("keyup", function() {
                if (editor.id == "ctitle") {
                  $($this).attr("data-title", $("#" + editor.id).text().trim());
                  $($this).parent("li").find(".twgTitle").html($("#" + editor.id).text().trim());
                }
                if (editor.id == "ctag") {
                  $($this).attr("data-tag", $("#" + editor.id).text().trim());
                  $($this).parent("li").find(".tagger").attr("data-tag", $("#" + editor.id).text().trim()).html($("#" + editor.id).text().trim());
                }
                if (editor.id == "cindex") {
                  $($this).attr("data-index", $("#" + editor.id).text().trim());
                  $($this).parent("li").find(".imageIndex").html($("#" + editor.id).text().trim());
                }
                if (editor.id == "cdesc") {
                  $($this).attr("data-desc", $("#" + editor.id).text().trim());
                }
              });
            }
          });
        }, 700);
      }
      $("#tinyG").fadeIn();
      $("#colorbox").draggable({
        handle: "#cboxWrapper",
        cancel: "#cboxCurrent, #cboxTitle",
        stop: function() {
          cSet = 1;
          cLeft = $("#colorbox").css("left");
          cTop = $("#colorbox").css("top");
        }
      });
    },
    onCleanup: function() {
      $("#tinyG").fadeOut();
      $("#tinyOverlay").fadeOut();
      cSet = cLeft = cTop = null;
    },
    onComplete: function() {
      $("#tinyOverlay").on("click", function() {
        $("#tinyOverlay").fadeOut();
      });
      $("#colorbox").removeAttr("tabindex");
      if (cSet == 1) {
        $("#colorbox").css({
          top: cTop,
          left: cLeft
        });
      }
      if ($("#cboxError").length) {
        $($this).attr("data-lerror", 1).addClass("missingLarge");
      } else {
        $($this).attr("data-lerror", 0).removeClass("missingLarge");
      }
    },
    onLoad: function() {
      $this = this;
      $("#cindex").html($($this).attr("data-index"));
      $("#ctitle").html($($this).attr("data-title"));
      $("#ctag").html($($this).attr("data-tag"));
      $("#cdesc").html($($this).attr("data-desc"));
    }
  });
}

function chunkTransformer(chunkCode, textareaForJSON, fresh, autoCreateThumb) {
  var thumb;
  if(autoCreateThumb == "on"){
    autoCreateThumb = 1;
    thumb = "thumb/";
  }
  else if(autoCreateThumb == "off"){
    autoCreateThumb = 0;
    thumb = "";
  }
  else if(rebuildLocation("", "thumb") == "thumb/"){
    autoCreateThumb = 1;
    thumb = "thumb/";
  }
  else {
    autoCreateThumb = 0;
    thumb = "";
  }
  // var chunkCode = chunkCode;
  var transform = [ {
    tag: "li",
    "class": function(obj) {
      if (obj.hidden == 1) {
        return "galhidden";
      }
    },
    children: [ {
      tag: "a",
      href: "${folder}${id}",
      "class": function(obj) {
        if (obj.lerror == 1) {
          return "missingLarge";
        }
      },
      "data-id": "${id}",
      "data-title": "${title}",
      "data-hidden": "${hidden}",
      "data-src": "${folder}${id}",
      "data-desc": "${desc}",
      "data-index": "${index}",
      "data-tag": "${tag}",
      "data-terror": "",
      "data-lerror": "${lerror}",
      // "data-time": "${time}",
      "data-ext": function(obj) {
        return obj.id.split(".").pop().split(".").pop();
      },
      children: [ {
        tag: "img",
        'src': '${folder}' + thumb + '${id}?c='+Math.random(),
        // 'src': function(obj){
        //   var fileRelUrl =  obj.folder.substr(obj.folder.lastIndexOf(TinyJSONGallery.base_url) + TinyJSONGallery.base_url.length);
        //   return MODx.config.connectors_url + "system/phpthumb.php?src=" + fileRelUrl + obj.id + "&w=178&h=115";
        // },
        // src: "${src}?c=${time}",
        // "src": function(obj){
        //   if (obj.time) {
        //     return obj.src + "?c=" + obj.time;
        //   }
        //   else{
        //     return obj.src + "?c=" + Math.random();
        //   }
        // },
        onerror: function() {
          $(this).parent().attr("data-terror", 1).addClass("missingThumb");
        },
        onload: function() {
          $(this).parent().attr("data-terror", 0).removeClass("missingThumb");
        }
      } ]
    }, {
      tag: "span",
      "class": "imageIndex",
      html: "${index}"
    }, {
      tag: "p",
      "class": "twgTitle",
      html: "${title}"
    }, {
      tag: "p",
      "class": "tagger",
      "data-tag": "${tag}",
      html: "${tag}"
    } ]
  } ];
  if (chunkCode) {
    if (qcJSON(chunkCode)) {
      var rere = "&autoCreateThumb="+autoCreateThumb;
      var data = JSON.parse(chunkCode, function(k, v) {
        if (k === "Location") {
          //split and rebuild
          v = v.replace(/&amp;/g, "&").replace("&autoCreateThumb=1", rere).replace("&autoCreateThumb=0", rere);
jjj = v;
          // tinyJSONGalleryDirLocation = v || ""; // change
          tinyJSONGalleryDirLocation = v;
          $("#tinyJSONLocationSettings").html("<b>Your current location and setting:</b><br><i>" + tinyJSONGalleryDirLocation + "</i><br><br>");
          $(".mce-tinyJSONfolder").val(rebuildLocation("", "url"));
        }
        // console.log(v[0]);
        tinymce.get("tinyJSONfield").setContent(JSON.stringify(v));
        return v;
      });
      data.shift();
      $("#picSettings").hide().appendTo("#tinyJSONGalleryWrapper");
      $("#list_to_filter").empty().json2html(data, transform);
      myColorbox();
      mySorted();
      if (!$("#list_to_filter").children().length && fresh !== 1) {
        tinymce.get("tmpTempEditor").windowManager.alert("Insufficient Data to build Image Gallery");
      }
      loadingThrobber(0, 3e3);
    } else {
      tinymce.get("tmpTempEditor").windowManager.alert("Sorry, there is a problem with your JSON");
       $("#tinyJSONfieldWrapper").fadeIn();
    }
  } else {
    chunkCode = '[{"Location": "' + TinyJSONGallery.gallery_rel_url + 'images/nature/&autoCreateThumb=0&justJSON=1&options=w=178,h=117,zc=t"}]';
    tinyJSONGalleryDirLocation = TinyJSONGallery.gallery_rel_url + 'images/nature/&autoCreateThumb=0&justJSON=1&options=w=178,h=117,zc=t';
    $(".mce-tinyJSONfolder").val(rebuildLocation("", "url")); // now that tinyJSONGalleryDirLocation is defined
    setTimeout(function() { //dubious
      $("#" + textareaForJSON).val(chunkCode).change(); //no fadeIn
      // $("#"+textareaForJSON).val(chunkCode).change().fadeIn();
      tinymce.get("tinyJSONfield").setContent(chunkCode);
      // $("#gallHelp").fadeIn();
      tinymce.get("tmpTempEditor").windowManager.alert("Insufficient Data (empty) to build Gallery");
    }, 500);
  }
  if ($("#list_to_filter li img").length < 1 && $("#tinyJSONfield").length) {
    // $("#gallHelp").fadeIn();
    // $("#tinyJSONfield, #galleryContextmenuNotice").fadeIn();
  } else {
    // $("#gallHelp").fadeOut();
  }
  loadingThrobber(0, 500);
}

function galleryModified(state) {
  if (state === 0) {
    $(".mce-closeGal").removeClass("mce-modified");
  } else {
    $(".mce-closeGal").addClass("mce-modified");
  }
}

function updateChunk(modx, textareaForJSON, callback) {
  // tinymce.get("tmpTempEditor").windowManager.confirm("Syncing Image Data with this Visual Gallery", function(s) {
    // if (s) {
      if (typeof tinyJSONGalleryDirLocation == "undefined") {
        tinymce.get("tmpTempEditor").windowManager.alert("Your JSON's first line is invalid");
        loadingThrobber(0);
        return false;
      }
      var array = [ {
        Location: tinyJSONGalleryDirLocation
      } ];
      $("#list_to_filter li a").each(function() {
        var arrayItem = {
          id: $(this).attr("data-id"),
          title: $(this).attr("data-title"),
          folder: TinyJSONGalleryBase + rebuildLocation("", "url"),
          desc: $(this).attr("data-desc"),
          hidden: $(this).attr("data-hidden"),
          lerror: $(this).attr("data-lerror"),
          tag: $(this).attr("data-tag"),
          // time: $(this).attr("data-time"),
          index: $(this).attr("data-index")
        };
        array.push(arrayItem);
      });
      if (beautifyJSON == 1) {
        // $("#" + textareaForJSON).val(JSON.stringify(array, null, 4)).change();
        // tinymce.get("tinyJSONfield").setContent(JSON.stringify(array, null, 4));
        // galleryModified(0);
      } else {
        $(".galleryXTYPEtv"+TinyJSONGallery.default_tv).attr("id",textareaForJSON);
        if ($("input.galleryXTYPEtv"+TinyJSONGallery.default_tv+"[type=hidden]").length) { //for hidden TVS
          // $("#" + textareaForJSON).val(JSON.stringify(array)).removeAttr("id");
          Ext.get(textareaForJSON).set({value: JSON.stringify(array), id: "galleryXTYPEtv"+TinyJSONGallery.default_tv}); //only way so far to alter val of hidden TV: .dom.value
          console.log("cause ExtJS 'dom' of null error to prevent MODX from resetting TV Gallery data");
        }
        else{
          $("#" + textareaForJSON).val(JSON.stringify(array)).change().attr("id", "galleryXTYPEtv"+textareaForJSON);
        }
        tinymce.get("tinyJSONfield").setContent(JSON.stringify(array));
        galleryModified(0);
      }
      if (modx) {
        $("#modx-abtn-save button").trigger("click");
        setTimeout(function() {
          galleryModified(0);
        }, 2e3);
      } else {
        loadingThrobber(0);
        tinymce.get("tmpTempEditor").windowManager.alert("Image Data Updated");
        galleryModified(0);
      }
      if (callback == "closePopGal") {
        tjgClosePopGal();
      }
    // } else {
      // if (callback == "closePopGal") {
        // tjgClosePopGal();
      // }
      // loadingThrobber(0);
    // }
  // });
}

function saveChunk(modx, textareaForJSON, callback) {
  if ($("#list_to_filter li a:hidden").length) {
    var meHidden = $("#list_to_filter li a:hidden").length;
    tinymce.get("tmpTempEditor").windowManager.confirm("Filtered images (" + meHidden + ") will be marked as hidden, proceed?", function(s) {
      if (s) {
        $("#list_to_filter li a:hidden").each(function() {
          $(this).attr("data-hidden", 1);
          $(this).parent("li").addClass("galhidden");
        });
        updateChunk(modx, textareaForJSON, callback);
      }
      else{
        loadingThrobber(0);
      }
    });
  } else {
    updateChunk(modx, textareaForJSON, callback);
  }
}

function runFilter(attr) {
  $("#filter_input").val("").change();
  var numDisplayed = $(".num_displayed");
  $("#filter_input").fastLiveFilter(attr, "#list_to_filter", {
    callback: function(total) {
      numDisplayed.html(addCommas(total) + "<br>" + $("#list_to_filter li").length);
    }
  });
}

function mySorted() {
  $("#list_to_filter").sortable({
    handle: "a",
    placeholder: "ui-state-highlight",
    start: function(event, ui) {
      visibleLi = $("#list_to_filter li:visible").length;
      visibleSelected = $("#list_to_filter .ui-selected:visible").length;
      if (visibleSelected > 1) {
        ui.item.siblings(".ui-selected").addClass("galleryEnRouteSibling");
        $(".galleryEnRouteSibling:not(.gal-ui-multiple-select)").hide().wrapAll("<div class='galleryTempUI' style='display:none' />");
        ui.item.addClass("galleryEnRouteMaster gal-ui-multiple-select ui-selected");
      } else {
        ui.item.addClass("gal-ui-single-select");
      }
    },
    stop: function(event, ui) {
      if (!$(".galleryTempUI").find(".gal-ui-multiple-select").length && $(".gal-ui-multiple-select").length) {
        //normal
        $(".galleryTempUI").insertAfter(".gal-ui-multiple-select");
        $(".galleryTempUI").contents().unwrap();
      }
      if ($(".galleryTempUI").find(".gal-ui-multiple-select").length) {
        $(".galleryTempUI > .galleryRowTempHolderClass:not(.gal-ui-multiple-select)").wrapAll("<div class=galleryTempUItemp />");
        $(".galleryTempUItemp").insertAfter(".gal-ui-multiple-select");
        $(".galleryTempUItemp").contents().unwrap();
        $(".galleryTempUI").contents().unwrap();
      }
      $(".galleryEnRouteSibling").fadeIn().removeClass("galleryEnRouteSibling");
      $(".gal-ui-multiple-select, .gal-ui-single-select").removeClass("gal-ui-multiple-select gal-ui-single-select");
      ui.item.after(ui.item.find("li"));
      $(".galleryEnRouteSibling").fadeIn().removeClass("galleryEnRouteSibling");
      $(".galleryEnRouteMaster").removeClass("galleryEnRouteMaster");
    },
    update: function(event, ui) {
      galleryModified(1);
    }
  });
  $("#list_to_filter").selectable({
    filter: "li",
    cancel: "a, .twgTitlevent, #picSettings, .twgTitle",
    selecting: function(event, ui) {
      $("#picSettings").attr("id", "picSetting").hide();
      $(".ui-selectable-helper").addClass("tjg-ui-selectable-helper");
    },
    stop: function(event, ui) {
      $("#picSetting").attr("id", "picSettings");
    }
  });
}

function qcJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function tagClickReset() {
  $("#tagManager .tag span").on("click", function() {
    runFilter("data-tag");
    $("#filter_input").val($(this).text().trim()).change();
    $(".mce-ftag").parent().children().removeClass("mce-active");
    $(".mce-ftag").addClass("mce-active");
  });
}

function tagManager(editor) {
  if ($("#list_to_filter li a").length) {
    if ($("#tagManager").length) {
      $("#tagManager").fadeOut().remove();
    } else {
      //var x = $('#list_to_filter li[data-tag]');
      //var yyy = $.map(x, function (element) {
      //return element.getAttribute("data-tag");
      //}).toString();
      var getTags = "";
      $("#list_to_filter li a[data-tag]").each(function() {
        getTags += $(this).attr("data-tag") + ",";
      });
      var tagResult = getTags.split(",").filter(function(allItems, i, a) {
        return i == a.indexOf(allItems);
      }).join(",").replace(/,\s*$/, "");
      $("<div id='tagManager'></div").prependTo("#tinyJSONGalleryWrapper");
      tinymce.ui.Factory.create({
        type: "textbox",
        value: tagResult,
        size: 20,
        classes: "imageTag",
        button: false,
        onPostRender: function() {
          function onAddTag(tag) {
            var ctag = tag.replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "");
            var tagBg = $(".tag span").filter(function() {
              return $(this).html() === ctag + "&nbsp;&nbsp;";
            }).parent().css("background-color");
            if ($("#list_to_filter .ui-selected").length) {
              // var hasSelected = $("#list_to_filter .ui-selected").length;
              $("#list_to_filter .ui-selected, #list_to_filter .ui-selected a").attr("data-tag", ctag);
              $("#list_to_filter .ui-selected .tagger").css("background-color", tagBg).attr("data-tag", ctag).html(ctag).fadeIn();
              tagClickReset();
              runFilter("data-tag");
              $("#filter_input").val(ctag).change();
              $(".mce-ftag").parent().children().removeClass("mce-active");
              $(".mce-ftag").addClass("mce-active");
              $("#tagManager .tag span").each(function() {
                if ($(this).html() == tag + "&nbsp;&nbsp;") {
                  $(this).html(ctag + "&nbsp;&nbsp;");
                }
              });
              galleryModified(1);
            } else {
              $("#tagManager .tag span").each(function() {
                if ($(this).html() == tag + "&nbsp;&nbsp;") {
                  $(this).parent().remove();
                }
              });
              editor.windowManager.alert("No image selected");
            }
          }
          function onRemoveTag(tag) {
            var ctag = tag.replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "");
            if ($("#list_to_filter li a[data-tag='" + ctag + "']").length) {
              var hasTag = $("#list_to_filter li a[data-tag=" + ctag + "]").length;
              editor.windowManager.alert("Removed '" + tag + "' from " + hasTag + " image(s)");
              $("#list_to_filter li a[data-tag='" + ctag + "'], #list_to_filter a[data-tag='" + ctag + "']").attr("data-tag", "");
              $("#list_to_filter .tagger[data-tag='" + ctag + "']").html("");
              tagClickReset();
              runFilter("data-tag");
              $(".mce-tag").parent().children().removeClass("mce-active");
              $(".mce-tag").addClass("mce-active");
              galleryModified(1);
            }
          }
          $(function() {
            $(".mce-imageTag").tagsInput({
              onAddTag: onAddTag,
              onRemoveTag: onRemoveTag,
              interactive: true,
              width: "auto",
              removeWithBackspace: true
            });
            tagClickReset();
            $("#tagManager .tag span").each(function() {
              var spanTag = $(this);
              $(".tagger").filter(function() {
                return $(this).html() === spanTag.text().trim();
              }).css("background-color", spanTag.parent().css("background-color"));
              $(".tagger").fadeIn();
            });
          });
        }
      }).renderTo(document.getElementById("tagManager"));
    }
  }
}

function imageMenu(editor) {
  editor.windowManager.open({
    title: "Image attributes",
    classes: "imageMenu",
    // minWidth: 550,
    onPostRender: function() {
      $(".mce-imageMenu .mce-close").on("click", function(e) {
        e.preventDefault();
        $(".allSRC").removeClass("allSRC");
        $(".thisSRC").removeClass("thisSRC");
      });
      $("#list_to_filter li:visible").addClass("allSRC");
    },
    onSubmit: function() {
      galleryModified(1);
      var img = $(".mce-srcC").parents("li").find("a");
      nextPrevSubmit(img);
      editor.windowManager.alert("Attributes updated");
      return false;
    },
    body: [ {
      type: "textbox",
      label: "Location",
      disabled: true,
      classes: "newFolder",
      onPostRender: function() {
        $(".mce-newFolder").val(TinyJSONGalleryBase + rebuildLocation("", "url"));
      }
    }, {
      type: "textbox",
      label: "Id",
      tooltip: "Best left alone!!! image filename + ext",
      classes: "newId",
      onPostRender: function() {
        var index = $(".mce-srcC").parents("li").find("a").attr("data-id");
        $(".mce-newId").val(index);
      }
    }, {
      type: "container",
      html: "<div id=tinyTIP><img src='about:blank' /><p>All inputs but Description are saved when you hit enter. Description is saved automatically always. Prev and Next buttons save everything automatically and will always trigger modified status.</p></div>",
      onPostRender: function() {
        var id = $(".mce-srcC").parents("li").find("a").attr("data-id");
        $("#tinyTIP img").attr("src", TinyJSONGalleryBase + rebuildLocation("", "url") + rebuildLocation("", "thumb") + id +"?c="+Math.random());
      }
    }, {
      type: "textbox",
      label: "Index #",
      classes: "newIndex",
      onPostRender: function() {
        var index = $(".mce-srcC").parents("li").find("a").attr("data-index");
        $(".mce-newIndex").attr("type", "number").val(index);
      }
    }, {
      type: "textbox",
      label: "Tag",
      classes: "newTag",
      tooltip: "one word without special xters",
      onPostRender: function() {
        var tag = $(".mce-srcC").parents("li").find("a").attr("data-tag");
        $(".mce-newTag").css("width", 200).val(tag);
      }
    }, {
      type: "textbox",
      label: "Title",
      classes: "newTitle",
      onPostRender: function() {
        var name = $(".mce-srcC").parents("li").find("a").attr("data-title");
        $(".mce-newTitle").val(name);
      }
    }, {
      type: "textbox",
      // container troublesome with no space/br in editor
      label: "Description",
      multiline: true,
      classes: "newDesc",
      minHeight: 100,
      onPostRender: function() {
        var desc = $(".mce-srcC").parents("li").find("a").attr("data-desc");
        $(".mce-newDesc").val(desc);
      }
    }],
    buttons: [ 
    {
      text: "Previous",
      classes: "prevAttribute",
      tooltip: "Attributes will be saved",
      onclick: function() {
        nextPrevSubmit($(".thisSRC a"));
        if ($(".thisSRC").prev(".allSRC").length) {
          $(".thisSRC").removeClass("thisSRC").prevAll(".allSRC").eq(0).addClass("thisSRC");
          var prevSrc = $(".thisSRC a");
          $(".mce-newTitle").val(prevSrc.attr("data-title"));
          $(".mce-newId").val(prevSrc.attr("data-id"));
          $(".mce-newIndex").val(prevSrc.attr("data-index"));
          $(".mce-newTag").val(prevSrc.attr("data-tag"));
          $(".mce-newDesc").val(prevSrc.attr("data-desc"));
          $("#tinyTIP img").attr("src", TinyJSONGalleryBase + rebuildLocation("", "url") + rebuildLocation("", "thumb") + prevSrc.attr("data-id")+"?c="+Math.random());
          galleryModified(1);
        }
      },
      onPostRender: function(){
        if($(".mce-popGal #list_to_filter > li").length < 2){
          $(".mce-prevAttribute, .mce-nextAttribute").parent().parent().hide();
        }
        $('.mce-newDesc').on("change keyup", function() {
          $(".mce-srcC").parents("li").find("a").attr("data-desc", $(".mce-newDesc").val());
          galleryModified(1);
        });
      }
    }, {
      text: "Next",
      classes: "nextAttribute",
      tooltip: "Attributes will be saved",
      onPostRender: function() {
        $(".mce-srcC").parents("li").addClass("thisSRC");
      },
      onclick: function() {
        nextPrevSubmit($(".thisSRC a"));
        if ($(".thisSRC").next(".allSRC").length) {
          $(".thisSRC").removeClass("thisSRC").nextAll(".allSRC").eq(0).addClass("thisSRC");
          var nextSrc = $(".thisSRC a");
          $(".mce-newTitle").val(nextSrc.attr("data-title"));
          $(".mce-newId").val(nextSrc.attr("data-id"));
          $(".mce-newIndex").val(nextSrc.attr("data-index"));
          $(".mce-newTime").val(nextSrc.attr("data-time"));
          $(".mce-newTag").val(nextSrc.attr("data-tag"));
          $(".mce-newDesc").val(nextSrc.attr("data-desc"));
          $("#tinyTIP img").attr("src", TinyJSONGalleryBase + rebuildLocation("", "url") + rebuildLocation("", "thumb") + nextSrc.attr("data-id")+"?c="+Math.random());
          galleryModified(1);
        }
      }
    } ]
  });
}

function loadingThrobber(power, delay) {
  delay = delay ? delay : 0;
  if (power === 0) {
    setTimeout(function() {
      $("#loadingThrobber").remove();
    }, delay);
  } else if (power == 1) {
    $("#loadingThrobber").remove();
    $("body").append('<div id="loadingThrobber"></div>');
  }
}

function tinyLord(chunkValOriginal, textareaForJSON) {
  // var textareaForJSON = textareaForJSON;
  tinymce.init({
    name: "tinyFileImageGallery",
    selector: "#tinyFileImageGallery",
    skin_url: TinyJSONGallery.tinymce_skin_url,
    inline: true,
    forced_root_block: "",
    force_br_newlines: false,
    force_p_newlines: false,
    setup: function(editor) {
      editor.on("init", function() {
        $(document).on("mouseenter", "#list_to_filter li", function() {
          $("#picSettings").appendTo($(this).not(".ui-state-highlight")).show();
        });
        tinymce.ui.Factory.create({
          type: "button",
          classes: "moreAttr",
          tooltip: "Toggle menu",
          onPostRender: function() {
            $(".mce-moreAttr").html("<i class='mce-caret'></i>");
          },
          onclick: function() {
            if ($(".mce-moreAttrMenu:hidden").length) {
              $(".mce-moreAttrMenu").show();
              $(".mce-moreAttr").addClass("mce-active");
            } else {
              $(".mce-moreAttrMenu").hide();
              $(".mce-moreAttr").removeClass("mce-active");
            }
          }
        }).renderTo(document.getElementById("picSettings"));
        tinymce.ui.Factory.create({
          type: "menu",
          classes: "moreAttrMenu",
          hidden: false,
          onPostRender: function() {
            setTimeout(function(){
              $(".mce-moreAttrMenu").css("display", "block!important");
              $(".mce-moreAttrMenu").fadeIn();

            },300);
          },
          items: [ {
            tooltip: "Enlarge",
            icon: "fullscreen",
            classes: "zoomPic",
            onclick: function() {
              $(".mce-zoomPic").parents("li").find("a").trigger("click");
            }
          }, {
            tooltip: "Edit all properties",
            icon: "image",
            classes: "srcC",
            onclick: function() {
              imageMenu(editor);
            }
          }, {
            tooltip: "Edit Title(s)",
            icon: "backcolor",
            classes: "eTitles",
            onclick: function() {
              $(".mce-eTitles").parents("li").addClass("ui-selected");
              if ($("#list_to_filter .ui-selected").length) {
                tinymce.init({
                  selector: ".ui-selected .twgTitle",
                  skin_url: TinyJSONGallery.tinymce_skin_url,
                  inline: true,
                  menubar: false,
                  plugins: "contextmenu",
                  toolbar: false,
                  forced_root_block: "",
                  contextmenu: "undo redo",
                  setup: function(editor) {
                    editor.on("change keyup", function() {
                      $("#" + editor.id).parent("li").find("a").attr("data-title", $(editor.getBody()).html());
                      galleryModified(1);
                    });
                  }
                });
              } else {
                editor.windowManager.alert("No image was selected");
              }
              var countSelected2 = $("#list_to_filter .ui-selected").length;
              editor.windowManager.alert("Titles made editable: " + countSelected2);
            }
          }, {
            tooltip: "Hide Image(s)",
            icon: "preview",
            classes: "hidePic",
            onclick: function() {
              var hideMe = $(".mce-hidePic").parents("li");
              hideMe.addClass("ui-selected");
              var countSelectedH = $("#list_to_filter .ui-selected").length;
              if ($("#list_to_filter .ui-selected a").attr("data-hidden") == 1) {
                $("#list_to_filter .ui-selected a").attr("data-hidden", 0);
                $("#list_to_filter .ui-selected").removeClass("galhidden");
                if(countSelectedH > 1){
                  editor.windowManager.alert("Images unHidden: " + countSelectedH);
                }
                galleryModified(1);
              } else {
                $("#list_to_filter .ui-selected a").attr("data-hidden", 1);
                $("#list_to_filter .ui-selected").addClass("galhidden");
                if(countSelectedH > 1){
                  editor.windowManager.alert("Images hidden: " + countSelectedH);
                }
                galleryModified(1);
              }
            }
          }, {
            tooltip: "Delete Image(s)",
            icon: "unlink",
            classes: "delPic",
            onclick: function() {
              var delMe = $(".mce-delPic").parents("li");
              delMe.addClass("ui-selected");
              var countSelected = $("#list_to_filter .ui-selected").length;
              editor.windowManager.confirm("Remove " + countSelected + " permanently? (still on server)", function(s) {
                if (s) {
                  $("#picSettings").appendTo("#tinyJSONGalleryWrapper").hide();
                  $("#list_to_filter .ui-selected").remove();
                  runFilter("data-desc");
                  galleryModified(1);
                }
              });
            }
          } ]
        }).renderTo(document.getElementById("picSettings"));
        tinymce.ui.Factory.create({
          type: "button",
          text: "Advanced ",
          classes: "options gallery",
          icon: "fullpage",
          tooltip: "Dig into the Raw Art beneath your gallery",
          onclick: function() {
            if ($("#tinyJSONfield:hidden").length) {
              $("#tinyJSONfieldWrapper").fadeIn();
            } else {
              $("#tinyJSONfieldWrapper").fadeOut();
            }
          },
          onPostRender: function() {
            // if (typeof backendOrfrontendGallery !== "undefined") {
            //   new Ext.KeyMap(document.body, {
            //     key: "s",
            //     ctrl: true,
            //     fn: function(keycode, e) {
            //       e.stopEvent();
            //       if (exitedGalleryToUseElementTree === 0) {
            //         saveChunk("modx", textareaForJSON);
            //       }
            //     }
            //   });
            // }
            $("#galButtons").hide();
            setTimeout(function() {
              $("#galButtons").css("opacity", 1).hide().fadeIn();
            }, 500);
            tinymce.ui.Factory.create({
              type: "menubutton",
              text: "START",
              icon: "browse",
              onPostRender: function(){
                  $("#tinyJSONfolderWrapper").insertAfter(".mce-popGal .mce-window-head");
                setTimeout(function(){
                  $(".mce-popGal").height($(".mce-popGal").outerHeight(true)+$("#tinyJSONfolderWrapper").outerHeight(true));
                  $("#tinyJSONfolderWrapper").hide().delay(3000).show().css("opacity", 1);
                },500);
              },
              menu: [ {
                text: "Create From File Browser ...",
                tooltip: "SELECT any image to get folder",
                onclick: function(){
                  var src = $(".mce-tinyJSONfolder").val() || rebuildLocation("", "url");
                  var stat = $(".mce-tinyJSONfolder").attr("id");
                  autoFileBrowser(stat, src, "", "", "createGal");
                }
              }, {
                text: "Create From File Tree ...",
                onclick: function(){
                  if(!$(".mce-tinyJSONfolder").attr("data-node-id")){
                    gallOpenFileTree();
                    editor.windowManager.alert("First, Hover any image in File Tree, then try again");
                  }
                  var location = $(".mce-tinyJSONfolder").val();
                  var id = $(".mce-tinyJSONfolder").attr("data-node-id");
                  if(location.indexOf("/") >1 && id){
                    rebuildFromMODxTree(location, id);
                  }
                }
              }, {
                text: "Add to Existing Gallery ...",
                onclick: rebuildAddFiles
              }, {
                text: "Thumbnails",
                menu:[{
                  text:"Reload Gallery with thumbnails",
                  onclick: function(){
                    rebuildFromCurrent(editor, textareaForJSON, "on");
                    galleryModified(1);
                  }
                }, {
                  text:"Reload Gallery without thumbnails",
                  onclick: function(){
                    rebuildFromCurrent(editor, textareaForJSON, "off");
                    galleryModified(1);
                  }
                }, {
                  text:"Create thumbnails",
                  onclick: function(){
                    tinymce.get("tmpTempEditor").windowManager.open({
                      title: 'Create Thumbnails',
                      classes: 'gal-creat-thumb',
                      onSubmit: null,
                      body: [ {
                        type: "container",
                        html: "<div style='width:600px;font-size:90%!important;white-space: normal !important;text-align:ccenter;'>Images folder</div>",
                        }, {
                        type: "textbox",
                        tooltip: "Make sure your image files are not too large",
                        classes: "gal-thumb-main",
                        value: rebuildLocation("", "url"),
                        autofocus: true
                        }, {
                        type: "container",
                        html: "<div style='width:600px;font-size:90%!important;white-space: normal !important;text-align:ccenter;'><br><br>(optional) Thumb folder suffix</b></div>",
                        }, {
                        type: "textbox",
                        tooltip: "This Gallery View uses only thumbnails found in \"thumb/\" folder. But for your other purposes you may add a suffix \"400x300\" to create extra thumbnails in \"thumb400x300/\"",
                        classes: "gal-thumb-suff",
                        onPostRender: function(){
                          $(".mce-gal-thumb-suff").attr("placeholder", "e.g 200x100").css("width", "110px!important");
                        }
                        }, {
                        type: "container",
                        html: "<div style='width:600px;font-size:90%!important;white-space: normal !important;text-align:ccenter;'><br><br>(optional) Thumbnail settings: <a style=color:#89aaf5; href=https://github.com/modxcms/Resizer#options target=_blank>MODX Resizer</a></div>",
                        }, {
                        type: "textbox",
                        tooltip: "w(width), h(height): Comma-separated MODX Resizer options",
                        classes: "gal-thumb-options",
                        value: "w=178,h=117,zc=t",
                        }],
                        buttons:[{
                          text: "Create",
                          onclick: function(){
                            var dirLocation = $(".mce-gal-thumb-main").val()+"&autoCreateThumb=1&justJSON=0&doThumbs=1&thumbFldSuffix="+$(".mce-gal-thumb-suff").val()+"&options="+$(".mce-gal-thumb-options").val();
                            editor.windowManager.open({
                              title: "Thumbnails Creation ...",
                              width: 410,
                              height: 200,
                              url: TinyJSONGallery.gallery_url + "php/TinyJSONGalleryConnector.php?path=" + dirLocation
                            });
                          }
                        }]
                      });


                  }
                }]
              }, {
                text: "Save Visual Changes ",
                onclick: function() {
                  loadingThrobber(1);
                  saveChunk("", textareaForJSON);
                }
              }, {
                text: "More ...",
                menu: [ {
                  text: "Select All (visible items)",
                  icon: "table",
                  onclick: function() {
                    $("#list_to_filter .ui-selected").removeClass("ui-selected");
                    $("#list_to_filter li:visible").addClass("ui-selected");
                  }
                }, {
                  text: "Reindex according to position",
                  icon: "numlist",
                  onclick: function() {
                    editor.windowManager.confirm("Really? this will overwrite the initial index derived from your server", function(s) {
                      if (s) {
                        $("#list_to_filter li").each(function() {
                          $(this).find(".imageIndex").html($(this).index() + 1);
                          $(this).find("a").attr("data-index", $(this).index() + 1);
                          galleryModified(1);
                        });
                      }
                    });
                  }
                }, {
                  text: "Restore Gallery",
                  icon: "undo",
                  onclick: function() {
                    editor.windowManager.confirm("You'll lose any changes, proceed?", function(s) {
                      if (s) {
                        $("#" + textareaForJSON).val(chunkValOriginal).change();
                        tinymce.get("tinyJSONfield").setContent(chunkValOriginal);
                        chunkTransformer(chunkValOriginal, textareaForJSON);
                        runFilter("data-desc");
                        galleryModified(0);
                      }
                    });
                  }
                } ]
              }]
            }).renderTo(document.getElementById("tinyJSONfolderWrapper"));
            tinymce.ui.Factory.create({
              type: "textbox",
              style: "width:85%",
              tooltip: "This address will be used to generate and maintain your gallery",
              // autofocus: true,
              classes: "tinyJSONfolder",
              onPostRender: function(){
                $(".mce-tinyJSONfolder").on("keyup",function(event) {
                  if(event.keyCode == 13){
                    event.preventDefault();
                    return false;
                  }
                });
              },
              value: rebuildLocation("", "url"),
            }).renderTo(document.getElementById("tinyJSONfolderWrapper"));



            tinymce.ui.Factory.create({
              type: "button",
              text: "Tags",
              icon: "anchor",
              tooltip: "Toggle/Refresh Tags. Clear \"Live filter search\" to see all tags",
              classes: "tagger gallery",
              onclick: function() {
                tagManager(editor);
              }
            }).renderTo(document.getElementById("galButtons"));
            tinymce.ui.Factory.create({
              type: "button",
              text: " Filter",
              icon: "searchreplace",
              classes: "fastFilter gallery",
              onPostRender: function() {
                $(".mce-fastFilter").addClass("extraFilth").removeAttr("id");
                $(".extraFilth").html("<span class='num_displayed' title='Images displayed'></span><span id='filter_reset' title='reset search'>X</span><input id='filter_input' placeholder='Live filter search' value=''> ");
                runFilter("data-tag");
                $("#filter_reset").on("click", function() {
                  $("#filter_input").val("").change();
                });
              }
            }).renderTo(document.getElementById("galButtons"));
            tinymce.ui.Factory.create({
              type: "splitbutton",
              text: false,
              classes: "gallery splitMe",
              onPostRender: function() {
                $(".mce-splitMe button:first-child").hide();
                $(".mce-alt").parent().addClass("splitMeparent");
              },
              menu: [ {
                text: "Filter by Tag/Category",
                classes: "ftag",
                active: true,
                onclick: function() {
                  $(".mce-ftag").parent().children().removeClass("mce-active");
                  $(".mce-ftag").addClass("mce-active");
                  runFilter("data-tag");
                }
              }, {
                text: "Filter by Extension",
                classes: "ext",
                onclick: function() {
                  $(".mce-ext").parent().children().removeClass("mce-active");
                  $(".mce-ext").addClass("mce-active");
                  runFilter("data-ext");
                }
              }, {
                text: "Filter by Img Desc",
                classes: "desc",
                onclick: function() {
                  $(".mce-desc").parent().children().removeClass("mce-active");
                  $(".mce-desc").addClass("mce-active");
                  runFilter("data-desc");
                }
              }, {
                text: "Filter by Img Index",
                classes: "index",
                onclick: function() {
                  $(".mce-index").parent().children().removeClass("mce-active");
                  $(".mce-index").addClass("mce-active");
                  runFilter("data-index");
                }
              }, {
                text: "Filter by Img Title",
                classes: "gal-title",
                onclick: function() {
                  $(".mce-gal-title").parent().children().removeClass("mce-active");
                  $(".mce-gal-title").addClass("mce-active");
                  runFilter("data-title");
                }
              }, {
                text: "Filter by Hidden/Visible (1/0)",
                classes: "hidden",
                onclick: function() {
                  $(".mce-hidden").parent().children().removeClass("mce-active");
                  $(".mce-hidden").addClass("mce-active");
                  runFilter("data-hidden");
                  $("#filter_input").val(1).change();
                }
              }, {
                text: "Filter by Missing Thumb (1/0)",
                classes: "terror",
                onclick: function() {
                  $(".mce-terror").parent().children().removeClass("mce-active");
                  $(".mce-terror").addClass("mce-active");
                  runFilter("data-terror");
                  $("#filter_input").val(1).change();
                }
              }, {
                text: "Filter by Missing Image (1/0)",
                classes: "lerror",
                onclick: function() {
                  $(".mce-lerror").parent().children().removeClass("mce-active");
                  $(".mce-lerror").addClass("mce-active");
                  runFilter("data-lerror");
                  $("#filter_input").val(1).change();
                }
              } ]
            }).renderTo(document.getElementById("galButtons"));
            tinymce.ui.Factory.create({
              type: "menubutton",
              text: "Sort ",
              icon: "pagebreak",
              classes: "sort gallery",
              menu: [ {
                text: "Sort Order",
                classes: "sdir",
                menu: [ {
                  text: "Ascend",
                  active: true,
                  classes: "sasc",
                  onclick: function() {
                    $(".mce-sasc").parent().children().removeClass("mce-active");
                    $(".mce-sasc").addClass("mce-active");
                    sortDir = "asc";
                  }
                }, {
                  text: "Descend",
                  classes: "sdesc",
                  onclick: function() {
                    $(".mce-sdesc").parent().children().removeClass("mce-active");
                    $(".mce-sdesc").addClass("mce-active");
                    sortDir = "desc";
                  }
                }, {
                  text: "Random",
                  classes: "srand",
                  onclick: function() {
                    $(".mce-srand").parent().children().removeClass("mce-active");
                    $(".mce-srand").addClass("mce-active");
                    sortDir = "rand";
                  }
                } ]
              }, {
                text: "Sort by Img Desc",
                classes: "sdescr",
                onclick: function() {
                  $(".mce-sdescr").parent().children().removeClass("mce-active");
                  $(".mce-sdescr").addClass("mce-active");
                  tinysort("#list_to_filter>li", {
                    selector: "a:not([class=fHidden])",
                    attr: "data-desc",
                    order: sortDir
                  });
                  galleryModified(1);
                }
              }, {
                text: "Sort by Img Title",
                classes: "stitle",
                onclick: function() {
                  $(".mce-stitle").parent().children().removeClass("mce-active");
                  $(".mce-stitle").addClass("mce-active");
                  tinysort("#list_to_filter>li", {
                    selector: "a:not([class=fHidden])",
                    attr: "data-title",
                    order: sortDir
                  });
                  galleryModified(1);
                }
              }, {
                text: "Sort by Index #",
                classes: "sindex",
                active: true,
                onclick: function() {
                  $(".mce-sindex").parent().children().removeClass("mce-active");
                  $(".mce-sindex").addClass("mce-active");
                  tinysort("#list_to_filter>li", {
                    selector: "a:not([class=fHidden])",
                    attr: "data-index",
                    order: sortDir
                  });
                  galleryModified(1);
                }
              } ]
            }).renderTo(document.getElementById("galButtons"));
            tinymce.ui.Factory.create({
              type: "button",
              text: "Close ",
              classes: "closeGal gallery",
              onclick: function() {
                if ($(".mce-modified").length) {
                  tinymce.get("tmpTempEditor").windowManager.confirm("Save changes before exit?", function(s) {
                    if (s) {
                      loadingThrobber(1);
                      saveChunk("", textareaForJSON, "closePopGal");
                    } else {
                      tjgClosePopGal();
                    }
                  });
                } else {
                  tjgClosePopGal();
                }
              }
            }).renderTo(document.getElementById("galButtons"));
            scriptLoader.loadQueue(function() {
              chunkTransformer(chunkValOriginal, textareaForJSON, 1); //begin
            });
          }
        }).renderTo(document.getElementById("galButtons"));
        $(".mce-gallery").delay(1700).fadeIn();
      });
    }
  });
}

function tinyGalleryInit(textareaForJSON) {
  // textareaForJSON = textareaForJSON;
  var chunkValOriginal;
  if ($("#" + textareaForJSON).length) {
    chunkValOriginal = $("#" + textareaForJSON).val();
    var tvChunkGalleryVal = $("#" + textareaForJSON).val();
    sortDir = "asc";
    beautifyJSON = 0;
    tinymce.init({
      name: "gallery",
      selector: "#tinyJSONfield",
      skin_url: TinyJSONGallery.tinymce_skin_url,
      toolbar: false,
      menubar: false,
      hidden_input: false,
      entity_encoding: "raw",
      apply_source_formatting: false,
      cleanup: false,
      inline: true,
      plugins: "paste, contextmenu, code, save, searchreplace",
      contextmenu: " buildFromServer buildFromTextarea | toggleLive saveData | pasteSample | exportJSON | searchreplace toggleHelp",
      forced_root_block: "",
      force_br_newlines: false,
      force_p_newlines: false,
      valid_elements: "grt",
      body_id: "mce-tinyJSONGallery",
      paste_as_text: true,
      save_enablewhendirty: true,
      setup: function(editor) {
        editor.addMenuItem("buildFromServer", {
          text: "* Build JSON/Thumbnails From Server",
          onclick: function() {
            rebuildFromServer(editor);
          }
        });
        editor.addMenuItem("buildFromTextarea", {
          text: "* Build Gallery From JSON",
          onclick: function() {
            rebuildFromCurrent(editor, textareaForJSON);
          }
        });
        editor.addMenuItem("saveData", {
          text: "Save Gallery changes to JSON",
          onclick: function() {
            loadingThrobber(1);
            saveChunk("", textareaForJSON);
          }
        });
        editor.addMenuItem("toggleHelp", {
          text: "Toggle Help and Brief Instructions",
          onclick: function() {
            toggleHelpInstructions();
          }
        });
        editor.addMenuItem("pasteSample", {
          text: "Paste Sample JSON Code",
          onclick: function() {
            pasteSampleCode(editor);
          }
        });
        editor.addMenuItem("toggleLive", {
          text: "Live Edit: JSON => GUI",
          onclick: function() {
            toggleLiveEdit(editor);
          }
        });
        editor.addMenuItem("exportJSON", {
          text: "View Friendly Data",
          menu: [{
            text: "Pop it right here",
            onclick: function() {
              var con = JSON.parse(tinymce.get("tinyJSONfield").getContent());
              con = JSON.stringify(con, null, 2);
              alert(con);
            }
          }, {
            text: "Download to your computer",
            onclick: function() {
              var con = JSON.parse(tinymce.get("tinyJSONfield").getContent());
              con = JSON.stringify(con, null, 2);
              download(con, "gallery-"+textareaForJSON+".json");
            }
          } ]
        });
        editor.on("init", function() {
          galleryJSONchanged = 0;
          galleryLiveEdit = 0;
          editor.setContent(tvChunkGalleryVal);
        });
        editor.on("change keyup", function() {
          // editor.save();
          // $("#"+textareaForJSON).val(editor.getContent()); //???? add later //watch out for ID change
          galleryModified(1);
          if (galleryJSONchanged === 0) {
            if($("#tinyJSONfolder:visible").length){
              editor.windowManager.alert("When done editing, please \"Build Gallery From JSON\" before saving");
            }
            galleryJSONchanged = 1;
          }
          if (galleryLiveEdit == 1) {
            chunkTransformer(editor.getContent(), textareaForJSON);
          }
        });
        editor.on("blur", function() {
          if (galleryLiveEdit == 1) {
            chunkTransformer(editor.getContent(), textareaForJSON);
          }
        });
      }
    });
  } else {
    setTimeout(function() {
      tinymce.get("tmpTempEditor").windowManager.alert("Input field with id: " + textareaForJSON + " does not exist");
    }, 200);
  }
  // $("#"+textareaForJSON+"-tr, .CodeMIrror").hide();
  $("#" + textareaForJSON).attr({
    placeholder: "Enter valid JSON"
  });
  loadingThrobber(1);
  tinyLord(chunkValOriginal, textareaForJSON);
}

exitedGalleryToUseElementTree = 0;

var extraTW = "";

if (typeof TinymceWrapper !== "undefined") {
  extraTW = "<h3>CUSTOMIZATION (TinymceWrapper Plugin)</h3><ol><li><strong>enableImageGallery</strong>: switch on/off this Gallery module in MODX</li><li><strong>tinyJSONGalleryTABtitle</strong>: change the text of the tab that appears next to Resource or Chunk tab</li><li><strong>tinyJSONGalleryTABposition</strong>: change position of this Gallery tab (# < 1 = first)</li><li><strong>galleryJSfile</strong>: backup your TinyJSONGallery.js file</li><li><strong>galleryChunkNameKey</strong>: specify what suffix a Chunk name is to have in order to transform said Chunk</li><li><strong>imageGalleryIDs</strong>: or... specify which Chunks will be Galleries by Chunk ids</li><li><strong>TinyJSONGalleryTV</strong>: Specify which TV is to be used to transform a Resource in to a Gallery</li></ol><h3>FRONTEND GALLERY MANAGER (using e.g, TinyMagicPublisher)</h3><ol><li><strong>&TinyJSONGallery.gallery_url =</strong>  `[[++assets_url]]`</li><li><strong>&TinyJSONGalleryJS =</strong> `[[++assets_url]]components/tinymcewrapper/gallery/js/TinyJSONGallery.js`</li><li><strong>&TinyJSONGallery.tinymce_skin_url =</strong> `[[++assets_url]]/components/tinymcewrapper/tinymceskins/modxPericles`</li><li>Once ready, you can programmatically initiate a Gallery with one line of code: <b>popGal(textareaForJSON, title, width, height, id)</b><br>All that this module needs is a textarea with JSON code in it</li></ol>";
} else {}

tinyJSONgallHelp = '<div id=tinyJSONLocationSettings></div><h3>Gallery Options</h3><ol><li>Options-&gt;<strong>Toggle Raw JSON Code Area</strong>, paste all valid code there, and <strong>Rebuild from Current JSON</strong> or <strong>from server</strong></li><li>Please Explore the rest of the options.</li></ol><h3>Getting started (prepare the code)</h3><ol><li>JSON first line is the location/settings:<br>[{"Location": "' + TinyJSONGallery.gallery_rel_url + "images/nature/&autoCreateThumb=0&justJSON=1&options=w=178,h=117,zc=t\"}]</li><li>Complete the JSON yourself, manually or</li><li>Generate it <strong>Options</strong>-&gt; Build/Visualize Gallery-&gt; Rebuild Thumbs/JSON (from Server)&nbsp;</li></ol><h3>JSON</h3><ol><li><strong>Location:<br></strong>the url from root to image folder + trailing slash&nbsp;...site.com/assets/images/ becomes <strong>assets/images/</strong><br>Use&nbsp;assets/images/ with&nbsp;<strong>autoCreateThumb=1</strong> (a folder named 'thumb' with thumbnails will be created for you )<br>Use&nbsp;assets/images/thumb/ with&nbsp;<strong><strong>autoCreateThumb=0</strong></strong> (i.e. if you are supplying your own thumbnails - use any name for the thumbs folder)</li><li><strong>&amp;autoCreateThumb: <br></strong><strong>1(yes)</strong> will create thumb folder and thumbs within the large images' folder (install <a href=https://modx.com/extras/package/resizer>MODX Resizer</a>)<br><strong>0(no)</strong> will assume you <strong>included</strong> a 'thumb' folder name in your <strong>location</strong>(<em>assets/images/thumb/</em> and that the folder is populated with your own thumbnails); it will work backwards to parent folder.</li><li><strong>&amp;justJSON:<br></strong><em>(works with&nbsp;autoCreateThumb=1)</em><strong><br>1(yes)&nbsp;</strong>use this to build/rebuild your gallery, this will not rebuild your thumbs, save your server resources!<br><strong>0(no)</strong> this will rebuild everything including thumbs (slower! best to do this once)</li><li><strong>&amp;options:<br></strong>Comma-separated list of what phpThumbs takes, courtesy of <a href=https://github.com/rthrash/Resizer target=_blank>MODX Resizer<br></a>Best to keep the dimensions 178x117 - or use CSS to fix Gallery ordered list.</li></ol>" + extraTW + '<h3>FRONTEND OUTPUT (Chunk or Resource TV)</h3><i>Note: the first item of the JSON is the location and settings (not a valid image item), use <b>offset</b> or whatever settings available to skip it - or just use &where to filter nicely</i><ol><li><strong>TinyJSONGalleryOutput</strong>:<br>[[!TinyJSONGalleryOutput?<br> &galleryChunkOrJson=`[[$NatureAlbum_myGallery]]` <b>OR ...(use a snippet to grap TV content of resource)</b><br>&tpl=`NatureAlbum_rowTpl` <br>&imgCls=`pic` <br>&rowCls=`magic` <br>&linkCls=`linked`]]</li><li><strong>MIGX getImageList</strong>:<br>[[!getImageList? <br>&offset=`1`<br>&where =`{"hidden:=":"0"}`<br>&sort=`[{"sortby":"index","sortdir":"DESC","sortmode":"numeric"},{"sortby":"title","sortdir":"ASC"}]`<br>&value=`[[$NatureAlbum_myGallery]]` <b>OR ...(&tvname=`TinyJSONGalleryTV`)</b><br>&tpl=`NatureAlbum_rowTpl`<br>&imgCls=`pic` &rowCls=`magic`<br>&linkCls=`linked`]]</li></ol><h3><strong>ENJOY, <br>donshakespeare</strong></h3>';

if (typeof extjsPanelTabs !== "undefined") {
  if (extjsPanelTabs == "modx-chunk-tabs") {
    tvChunkGalleriesNotice = "Main Gallery has safely and temporarily exited.<br><br>Visible Textareas of Chunks in the Elements Tree<br> can now be transformed into Visual Galleries.<br><br>Just double-click on each!";
  } else {
    tvChunkGalleriesNotice = "Main Gallery has safely and temporarily exited.<br><br>Visible Textareas of TVs on this page and Chunks in the Elements Tree<br> can now be transformed into Visual Galleries.<br><br>Just double-click on each!";
  }
}

function tradGal(exit, textareaForJSON) {
  notApplicableToAppToGal = 0;
  textareaForJSON = textareaForJSON;
  $("#tinyJSONGalleryWrapper, #galButtons, #galButtonsTemp, #tinyTemp, #tvChunkGalleries-notice").remove();
  $(".tvChunkGalleries-parent").removeClass("tvChunkGalleries-parent");
  if (exit == 1) {
    $("#tinyJSONGalleryWrapperEXtJS").append("<div id=tvChunkGalleries-notice>" + tvChunkGalleriesNotice + "</div>");
    tinymce.EditorManager.execCommand("mceRemoveEditor", true, "tinyFileImageGallery");
    tinymce.EditorManager.execCommand("mceRemoveEditor", true, "tinyJSONfield");
    $('<div id="tinyTemp" style="display:none!important;border:0!important;outline:0!important;width:0;height:0;"></div><div id="galButtonsTemp" class="galButtons" style="opacity:1!important"></div>').prependTo(tinyJSONGalleryGalButtons);
    tinymce.init({
      selector: "#tinyTemp",
      inline: true,
      toolbar: false,
      menubar: false,
      skin_url: TinyJSONGallery.tinymce_skin_url
    });
    tinymce.ui.Factory.create({
      type: "button",
      text: "Restore Main Gallery",
      classes: "options gallery",
      icon: "fullpage",
      tooltip: "Restore Gallery to this page, and turn off double-click effect",
      onclick: function() {
        exitedGalleryToUseElementTree = 0;
        tradGal(0, textareaForJSON);
      }
    }).renderTo(document.getElementById("galButtonsTemp"));
    $("#modx-tv-tabs textarea:not(.modx-richtext)").addClass("tvJSONGalleries");
    $(document).on("mouseenter", ".modx-window, .tvJSONGalleries", function() {
      var extraTitleadd,chunkContentId;
      if ($(this).hasClass("tvJSONGalleries")) {
        if (exitedGalleryToUseElementTree == 1) {
          $(".tvJSONGalleries").parent().addClass("tvChunkGalleries-parent");
        }
        extraTitleadd = " TV: " + $(this).parents(".modx-tv").find(".modx-tv-caption").text();
        chunkContentId = $(this).attr("id");
        $(this).on("dblclick", function() {
          if (chunkContentId && exitedGalleryToUseElementTree == 1 && !$("#tinyJSONGalleryWrapper").length) {
            popGal(chunkContentId, tinyJSONGalleryTABtitle + extraTitleadd);
          }
        });
      } else {
        if (exitedGalleryToUseElementTree == 1) {
          $(this).find("textarea[name=snippet]").parents(".modx-window").addClass("tvChunkGalleries-parent");
        }
        $(this).find("textarea[name=snippet]").addClass("chunkJSONGalleries");
        chunkContentId = $(this).find("textarea[name=snippet]").attr("id");
        extraTitleadd = " Chunk: " + $(this).find(".x-window-header-text > span").text();
        $(this).find(".chunkJSONGalleries").on("dblclick", function() {
          if (chunkContentId && exitedGalleryToUseElementTree == 1 && !$("#tinyJSONGalleryWrapper").length) {
            popGal(chunkContentId, tinyJSONGalleryTABtitle + extraTitleadd);
          }
        });
      }
    });
  } else {
    $('<div id="tinyJSONGalleryWrapper"><span id="galleryContextmenuNotice"></span><div id="tinyJSONfield" title="Access  quick options via Context Menu"></div><div id="tinyJSONGalleryStation"><div id="gallHelp">' + tinyJSONgallHelp + '</div><div id=tinyFileImageGallery style=display:none;height:0;width:0;opacity:0;visibility:hidden></div><ol id="list_to_filter" class="grid"></ol><div id="picSettings"></div></div></div>').appendTo("#tinyJSONGalleryWrapperEXtJS");
    $('<div id="galButtons" class="galButtons"></div>').prependTo(tinyJSONGalleryGalButtons);
    tinyGalleryInit(textareaForJSONbk);
  }
}

function popGal(textareaForJSON, title, width, height, id) {
  var extraTitle = "";
  if (id) {
    extraTitle = " (" + textareaForJSON + ")";
  }
  notApplicableToAppToGal = 1;
  // textareaForJSON = textareaForJSON;
  if (!$("#list_to_filter").length && $("#" + textareaForJSON).length) {
    tinymce.get("tmpTempEditor").windowManager.open({
      title: title ? title + extraTitle : "JSON Image Gallery" + extraTitle,
      width: width ? width : 885,
      height: height ? height : 500,
      classes: "popGal",
      autoScroll: true,
      items: [ {
        classes: "popGallery",
        type: "container",
        style: "width:100% !important;height:inherit !important",
      } ],
      buttons: [ {
        text: "Hidden Toolbar Wrapper",
        classes: "closeGallery",
        style: "visibility:hidden;",
        onPostRender: function() {
          $(".mce-popGal button.mce-close").remove();
          $('<div id="tinyJSONGalleryWrapper"><div id="tinyJSONfolderWrapper"></div><div id=tinyJSONfieldWrapper><span id="galleryContextmenuNotice"></span><div id="tinyJSONfield" title="Access  quick options via Context Menu"></div></div><div id="tinyJSONGalleryStation"><div id="gallHelp">' + tinyJSONgallHelp + '</div><div id=tinyFileImageGallery style=display:none;height:0;width:0;opacity:0;visibility:hidden></div><ol id="list_to_filter" class="grid"></ol><div id="picSettings"></div></div></div>').prependTo(".mce-popGallery > .mce-container-body");
          $('<div id="tinyJSONGalleryBAR"><div id="galButtons" class="galButtons"></div></div>').insertBefore(".mce-closeGallery");
          tinyGalleryInit(textareaForJSON);
          // setTimeout(function(){
          //   $(".mce-popGal").addClass("ui-widget-content");
          //   $(".mce-popGal").resizable();
          // },1000);
        }
      } ]
    });
  } else {
    tinymce.get("tmpTempEditor").windowManager.alert("Invalid operation");
  }
}

function tjgClosePopGal() {
  tinymce.EditorManager.execCommand("mceRemoveEditor", true, "tinyFileImageGallery");
  tinymce.EditorManager.execCommand("mceRemoveEditor", true, "tinyJSONfield");
  tinymce.get("tmpTempEditor").windowManager.close();
  $(".galleryXTYPEtv"+TinyJSONGallery.default_tv).attr("id", "galleryXTYPEtv"+TinyJSONGallery.default_tv);
}

function createTempEditorManager() {
  if (!$("#tmpTempEditor").length) {
    $("body").append("<div id=tmpTempEditor style=display:none;height:0;width:0;opacity:0;visibility:hidden></div>");
    tinymce.init({
      selector: "#tmpTempEditor",
      skin_url: TinyJSONGallery.tinymce_skin_url,
      inline: true,
      forced_root_block: "",
      force_br_newlines: false,
      force_p_newlines: false
    });
  }
}

if (typeof backendOrfrontendGallery !== "undefined") {
  Ext.onReady(function() {
    createTempEditorManager();
    var newPanel = new MODx.Panel({
      title: tinyJSONGalleryTABtitle,
      id: "tinyJSONGallery",
      width: "100%",
      items: [ {
        html: "<div id=tinyJSONGalleryWrapperEXtJS></div>"
      } ]
    });
    var tabs = Ext.getCmp(extjsPanelTabs);
    tabs.insert(tinyJSONGalleryTABposition, newPanel);
    tabs.setActiveTab(newPanel);
    // document.getElementById(textareaForJSON).removeAttribute("class");
    // tabs.hideTabStripItem(1);
    tradGal(0, textareaForJSON);
  });
} else {
  createTempEditorManager();
}

function mainStreamer(data){
  // tinymce.get("tmpTempEditor").windowManager.alert("copied");
  tinymce.get("tmpTempEditor").windowManager.close();
  tinymce.get("tmpTempEditor").windowManager.close();
  $("body").append("<div style='background:#fff;position:fixed;z-index:999999;top:20%;width:50%;height:40%;left:0;right:0;margin:auto'>" +data+"</div>");
  tinymce.get("tmpTempEditor").windowManager.close();
}