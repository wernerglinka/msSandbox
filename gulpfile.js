/* eslint capitalized-comments: "always" */

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var gulp = require('gulp');
var browserSync = require('browser-sync').create();


var Metalsmith = require('metalsmith');
var drafts = require('metalsmith-drafts');
var tags = require('./local_modules/metalsmith-tags-with-metadata');
var markdownSections = require('metalsmith-markdown-sections');
var excerpts = require('metalsmith-excerpts');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var pagination = require('metalsmith-pagination');
var layouts = require('metalsmith-layouts');
var inPlace = require('metalsmith-in-place');
var assets = require('metalsmith-assets');
var sitemap = require('metalsmith-sitemap');
var robots = require('metalsmith-robots');
var htmlMinifier = require('metalsmith-html-minifier');
var metadata = require('metalsmith-metadata');
var frontmatter = require('metalsmith-matters');
var highlightCode = require('metalsmith-prism');
var writemetadata = require('metalsmith-writemetadata');
var recentPosts = require('./local_modules/metalsmith-recent-blog-posts');
var marked = require('marked');

// path variables
var contentPath = "./dev/content";
var assetPath = "./dev/sources";
var scriptPath = "./dev/scripts";
var stylePath = "./dev/styles";
var layoutPath = "./dev/layouts";
var destPath = "./build";

// assets
var sequence = require('gulp-sequence');
var order = require('gulp-order');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var compressJS = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

// template engine
var nunjucks = require('nunjucks');
var CaptureTag = require('nunjucks-capture');
var dateFilter = require('nunjucks-date-filter');

nunjucks
    .configure(['./dev/layouts','./dev/layouts/partials'], {watch: false, autoescape:false})
    .addExtension('CaptureTag', new CaptureTag())
    .addFilter('is_string', function(obj) {
      return typeof obj == 'string';
    })
    .addFilter('date', dateFilter);

// metalsmith
function setupMetalsmith(callback) {

    Metalsmith(process.cwd())
        .source('./dev/content')
        .destination('./build')
        .clean(true)

        // check if this works as expected !!!!!!!!!!!
        .use(frontmatter({
            namespace: 'page'
        }))

        .use(metadata({
          "site": "data/site.yml",
          "authors": "data/authors.yml",
          "navigation": "data/navigation.yml",
          "site_promos": "data/site-promos.yml"
        }))

        .use(drafts())

        .use(tags({
            "handle": "tags",
            "path": "topics/:tag.html",
            "layout": "blog.html",
            "sortBy": "date",
            "reverse": true,
            "skipMetadata": false,
            "addMetadata": {
              "body_classes": "blog has-sidebar is-tag-page",
              "is_tag_page": true
            },
            "slug": {
              "mode": "rfc3986"
            }
        }))

        .use(collections({
            "blog": {
              "pattern": "blog/**/*.md",
              "sortBy": "date",
              "reverse": true
            }
        }))

        .use(pagination({
            "collections.blog": {
              "perPage": 5,
              "layout": "blog.html",
              "first": "blog/1/index.html",
              "path": 'blog/:num/index.html',
              "pageMetadata": {
                  "title": "The Blog",
                  "has_top_message": true,
                  "has_footer_promo": true,
                  "body_classes": "blog has-sidebar"
                }
            }
        }))

        .use(recentPosts({
          "latest_quantity": 4, // length of the recent posts list
          "featured_quatity": 4 // length of the featured posts list
        }))

        .use(inPlace({
            "pattern": "**/*.html"
        }))

        .use(markdownSections({
            "smartypants": true,
            "smartLists": true,
            "gfm": true,
            "tables": true,
            "langPrefix": 'language-'
        }))

        .use(highlightCode({
            "lineNumbers": true
        }))

        .use(excerpts())

        .use(permalinks({
          "pattern": ":collections/:title"
        }))

        .use(layouts({
            "engine": "nunjucks",
            "directory": "./dev/layouts",
            "partials": "./dev/layouts/partials"
        }))

        .use(assets({
            "source": "./dev/sources",
            "destination": "./"
        }))

        .use(sitemap({
            "hostname": "https://www.sitename.com",
            "omitIndex": true
        }))

        .use(robots({
            "useragent": "googlebot",
            "allow": ["index.html", "about.html"],
            "disallow": ["404.html"],
            "sitemap": "http://www.sitename.com/sitemap.xml"
        }))

//        .use(writemetadata({
//          pattern: ['**/*.html'],
//          ignorekeys: ['next', 'contents', 'previous'],
//          bufferencoding: 'utf8'
//       }))

        .build(function(err) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            callback();
        });
}

//Gulp tasks
gulp.task('metalsmith', function(callback) {
    setupMetalsmith(callback);
});

gulp.task('vendorScripts', function() {
    return gulp.src([
            "node_modules/jquery/dist/jquery.js",
            "node_modules/jquery.easing/jquery.easing.js",
            "node_modules/jquery-hoverintent/jquery.hoverIntent.js",
            "node_modules/js-breakpoints/breakpoints.js"
        ])
        .pipe(concat('vendors.min.js'))
        .pipe(compressJS())
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')))
});

gulp.task('scripts', function () {
    return gulp.src(path.join(__dirname, scriptPath, '**/*.js'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(order([
          path.join(__dirname, scriptPath, 'ready.js'),
          path.join(__dirname, scriptPath, 'modules/touchClick.js'),
          path.join(__dirname, scriptPath, 'modules/hoverMenu.js'),
          path.join(__dirname, scriptPath, 'modules/mobileMenu.js'),
          path.join(__dirname, scriptPath, 'modules/youTubeVideos.js'),
          path.join(__dirname, scriptPath, 'modules/lineNumbers.js'),
          path.join(__dirname, scriptPath, 'modules/externalLinks.js'),
          path.join(__dirname, scriptPath, 'modules/modifyMarketoForm.js'),
          path.join(__dirname, scriptPath, 'modules/scrollHomeNav.js'),
          path.join(__dirname, scriptPath, 'modules/smallImage.js'),
          path.join(__dirname, scriptPath, 'modules/bannerBackground.js'),
          path.join(__dirname, scriptPath, 'modules/scrollToTop.js')
        ]))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/scripts')));
});

// compile style sheet for development
gulp.task('styles', function() {
    return gulp.src(path.join(__dirname, stylePath, 'main.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass({style: 'expanded'}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(__dirname, assetPath, 'assets/styles')));
});

gulp.task('buildDev', function (cb) {
  sequence([
    'vendorScripts',
    'scripts',
    'styles'
    ],
    'metalsmith',
    cb
  )
});

// having buildDev as a dependency for the refresh task insures that they are executed before browerSync is run
// reference: browsersync.io/docs/gulp
gulp.task('refresh', ['buildDev'], function (done) {
  browserSync.reload();
  done();
})

gulp.task('default', ['buildDev'], function () {

  browserSync.init({
    server: {
      baseDir: "build"
    },
    open: false
  });

  gulp.watch([
    "./dev/scripts/**/*",
    "./dev/styles/**/*",
    "./dev/content/**/*",
    "./dev/layouts/**/*",
    "./dev/sources/**/*"
  ], ['refresh']);
});


