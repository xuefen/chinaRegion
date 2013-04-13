<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
 <head>
  <title> ffmore </title>
  <meta charset="utf-8">
  <meta name="Generator" content="EditPlus">
  <meta name="Author" content="">
  <meta name="Keywords" content="">
  <meta name="Description" content="">
 </head>

 <body>
<?php
  define("ROOT_PATH",dirname(__FILE__));
  include("include/region.model.php");
  $region = new ChinaRegion();
  $region -> objToRegionFile($region->xmlObj,0,ROOT_PATH."/js/region/");
	
?>
   
 </body>
</html>
