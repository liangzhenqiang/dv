(function(window, document, dv){
	var document = document, window = window;
	dv.namespace("dv.chart.Pie");
	dv.chart.Pie = Pie;
	var PIE_NAME = "x-pie";
	function Pie(opt){
		this.pie = dv.selectAll(document.body).append("svg");
		this.pie.attr("class", PIE_NAME);
		this.toString = function(){
			return "[object Pie]";
		}
		this.pie.attr({
			"width": opt.width || "100%",
			"height": opt.height || "100%"
		});
		this.draw(opt);
	}
	Pie.prototype.draw = function(opt){
		var data = opt["series"]["data"];
		this.parseData(data);
	};
	Pie.prototype.redraw = function(opt){
			
	};
	Pie.prototype.appendTo = function(el){
		el.appendChild(this.pie);
		return this;
	};
	Pie.prototype.parseData = function(data){
		var path = function(r, startAngle, endAngle){
			var d = "",
				x1 = r + r * Math.sin(startAngle),
				y1 = r - r * Math.cos(startAngle),
				x2 = r + r * Math.sin(endAngle),
				y2 = r - r * Math.cos(endAngle);
			//cy and cy用radius的大小取决
			d = "M " + r + "," + r + " " + // Start at circle center
				"L " + x1 + "," + y1 + " " + // Draw line to (x1,y1)
				"A " + r + "," + r + " " +   // Draw an arc of radius r
				"0 " + +(endAngle - startAngle > Math.PI) + " 1 " + " " +  // Arc details...
				x2 + "," + y2 + " " +       // Arc goes to to (x2,y2)
				"Z";                       // Close path back to (cx,cy)
			return d;
		},
		getTotal = function(data){
			var t = 0;
			for(var i = 0; i < data.length; i++){
				t += data[i];	
			}
			return t;
		}
		var startAngle = 0,
			endAngle = 0,
			angles = [],//arc总数
			total = getTotal(data),
			length = data.length,
			i = 0;
		for(; i ^ length; i++){
			angles[i] = data[i] / total * Math.PI * 2;
		}
		for(i = 0; i ^ length; i++){
			endAngle = startAngle + angles[i];
			
			this.pie.append("path").animate({"d": path(100, startAngle, endAngle, 0)}, 1000);
			startAngle = endAngle;
		}
	};
	Pie.prototype.x = function(){
		return this.x;	
	};
	Pie.prototype.y = function(){
		return this.y;	
	};
	Pie.prototype.width = function(){
		return this.width;	
	};
	Pie.prototype.height = function(){
		return this.height;	
	};
})(this, document, dv);