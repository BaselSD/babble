


        window.Babble = {
            
        
            register : function(userInfor){
                this.name = userInfor.name;
                this.email = userInfor.email;
                var babble = {
                    userInfo: userInfor,
                    currentMessage: ""
                };
                
                localStorage.removeItem("randid");
                localStorage.setItem("babble",JSON.stringify(babble));
                
                var xhr  = new XMLHttpRequest();
                xhr.open('GET', 'http://localhost:9000/register',true);
                xhr.onload = function () {
                    var response = JSON.parse(xhr.responseText);
                    
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        console.log(response);
                    } else {
                        console.error(response);
                    }
                    
                };
                xhr.send();
                var modal = document.getElementById('myModal');
                modal.style.display = "none";

            },
            getMessages : function(count,callback){
                var xhr2  = new XMLHttpRequest();
                xhr2.open('GET', 'http://localhost:9000/messages?counter=' + count,true);
                xhr2.addEventListener('load', function (e) {
                    
                    
                    if (xhr2.readyState == 4 && xhr2.status == "200") {
                        console.log(e.target.responseText);
                        
                        if(callback)
                            callback(JSON.parse(e.target.responseText));
                    } else {
                        console.error(e.target.responseText);
                    }
                });
                
                xhr2.addEventListener('error', function(e){
                    console.log('ERROR getmessage');
                });
                xhr2.send();
            },
        
            postMessage : function(message,callback){
                var msg = JSON.stringify(message);
                var xhr = new XMLHttpRequest();
                xhr.open('post', 'http://localhost:9000/messages');
                xhr.setRequestHeader('Content-type','application/json');    
                
                xhr.addEventListener('load',function(e){
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        
                        
                        console.log(e.target.responseText);
                        if(callback){
                            callback(JSON.parse(e.target.responseText));
                        }
                        
                    } else {
                        console.error(res);
                    }
                });

                
                xhr.send(msg);
            },
            deleteMessage : function(id,callback){
                var xhr = new XMLHttpRequest();
                xhr.open("DELETE", "http://localhost:9000/messages/" + id, true);
                
                xhr.addEventListener('load',function(e){
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        console.log(e.target.responseText);
                        
                        if(callback){
                            callback(JSON.parse(e.target.responseText));
                        }
                    } else {
                        console.log(e.target.responseText);
                    }
                });
                xhr.send();
            },
        
            getStats : function(callback){
                var xhr  = new XMLHttpRequest()
                xhr.open('GET', 'http://localhost:9000/stats',true);

                xhr.addEventListener('load',function(e){
                    
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        callback(JSON.parse(e.target.responseText));
                    } else {
                        console.error(response);
                    }
                });
                xhr.send();
            }

            
        };
        
        
        
        Babble.messagesCount = 0;
        

        window.addEventListener('load',initilize); 
         function initilize(){
            localStorage.removeItem("randid");
            
            if(window.localStorage) {
                var userStorage = JSON.parse(localStorage.getItem('babble'));
                
                if(userStorage != null && userStorage.userInfo.name != 'Anonyamous'){
                    
                    info = userStorage.userInfo;
                    Babble.name = info.name;
                    Babble.email = info.email;
                    document.getElementById("tArea").value = userStorage.currentMessage;
                    var modal = document.getElementById('myModal');
                    modal.style.display = "none";
                    Babble.register(info);
                    Babble.messagesCount = 0;
                }else{
                    var babble = {
                        userInfo :{
                            name : '',
                            email : ''
                        },
                        currentMessage : ''
                    };
                    localStorage.setItem("babble",JSON.stringify(babble));
                    var modal = document.getElementById('myModal');
                    modal.style.display = "block";
                }
                
              } else {
                console.log("Local Storage not supported")
              }
              
              Babble.getStats(getSts);
              Babble.getMessages(Babble.messagesCount,addChatMessage);
        }


window.onbeforeunload = function(){
    var updateStorage = JSON.parse(localStorage.getItem("babble"));
    updateStorage.currentMessage=document.getElementById("tArea").value;
    localStorage.babble = JSON.stringify(updateStorage);
}

