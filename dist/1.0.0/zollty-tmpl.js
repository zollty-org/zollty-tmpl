/*!ZolltyTmpl.js - https://github.com/zollty-org/zollty-tmpl/*/
!function(e,n){"object"==typeof exports&&exports?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.zollty={})}(this,function(e){function n(e){return e.replace(w,"").replace(x,",").replace(T,"").replace(j,"").replace(k,"").split(E)}function t(e){return"'"+e.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function r(e,r){function a(e){return p+=e.split(/\n/).length-1,u&&(e=e.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),e&&(e=v[1]+t(e)+v[2]+"\n"),e}function i(e){var t=p
if(s?e=s(e,r):o&&(e=e.replace(/\n/g,function(){return p++,"$line="+p+";"})),0===e.indexOf("=")){var a=f&&!/^=[=#]/.test(e)
if(e=e.replace(/^=[=#]?|[\s;]*$/g,""),a){var i=e.replace(/\s*\([^\)]+\)/,"")
g[i]||/^(include|print)$/.test(i)||(e="$escape("+e+")")}else e="$string("+e+")"
e=v[1]+e+v[2]}return o&&(e="$line="+t+";"+e),y(n(e),function(e){if(e&&!$[e]){var n
n="print"===e?b:"include"===e?w:g[e]?"$utils."+e:h[e]?"$helpers."+e:"$data."+e,x+=e+"="+n+",",$[e]=!0}}),e+"\n"}var o=r.debug,c=r.openTag,l=r.closeTag,s=r.parser,u=r.compress,f=r.escape,p=1,$={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},d="".trim,v=d?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],m=d?"$out+=text;return $out;":"$out.push(text);",b="function(){var text=''.concat.apply('',arguments);"+m+"}",w="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+m+"}",x="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(o?"$line=0,":""),T=v[0],j="return new String("+v[3]+");"
y(e.split(c),function(e){e=e.split(l)
var n=e[0],t=e[1]
1===e.length?T+=a(n):(T+=i(n),t&&(T+=a(t)))})
var k=x+T+j
o&&(k="try{"+k+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+t(e)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}")
try{var E=Function("$data","$filename",k)
return E.prototype=g,E}catch(A){throw A.temp="function anonymous($data,$filename) {"+k+"}",A}}e.render=function(e,n){return o(e,n)},e.version="1.0.0",e.config=function(e,n){a[e]=n}
var a=e.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},i=e.cache={},o=e.renderFile=function(n,t){var r=e.get(n)||v({filename:n,name:"Render Error",message:"Template not found"})
return t?r(t):r}
e.get=function(e){var n
if(i[e])n=i[e]
else if(l(e,"/")){var t=c(e)
n=m(t,{filename:e})}else if("object"==typeof document){var r=document.getElementById(e)
if(r){var t=(r.value||r.innerHTML).replace(/^\s*|\s*$/g,"")
n=m(t,{filename:e})}}return n}
var c=function(e){var n=void 0!==window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):new window.XMLHttpRequest
n.open("GET",e,!1)
try{n.send(null)}catch(t){return null}return 404==n.status||2==n.status||0==n.status&&""==n.responseText?null:n.responseText},l=function(e,n){for(var t=0;t<e.length;t++)if(e.charAt(t)===n)return!0
return!1},s=function(e,n){return"string"!=typeof e&&(n=typeof e,"number"===n?e+="":e="function"===n?s(e.call(e)):""),e},u={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},f=function(e){return u[e]},p=function(e){return s(e).replace(/&(?![\w#]+;)|[<>"']/g,f)},$=Array.isArray||function(e){return"[object Array]"==={}.toString.call(e)},d=function(e,n){var t,r
if($(e))for(t=0,r=e.length;r>t;t++)n.call(e,e[t],t,e)
else for(t in e)n.call(e,e[t],t)},g=e.utils={$helpers:{},$include:o,$string:s,$escape:p,$each:d}
e.helper=function(e,n){h[e]=n}
var h=e.helpers=g.$helpers
e.onerror=function(e){var n="Template Error\n\n"
for(var t in e)n+="<"+t+">\n"+e[t]+"\n\n"
"object"==typeof console&&console.error(n)}
var v=function(n){return e.onerror(n),function(){return"{Template Error}"}},m=e.compile=function(e,n){function t(t){try{return new l(t,c)+""}catch(r){return n.debug?v(r)():(n.debug=!0,m(e,n)(t))}}"string"==typeof n&&(n={filename:n}),n=n||{}
for(var o in a)void 0===n[o]&&(n[o]=a[o])
var c=n.filename
try{var l=r(e,n)}catch(s){return s.filename=c||"anonymous",s.name="Syntax Error",v(s)}return t.prototype=l.prototype,t.toString=function(){return""+l},c&&n.cache&&(i[c]=t),t},y=g.$each,b="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",w=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,x=/[^\w$]+/g,T=RegExp("\\b"+b.replace(/,/g,"\\b|\\b")+"\\b","g"),j=/^\d[^,]*|,\d[^,]*/g,k=/^,+|,+$/g,E=/^$|,+/
a.openTag="{{",a.closeTag="}}"
var A=function(e,n){var t=n.split(":"),r=t.shift(),a=t.join(":")||""
return a&&(a=", "+a),"$helpers."+r+"("+e+a+")"}
a.parser=function(n){n=n.replace(/^\s/,"")
var t=n.split(" "),r=t.shift(),a=t.join(" ")
switch(r){case"if":n="if("+a+"){"
break
case"else":t="if"===t.shift()?" if("+t.join(" ")+")":"",n="}else"+t+"{"
break
case"/if":n="}"
break
case"each":var i=t[0]||"$data",o=t[1]||"as",c=t[2]||"$value",l=t[3]||"$index",s=c+","+l
"as"!==o&&(i="[]"),n="$each("+i+",function("+s+"){"
break
case"/each":n="});"
break
case"echo":n="print("+a+");"
break
case"print":case"include":n=r+"("+t.join(",")+");"
break
default:if(/^\s*\|\s*[\w\$]/.test(a)){var u=!0
0===n.indexOf("#")&&(n=n.substr(1),u=!1)
for(var f=0,p=n.split("|"),$=p.length,d=p[f++];$>f;f++)d=A(d,p[f])
n=(u?"=":"=#")+d}else n=e.helpers[r]?"=#"+r+"("+t.join(",")+");":"="+n}return n}})