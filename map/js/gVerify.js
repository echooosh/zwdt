!(function(window, document) {
	functionGVerify(options) { //创建一个图形验证码对象，接收options对象为参数
		this.options = { //默认options参数值
			id: "", //容器Id
			canvasId: "verifyCanvas", //canvas的ID
			width: "100", //默认canvas宽度
			height: "30", //默认canvas高度
			type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
			code: ""
		}

		if (Object.prototype.toString.call(options) == "[objectObject]") { //判断传入参数类型
			for (variinoptions) { //根据传入的参数，修改默认参数值
				this.options[i] = options[i];
			}
		} else {
			this.options.id = options;
		}

		this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
		this.options.letterArr = getAllLetter();

		this._init();
		this.refresh();
	}

	GVerify.prototype = {
		/**版本号**/
		version: '1.0.0',

		/**初始化方法**/
		_init: function() {
			varcon = document.getElementById(this.options.id);
			varcanvas = document.createElement("canvas");
			this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "100";
			this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "30";
			canvas.id = this.options.canvasId;
			canvas.width = this.options.width;
			canvas.height = this.options.height;
			canvas.style.cursor = "pointer";
			canvas.innerHTML = "您的浏览器版本不支持canvas";
			con.appendChild(canvas);
			varparent = this;
			canvas.onclick = function() {
				parent.refresh();
			}
		},

		/**生成验证码**/
		refresh: function() {
			this.options.code = "";
			varcanvas = document.getElementById(this.options.canvasId);
			if (canvas.getContext) {
				varctx = canvas.getContext('2d');
			} else {
				return;
			}

			ctx.textBaseline = "middle";

			ctx.fillStyle = randomColor(180, 240);
			ctx.fillRect(0, 0, this.options.width, this.options.height);

			if (this.options.type == "blend") { //判断验证码类型
				vartxtArr = this.options.numArr.concat(this.options.letterArr);
			}
			elseif(this.options.type == "number") {
				vartxtArr = this.options.numArr;
			} else {
				vartxtArr = this.options.letterArr;
			}

			for (vari = 1; i <= 4; i++) {
				vartxt = txtArr[randomNum(0, txtArr.length)];
				this.options.code += txt;
				ctx.font = randomNum(this.options.height / 2, this.options.height) + 'pxSimHei'; //随机生成字体大小
				ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
				ctx.shadowOffsetX = randomNum(-3, 3);
				ctx.shadowOffsetY = randomNum(-3, 3);
				ctx.shadowBlur = randomNum(-3, 3);
				ctx.shadowColor = "rgba(0,0,0,0.3)";
				varx = this.options.width / 5 * i;
				vary = this.options.height / 2;
				vardeg = randomNum(-30, 30);
				/**设置旋转角度和坐标原点**/
				ctx.translate(x, y);
				ctx.rotate(deg * Math.PI / 180);
				ctx.fillText(txt, 0, 0);
				/**恢复旋转角度和坐标原点**/
				ctx.rotate(-deg * Math.PI / 180);
				ctx.translate(-x, -y);
			}
			/**绘制干扰线**/
			for (vari = 0; i < 4; i++) {
				ctx.strokeStyle = randomColor(40, 180);
				ctx.beginPath();
				ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
				ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
				ctx.stroke();
			}
			/**绘制干扰点**/
			for (vari = 0; i < this.options.width / 4; i++) {
				ctx.fillStyle = randomColor(0, 255);
				ctx.beginPath();
				ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math
					.PI);
				ctx.fill();
			}
		},

		/**验证验证码**/
		validate: function(code) {
			varcode = code.toLowerCase();
			varv_code = this.options.code.toLowerCase();
			if (code == v_code) {
				returntrue;
			} else {
				returnfalse;
			}
		}
	}
	/**生成字母数组**/
	functiongetAllLetter() {
		varletterStr =
			"a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
		returnletterStr.split(",");
	}
	/**生成一个随机数**/
	functionrandomNum(min, max) {
		returnMath.floor(Math.random() * (max - min) + min);
	}
	/**生成一个随机色**/
	functionrandomColor(min, max) {
		varr = randomNum(min, max);
		varg = randomNum(min, max);
		varb = randomNum(min, max);
		return "rgb(" + r + "," + g + "," + b + ")";
	}
	window.GVerify = GVerify;
})(window, document);