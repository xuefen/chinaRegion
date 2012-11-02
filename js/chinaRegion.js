/**
 * 外部文件jquery1.2.6.js、region.xml ； 外部接口<div id="show_id"></div>必须的
 * 初始化并读取国家列表
 */
(function($){
    $.fn.region=function(region_id,callBack){
        var $t=$(this);
        var regionDir="js/region";//地区文件目录
        if(region_id){
            var region_id = $.trim(region_id+'');
            var regionObj = {};
            regionObj[0] = region_id.substr(0,2);
            regionObj[1] = region_id.substr(2,2);
            regionObj[2] = region_id.substr(4,2);
        }
        var $china;
        china=[];
        function initcity(){
            $t.html('');
            $china=$('<div><select name="province" class="provice" r="1">\
			          <option value=0 selected="selected">请选择省</option></select>\
			          <select name="city"  class="city" r="2">\
			          <option value=0 selected="selected">请选择市</option></select>\
			          <select name="county" class="county"><option value=0 selected="selected">请选择县</option></select></div>');    
            $china.find('.provice,.city').change(function(){
                var code=parseInt($(this).val());
                var r=$(this).attr('r');
                r=r=='1'?1:2;
                getNext(code,r,$(this).next());
            }).end().appendTo($t);
            getProvice();
        }
        //自定义回调函数取得地区
        function getPCA(callBack){
            getNext(code,r,$(this).next());
        }
        
        function getProvice()
        {
            if(provice != undefined)
            {
                var proHTML = "";
                
                $.each(provice,function(k){
                    if(typeof provice[k]==='string'){
                        proHTML += '<option value="'+k+'" '+(region_id && k==(regionObj[0]+'0000')?'selected':'')+' >'+provice[k]+'</option>';
                    }
                });
                var cp = $china.find(".provice");
                $(proHTML).appendTo(cp);
                if(region_id){
                    getNext(regionObj[0]+'0000',1,cp.next());
                }
            }
        }

        function getNext(code,r,append)
        {
            var proviceCode=parseInt(code/10000);
            var url;
            if(r==1)
            {
                url = regionDir+'/'+proviceCode+'/'+proviceCode+'.js';
            }else
            {
                var cityCode=(parseInt(code/100)*100-proviceCode*10000)/100;
                cityCode=(cityCode<10?'0'+cityCode:cityCode);
                url = regionDir+'/'+proviceCode+'/'+cityCode+'/'+cityCode+'.js';
            }
            $.getJSON(url,function(data){
                append.find("option:gt(0)").remove();
                var op = '';
                if(region_id){
                    var selectedCode;
                    if(r==1)
                        selectedCode = regionObj[0]+regionObj[1]+'00';
                    else
                        selectedCode = region_id;
                }
                $.each(data,function(k){
                    if(typeof data[k]==='string'){
                        op += '<option value="'+k+'" '+( (region_id && k==selectedCode) ?'selected':'')+' >'+data[k]+'</option>';
                    }
                });
                if(op!==''){
                    $(op).appendTo(append);
                    if(region_id && r==1){
                        getNext(region_id,2,append.next());
                    }
                }
            });
        }
        if(callBack==undefined)
           initcity();
        else if(typeof callBack=='function'){
            getPCA(callBack);
        }
            
           
    };
})(jQuery);
