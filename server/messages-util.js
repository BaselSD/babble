
var crypto = require("crypto");

var messages = [];
var clients = [];
var ID = 0;
var messagesCount = 0;
var onlineUsers = 0;
var thereAreUpdates = false;
var updateClients = [];


exports.messagesCount = messagesCount;
exports.onlineUsers = onlineUsers;

function addMessage(msg){
    //msg.status = 'active';
    msg.image = getGravatarImage(msg.email,'');
    msg.id = ID;
    console.log(msg.image);
    messages.push(msg);
    messagesCount++;
    thereAreUpdates = true;
    return ID++;
}

function getMessages(count){
    if(count == 0){
        thereAreUpdates = true;
    }
    if(messages.length > count){ 
        var tmpMessages =  messages.slice(count);
        var wantedMessages = [];
        console.log("starts here: ");
        for(i = 0; i < tmpMessages.length; i++){
            if(tmpMessages[i] != null){
                wantedMessages.push(tmpMessages[i]);
                console.log(wantedMessages[i]);
            }
        }
        console.log("endss here: ");
        return wantedMessages.length == 0 ? null : wantedMessages;
    }
    return null;
}
function deleteMessage(id){
    console.log("Before: id to be deleted: " + id + " messages count is: " + messages.length);
    if(id < messages.length){
        delete messages[id];   
        messagesCount--;
        messagesCount =  (messagesCount < 0 ? 0 : messagesCount);
        thereAreUpdates = true;  
        for(i = 0; i < messages.length; i++){
            console.log(messages[i]);
            
        } 
        return true;  
    }
    
    return "id does not exist";
}

function login(){
    onlineUsers++;
    thereAreUpdates = true;
            
}

function logout(){
    onlineUsers--;
    onlineUsers =  (onlineUsers < 0 ? 0 : onlineUsers);
    thereAreUpdates = true;
}

function getStats(){
    var stats = {};
    stats.onlineUsers = onlineUsers;
    stats.messagesCount = messagesCount;
    thereAreUpdates = false;
    return stats;
}

function getUpdateClients(){
    return updateClients;
}

function addClientToUpdate(client){
    updateClients.push(client);
}

function reset(cmd){
    if(cmd == 'updateClients'){
        updateClients = [];
    }
}

function getThereAreUpdates(){
    return thereAreUpdates;
}

function getGravatarImage(email, args) {
    args = args || "";
    var BASE_URL = "//www.gravatar.com/avatar/";
    // IE: //www.gravatar.com/avatar/e04f525530dafcf4f5bda069d6d59790.jpg?s=200
    return (BASE_URL + md5(email) + args).trim();
}
var random = 1;
function md5(str) {
    if(!str){
        return random++;
    }
    str = str.toLowerCase().trim();
    var hash = crypto.createHash("md5");
    hash.update(str);
    return hash.digest("hex");
}


module.exports = {
    addMessage  : addMessage,
    getMessages : getMessages,
    deleteMessage : deleteMessage,
    clients : clients,
    messages : messages,
    getUpdateClients : getUpdateClients,
    addClientToUpdate : addClientToUpdate,
    getStats : getStats,  
    reset : reset,
    getThereAreUpdates : getThereAreUpdates,
    login : login,
    logout : logout
}
