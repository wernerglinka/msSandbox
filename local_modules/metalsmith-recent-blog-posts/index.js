module.exports = plugin;

/**
 * Metalsmith plugin to create a recent blogpost list
 */
function plugin(opts){
    return function (files, metalsmith, done){
        setImmediate(done);

        var latestBlogPosts = [];
        var featuredBlogPosts = [];
        var temp = [];

        Object.keys(files).forEach(function(file){

            if ((file.indexOf('blog/') !== -1) && (file.indexOf('.md') !== -1)) {
                // assemble latest blogposts
                temp = {
                    title: files[file].title,
                    date: files[file].date,
                    author: files[file].author,
                    path: files[file].path.replace('.md', '')
                }
                latestBlogPosts.push(temp);

                latestBlogPosts.sort(function(a,b) {
                    return a.date.getTime() - b.date.getTime();
                })
                .reverse()
                .splice(opts.latest_quantity);

                // assemble featured blog posts. Requires "featuredBlogPost = true" in front matter of the blog post
                if ( typeof files[file].featured_blog_post !== 'undefined' ) {
                    temp = {
                    title: files[file].title,
                    date: files[file].date,
                    author: files[file].author,
                    path: files[file].path.replace('.md', '')
                }
                featuredBlogPosts.push(temp);
                }
            }

            // Add to metalsmith.metadata for global access
            var metadata = metalsmith.metadata();
            metadata['latestBlogPosts'] = latestBlogPosts;
            metadata['featuredBlogPosts'] = featuredBlogPosts;

            // update metadata
            metalsmith.metadata(metadata);

            done();
        });
    };
}


