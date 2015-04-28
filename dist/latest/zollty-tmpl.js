/*! zollty-tmpl.js v1.2.0 - https://github.com/zollty-org/zollty-tmpl/ */!function(a,b){"object"==typeof exports&&exports?b(exports):"function"==typeof define&&define.amd?define(["exports"],b):b(a.zollty={})}(this,function(a){function x(a){return a.replace(r,"").replace(s,",").replace(t,"").replace(u,"").replace(v,"").split(w)}function y(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function z(b,c){function A(a){return j+=a.split(/\n/).length-1,h&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=n[1]+y(a)+n[2]+"\n"),a}function B(b){var e=j;if(g?b=g(b,c):d&&(b=b.replace(/\n/g,function(){return j++,"$line="+j+";"})),0===b.indexOf("=")){var f=i&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),f){var h=b.replace(/\s*\([^\)]+\)/,"");m[h]||/^(include|print)$/.test(h)||(b="$escape("+b+")")}else b="$string("+b+")";b=n[1]+b+n[2]}return d&&(b="$line="+e+";"+b),p(x(b),function(b){if(b&&!k[b]){var c;c="print"===b?q:"include"===b?r:m[b]?"$utils."+b:a.helpers[b]?"$helpers."+b:"$data."+b,s+=b+"="+c+",",k[b]=!0}}),b+"\n"}var d=c.debug,e=c.openTag,f=c.closeTag,g=c.parser,h=c.compress,i=c.escape,j=1,k={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},l="".trim,n=l?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],o=l?"$out+=text;return $out;":"$out.push(text);",q="function(){var text=''.concat.apply('',arguments);"+o+"}",r="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+o+"}",s="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(d?"$line=0,":""),t=n[0],u="return new String("+n[3]+");";p(b.split(e),function(a){a=a.split(f);var b=a[0],c=a[1];1===a.length?t+=A(b):(t+=B(b),c&&(t+=A(c)))});var v=s+t+u;d&&(v="try{"+v+"}catch(e){"+"throw {"+"filename:$filename,"+"name:'Render Error',"+"message:e.message,"+"line:$line,"+"source:"+y(b)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')"+"};"+"}");try{var w=new Function("$data","$filename",v);return w.prototype=m,w}catch(z){throw z.temp="function anonymous($data,$filename) {"+v+"}",z}}a.render=function(a,b){return d(a,b)},a.version="1.2.0",a.config=function(a,c){b[a]=c};var b=a.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},c=a.cache={},d=a.renderFile=function(b,c){var d=a.get(b)||n({filename:b,name:"Render Error",message:"Template not found"});return c?d(c):d};a.get=function(a){var b;if(c[a])b=c[a];else if(f(a,"/")){var d=e(a);b=o(d,{filename:a})}else if("object"==typeof document){var g=document.getElementById(a);if(g){var d=(g.value||g.innerHTML).replace(/^\s*|\s*$/g,"");b=o(d,{filename:a})}}return b};var e=function(a){var b=void 0!==window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):new window.XMLHttpRequest;b.open("GET",a,!1);try{b.send(null)}catch(c){return null}return 404==b.status||2==b.status||0==b.status&&""==b.responseText?null:b.responseText},f=function(a,b){for(var c=0;c<a.length;c++)if(a.charAt(c)===b)return!0;return!1},g=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?g(a.call(a)):""),a},h={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},i=function(a){return h[a]},j=function(a){return g(a).replace(/&(?![\w#]+;)|[<>"']/g,i)},k=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},l=function(a,b){var c,d;if(k(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},m=a.utils={$helpers:{},$include:d,$string:g,$escape:j,$each:l};a.helpers=m.$helpers,a.addHelper=function(b,c){a.helpers[b]=c},a.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var n=function(b){return a.onerror(b),function(){return"{Template Error}"}},o=a.compile=function(a,d){function i(b){try{return new g(b,f)+""}catch(c){return d.debug?n(c)():(d.debug=!0,o(a,d)(b))}}"string"==typeof d&&(d={filename:d}),d=d||{};for(var e in b)void 0===d[e]&&(d[e]=b[e]);var f=d.filename;try{var g=z(a,d)}catch(h){return h.filename=f||"anonymous",h.name="Syntax Error",n(h)}return i.prototype=g.prototype,i.toString=function(){return g.toString()},f&&d.cache&&(c[f]=i),i},p=m.$each,q="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",r=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,s=/[^\w$]+/g,t=new RegExp(["\\b"+q.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),u=/^\d[^,]*|,\d[^,]*/g,v=/^,+|,+$/g,w=/^$|,+/;b.openTag="{{",b.closeTag="}}";var A=function(a,b){var c=b.split(":"),d=c.shift();d=d.replace(/^\s/,"");var e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};b.parser=function(b){b=b.replace(/^\s/,"");var d=b.split(" "),e=d.shift(),f=d.join(" ");switch(e){case"if":b="if("+f+"){";break;case"else":d="if"===d.shift()?" if("+d.join(" ")+")":"",b="}else"+d+"{";break;case"/if":b="}";break;case"each":var g=d[0]||"$data",h=d[1]||"as",i=d[2]||"$value",j=d[3]||"$index",k=i+","+j;"as"!==h&&(g="[]"),b="$each("+g+",function("+k+"){";break;case"/each":b="});";break;case"echo":b="print("+f+");";break;case"print":case"include":b=e+"("+d.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(f)){var l=!0;"#"===b.charAt(0)&&(b=b.substr(1),l=!1);for(var m=0,n=b.split("|"),o=n.length,p=n[m++];o>m;m++)p=A(p,n[m]);b=(l?"=":"=#")+p}else b=a.helpers[e]?"=#"+e+"("+d.join(",")+");":"="+b}return b}});