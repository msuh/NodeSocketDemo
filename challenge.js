ObjectFileServer();


function ObjectFileServer() {
var httpServer = function(dir)
        {
            var http = require('http');
            var fs = require('fs');
            var path = require("path");
            var url = require('url');

            var mimeTypes = {
                "html": "text/html",
                "jpeg": "image/jpeg",
                "jpg": "image/jpeg",
                "png": "image/png",
                "js": "text/javascript",
                "css": "text/css",
                "xml": "application/xml",
                "dat": "application/octet-stream"
                
            };

            var server = http.createServer(function(req, res){
                var uri = url.parse(req.url)
                    .pathname;
                var filename = path.join(dir, unescape(uri));
                var indexFilename = path.join(dir, unescape('index.html'));
                var stats;
                try
                {
                    stats = fs.lstatSync(filename); // throws if path doesn't exist


                }
                catch (e)
                {
                    console.log("catching error. Filename path does not exist //////////////////////////////");
                    res.writeHead(404,
                    {
                        'Content-Type': 'text/plain'
                    });
                    res.write('404 Not Found\n');
                    res.end();
                    return;
                }


                if (stats.isFile())
                {
                    console.log("stats.isFile/////////////////////////////////////");
                    // path exists, is a file
                    var mimeType = mimeTypes[path.extname(filename)
                        .split(".")[1]];

                    console.log("mimeType:",mimeType);
                    res.writeHead(200,
                    {
                        'Content-Type': mimeType
                    });

                    var fileStream =
                        fs.createReadStream(filename)
                        .pipe(res);
                }
                else if (stats.isDirectory())
                {
                    console.log("stats.isDirectory/////////////////////////////////");
                    // path exists, is a directory
                    res.writeHead(200,
                    {
                        'Content-Type': "text/html"
                    });
                     var fileStream =
                            fs.createReadStream(indexFilename)
                            .pipe(res);
                
                var io = require("socket.io").listen(server);
                    sendRandom(io);          
                }
                else
                {
                    // Symbolic link, other?
                    // TODO: follow symlinks?  security?
                    res.writeHead(500,
                    {
                        'Content-Type': 'text/plain'
                    });
                    res.write('500 Internal server error\n');
                    res.end();
                }

            });
            return server;
        };
 
       
var HTTPserver =
            httpServer('www')
            .listen(8080, function()
            {
                console.log('HTTP listening 8080');
            });
}

function randomNum(){
    var rand = Math.random();
    return Math.floor(rand * 100 +1);
}

function sendRandom(io){
    // console.log("io:",io);
    io.on('connection', function (socket) {
        var interval = setInterval(function(){
            var rand = randomNum();
            io.emit('val', { msg: ''+rand});
            // console.log("random number:",rand);
        }, 3000);

      socket.on('disconnect', function () {
        console.log("user disconnected");
        clearInterval(interval);
      });

    });
}
