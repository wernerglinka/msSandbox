/*jslint regexp: true, nomen: true*/
/*global require, process, console, __dirname*/

var path = require("path");
var argv = require("minimist")(process.argv.slice(2));
var gulp = require("gulp");
var browserSync = require("browser-sync").create();


var metalsmith = require("metalsmith");
var drafts = require("metalsmith-drafts");
var tags = require("./local_modules/metalsmith-tags-with-metadata");
var categories = require("./local_modules/metalsmith-categories-with-metadata");
var markdownSections = require("metalsmith-markdown-sections");
var excerpts = require("metalsmith-excerpts");
var permalinks = require("metalsmith-permalinks");
var collections = require("metalsmith-collections");
var pagination = require("metalsmith-pagination");
var layouts = require("metalsmith-layouts");
var inPlace = require("metalsmith-in-place");
var assets = require("metalsmith-assets");
var sitemap = require("metalsmith-sitemap");
var robots = require("metalsmith-robots");
var htmlMinifier = require("metalsmith-html-minifier");
var metadata = require("metalsmith-metadata");
var frontmatter = require("metalsmith-matters");
var highlightCode = require("metalsmith-prism");
var writemetadata = require("metalsmith-writemetadata");
var renamer = require("metalsmith-renamer");
var postsList = require("./local_modules/metalsmith-blog-helper");
//var postsList = require('./local_modules/metalsmith-blog-post-lists');
var msIgnore = require("metalsmith-ignore");

var util = require("util");
require("util.promisify").shim();
var deleteEmptyDirectories = require("delete-empty");

var getJobs = require("./local_modules/metalsmith-build-job-pages");

//var mdPartials = require('./local_modules/metalsmith-markdown-partials');
var mdPartials = require("metalsmith-markdown-partials");

//var allPosts = require('./local_modules/metalsmith-all-blogs-list');

// path variables
var assetPath = "./dev/sources";
var scriptPath = "./dev/scripts";
var stylePath = "./dev/styles";
var destPath = "./build";

// assets
var sequence = require("gulp-sequence");
var order = require("gulp-order");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var concat = require("gulp-concat");
var compressJS = require("gulp-uglify");


// template engine
var nunjucks = require("nunjucks");
var CaptureTag = require("nunjucks-capture");
var dateFilter = require("nunjucks-date-filter");

