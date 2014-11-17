# ZolltyTmpl.js

HTML or String Template Engine with JavaScript


##	Characteristic

0.  fast, small and has no dependencies.
1.  support include inner template.
2.  support json, array and any js object as render data.
3.  concise syntax, easy to use.
4.  support all frequently-used browsers.
5.  support using html script or just string as template. 
6.  support using under both browsers and nodejs.



## Usage

### Writing templates

uses script-tag to wrap template in html：
	
	<script id="test" type="text/html">
	<h1>{{title}}</h1>
	<ul>
	    {{each list as value i}}
	        <li>Index. {{i + 1}} ：{{value}}</li>
	    {{/each}}
	</ul>
	</script>
	
or just write the template content in a file:

	<h1>{{title}}</h1>
	<ul>
	    {{each list as value i}}
	        <li>Index. {{i + 1}} ：{{value}}</li>
	    {{/each}}
	</ul>
	
### Render template

use zollty.render('test', data) to render template:  

	var data = {
		title: 'This is title',
		list: ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg']
	};
	var html = zollty.render('test', data);
	document.getElementById('content').innerHTML = html;


[See Examples](https://github.com/zollty-org/zollty-tmpl/tree/master/examples/basic-usage.html)


##	Download

* [zollty-tmpl.js](https://raw.github.com/zollty-org/zollty-tmpl/master/dist/1.0.0/zollty-tmpl.js) 


##	NodeJS

###	Install

	npm install zollty-tmpl
	
###	Usage

	var template = require('zollty-tmpl');
	var data = {list: ["aaa", "test"]};
	
	var html = template(__dirname + '/index/main', data);


## Change-log


## Licenses

Released under the MIT, BSD, and GPL Licenses
zollty.com
============

See: [引擎原理](http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line)
