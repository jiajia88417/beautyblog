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
    _.each(bloglist.blogs, function(blog){
    	var year = blog.date.substring(0, 4);
    	var month = blog.date.substring(4, 6);

        if(blogs[year] === undefined){
        	blogs[year] = new Object();
        }
        if(blogs[year][month] === undefined){
        	blogs[year][month] = new Array();
        }
        blogs[year][month].push(
          { title: blog.title,
            path: 'blogs/'+blog.date
          }
        );
    });

//    console.log(blogs);
    // create nested blog list
    var blogListDom = $('div.blog_list');
    var yearList = $('<ul></ul>');
    for(var year in blogs){
    	var yearEle = $('<li>'+year+' (??) '+'</li>');  
      yearList.prepend(yearEle);      
      var monthList = $('<ul></ul>');
      yearEle.append(monthList);

      // months
      for(var month in blogs[year]){
        var monthEle = $('<li>'+month+'</li>');
        monthList.append(monthEle);
        var dayList = $('<ul></ul>');
        monthEle.append(dayList);
        // days
        for (var blogindex in blogs[year][month]) {
            var bEle = $('<li>'+
              '<a href=#'+blogs[year][month][blogindex].path+'>'+
              blogs[year][month][blogindex].title
              +'</a></li>');
            dayList.append(bEle);            
        };
      }
    }
    blogListDom.prepend(yearList);



  	 var loadContent = function(path) {
        var converter = new Markdown.Converter(),
            markdownToHtml = converter.makeHtml;
        $.get(path+'content.md')
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