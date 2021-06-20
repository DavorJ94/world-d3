function setWindowSize() {
  var width = window.innerWidth - 25;
  var height = window.innerHeight;
  // ! World Map
  const worldMap = d3
    .select("#worldMap")
    .attr("width", width)
    .attr("height", height);

  var g = worldMap.append("g");
  var projection = d3
    .geoNaturalEarth1()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

  var path = d3.geoPath().projection(projection);

  g.append("path")
    .attr("d", path({ type: "Sphere" }))
    .attr("class", "sphere");
  const zoomG = g.call(
    d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([1, 15])
      .on("zoom", zoomed)
  );
  function zoomed({ transform }) {
    zoomG.attr("transform", transform);
  }
  d3.json(
    "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json"
  ).then((data) => {
    g.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "countries")
      .append("title")
      .text(
        (k) =>
          "Country: " +
          k.properties.name +
          "\n" +
          "Estimated population: " +
          (k.properties.pop_est / 1000000).toFixed(2) +
          " mil."
      );
  });
  // ! For removing elements when resizing window
  var numberOfGElements = document.getElementsByTagName("g").length;
  if (numberOfGElements > 1) {
    d3.select("#worldMap > g:first-child").remove();
  }
  window.removeEventListener("resize", setWindowSize, true);
}
setWindowSize();
window.addEventListener("resize", setWindowSize);
