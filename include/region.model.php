<?php
/**
 * the model for chinaRegion to translate xml files to js and php files 
 * 
 * @author tongxuefen
 * @date 2011-12-12
 * @version 1.0
 */
class ChinaRegion
{
	//private $regionXml;
	public $xmlObj;
	private $regionArray;
	private $regionTypeMap = array("provice","city","county");
	
	public function __tostring()
	{
		return "<pre> ".print_r($this->regionArray,true)." </pre>";
	}
	
	public function __construct($xmlUrl = "region.xml")
	{
	  	$xmlStr = file_get_contents($xmlUrl);
	    $this->xmlObj = simplexml_load_string($xmlStr);
	}
	
	/**
	 * convert objects to array
	 * 
	 * @author Xuefen.Tong
	 * @date 2011-12-12
	 */
	public function objectsIntoArray($arrObjData=array(),$arrSkipIndices = array())
	{
	    $arrData = array();
	    
	    // if the param $arrObjData is object, convert it into array
	    if (is_object($arrObjData)) 
	    {
	        $arrObjData = get_object_vars($arrObjData);
	    }
	    
	    if (is_array($arrObjData)) 
	    {
	        foreach ($arrObjData as $index => $value) 
	        {
	            if (is_object($value) || is_array($value)) 
	            {
	                $value = $this->objectsIntoArray($value, $arrSkipIndices); // recursive call
	            }
	            if (in_array($index, $arrSkipIndices)) 
	            {
	                continue;
	            }
	            $arrData[$index] = $value;
	        }
	    }
	    return $arrData;
	}
	
    /**
	 * 生成js，php文件
	 * 
	 * @author Xuefen.Tong
	 * @date 2011-12-14
	 */
	public function objToRegionFile($xmlObj,$type=0,$chinaDir="region/",$regionCode=0,$javascriptVar="")
	{
	    if(is_object($xmlObj))
	    {
			$xmlArray = get_object_vars($xmlObj);
	    }elseif(is_array($xmlObj))
	    { 
	    	$xmlArray = $xmlObj;
	    }else
	    {
	       return;
	    }
		if(isset($xmlArray["@attributes"]))
		{
		   $xmlArray = $xmlArray[$this->regionTypeMap[$type]];
		}elseif(is_array($xmlArray[$this->regionTypeMap[$type]]))
		{
		   $xmlArray = $xmlArray[$this->regionTypeMap[$type]];
		}else
		{
		   return;
		}
	    if($xmlArray instanceof SimpleXMLElement)
	    {
	         $xmlArray = array($xmlArray);
	    }elseif(!$xmlArray) return;
	      
	    $codeArr = array();
	    foreach($xmlArray as $value)
	    {
	   	    if ($value instanceof SimpleXMLElement) 
	   	    {
	   	    	$value = get_object_vars($value);
	   	    	$codeArr[$value['@attributes']['code']] = $value['@attributes']['name'];
	   	    	$areacode = substr($value['@attributes']['code']."/",2*$type,2);
	   	    	$this->objToRegionFile($value,$type+1,$chinaDir.$areacode."/",$areacode);
	   	    }else 
	   	    {
	   	    	print_r($value);
	   	    	//exit;
	   	    }
	   }
	   $this->regionMkdir($chinaDir);
	   
	   file_put_contents($chinaDir.$regionCode.".php","<?php\nreturn " . var_export ($codeArr,true) . ";\n?>");
       file_put_contents($chinaDir.$regionCode.".js",json_encode($codeArr));

    }
	
    /**
	 * 递归生成目录
	 * 
	 * @author Xuefen.Tong
	 * @date 2011-12-14
	 */
	private function regionMkdir($absolute_path, $mode = 0777)
	{
	    if (is_dir($absolute_path))
	    {
	        return true;
	    }
	
	    $root_path      = ROOT_PATH;
	    $relative_path  = str_replace($root_path, '', $absolute_path);
	    $each_path      = explode('/', $relative_path);
	    $cur_path       = $root_path; // 当前循环处理的路径
	    foreach ($each_path as $path)
	    {
	        if ($path)
	        {
	            $cur_path = $cur_path . '/' . $path;
	            if (!is_dir($cur_path))
	            {
	                if (@mkdir($cur_path, $mode))
	                {
	                    fclose(fopen($cur_path . '/index.htm', 'w'));
	                }
	                else
	                {
	                    return false;
	                }
	            }
	        }
	    }
	    return true;
	}

}


