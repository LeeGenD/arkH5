(function(){

	var format = function(s, json) {
        if (typeof json === 'undefined')
            return s;

        var k = /([.*+?^=!:${}()|[\]\/\\])/g,
            l = "{".replace(k, "\\$1"),
            r = "}".replace(k, "\\$1");
        var r1 = (new RegExp("#" + l + "([^" + l + r + "]+)" + r, "g")),
            r2 = (new RegExp("#" + l + "(\\d+)" + r, "g"));
        if (typeof(json) == "object") {
            return s.replace(r1, function(a, key) {
                var v = json[key];
                if (typeof v == 'function') {
                    v = v(key);
                }
                return typeof(v) == 'undefined' ? "" : v;
            });
        } else if (typeof(json) != "undefined") {
            var vs = Array.prototype.slice.call(arguments, 1); //第一个参数是目标字符串，之后的才是要替换的字符
            var vl = vs.length;
            return s.replace(r2, function(a, index) {
                index = parseInt(index, 10);
                return (index >= vl) ? a : vs[index];
            });
        }
    };

    // 基础元素
	var base = function( opts){
		this.info = $.extend( true, {
			position: {
				type: 'normal',// 'normal':任意位置 'middle':居中
				left: null,
				right: null,
				top: null,
				bottom: null
			},
			width: null,
			height: null,
			tmp: '<div class="#{className}">#{extendTmp}</div>', // 模板
			extendTmp: '',
			text: ''
		}, opts);

		this.initTmp();
		this.init();
	}

	base.prototype = {
		constructor: base,

		classList: {
			'normal': 'cuty-element-anyposition',
			'middle': 'cuty-element-middle'
		},

		//初始化模板
		initTmp: function(){
			var className = 'cuty-element';

			className += ' '+this.classList[ this.info.position.type];
			this.info.tmp = format( this.info.tmp, {
				className: className,
				extendTmp: this.info.extendTmp
			});

		},

		init: function(){
			this.createElement();
			this.setPositionAndSize();
			this.setStyle();
		},

		// 创建元素
		createElement: function(){
			var $element = $( this.info.tmp);
			return this.$element = $element.length ? $element : null;
		},

		// 设置位置和大小
		setPositionAndSize: function(){
			if( this.$element){
				this.$element.css({
					left: this.info.position.left,
					right: this.info.position.right,
					top: this.info.position.top,
					bottom: this.info.position.bottom,
					width: this.info.width,
					height: this.info.height
				});
			}
		},

		// 设置样式
		setStyle: function(){
			if( this.info.bgimg){
				this.$element.css({
					'background-image': 'url("'+this.info.bgimg+'")',
				});
			}
			if( this.info.style){
				this.$element.css( this.info.style);
			}
			if( this.info.text){
				this.$element.html( this.info.text);
			}
		}
	};

	var charElement = function( opts){
		opts = $.extend( {
			bgimg: null,
			extendTmp: this.extendTmp,
			chartData: {
				data: {
					'蛋蛋后': {
						value: 36.3,
						color: '#2C99FF'
					},
					'小鲜肉': {
						value: 44.1,
						color: '#FC7C7C'
					},
					'有为青年': {
						value: 13.2,
						color: '#A1BE5A'
					},
					'怪蜀黎': {
						value: 6.4,
						color: '#FFA841'
					}
				},
				width: 20,
				space: 10,
				heightFac: 3,
				valueTmp: '#{value}%'

			}
		}, opts, {
		});

		this.opts = opts;
		this.base = new base( opts);
		this.$element = this.base.$element;
		this.init( opts);
	}

	charElement.prototype = {

		constructor: charElement,

		extendTmp: [
			'<div class="chart-container"></div>'
		].join(''),

		chartBarTmp: [
			'<span class="chart-bar" style="height:#{height}px;background-color:#{color};color:#{color};',
					'width:#{width}px;margin-right:#{space}px;">',
				'<span class="chart-bar-name">#{bar_name}</span>',
				'<span class="chart-bar-value">#{value}</span>',
			'</span>',
		].join(''),

		init: function( opts){

			this.createChart( opts.chartData);
		},

		createChart: function( chartData){
			var self = this;
			this.$chartContainer = this.base.$element.find('.chart-container');

			$.each( chartData.data, function( i, d){

				var $chartBar = $( format( self.chartBarTmp, {
					height: d.value*chartData.heightFac,
					color: d.color || 'black',
					width: chartData.width || 10,
					space: chartData.space,
					bar_name: i,
					value: format(chartData.valueTmp, {
						value: d.value
					})
				}));

				self.$chartContainer.append( $chartBar);
			});

			this.$chartContainer.after( '<div class="chart-index"></div>');
		}

	};

	window.cutyElement = {
		base: base,
		charElement: charElement
	}
})();