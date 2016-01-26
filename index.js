var http = require('http');
var dispatcher = require('httpdispatcher');

const PORT=3000; 

// We need a function which handles requests and send response
function handleRequest(request, response){
    try {
        // log the request on console
        console.log(request.url);
        // Dispatch
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}


// create and start the server
var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on port %s", PORT);
});





// A sample GET request    
dispatcher.onGet("/page1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page One');
});    

// A sample POST request
dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});
