<?php
/*
TinyJSON Gallery Connector for TinymceWrapper (TinyJSON Gallery Scanner Snippet)
http://www.leofec.com/modx-revolution/
-donshakespeare in the MODx forum
Copyright 2016
*/
require_once dirname(dirname(dirname(dirname(dirname(dirname(__FILE__))))))."/config.core.php";
require_once MODX_CORE_PATH.'model/modx/modx.class.php';
$modx = new modX();
$modx->initialize('web'); //or mgr or any content you like
$modx->getService('error','error.modError', '', '');
if (!$modx->hasPermission('edit_chunk') || !$modx->hasPermission('edit_tv') || !$modx->hasPermission('file_upload')) {
  die("no permission");
}
if (isset($_GET['path']) && !empty($_GET['path'])) {
  $path = filter_var($_GET['path'], FILTER_SANITIZE_STRING);
  $path = rawurldecode($path);
  $inputedPath = $path;
  $autoCreateThumb = 0;
  $justJSON = 1;
  $options = 0;
  $doThumbs = 0;
  $thumbFld = "thumb/";
  if (isset($_GET['autoCreateThumb'], $_GET['justJSON']) && $_GET['autoCreateThumb'] == 1) {
    $autoCreateThumb = filter_var($_GET['autoCreateThumb'], FILTER_SANITIZE_STRING);
    $justJSON = filter_var($_GET['justJSON'], FILTER_SANITIZE_STRING);
    if (isset($_GET['options']) && !empty($_GET['options'])) {
      $options = filter_var($_GET['options'], FILTER_SANITIZE_STRING);
    }
    if (isset($_GET['doThumbs']) && $_GET['doThumbs'] == 1) {
      $doThumbs = filter_var($_GET['doThumbs'], FILTER_SANITIZE_STRING);
    }
    if (isset($_GET['thumbFldSuffix'])&& !empty($_GET['thumbFldSuffix'])) {
      $thumbFldSuffix = filter_var($_GET['thumbFldSuffix'], FILTER_SANITIZE_STRING);
      $thumbFld= "thumb" . $thumbFldSuffix . "/";
    }
  }

function gallery($inputedPath, $autoCreateThumb, $justJSON, $options, $doThumbs, $thumbFld){
  global $modx;
  $optionsOri = $options;
  $partialOp = explode(',', $options);
  $optionsArray = array();
  array_walk($partialOp, function($val,$key) use(&$optionsArray){
    list($key, $value) = explode('=', $val);
    $optionsArray[$key] = $value;
  });
  $options = $optionsArray;
  //get inputedPath plus base, whether user has autoCreateThumb on or not
  $inputedFullPath = MODX_BASE_PATH . $inputedPath;
  //full url to full image
  $largeUrl = MODX_BASE_URL . $inputedPath;
  //full path to thumb image if autoCreateThumb is on
  $thumbPath = MODX_BASE_PATH . $inputedPath . $thumbFld;
  //full url to full image if autoCreateThumb is off, and user has own thumbs(must be child of parent folder :) )
  // $thumbParentUrl = dirname($largeUrl) . "/";
  $thumbParentUrl = $largeUrl;
  $thumbUrl = $thumbParentUrl . $thumbFld;
  $thumbInfo = $thumbReady = '';
  if ($autoCreateThumb == 1 && $options !== 0) {
    $thumbUrl = $largeUrl . $thumbFld;
    if ($justJSON == 0) {
      $thumbReady = 1;
    }
  }

  if (file_exists($inputedFullPath)) {
    // use Zebra
    // if ($autoCreateThumb && $justJSON == 0) {
    //   if (!file_exists($thumbPath)) {
    //     mkdir($thumbPath, 0777, true);
    //   }
    //   $checkResizer =  'Zebra_Image.php';
    //   if (file_exists($checkResizer)) {
    //     require 'Zebra_Image.php';
    //     $resizer = new Zebra_Image();
    //   }
    //   if(!$resizer){
    //     $thumbInfo = '<br><b>Zebra Image Resizer</b> <i> is needed to create thumbnails<br>&justJSON was set to 0 - but no thumbs was created, only JSON</i>';
    //   }
    // }

    //use resizer
    if ($autoCreateThumb && $justJSON == 0) {
      if (!file_exists($thumbPath)) {
        mkdir($thumbPath, 0777, true);
      }
      $checkResizer = MODX_CORE_PATH . 'components/resizer/model/';
      if (file_exists($checkResizer)) {
        $modx->loadClass('Resizer', MODX_CORE_PATH . 'components/resizer/model/', true, true);
        $resizer = new Resizer($modx);
        $resizer->debug = true;
      }
      if(!$resizer){
        $thumbInfo = '<br><b><a href="https://modx.com/extras/package/resizer" target="_blank">MODX Resizer</a></b> <i> is needed to create thumbnails</i>';
      }
    }
    $images = glob($inputedFullPath . "*.{jpg,png,gif}", GLOB_BRACE);
    if ($images) {
      $comma = '';
      $output = "<b>SCANNING:  </b><i>" . $inputedPath . "</i><br><br><div spellcheck='false' contenteditable='true' style='border:1px dotted rgb(64, 73, 82); height: 200px !important;font-size: 12px;padding:5px; overflow: auto;overflow-x: hidden'>[";
      $output.= '<b>{"Location": "' . $inputedPath . '&autoCreateThumb='.$autoCreateThumb.'&justJSON=1&options='.$optionsOri.'"},</b>'; //force justJSON to be 1 again to prevent user fro creating thumbs by mistake
      $index = 0;
      foreach ($images as $image) {
        $index ++;
        $timeStamp = filemtime($image);
        $image = pathinfo($image);
        $file = $image["filename"];
        $ext = $image["extension"];
        $fileExt = $file . "." . $ext;
        $thumbSrc = $thumbUrl . $fileExt;
        $thumbParentUrlFname = $thumbParentUrl . $fileExt;
        if ($justJSON == 0 && $autoCreateThumb == 1 && $options !== 0) {
          //use zebra
          // if($resizer){
          //   // $resizer->processImage($inputedFullPath . $fileExt, $thumbPath . $fileExt, $options);
          //   $resizer->source_path = $inputedFullPath . $fileExt;
          //   $resizer->target_path = $thumbPath . $fileExt;
          //   if (!$resizer->resize(178, 117, ZEBRA_IMAGE_BOXED, -1)) show_error($resizer->error, $resizer->source_path, $resizer->target_path);
          //   $resizer->source_path = $thumbPath . $fileExt;
          //   // if (!$resizer->crop(0, 0, 50, 50)) show_error($resizer->error, $resizer->source_path, $resizer->target_path);
          //   // $resizer->crop(0, 0, 100, 100);
          //   // $resizer->target_path = $thumbPath . $fileExt;
          //   // $resizer->apply_filter(array(
          //   //     array('grayscale'),
          //   //     array('colorize', 90, 60, 40),
          //   // ));
          // }

          //use resizer
          if($resizer){
            $resizer->processImage($inputedFullPath . $fileExt, $thumbPath . $fileExt, $options);
          }
        }
        $cleanfile = preg_replace('/[^A-Za-z0-9\-]/', ' ', $file);
        $output.= $comma . '{"id":"' . $file.'.'.$ext .'","title":"' . $file.'.'.$ext . '","folder":"' . $thumbParentUrl . '","hidden":"0","desc":"' . $cleanfile . '","index":"' . $index . '","tag":"","lerror":"0"}';
        $comma = ',';
      }
      if($thumbReady){
        $thumbInfo = "<br><b>THUMBNAILS:</b> " . $index . " thumb image(s) created in: <br><i>" . $inputedPath . $thumbFld . "</i><br><br>If any issues, check that the original images were not oversize";
      }
      $output.= "]</div><br><b>COPY CODE ABOVE</b> <i>and paste over your current JSON, and then press the option 'Build from Current JSON'</i><br>".$thumbInfo;
      if($doThumbs){
        return $thumbInfo;
      }
      else{
        return $output;
      }
    } 
    else {
      return "<p style='text-align:center;padding:30% 0;'>No valid files (jpg,png,gif) in <b>" . $inputedPath . "</b></p>";
    }
  } 
  else {
    return "<p style='text-align:center;padding:30% 0;'>The folder  <b>" . $inputedPath . "</b> does not exist</p>";
  }
}
echo '
  <html>
  <head>
  <script>parent.loadingThrobber(0);
// parent.mainStreamer(.json_encode(gallery($inputedPath, $autoCreateThumb, $justJSON, $options)).);
  </script>
  </head>
  <body style="background:#fff;word-break: break-all;font-size: 14px;">
  '.gallery($inputedPath, $autoCreateThumb, $justJSON, $options, $doThumbs, $thumbFld).'
  </body></html>
';
}
else{
  die("Invalid ununderstandable non-human error");
}