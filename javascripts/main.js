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
      var yearBlogCount = 0;
      for(var month in blogs[year]){
        yearBlogCount += blogs[year][month].length;
      }

    	var yearEle = $('<li>'+year+' ('+yearBlogCount+') '+'</li>');  
      yearList.prepend(yearEle);      
      var monthList = $('<ul></ul>');
      yearEle.append(monthList);


      var monthNameMap = {
        '01' : 'Jan',
        '02' : 'Feb',
        '03' : 'Mar',
        '04' : 'Apr',
        '05' : 'May',
        '06' : 'Jun',
        '07' : 'Jul',
        '08' : 'Aug',
        '09' : 'Sep',
        '10' : 'Oct',
        '11' : 'Nov',
        '12' : 'Dec'        
      }
      // months
      for(var month in blogs[year]){
        var monthBlogCount = blogs[year][month].length; 

        var monthEle = $('<li>'+monthNameMap[month]+' ('+monthBlogCount+')</li>');
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


    var converter = new Markdown.Converter(),
        markdownToHtml = converter.makeHtml;
    var loadContent = function(path) {
        $.get(path+'/content.md')
         .success(function (data) {
            $('.content_body').html(markdownToHtml(data));
          })
         .fail(function() {
            // implicitly load main page
            if(path != 'main'){
              window.location = '';
            }
          });
    }

  	var loadGallery = function(path) {
      $.get(path+'/gallery.md')
       .success(function (data) {
            $('.gallery').html(markdownToHtml(data));
        });
    };        
      

    var loadPage = function(path){
      if(path === undefined || path === ''){
        // load main page on error
        path = 'main';
      }

      loadContent(path);
      loadGallery(path);
    }  
    $(function() {
      $(window).on('hashchange',function(){ 
        loadPage(location.hash.slice(1));
           // update class of items in the blog list 
      });
      // on first load
      loadPage(location.hash.slice(1));
    })

  });		
  
});