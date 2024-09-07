<template>
  <div class="container">
    <div class="map-container">
      <div id="map" style="height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import maplibregl from 'maplibre-gl';

export default {
  props: ['coordinates'], // Recebe as coordenadas como prop
  data() {
    return {
      map: null,
      marker: null,
    };
  },
  mounted() {

    const token = '7cQJrCdDD1u22ZekNOFw';

    // Inicializa o mapa usando MapLibre com estilo do MapTiler e o token
    this.map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/8fde2eea-8799-479e-8a8d-0989e2c7eb2d/style.json?key=7cQJrCdDD1u22ZekNOFw`, // URL com o token
      center: [this.coordinates.lng, this.coordinates.lat], // Usa as coordenadas passadas como prop
      zoom: 14,
      pitch: 60,
      bearing: 45,
      attributionControl: false
    });

    // Adiciona um marcador inicial nas coordenadas fornecidas
    this.marker = new maplibregl.Marker()
      .setLngLat([this.coordinates.lng, this.coordinates.lat])
      .addTo(this.map);
  },
  watch: {
    // Atualiza o marcador e recentra o mapa quando as coordenadas mudam
    coordinates(newCoords) {
      if (this.map && this.marker) {
        this.marker.setLngLat([newCoords.lng, newCoords.lat]); // Atualiza o marcador
        this.map.setCenter([newCoords.lng, newCoords.lat]);    // Recentra o mapa
      }
    }
  }
};
</script>

<style scoped>
#map {
  height: 400px;
  width: 100%;
}
</style>
