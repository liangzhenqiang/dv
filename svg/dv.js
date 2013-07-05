~~(function(document){
	var dv = (function(){
		var dv = {};
		dv.select = dv.selectAll = function(selector, context){
			return new dv.fn.init(selector, context);	
		};
		dv.fn = dv.prototype = {
			init: function(selector, context){
				if(!selector)
					return this;
				if(selector.nodeType){
					this[0] = selector;
					this.length = 1;
					return this;	
				}
				if(selector == "body" && !context && document.body){
					this[0] = document.body;
					this.length = 1;
					this.context = document;
					return this;	
				}
				var match,
					elem;
				if(typeof selector === "string"){
					match = /^(?:\*?(\.|#)([a-z_\u00C0-\uFFEE\-][\w\u00C0-\uFFEE\-]*)|(\w+)(?:\s*,\s*(\w+)(?:\s*,\s*(\w+))?)?|(\w+)\s+(\w+)(?:\s+(\w+))?)$/i.exec(selector);
					//id or class
					if(match[1]){
						if(match[1] === "."){
							if(document.getElementsByClassName){
								selector = (context || document).getElementsByClassName(match[2]);
								return this.merge(this, selector);
							}
							else{
								var elems = (context || document).getElementsByTagName("*"),
									name = match[2].replace(/^\s+|\s+$/g, "").split(/\s+/),
									len = name.length,
									i = 0,
									j = -1,
									unquery = {},
									newName = [],
									nodes = [],
									regx,
									m;
								if(len > 1){
									while(elem = elems[i++]){
										if(elem in unquery){
											unquery[elem] = 1;
											newName[++j] = elem;
										}
									}
									name = newName;
									len = j + 1;
								}
								regx = RegExp("(?:^| )(" + name.join("|") + ")(?:$|(?= ))", "g");
								i = 0;
								j = -1;
								while(elem = elems[i++]){
									if(elem.className){
										m = elem.className.match(regx);
										if(m && m.length >= len){
											nodes[++j] = elem;
										}
									}
								}
								//alert(nodes)
								return this.merge(this, nodes);
							}
						}
						//id
						elem = ((context || document).ownerDocument || document).getElementById(match[2]);
						if(elem){
							this[0] = elem;
							this.length = 1;	
						}
						return this;
					}
					//tag E,F
					if(match[3]){
						var m1 = match[3],
							m2 = match[4],
							m3 = match[5],
							unquery = {},//查询过的
							arrays = [],
							nodes1,
							nodes2,
							nodes3;
						unquery[m1] = 1;
						nodes1 = this.toArray((context || document).getElementsByTagName(m1));
						if(m2 && !(m2 in unquery)){
							unquery[m2] = 1;
							nodes2 = this.toArray((context || document).getElementsByTagName(m2));
						}
						if(m3 && !(m3 in unquery)){
							unquery[m3] = 1;
							nodes3 = this.toArray((context || document).getElementsByTagName(m3));
						}
						return this.merge(this, [].concat(nodes1 || [], nodes2 || [], nodes3 || []));
					}
					//tag E F
					var m1 = match[6],
						m2 = match[7],
						m3 = match[8],
						array = [],
						unquery = {},
						nodes1 = (context || document).getElementsByTagName(m1),
						nodes2,
						nodes3,
						x = -1;
					for(var i = 0, len = nodes1.length; i < len; i++){
						nodes2 = nodes1[i].getElementsByTagName(m2);
						for(var j = 0; j < nodes2.length; j++){
							if(m3){
								nodes3 = nodes2[j].getElementsByTagName(m3);
								for(var k = 0; k < nodes3.length; k++){
									elem = nodes3[k];
									var uid = Math.random();//i + j + k;
									if(!(uid in unquery)){
										unquery[uid] = 1;
										array[++x] = elem;	
									}
								}
							}
							else{
								elem = nodes2[j];
								var uid = Math.random();
								if(!(uid in unquery)){
									unquery[uid] = 1;
									array[++x] = elem;
								}	
							}	
						}
					}
					alert(array);
					return this.merge(this, array);
				}
				return this;
			},
			length: 0,
			each: function(fn,scope){
				var i = 0, len = this.length;
				for(; i ^ len; i++)
					if(fn.call(scope || this[i], this[i], i, this) === false) return i;
				return this;
			},
			merge: function(first, second){
				var len = 0,
					i = 0;
				while(second[i]){
					first[len++] = second[i++];	
				}
				first.length = len;
				return first;
			},
			toArray: function(array){
				try{
					return Array.prototype.slice.apply(array || this, 0);
				}
				catch(err){
					return Array.prototype.concat.apply([], array || []);	
				}
			},
			splice: [].splice
		};
		dv.fn.init.prototype = dv.fn;
		dv.extend = dv.fn.extend = function(){
			var target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false,
				prop;
			if(target.constructor == Boolean){
				deep = target;
				target = arguments[1] || {};//深度复制	
			}
			if(length == 1){
				target = this;
				i = 0;
			}
			//多继承
			for(; i < length; i++){
				if((prop = arguments[i]) != null){
					//复制对象
					for(var p in prop){
						if(target == prop[p])
							continue;//对象已经存在
						
						if(deep && typeof prop[i] == "object" && target[p]){
							d3.extend(target[p], prop[p]);	
						}
						else if(prop[p]){
							target[p] = prop[p];	
						}
					}
				}
			}
			return target;
		};
		//return (window.dv = new dv());
		return (this["dv"] = dv);
	})();
	dv.fn.extend({
		append: function(type){
			var element;
			if(!this.length)
				throw "not element.";
			for(var i = 0; i < this.length; i++){
				if(typeof type === "string"){
					element = this[i].appendChild(document.createElement(type));
				}
			}
			return dv.select(element);
		},
		attr: function(name, value){
			if(!value && typeof name === "string"){
				var el = this[0],
					attr = el.getAttribute(name);
				if(attr)
					return attr.toString();
				return undefined;
			}
			if(typeof name !== "object"){
				var t = {};
				t[name] = value;
				name = t;	
			}
			for(var i = 0; i < this.length; i++){
				for(var p in name){
					this[i].setAttribute(p, name[p]);
				}
			}
			return this;
		},
		css: function(name, value){
			if(!value && typeof name === "string"){
				var el = this[0];
				if(el.style[name]){
					return el.style[name];	
				}
				else if(el.currentStyle){
					return el.currentStyle[name];	
				}
				else if(document.defaultView && document.defaultView.getComputedStyle){
					var name = name.replace(/(A-Z)/g, "-$1").toLowerCase(),
						style = document.defaultView.getComputedStyle(el, null);
					if(style){
						return style.getPropertyValue(name);
					}
				}
				else
					return null;
			}
			if(typeof name !== "object"){
				var t = {};
				t[name] = value;
				name = t;	
			}
			for(var i = 0; i < this.length; i++){
				for(var p in name){
					this[i].setAttribute(p, name[p]);
					this[i].style[p] = name[p];	
				}
			}
			return this;
		}
	});
	dv.fn.extend({
		isReady: false,
		readyList: [],
		ready: function(fn){
			var loaded = false,
				readyFunc = function(){
					if(loaded) return;
					loaded = true;
					fn();
				};
			var call = function(){
				if(document.addEventListener){
					document.addEventListener("DOMContentLoaded", readyFunc);	
				}
				else if(document.attachEvent){
					document.attachEvent("onreadystatechange",function(){
						if(document.readyState == "complete") readyFunc();
					});
					if(document.documentElement.doScroll && typeof window.frameElement==="undefined"){
						var ieReadyFunc = function(){
							if(loaded) return;
							try{
								document.documentElement.doScroll("left");
							}
							catch(ex){
								window.setTimeout(ieReadyFunc,0);
								return;
							}
							readyFunc();
						};
						ieReadyFunc();
					}
				}
				else
					window.onload = readyFunc;
			}
			if(!this.isReady){
				this.isReady = true;
				if(this.readyList){
					for(var i = 0; i < this.readyList.length; i++){
						this.readyList[i].apply(document);	
					}
					this.readyList = null;
				}	
			}
			if(this.isReady){
				call.apply(document);
			}
			else{
				this.readyList.push(call);
			}
			return this;
		}
	});
	dv.ns = dv.namespace = function(){
		var len = arguments.length,
			i = 0,
			d,
			o;
		for(; i < len; i++){
			d = arguments[i].split(".");
			o = window[d[0]] = window[d[0]] || {};
			for(var j = 0, s = d.slice(1); j < s.length; j++){
				o = o[s[j]] = o[s[j]] || {};
			}
		}
		return o;
	};
	//animation
	dv.fn.extend({
		animate: function(prop, ms, easing, callback){
			var fx = this;
			/*if(typeof d === "object"){
				delay = d.delay;
				easing = d.easing;
				d = d.duration;	
			}*/
			this.timeout = setTimeout(function(){
				ms = ms || 1000;
				easing = easing || "<>";
				var interval = 1000 / 60,
					start = new Date().getTime(),
					finish = start + ms,
					duration = ms,
					cur = 0,//fx.getStyle("left"),
					keys = [];//要动画的属性
				
				fx.interval = setInterval(function(){
					var time = new Date().getTime(),
						pos = time > finish ? 1 : (time - start) / ms,
						n = time - start,
						state = n / duration,
						i;
					//console.log(skeys)
					pos = easing == "<>" ? (-Math.cos(pos * Math.PI) / 2) + 0.5 :
						easing == ">" ? Math.sin(pos * Math.PI / 2) :
						easing == "<" ? -Math.cos(pos * Math.PI / 2) + 1 :
						easing == "-" ? pos :
						typeof easing == "function" ? easing(state, n, 0, 1, duration) : pos;
						//a.easing[easing](state, n, 0, 1, duration);
					//动画设置变量
					for(var i = 0; i ^ fx.length; i++){
						for(var p in prop){
							cur = dv.selectAll(fx[i]).css(p);
							cur = cur == "auto" ? 0 : parseFloat(cur);
							fx.css(p, fx._at({
								"from": parseFloat(cur, 10),
								"to": prop[p]	
							}, pos) + "px");
						}
					}
					if(fx._during){
						for(var i = 0; i < fx.length; i++){
							fx._during.call(fx[i], pos, function(from, to){
								return fx._at({"from" : from, "to": to}, pos);	
							});
						}
					}
					if(time > finish){
						clearInterval(fx.interval);
						for(var i = 0; i < fx.length; i++){
							fx._after ? fx._after.apply(fx[i], [fx]) : fx.stop();
							callback && callback.call(fx[i]);
						}
					}
				}, ms > interval ? interval : ms);
			}, 13);	
			return this;
		},
		during: function(during){
			this._during = during;
			return this;	
		},
		after: function(after){
			this_after = after;
			return this;	
		},
		stop: function(){
			clearTimeout(this.timeout);
			clearInterval(this.interval);
			this.styles = {};
			delete this._after;
			delete this._during;
			return this;
		},
		_at: function(o, pos){
			if(typeof o.from == "number"){
				return o.from + (o.to - o.from) * pos;
			}
			else{
				return this._unit(o, pos);
				//return /^([\d\.]+)([a-z%]{0,2})$/.test(o.to) ? this._unit(o, pos) : o.to && (o.to.r || colorTest(o.to)) ? this._color(o, pos) : pos < 1 ? o.from : o.to;
			}
		},
		_unit: function(o, pos){
			var r = /^([\d\.]+)([a-z%]{0,2})$/,
				match = r.exec(o.from.toString()),
				from = parseFloat(match ? match[1] : 0);
			match = /^([\d\.]+)([a-z%]{0,2})$/.exec(o.to);
			return (from + (parseFloat(match[1]) - from) * pos) + match[2];
		}
	});
}).call(this, document);
(function(R){
	var namespace = "http://www.w3.org/2000/svg";
	dv.fn.extend({
		constructor: function(){
			var r = Raphael(this[0]),
				self = this;
			this.rootElement = r.canvas;
			//this.canvas = r;
			//console.log(r.top)
			r.__proto__.g = function(){
				var p = r.rect();
				p.node.parentNode.removeChild(p.node);
				p.type = "g";
				var g = document.createElementNS(namespace, "g");
				//this.bottom[0] = g;
				this.top.node = g;
				return p;
			};
			return r;
		},
		append: function(type){
			if(type == "svg"){
				R.canvas = this.constructor();
				return dv.select(this.rootElement);
			}
			else{
				var el;
				for(var i = 0; i < this.length; i++){
					//console.log(this[type])
					if(this[type]){
						var r = this[type]();
						el = this[i].appendChild(r.node);
					}
					else{
						el = this[i].appendChild(document.createElement(type));
					}
				}
				return dv.select(el);//this.select(r.node);
			}
		},
		rect: function(){
			var element = R.canvas.rect(0, 0, 90, 90);
			return element;
		},
		g: function(){
			var element = R.canvas.g();
			return element;
		},
		path: function(){
			var element = R.canvas.path();
			return element;
		},
		circle: function(cx, cy, r){
			var element = R.canvas.circle(cx | 8, cy | 8, r | 8);
			return element;
		},
		animate: function(prop, ms, easing, fn){
			console.log(this.dp);
			//this.animate(prop, ms, easing, fn);
		}
	});
})(Raphael);