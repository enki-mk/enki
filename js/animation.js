
// TweenLite.defaultEase = Sine.easeInOut;
TweenLite.defaultEase = Linear.easeNone;
TweenLite.set("g", { y: window.innerHeight / 2 });

var svg = document.querySelector("svg");
var $wave = document.querySelector("#wave");

var contour1 = new CustomEase("contour1", "M0,0 C0.4,0 0.3,1 0.5,1 0.7,1 0.6,0 1,0");
var contour2 = new CustomEase("contour2", "M0,0,C0,0,0.5,1,0.5,1,0.5,1,1,0,1,0");
var contour3 = new CustomEase("contour3", "M0,0,C0,0.302,0,1,0.2,1,0.4,1,0.6,0,1,0");

var width = 800;
var segments = 500;
var interval = width / segments;

var wave = {
  amplitude: 0,
  frequency: 1,
  points: []
};

for (var i = 0; i <= segments; i++) {
  
  var period = i / segments;
  var point = $wave.points.appendItem(svg.createSVGPoint());
  
  point.x = i * interval;
  point.y = 0;
  
  wave.points.push({
    ratio: 0,
    period: period,
    point: point,
    update: function() {
      var cycle  = Math.sin(this.period * wave.frequency * Math.PI * 2);
      var height = this.ratio * wave.amplitude / 2;
      this.point.y = cycle * height;
    }
  }); 
}

update();

var tl1 = new TimelineMax({ repeat: -1, yoyo: true })
  .to(wave, 1, { amplitude: 200, repeat: 1, yoyo: true })
  .to(wave, 0.5, { amplitude: 150, repeat: 1, yoyo: true })
  .to(wave, 1, { amplitude: 300, repeat: 1, yoyo: true })

var tl2 = new TimelineMax({ repeat: -1, yoyo: true })
  .to(wave, 2, { frequency: 15 })
  .to(wave, 2, { frequency: 5 }, "+=1")
  .to(wave, 2, { frequency: 10 }, "+=1")

var tl3 = new TimelineMax({ repeat: -1, yoyo: true })
  .to(wave.points, 2, {
    ratio: function(i, point) {
      return contour1.getRatio(point.period)
    }
  })
  .to(wave.points, 2, {
    ratio: function(i, point) {
      return contour2.getRatio(point.period)
    }
  })
  .to(wave.points, 2, {
    ratio: function(i, point) {
      return contour3.getRatio(point.period)
    }
  })
  .to(wave.points, 2, {
    ratio: function(i, point) {
      
      var period = 1;
      
      // Constrain the contour to the first 25%
      if (point.period <= 0.25) {
        period = map(point.period, 0, 0.25, 0, 1);
      }
      
      return contour1.getRatio(period);
    }
  })
  .to(wave.points, 1, {
    ratio: function(i, point) {
      
      // No wave
      return 0;
    }
  })
  .to(wave.points, 2, {
    ratio: function(i, point) {
      
      // Reverse of contour3.getRatio(point.period);
      return contour3.getRatio(1 - point.period);
    }
  })
  .to(wave.points, 2, {
    ratio: function(i, point) {
      
      // Slope down
      return 1 - point.period;
    }
  })
  .to(wave.points, 2, {
    ratio: function(i, point) {
      
      // Slope up
      return point.period;
    }
  })

TweenLite.ticker.addEventListener("tick", update);

/**
 * @param {number} x value to map
 * @param {number} a source min value
 * @param {number} b source max value
 * @param {number} c destination min value
 * @param {number} d destination max value
 */
function map(x, a, b, c, d) {
  return c + (d - c) * ((x - a) / (b - a)) || 0;
}

function update() {
    
  var len = wave.points.length;
    
  for (var i = 0; i < len; i++) {
    wave.points[i].update();
  }
}

Resources