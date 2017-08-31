# Metalsmith Sandbox

## Installing dev site
```bash
npm install
```

## Gulp commands to build the site:
- `gulp` - __builds a site with css sourcemaps and browser_sync, and runs local webserver on port 3000__
- `gulp buildDev` - __builds a site with css sourcemaps__
- `gulp buildProd` - __builds a production site__

## URLs
The site uses pretty urls meaning that we do not show any file extensions. Rather the site structure is build such that every file is located in a directory named with the file name and the file named index.html. E.g. `inceptos-dapibus.html` becomes `/inceptos-dapibus/index.html`. This allows us to just use `inceptos-dapibus/`.

*Ergo all inks used internally must have a trailing slash!*

## About the site
The Metalsmith Sandbox is build with the Javascript-based static site generator [Metalsmith](http://www.metalsmith.io/). The build process uses *Gulp* to assemble site assets and then *Metalsmith* to build the final site structure. We are using the templating language [Nunjucks](https://mozilla.github.io/nunjucks/) and the markdown compiler [Marked](https://github.com/chjj/marked).

### Site dev structure
All content is located in `dev/content`.
Global meta data are located in `dev/content/data`:
- authors.yml *(all blog authors info)*
- navigation.yml *(main nav and footer links)*
- site-promos.yml *(defines all promos globally. Promos may be overwritten in the page fron  matter of a page)*
- site.yml *(global site meta data)*
Assets are located in `dev/sources/assets`. The favicon and redirects file are located in `dev/sources'.


### Adding a video to a page:
**We'll need:**
 - a video thumbnail in same aspect ration as the video
 - the youTube video ID

**Add to page:**
- `body_classes: hasVideo` to page front matter
- `<div class="youtube-video" data-video-tn="PATH/TO/VIDEO_TN" data-video-id="YOUTUBE_ID" data-additional-attributes="?enablejsapi=1&rel=0"></div>` in content section


 ## Adding/editing icons
 We use [icomoon](https://icomoon.io/app) do create our custom icons.

 The `selection.json` file describing the current icon set and the source icon svg files are located in the folder *(site-icons)* in the project root.

 After updating the icons change icon font path to   `$icomoon-font-path: "../fonts" !default;`   in `dev/styles/icons/variables`

### Drafts
Pages not yet ready for publishing can be ignored by the build process by adding `draft: true` to the page from matter.


### Providing a RSS feed of blogposts
Blog post feeds are available at /feeds/blog.xml
The feed is build without any plugins. We first build a page from the blog collection with an XML template "blog-feed.html". The resulting html file is then renamed with the metalsmith-renamer plugin.
This approach allows us to create as many feeds as we like.