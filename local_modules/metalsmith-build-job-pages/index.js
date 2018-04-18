/*global __dirname, require, console, module, plugin, metalsmith, setImmediate, error, response, data*/
/*jslint vars:true*/
module.exports = plugin;

var request = require('request');
var fs = require('fs');
var findFolder = require('node-find-folder');
var path = require('path');
var commonTags = require('common-tags');

/**
 * Metalsmith plugin to create static pages from comeet api
 */
function plugin() {
    'use strict';

    return function (files, metalsmith, done) {
        setImmediate(done);

        var token = "1D6758CDA582CDACDAB0492E1D6EB0";
        var companyUID = "D1.006";
        var url = "https://www.comeet.co/careers-api/1.0/company/";

        // get a complete job listing object by setting complete=true
        var comeetAPI = url + companyUID + "/positions?token=" + token + "&amp;complete=true";
        var jobObj = {};
        var i;
        var jobsDirectory = process.cwd() + "/dev/content/jobs/";
        var filePath;
        var fileContent;

        console.log(jobsDirectory);

        // get data from the Comeet API
        request.get(comeetAPI, function (error, response, data) {
            if (error) {
                return console.dir(error);
            }
            // parse json into js object
            jobObj = JSON.parse(data);

            // build the job pages
            for (i = 0; jobObj.length > i; i++) {
                filePath = jobsDirectory + jobObj[i].position_uid + ".md";
                fileContent = commonTags.html`
                    ---
                    layout: test-job.html
                    title: ${jobObj[i].name}
                    description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor..
                    page_class: home
                    ---
                    
                    <h1>${jobObj[i].name}<span>${jobObj[i].location}</span></h1>
                    <div class='job-verbiage'>
                        <div class='job-description'>
                            ${jobObj[i].description}
                        </div>
                        <div class='job-requirements'>
                            <h2>Job Requirements</h2>
                            ${jobObj[i].requirements}
                        </div>
                    </div>
                    <div class='job-application'>
                        <h2>Apply for this Job</h2>
                        <script type='comeet-applyform' data-position-uid='${jobObj[i].position_uid}'></script>
                    </div>
                    `;

                try{
                    fs.writeFileSync(filePath, fileContent);
                }catch (e){
                    console.log("Cannot write file ", e);
                }

                
                console.log(jobObj[i]);




            }

            done();
        });
    };
}
