angular.module('buffons-needle', [])
  .controller('BuffonsNeedlesim', ['$window', '$timeout', function($window, $timeout) {
    var sim = this;

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    sim.running = false;
    sim.lines = [];
    sim.gap = 0;
    sim.needles = [];
    sim.intersections = 0;

    sim.setLines = function() {
      clearCanvas();
      
      sim.lines.length = 0;
      sim.gap = Math.round(canvas.width / (sim.numLines + 1));
      
      //sim.lines.push(0);
      for (i = 1; i <= sim.numLines; i++) {
        xPos = Math.round(sim.gap * i);
        sim.lines.push(xPos)
        drawLine(newPoint(xPos, 0), newPoint(xPos, canvas.height));
      }
      //sim.lines.push(canvas.width);
      
      console.log(sim.lines);
    };

    function clearCanvas() {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    sim.cancelSim = function() {
      sim.running = false;
      // update view??
    }

    sim.runSim = function() {
      doSim();
    };


    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function doSim() {
      console.log("starting doSim...");
      sim.running = true;
      for (var i = 0; i < sim.iterations; i++) {
        if (!sim.running) {
          break;
        }

        await sleep(sim.delay);

        $timeout(dropNeedle, 0);
        //dropNeedle();
      }
      sim.running = false;
      console.log("doSim ended.");
    }

    function dropNeedle() {
      var needle = drawNeedle(
        rand(canvas.width),
        rand(canvas.height),
        sim.gap * sim.needleLengthRatio,
        rand(360)
      );
      
      sim.needles.push(needle);

			// draw collisions
      for (var i = 0; i < sim.lines.length; i++) {
        var lineX = sim.lines[i];
        
        var collision = detectCollision(
      needle.x1, needle.y1, needle.x2, needle.y2, lineX, 0, lineX, canvas.height);
      
        if (collision) {
          sim.intersections++;
          drawIntersection(collision);
        }
      }
    };

    function drawIntersection(intersection) {
			console.log();
      drawDot(intersection);
    }


    function detectCollision(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
      var s1_x = p1_x - p0_x;
      var s1_y = p1_y - p0_y;
      var s2_x = p3_x - p2_x;
      var s2_y = p3_y - p2_y;

      var s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
      var t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

      if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        // Collision detected
        return newPoint(p0_x + (t * s1_x), p0_y + (t * s1_y));
      }

      return; // No collision
    }

    function rand(max) {
      return Math.floor(Math.random() * max);
    }

    function drawNeedle(x, y, len, deg) {
      rads = Math.PI * deg / 180.0

      x2 = x + len * Math.cos(rads);
      y2 = y + len * Math.sin(rads);

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x2, y2);
      context.stroke();

      return newPath(x, y, x2, y2);
    }

    function drawDot(point) {
    	var radius = 5;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = "#ccddff";
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = "#666666";
      context.stroke();
    }

    function drawLine(point1, point2) {
      context.beginPath();
      context.moveTo(point1.x, point1.y);
      context.lineTo(point2.x, point2.y);
      context.strokeStyle = "black";
      context.stroke();
    }

    function newPoint(x, y) {
      return {
        x: x,
        y: y
      }
    }

    function newPath(x1, y1, x2, y2) {
      return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      }
    }

    angular.element($window).bind('resize', function() {
      setCanvasSize();
    });

    function setCanvasSize() {
      canvas.width = $window.innerWidth - 198;
      canvas.height = $window.innerHeight - 240;
    }

    // setup
    setCanvasSize();
    context.globalAlpha = 1.0;
    context.beginPath();
  }]);
