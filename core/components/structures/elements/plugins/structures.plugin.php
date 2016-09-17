<?php
/*
https://github.com/donShakespeare/
http://www.donshakespeare.com
(c) 2016 by donShakespeare: MODX & Content Editor Specialist
Deo Gratias!

Structures Plugin fires on OnDocFormPrerender and only when said Resource has a MODX Template attached to $tvForCMRspecificity in this case "StructuresCMR"

ROADMAP
1. lexiconize Structures Plugin and tinyBlocks.js and make independent from MODX
2. allow sourcefeeds other than resource content
3. click to edit any resource in the frontend - with all Manager abilities
*/


if(isset($_GET["structures"]) && $_GET["structures"] == "disabled"){
  return;
}
$cognomen = 'Structures';
$psetSuffix = ""; //fixed or getOption?
$debug = "";
$tvForCMRspecificity = 'StructuresCMR'; //fixed or getOption
$psetORtemplateDebugInfo = "[Name not retrievable]";
$pluginMGRcss = MODX_ASSETS_URL.'components/structures/css/mgr.css'; // #1
$pluginMGRrich = MODX_ASSETS_URL.'components/structures/css/mgr.richtext.css';
$pluginOVERRIDEcss = MODX_ASSETS_URL.'components/structures/css/mgr.override.css';
$pluginUIcss = '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css';
$pluginJSfiles = array(
  "<script src='//ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js'></script>", // make all CDNs user/optional
  "<script src='https://cdnjs.cloudflare.com/ajax/libs/jwerty/0.3.2/jwerty.min.js'></script>",
  "<script src='https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js'></script>",
  "<script src='https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap-bind-dictionary.min.js'></script>",
  "<script src='https://cdn.tinymce.com/4/tinymce.min.js'></script>",
  "<script src='//cdn.tinymce.com/4/jquery.tinymce.min.js'></script>",
  "<script src='//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js'></script>",
);