nunjucks
    .configure(["./dev/layouts", "./dev/layouts/partials"], {watch: false, autoescape: false})
    .addExtension("CaptureTag", new CaptureTag())
    .addFilter("is_string", function (obj) {
        "use strict";
        return typeof obj === "string";
    })
    .addFilter("is_array", function (obj) {
        "use strict";
        return Array.isArray(obj);
    })
    .addFilter("date", dateFilter)
    // replaces a file extension with a "/". Needed in generating custom XML feeds
    .addFilter("makePermalink", function (obj) {
        "use strict";
        return obj.replace(/.md/g, "/");
    })
    // converts a date into a UTC string. Needed for XML dates
    .addFilter("UTCdate", function (date) {
        "use strict";
        return date.toUTCString();
    })
    // when building an XML page any text that contains html "<", ">" and "&" characters need to be escaped
    .addFilter("escapeHTML", function (text) {
        "use strict";
        return (text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    })
    // strips all html from a string
    .addFilter("stripHTML", function (htmlString) {
        "use strict";
        return htmlString.replace(/<[^>]+>/g, "");
    })
    .addFilter("spaceToDash", function (string) {
        "use strict";
        return string.replace(/\s+/g, "-");
    });

// metalsmith
function setupMetalsmith(callback) {
    "use strict";

    metalsmith(process.cwd())

        //.use(getJobs())
        
        .source("./dev/content")
        .destination("./build")
        .clean(true)

        // check if this works as expected !!!!!!!!!!!
        //.use(frontmatter({
        //    namespace: 'page'
        //}))

        .use(metadata({
            "site": "data/site.yml",
            "authors": "data/authors.yml",
            "navigation": "data/navigation.yml",
            "site_promos": "data/site-promos.yml"
        }))

        .use(drafts())

        // ignore the partial markdown files in library
        .use(msIgnore([
            "library/*",
            "data/*"
        ]))

        //.use(mdPartials({"libraryPath": contentPath + '/library/'}))
        // option default is ./dev/content/library/
        .use(mdPartials())

        .use(categories({
            "handle": "categories",
            "path": "blog/categories/:category.html",
            "pathPage": "blog/categories/:category/:num/index.html",
            "perPage": 5,
            "layout": "blog.html",
            "sortBy": "date",
            "reverse": true,
            "skipMetadata": false,
            "addMetadata": {
                "body_classes": "blog has-sidebar",
                "is_category_page": true,
                "has_top_message": true,
                "has_navigation": true,
                "has_footer_navigation": true,
                "has_footer_promo": true
            },
            "slug": {
                "mode": "rfc3986"
            }
        }))

        .use(tags({
            "handle": "tags",
            "path": "topics/:tag.html",
            "pathPage": "topics/:tag/:num/index.html",
            "perPage": 5,
            "layout": "blog.html",
            "sortBy": "date",
            "reverse": true,
            "skipMetadata": false,
            "addMetadata": {
                "body_classes": "blog has-sidebar",
                "is_tag_page": true,
                "has_top_message": true,
                "has_navigation": true,
                "has_footer_navigation": true,
                "has_footer_promo": true
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
                "path": "blog/:num/index.html",
                "pageMetadata": {
                    "title": "The Blog",
                    "has_top_message": true,
                    "has_footer_promo": true,
                    "body_classes": "blog has-sidebar"
                }
            }
        }))

        .use(postsList({
            "latest_quantity": 2, // length of the recent posts list
            "featured_quantity": 2 // length of the featured posts list
        }))

        // in-place enables import code sections ??
        .use(inPlace({
            "engine": "nunjucks",
            "directory": "./dev/layouts",
            "partials": "./dev/layouts/partials"
        }))

        .use(markdownSections({
            "smartypants": true,
            "smartLists": true,
            "gfm": true,
            "tables": true,
            "langPrefix": "language-"
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

        // we created the xml file using a html template. here we change the
        // file extension to xml
        .use(renamer({
            htmlToXml: {
                pattern: "feeds/*.html",
                rename: function (name) {
                    return name.replace(/html/, "xml");
                }
            }
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

        //.use(writemetadata({
        //    pattern: ["**/*.html"],
        //    ignorekeys: ["next", "contents", "previous"],
        //    bufferencoding: "utf8"
        //}))

        .build(function (err) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            callback();
        });
}

//Gulp tasks
gulp.task("metalsmith", function (callback) {
    "use strict";
    setupMetalsmith(callback);
});

gulp.task("vendorScripts", function () {
    "use strict";
    return gulp.src([
        "node_modules/jquery/dist/jquery.js",
        "node_modules/jquery.easing/jquery.easing.js",
        "node_modules/jquery-hoverintent/jquery.hoverIntent.js",
        "node_modules/js-breakpoints/breakpoints.js"
    ])
        .pipe(concat("vendors.min.js"))
        .pipe(compressJS())
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/scripts")));
});

gulp.task("scripts", function () {
    "use strict";
    return gulp.src(path.join(__dirname, scriptPath, "**/*.js"))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(order([
            path.join(__dirname, scriptPath, "ready.js"),
            path.join(__dirname, scriptPath, "modules/**.js")
        ]))
        .pipe(concat("main.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/scripts")));
});

// compile style sheet for development
gulp.task("styles", function () {
    "use strict";
    return gulp.src(path.join(__dirname, stylePath, "main.scss"))
        .pipe(sourcemaps.init())
        .pipe(sass({style: "expanded"}))
        .pipe(autoprefixer("last 2 version"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/styles")));
});

// delete all empty directories after the project build
gulp.task("deleteEmptyDir", function () {
    "use strict";
    deleteEmptyDirectories.sync(destPath);
});

gulp.task("buildDev", function (cb) {
    "use strict";
    sequence([
        "vendorScripts",
        "scripts",
        "styles"
    ],
            "metalsmith",
            "deleteEmptyDir",
            cb);
});

// having buildDev as a dependency for the refresh task insures that they are executed before browerSync is run
// reference: browsersync.io/docs/gulp
gulp.task("refresh", ["buildDev"], function (done) {
    "use strict";
    browserSync.reload();
    done();
});

gulp.task("default", ["buildDev"], function () {
    "use strict";
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
    ], ["refresh"]);
});

gulp.task("buildProd", function (cb) {
    "use strict";
    sequence([
        "vendorScripts",
        "productionScripts",
        "productionStyles"
    ],
            "metalsmith",
            //"deleteEmptyDir",
            cb);

    //deleteEmptyDirectories.sync(destPath);
});

gulp.task("productionScripts", function () {
    "use strict";
    return gulp.src(path.join(__dirname, scriptPath, "**/*.js"))
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(order([
            path.join(__dirname, scriptPath, "ready.js"),
            path.join(__dirname, scriptPath, "modules/**.js")
            //path.join(__dirname, scriptPath, "modules/touchClick.js"),
            //path.join(__dirname, scriptPath, "modules/hoverMenu.js"),
            //path.join(__dirname, scriptPath, "modules/mobileMenu.js"),
            //path.join(__dirname, scriptPath, "modules/youTubeVideos.js"),
            //path.join(__dirname, scriptPath, "modules/lineNumbers.js"),
            //path.join(__dirname, scriptPath, "modules/externalLinks.js"),
            //path.join(__dirname, scriptPath, "modules/modifyMarketoForm.js"),
            //path.join(__dirname, scriptPath, "modules/scrollHomeNav.js"),
            //path.join(__dirname, scriptPath, "modules/smallImage.js"),
            //path.join(__dirname, scriptPath, "modules/bannerBackground.js"),
            //path.join(__dirname, scriptPath, "modules/scrollToTop.js")
        ]))
        .pipe(concat("main.js"))
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/scripts")));
});

// compile style sheet for development
gulp.task("productionStyles", function () {
    "use strict";

    return gulp.src(path.join(__dirname, stylePath, "main.scss"))
        .pipe(sass({style: "compressed"}))
        .pipe(autoprefixer("last 2 version"))
        .pipe(gulp.dest(path.join(__dirname, assetPath, "assets/styles")));
});
