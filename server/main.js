 var http = require('http'),
         url = require('url'),
         fs = require('fs');
         messagesUtils = require('./messages-util');
         
        
        http.createServer(function (req, res) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    console.log("hello there " + req.method + url.parse(req.url).pathname);
                    if(req.method == 'OPTIONS'){
                        res.setHeader('Access-Control-Allow-Headers','Content-type');
                        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
                        res.statusCode = 204;
                        res.end();
                    }
                    
                var url_parts = url.parse(req.url);
                if (req.method === 'POST') {
                    var demand = url_parts.pathname.substr(0);
                    if(url_parts.pathname.substr(0,7) == '/logout'){
                        console.log("loggedout");       
                        messagesUtils.logout();
                        res.end();
                    }else if(url_parts.pathname.substr(0, 9) == '/messages'){
                        if(demand.length > 9){
                            sendNotFound(res);
                        }
                        else{
                            var requestBody = '';
                            
                            req.on('data', function(chunk) {
                                requestBody += chunk.toString();
                            });
                            req.on('end', function() {
                                var data = JSON.parse(requestBody);
                                var msgs = [];
                                msgs.push(data);
                                var id = messagesUtils.addMessage(data);
                                while(messagesUtils.clients.length > 0) {
                                    var client = messagesUtils.clients.pop();
                                    client.end(JSON.stringify( {
                                    count: messagesUtils.messages.length,
                                    messages: msgs
                                    }));
                                }
                                res.end(JSON.stringify({
                                result: 'true',
                                messsgeID: id 
                                }));
                                sendUpdates(null);
                            });
                            req.on('error',function(err){
                                console.log(err);
                            });
                        }
                        
                    }else if(url_parts.pathname.substr(0, 9) != '/messages'){
                        
                        if(demand == '/stats'){
                            sendNotAllowed(res);
                        }
                        sendNotFound(res);
                    }
                    
                }else if (req.method == 'GET') {
                    if(url_parts.path.substr(0, 18) == '/messages?counter='){
                        var count = JSON.parse(url_parts.path.replace(/[^0-9]*/, ''));
                        
                        if(typeof count != "number"){
                            sendBadRequest(res);
                        }
                        else{
                            var msgs = [];
                            msgs = messagesUtils.getMessages(count);
                            
                            if(msgs == null){
                                messagesUtils.clients.push(res);
                                sendUpdates(null);
    
                            }
                            else if(msgs.length){
                                res.end(JSON.stringify( {
                                    messages: msgs,
                                    count : messagesUtils.messages.length
                                }));
                            }
                        }
                        
                    }else if(url_parts.pathname.substr(0, 6) == '/stats'){
                        sendUpdates(res);
                    }else if(url_parts.pathname.substr(0, 9) == '/register'){
                        messagesUtils.login();
                        sendUpdates(null);
                        res.end(JSON.stringify({
                            result : 'true'
                        }));
                    }
                }else if(req.method == 'DELETE'){
                    if(url_parts.path.substr(0, 10) == '/messages/'){
                        var count = JSON.parse(url_parts.path.replace(/[^0-9]*/, ''));
                        if(typeof count != "number"){
                            sendBadRequest(res);
                        }else{
                            var idToDelete = url_parts.pathname.replace(/[^0-9]*/, '');
                            
                            var deleteResult = messagesUtils.deleteMessage(idToDelete);
                            res.end(JSON.stringify({
                                result: deleteResult
                            }));
                            sendUpdates(null);
                        }
                    }
                    
                }
            
  
}).listen(9000, 'localhost');
console.log('Server running.');


function sendUpdates(res){
    if(res != null){
        messagesUtils.addClientToUpdate(res);
    }else{
        var stats = messagesUtils.getStats();
        
        var clientsArray = messagesUtils.getUpdateClients();
        while(clientsArray.length > 0){
            clientsArray.pop().end(JSON.stringify({stats}));
        }
        messagesUtils.reset('updateClients');
    
    }
}


function sendNotFound(res){
    res.statusCode = 404;
    res.statusMessage = "Not Found";
    res.end();
}

function sendBadRequest(res){
    res.statusCode = 400;
    res.statusMessage = "Bad Request";
    res.end();
}

function sendNotAllowed(res){
    res.statusCode = 405;
    res.statusMessage = "Method Not Allowed";
    res.end();
}





