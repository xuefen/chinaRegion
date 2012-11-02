/**
 * 利用XML三级联动城市 BY童学芬 2011-07-01
 *外部文件jquery1.2.6.js、region.xml ； 外部接口<div id="show_id"></div>必须的
 * 初始化并读取国家列表
 */
(function($){
	oxml=null;
	$.fn.region=function(region_id,str){
		var axml;
		var $t=$(this);
		var region_id=parseInt(region_id);
		if(oxml==null){
			oxml = loadXML(SITE_URL+"/includes/libraries/javascript/region/region.xml");
		}
	    if(str==undefined){
		   initcity();
		}else{
		  var pct=getPCA();
		  $t.html(str.replace('(p)',pct.p).replace('(c)',pct.c).replace('(a)',pct.a));
		}
		function initcity(){
			$t.html('');
		    var CHtml='<div><select name="province" current="p" next="c" class="change doujia_p" >\
			          <option value=0 selected="selected">请选择省</option></select>\
			          <select name="city"  class="change doujia_c" current="c" next="t" >\
			          <option value=0 selected="selected">请选择市</option></select>\
			          <select name="country" class="change_t doujia_t" current="t" ><option value=0 selected="selected">请选择县</option></select>\
				      <input type="hidden" name="region" value="0" class="doujia_region_last"/>\
			          <input type="hidden" name="region_name" value="0" class="doujia_region_name_last"/></div>';    
			$(CHtml).find('.change').change(function(){
				change_r(this);
			}).end().find('.change_t').change(change_hidden).end().appendTo($t);
           axml=$(oxml).find('a');
		   if(region_id>0){
				   getregion();
		   }else{
				   getpct('p',axml);
		   }
		   change_hidden();
		}
		
		function change_r(t){
			var $ts=$(t);//alert($t.attr('current')+','+$t.attr('next')+','+t.options[t.selectedIndex].text);
			getItems($ts.attr('current'),$ts.attr('next'),t.options[t.selectedIndex].text);
			change_hidden();
		}
		function change_hidden(){
			var ts=$t.find('select[name=country]');
			var t=parseInt(ts.val());
			var cs=$t.find('select[name=city]');
			var c=parseInt(cs.val());
			var ps=$t.find('select[name=province]');
			var p=parseInt(ps.val());
			var s=t>0?t:(c>0?c:p);
		    $('input.doujia_region_last').val(s);var sel='option:selected';
		    var n=(p>0?(ps.find(sel).text()+"  "):'')+(c>0?(cs.find(sel).text()):'')+(t>0?ts.find(sel).text():'');
		    $('input.doujia_region_name_last').val(n);
		}
		//创建处理XML的对象，兼容多种浏览器
		function loadXML(xmlpath){
		    var xmlDoc = null;
		    if (window.ActiveXObject){
		        xmlDoc = new ActiveXObject("MSXML2.DOMDocument.3.0");
				xmlDoc.async = false;
				xmlDoc.load(xmlpath);
		    }else if (document.implementation && document.implementation.createDocument){
				var xmlhttp = new window.XMLHttpRequest();
				xmlhttp.open("GET", xmlpath, false);
				xmlhttp.send(null);
				xmlDoc = xmlhttp.responseXML;
			}else{
		        xmlDoc=null;
			}
		    return xmlDoc;
		}
		//获取省份,城市，县的列表
		function getpct(pct,node,p_id){
		    var html='';//'<option value="0" >请选择'+(pct=='p'?'省':(pct=='c'?'市':'县'))+'</option>'
		    if(!(pct=='t'||pct=='c'||pct=='p')){return;}
            node.find(pct).each(function(){
               var ad=$(this).attr("d");
           	   html += '<option value="'+ad+'" '+(p_id==ad?'selected="selected"':'')+'>'+$(this).attr("n")+'</option>';
            });
            $t.find(".doujia_"+pct).append(html);
		}

		//获取省份的城市
		function getItems(itemName,childItem,Cvalue){
			//alert(itemName);
		  var currentItem = $(oxml).find(itemName+"[n='"+Cvalue+"']");
			if (currentItem.children().size()<1){ //防止无市
				 $t.find(".doujia_t").empty();
			}
			var currentHtml='<option value="0" >请选择'+(itemName=='p'?'市':'县')+'</option>';
		    currentItem.children().each(function(){
		         currentHtml += '<option value="'+$(this).attr("d")+'">'+$(this).attr("n")+'</option>';
		    });
		    $t.find(".doujia_"+childItem).empty();
			$(currentHtml).appendTo(".doujia_"+childItem);
			if (itemName=="p"){
				getItems("c","t",currentItem.children(0).attr("n"));
			}
		}
		//根据id来获取select
		function getregion(){
		   var cur=$(oxml).find("[d='"+region_id+"']");
		   var cn=cur.length>0?cur.get(0).nodeName:'p';
		   var region_arr=[];
		   switch(cn){
		      case 'p':
            getpct('p',axml,region_id);
            getpct('c',cur);
		        
		      break;
		      case 'c':
		         getpct('c',cur.parent(),region_id);
		         getpct('p',axml,cur.parent().attr('d'));
		         getpct('t',cur);
		      break;
		      case 't':
		         getpct('t',cur.parent(),region_id);
		         getpct('c',cur.parents('p'),cur.parent().attr('d'));
		         getpct('p',axml,cur.parents('p').attr('d'));
		      break;
		      default:;
		   }
		   change_hidden();
		}
		
		function getPCA(){
			var cur=$(oxml).find("[d='"+region_id+"']");
			var pca={p:'',c:'',a:''};
			if(cur.length>0){
					var cn=cur.get(0).nodeName;
					switch(cn){
				      case 'p':
				    	  pca.p= cur.attr('n');
				      break;
				      case 'c':
				    	  pca.p= cur.parent().attr('n');
				    	  pca.c= cur.attr('n');
				      break;
				      case 't':
				    	  pca.p= cur.parent().parent().attr('n');
				    	  pca.c= cur.parent().attr('n');
				    	  pca.a= cur.attr('n');
				      break;
				      default:;
				   }
			}
			return pca;
		}
	};
})(jQuery);
