 var app = angular.module("graphColoring", []);
 app.controller("myCtrl", function($scope) {

     $scope.dict = [];
     $scope.dict.graphSize = 1;
     $scope.errortext = "";
     $scope.count = 0;
     $scope.response = [];
     $scope.colorsArray = [];


     $scope.setGraphSize = function() {
         $scope.dict = [];
         var isPositiveNum = $scope.isPositiveInt($scope.graphSize);
         if (isPositiveNum == true) {
             $scope.dict.graphSize = $scope.graphSize;
         } else {
             $scope.errortext = "Invalid vertex size";
             $scope.dict.graphSize = 1;
         }

     }
     $scope.addCordinate = function() {
         var key = parseInt($scope.key);
         var value = parseInt($scope.value);
         var graphSize = parseInt($scope.dict.graphSize);
         if (key < graphSize && value < graphSize && key >= 0 && value >= 0) {
             $scope.dict.push({
                 "key": $scope.key,
                 "value": $scope.value,
                 "graphSize": $scope.graphSize
             });
         } else {
             $scope.errortext = "Invalid input";
         }
     }

     $scope.sendData = function() {
         if ($scope.dict.length > 0) {
             var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
             xmlhttp.open("POST", "http://localhost:" + port + "/api/Graph");
             xmlhttp.setRequestHeader("Content-Type", "application/json");
             xmlhttp.onload = function() {
                 $scope.response = JSON.parse(xmlhttp.responseText);
                 $scope.drawGraph();
             }
             xmlhttp.send(JSON.stringify(JSON.stringify($scope.dict)));
         } else {
             $scope.errortext = "You must first create at least one edge";
         }
     }

     $scope.isPositiveInt = function(str) {
         var n = Math.floor(Number(str));
         return String(n) === str && n > 0;
     }

     $scope.removeItem = function(x) {
         $scope.dict.splice(x, 1);
     }

     $scope.getRandomColor = function() {
         var letters = '0123456789ABCDEF';
         var color = '#';
         for (var i = 0; i < 6; i++) {
             color += letters[Math.floor(Math.random() * 16)];
         }
         return color;
     }
     $scope.randomColorToArray = function() {
         for (var i = 0; i < $scope.dict.graphSize; i++) {
             var color = $scope.getRandomColor();
             $scope.colorsArray.push(color);

         }
     }
     $scope.drawNode = function(cy) {
         var vertexInfo = JSON.parse($scope.response);

         for (var i = 0; i < $scope.dict.graphSize; i++) {
             cy.add([{
                 group: "nodes",
                 data: {
                     id: i,
                     name: i,
                     weight: 65,
                     faveColor: $scope.colorsArray[vertexInfo[i].color],
                     faveShape: 'ellipse'
                 }
             }]);
         }
     }
     $scope.drawEdge = function(cy) {
         for (var i = 0; i < $scope.dict.length; i++) {
             cy.add([{
                 group: "edges",
                 data: {
                     source: $scope.dict[i].key,
                     target: $scope.dict[i].value,
                     faveColor: '#6FB1FC',
                     strength: 90
                 }
             }]);
         }
     }
     $scope.setGraphTemplate = function() {
         var cy = cytoscape({
             container: document.getElementById('cy'),

             layout: {
                 name: 'circle',
                 padding: 10
             },

             style: cytoscape.stylesheet()
                 .selector('node')
                 .css({
                     'shape': 'data(faveShape)',
                     'width': 'mapData(weight, 40, 80, 20, 60)',
                     'content': 'data(name)',
                     'text-valign': 'center',
                     'text-outline-width': 2,
                     'text-outline-color': 'data(faveColor)',
                     'background-color': 'data(faveColor)',
                     'color': '#fff'
                 })
                 .selector(':selected')
                 .css({
                     'border-width': 3,
                     'border-color': '#333'
                 })
                 .selector('edge')
                 .css({
                     'curve-style': 'bezier',
                     'opacity': 0.665,
                     'width': 'mapData(strength, 70, 100, 2, 6)',
                     'target-arrow-shape': 'triangle',
                     'source-arrow-shape': 'circle',
                     'line-color': 'data(faveColor)',
                     'source-arrow-color': 'data(faveColor)',
                     'target-arrow-color': 'data(faveColor)'
                 })
                 .selector('edge.questionable')
                 .css({
                     'line-style': 'dotted',
                     'target-arrow-shape': 'diamond'
                 })
                 .selector('.faded')
                 .css({
                     'opacity': 0.25,
                     'text-opacity': 0
                 }),

             ready: function() {
                 window.cy = this;
             }
         });

         return cy;
     }
     $scope.runLayout = function(cy) {

         var layout = cy.layout({
             name: 'circle'
         });
         layout.run();
     }

     $scope.drawGraph = function() {

         $scope.randomColorToArray();
         var cy = $scope.setGraphTemplate();
         $scope.drawNode(cy);
         $scope.drawEdge(cy);
         $scope.runLayout(cy);

     }

 });