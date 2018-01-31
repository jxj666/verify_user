 'use strict'

 
 
 function ele(selector, context) {
     return (context || document).querySelectorAll(selector);
 }

 
 function css(el, styles) {
     for (var property in styles) {
         el.style[property] = styles[property];
     }
 }

 
 function css(el, styles) {
     for (var property in styles) {
         el.style[property.toString()] = styles[property];
     }
 }

 
 function hasClass(el, className) {
     return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
 }

 
 function addClass(el, className) {
     if (el.classList) {
         el.classList.add(className);
     } else if (!hasClass(el, className)) {
         el.className += ' ' + className;
     }
 }

 
 function removeClass(el, className) {
     if (el.classList) {
         el.classList.remove(className);
     } else {
         el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
     }
 }

 
 function addEvent(el, type, handler) {
     if (el.attachEvent) {
         el.attachEvent('on' + type, handler);
     } else {
         el.addEventListener(type, handler);
     }
 }




 
 function animateLeft(el, duration, left) {
     var s = el.style,
         step = (duration || 200) / 20;
     s.left = s.left || '0px';
     (function animation() {
         s.left = (parseInt(s.left, 10) - step) > 0 ? (parseInt(s.left, 10) - step) + 'px' : 0;
         parseInt(s.left, 10) > 0 ? setTimeout(animation, 10) : s.left = 0;
     })();
 }

 
 function animateOpacity(el, duration, opacity) {
     var s = el.style,
         step = 25 / (duration || 200);
     s.opacity = s.opacity || 0;
     (function animation() {
         (s.opacity = parseFloat(s.opacity) + step) > 1 ? s.opacity = 1 : setTimeout(animation, 25);
     })();
 }

 
 function SliderUnlock(elm, options, success, always) {
     var _self = this;

     var eleelm = _self.checkElm(elm) ? ele(elm)[0] : document;
     var options = _self.checkObj(options) ? options : new Object();
     var success = _self.checkFn(success) ? success : function() {};
     var always = _self.checkFn(always) ? always : function() {};

     var opts = {
         labelTip: typeof(options.labelTip) !== "undefined" ? options.labelTip : "对齐拼图解锁",
         successLabelTip: typeof(options.successLabelTip) !== 'undefined' ? options.successLabelTip : "成功解锁",
         duration: typeof(options.duration) !== 'undefined' || !isNaN(options.duration) ? options.duration : 200,
         swipestart: typeof(options.swipestart) !== 'undefined' ? options.swipestart : false,
         min: typeof(options.min) !== 'undefined' || !isNaN(options.min) ? options.min : 0,
         max: typeof(options.max) !== 'undefined' || !isNaN(options.max) ? options.max : eleelm.clientWidth - ele(".slideunlock-label")[0].clientWidth,
         index: typeof(options.index) !== 'undefined' || !isNaN(options.index) ? options.index : 0,
         sOk: typeof(options.isOk) !== 'undefined' ? options.isOk : false,
         lableIndex: typeof(options.lableIndex) !== 'undefined' || !isNaN(options.lableIndex) ? options.lableIndex : 0,
         yn: 'no'
     }

     
     _self.yn = opts.yn;
     
     _self.elm = eleelm;
     
     _self.opts = opts;
     
     _self.swipestart = opts.swipestart;
     
     _self.min = opts.min;
     
     _self.max = opts.max;
     
     _self.index = opts.index;
     
     _self.isOk = opts.isOk;
     
     _self.lableIndex = opts.lableIndex;
     
     _self.success = success;
     
     _self.always = always;
 }

 
 SliderUnlock.prototype.checkElm = function(elm) {
     if (ele(elm).length > 0) {
         return true;
     } else {
         throw "这个元素不支持";
     }
 };

 
 SliderUnlock.prototype.checkObj = function(obj) {
     if (typeof obj === "object") {
         return true;
     } else {
         throw "the params is not a object.";
     }
 };

 
 SliderUnlock.prototype.checkFn = function(fn) {
     if (typeof fn === "function") {
         return true;
     } else {
         throw "the param is not a function.";
     }
 };

 
 SliderUnlock.prototype.init = function() {
     var _self = this,
         _slideunlockLabel = ele(".slideunlock-label")[0];

     _self.updateView();
     addEvent(_slideunlockLabel, "mousedown", function(event) {
         var e = event || window.event;
         _self.lableIndex = e.clientX - this.offsetLeft;
         _self.handerIn();
     });
     addEvent(_slideunlockLabel, "mousemove", function(event) {
         _self.handerMove(event);
     });
     addEvent(_slideunlockLabel, "mouseup", function(event) {
         _self.handerOut();
     });
     addEvent(_slideunlockLabel, "mouseout", function(event) {
         _self.handerOut();
     });
     addEvent(_slideunlockLabel, "touchstart", function(event) {
         var e = event || window.event;
         console.log(e);
         _self.lableIndex = e.touches[0].pageX - this.offsetLeft;
         _self.handerIn();
     });
     addEvent(_slideunlockLabel, "touchmove", function(event) {
         _self.handerMove(event, "mobile");
     });
     addEvent(_slideunlockLabel, "touchend", function(event) {
         _self.handerOut();
     });
 }




 SliderUnlock.prototype.handerIn = function() {
     var _self = this;
     _self.swipestart = true;
     _self.min = 0;
     _self.max = _self.elm.clientWidth - ele(".slideunlock-label")[0].clientWidth;
 }


 SliderUnlock.prototype.handerOut = function() {
     var _self = this;
     _self.verify();
     _self.swipestart = false;

 }
 
 SliderUnlock.prototype.verify = function() {
     var _self = this,
         _labelTipEle = ele(".slideunlock-lable-tip")[0];
     $.post(
         'code.php', { 'yzm': _self.index },
         function(data) {
             var key = JSON.parse(data);
             sessionStorage.num = key.num;
             
             if (key.yn == 1) {
                 _self.yn = 'YES';
                 ele(".slideunlock-lockable")[0].value = 1;
                 var style = {
                     "filter": "alpha(opacity=1)",
                     "-moz-opacity": "1",
                     "opacity": "1"
                 };
                 addClass(_self.elm, "success");
                 _labelTipEle.innerHTML = _self.opts.successLabelTip;
                 css(_labelTipEle, style);
             } else {
                 _self.yn = 'NO';
                 ele(".slideunlock-lockable")[0].value = 0;
                 removeClass(_self.elm, "success");
                 _labelTipEle.innerHTML = _self.opts.labelTip;
             }
             _self.updateView();
         }
     )
 }

 SliderUnlock.prototype.handerMove = function(event, type) {
     var _self = this;
     if (_self.swipestart) {
         event.preventDefault();
         var event = event || window.event;
         if (type == "mobile") {
             _self.index = event.touches[0].pageX - _self.lableIndex;
         } else {
             _self.index = event.clientX - _self.lableIndex;
         }
         _self.move();
     }
 }


 SliderUnlock.prototype.move = function() {
     var _self = this;
     if ((_self.index + 0) >= _self.max) {
         _self.index = _self.max - 0;
         
         
         
         
     }
     if (_self.index < 0) {
         _self.index = _self.min;
         
         
     }
     
     
     
     _self.backgroundTranslate();
     _self.updateView();
 }


 SliderUnlock.prototype.reset = function() {
     var _self = this,
         _labelTipEle = ele(".slideunlock-lable-tip")[0];

     animateLeft(ele(".slideunlock-label")[0], _self.opts.duration, _self.index);
     animateOpacity(ele(".slideunlock-lable-tip")[0], _self.opts.duration, 1);

     _self.index = 0
     _self.updateView();
     var num = Math.random() * 10;
     document.getElementById('yzimg').src = 'verify.php?r=' + num;
     _self.yn = 'NO';
     ele(".slideunlock-lockable")[0].value = 0;
     removeClass(_self.elm, "success");
     _labelTipEle.innerHTML = _self.opts.labelTip;
     _self.updateView();
 };


 SliderUnlock.prototype.backgroundTranslate = function() {
     var _self = this;
     ele(".slideunlock-label")[0].style.left = _self.index + "px";
     
 }

 SliderUnlock.prototype.updateView = function() {
     var _self = this,
         _labelTipEle = ele(".slideunlock-lable-tip")[0];
     $('#box').css('left', _self.index);
     _self.always();
 }