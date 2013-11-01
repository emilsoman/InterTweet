$(document).ready(function () {


  var width = 960,height = 500;

  var color = d3.scale.category20();

  var force = d3.layout.force()
  .charge(-120)
  .nodes({})
  .linkDistance(30)
  .size([width, height]);


var svg = d3.select("body")
  .append("svg")
  .attr({
    "width": "100%",
    "height": "100%"
  })
.attr("viewBox", "0 0 " + width + " " + height )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("pointer-events", "all")
    .call(d3.behavior.zoom().on("zoom", redraw));

var vis = svg
  .append('svg:g');

function redraw() {
  vis.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}

//$.get('/api/json', function(json){
  //drawGraph(JSON.parse(json));
//})
  //.fail(function(){
    //alert("Error getting data");
  //});

var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

function restart() {
  link = link.data(links);

  link.enter().insert("line", ".node")
    .attr("class", "link");

  node = node.data(nodes);

  node.enter().insert("circle")
    .attr("class", "node")
    .attr("r", 5)
    .call(force.drag);

  force.start();
};

function drawGraph(graph) {
  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .style("fill", function(d) { return color(1); })
    .call(force.drag);

  node.append("title")
    .text(function(d) { return d.handle; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  });
}
//});
//

function userExists(userHandle) {
  $.grep(nodes, function(e){ return e.handle == userHandle; }).length != 0 ;
}

function addUser(userHandle) {

}

function addUserIfNotPresent(userHandle){
  if(!userExists(userHandle)){
    var node = {handle: userHandle}
    var n = nodes.push(node);
    return node;
  }
}

function addConnection(fromUser, toUserArray){
  console.log(arguments);
  var source = addUserIfNotPresent(fromUser);
  toUserArray.forEach(function(toUser){
    var target = addUserIfNotPresent(toUser);
    links.push({source: source, target: target});
  });
  restart();
}

//drawGraph({nodes: [], links: []});
restart();
ws = new WebSocket("ws://localhost:3000");
ws.onmessage = function(evt) {
  var json = JSON.parse(evt.data);
  var fromUser = json.user;
  var toUserArray = json.mentions;
  addConnection(fromUser, toUserArray);
};


ws.onclose = function() { console.log('Server closed connection'); };

ws.onopen = function() {
  ws.send("hello server");
};


});
