( function(){
	var page = function( pageconfs){
		this.slideStartFunctionList = [];
		this.slideOverFunctionList = [];
		this.init( pageconfs);
	}

	page.prototype = {

		constructor: page,

		containerTmp : [
			'<div id="slidePageContainer">',
			'</div>'
		].join(''),

		childPageTmp: [
			'<div class="slideChildPage">',
			'</div>'
		].join(''),

		childPages: [],

		init: function( opts){
			this.initPageNow();
			this.pageLen = opts['pageconfs'].length;
			this.createPageContainer( opts['container']);
			this.createPages( opts['pageconfs']);
			this.addSlideOverEvent( $.proxy( this.setCurClass, this));
			this.pageTo( this.pageNow);
			this.bindEvents();
		},

		initPageNow: function(){
			var index = window.location.href.indexOf('#');
			if( index == -1){
				this.pageNow = 0;
			}
			else{
				this.pageNow = parseInt( window.location.href.substr( index+1));
				this.pageNow = this.pageNow >= 0 ? this.pageNow : 0;
			}
			console.log( this.pageNow);
		},

		// 创建容器
		createPageContainer: function( wrap){
			this.$container = $(this.containerTmp);
			this.$container.appendTo( wrap || $('body'));
		},

		// 创建一个子页面
		createOnePage: function( pageconf){
			var $childPage = $(this.childPageTmp);
			if( pageconf.bgimg){
				$childPage.css({
					'background-image': 'url("'+pageconf.bgimg+'")',
				});
			}
			else if( pageconf.bg){
				$childPage.css({
					background: pageconf.bg,
				});
			}
			if( pageconf.style){
				$childPage.css( pageconf.style);
			}
			this.childPages.push( $childPage);
			this.$container.append( $childPage);
		},

		// 创建所有的子页面
		createPages: function( pages){
			for( var i=0,n=pages.length; i<n; i++){
				this.createOnePage( pages[ i]);
			}
		},

		// 设置现在页面的class值，标记显示中的页面
		setCurClass: function(){
			this.$container.find('.cur').removeClass('cur');
			this.childPages[ this.pageNow].addClass('cur');
		},

		pageTo: function( page_now){
			this.slideStart();
			this.pageNow = page_now;
			this.wrapperTransform();
			setTimeout( $.proxy( this.slideOver, this), 400, this.pageNow);
		},

		slideStart: function(){
			var pageNow = this.pageNow;
			$.each( this.slideStartFunctionList, function( i, func){
				func( pageNow);
			});
		},

		slideOver: function( pageNow){
			$.each( this.slideOverFunctionList, function( i, func){
				func( pageNow);
			});
		},

		pageUp: function(){
			var page_now = this.pageNow - 1;
			if( page_now < 0){
				page_now = 0;
				return;
			}
			//location.hash = 'page_'+this.pageNow;
			this.pageTo( page_now);
		},

		pageDown: function(){
			var page_now = this.pageNow + 1;
			if( page_now >= this.pageLen){
				page_now = this.pageLen;
				return;
			}
			//location.hash = 'page_'+this.pageNow;
			this.pageTo( page_now);
		},

		// 使用css3来滑动页面
		wrapperTransform: function( callback){
			var window_height = $(window).height();
			var first_top = this.childPages[0].offset().top;
			var now_view_top = this.childPages[ this.pageNow].offset().top;
			var transform_y = first_top - now_view_top;//- window_height * (this.pageNow-1);

			this.$container.css({
				'-webkit-transform': 'translate3d(0px, '+transform_y+'px, 0px)',
				'transform': 'translate3d(0px, '+transform_y+'px, 0px)',
			});

			if( $.isFunction(callback)){
				callback( this.pageNow);
			}

		},

		bindEvents: function(){
			var self = this;
			document.addEventListener("touchmove",function(e){
		        e.preventDefault();  
		    });
			$('body').swipeUp(function(){
				self.pageDown();
			});
			$('body').swipeDown(function(){
				self.pageUp();

			});
			$('body').click( function( e){
				
			});
			$('body').keydown( function(e){
				var keyCodeMap = {
					38: 'up',
					40: 'down',
				}
				var keyCode = e.keyCode;
				if( keyCodeMap[keyCode] == 'up'){
					self.pageUp();
				}
				else if( keyCodeMap[keyCode] == 'down'){
					self.pageDown();
				}

			});

			this.$container[0].addEventListener( 'webkitAnimationEnd', function(){
				// 为什么没用。。
			});
		},

		addSlideOverEvent: function( callback){
			if( $.isFunction( callback)){
				this.slideOverFunctionList.push( callback);
			}
		},

		addSlideStartEvent: function( callback){
			if( $.isFunction( callback)){
				this.slideStartFunctionList.push( callback);
			}
		}

	}

	window.slidePage = page;
})();