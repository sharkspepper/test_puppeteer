//ds.base
(function(global, document, undefined){
	var ds = global.ds = {
		//Cookies
		getCookie: function(name){
			var ret = new RegExp('(?:^|[^;])' + name + '=([^;]+)').exec(document.cookie);
			return ret ? decodeURIComponent(ret[1]) : '';
		},
		setCookie: function(name, value, expir){
			var cookie = name + '=' + encodeURIComponent(value);
			if(expir !== void 0){
				var now = new Date();
				now.setDate(now.getDate() + ~~expir);
				cookie += '; expires=' + now.toGMTString();
			}
			document.cookie = cookie;
		},	
	};

})(this, document);