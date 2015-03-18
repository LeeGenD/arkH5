(function(){

var CanvasDrawLib = function( canvas, hasShadow){
	this.canvas = canvas || document.getElementById("canvas_3");
	this.ctx = this.canvas.getContext('2d');
	this.W = this.canvas.width;
	this.H = this.canvas.height;
	this.hasShadow = hasShadow || false;
	this.init();
}
CanvasDrawLib.prototype = {
	constructor: CanvasDrawLib,

	init: function(){
		this.rings = [];
		this.ringsByZ = [];
		this.running = false;
		if( this.hasShadow){
			this.ctx.shadowBlur = 10;
			this.ctx.shadowColor = "rgba(0,0,0,0.5)";
		}
	},

	clearScreen: function(){
		this.ctx.clearRect(0,0,this.W,this.H);
	},

	emptyRing: function(){
		this.rings = [];
		this.ringsByZ = [];
	},

	addRing: function( opts){
		/*
		type: normal 普通 animate 逐渐增长
		*/
		opts.type = opts.type || 'normal';
		if( opts.type == 'normal'){

		}
		else{
			var ring = {
				lineWidth: opts.lineWidth,
				color: opts.color,
				degNow: 0,
				start: opts.start,
				degTarget: opts.deg,
				text: opts.text || null,
				z: opts.z || 0,
			};
			this.insertRingByZ(ring);
			this.rings.push(ring);
		}
	},

	//根据z的大小将圆环插入
	insertRingByZ: function( ring){
		for( var i=0,n=this.ringsByZ.length; i<n; i++){
			var ring_now = this.ringsByZ[ i];
			if( ring_now['z'] > ring['z']){
				this.ringsByZ.splice(i,0,ring);
				return;				
			}
		}
		this.ringsByZ.push( ring);
	},

	caculatePeriod: function(){
		if( !this.preTime){
			this.preTime = new Date().getTime();
			return 0;
		}
		var now = new Date().getTime();
		var period = now - this.preTime;
		this.preTime = now;
		return period;
	},

	ringFill: function(){
		for( var i=0,n=this.rings.length; i<n; i++){
			var ring = this.rings[ i];
			ring['degNow'] = ring['degTarget'];
		}
	},

	ringGrow: function(){
		var growValue = this.caculatePeriod()/4;
		for( var i=0,n=this.rings.length; i<n; i++){
			var ring = this.rings[ i];
			if( ring['degNow'] == ring['degTarget']){
				if( i == n-1){
					this.running = false;
				}
				continue;
			}
			else if( ring['degNow'] > ring['degTarget']){
				ring['degNow'] = ring['degTarget'];
				if( i == n-1){
					this.running = false;
				}
			}
			else{
				//ring['degNow'] += ring['degTarget']/25;
				ring['degNow'] += growValue;
				ring['degNow'] = ring['degNow'] > ring['degTarget'] ? ring['degTarget'] : ring['degNow'];
				return;
			}

		}
	},

	draw: function(){
		for( var i=0,n=this.ringsByZ.length; i<n; i++){
			var ring = this.ringsByZ[ i];
			var deg = ring['degNow']+0;
			var r_plus = ring['start'];
			var r = (r_plus+deg);
			var radius = 60;
			var originW = this.W/2;
			var originH = this.H/2;

			originW = 150;
			originH = 150;

			radius += ring['lineWidth'] / 2;

			if( ring['text'] && ring['degNow'] == ring['degTarget']){
				var mid_deg = (r_plus-90+ring['degTarget']/2)/180*Math.PI;
				var x = (radius+46)*Math.cos( mid_deg)+originW;
				var y = (radius+34)*Math.sin( mid_deg)+originH+5;
				this.ctx.textAlign='center';
				this.ctx.font = '10pt Calibri';
				this.ctx.fillStyle = ring['color'];
				this.ctx.fillText(ring['text'],x,y);
			}

			this.ctx.beginPath();
			this.ctx.strokeStyle = ring['color'];
			this.ctx.lineWidth=ring['lineWidth'];
			this.ctx.arc(originW,originH,radius,(r_plus-90)*Math.PI/180,(r-90)*Math.PI/180,false);
			this.ctx.stroke();
		}
	},

	run: function(){
		this.preTime = null;
		this.running = true;
		this.runAnimation();
	},

	stop: function(){
		this.running = false;
	},

	runAnimation: function(){
		var self = this;
		if( this.running){
			if( window.requestAnimationFrame){
				window.requestAnimationFrame( function(){
					self.clearScreen();
					self.draw();
					self.ringGrow();
					self.runAnimation();
				});
			}
			else{
				setTimeout( function(){
					self.clearScreen();
					self.draw();
					self.ringGrow();
					self.runAnimation();
				}, 50);
				// self.ringFill();
				// self.draw();
			}
		}
	}

};

//window.CanvasDrawLib = new CanvasDrawLib(document.getElementById("canvas_3"), true);

})();

// var addRingOnce1 = (function (){

// 	var done = false;

// 	return function(){
// 		if( done){
// 			//CanvasDrawLib.emptyRing();
// 			return;
// 		}

// 		CanvasDrawLib.addRing({
// 			lineWidth: 40,
// 			color: '#2C99FF',
// 			deg: 234,
// 			start: -110,
// 			type: 'animate',
// 			z: 100
// 		});

// 		CanvasDrawLib.addRing({
// 			lineWidth: 35,
// 			color:'#A1BE5A',
// 			deg: 18,
// 			start: 234-110,
// 			type: 'animate',
// 		});

// 		CanvasDrawLib.addRing({
// 			lineWidth: 37,
// 			color:'#FC7C7C',
// 			deg: 108,
// 			start: 252-110,
// 			type: 'animate',
// 			z: 0
// 		});

// 		CanvasDrawLib.run();

// 		done = true;

// 	}

// })();