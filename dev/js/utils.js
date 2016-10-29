;(function(root, factory){
    if(typeof module !== 'undefined' && module.exports){// CommonJS
        module.exports = factory();
    }else if (typeof define === 'function' && define.amd){// AMD / RequireJS
        define(factory);
    }else{
        root.Utils = factory.call(root);
    }
})(this, function(){
    // 设置CSS3样式
    function setStyle3(obj, name, value){
        obj.style['Webkit'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
        obj.style['Moz'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
        obj.style['ms'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
        obj.style['O'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
        obj.style[name] = value;
    }

    // 获取随机值
    function rnd(n, m){
        return parseInt(Math.random()*(m-n)+n);
    }

    // 设置多个样式
    function setStyle(obj, json){
        if(obj.length){
            for(var i = 0;i<obj.length;i++){
                setStyle(obj[i], json);
            }
        }
        else{
            for(var i in json){
                obj.style[i] = json[i];
            }
        }
    }

    function isArray(arr){
        return Object.prototype.toString.apply(arr) === '[object Array]';
    }

    function isString(string){
        return Object.prototype.toString.apply(string) === '[object String]';
    }

    function isObject(obj){
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    function isElement(obj) {
        return !!(obj && obj.nodeType === 1);
    }

    function isUndefined(obj) {
        return obj === void 0;
    }

    return {
        setStyle3: setStyle3,
        rnd: rnd,
        setStyle: setStyle,
        isArray: isArray,
        isString: isString,
        isObject: isObject,
    }
});