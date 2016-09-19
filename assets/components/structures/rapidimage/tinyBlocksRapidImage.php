<?php
/*
https://github.com/donShakespeare/
http://www.leofec.com/modx-revolution/
(c) 2016 by donShakespeare: MODX & Content Editor Specialist
Deo Gratias!

ROADMAP
1. add scary feature to delete image right from editor :()
2. Connect MODX Resizer to do more wonders
3. be more fantastic
*/



// * Only these origins will be allowed to upload images *
$accepted_origins = array("http://localhost", "http://192.168.1.1", $_SERVER['HTTP_ORIGIN']);


function getMyParams($name){
  if (isset($_GET[$name]) && !empty($_GET[$name])) {
    $getParam = filter_var($_GET[$name], FILTER_SANITIZE_STRING);
    $getParam = rawurldecode($getParam);
  }
  return $getParam ?: "";
}

//add ability to pass these as GET variables
$uploadPath = getMyParams("path") ?: "uploads/";
$uploadUrl = getMyParams("url") ?: "/assets/components/structures/php/uploads/";




reset ($_FILES);
$temp = current($_FILES);
if (is_uploaded_file($temp['tmp_name'])){
  if (isset($_SERVER['HTTP_ORIGIN'])) {
    // same-origin requests won't set an origin. If the origin is set, it must be valid.
    if (in_array($_SERVER['HTTP_ORIGIN'], $accepted_origins)) {
      header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    } else {
      header("HTTP/1.0 403 Origin Denied");
      return;
    }
  }

  /*
    If your script needs to receive cookies, set images_upload_credentials : true in
    the configuration and enable the following two headers.
  */
  // header('Access-Control-Allow-Credentials: true');
  // header('P3P: CP="There is no P3P policy."');

  // Sanitize input
  if (preg_match("/([^\w\s\d\-_~,;:\[\]\(\).])|([\.]{2,})/", $temp['name'])) {
      header("HTTP/1.0 500 Invalid file name.");
      return;
  }

  // Verify extension
  if (!in_array(strtolower(pathinfo($temp['name'], PATHINFO_EXTENSION)), array("gif", "jpg", "png"))) {
      header("HTTP/1.0 500 Invalid extension.");
      return;
  }

  // Accept upload if there was no origin, or if it is an accepted origin
  $filetowrite = $uploadPath . $temp['name'];
  move_uploaded_file($temp['tmp_name'], $filetowrite);

  // Respond to the successful upload with JSON.
  // Use a location key to specify the path to the saved image resource.
  // { location : '/your/uploaded/image/file'}
  // echo json_encode(array('location' => $filetowrite));
  echo json_encode(array('location' => $uploadUrl . $temp['name']));
} else {
  // Notify editor that the upload failed
  header("HTTP/1.0 500 Server Error");
}
?>