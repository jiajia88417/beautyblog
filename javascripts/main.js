require.config({
    baseUrl: './javascripts/',
    shim: {
    	"jqueryui": {
            exports: "$",
            deps: ['jquery']
        }
    },
    paths: {
        main: 'main',
        bloglist: './bloglist',
        domReady: 'libs/domReady',
        jquery: 'libs/jquery-2.1.1.min',
        jqueryui: "libs/jquery-ui.min",
        markdown: 'libs/Markdown.Converter',
        underscore: 'libs/underscore-min'
    }
});

require(['jquery',
	     'underscore',
	     'domReady',
         'bloglist',
	     'markdown',         
	    ],
function($,
	     _,
		 domReady,
		 bloglist) {
	

  domReady(function () {
    // grouping blogs by dates
    var blogs = new Object();
    _.each(bloglist.blogs, function(date){
    	var year = date.substring(0, 4);
    	var month = date.substring(4, 6);
    	var day = date.substring(6, 8);
    	var misc = date.substring(8);
        if(blogs[year] === undefined){
        	blogs[year] = new Object();
        }
        if(blogs[year][month] === undefined){
        	blogs[year][month] = new Object();
        }
        if(blogs[year][month][day] === undefined){
        	blogs[year][month][day] = new Array();
        }
        blogs[year][month][day].push('blogs/'+date);
    });

//    console.log(blogs);
    // create nested blog list
    var blogListDom = $('ul.blogList');
    for(var year in blogs){
    	var li = $('<li>'+year+'</li>');
    	blogListDom.add(li);
    }
    blogListDom.appendTo($('div.blog_list'));



  	 var loadContent = function(path) {
        var converter = new Markdown.Converter(),
            markdownToHtml = converter.makeHtml;
        $.get(path)
         .success(function (data) {
            $('.content_body').html(markdownToHtml(data));
          })
         .fail(function() {
            $.get(path)
             .success(function (data) {
              $('.content_body').html(markdownToHtml(data));
             })
          });
      };        
      
      $(function() {
        $(window).on('hashchange',function(){ 
           loadContent(location.hash.slice(1));
        });

        loadContent('main.md');
      })

  });		
  
});