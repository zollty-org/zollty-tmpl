/*!
 * zollty-tmpl.js
 * HTML or String Template Engine with JavaScript
 * https://github.com/zollty-org/zollty-tmpl
 * Version 1.3.2 (Released on 2015-07-09)
 * Licensed under the MIT, BSD, and GPL Licenses.
 */

/*global define: false*/

(function(global, factory) {
    if (typeof exports === "object" && exports) {
        factory(exports); // CommonJS
    } else if (typeof define === "function" && define.amd) {
        define(['exports'], factory); // AMD
    } else {
        factory(global.zollty = {}); // <script>
    }
}(this, function(zollty) {


    zollty.version = '1.3.2';


    // 默认配置
    var settings = zollty.settings = {
        tags: ['{{', '}}'], //定义语法标签
        escape: true, // 是否经过 html escape 输出内容
        cache: true, // 是否开启模板函数的缓存
        compress: false // 是否压缩输出
    };


    // ~ util functions----------begin

    var ajaxGetText = function(url) {
        var request = window.ActiveXObject !== undefined ?
            new window.ActiveXObject("Microsoft.XMLHTTP") :
            // For all other browsers, use the standard XMLHttpRequest object
            new window.XMLHttpRequest();

        request.open("GET", url, false);
        try {
            request.send(null);
        } catch (e) {
            return null;
        }

        if (request.status == 404 || request.status == 2
            || (request.status == 0 && request.responseText == '')) {

            return null;
        }

        return request.responseText;
    };


    var search = function(s, c) {
        for (var i = 0; i < s.length; i++) {
            if (s.charAt(i) === c) {
                return true;
            }
        }
        return false;
    };


    var escapeHash = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };


    var escapeReplace = function(s) {
        return escapeHash[s];
    };


    var parseString = function (value, type) {
        if (typeof value !== 'string') {
            type = typeof value;
            if (type === 'number') {
                value += '';
            } else if (type === 'function') { // 如果是函数则执行 返回执行的结果
                value = parseString(value.call(value));
            } else { // undefined等类型 会被解析为 空字符
                value = '';
            }
        }
        return value;
    };


    var createNewURL = function (oldUrl) {
        if(oldUrl.indexOf('?') != -1) {
            return oldUrl + "&t=" + new Date().getTime();
        }
        return oldUrl + "?t=" + new Date().getTime();
    };


    var escapeHTML = function(str) {
        return parseString(str).replace(/&(?![\w#]+;)|[<>"']/g, escapeReplace);
    };


    var isArray = Array.isArray || function(obj) {
        return ({}).toString.call(obj) === '[object Array]';
    };


    var forEach = function(data, callback) {
        var i, len;
        if (isArray(data)) {
            for (i = 0, len = data.length; i < len; i++) {
                callback.call(data, data[i], i, data);
            }
        } else {
            for (i in data) {
                callback.call(data, data[i], i);
            }
        }
    };


    // 字符串转义
    function strEscape(str) {
        return "'" + str
            // 单引号与反斜杠转义
            .replace(/('|\\)/g, '\\$1')
            // 换行符转义(windows + linux)
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n') + "'";
    }

    // ~ util functions------------end


    /**
     * 设置(默认)配置
     * @name    zollty.config
     * @param   {String}    名称
     * @param   {Any}       值
     */
    zollty.config = function(name, value) {
        settings[name] = value;
    };


    /**
     * 打印错误信息（可由外部重写此方法）
     * @name    zollty.errorLog
     */
    zollty.errorLog = function(e) {
        var message = e.name || 'Template error';
        message += '\n\n';
        if (e.message) {
            message += e.message + '\n\n';
        }
        for (var name in e) {
            if (name!='message') {
                message += '<' + name + '>\n' + e[name] + '\n\n';
            }
        }

        if (typeof console === 'object') {
            console.error(message);
        }
    };


    // 调用 zollty.errorLog 函数处理异常，并返回异常信息
    var showError = function(e) {

        zollty.errorLog(e);

        var errorName = e.name || 'Template error';

        return function() {
            return '{' + errorName + (e.message ? ': '+e.message : '') + '. See the console log for details.}';
        };
    };


    // 缓存已编译好的模板渲染函数
    var renderCache = zollty.renderCache = {};


    /**
     * 获取渲染函数（可由外部重写此方法），(调用此方法并启用cache，则可以预编译模板)
     * @name     zollty.getRender
     * @param    {String}    模板名
     * @return   {Function}  编译好的渲染函数
     */
    zollty.getRender = function(filename, useNewUrl) {

        var renderFn;

        if (renderCache[filename]) { // 使用内存缓存

            renderFn = renderCache[filename];

        } else if (search(filename, '/')) { // 当做 url path 路径

            if(useNewUrl) {
                filename = createNewURL(filename);
            }

            var source = ajaxGetText(filename);

            if (source) {
                renderFn = createRender(source, {filename: filename});
            }

        } else if (typeof document === 'object') { // 当做 html id

            var elem = document.getElementById(filename);

            if (elem) {
                var source = (elem.value || elem.innerHTML).replace(/^\s*|\s*$/g, '');

                renderFn = createRender(source, {filename: filename});
            }

        }

        return renderFn || showError({
            filename: filename,
            name: 'Error',
            message: 'Template not found'
        });
    };


    /**
     * 渲染模板(根据模板名或者路径)
     * @name    zollty.render
     * @param   {String}    模板名
     * @param   {Object}    数据
     * @return  {String}    渲染好的字符串
     */
    var render = zollty.render = function(filename, data) {
        var renderFn = zollty.getRender(filename);
        return data ? renderFn(data) : renderFn;
    };


    /**
     * 渲染模板(根据模板名或者路径)，每次都用新的url（在URL后面加上时间截）
     * @name    zollty.renderN
     * @param   {String}    模板名
     * @param   {Object}    数据
     * @return  {String}    渲染好的字符串
     */
    var renderN = zollty.renderN = function(filename, data) {
        var renderFn = zollty.getRender(filename, true);
        return data ? renderFn(data) : renderFn;
    };


    // 定义模板内部使用的函数
    var utils = {

        $include: render,

        $escape: escapeHTML,

        $each: forEach,

        $extFns: {} // 外部扩展函数
    };


    /**
     * 添加全局扩展函数
     * @name    zollty.extend
     * @param   {Object}   函数定义
     */
    zollty.extend = function(funs) {
        for (var name in funs) {
            utils.$extFns[name] = funs[name];
        }
    };

    /**
     * 编译模板，得到模板函数
     * @name    zollty.compile
     * @param   {String}    模板字符串
     * @param   {Object}    编译选项
     *
     *      - filename      {String}
     *      - escape        {Boolean}
     *      - compress      {Boolean}
     *      - debug         {Boolean}
     *      - cache         {Boolean}
     *
     * @return  {Function}  模板函数（如果编译错误的话就返回错误处理函数）
     */
    var compile = zollty.compile = function(source, options) {

        if(source === undefined || source===null || source==='' ) {
            throw {
                name: 'Error',
                message: 'Template is null or empty'
            };
        }

        // 合并默认配置
        options = options || {};
        for (var name in settings) {
            if (options[name] === undefined) {
                options[name] = settings[name];
            }
        }

        return compileTmpl(source, options);
    }


    /**
     * 获得模板的渲染函数
     * @name    zollty.createRender
     * @param   {String}    模板字符串
     * @param   {Object}    编译选项
     *
     *      - filename      {String}
     *      - escape        {Boolean}
     *      - compress      {Boolean}
     *      - debug         {Boolean}
     *      - cache         {Boolean}
     *
     * @return  {Function}  渲染函数
     */
    var createRender = zollty.createRender = function(source, options) {

        var filename = options.filename;

        // 获得编译后的模板函数
        var tmplFn;
        try {
            tmplFn = compile(source, options);

        } catch (e) { // 编译出错，打印出错信息

            return showError(e); // 用showError函数替代render函数
        }

        // 对模板函数进行一次包装，得到渲染函数
        var render = function(data) {
            try {

                return new tmplFn(data, filename) + ''; //函数转换为字符串
            } catch (e) {
                // 运行时出错后自动开启调试模式重新编译
                if (!options.debug) {
                    options.debug = true;
                    return createRender(source, options)(data);
                }
                // else 调用 showError处理，并返回异常信息
                return showError(e)();
            }
        }

        render.prototype = tmplFn.prototype;
        render.toString = function() {
            return tmplFn.toString();
        };


        if (filename && options.cache) {
            renderCache[filename] = render;
        }


        return render;

    }; // ～ end createRender


    // ~ Syntax analysis ----Begin

    var parseIncludeCode = function(key, split) {
        var tplUrl = split.shift();
        var multiVal = split.join(' ').replace(/\s+/g, ''); // delete all ' '
        var retObj;
        if (multiVal.charAt(0) === '(') {
            multiVal = multiVal.substring(1, multiVal.length - 1);
            var arrVal = multiVal.split(',');
            retObj = "{";
            var first = true;
            for (var i = 0; i < arrVal.length; i++) {
                if (first) {
                    retObj += "'" + arrVal[i] + "':" + arrVal[i];
                    first = false;
                } else {
                    retObj += ",'" + arrVal[i] + "':" + arrVal[i];
                }
            }
            retObj += "}";

        } else {
            retObj = multiVal;
        }
        // like "include('tpl/list-li',{'value':value,'i':i});"
        if (retObj === '') {
            return key + '(' + tplUrl + ',$data);';
        }
        return key + '(' + tplUrl + ',' + retObj + ');';
    };


    var filtered = function(js, filter) {
        var parts = filter.split(':');
        var name = parts.shift();
        name = name.replace(/^\s/, '');
        var args = parts.join(':') || '';

        if (args) {
            args = ', ' + args;
        }

        return '$extFns.' + name + '(' + js + args + ')';
    };


    /**
     * 模板语法转换成javascript格式(外部可重载，自定义模板语法)
     */
    var syntaxParser = zollty.syntaxParser = function(code, options) {

        // remove the first one whitespace charactor
        code = code.replace(/^\s/, '');

        var split = code.split(' ');
        var key = split.shift();
        var args = split.join(' ');

        switch (key) {

            case 'if':

                code = 'if(' + args + '){';
                break;

            case 'else':

                if (split.shift() === 'if') {
                    split = ' if(' + split.join(' ') + ')';
                } else {
                    split = '';
                }

                code = '}else' + split + '{';
                break;

            case '/if':

                code = '}';
                break;

            case 'each':

                var object = split[0] || '$data';
                var as = split[1] || 'as';
                var value = split[2] || '$value';
                var index = split[3] || '$index';

                var param = value + ',' + index;

                if (as !== 'as') {
                    object = '[]';
                }

                code = '$each(' + object + ',function(' + param + '){';
                break;

            case '/each':

                code = '});';
                break;

            case 'echo':

                code = 'print(' + args + ');';
                break;

            case 'print':
            case 'include':

                code = parseIncludeCode(key, split);
                break;

            default:

                // 过滤器（辅助方法）
                // {{value | filterA:'abcd' | filterB}}
                // >>> $extFns.filterB($extFns.filterA(value, 'abcd'))
                // TODO: {{ddd||aaa}} 不包含空格
                if (/^\s*\|\s*[\w\$]/.test(args)) {

                    var escape = true;

                    // like {{#value | link}}
                    if (code.charAt(0) === '#') {
                        code = code.substr(1);
                        escape = false;
                    }

                    var i = 0;
                    var array = code.split('|');
                    var len = array.length;
                    var val = array[i++];

                    for (; i < len; i++) {
                        val = filtered(val, array[i]);
                    }

                    code = (escape ? '=' : '=#') + val;

                // 内容直接输出 {{value}}
                } else {

                    code = '=' + code;
                }

                break;
        }

        return code;
    };

    // ~ Syntax analysis ------End


    // 保留的关键字（不可以作为变量名称）
    var KEYWORDS =
        // 关键字
        'break,case,catch,continue,debugger,default,delete,do,else,false'
        + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
        + ',throw,true,try,typeof,var,void,while,with'

        // 保留字
        +',abstract,boolean,byte,char,class,const,double,enum,export,extends'
        + ',final,float,goto,implements,import,int,interface,long,native'
        + ',package,private,protected,public,short,static,super,synchronized'
        + ',throws,transient,volatile'

        // ECMA 5 - use strict
        + ',arguments,let,yield'

        + ',undefined';

    var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
    var SPLIT_RE = /[^\w$]+/g;
    var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
    var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
    var BOUNDARY_RE = /^,+|,+$/g;
    var SPLIT2_RE = /^$|,+/;


    // 提取code字符串中的变量，例如 $extFns.myFun(time,'now')，则 $extFns和time是变量
    function getVariable(code) {
        return code
            .replace(REMOVE_RE, '')
            .replace(SPLIT_RE, ',')
            .replace(KEYWORDS_RE, '')
            .replace(NUMBER_RE, '')
            .replace(BOUNDARY_RE, '')
            .split(SPLIT2_RE);
    };


    var compileTmpl = function(source, options) {

        var debug = options.debug;
        var openTag = options.tags[0];
        var closeTag = options.tags[1];
        var compress = options.compress;
        var escape = options.escape;

        var line = 1;
        var uniq = {
            $data: 1,
            $filename: 1,
            $utils: 1,
            $extFns: 1,
            $out: 1,
            $line: 1
        };

        var isNewEngine = ''.trim; // '__proto__' in {}
        var replaces = isNewEngine
        ? ["$out='';", "$out+=", ";", "$out"]
        : ["$out=[];", "$out.push(", ");", "$out.join('')"];

        var concat = isNewEngine
        ? "$out+=text;return $out;"
        : "$out.push(text);";

        var print = "function(){"
        +      "var text=''.concat.apply('',arguments);"
        +       concat
        +  "}";

        var include = "function(filename,data){"
        +      "data=data||$data;"
        +      "var text=$utils.$include(filename,data);"
        +       concat
        +   "}";

        var headerCode = "'use strict';"
        + "var $utils=this,$extFns=$utils.$extFns,"
        + (debug ? "$line=0," : "");

        var mainCode = replaces[0];

        var footerCode = "return new String(" + replaces[3] + ");"

        // 语法解析
        forEach(source.split(openTag), function(code) {
            code = code.split(closeTag);

            var $0 = code[0];
            var $1 = code[1];

            // html code
            if (code.length === 1) {

                mainCode += htmlHandle($0);

            // template syntax code
            } else {

                mainCode += syntaxHandle($0);

                if ($1) {
                    mainCode += htmlHandle($1);
                }
            }

        });

        var code = headerCode + mainCode + footerCode;

        // 调试语句
        if (debug) {
            code = "try{" + code + "}catch(e){"
            +       "throw {"
            +           "filename:$filename,"
            +           "name:'Render error',"
            +           "message:e.message,"
            +           "line:$line,"
            +           "source:" + strEscape(source)
            +           ".split(/\\n/)[$line-1].replace(/^\\s+/,'')"
            +       "};"
            + "}";
        }

        try {
            var tmplFn = new Function("$data", "$filename", code);
            tmplFn.prototype = utils;

            return tmplFn;

        } catch (e) {
            e.name = 'Syntax error';
            e.tmplFn = "function anonymous($data,$filename) {" + code + "}";
            throw e;
        }

        // 处理 HTML 语句
        function htmlHandle(code) {
            // 记录行号
            line += code.split(/\n/).length - 1;
            // 压缩多余空白与注释
            if (compress) {
                code = code
                    .replace(/\s+/g, ' ')
                    .replace(/<!--[\w\W]*?-->/g, '');
            }
            if (code) {
                code = replaces[1] + strEscape(code) + replaces[2] + "\n";
            }
            return code;
        }


        // 处理模板语法语句
        function syntaxHandle(code) {

            // 语法转换成javascript格式
            code = syntaxParser(code, options);

            // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
            if (code.indexOf('=') === 0) {
                // 如果 escape==true 且 为 <%=#xxx%>格式，则对其编码
                var flag = escape && !/^=[=#]/.test(code);

                code = code.replace(/^=[=#]?|[\s;]*$/g, '');
                // 对内容编码
                if (flag) {
                    var name = code.replace(/\s*\([^\)]+\)/, '');
                    // 排除 utils.* | include | print
                    if (!utils[name] && !/^(include|print)$/.test(name)) {
                        code = "$escape(" + code + ")";
                    }

                }
                // else { // 不编码 }

                code = replaces[1] + code + replaces[2];
            }

            if (debug) {
                code = "$line=" + line + ";" + code;
            }

            // 提取模板中的变量名
            forEach(getVariable(code), function(name) {

                // name 值可能为空，在安卓低版本浏览器下
                if (!name || uniq[name]) {
                    return;
                }

                var value;

                // 声明模板变量
                // 赋值优先级:
                // [include, print] > utils > extFns > data
                if (name === 'print') {

                    value = print;

                } else if (name === 'include') {

                    value = include;

                } else if (utils[name]) {

                    value = "$utils." + name;

                } else if (utils.$extFns[name]) {

                    value = "$extFns." + name;

                } else {

                    value = "$data." + name;
                }

                headerCode += name + "=" + value + ",";
                uniq[name] = true;

            });

            return code + "\n";
        }

    };


}));
