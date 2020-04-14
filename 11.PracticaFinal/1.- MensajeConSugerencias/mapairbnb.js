//Fija el centro en la Puerta del Sol.
const map = L.map('map').setView([40.416992, -3.703526], 13);

//Usamos openstreetmap, mapa libre de derechos
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Extraemos los datos sobre los lugares de interés de Madrid 
d3.json('airbnbMadridLugaresInteres.txt')
  .then((lugares) => {
    console.log('lugares', lugares);
    printMap(lugares)
  });


function printMap(lugares) {  //Dibuja el mapa
  const svg = d3.select(map.getPanes().overlayPane)
    .append('svg')
    .attr('width', 800)
    .attr('height', 400);

  const group = svg
    .selectAll('.lugar')
    .data(lugares)
    .enter()
    .append('g');

  group
    .attr('transform', (d) => {
      const latLong = L.latLng(d.Latit, d.Longit);
      const point = map.latLngToLayerPoint(latLong);
      return `translate(${point.x}, ${point.y})`;
    })

  const point = group
    .append('circle');   // Marca los lugares de interés con un punto circular
    point.attr('r', 3);  // Tamaño del punto

  group.append('text')
     .text(d => d.Nombre);

  map.on('zoomend', () => {  // Zoom del mapa
    refresh(group)
  });

  function refresh(group) {  // Controla el zoom
    group
      .transition()
      .duration(100)
      .attr('transform', (d) => {
        const latLong = L.latLng(d.Latit, d.Longit);
        const point = map.latLngToLayerPoint(latLong);
        return `translate(${point.x}, ${point.y})`;
      })
  }
}

