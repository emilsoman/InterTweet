var ws = null ;

$(document).ready(function () {
  restart();
  ws = new WebSocket("ws://localhost:3000");
  ws.onmessage = function(evt) {
    var json = JSON.parse(evt.data);
    var fromUser = json.user;
    var toUserArray = json.mentions;
    console.log(json.tweet);
    addConnection(fromUser, toUserArray);
    restart();
  };
  ws.onclose = function() { console.log('Server closed connection'); };

});

function setTwitterStreamFilter(filter) {
  ws.send(filter);
}
