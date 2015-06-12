// 定义全局变量
if ( typeof(ninejs) === "undefined" ) {
	var ninejs = {};
}

;(function( scope ) {
	// 脚本描述
	scope.author = "zjanhoo";
	scope.email = "zjanhoo@163.com";
	scope.update = "2015-06-12";

	// 定义常量
	scope.PATH = "";
	scope.NS = "nine";

	scope.extend = function () {
		var args = Array.prototype.slice.call(arguments),
			str_proto = Object.prototype.toString,
			source = args.pop(),
			target;

		if ( !source ) return Object;
		target = args[0] || {};

		if ( typeof(source) === "object" ) {
			for ( var prop in source ) {
				if ( source.hasOwnProperty(prop) ) {
					if ( typeof(source[prop]) === "object" ) {
						target[prop] = str_proto.call(source[prop]) === "[object Object]" ? {} : [];
						scope.extend(target[prop],source[prop]);
					} else {
						target[prop] = source[prop];
					}
				}
			}
		} else if ( typeof(source) === "function" ) {
			source = source.call(this,scope) || {};
			scope.extend(target,source);
		}

		return target;
	};

	// Utils
	scope.extend(scope, function( exports ) {
		var Utils = {},
			str_proto = Object.prototype.toString,
			own_proto = Object.prototype.hasOwnProperty;

		/* DOM操作函数 */
		Utils.getElemById = function ( id ) {	// 得到对象
			return typeof(id) === "string" ? document.getElementById(id) : null;
		};
		Utils.getElemByClass = function( name, context ) {
			var ret = [],
				elements, classArr;
			
			context = context || document;

			if ( context.getElementsByClassName ) {
				elements = context.getElementsByClassName(name);
				for ( var i = 0, len = elements.length; i < len; i++ ) {
					ret.push(elements[i]);
				}
			} else {
				elements = context.getElementsByTagName("*");
				for ( var i = 0, len = elements.length;i < len;i++ ) {
					classArr = elements[i].className.split(" ");
					for ( var j = 0, length = classArr.length;j < length;j++ ) {
						if ( classArr[j] == name ) {
							ret.push( elements[i] );
							break;
						}
					}
				}
			}

			return ret;
		};
		Utils.getElemByTag = function( name, context ) {
			var ret = [],
				elements;
			
			context = context || document;
			elements = context.getElementsByTagName(name);

			for ( var i = 0, len = elements.length; i < len; i++ ) {
				ret.push(elements[i]);
			}

			return ret;
		};
		Utils.createElement = function( tag ) {	// 判断DOM对象
			return document.createElement(tag || 'div');
		};
		Utils.css = function( node, attr ) {	// 设置/获取样式
			var style_arr1 = ['opacity','color','display','overflow','position','zIndex','cursor','fontFamily','textAlign','border','background'],
				style_arr2 = ['left','top','width','height','fontSize','lineHeight','fontWeight'],	
				node_arr = ['innerHTML','className','id','src','name','text','type','title','value','width','height','resize','border','className','cellSpacing','cellPadding','selected'],
				userAgent = navigator.userAgent.toLowerCase();
			
			if ( exports.isRealObject(attr) ) {
				var style = node.style,
					v1, v2;

				for ( var i in attr ) {
					v1 = attr[i];

					if ( v1 == node['_' + i] ) {
						continue;
					} else {
						node['_' + i] = v1;
					}

					if ( exports.inArray(i, style_arr1) ) {
						if ( i == "opacity" ) {
							if ( userAgent.indexOf('ie 6') > -1 || userAgent.indexOf('ie 7') > -1 ) {
								style.filter = 'alpha(opacity=' + Math.round(v1*100) + ')';
							} else if ( userAgent.indexOf('ie 8') > -1 ) {
								style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + Math.round(v1*100) + ')';
							} else {
								style.opacity = v1;
							}
						} else {
							style[i] = v1;
						}
					} else if ( exports.inArray(i, style_arr2) ) {
						v2 = parseInt(v1);
						v2 = isNaN(v2) ? 0 : (Math.round(v2) + 'px');

						style[i] = v2;
					} else if ( exports.inArray(i, node_arr) ) {
						node[i] = v1;
					} else {
						style[i] = v1;
					}
				}
			} else if ( exports.isString(attr) ) {
				return exports.getStyle(node, attr);
			}
		};
		Utils.attr = function( node, key, value ) {
			if ( arguments.length < 2 ) return;
			
			if ( !value ) {
				return node.getAttribute(key);
			} else {
				node.setAttribute(key, value);
			}
		};
		Utils.removeAttr = function( node, key ) {
			node.removeAttribute(key);
		};
		Utils.html = function( node, html ) {
			exports.css(node, {innerHTML: html || ''});
		};
		Utils.hide = function( node ) {	// 隐藏DOM
			exports.css(node, {display: 'none'});
		};
		Utils.show = function( node ) {	// 显示DOM
			exports.css(node, {display: node.display || 'block'});
		};	
		Utils.appendChild = function( parentNode, css, tag ) {	// 添加DOM节点
			var childNode = exports.createElement(tag);
			if ( css ) {
				exports.css(childNode, css);
			}
			parentNode = parentNode || document.body;
			parentNode.appendChild(childNode);

			return childNode;
		};
		Utils.removeChild = function( el ) {	// 删除DOM节点
			if ( el && el.nodeType && el.parentNode ) {
				el.parentNode.removeChild(el);
			}
		};
		Utils.getFlashElemByName = function( movieName ) {	// 浏览器兼容访问DOM
			if ( navigator.appName.indexOf("Microsoft") != -1 ) {
				return window[movieName];
			} else {
				return document[movieName];
			}
		};
		Utils.getStyle = function( elem, key ) {	// 得到样式
			return elem.currentStyle ? elem.currentStyle[key] : document.defaultView.getComputedStyle(elem, null).getPropertyValue(key);
		};
		Utils.setStyle = function( elem, key, value ) {
			if ( !value ) return;
			elem.style[ key ] = value;
		};
		Utils.addClass = function( elem, className ) {
			var flag = false, arr = [];

			if ( exports.isString( elem.className ) && exports.isString( className ) ) {
				if ( elem.className.length > 0 ) {
					arr = elem.className.split(" ");
					for ( var i = 0, len = arr.length; i < len; i++ ) {
						if ( arr[i] == className ) {
							flag = true;
							break;
						}
					}
					!flag && (elem.className += " " + className);
				} else {
					elem.className = className;
				}
			}
		};
		Utils.removeClass = function( elem, className ) {
			var arr = [], newArr = [];

			if ( exports.isString( elem.className ) && exports.isString( className ) && elem.className.length > 0 ) {
				arr = elem.className.split(" ");

				for (var i = 0, len = arr.length; i < len; i++) {
					arr[i] != className && newArr.push(arr[i]);
				}

				elem.className = newArr.join(" ");
			}
		};
		Utils.hasClass = function( elem, className ) {
			var flag = false, re;
			
			if ( exports.isString( className )) {
				re = new RegExp("(^|\\s)" + className + "(\\s|$)");
				flag = re.test( elem.className );
			}

			return flag;					
		};
		Utils.enable3D = function( node, perspective, perspectiveOrigin ) {
			if ( node.style ) {
				node.style[ exports.BrowserEntry.cssPrefix + 'TransformStyle' ] = 'preserve-3d';
				if ( perspective ) {
					node.style[ pre + 'Perspective' ] = perspective + 'px';
				}
				if ( perspectiveOrigin ) {
					node.style[ pre + 'PerspectiveOrigin' ] = perspectiveOrigin;
				}
			}
		};
		Utils.set3D = function( node, css3d ) {
			if ( node.style ) {
				node.style[ exports.BrowserEntry.cssPrefix + 'Transform' ] = (
					  'rotateX(' + (css3d.rx || 0) + 'deg) '
					+ 'rotateY(' + (css3d.ry || 0) + 'deg) '
					+ 'rotateZ(' + (css3d.rz || 0) + 'deg) '
					+ 'translate3d(' 
					+ (css3d.tx || 0) + 'px, '
					+ (css3d.ty || 0) + 'px, '
					+ (css3d.tz || 0) + 'px) '
					+ 'scale(' + (css3d.sc || 1) + ')'
				);
			}
		};
		/* 类型判断函数 */		
	        Utils.isFunction = function( obj ) {	// 判断是否是函数
	            return typeof( obj ) === "function";
	        };
	        Utils.isString = function( obj ) {	// 判断是否是字符串
	            return typeof( obj ) === "string";
	        };
	        Utils.isBoolean = function(){	// 判断是否是布尔值
	            return typeof( obj ) === "boolean";
	        };
	        Utils.isNumber = function( obj ) {	// 判断是否是数值
	            return typeof( obj ) === "number";
	        };
	        Utils.isObject = function( obj ) {	// 判断是否是对象
	            return typeof( obj ) === "object";
	        };
		Utils.isUndefined = function( obj ) {	// 判断是否是undefined对象
			return typeof(obj) === "undefined";
		};
		Utils.isNaN = function( obj ) {		// 判断是否是NaN对象
			return obj == null || /\d/.test( obj ) === false || isNaN( obj );
		};
		Utils.isNumeric = function( obj ) {	// 判断是否是数值
			return !isNaN( parseFloat(obj) ) && isFinite( obj );
		};
		Utils.isRegExp = function( obj ) {	// 判断是否是正则表达式
			return str_proto.call( obj ) === "[object RegExp]";
		};
		Utils.isArray = function ( arr ) {	// 判断是否是数组
			return str_proto.call(arr) === "[object Array]";
		};
        Utils.isRealObject = function( obj ) {	// 判断是否是实体对象
            return str_proto.call(obj) === "[object Object]";
        };
		Utils.isDate = function( obj ) {	// 判断是否是日期
			return str_proto.call(obj) === "[object Date]";
		};
		Utils.isWindow = function( obj ) {	// 判断是否是window对象
			return obj && Utils.isObject(obj) && "setInterval" in obj;
		};
		Utils.isEmptyObject = function( obj ) {	// 判断是否是空对象
			for ( var i in obj ) {
				return false;
			}
			return true;
		};
		/* 数组处理函数 */		
		Utils.inArray = function ( el, arr ) {	// 在某个数组中是否存在某个元素
			for ( var i = 0,len = arr.length; i < len; i++ ) {
				if ( el == arr[i] ) return true;	
			}
			return false;
		};
		Utils.each = function( object, callback, args ) {
			var name,
				i = 0,
				length = object.length;

			if ( args ) {
				if ( length === undefined ) {
					for ( name in object ) {
						if ( callback.apply( object[ name ], args ) === false ) break;
					}
				} else
					for ( ; i < length; ) {
						if ( callback.apply( object[ i++ ], args ) === false ) break;
					}
			} else {
				if ( length === undefined ) {
					for ( name in object ) {
						if ( callback.call( object[ name ], name, object[ name ] ) === false ) break;
					}
				} else
					for ( var value = object[0]; i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}

			return object;
		};		
		exports.forEach = function( arr, fn, obj ) {	// forEach函数
			var scope = obj || window;

			for ( var i = 0, len = arr.length; i < len; i++ ) {
				fn.call(scope, arr[i], i, arr);
			}
		};
		/* 字符处理函数 */
		Utils.stringFormat = function ( str, arr ) { // 格式化字符串
			if (!str) return false;
			if (!arr || (arr && !Utils.isArray(arr))) return false;
			
			return str.replace(/\{(\d+)\}/g, function( m, i ) {
				return arr[i];
			});
		};		
		Utils.ltrim = function( str ) {	// 去年字符串左边的空格
			return str.replace(/^\s*/g, "");
		};
		Utils.rtrim = function( str ) {	// 去年字符串右边的空格
			return str.replace(/\s*$/g, "");
		};
		Utils.trim = function ( str ) {	// 清除两边空格
			return str.replace(/(^\s*)|(\s*$)/g, "");
		};
		Utils.formatId = function ( id ) {// 格式化ID
			var str = '';
			
			if ( id.toString().length == 1 ) {
				str = '00' + id;
			} else if( id.toString().length == 2 ) {
				str = '0' + id;
			}
			
			return str;
		};
		Utils.safeFilter = function ( str ) {
			str = str.replace(/<\/?(iframe|script|object|embed|style|link)[^>]*>/gim, '');
			return str;
		};
		Utils.htmlFilter = function( str ) {	// 过滤HTML标签
			return str.replace(/<\/?[^>]*>/g, '');
		};
		Utils.getParams = function( queryVar, url ) {	// 取得地址栏中某个参数的值
			var url = url || window.location.href,
				re = new RegExp(".*[\?|&]" + queryVar + "=([^&#]+).*", "g");

			return url.match(re) ? url.replace(re, "$1") : '';
		};
		Utils.getHash = function() {
			var url = window.location.hash,
				svalue = parseInt(url.substr(1));

			return isNaN(svalue) ? 0 : svalue;
		};
		Utils.urlDecode = function( url ) {	// 将地址栏中?后面的参数转换成对象返回
			var search, parts, value;

			url = url || window.location.href;
			search = url.match(/\?.*/);

			if ( search.length > 1 ) {
				search = search[0].substr(1);
				parts = search.split('&');

				for ( var i = 0, len = parts.length; i < len; i++ ) {
					value = parts[i].split('=');
					if ( value.length == 2 ) {
						ret[value[0]] = decodeURIComponent(value[1].replace(/\+/g, ' '));
					}
				}
			}

			return ret;
		};
		Utils.urlEncode = function( obj ) {	// 将对象转换成url参数返回
			var arr = [];

			if ( exports.isString(obj) ) return obj;
			
			for ( var i in obj ) {
				if ( own_proto.call(obj, i) ) {
					arr.push(i + '=' + encodeURIComponent(obj[i]));
				}
			}

			return arr.join('&');
		};
		/* 日期时间处理函数 */
		Utils.formatDateTime = function ( localTime ) {	// 格式化日期时间
			var date = new Date(parseInt(localTime)),
				timeStr = '';
			
			timeStr += date.getFullYear() + '-';
			timeStr += ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-';
			timeStr += (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + ' ';
			timeStr += date.toLocaleTimeString();
			
			return timeStr;
		};
		Utils.getMS = function( dt ) {
			dt = dt || new Date();
			return dt.getTime();
		};
		/* 空函数 */
		Utils.getEmptyFn = function(){};
		/* AJAX处理函数 */
		Utils.loadjs = function ( url, callback ) {	// 加载JS
			var scriptElem = document.createElement("script");
			
			if ( scriptElem.readyState ) {
				// IE浏览器
				scriptElem.onreadystatechange = function () {
					if ( scriptElem.readyState === "loaded" || scriptElem.readyState === "complete" ) {
						scriptElem.onreadystatechange = null;
						callback && callback();
					}
				};
			} else {
				// 其它浏览器
				scriptElem.onload = function () {
					callback && callback();
					scriptElem.onload = null;
				};
			}

			scriptElem.src = url;
			document.documentElement.firstChild.appendChild(scriptElem);
		};
		/* 页面处理函数 */
	    Utils.setHomepage = function( url ) {
	        if ( !url ) url = window.location.href;

	        if ( document.all ) {
	            document.body.style.behavior = 'url(#default#homepage)';
	            document.body.setHomePage(url);
	        } else {
	            try {
	                netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
	            } catch( e ) {
	                try {
	                    var s = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	                    s.setCharPref('browser.startup.homepage', url);
	                } catch(e) {
	                    alert('\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BE5\u64CD\u4F5C\uFF0C\u8BF7\u4F7F\u7528\u6D4F\u89C8\u5668\u83DC\u5355\u624B\u52A8\u8BBE\u7F6E');
	                }
	            }
	        }
	    };
		Utils.addFav = function( url, name ) {
			if ( !url ) url = window.location.href;
			if ( !name ) name = document.title;

            if ( document.all ) {
                window.external.addFavorite(url, name);  
            } else if ( window.sidebar ) {  
            	window.sidebar.addPanel(name, url, "");  
            } else {
                if ( navigator.userAgent.toLowerCase().indexOf('opera') > -1 ) {
                    alert('\u8BF7\u4F7F\u7528\20Ctrl+T\20\u5FEB\u6377\u952E\u5C06\u672C\u9875\u52A0\u5165\u6536\u85CF\u5939');
                } else {
                    alert('\u8BF7\u4F7F\u7528\20Ctrl+D\20\u5FEB\u6377\u952E\u5C06\u672C\u9875\u52A0\u5165\u6536\u85CF\u5939');
                }
            }
		};
		Utils.copyText = function( txt ) {
			if ( window.clipboardData ) {
				window.clipboardData.clearData();
				window.clipboardData.setData("Text", txt);

				alert('\u590D\u5236\u6210\u529F\uFF01');
			} else if ( window.netscape ) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				} catch( e ) {
					alert("\u60A8\u7684firefox\u5B89\u5168\u9650\u5236\u9650\u5236\u60A8\u8FDB\u884C\u526A\u8D34\u677F\u64CD\u4F5C\uFF0C\u8BF7\u6253\u5F00\u2019about\3Aconfig\u2019\u5C06signed.applets.codebase_principal_support\u2019\u8BBE\u7F6E\u4E3Atrue\u2019\u4E4B\u540E\u91CD\u8BD5\uFF0C\u76F8\u5BF9\u8DEF\u5F84\u4E3Afirefox\u6839\u76EE\u5F55/greprefs/all.js");
					return false;
				}

				var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
				if ( !clip ) return;

				var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
				if ( !trans ) return;
				
				trans.addDataFlavor('text/unicode');
				
				var str = new Object();
				var len = new Object();
				var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				var copytext = txt;
				str.data = copytext;
				
				trans.setTransferData("text/unicode", str, copytext.length*2);
				var clipid = Components.interfaces.nsIClipboard;
				if ( !clip ) return false;
				clip.setData(trans, null, clipid.kGlobalClipboard);
			} else {
				alert("\u88AB\u6D4F\u89C8\u5668\u62D2\u7EDD\uFF0C\u8BF7\u5207\u6362\u81F3\u517C\u5BB9\u6A21\u5F0F\u6216\u8005\u624B\u52A8\u590D\u5236\u3002");
				return false;
			}
		};

		exports.extend(exports, Utils);
	});

	// Common Function
	scope.extend(scope, function( exports ) {
		// 方法函数
		exports.method = function( obj, name, fn ) {
			obj[name] = fn;
		};
		// exec函数
		exports.execFunc = function() {
			var args = Array.prototype.slice.call(arguments),
				func = args.shift();

			if ( typeof(func) === "function" ) {
				return func.apply(this, args);
			}
		};
		// bind函数
		exports.bindFunc = function( obj, fn ) {
			return function() {
				return fn.apply(obj, [].slice.call(arguments));
			};
		};
		// mixin函数
		exports.mixin = function() {
			var i, prop,
				child = {},
				args = Array.prototype.slice.call(arguments);

			for ( i = 0; i < args.length; i += 1 ) {
				for ( prop in args[i] ) {
					if ( args[i].hasOwnProperty(prop) ) {
						child[prop] = args[i][prop];
					}
				}
			}

			return child;
		};
		// register函数
		exports.register = function( name, obj, parent ) {
			if ( !name || !obj ) return;
			
			parent = parent || window;

			for ( var arr = name.split("."), i = 0; i = arr.shift(); i++ ) {
				if ( arr.length > 0 ) {
					if ( typeof(parent[i]) === "undefined" ) {
						parent[i] = {};
					}
					parent = parent[i];
				} else if ( typeof(parent[i]) === "undefined" ) {
					parent[i] = typeof(obj) === "function" ? obj.call(this) : obj;
				}
			}

			return this;
		};
		// namespace函数
		exports.namespace = function( name, target ) {
			var arr = [],
				args = Array.prototype.slice.call(arguments),
				item;

			target = target || window;

			if ( args.length >= 1 ) {
				arr = name.split(".");
				while ( arr.length > 0 ) {
					item = arr.shift();
					
					if ( typeof(target[item]) === "undefined" ) {
						target[item] = {};
					}

					target = target[item];
				}
			}

			return this;
		};
		// use函数
		exports.use = function() {
			var args = Array.prototype.slice.call(arguments),
				callback = args.pop(),
				names = args[0],
				index = 0;
			
			if ( !exports.isUndefined(names) ) {
				if ( exports.isString(names) ) {
					names = [names];
				}

				if ( exports.isArray(names) ) {
					for ( var i = 0; i < names.length; i++ ) {
						exports.loadjs(exports.PATH + exports.NS + "." + names[i] + "." + "js", _callback);
					}
				}
			}

			function _callback() {
				index += 1;
				if ( index == names.length ) {
					callback.call(this, exports);
				}
			}
		};
		// klass函数
		exports.klass = function() {
			var args = Array.prototype.slice.call(arguments),
				Parent = Object,
				props = {},
				Child, F, i;

			// 1. 新构造函数
			Child = function() {
				if ( Child.uber && Child.uber.hasOwnProperty("ctor") ) {
					Child.uber.ctor.apply(this, arguments);
				}
				if ( Child.prototype.hasOwnProperty("ctor") ) {
					Child.prototype.ctor.apply(this, arguments);
				}
			};

			// 处理传递进来的参数
			if ( args.length >= 2 ) {
				Parent = args[0] || Object;
				props = args[1];
			}  else if ( args.length == 1 ) {
				props = args[0];
			}

			// 2. 继承
			F = function(){};
			F.prototype = Parent.prototype;
			Child.prototype = new F();
			Child.uber = Parent.prototype;
			Child.prototype.constructor = Child;

			// 3. 添加实现方法
			for ( i in props ) {
				if ( props.hasOwnProperty(i) ) {
					Child.prototype[i] = props[i];
				}
			}

			// 4. 返回Class
			return Child;
		};
	});

	/* BrowserEntry */
	scope.extend(scope, function( exports ) {
		var BrowserEntry = {},
			userAgent = window.navigator.userAgent.toLowerCase(),
			re_mobile = /(android|ipod|itouch|iphone|ipad|blackberry|symbianos|symbos|windows phone os|wap|kindle|pad|pod)/i;

		/* <Browser_Static> */	
		var _msie = /msie/.test(userAgent);
		var _ie6 = /msie 6/.test(userAgent);
		var _ie7 = /msie 7/.test(userAgent);
		var _ie8 = /msie 8/.test(userAgent);
		var _firefox = /firefox/.test(userAgent);
		var _chrome = /chrome/.test(userAgent);
		var _opera = /opera/.test(userAgent);
		var _webkit = /webkit/.test(userAgent);
		var _isTouch = re_mobile.test(userAgent);
		var _cssPrefix = _firefox ? 'Moz' : (_opera ? 'O' : (_msie ? 'Ms' : 'Webkit'));
		var _isStrict = document.compatMode == "CSS1Compat";
		var _isBorderBox = _msie && !_isStrict;
		var _isWindows = /windows|win32/.test(userAgent);
		var _isMac = /macintosh|mac os x/.test(userAgent);
		var _isAir = /adobeair/.test(userAgent);
		var _isLinux = /linux/.test(userAgent);
		var _isSecure = /^https/i.test(window.location.protocol);
		var _browserInfo = (function(){
			var re_msie = /msie [\d.]+/gi,
				re_firefox = /firefox\/[\d.]+/gi,
				re_chrome = /chrome\/[\d.]+/gi,
				re_safari = /safari\/[\d.]+/gi;
			
			if ( userAgent.indexOf("msie") > 0 ) {//msie
				return userAgent.match(re_msie);
			}			
			if ( userAgent.indexOf("firefox") > 0 ) {//firefox
				return userAgent.match(re_firefox);
			}			
			if ( userAgent.indexOf("chrome") > 0 ) {//chrome
				return userAgent.match(re_chrome);
			}			
			if ( userAgent.indexOf("safari") > 0 && userAgent.indexOf("chrome") < 0 ) {//safari
				return userAgent.match(re_safari) ;
			}
		})();
		var _version = _browserInfo.toString().replace(/[^0-9.]/ig,"");
		var _name = _browserInfo.toString().match(/\w+/).toString();
		/* </Browser_Static> */

		BrowserEntry = {
			name: _name,
			version: _version,
			msie: _msie,
			ie6: _ie6,
			ie7: _ie7,
			ie8: _ie8,
			firefox: _firefox,
			chrome: _chrome,
			opera: _opera,
			webkit: _webkit,
			isTouch: _isTouch,
			cssPrefix: _cssPrefix,
			isStrict: _isStrict,
			isBorderBox: _isBorderBox,
			isWindows: _isWindows,
			isMac: _isMac,
			isAir: _isAir,
			isLinux: _isLinux,
			isSecure: _isSecure,
			getScrollTop: function() {
				return this.msie ? document.body.scrollTop : (document.documentElement.scrollTop || document.body.scrollTop);
			},
			getScrollHeight: function() {
				return this.msie ? document.body.scrollHeight : (document.documentElement.scrollHeight || document.body.scrollHeight);
			},
			getClientHeight: function() {
				return this.msie ? document.body.clientHeight : (document.body.clientHeight || document.documentElement.clientHeight);
			},
			getClientWidth: function() {
				return this.msie ? document.body.clientWidth : (document.body.clientWidth || document.documentElement.clientWidth);
			},
			setScrollTop: function( value ) {
				if ( document.documentElement.scrollTop ) {
					document.documentElement.scrollTop = value;
				} else {
					document.body.scrollTop = value;
				}
			},
			scrollTo: function( x, y ) {
				window.scrollTo( x, y );
			},
			jumpTo: function( url ) {
				var host = window.location.host;
				
				if ( !url ) {
					url = "http://m" + host.substr(host.indexOf("."));
				}

				if ( re_mobile.test( ua ) ) {
					window.location.href = url;
				}
			}
		};

		exports.BrowserEntry = BrowserEntry;
	});

	/* CookieEntry */
	scope.extend(scope, function( exports ) {
		var CookieEntry = {};

		CookieEntry.set = function( name, value, options ) {
			var expires = '';

			options = options || {};
			
			if ( value === null ) {
				value = '';
				options.expires = -1;
			}
			
			if ( options.expires && (exports.isNumeric(options.expires) || options.expires.toUTCString) ) {
				var date;
				if ( exports.isNumeric(options.expires) ) {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString();
			}

			var path = options.path ? '; path=' + (options.path) : '';
			var domain = options.domain ? '; domain=' + (options.domain) : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		};

		CookieEntry.get = function( name ) {
			var cookieValue = null;

			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = exports.trim(cookies[i]);

					if ( cookie.substring(0, name.length + 1) == (name + '=') ) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}

			return cookieValue;
		};

		CookieEntry.remove = function( name ) {
			CookieEntry.set(name, null, null);
		};

		exports.CookieEntry = CookieEntry;
	});

	/* StorageEntry */
	scope.extend(scope, function( exports ) {
		var StorageEntry = {},
			ls = window.localStorage;

		if ( ls ) {
			StorageEntry = {
				get: function( name ) {
					var value = unescape(ls.getItem(name));
					return "null" == value ? "" : value;
				},
				set: function( name, value ) {
					ls.setItem(name, escape(value));
				},
				remove: function( name ) {
					ls.removeItem(name);
				},
				clear: function() {
					ls.clear();
				},
				getAll: function() {
					for (var len = ls.length, name = null, arr = [], i = 0; i < len; i++) {
						name = ls.key(i);
						arr.push(name + "=" + this.get(name));
					}
					return arr.join("; ");
				}
			};
		} else {
			StorageEntry = {
				get: function( name ) {
					return exports.CookieEntry.get(name);
				},
				set: function( name, value, options ) {
					exports.CookieEntry.set(name, value, options);
				},
				remove: function( name ) {
					exports.CookieEntry.remove(name);
				},
				clear: function() {
					var cookieValue = null;

					if ( document.cookie && document.cookie != '' ) {
						for (var cookieArr = document.cookie.split("; "), len = cookieArr.length, arr = [], i = 0; i < len; i++) {
							arr = cookieArr[i].split("=");
							exports.CookieEntry.remove(arr[0]);
						}
					}
				},
				getAll: function() {
					var cookieValue = null;

					if ( document.cookie && document.cookie != '' ) {
						cookieValue = unescape(document.cookie.toString());
					}

					return cookieValue;
				}
			};
		}

		exports.StorageEntry = StorageEntry;
	});

	/* AnimateEntry */
	scope.extend(scope, function( exports ) {
		var AnimateEntry = function ( delay ) {
			// TODO::
			this.list = {};
			this.isRunning = false;
			this.delay = delay || 30;
		};
		
		AnimateEntry.prototype = {
			moveIndex: 1,
			linear: function( rate, begin, dis ) {
				return begin + dis * rate;
			},
			quad: function( rate, begin, dis ) {
				return begin + dis * rate * rate;
			},
			quadOut: function( rate, begin, dis ) {
				return this.quad(1 - rate, begin + dis, -dis);
			},
			quadInOut: function( rate, begin, dis ) {
				if ( rate < 0.5 ) {
					return this.quad(rate + rate, begin, dis/2);
				} else {
					return this.quad(2 - rate - rate, begin + dis, -dis/2);
				}
			},
			repeater: function() {
				var _this = this, index = 0, item;

				for ( var i in _this.list ) {
					if ( !this.list[i] ) continue;
					
					item = this.list[i];
					index++;
					
					if ( !this.moveone(item) ) {
						this.list[i].callback && exports.isFunction(this.list[i].callback) && this.list[i].callback();
						this.list[i] = null;
					}
				}

				if ( index ) {
					setTimeout(function(){
						_this.repeater();
					}, this.delay);
				} else {
					this.isRunning = false;
					this.list = {};
				}
			},
			moveone: function( obj ) {
				var rate, css = {}, newStyle;

				var currTime = exports.getMS();
				rate = this.delay * this.moveIndex / obj.duration;

				if ( rate >= 1 ) {
					exports.css(obj.node, obj.end);
					return false;
				} else if ( rate <= 0 ) {
					return true;
				}

				for ( var i in obj.end ) {
					newStyle = this[obj.fn](rate, obj.begin[i], obj.end[i] - obj.begin[i]);
					css[i] = newStyle;
				}
				exports.css(obj.node, css);

				this.moveIndex += 1;
				
				return true;
			},
			add: function( id, node, end, duration, fn, delay, callback ) {
				var nodeAttr, nodeCss, beginVal;

				this.list[id] = {
					node: node,
					end: end,
					duration: duration,
					fn: fn || 'linear',
					time: exports.getMS() + (delay || 0),
					callback: callback || null,
					begin: {}
				};

				for ( var i in end ) {
					nodeAttr = node['_' + i];
					nodeCss = exports.getStyle(node, i);

					if ( i == 'opacity' ) {
						beginVal = exports.isUndefined(nodeAttr) ? (exports.isUndefined(nodeCss) ? 1 : nodeCss) : nodeAttr;
					} else {
						beginVal = exports.isUndefined(nodeAttr) ? (exports.isUndefined(nodeCss) ? 0 : nodeCss) : nodeAttr;
					}

					this.list[id].begin[i] = parseInt(beginVal);
				}

				if ( !this.isRunning ) {
					this.repeater();
					this.isRunning = true;
				}
			},
			fadeIn: function( id, node, duration, callback ) {
				this.add(id, node, {opacity: 0}, duration || 700, 'linear', 0, callback);
			},
			fadeOut: function( id, node, duration, callback ) {
				this.add(id, node, {opacity: 1}, duration || 700, 'linear', 0, callback);
			},
			fadeToggle: function( id, node, duration, callback ) {
				if ( node._opacity > 0.5 || exports.isUndefined(node._opacity) ) {
					this.fadeIn(id, node, duration, callback);
				} else {
					this.fadeOut(id, node, duration, callback);
				}
			},
			slideDown: function( id, node, duration, callback ) {
				this.add(id, node, {height: node.__height}, duration || 700, 'linear', 0, callback);
			},
			slideUp: function( id, node, duration, callback ) {
				node.__height = node._height;
				this.add(id, node, {height: 0}, duration || 700, 'linear', 0, callback);
			},
			slideToggle: function( id, node, duration, callback ) {
				if ( !node.__height || node._height > node.__height/2 ) {
					this.slideUp(id, node, duration, callback);
				} else {
					this.slideDown(id, node, duration, callback);
				}
			}
		};

		exports.AnimateEntry = AnimateEntry;
	});

	/* EventEntry */
	scope.extend(scope, function( exports ) {
		var EventEntry = {
			addEvent: null,
			removeEvent: null,
			cancelBubble: null,
			preventDefault: null,
			getTarget: null
		};

		if ( window.addEventListener ) {
			EventEntry.addEvent = function ( el, evt, fn ) {
				el.addEventListener(evt, fn, false);
			};
			EventEntry.removeEvent = function ( el, evt, fn ) {
				el.removeEventListener(evt, fn, false);
			};
		} else if ( window.attachEvent ) {
			EventEntry.addEvent = function ( el, evt, fn ) {
				el.attachEvent("on" + evt, fn);
			};
			EventEntry.removeEvent = function ( el, evt, fn ) {
				el.detachEvent("on" + evt, fn);
			};
		} else {
			EventEntry.addEvent = function ( el, evt, fn ) {
				el["on" + evt] = fn;
			};
			EventEntry.removeEvent = function ( el, evt, fn ) {
				el["on" + evt] = null;
			};
		}

		EventEntry.cancelBubble = function ( evt ) {
			if ( typeof(evt.stopProgation) === "function" ) {
				evt.stopProgation();
			} else {
				evt.cancelBubble = true;
			}
		};

		EventEntry.preventDefault = function ( evt ) {
			if ( typeof(evt.preventDefault) === "function" ) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}
		};

		EventEntry.getTarget = function( e ) {
			return e.target || e.srcElement;
		};

		EventEntry.mouse2Touch = function( evt ) {
			var type;

			if ( evt == 'mousedown' || evt == 'click' ) {
				type = 'touchstart';
			} else if ( evt == 'mousemove' || evt == 'mouseover' ) {
				type = 'touchmove';
			} else if ( evt == 'mouseup' || evt == 'mouseout' ) {
				type = 'touchend';
			} else {
				type = '';
			}

			return type;
		};

		EventEntry.bindEvent = function( node, evt, fn, isBubble ) {
			var func = function(e) {
				e = e || win.event;
				
				if ( exports.isUndefined(isBubble) ) {
					EventEntry.cancelBubble(e);
				}

				e = e.changedTouches ? e.changedTouches[0] : e;
				fn.call(node, e);
			};
			
			if ( exports.BrowserEntry.isTouch ) {
				type = EventEntry.mouse2Touch();
			} else {
				type = evt;
			}

			if ( type ) {
				EventEntry.addEvent(node, type, func);
			}
		},

		exports.EventEntry = EventEntry;
	});

	/* DragEntry */
	scope.extend(scope, function( exports ) {
		var DragEntry = {};

		DragEntry.setDrag = function( node ) {
			exports.css(node, { position: 'absolute', cursor: 'move' });

			exports.EventEntry.bindEvent(node, 'mousedown', function( e ) {
				exports.EventEntry.cancelBubble(e);
				e = e.changedTouches ? e.changedTouches[0] : (e || window.event);
				
				this.down = 1;
				this.posX = e.clientX - this.offsetLeft;
				this.posY = e.clientY - this.offsetTop;
			});

			exports.EventEntry.bindEvent(node, 'mousemove', function( e ) {
				var posX, posY;

				exports.EventEntry.cancelBubble(e);
				e = e.changedTouches ? e.changedTouches[0] : (e || window.event);	//兼容触屏和IE
				
				if ( this.down == 1 ) {
					posX = this.posX;
					posY = this.posY;

					exports.css(this, {
						left: e.clientX - posX + "px",
						top: e.clientY - posY + "px"
					});
				}
			});

			exports.EventEntry.bindEvent(node, 'mouseup', function() {
				this.down = 0;
			});
		};

		exports.DragEntry = DragEntry;
	});

	/* AjaxEntry */
	scope.extend(scope, function( exports ) {
		var AjaxEntry = {};

		AjaxEntry.getHttpRequest = function() {
			var xhr,
				XML = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];

			if ( exports.isFunction(XMLHttpRequest) ) {
				xhr = new XMLHttpRequest();
			} else {
				for ( var i = 0,len = XML.length; i < len; i += 1 ) {
					try {
						xhr = new ActiveXObject(XML[i]);
						break;
					} catch (e) {}
				}
			}

			xhr.onreadystatechange = function(){
				var response = '';

				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						if (xhr.responseXML && xhr.documentElement) {
							response = xhr.responseXML;
						} else {
							try {
								response = xhr.responseText;
							} catch (e) {}
						}

						xhr.callback && xhr.callback(response);
						xhr.success && xhr.success(response);
					} else {
						xhr.failure && xhr.failure(response);
					}
				}
			};

			return xhr;
		};

		AjaxEntry.ajax = function( options ) {
			if ( !options.url ) return;
			if ( !options.method ) {
				options.method = 'GET';
			}

			var xhr = this.getHttpRequest();

			options.async = exports.isUndefined(options.async) ? true : !!options.async;
			options.params = exports.isRealObject(options.params) ? exports.urlEncode(options.params) : null;

			if ( exports.isFunction(options.success) ) {
				xhr.success = options.success;
			}

			if ( exports.isFunction(options.failure) ) {
				xhr.failure = options.failure;
			}

			if ( options.method == 'GET' ) {
				var url = options.params === null ? options.url : (options.url + '?' + options.params);
				xhr.open('GET', url, options.async);
				xhr.send(null);
			} else if ( options.method == 'POST' ) {
				xhr.open("POST", options.url, options.async);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send(options.params);
			}
		};

		AjaxEntry.get = function( url, callback ) {
			this.ajax({
				url: url,
				method: "GET",
				async: true,
				success: callback
			});
		};
		
		AjaxEntry.post = function( url, params, callback ) {
			this.ajax({
				url: url,
				method: "POST",
				async: true,
				success: callback,
				params: params
			});
		};

		exports.AjaxEntry = AjaxEntry;
	});
})(ninejs || (ninejs = {}));
