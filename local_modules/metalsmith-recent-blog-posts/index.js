/*eslint no-unused-vars: 0*/

module.exports = plugin;

/**
 * Metalsmith plugin to create a recent blogpost list
 */
function plugin(opts){
    return function (files, metalsmith, done){
        setImmediate(done);

        var latestBlogPosts = [];
        var featuredBlogPosts = [];
        var allSortedBlogPosts = [];
        var temp = [];

        Object.keys(files).forEach(function(file){

            if ((file.indexOf('blog/') !== -1) && (file.indexOf('.md') !== -1)) {

                // assemble all blogs list
                temp = {
                    title: files[file].title,
                    date: files[file].date,
                    author: files[file].author,
                    path: files[file].path.replace('.md', '')
                }
                allSortedBlogPosts.push(temp);
                allSortedBlogPosts.sort(function(a,b) {
                    return a.date.getTime() - b.date.getTime();
                })
                .reverse();

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
                if ( files[file].featured_blog_post) {
                    temp = {
                        title: files[file].title,
                        date: files[file].date,
                        author: files[file].author,
                        path: files[file].path.replace('.md', ''),
                        order: files[file].featured_blog_post_order
                    }
                    featuredBlogPosts.push(temp);
                    featuredBlogPosts.sort(function(a,b) {
                        return a.order - b.order;
                    })
                }
            }

            // Add to metalsmith.metadata for global access
            var metadata = metalsmith.metadata();
            metadata['latestBlogPosts'] = latestBlogPosts;
            metadata['featuredBlogPosts'] = featuredBlogPosts;
            metadata['allSortedBlogPosts'] = allSortedBlogPosts;

            // update metadata
            metalsmith.metadata(metadata);

            done();
        });
    };
}


