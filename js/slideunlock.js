'use strict'

//工具箱
// get the element object
function my$(selector, context) {
    return (context || document).querySelectorAll(selector);
}

// add CSS sttributes to the dom element
function css(el, styles) {
    for (var property in styles) {
        el.style[property] = styles[property];
    }
}

//just replace the css function that you write, it has a bug, if the styles has a css like "margin-left", the "-" signal will be error in style[*]
function css(el, styles) {
    for (var property in styles) {
        el.style[property.toString()] = styles[property];
    }
}

// check the dom has someone class style
function hasClass(el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
}

// add class style
function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else if (!hasClass(el, className)) {
        el.className += ' ' + className;
    }
}

// remove class style
function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
    }
}

// helper for enabling IE 8 event bindings
function addEvent(el, type, handler) {
    if (el.attachEvent) {
        el.attachEvent('on' + type, handler);
    } else {
        el.addEventListener(type, handler);
    }
}




//拖动动画
// animate to left
function animateLeft(el, duration, left) {
    var s = el.style,
        step = (duration || 200) / 20;
    s.left = s.left || '0px';
    (function animation() {
        s.left = (parseInt(s.left, 10) - step) > 0 ? (parseInt(s.left, 10) - step) + 'px' : 0;
        parseInt(s.left, 10) > 0 ? setTimeout(animation, 10) : s.left = 0;
    })();
}

// animate opacity
function animateOpacity(el, duration, opacity) {
    var s = el.style,
        step = 25 / (duration || 200);
    s.opacity = s.opacity || 0;
    (function animation() {
        (s.opacity = parseFloat(s.opacity) + step) > 1 ? s.opacity = 1 : setTimeout(animation, 25);
    })();
}

// the main object SliderUnlock
function SliderUnlock(elm, options, success, always) {
    var _self = this;

    var my$elm = _self.checkElm(elm) ? my$(elm)[0] : document;
    var options = _self.checkObj(options) ? options : new Object();
    var success = _self.checkFn(success) ? success : function() {};
    var always = _self.checkFn(always) ? always : function() {};

    var opts = {
        labelTip: typeof(options.labelTip) !== "undefined" ? options.labelTip : "对齐拼图解锁",
        successLabelTip: typeof(options.successLabelTip) !== 'undefined' ? options.successLabelTip : "Success",
        duration: typeof(options.duration) !== 'undefined' || !isNaN(options.duration) ? options.duration : 200,
        swipestart: typeof(options.swipestart) !== 'undefined' ? options.swipestart : false,
        min: typeof(options.min) !== 'undefined' || !isNaN(options.min) ? options.min : 0,
        max: typeof(options.max) !== 'undefined' || !isNaN(options.max) ? options.max : my$elm.clientWidth - my$(".slideunlock-label")[0].clientWidth,
        index: typeof(options.index) !== 'undefined' || !isNaN(options.index) ? options.index : 0,
        IsOk: typeof(options.isOk) !== 'undefined' ? options.isOk : false,
        lableIndex: typeof(options.lableIndex) !== 'undefined' || !isNaN(options.lableIndex) ? options.lableIndex : 0
    }

    //my$elm
    _self.elm = my$elm;
    //opts
    _self.opts = opts;
    //是否开始滑动 (Whether to start sliding)
    _self.swipestart = opts.swipestart;
    //最小值 (Minimum value)
    _self.min = opts.min;
    //最大值 (Maximum value)
    _self.max = opts.max;
    //当前滑动条所处的位置 (The location of the current slider)
    _self.index = opts.index;
    //是否滑动成功 (Whether the slide is successful)
    _self.isOk = opts.isOk;
    //鼠标在滑动按钮的位置 (The mouse is in the position of the sliding button)
    _self.lableIndex = opts.lableIndex;
    //success
    _self.success = success;
    //always
    _self.always = always;
}

