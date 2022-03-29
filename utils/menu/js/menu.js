jQuery(function($){
	//创建DOM
	var 
	quickHTML = '<div class="quick_links_panel"><div id="quick_links" class="quick_links"><a href="#top" class="return_top"><i class="top"></i><span>返回顶部</span></a><a href="#" class="my_qlinks"><i class="setting"></i><span>菜单一</span></a><a href="#" class="message_list" ><i class="message"></i><span>菜单二</span><em class="num" style="display:none"></em></a></div><div class="quick_toggle"><a href="javascript:;" class="toggle" title="展开/收起">×</a></div></div><div id="quick_links_pop" class="quick_links_pop hide"></div>',
	quickShell = $(document.createElement('div')).html(quickHTML).addClass('quick_links_wrap'),
	quickLinks = quickShell.find('.quick_links')
	quickPanel = quickLinks.parent()
	quickShell.appendTo('body')

    quickPop = quickShell.find('#quick_links_pop')
    quickDataFns = {
		//菜单一
		my_qlinks: {
			title: '菜单一',
			content: '',
			init: function(){

			}
		},
		//菜单二
		message_list: {
			title: '菜单二',
			content: 'loadingTmpl',
			init: function(ops){
				
			}
		},
	};

	quickShell.bind('click.quick_links', function(e){
		e.stopPropagation();
	});

    //通用事件处理
	var 
	view = $(window),
	quickLinkCollapsed = !!ds.getCookie('ql_collapse'),
	getHandlerType = function(className){
		return className.replace(/current/g, '').replace(/\s+/, '');
	},
	quickHandlers = {
		//返回顶部
		return_top: function(){
			ds.scrollTo(0, 0);
			hideReturnTop();
		},
		toggle: function(){
			quickLinkCollapsed = !quickLinkCollapsed;
			quickShell[quickLinkCollapsed ? 'addClass' : 'removeClass']('quick_links_min');
			ds.setCookie('ql_collapse', quickLinkCollapsed ? '1' : '', 30);
		}
	};

	quickShell.delegate('a', 'click', function(e){
		var type = getHandlerType(this.className);
		if(type && quickHandlers[type]){
			quickHandlers[type].call(this);
			e.preventDefault();
		}
	});
	
	//Return top
	var scrollTimer, resizeTimer, minWidth = 1350;

	function resizeHandler(){
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(checkScroll, 160);
	}
	function checkResize(){
		quickShell[view.width() > 1340 ? 'removeClass' : 'addClass']('quick_links_dockright');
	}
	function scrollHandler(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(checkResize, 160);
	}
	function checkScroll(){
		view.scrollTop()>100 ? showReturnTop() : hideReturnTop();
	}
	function showReturnTop(){
		quickPanel.addClass('quick_links_allow_gotop');
	}
	function hideReturnTop(){
		quickPanel.removeClass('quick_links_allow_gotop');
	}

	view.bind('scroll.go_top', resizeHandler).bind('resize.quick_links', scrollHandler);
	quickLinkCollapsed && quickShell.addClass('quick_links_min');
	resizeHandler();
	scrollHandler();
})