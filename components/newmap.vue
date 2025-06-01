<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
export default {
  props: {
    sensorData: {
      type: Array,
      required: true,
    },
    colorRanges: {
      type: Array,
      required: true,
    },
    mapHeight: {
      type: String,
      default: "100%",
    },
    mapWidth: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      map: null,
      markers: [],
      mapStyle: [
        { featureType: "all", elementType: "geometry.fill", stylers: [{ weight: "2.00" }] },
        { featureType: "all", elementType: "geometry.stroke", stylers: [{ color: "#9c9c9c" }] },
        { featureType: "all", elementType: "labels.text", stylers: [{ visibility: "on" }] },
        { featureType: "landscape", elementType: "all", stylers: [{ color: "#f2f2f2" }] },
        { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#eeeeee" }] },
        { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#c8d7d4" }] },
      ],
    };
  },
  watch: {
    sensorData: {
      handler() {
        if (this.map) {
          this.clearMarkers();
          this.addSensorMarkers();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.loadGoogleMaps();
  },
  methods: {
    loadGoogleMaps() {
      if (typeof google === "undefined") {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD9TDjlJEO60ksYuV2mCk-j6R2lHjrjx6k&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = this.initMap.bind(this);
        document.head.appendChild(script);
      } else {
        this.initMap();
      }
    },
    initMap() {
      if (!this.$refs.mapContainer) return;

      this.map = new google.maps.Map(this.$refs.mapContainer, {
        center: { lat: 13.7563, lng: 100.5018 },
        zoom: 6,
        styles: this.mapStyle,
      });

      this.addSensorMarkers();
    },
    addSensorMarkers() {
      if (!this.sensorData || !this.colorRanges) return;

      this.sensorData.forEach((sensor) => {
        if (!sensor.latitude || !sensor.longitude) return;

        const color = this.getColorByPm25(sensor.pm25);

        const marker = new google.maps.Marker({
          position: { lat: sensor.latitude, lng: sensor.longitude },
          map: this.map,
          title: `${sensor.place} - PM2.5: ${sensor.pm25}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#333',
          },
        });

        this.markers.push(marker);
      });
    },
      getColorByPm25(value) {
      if (typeof value !== 'number' || isNaN(value)) return '#000000';
      const matched = this.colorRanges.find(range => value >= range.min && value <= range.max);
      return matched ? matched.color : '#000000';
    },

    clearMarkers() {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
