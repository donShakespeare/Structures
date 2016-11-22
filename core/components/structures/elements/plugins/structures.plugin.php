<?php
/*
https://github.com/donShakespeare/
http://www.donshakespeare.com
(c) 2016 by donShakespeare: MODX & Content Editor Specialist
Deo Gratias!

Structures Plugin fires on OnDocFormPrerender and only when said Resource has a MODX Template attached to $tvForCMRspecificity in this case "Structures" TV

ROADMAP
1. lexiconize Structures Plugin and tinyBlocks.js and make independent from MODX
2. allow sourcefeeds other than resource content
3. click to edit any resource in the frontend - with all Manager abilities
*/
// include(MODX_ASSETS_PATH."mycomponents/structures/core/components/structures/elements/plugins/structures.plugin.php"); //life-safer.com

if(isset($_GET["structures"]) && $_GET["structures"] == "disabled"){
  return;
}
$cognomen = 'Structures';
$psetSuffix = ""; //fixed or getOption?
$debug = "";
$tvForCMRspecificity = 'Structures'; //fixed or getOption
$psetORtemplateDebugInfo = "[Name not retrievable]";
$pluginMGRcss = MODX_ASSETS_URL.'components/structures/css/mgr.css'; // #1
$pluginMGRrich = MODX_ASSETS_URL.'components/structures/css/mgr.richtext.css';
$pluginOVERRIDEcss = MODX_ASSETS_URL.'components/structures/css/mgr.override.css';
$pluginSkinUrl = MODX_ASSETS_URL.'components/structures/tinymceskins/hamlet';
$pluginUIcss = '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css';
$pluginJSfiles = array(
  "<script src='//ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js'></script>", // make all CDNs user/optional
  "<script src='https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js'></script>",
  "<script src='https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap-record.min.js'></script>",
  "<script src='https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap-bind-dictionary.min.js'></script>",
  "<script src='https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap-global-bind.min.js'></script>",
  "<script src='https://cdn.tinymce.com/4/tinymce.min.js'></script>",
  "<script src='//cdn.tinymce.com/4/jquery.tinymce.min.js'></script>",
  "<script src='//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js'></script>"
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
        if($getTemplateName = $modx->getObject('modTemplate', array("templatename" => $cognomen))) {
          $getPackageTemplateDefaultProperties = $getTemplateName->getProperties();
        }
        if($pset = $modx->getObject("modPropertySet",array('name' => $getTemplateId->get('templatename').$psetSuffix))){
          $getVariousSettings = $pset->getProperties();
          $psetORtemplateDebugInfo = "Property Set: " . $getTemplateId->get("templatename").$psetSuffix;
        }
        //Use Template Default Properties or use Properties of PropertySet whose name was given in Template Default Properties
        elseif($psetName = $modx->getOption("StructuresCustomPset", $getTemplateDefaultProperties)){
          // Use Default Properties of Template
          if($psetName = $modx->getOption("StructuresCustomPset", $getTemplateDefaultProperties) == "default"){
            $getVariousSettings = $getTemplateDefaultProperties;
            $psetORtemplateDebugInfo = "Default Properties of Current Template: ".$currentTemplateName;
          }
          //(fallback) seek MODX PropertySet from name given in Template Default Properties [StructuresCustomPset]
          elseif($pset = $modx->getObject("modPropertySet",array('name' => $modx->getOption("StructuresCustomPset", $getTemplateDefaultProperties)))){
            $getVariousSettings = $pset->getProperties();
            $psetORtemplateDebugInfo = "Property Set: " . $modx->getOption("StructuresCustomPset", $getTemplateDefaultProperties);
          }
          // (fallback)seek Pset name that corresponds to Template Name+psetSuffix
          elseif($pset = $modx->getObject("modPropertySet",array('name' => $getTemplateId->get("templatename").$psetSuffix))){
            $getVariousSettings = $pset->getProperties();
            $psetORtemplateDebugInfo = "Property Set: " . $getTemplateId->get("templatename").$psetSuffix;
          }
          //(fallback) seek Original Package Template Properties
          elseif($pset = $modx->getOption("StructuresCustomPset", $getPackageTemplateDefaultProperties)){
            $getVariousSettings = $getPackageTemplateDefaultProperties;
            $psetORtemplateDebugInfo = "Original Package Template (Structures) Default Properties";
          }
          //(fallback) seek PropertySet with name corresponding to Original Package Template
              //good reason to ship with template of same name
          elseif($pset = $modx->getObject("modPropertySet",array('name' => $cognomen.$psetSuffix))){
            $getVariousSettings = $pset->getProperties();
            $psetORtemplateDebugInfo = "Original Package Property Set (Structures): " . $cognomen.$psetSuffix;
          }
          //failed
          else{
            $modx->regClientStartupHTMLBlock("
              <script>
                Ext.onReady(function() {
                  MODx.msg.alert('Warning: ".$cognomen." Failed to Load!', '1. Template (<b>".$getTemplateId->get('templatename')."</b>) Default Properties has invalid Value for <b><i>StructuresCustomPset</i></b><br>2. No fallback MODX Property Set named<b>: ".$getTemplateId->get('templatename').$psetSuffix."</b><br>3. No fallback Original Package Template Properties / eponymous Property Set: <b></i>".$cognomen.$psetSuffix."</i></b> ');
                })
              </script>");
            return;
          }
        }
        //if StructuresCustomPset is invalid --
        //(fallback)seek Pset name that corresponds to Template Name+psetSuffix --
        //(fallback) seek Original Package Template Properties
        elseif($pset = $modx->getOption("StructuresCustomPset", $getPackageTemplateDefaultProperties)){
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
                MODx.msg.alert('Warning: ".$cognomen." Failed to Load!', '1. Template (<b>".$getTemplateId->get('templatename')."</b>) has no Default Properties or valid Value for <b><i>StructuresCustomPset</i></b><br>2. No fallback MODX Property Set named<b>: ".$getTemplateId->get('templatename').$psetSuffix."</b><br>3. No fallback Original Package Template Properties / eponymous Property Set: <b></i>".$cognomen.$psetSuffix."</i></b>');
              })
            </script>");
          return;
        }

        // $import_a_start_tags = $modx->getOption("import_a_start_tags", $getVariousSettings);
        // $import_z_end_tags = $modx->getOption("import_z_end_tags", $getVariousSettings);
        // $import_marker_tags = $modx->getOption("import_marker_tags", $getVariousSettings);
        $import_marker_chunk = $modx->getOption("import_marker_chunk", $getVariousSettings);
        $import_wrapper_chunk = $modx->getOption("import_wrapper_chunk", $getVariousSettings);
        $standByStructure = $modx->getOption("standByStructure", $getVariousSettings);
        $randomTips = $modx->getOption("randomTips", $getVariousSettings);
        $defaultGalleryTVid = $modx->getOption("defaultGalleryTVid", $getVariousSettings);
        $structuresTV_ids = $modx->getOption("structuresTV_ids", $getVariousSettings);
        $pure = $modx->getOption("pureContent", $getVariousSettings, '');
        $sidebar_tab_title = $modx->getOption("sidebar_tab_title", $getVariousSettings, $cognomen);
        $content_tab_title = $modx->getOption("content_tab_title", $getVariousSettings, $cognomen);
        $manager_css = $modx->getOption("manager_css", $getVariousSettings, $pluginMGRcss);
        $TinyMCE_skin_url = $modx->getOption("TinyMCE_skin_url", $getVariousSettings, $pluginSkinUrl);
        $donshakepeare_tinymce_js_plugins = $modx->getOption("donshakepeare_tinymce_js_plugins", $getVariousSettings);
        $manager_js = $modx->getOption("manager_js", $getVariousSettings);
        $tinymce_init_chunk = $modx->getOption("tinymce_init_chunk", $getVariousSettings);
        $ace_mirror_init_chunk = $modx->getOption("ace_mirror_init_chunk", $getVariousSettings);
        $all_structures_chunk = $modx->getOption("all_structures_chunk", $getVariousSettings);
        // $blocks_reel_chunk = $modx->getOption("blocks_reel_chunk", $getVariousSettings);
        $manager_misc_buttons_chunk1 = $modx->getOption("manager_misc_buttons_chunk", $getVariousSettings);
        // $tb_autoFileBrowser = $modx->getOption("tb_autoFileBrowser", $getVariousSettings, 'MODx.config["manager_url"] + "index.php?a=" + MODx.action["browser"] + "&source=" + MODx.config["default_media_source"]'); //???
        $autoImport = $modx->getOption("autoImport", $getVariousSettings, false);
        $autoImportDemandMarkers = $modx->getOption("autoImportDemandMarkers", $getVariousSettings, true);
        $autoImportSave = $modx->getOption("autoImportSave", $getVariousSettings, false);
        $CDN_Ace = $modx->getOption("CDN_Ace", $getVariousSettings, false);

        $manager_misc_buttons_chunk = $modx->getChunk($manager_misc_buttons_chunk1);
        $manager_misc_buttons_chunk =  json_encode($manager_misc_buttons_chunk);

        $originalSourceId = $modx->getOption("originalSourceId", $getVariousSettings, "ta");
        $rowsWrapperClass = $modx->getOption("rowsWrapperClass", $getVariousSettings, "st-container-fluid");
        $rowTempHolderClass = $modx->getOption("rowTempHolderClass", $getVariousSettings, "st-outer");
        $rowClass = $modx->getOption("rowClass", $getVariousSettings, "st-row");
        $newBlockClass = $modx->getOption("newBlockClass", $getVariousSettings, "st-new-block");
        $hiddenBlockClass = $modx->getOption("hiddenBlockClass", $getVariousSettings, "st-hidden");
        $duplicateBlockClass = $modx->getOption("duplicateBlockClass", $getVariousSettings, "st-duplicate");
        $shrinkClass = $modx->getOption("shrinkClass", $getVariousSettings, "st-shrink");
        $minBlockClass = $modx->getOption("minBlockClass", $getVariousSettings, "st-shrink");
        $showDebugInfo = $modx->getOption("showDebugInfo", $getVariousSettings, true);
        $help = $modx->getOption("help_howto_chunk", $getVariousSettings);


        $stTVs ="";
        $stComma = "";
        $structuresTV_ids = str_replace(' ', '', $structuresTV_ids);
        // $structuresTV_ids = preg_replace("/[^0-9,]+/i", '', $structuresTV_ids);
        $structuresTV_ids = preg_replace("/[^A-Za-z0-9,*]+/i", '', $structuresTV_ids);
        $structuresTV_ids = explode(',', $structuresTV_ids);
        if($structuresTV_ids){
          foreach ($structuresTV_ids as $structuresTV_id) {
            $structuresTV_id = explode('*', $structuresTV_id);
            if(isset($structuresTV_id[1])){
             $structuresTV_id[1] = "***".$structuresTV_id[1];
            }
            else{
             $structuresTV_id[1] = "";
            }
            if(isset($structuresTV_id[0])){
              if($getTV = $modx->getObject('modTemplateVar', $structuresTV_id[0])){
                $getTVname = $getTV->get("name");
                $stTVs .= $stComma.$getTVname ."***". $structuresTV_id[0].$structuresTV_id[1];
                $stComma = ",";
              }
            }
          }
        }

        $miscInfo = "
        <!--<span><b>originalSourceId</b><i>". $originalSourceId . "</i></span>
        <span><b>mainWrapperId</b><i>tinyBlocksMainWrapperId_". $originalSourceId . "</i></span>
        <span><b>rowsWrapperClass</b><i>". $rowsWrapperClass . "</i></span>
        <span class='imp'><b>rowClass</b><i>". $rowClass . "</i></span>
        <span><b>newBlockClass</b><i>". $newBlockClass . "</i></span>
        <span><b>hiddenBlockClass</b><i>". $hiddenBlockClass . "</i></span>
        <span><b>duplicateBlockClass</b><i>". $duplicateBlockClass . "</i></span>
        <span><b>shrinkClass</b><i>". $shrinkClass . "</i></span>
        <span><b>minBlockClass</b><i>". $minBlockClass ."</i></span>
        <hr>-->
        <span class='imp'><b>manager_js</b><i>". $manager_js . "</i></span>
        <span><b>manager_css</b><i>". $manager_css . "</i></span>
        <span><b>CDN_Ace</b><i>". $CDN_Ace . "</i></span>
        <span><b>donshakepeare_tinymce_js_plugins</b><i>". $donshakepeare_tinymce_js_plugins . "</i></span>
        <span><b>TinyMCE_skin_url</b><i>". $TinyMCE_skin_url . "</i></span>
        <span class='imp'><b>tinymce_init_chunk</b><i>". $tinymce_init_chunk . "</i></span>
        <span><b>ace_mirror_init_chunk</b><i>". $ace_mirror_init_chunk . "</i></span>
        <span><b>all_structures_chunk</b><i>". $all_structures_chunk . "</i></span>
        <span><b>manager_misc_buttons_chunk</b><i>". $manager_misc_buttons_chunk1 . "</i></span>
        <span><b>import_wrapper_chunk</b><i>". $import_wrapper_chunk . "</i></span>
        <span><b>import_marker_chunk</b><i>". $import_marker_chunk . "</i></span>
        <span><b>standByStructure</b><i>". htmlentities($standByStructure) . "</i></span>
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

        // $resourceContent = $resource->get("content"); //make flexible - to receive other than resource content, think TV etc
        $resourceContent = $modx->getObject("modResource", $id)->get("content");

        if($pure == "md" || $pure == "fc" || $pure == "rc"){
          $resourceContent = "<div class='tb-wrapper-tlb tb-tiny-pure tb-tiny-".$pure."'>" . str_replace(array("[[-STRUCTURES]]", "[[-STRUCTURES-SINGLE]]"),array("</div><div class='tb-wrapper-tlb tb-tiny-pure tb-tiny-".$pure."'>", ""), $resourceContent) . "</div>";
        }

        // $help = $modx->getChunk($help); //remove getChunk
        $import_marker_chunk = $modx->getChunk($import_marker_chunk); //getChunk is harmless here

        if($help = $modx->getObject("modChunk", array('name' => $help))){
          $help = $help->get('content');
        }

        $blockTinyMCEConfig = $modx->getChunk($tinymce_init_chunk, array(
          "tinyBlocksMainWrapperId" => "#tinyBlocksMainWrapperId_".$originalSourceId,
          "tinyBlocksSkinUrl" => $TinyMCE_skin_url
        ));
        $blockAceOrCMConfig = $modx->getChunk($ace_mirror_init_chunk);
        if($blockSnippetBar = $modx->getObject("modChunk", array('name' => $all_structures_chunk))){
          $blockSnippetBar = $blockSnippetBar->get('content');
          $blockSnippetBar = '<div id="blockSnippetBar">'.$blockSnippetBar.'</div>';
        }

        if($autoImport && !isset($_GET["autoImport"]) && !isset($_GET["importCompleted"])){
          $trafficJam = false;
          if ($autoImportDemandMarkers){
            if (strpos($resourceContent, '[[-STRUCTURES]]') !== false || strpos($resourceContent, '[[-STRUCTURES-SINGLE]]') !== false) {
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
            if (strpos($resourceContent, '[[-STRUCTURES]]') !== false || strpos($resourceContent, '[[-STRUCTURES-SINGLE]]') !== false) {
            }
            else{
              $trafficJam = true;
            }
          }

          $resourceContent = str_replace(array("[[-STRUCTURES]]", "[[-STRUCTURES-SINGLE]]"),array($import_marker_chunk, ""), $resourceContent);

          //replaced getChunk
          if($import_wrapper_chunk = $modx->getObject("modChunk", array("name" => $import_wrapper_chunk))){
            $import_wrapper_chunk = $import_wrapper_chunk->get("content");
            $resourceContent = str_replace("[[+content]]", $resourceContent, $import_wrapper_chunk);
          }

          if ($autoImportSave){ // no need to report errors
            if(!$trafficJam){
              $modx->resource->set("content", $resourceContent);
              $modx->resource->save(); // warn user to be careful with this tool
              $modx->sendRedirect(MODX_MANAGER_URL."?a=resource/update&id=".$id."&importCompleted");
              exit; // just in case
            }
          }
        }

        $randomTip = explode("||", $randomTips);
        shuffle($randomTip);

        //moved silly st.wrapper_tpl to right here (one less pesky getChunk to deal with- we want speed)!
        $sourceContent = "<div class='st-html'  tabindex=0><div id=tinyBlocksMainWrapperId_".$originalSourceId." class=st-body  tabindex=0><div class=".$rowsWrapperClass."  tabindex=0 spellcheck=true>".$resourceContent."</div></div></div>";
        $sourceContent = json_encode($sourceContent);

        if($importWrapperJS = $modx->getObject("modChunk", array("name" => $import_wrapper_chunk))){
          $importWrapperJS = $importWrapperJS->get("content");
        }

        $blockControlSideBar = json_encode($blockSnippetBar.$blockSnippetBase);
        if(!$content_tab_title || $content_tab_title == "hidden"){
          $showHideContentTab = '
          $("#'.$originalSourceId.'").hide().before('.$sourceContent.');
          ';
        }
        else{
          $showHideContentTab = '
          var newPanel = new MODx.Panel({
            id: "tinyBlocksContentWr",
            title: "'.$content_tab_title.'",
            width: "100%",
            items:[
              {
                html: '.$sourceContent.'
              }
            ]
          });
          var tabs = Ext.getCmp("modx-resource-tabs");
          tabs.insert(0,newPanel);
          tabs.setActiveTab(newPanel);
          $("#modx-resource-content, #modx-panel-resource .x-tool.x-tool-toggle").hide();
          ';
        }
        if(!$sidebar_tab_title || $sidebar_tab_title == "hidden"){
          $showHideTreeTab = "
          tabs.insert(12,newPanelSideBar);
          tabs.setActiveTab(newPanelSideBar);
          document.getElementById('modx-leftbar-tabpanel__tinyBlocksSideWr').style.display='none';
          tabs.setActiveTab(activeTab);
          ";
        }
        else{
          $showHideTreeTab = "
          tabs.insert(0,newPanelSideBar);
          tabs.setActiveTab(newPanelSideBar);
          // tabs.setActiveTab(activeTab);
          ";
        }
        $modx->regClientCSS($manager_css);
        $modx->regClientCSS($pluginUIcss);
        foreach ($pluginJSfiles as $pluginJSfile) {
            $modx->regClientStartupHTMLBlock($pluginJSfile);
        }
        $modx->regClientStartupHTMLBlock('<script src="'.$donshakepeare_tinymce_js_plugins.'"></script>');
        if($CDN_Ace) $modx->regClientStartupHTMLBlock('<script src="'.$CDN_Ace.'"></script>');
        $modx->regClientStartupHTMLBlock('
          <script>
            Ext.onReady(function() {
              '.$showHideContentTab.'
              var newPanelSideBar = new MODx.Panel({
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
              var activeTab = tabs.getActiveTab();
              '.$showHideTreeTab.'
            tinyBlocks();
            })
            tinyBlocksItems={
              "sourceFeed": '.$sourceContent.',
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
              "importWrapper": '.json_encode($importWrapperJS).',
              "importMarker": '.json_encode($import_marker_chunk).',
              "defaultBlock": '.json_encode($standByStructure).',
              "tinymceSkinUrl":  "'.$TinyMCE_skin_url.'",
              "thisPageUrl":  "'.MODX_MANAGER_URL.'?a=resource/update&id='.$id.'",
              "randomTip":  '.json_encode($randomTip[0]).',
              "defaultGallery":  "'.$defaultGalleryTVid.'",
              "TVs":  "'.$stTVs.'",
              "pure":  "'.$pure.'",
              "help": '.json_encode($help).',
              "projectName": "'.$cognomen.'"
            }
            TinyJSONGalleryDefaultTV = "'.$defaultGalleryTVid.'";
            TinyJSONGalleryBase = "'.MODX_BASE_URL.'";
            TinyJSONGalleryGallery = "'.MODX_ASSETS_URL.'components/structures/gallery/";
            TinyJSONGalleryGallerySkin = "'.$TinyMCE_skin_url.'";
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
        $modx->regClientStartupHTMLBlock("<script src='".$manager_js."'></script>");
      }
    }
  }
}