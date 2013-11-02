var width = 960, height = 500;
var fill = d3.scale.category20();
var force = d3.layout.force()
    .size([width, height])
    .linkDistance(50)
    .charge(-120)
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

var nodes = force.nodes(),
    links = force.links(),
    link = svg.selectAll('.link'),
    node = svg.selectAll('.node');

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  //node.attr("cx", function(d) { return d.x; })
      //.attr("cy", function(d) { return d.y; });
  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function restart() {
  link = link.data(links);
  link.enter().append("line")
      .attr("stroke-width", 1)
      .attr("stroke", "black");

  node = node.data(nodes);

  var gnode = node.enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  gnode.append("text")
    .text(function(d) { return d.handle; });

  gnode.append("image")
    .attr("xlink:href", function(d){ return d.profile_image_url; })
    .attr("x", -8)
    .attr("y", -8)
    .attr("width", 18)
    .attr("height", 18);
  force.start();
}


function userExists(userHandle) {
  var result = $.grep(nodes, function(e){ return e.handle == userHandle; })
  return result;
}

function addUserIfNotPresent(user){
  var existingUsers = userExists(user.handle);
  if (existingUsers.length == 0){
    var n = nodes.push(user);
    return user;
  }else{
    return existingUsers[0];
  }
}

function addConnection(fromUser, toUserArray){
  var source = addUserIfNotPresent(fromUser);
  toUserArray.forEach(function(toUser){
    var target = addUserIfNotPresent(toUser);
    links.push({source: source, target: target});
  });
}
