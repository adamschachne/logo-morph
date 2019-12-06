var svg = d3.select("svg");

var microsoft = [
  "M-2-2h245v245h-245z",
  "M269-2h245v245h-245z",
  "M-2 269h245v245h-245z",
  "M269 269h245v245h-245z"
]

var microsoftColors = [
  ["#F25022"],
  ["#7FBA00"],
  ["#00A4EF"],
  ["#FFB900"]
]

var tesla = [
  // "m256.028 508.502 70.952-399.038c67.63 0 88.962 7.416 92.042 37.686 0 0 45.368-16.916 68.25-51.272-89.292-41.376-179.01-43.242-179.01-43.242l-52.352 63.764.118-.008-52.352-63.766c0 0-89.72 1.868-179 43.244 22.862 34.356 68.248 51.272 68.248 51.272 3.098-30.272 24.404-37.688 91.58-37.736l71.524 399.096 m-.028-474.284c72.18-.552 154.798 11.166 239.374 48.028 11.304-20.346 14.21-29.338 14.21-29.338-92.454-36.578-179.036-49.096-253.594-49.41-74.554.314-161.132 12.834-253.574 49.41 0 0 4.124 11.076 14.2 29.338 84.56-36.862 167.192-48.58 239.374-48.028h.01"
  "M256 34.218C328.18 33.666 410.798 45.384 495.374 82.246 506.678 61.9 509.584 52.908 509.584 52.908 417.13 16.33 330.548 3.812 255.99 3.498 181.436 3.812 94.858 16.332 2.416 52.908 2.416 52.908 6.54 63.984 16.616 82.246 101.176 45.384 183.808 33.666 255.99 34.218H256",
  "M256.028 508.502 326.98 109.464C394.61 109.464 415.942 116.88 419.022 147.15 419.022 147.15 464.39 130.234 487.272 95.878 397.98 54.502 308.262 52.636 308.262 52.636L255.91 116.4 256.028 116.392 203.676 52.626C203.676 52.626 113.956 54.494 24.676 95.87 47.538 130.226 92.924 147.142 92.924 147.142 96.022 116.87 117.328 109.454 184.504 109.406L256.028 508.502"
]

var paths = svg.selectAll("path")

var interpolators1 = flubber.separate(tesla[0], microsoft.slice(0, 2), { single: true });
var interpolators2 = flubber.separate(tesla[1], microsoft.slice(2), { single: true });

var interpolators3 = flubber.combine(microsoft.slice(0, 2), tesla[0], { single: true });
var interpolators4 = flubber.combine(microsoft.slice(2), tesla[1], { single: true });

var paths = paths.data(tesla)
  .enter()
  .append("path")
  .attr('d', function (data) { return data; })

function morph() {
  paths
    .transition()
    .duration(500)
    .attrTween("d", function (d, i) {
      if (i == 0) {
        return interpolators2;
      }
      return interpolators1;
    })
    .delay(600)
    // .transition()
    // .duration(500)
    // .attrTween("d", function (d, i) {
    //   if (i == 0) {
    //     return interpolators4;
    //   }
    //   return interpolators3;
    // })
    // .delay(600)
    // .on('end', morph);
}

morph();

// .data(microsoftColors)
// .attr('fill', function (data) { return data })

// console.log(microsoft)

// console.log(interpolators)
// paths
//   .transition()
//   .attrTween("d", function (i) { console.log(i); return interpolators[i]; })
//   .delay(600)
// console.log(paths);