if ($id !== 0){
  if($tv = $modx->getObject('modTemplateVar', array('name' => $tvForCMRspecificity))){
    if($collection = $tv->getMany('TemplateVarTemplates')){
      foreach ($collection as $object){
        $template_ids[] = $object->get('templateid');
      }
    }
    if($resourceTemplateId = $resource->get("template")){
      if(in_array($resourceTemplateId, $template_ids)){
        $getTemplateId = $modx->getObject('modTemplate', $resourceTemplateId);
        $currentTemplateName = $getTemplateId->get("templatename");
        $getTemplateDefaultProperties = $getTemplateId->getProperties();
        $getVariousSettings = $getPackageTemplateDefaultProperties = array(); // older PHP struggle with []
        if($getTemplateName = $modx->getObject('modTemplate', $cognomen)){
          $getPackageTemplateDefaultProperties = $getTemplateName->getProperties();
        }
        if($pset = $modx->getObject("modPropertySet",array('name' => $getTemplateId->get('templatename').$psetSuffix))){
          $getVariousSettings = $pset->getProperties();
          $psetORtemplateDebugInfo = "Property Set: " . $getTemplateId->get("templatename").$psetSuffix;
        }
        //Use Template Default Properties or use Properties of PropertySet whose name was given in Template Default Properties
        elseif($psetName = $modx->getOption("customPset", $getTemplateDefaultProperties)){
          // Use Default Properties of Template
          if($psetName = $modx->getOption("customPset", $getTemplateDefaultProperties) == "default"){
            $getVariousSettings = $getTemplateDefaultProperties;
            $psetORtemplateDebugInfo = "Default Properties of Current Template: ".$currentTemplateName;
          }
          //(fallback) seek MODX PropertySet from name given in Template Default Properties [customPset]
          elseif($pset = $modx->getObject("modPropertySet",array('name' => $modx->getOption("customPset", $getTemplateDefaultProperties)))){
            $getVariousSettings = $pset->getProperties();
            $psetORtemplateDebugInfo = "Property Set: " . $modx->getOption("customPset", $getTemplateDefaultProperties);
          }
          // (fallback)seek Pset name that corresponds to Template Name+psetSuffix
          elseif($pset = $modx->getObject("modPropertySet",array('name' => $getTemplateId->get("templatename").$psetSuffix))){
            $getVariousSettings = $pset->getProperties();
            $psetORtemplateDebugInfo = "Property Set: " . $getTemplateId->get("templatename").$psetSuffix;
          }
          //(fallback) seek Original Package Template Properties
          elseif($pset = $modx->getOption("customPset", $getPackageTemplateDefaultProperties)){
            $getVariousSettings = $getPackageTemplateDefaultProperties;
            $psetORtemplateDebugInfo = "Original Package Template Default Properties";
          }
          //(fallback) seek PropertySet with name corresponding to Original Package Template
          elseif($pset = $modx->getObject("modPropertySet",array('name' => $cognomen.$psetSuffix))){
            $getVariousSettings = $pset->getProperties();
            $psetORtemplateDebugInfo = "Original Package Property Set: " . $cognomen.$psetSuffix;
          }
          //failed
          else{
            $modx->regClientStartupHTMLBlock("
              <script>
                Ext.onReady(function() {
                  MODx.msg.alert('Warning: ".$cognomen." Failed to Load (**)!', '1. Template (<b>".$getTemplateId->get('templatename')."</b>) Default Properties has invalid Value for <b><i>customPset</i></b><br>2. No fallback MODX Property Set named<b>: ".$getTemplateId->get('templatename').$psetSuffix."</b><br>3. No fallback Original Package Template Properties / eponymous Property Set: <b></i>".$cognomen.$psetSuffix."</i></b> ');
                })
              </script>");
            return;
          }
        }
        //if customPset is invalid --
        //(fallback)seek Pset name that corresponds to Template Name+psetSuffix --
        //(fallback) seek Original Package Template Properties
        elseif($pset = $modx->getOption("customPset", $getPackageTemplateDefaultProperties)){
          $getVariousSettings = $getPackageTemplateDefaultProperties;
          $psetORtemplateDebugInfo = "Original Package Template Default Properties";
        }
        //(fallback) seek PropertySet with name corresponding to Original Package Template
        elseif($pset = $modx->getObject("modPropertySet",array('name' => $cognomen.$psetSuffix))){
          $getVariousSettings = $pset->getProperties();
          $psetORtemplateDebugInfo = "Original Package Property Set- " . $cognomen.$psetSuffix;
        }
        //failed
        else{
          $modx->regClientStartupHTMLBlock("
            <script>
              Ext.onReady(function() {
                MODx.msg.alert('Warning: ".$cognomen." Failed to Load!(**test2)', '1. Template (<b>".$getTemplateId->get('templatename')."</b>) has no Default Properties or valid Value for <b><i>customPset</i></b><br>2. No fallback MODX Property Set named<b>: ".$getTemplateId->get('templatename').$psetSuffix."</b><br>3. No fallback Original Package Template Properties / eponymous Property Set: <b></i>".$cognomen.$psetSuffix."</i></b>');
              })
            </script>");
          return;
        }

        // $import_a_start_tags = $modx->getOption("import_a_start_tags", $getVariousSettings);
        // $import_z_end_tags = $modx->getOption("import_z_end_tags", $getVariousSettings);
        // $import_marker_tags = $modx->getOption("import_marker_tags", $getVariousSettings);
        $import_marker_chunk = $modx->getOption("import_marker_chunk", $getVariousSettings);
        $import_wrapper_chunk = $modx->getOption("import_wrapper_chunk", $getVariousSettings);
        $pure = $modx->getOption("pureContent", $getVariousSettings, '');
        $sidebar_tab_title = $modx->getOption("sidebar_tab_title", $getVariousSettings, $cognomen);
        $content_tab_title = $modx->getOption("content_tab_title", $getVariousSettings, $cognomen);
        $manager_css_function_file = $modx->getOption("manager_css_function_file", $getVariousSettings, $pluginMGRcss);
        $manager_css_richtext = $modx->getOption("manager_css_richtext", $getVariousSettings, $pluginMGRrich);
        $manager_css_override_file = $modx->getOption("manager_css_override_file", $getVariousSettings, $pluginOVERRIDEcss);
        $tinymce_donshakepeare_plugins_file = $modx->getOption("tinymce_donshakepeare_plugins_file", $getVariousSettings);
        $tinyblocks_js_file = $modx->getOption("tinyblocks_js_file", $getVariousSettings);
        $tinymce_init_chunk = $modx->getOption("tinymce_init_chunk", $getVariousSettings);
        $ace_mirror_init_chunk = $modx->getOption("ace_mirror_init_chunk", $getVariousSettings);
        $all_structures_chunk = $modx->getOption("all_structures_chunk", $getVariousSettings);
        // $blocks_reel_chunk = $modx->getOption("blocks_reel_chunk", $getVariousSettings);
        $content_wrapper_chunk = $modx->getOption("content_wrapper_chunk", $getVariousSettings);
        $manager_misc_buttons_chunk1 = $modx->getOption("manager_misc_buttons_chunk", $getVariousSettings);
        // $tb_autoFileBrowser = $modx->getOption("tb_autoFileBrowser", $getVariousSettings, 'MODx.config["manager_url"] + "index.php?a=" + MODx.action["browser"] + "&source=" + MODx.config["default_media_source"]'); //???
        $autoImport = $modx->getOption("autoImport", $getVariousSettings, false);
        $autoImportDemandMarkers = $modx->getOption("autoImportDemandMarkers", $getVariousSettings, true);
        $autoImportSave = $modx->getOption("autoImportSave", $getVariousSettings, false);
        $CDN_Ace = $modx->getOption("CDN_Ace", $getVariousSettings, false);

        $manager_misc_buttons_chunk = $modx->getChunk($manager_misc_buttons_chunk1);
        $manager_misc_buttons_chunk =  json_encode($manager_misc_buttons_chunk);

        $originalSourceId = $modx->getOption("originalSourceId", $getVariousSettings);
        $rowsWrapperClass = $modx->getOption("rowsWrapperClass", $getVariousSettings);
        $rowTempHolderClass = $modx->getOption("rowTempHolderClass", $getVariousSettings);
        $rowClass = $modx->getOption("rowClass", $getVariousSettings);
        $newBlockClass = $modx->getOption("newBlockClass", $getVariousSettings);
        $hiddenBlockClass = $modx->getOption("hiddenBlockClass", $getVariousSettings);
        $duplicateBlockClass = $modx->getOption("duplicateBlockClass", $getVariousSettings);
        $shrinkClass = $modx->getOption("shrinkClass", $getVariousSettings);
        $minBlockClass = $modx->getOption("minBlockClass", $getVariousSettings);
        $showDebugInfo = $modx->getOption("showDebugInfo", $getVariousSettings);
        $help = $modx->getOption("help_howto", $getVariousSettings);

        $miscInfo = "
        <span><b>originalSourceId</b><i>". $originalSourceId . "</i></span>
        <span><b>mainWrapperId</b><i>tinyBlocksMainWrapperId_". $originalSourceId . "</i></span>
        <span><b>rowsWrapperClass</b><i>". $rowsWrapperClass . "</i></span>
        <span class='imp'><b>rowClass</b><i>". $rowClass . "</i></span>
        <span><b>newBlockClass</b><i>". $newBlockClass . "</i></span>
        <span><b>hiddenBlockClass</b><i>". $hiddenBlockClass . "</i></span>
        <span><b>duplicateBlockClass</b><i>". $duplicateBlockClass . "</i></span>
        <span><b>shrinkClass</b><i>". $shrinkClass . "</i></span>
        <span><b>minBlockClass</b><i>". $minBlockClass ."</i></span>
        <hr>
        <span><b>CDN_Ace</b><i>". $CDN_Ace . "</i></span>
        <span><b>manager_css_function_file</b><i>". $manager_css_function_file . "</i></span>
        <span><b>manager_css_richtext</b><i>". $manager_css_richtext . "</i></span>
        <span><b>manager_css_override_file</b><i>". $manager_css_override_file . "</i></span>
        <span><b>tinymce_donshakepeare_plugins_file</b><i>". $tinymce_donshakepeare_plugins_file . "</i></span>
        <span><b>tinyblocks_js_file</b><i>". $tinyblocks_js_file . "</i></span>
        <span class='imp'><b>tinymce_init_chunk</b><i>". $tinymce_init_chunk . "</i></span>
        <span><b>ace_mirror_init_chunk</b><i>". $ace_mirror_init_chunk . "</i></span>
        <span><b>all_structures_chunk</b><i>". $all_structures_chunk . "</i></span>
        <span><b>content_wrapper_chunk</b><i>". $content_wrapper_chunk . "</i></span>
        <span><b>manager_misc_buttons_chunk</b><i>". $manager_misc_buttons_chunk1 . "</i></span>
        <span><b>import_wrapper_chunk</b><i>". $import_wrapper_chunk . "</i></span>
        <span><b>import_marker_chunk</b><i>". $import_marker_chunk . "</i></span>
        <span class='imp'><b>autoImport</b><i>". $autoImport . "</i></span>
        <span><b>autoImportDemandMarkers</b><i>". $autoImportDemandMarkers . "</i></span>
        <span class='imp'><b>autoImportSave</b><i>". $autoImportSave . "</i></span>
        <span><b>pureContent</b></b><i>". $pure . "</i></span>
        ";

        // if($showDebugInfo || isset($_GET["stDebug"])){
        if($showDebugInfo){
          $debug = "<div class='tinyBlocksDebug' style='display:none'><h2>DEBUG INFO</h2><h3>" . $psetORtemplateDebugInfo . "</h3>" . $miscInfo . "</div>";
          $debug = json_encode($debug);
        }

        $resourceContent = $resource->get("content"); //make flexible - to receive other than resource content, think TV etc

        $resourceContent = str_replace(array('[[',']]'),array('#{{#','#}}#'),$resourceContent);

        if($pure == "md" || $pure == "fc" || $pure == "rc"){
          $resourceContent = "<div class='tb-wrapper-tlb tb-tiny-pure tb-tiny-".$pure."'>" . str_replace(array("#{{#-TB-MARKER#}}#", "#{{#-TB-MARKER-SINGLE#}}#"),array("</div><div class='tb-wrapper-tlb tb-tiny-pure tb-tiny-".$pure."'>", ""), $resourceContent) . "</div>";
        }

        $help = $modx->getChunk($help);
        $import_marker_chunk = $modx->getChunk($import_marker_chunk);
        $blockTinyMCEConfig = $modx->getChunk($tinymce_init_chunk, array(
          "tinyBlocksMainWrapperId" => "#tinyBlocksMainWrapperId_".$originalSourceId
        ));
        $blockAceOrCMConfig = $modx->getChunk($ace_mirror_init_chunk);
        $blockSnippetBar = '<div id="blockSnippetBar">'.$modx->getChunk($all_structures_chunk).'</div>';
        // $blockSnippetBase = '<div id="tinyBlocksSnippetsWrapper" style="display:none;">'.$modx->getChunk($blocks_reel_chunk).'</div>';

        if($autoImport && !isset($_GET["autoImport"]) && !isset($_GET["importCompleted"])){
          $trafficJam = false;
          if ($autoImportDemandMarkers){
            if (strpos($resourceContent, '#{{#-TB-MARKER#}}#') !== false || strpos($resourceContent, '#{{#-TB-MARKER-SINGLE#}}#') !== false) {
            }
            else{
              $trafficJam = true;
            }
          }
          if(!$trafficJam){
            $modx->sendRedirect($_SERVER["REQUEST_URI"]."&autoImport");
            exit; // just in case
          }
        }


        if (isset($_GET["autoImport"]) && !isset($_GET["importCompleted"])){
          $trafficJam = false;
          if ($autoImportDemandMarkers){
            if (strpos($resourceContent, '#{{#-TB-MARKER#}}#') !== false || strpos($resourceContent, '#{{#-TB-MARKER-SINGLE#}}#') !== false) {
            }
            else{
              $trafficJam = true;
            }
          }
          $resourceContent = $modx->getChunk($import_wrapper_chunk, array(
            "content" => str_replace(array("#{{#-TB-MARKER#}}#", "#{{#-TB-MARKER-SINGLE#}}#"),array($import_marker_chunk, ""), $resourceContent)
          ));
          if ($autoImportSave){ // no need to report errors
            if(!$trafficJam){
              $modx->resource->set("content", $resourceContent);
              $modx->resource->save(); // warn user to be careful with this tool
              $modx->sendRedirect(MODX_MANAGER_URL."?a=resource/update&id=".$id."&importCompleted");
              exit; // just in case
            }
          }
        }


        $sourceContent = $modx->getChunk($content_wrapper_chunk, array(
          "tinyBlocksMainWrapperId" => "tinyBlocksMainWrapperId_".$originalSourceId,
          "tinyBlocksRowsWrapperClass" => $rowsWrapperClass,
          "content" => $resourceContent
        ));
        $sourceContent = json_encode($sourceContent);
        $importWrapperJS = $modx->getChunk($import_wrapper_chunk);
        $importWrapperJS = str_replace(array('[[',']]'),array('#{{#','#}}#'),$importWrapperJS);
        $importWrapperJS = json_encode($importWrapperJS);
        $blockControlSideBar = json_encode($blockSnippetBar.$blockSnippetBase);
        $hideTab = "tabs.setActiveTab(newPanel2);";
        // if($sidebar_tab_title == "hidden" || $pure){
        if($sidebar_tab_title == "hidden"){
          $hideTab = "
          tabs.setActiveTab(newPanel2);
          document.getElementById('modx-leftbar-tabpanel__tinyBlocksSideWr').style.display='none';
          tabs.setActiveTab(1);
          ";
        }
        $modx->regClientCSS($manager_css_function_file);
        $modx->regClientCSS($manager_css_richtext);
        $modx->regClientCSS($manager_css_override_file);
        $modx->regClientCSS($pluginUIcss);
        // $modx->regClientCSS($pluginCSS4);
        // $modx->regClientCSS($pluginCSS5);
        foreach ($pluginJSfiles as $pluginJSfile) {
            $modx->regClientStartupHTMLBlock($pluginJSfile);
        }
        $modx->regClientStartupHTMLBlock('<script src="'.$tinymce_donshakepeare_plugins_file.'"></script>');
        if($CDN_Ace) $modx->regClientStartupHTMLBlock('<script src="'.$CDN_Ace.'"></script>');
        $modx->regClientStartupHTMLBlock('
          <script>
          tinyBlocksImportWrapperJS = '.$importWrapperJS.';
          tinyBlocksSourceFeed = '.$sourceContent.';
          tinyBlocksSourceFeed = tinyBlocksSourceFeed.replace(/(?:#{{#)/g, "[[").replace(/(?:#}}#)/g, "]]"); //only way to preserve MODX tags
            if(typeof autoFileBrowser == "undefined"){
              function autoFileBrowser(){
                tinymce.activeEditor.windowManager.alert("You need TinymceWrapper Plugin et al for browser(s) functionality");
              }
            }
            Ext.onReady(function() {
              var newPanel = new MODx.Panel({
                id: "tinyBlocksContentWr",
                title: "'.$content_tab_title.'",
                width: "100%",
                items:[
                  {
                    html: tinyBlocksSourceFeed
                  }
                ]
              });
              var tabs = Ext.getCmp("modx-resource-tabs");
              tabs.insert(0,newPanel);
              tabs.setActiveTab(newPanel);
              var newPanel2 = new MODx.Panel({
                id: "tinyBlocksSideWr",
                title: "'.$sidebar_tab_title.'",
                width: "100%",
                items:[
                  {
                    html: '.$blockControlSideBar.'
                  }

                ]
              });
              var tabs = Ext.getCmp("modx-leftbar-tabpanel");
              tabs.insert(0,newPanel2);
              '.$hideTab.'
            tinyBlocks();
            })
            tinyBlocksItems={
              "sourceFeed": tinyBlocksSourceFeed,
              "originalSourceId": "'.$originalSourceId.'",
              "rowsWrapperClass": "'.$rowsWrapperClass.'",
              "rowTempHolderClass": "'.$rowTempHolderClass.'", 
              "rowClass": "'.$rowClass.'",
              "newBlockClass": "'.$newBlockClass.'",
              "hiddenBlockClass": "'.$hiddenBlockClass.'",
              "duplicateBlockClass": "'.$duplicateBlockClass.'",
              "shrinkClass": "'.$shrinkClass.'",
              "minBlockClass": "'.$minBlockClass.'",
              "saveButtonTpl": '.$manager_misc_buttons_chunk.',
              "importWrapper": tinyBlocksImportWrapperJS.replace(/(?:#{{#)/g, "[[").replace(/(?:#}}#)/g, "]]"),
              "importMarker": '.json_encode($import_marker_chunk).',
              "sourceBTNcss":  "'.MODX_ASSETS_URL.'components/structures/tinymceskins/stNirvana/skin.min.css",
              "thisPageUrl":  "'.MODX_MANAGER_URL.'?a=resource/update&id='.$id.'",
              "pure":  "'.$pure.'",
              "help": '.json_encode($help).'
            }
            function tinyBlocksTinyMCE(){
              '.$blockTinyMCEConfig.'
            }
            function tinyBlocksAceOrCM(originalTextareaId){
              if(!$("#ace_wrapper_"+originalTextareaId).length && typeof ace !== "undefined"){
                '.$blockAceOrCMConfig.'
              }
            }
            Ext.onReady(function() {
              $("#modx-leftbar-tabpanel").after('.$debug.');
            })
          </script>
        ');
        $modx->regClientStartupHTMLBlock("<script src='".$tinyblocks_js_file."'></script>");
      }
    }
  }
}