function messageSent(){
    document.getElementById("tArea").value = '';
    localStorage.babble.currentMessage = '';
}

window.onunload = function(){
    if (!navigator.sendBeacon) return;
      var URL = "http://localhost:9000/logout";
      var status;
    
      // Send the beacon
      status = navigator.sendBeacon(URL, '');
    
      // Log the data and result
      console.log ("sendBeacon: URL = " + URL + "; data = " + data + "; status = " + status);
 }







function sendMesg() {
    
    var newMessage = {};
    newMessage.name = Babble.name;
    newMessage.email = Babble.email;
    newMessage.content = document.getElementById("tArea").value;
    if(newMessage.content == ''){
        return;
    }
    newMessage.timestamp = Date.now();
    
    Babble.postMessage(newMessage);
    document.getElementById("tArea").value = '';
    localStorage.babble.currentMessage = '';

    
}


    function login(){
        var data = {};
        data.email = document.getElementById("id-email").value;
        data.name = document.getElementById("id-name").value;
        Babble.register(data);
    }

    function stayAnonyamous(){
        var data = {};
        data.name = 'Anonyamous';
        data.email = 'Anonyamous';
        Babble.register(data);
    }
    

        
        function addChatMessage(response){
            var msgs = response.messages;
            for(i = 0; i < msgs.length ; i++){
                if(msgs[i] == null)
                    continue;
                var chat = document.getElementById("chat-body");
                var message = document.createElement("div");
                message.className = "chat-message";
                //part 1 of the message
                var profilePic = document.createElement("img");
                profilePic.className = "profile-pic";
                profilePic.alt = "";
                profilePic.src = msgs[i].image + '?d=identicon';
                //part 2 of the message
                var messageContent = document.createElement("div");
                messageContent.className = "chat-bubble";
    
                if(msgs[i].name == Babble.name && Babble.name != 'Anonyamous'){
                    
                    var deleteBtn = document.createElement("button");
                    deleteBtn.className = "close-button";
                    deleteBtn.setAttribute("aria-label","Delete Message");
                    deleteBtn.innerHTML = 'x';
                    deleteBtn.id = msgs[i].id;
                    deleteBtn.addEventListener('click',function(){
                        deleteMsg(this);
                    });                    
                    messageContent.appendChild(deleteBtn);
                    //ID = null;
                    //assignID = false;
                    
                }
                
                    

                    var msgHeader = document.createElement("cite");
                    msgHeader.innerHTML = msgs[i].name;
                    msgHeader.className = 'msgName';

                    var time = document.createElement("time");
                    var t = new Date (msgs[i].timestamp);
                    var h = t.getHours();
                    var m = t.getMinutes();
                    time.innerHTML = h + ':' + m;
                    time.setAttribute("datetime",msgs[i].timestamp);
                    time.setAttribute("aria-label","time");
                    time.className = 'msgTime';

                   // msgHeader.appendChild(time);

                    var content = document.createElement("p");
                    content.innerHTML = msgs[i].content;

                messageContent.appendChild(msgHeader);
                messageContent.appendChild(time);
                messageContent.appendChild(content);

                message.appendChild(profilePic);
                message.appendChild(messageContent);

                chat.appendChild(message);

                
                


            }
            document.getElementsByTagName('ol')[0].scrollTop = document.getElementsByTagName('ol')[0].scrollHeight;            
            Babble.messagesCount = response.count;
            Babble.getMessages(Babble.messagesCount,addChatMessage);
            
            

        }

        

        function deleteMsg(obj){
            Babble.deleteMessage(obj.id);
            var message = obj.parentElement.parentElement;
            var chat = message.parentElement;
            chat.removeChild(message);
        }


            
         getSts = function(sts) {
            
            document.getElementById("msgCount").innerHTML = sts.stats.messagesCount;
            document.getElementById("onlineUsers").innerHTML = sts.stats.onlineUsers;
            Babble.getStats(getSts);    
            
        }
        


