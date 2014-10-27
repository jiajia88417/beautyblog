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
        domReady: 'libs/domReady',
        markdown: 'libs/Markdown.Converter',
        jquery: 'libs/jquery-2.1.1.min',
        jqueryui: "libs/jquery-ui.min",
        bloglist: './bloglist'
    }
});

require(['jquery',
	     'domReady',
         'bloglist',
	     'markdown',         
	    ],
function($,
		 domReady,
		 bloglist) {
	
  domReady(function () {
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