var svg = d3.select("svg");
var current = 0;
var paths = svg.selectAll("path")
var animating = false;

var microsoft = [
  "M-2-2h245v245h-245z", // "#F25022"
  "M269-2h245v245h-245z", // "#7FBA00"
  "M-2 269h245v245h-245z", // "#00A4EF"
  "M269 269h245v245h-245z" // "#FFB900"
];

var tesla = [
  "M256 34.218C328.18 33.666 410.798 45.384 495.374 82.246 506.678 61.9 509.584 52.908 509.584 52.908 417.13 16.33 330.548 3.812 255.99 3.498 181.436 3.812 94.858 16.332 2.416 52.908 2.416 52.908 6.54 63.984 16.616 82.246 101.176 45.384 183.808 33.666 255.99 34.218H256", // "#E82127"
  "M256.028 508.502 326.98 109.464C394.61 109.464 415.942 116.88 419.022 147.15 419.022 147.15 464.39 130.234 487.272 95.878 397.98 54.502 308.262 52.636 308.262 52.636L255.91 116.4 256.028 116.392 203.676 52.626C203.676 52.626 113.956 54.494 24.676 95.87 47.538 130.226 92.924 147.142 92.924 147.142 96.022 116.87 117.328 109.454 184.504 109.406L256.028 508.502" // "#e82127"
];

var apple = [
  "m459.759 395.941c-7.637 17.642-16.676 33.882-27.149 48.812-14.276 20.354-25.965 34.443-34.973 42.267-13.964 12.842-28.926 19.419-44.947 19.793-11.502 0-25.372-3.273-41.519-9.912-16.199-6.608-31.086-9.881-44.698-9.881-14.276 0-29.587 3.273-45.963 9.881-16.402 6.639-29.615 10.099-39.717 10.442-15.364.655-30.678-6.109-45.963-20.323-9.756-8.509-21.959-23.097-36.578-43.763C82.566 421.188 69.671 395.598 59.569 366.422 48.75 334.909 43.326 304.394 43.326 274.851 43.326 241.009 50.639 211.822 65.286 187.363 76.797 167.716 92.111 152.218 111.277 140.841c19.167-11.377 39.876-17.175 62.178-17.546 12.203 0 28.206 3.775 48.092 11.193 19.83 7.443 32.563 11.218 38.146 11.218 4.174 0 18.319-4.414 42.298-13.213 22.676-8.16 41.815-11.539 57.493-10.208 42.485 3.429 74.403 20.176 95.63 50.349-37.996 23.022-56.792 55.268-56.418 96.634.343 32.221 12.032 59.033 35.004 80.322 10.411 9.881 22.037 17.518 34.973 22.941-2.805 8.135-5.766 15.928-8.915 23.409z",
  "M362.321 12.517c0 25.254-9.226 48.834-27.617 70.66-22.193 25.946-49.037 40.939-78.147 38.573-.371-3.03-.586-6.218-.586-9.569 0-24.244 10.554-50.19 29.297-71.405 9.357-10.741 21.258-19.672 35.69-26.797C335.359 6.961 348.98 3.079 361.791 4.657Z"
];

var companies = [microsoft, tesla, apple]
var interpolators = [
  function microsoftToTesla(d, i) {
    if (i < 2) {
      return flubber.combine(microsoft.slice(2), tesla[1], { single: true })
    }
    return flubber.combine(microsoft.slice(0, 2), tesla[0], { single: true })
  },
  function teslaToApple(d, i) {
    if (i < 2) {
      return flubber.interpolate(tesla[0], apple[1], { single: true });
    }
    return flubber.interpolate(tesla[1], apple[0], { single: true })
  }
]

var interpolatorsReverse = [
  function teslaToMicrosoft(d, i) {
    if (i < 2) {
      return flubber.separate(tesla[0], microsoft.slice(0, 2), { single: true })
    }
    return flubber.separate(tesla[1], microsoft.slice(2), { single: true })
  },
  function appleToTesla(d, i) {
    if (i < 2) {
      return flubber.interpolate(apple[1], tesla[0], { single: true });
    }
    return flubber.interpolate(apple[0], tesla[1], { single: true });
  }
]

var paths = paths.data(microsoft)
  .enter()
  .append("path")
  .attr('d', function (data) { return data })
  .attr('fill', "white")

function morph(direction) {
  if (animating) {
    return;
  }
  var tweenFunction;
  var curr = current; // save current
  if (direction == "right") {
    if (curr == companies.length - 1) {
      return;
    }
    tweenFunction = interpolators[curr];
    current++;
  } else if (direction == "left") {
    if (curr == 0) {
      return;
    }
    tweenFunction = interpolatorsReverse[curr - 1];
    current--;
  }
  animating = true;
  paths
    .transition()
    .duration(500)
    .attrTween("d", tweenFunction)
    .on('end', function () {
      animating = false;
    });
}

d3.select("body")
  .on("keyup", function () {
    var code = d3.event.keyCode;
    if (code == 39) { // right arrow
      morph("right");
    } else if (code == 37) { // left arrow
      morph("left");
    }
  })