// check the element exists
SliderUnlock.prototype.checkElm = function(elm) {
    if (my$(elm).length > 0) {
        return true;
    } else {
        throw "this element does not exist.";
    }
};

// judge the given param is a object
SliderUnlock.prototype.checkObj = function(obj) {
    if (typeof obj === "object") {
        return true;
    } else {
        throw "the params is not a object.";
    }
};

// judge the given param is a function
SliderUnlock.prototype.checkFn = function(fn) {
    if (typeof fn === "function") {
        return true;
    } else {
        throw "the param is not a function.";
    }
};

// initialize
SliderUnlock.prototype.init = function() {
    var _self = this,
        _slideunlockLabel = my$(".slideunlock-label")[0];

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

/**
 * 鼠标 /手指接触滑动按钮
 * Mouse / finger touch slide button
 */
SliderUnlock.prototype.handerIn = function() {
    var _self = this;
    _self.swipestart = true;
    _self.min = 0;
    _self.max = _self.elm.clientWidth - my$(".slideunlock-label")[0].clientWidth;
}

/**
 * 鼠标 /手指移出
 * Mouse / finger out
 */
SliderUnlock.prototype.handerOut = function() {
    var _self = this;
    // stop
    _self.swipestart = false;
    // _self.move();
    _self.verify();
}
SliderUnlock.prototype.verify = function() {
    var _self = this;
    $.post(
        'code.php', { 'yzm': _self.index },
        function(data) {
            if (data == 1) {
                alert('YES');
            } else {
                alert('NO');
            }
        }
    )
}
/**
 * 鼠标 /手指移动
 * Mouse / finger move
 */
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

/**
 * 鼠标 /手指移动过程
 * Mouse / finger movement process
 */
SliderUnlock.prototype.move = function() {
    var _self = this;
    if ((_self.index + 0) >= _self.max) {
        _self.index = _self.max - 0;
        // 停止 (stop)
        _self.swipestart = false;
        // 解锁 (lock)
        _self.isOk = true;
    }
    if (_self.index < 0) {
        _self.index = _self.min;
        // 未解锁 (unlock)
        _self.isOk = false;
    }
    if (_self.index == _self.max && _self.max > 0 && _self.isOk) {
        _self.success();
    }
    _self.backgroundTranslate();
    _self.updateView();
}

/**
 * 重置slide的起点
 * Resets the starting point of the slide
 */
SliderUnlock.prototype.reset = function() {
    var _self = this;

    animateLeft(my$(".slideunlock-label")[0], _self.opts.duration, _self.index);
    animateOpacity(my$(".slideunlock-lable-tip")[0], _self.opts.duration, 1);

    _self.index = 0
    _self.updateView();
    var num = Math.random() * 10;
    document.getElementById('yzimg').src = 'verify.php?r=' + num;
};

/**
 * 背景颜色渐变
 * Background color gradient
 */
SliderUnlock.prototype.backgroundTranslate = function() {
    var _self = this;
    my$(".slideunlock-label")[0].style.left = _self.index + "px";
    my$('.slideunlock-lable-tip')[0].style.opacity = 1 - (parseInt(my$(".slideunlock-label")[0].style.left) / _self.max);
}

/**
 * 更新视图
 * Update the view
 */
SliderUnlock.prototype.updateView = function() {
    var _self = this,
        _labelTipEle = my$(".slideunlock-lable-tip")[0];

    if (_self.index == (_self.max - 0)) {
        my$(".slideunlock-lockable")[0].value = 1;
        var style = {
            "filter": "alpha(opacity=1)",
            "-moz-opacity": "1",
            "opacity": "1"
        };
        addClass(_self.elm, "success");
        _labelTipEle.innerHTML = _self.opts.successLabelTip;
        css(_labelTipEle, style);
    } else {
        my$(".slideunlock-lockable")[0].value = 0;
        removeClass(_self.elm, "success");
        _labelTipEle.innerHTML = _self.opts.labelTip;
    }
    _self.always();
}