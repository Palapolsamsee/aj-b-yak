<template>
  <section id="map">
    <div class="bg-gray-50 to">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            สำรวจคุณภาพอากาศและภัยพิบัติ
          </h2>
        </div>

        <!-- Filter Bar: Search + Dropdown -->
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0"
        >
          <div class="flex items-center w-full md:w-1/2 relative">
            <!-- Input -->
            <input
              v-model="searchTerm"
              type="text"
              placeholder="ค้นหาสถานที่หรือที่อยู่..."
              class="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              @keyup.enter="searchLocation"
            />

            <!-- Search Button -->
            <button
              @click="searchLocation"
              class="ml-2 bg-[#172554] hover:bg-[#0f1f3c] text-white rounded-lg px-4 py-2 transition duration-200 absolute right-0 top-0 h-full"
            >
              ค้นหา
            </button>
          </div>
        </div>

        <!-- Map Container -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden relative">
          <div
            ref="mapContainer"
            id="map"
            style="height: 500px; width: 100%"
          ></div>

          <!-- Data Filter as Horizontal Icons at Top Right -->
          <div class="absolute top-20 right-5">
            <div class="data-filter flex flex-col space-y-0">
              <!-- Air Quality Filter -->
              <label
                class="filter-label flex flex-col items-center cursor-pointer group relative"
              >
                <input
                  type="checkbox"
                  v-model="showAirQuality"
                  @change="updateMapMarkers"
                  class="hidden"
                />
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="
                    showAirQuality
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  "
                >
                  <!-- Air Quality Icon -->
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <!-- Moved the text to absolute positioning so it doesn't affect layout -->
                <span
                  class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10"
                >
                  คุณภาพอากาศ
                </span>
              </label>

              <!-- Fire Filter -->
              <label
                class="filter-label flex flex-col items-center cursor-pointer group relative"
              >
                <input
                  type="checkbox"
                  v-model="showFires"
                  @change="updateMapMarkers"
                  class="hidden"
                />
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="
                    showFires
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  "
                >
                  <!-- Fire Icon -->
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                  </svg>
                </div>
                <span
                  class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10"
                >
                  ไฟป่า
                </span>
              </label>

              <!-- Earthquake Filter -->
              <label
                class="filter-label flex flex-col items-center cursor-pointer group relative"
              >
                <input
                  type="checkbox"
                  v-model="showEarthquakes"
                  @change="updateMapMarkers"
                  class="hidden"
                />
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="
                    showEarthquakes
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  "
                >
                  <!-- Earthquake Icon -->
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
                    />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                </div>
                <span
                  class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10"
                >
                  แผ่นดินไหว
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Banners remain the same -->
      <!-- Air Quality Banner -->
      <div
        id="banner"
        class="banner"
        v-if="showBanner && selectedLocation.type === 'air_quality'"
      >
        <h3 class="banner-title">
          คุณภาพอากาศใน
          <span class="location-title">{{ selectedLocation.place }}</span>
        </h3>
        <div class="air-quality" style="justify-content: center">
          <img
            class="weather-icon"
            :src="selectedLocation.weatherIcon"
            alt="weather icon"
          />
          <span
            style="
              font-size: 18px;
              font-weight: bold;
              font-family: 'Sarabun', sans-serif;
            "
            class="air-quality-status"
            :style="{
              color: getStatusColor(selectedLocation.airQualityStatus),
            }"
          >
            {{ selectedLocation.airQualityStatus }}
          </span>
        </div>
        <div class="air-details">
          <span
            class="detail-item"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
              padding: 5px 10px;
              border-radius: 15px;
            "
          >
            <div style="display: flex; align-items: center">
              <img
                src="/assets/images/temperature_icon.png"
                alt="Temperature"
                class="temp-icon"
                style="width: 24px; height: 24px; margin-right: 5px"
              />
              <span style="font-size: 16px"
                >{{ selectedLocation.temperature }}°C</span
              >
            </div>
            <div style="display: flex; align-items: center">
              <img
                src="/assets/images/humidity_icon.png"
                alt="Humidity"
                class="humidity-icon"
                style="width: 22px; height: 22px; margin-right: 5px"
              />
              <span style="font-size: 16px"
                >{{ selectedLocation.humidity }}%</span
              >
            </div>
          </span>
          <span
            class="detail-item"
            style="
              display: block;
              text-align: center;
              font-size: 12px;
              color: #666;
            "
          >
            อัพเดทล่าสุด: {{ selectedLocation.updateTime }}
          </span>
        </div>
      </div>

      <!-- Fire Banner -->
      <div
        id="banner"
        class="banner fire-banner"
        v-if="showBanner && selectedLocation.type === 'fire'"
      >
        <h3 class="banner-title">
          จุดความร้อน
          <span class="location-title">{{ selectedLocation.place }}</span>
        </h3>
        <div class="fire-info">
          <img
            class="fire-icon"
            src="/assets/images/fire_icon.png"
            alt="fire icon"
            style="width: 60px; height: 60px"
          />
          <div class="fire-details">
            <span
              class="fire-intensity"
              :style="{
                color: getFireIntensityColor(selectedLocation.intensity),
              }"
            >
              ระดับ: {{ selectedLocation.intensity }}
            </span>
            <span class="fire-confidence">
              ความมั่นใจ: {{ selectedLocation.confidence }}%
            </span>
          </div>
        </div>
        <div class="fire-additional">
          <span class="detail-item">
            <strong>วันที่ตรวจพบ:</strong> {{ selectedLocation.date }}
          </span>
          <span class="detail-item">
            <strong>พื้นที่:</strong> {{ selectedLocation.area }} ตร.กม.
          </span>
          <span
            class="detail-item"
            style="
              display: block;
              text-align: center;
              font-size: 12px;
              color: #666;
            "
          >
            อัพเดทล่าสุด: {{ selectedLocation.updateTime }}
          </span>
        </div>
      </div>

      <!-- Earthquake Banner -->
      <div
        id="banner"
        class="banner earthquake-banner"
        v-if="showBanner && selectedLocation.type === 'earthquake'"
      >
        <h3 class="banner-title">
          แผ่นดินไหว
          <span class="location-title">{{ selectedLocation.place }}</span>
        </h3>
        <div class="earthquake-info">
          <img
            class="earthquake-icon"
            src="/assets/images/earthquake_icon.png"
            alt="earthquake icon"
            style="width: 60px; height: 60px"
          />
          <div class="earthquake-magnitude">
            <span
              class="magnitude-value"
              :style="{ color: getEarthquakeColor(selectedLocation.magnitude) }"
            >
              {{ selectedLocation.magnitude }} Magnitude
            </span>
            <span class="magnitude-depth">
              ความลึก: {{ selectedLocation.depth }} กม.
            </span>
          </div>
        </div>
        <div class="earthquake-additional">
          <span class="detail-item">
            <strong>เวลาเกิด:</strong> {{ selectedLocation.time }}
          </span>
          <span
            class="detail-item"
            :style="{ color: getTsunamiColor(selectedLocation.tsunami) }"
          >
            <strong>สึนามิ:</strong>
            {{ selectedLocation.tsunami ? "มีโอกาส" : "ไม่มีโอกาส" }}
          </span>
          <span
            class="detail-item"
            style="
              display: block;
              text-align: center;
              font-size: 12px;
              color: #666;
            "
          >
            อัพเดทล่าสุด: {{ selectedLocation.updateTime }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
      map: null,
      // Remove this line: markers: new Map(),
      searchTerm: "",
      selectedLocation: {},
      showBanner: false,
      devices: [],
      fires: [],
      earthquakes: [],
      previousPm25Values: new Map(),
      lastUpdateTime: null,
      colorRanges: [],

      // Use only these separate collections
      airQualityMarkers: new Map(),
      fireMarkers: new Map(),
      earthquakeMarkers: new Map(),

      // Filter controls
      showAirQuality: true,
      showFires: true,
      showEarthquakes: true,
    };
  },
  async mounted() {
    const { colorRanges } = useColorSettings();
    this.colorRanges = colorRanges.value;

    await this.fetchAllData();
    this.loadGoogleMaps();

    // Fetch data every 30 seconds
    this.interval = setInterval(this.fetchAllData, 30000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchAllData() {
      await Promise.all([
        this.fetchAirQualityData(),
        this.fetchFireData(),
        this.fetchEarthquakeData(),
      ]);
    },

    async fetchAirQualityData() {
      try {
        const response = await fetch(
          "https://yakkaw.mfu.ac.th/api/yakkaw/devices"
        );
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลคุณภาพอากาศได้");
        const resData = await response.json();

        const today = new Date().toISOString().split("T")[0];
        this.devices = resData.response.filter(
          (device) =>
            device.status &&
            device.status.toLowerCase() === "active" &&
            device.pm25 &&
            device.humidity &&
            device.temperature &&
            device.ddate === today
        );

        if (this.devices.length > 0) {
          this.lastUpdateTime = new Date(
            this.devices[0].updatetime * 1000
          ).toLocaleString("th-TH");
        }

        this.devices.forEach((device) => {
          const previousPm25 =
            this.previousPm25Values.get(device.deviceid) || device.pm25;
          this.previousPm25Values.set(device.deviceid, device.pm25);
        });
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลคุณภาพอากาศ:", error);
      }
    },

    async fetchFireData() {
      try {
        const response = await fetch(
          "https://yakkaw.mfu.ac.th/blueschool/apis/fires"
        );
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลไฟป่าได้");
        const fireData = await response.json();

        console.log("Fire API Response:", fireData); // Debug log

        // Handle different response formats
        let firesArray = [];

        if (Array.isArray(fireData)) {
          // If the response is already an array
          firesArray = fireData;
        } else if (fireData && typeof fireData === "object") {
          // If it's an object, check for common properties
          if (fireData.data && Array.isArray(fireData.data)) {
            firesArray = fireData.data;
          } else if (fireData.response && Array.isArray(fireData.response)) {
            firesArray = fireData.response;
          } else if (fireData.features && Array.isArray(fireData.features)) {
            firesArray = fireData.features;
          } else if (fireData.fires && Array.isArray(fireData.fires)) {
            firesArray = fireData.fires;
          } else {
            // If it's an object but not with expected properties, try to extract values
            firesArray = Object.values(fireData).filter(
              (item) =>
                item && typeof item === "object" && (item.latitude || item.lat)
            );
          }
        }

        console.log("Processed fires array:", firesArray); // Debug log

        // Process fire data - only use real data
        this.fires = firesArray
          .map((fire, index) => {
            // Extract coordinates with multiple fallbacks
            let lat, lng;

            if (fire.latitude !== undefined && fire.longitude !== undefined) {
              lat = parseFloat(fire.latitude);
              lng = parseFloat(fire.longitude);
            } else if (fire.lat !== undefined && fire.lng !== undefined) {
              lat = parseFloat(fire.lat);
              lng = parseFloat(fire.lng);
            } else if (fire.geometry && fire.geometry.coordinates) {
              // GeoJSON format: [lng, lat]
              [lng, lat] = fire.geometry.coordinates;
            } else {
              // Skip if no coordinates found
              console.warn("No coordinates found for fire, skipping:", fire);
              return null;
            }

            // Skip if coordinates are invalid
            if (isNaN(lat) || isNaN(lng)) {
              console.warn("Invalid coordinates for fire, skipping:", fire);
              return null;
            }

            // Extract fire properties - only use real data
            const brightness = fire.brightness || fire.confidence;
            const confidence = fire.confidence;

            // Skip if essential data is missing
            if (brightness === undefined || confidence === undefined) {
              console.warn("Missing essential fire data, skipping:", fire);
              return null;
            }

            return {
              id: `fire_${fire.id || fire.fid || index}`,
              type: "fire",
              latitude: lat,
              longitude: lng,
              place:
                fire.location ||
                fire.place ||
                fire.name ||
                `จุดความร้อน ${index + 1}`,
              intensity: this.getFireIntensity(brightness),
              confidence: Math.round(confidence),
              date:
                fire.date ||
                fire.detection_date ||
                new Date().toLocaleDateString("th-TH"),
              area: fire.area || "N/A",
              brightness: brightness,
              updateTime: new Date().toLocaleString("th-TH"),
            };
          })
          .filter((fire) => fire !== null); // Remove null entries

        console.log("Final fires data:", this.fires); // Debug log
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลไฟป่า:", error);
        this.fires = [];
      }
    },

    async fetchEarthquakeData() {
      try {
        const response = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
        );
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลแผ่นดินไหวได้");
        const earthquakeData = await response.json();

        // Show Earthquake ย้อนหลัง 3 วัน
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 4);

        // Process earthquake data
        this.earthquakes = earthquakeData.features
          .filter((quake) => {
            const quakeDate = new Date(quake.properties.time);
            return quake.properties.mag >= 2.0 && quakeDate >= sevenDaysAgo;
          })
          .map((quake) => ({
            id: `earthquake_${quake.id}`,
            type: "earthquake",
            latitude: quake.geometry.coordinates[1],
            longitude: quake.geometry.coordinates[0],
            depth: quake.geometry.coordinates[2].toFixed(1),
            magnitude: quake.properties.mag.toFixed(1),
            place: quake.properties.place,
            time: new Date(quake.properties.time).toLocaleString("th-TH"),
            tsunami: quake.properties.tsunami === 1,
            updateTime: new Date().toLocaleString("th-TH"),
          }));
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแผ่นดินไหว:", error);
      }
    },

    getFireIntensity(brightness) {
      if (brightness > 300) return "สูงมาก";
      if (brightness > 200) return "สูง";
      if (brightness > 100) return "ปานกลาง";
      return "ต่ำ";
    },

    loadGoogleMaps() {
      if (typeof google === "undefined") {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD9TDjlJEO60ksYuV2mCk-j6R2lHjrjx6k&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = this.initMap;
        document.head.appendChild(script);
      } else {
        this.initMap();
      }
    },

    initMap() {
      if (!this.$refs.mapContainer) {
        console.error("Map container not found!");
        return;
      }

      this.map = new google.maps.Map(this.$refs.mapContainer, {
        center: { lat: 13.7563, lng: 100.5018 },
        zoom: 6,
      });

      this.updateMapMarkers();
    },

    updateMapMarkers() {
      console.log("=== NUCLEAR OPTION ===");

      // Save current view
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();

      // Completely clear the map container
      this.$refs.mapContainer.innerHTML = "";

      // Recreate the map
      this.map = new google.maps.Map(this.$refs.mapContainer, {
        center: center,
        zoom: zoom,
      });

      // Clear all marker collections
      this.airQualityMarkers.clear();
      this.fireMarkers.clear();
      this.earthquakeMarkers.clear();

      // Add markers based on filters
      if (this.showAirQuality) {
        this.addAirQualityMarkers();
      }
      if (this.showFires) {
        this.addFireMarkers();
      }
      if (this.showEarthquakes) {
        this.addEarthquakeMarkers();
      }

      this.debugMarkers();
    },

    clearAllMarkers() {
      console.log("Clearing markers, current count:", this.markers.size);

      // Create a temporary array to avoid modification during iteration
      const markersArray = Array.from(this.markers.values());

      markersArray.forEach((marker) => {
        try {
          // Remove all event listeners first
          if (google && google.maps && google.maps.event) {
            google.maps.event.clearInstanceListeners(marker);
          }
          // Remove from map
          marker.setMap(null);
          // Destroy the marker completely
          marker = null;
        } catch (error) {
          console.warn("Error removing marker:", error);
        }
      });

      // Clear the Map completely
      this.markers.clear();
      console.log("Markers cleared, new count:", this.markers.size);
    },

    clearMarkerType(markerMap) {
      console.log("Clearing marker type, current count:", markerMap.size);

      // Create a copy of the values to avoid modification during iteration
      const markers = Array.from(markerMap.values());

      markers.forEach((marker) => {
        try {
          // Remove from map first
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
          // Clear all event listeners
          if (google && google.maps && google.maps.event) {
            google.maps.event.clearInstanceListeners(marker);
          }
        } catch (error) {
          console.warn("Error removing marker:", error);
        }
      });

      // Clear the map
      markerMap.clear();
      console.log("Marker type cleared, new count:", markerMap.size);
    },

    addAirQualityMarkers() {
      if (!this.devices.length) return;

      this.devices.forEach((device) => {
        const marker = new google.maps.Marker({
          position: { lat: device.latitude, lng: device.longitude },
          map: this.map,
          icon: this.createCustomMarker(
            device.pm25,
            this.previousPm25Values.get(device.deviceid) || device.pm25,
            device.trend
          ),
          title: device.place,
        });

        this.airQualityMarkers.set(device.deviceid, marker);

        marker.addListener("mouseover", () => {
          this.updateAirQualityBanner(device);
          this.showBanner = true;
        });

        marker.addListener("mouseout", () => {
          this.showBanner = false;
        });

        marker.addListener("click", () => {
          this.map.setCenter(marker.getPosition());
          this.map.setZoom(12);
          this.updateAirQualityBanner(device);
          this.showBanner = true;
        });
      });
    },

    addFireMarkers() {
      if (!this.fires.length) return;

      this.fires.forEach((fire) => {
        const marker = new google.maps.Marker({
          position: { lat: fire.latitude, lng: fire.longitude },
          map: this.map,
          icon: this.createFireMarker(fire.intensity),
          title: `จุดความร้อน - ${fire.place}`,
        });

        this.fireMarkers.set(fire.id, marker);

        marker.addListener("mouseover", () => {
          this.updateFireBanner(fire);
          this.showBanner = true;
        });

        marker.addListener("mouseout", () => {
          this.showBanner = false;
        });

        marker.addListener("click", () => {
          this.map.setCenter(marker.getPosition());
          this.map.setZoom(12);
          this.updateFireBanner(fire);
          this.showBanner = true;
        });
      });
    },

    addEarthquakeMarkers() {
      if (!this.earthquakes.length) return;

      this.earthquakes.forEach((quake) => {
        const marker = new google.maps.Marker({
          position: { lat: quake.latitude, lng: quake.longitude },
          map: this.map,
          icon: this.createEarthquakeMarker(quake.magnitude),
          title: `แผ่นดินไหว M${quake.magnitude} - ${quake.place}`,
        });

        this.earthquakeMarkers.set(quake.id, marker);

        marker.addListener("mouseover", () => {
          this.updateEarthquakeBanner(quake);
          this.showBanner = true;
        });

        marker.addListener("mouseout", () => {
          this.showBanner = false;
        });

        marker.addListener("click", () => {
          this.map.setCenter(marker.getPosition());
          this.map.setZoom(12);
          this.updateEarthquakeBanner(quake);
          this.showBanner = true;
        });
      });
    },
    testFilters() {
      console.log("Filter states:", {
        showAirQuality: this.showAirQuality,
        showFires: this.showFires,
        showEarthquakes: this.showEarthquakes,
      });
      console.log("Data counts:", {
        devices: this.devices.length,
        fires: this.fires.length,
        earthquakes: this.earthquakes.length,
      });
    },

    createCustomMarker(pm25_marker, pm25Prev, trend) {
      // Your existing PM2.5 marker creation code
      const color = this.getMarkerColor(pm25_marker);
      const size = 50;
      const circleSize = 30;
      const arrowCircleSize = 20;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");

      // Draw main PM2.5 circle
      context.beginPath();
      context.arc(size / 2 - 5, size / 2, circleSize / 2, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();

      // Draw PM2.5 value
      context.fillStyle = "white";
      context.strokeStyle = "black";
      context.lineWidth = 1;
      context.stroke();
      context.font = 'bold 20px "Angsana New"';
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(pm25_marker, size / 2 - 5, size / 2);

      // Draw trend arrow (your existing code)
      const arrowBaseX = size - arrowCircleSize / 2 - 2;
      const arrowBaseY = arrowCircleSize / 2 + 2;

      context.beginPath();
      context.arc(arrowBaseX, arrowBaseY, arrowCircleSize / 2, 0, 2 * Math.PI);
      context.fillStyle = "white";
      context.fill();
      context.strokeStyle = "black";
      context.lineWidth = 2;
      context.stroke();

      context.beginPath();
      if (trend === "d") {
        context.moveTo(arrowBaseX, arrowBaseY + 5);
        context.lineTo(arrowBaseX - 5, arrowBaseY - 5);
        context.lineTo(arrowBaseX + 5, arrowBaseY - 5);
        context.fillStyle = "green";
      } else if (trend === "u") {
        context.moveTo(arrowBaseX, arrowBaseY - 5);
        context.lineTo(arrowBaseX - 5, arrowBaseY + 5);
        context.lineTo(arrowBaseX + 5, arrowBaseY + 5);
        context.fillStyle = "red";
      } else {
        context.moveTo(arrowBaseX - 5, arrowBaseY);
        context.lineTo(arrowBaseX + 5, arrowBaseY);
        context.strokeStyle = "gray";
        context.lineWidth = 2;
        context.stroke();
        return canvas.toDataURL();
      }
      context.closePath();
      context.fill();

      return canvas.toDataURL();
    },

    createFireMarker(intensity) {
      const size = 40;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");

      const color = this.getFireIntensityColor(intensity);

      // Draw fire icon
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(size / 2, 5);
      context.bezierCurveTo(size / 2, 5, 5, size - 5, size / 2, size - 5);
      context.bezierCurveTo(
        size / 2,
        size - 5,
        size - 5,
        size - 5,
        size / 2,
        5
      );
      context.fill();

      context.fillStyle = "orange";
      context.beginPath();
      context.arc(size / 2, size / 2, size / 4, 0, 2 * Math.PI);
      context.fill();

      return canvas.toDataURL();
    },

    createEarthquakeMarker(magnitude) {
      const size = 30;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");

      const color = this.getEarthquakeColor(magnitude);

      // Draw earthquake icon (seismic waves)
      context.strokeStyle = color;
      context.lineWidth = 3;

      for (let i = 0; i < 3; i++) {
        context.beginPath();
        context.arc(size / 2, size / 2, size / 2 - i * 5, 0, 2 * Math.PI);
        context.stroke();
      }

      // Center dot
      context.fillStyle = color;
      context.beginPath();
      context.arc(size / 2, size / 2, 4, 0, 2 * Math.PI);
      context.fill();

      return canvas.toDataURL();
    },

    getFireIntensityColor(intensity) {
      switch (intensity) {
        case "สูงมาก":
          return "#ff0000";
        case "สูง":
          return "#ff6b00";
        case "ปานกลาง":
          return "#ffa500";
        case "ต่ำ":
          return "#ffff00";
        default:
          return "#ffa500";
      }
    },

    getEarthquakeColor(magnitude) {
      if (magnitude >= 7) return "#red";
      if (magnitude >= 6) return "#efa628";
      if (magnitude >= 4) return "#e9db51";
      return "#6dd951";
    },

    getTsunamiColor(tsunami) {
      return tsunami ? "#ff0000" : "#00aa00";
    },

    updateAirQualityBanner(device) {
      let airQualityStatus = "";
      let weatherIcon = "";

      if (device.pm25 <= 15) {
        airQualityStatus = "ดีมาก";
        weatherIcon = "/assets/images/yyakkaw_blue_icon.png";
      } else if (device.pm25 <= 25) {
        airQualityStatus = "ดี";
        weatherIcon = "/assets/images/yyakkaw_green_icon.png";
      } else if (device.pm25 <= 37.5) {
        airQualityStatus = "ปานกลาง";
        weatherIcon = "/assets/images/yyakkaw_yellow_icon.png";
      } else if (device.pm25 <= 75) {
        airQualityStatus = "แย่";
        weatherIcon = "/assets/images/yyakkaw_orange_icon.png";
      } else {
        airQualityStatus = "อันตราย";
        weatherIcon = "/assets/images/yyakkaw_red_icon.png";
      }

      this.selectedLocation = {
        type: "air_quality",
        place: device.place,
        pm25_marker: device.pm25,
        temperature: device.temperature,
        humidity: device.humidity,
        airQualityStatus: airQualityStatus,
        weatherIcon: weatherIcon,
        updateTime: this.lastUpdateTime,
      };
    },

    updateFireBanner(fire) {
      this.selectedLocation = {
        type: "fire",
        place: fire.place,
        intensity: fire.intensity,
        confidence: fire.confidence,
        date: fire.date,
        area: fire.area,
        updateTime: fire.updateTime,
      };
    },

    updateEarthquakeBanner(quake) {
      this.selectedLocation = {
        type: "earthquake",
        place: quake.place,
        magnitude: quake.magnitude,
        depth: quake.depth,
        time: quake.time,
        tsunami: quake.tsunami,
        updateTime: quake.updateTime,
      };
    },

    searchLocation() {
      const term = this.searchTerm.toLowerCase();

      // Search in all data types
      const foundAirQuality = this.devices.find((device) =>
        device.place.toLowerCase().includes(term)
      );
      const foundFire = this.fires.find((fire) =>
        fire.place.toLowerCase().includes(term)
      );
      const foundEarthquake = this.earthquakes.find((quake) =>
        quake.place.toLowerCase().includes(term)
      );

      const found = foundAirQuality || foundFire || foundEarthquake;

      if (found) {
        this.map.setCenter({ lat: found.latitude, lng: found.longitude });
        this.map.setZoom(12);

        if (foundAirQuality) this.updateAirQualityBanner(found);
        else if (foundFire) this.updateFireBanner(found);
        else if (foundEarthquake) this.updateEarthquakeBanner(found);

        this.showBanner = true;
      } else {
        alert("ไม่พบสถานที่ที่ค้นหา");
      }
      const searchLocation = () => {
        if (!searchTerm.value) return;
        console.log("Searching for:", searchTerm.value);
        // ใส่ logic ค้นหาของคุณที่นี่
      };
    },

    // Your existing methods
    getMarkerColor(pm25_marker) {
      if (pm25_marker <= 15) return "#30b2fc";
      else if (pm25_marker <= 25) return "#6dd951";
      else if (pm25_marker <= 37.5) return "#e9db51";
      else if (pm25_marker <= 75) return "#efa628";
      else return "red";
    },

    getStatusColor(status) {
      switch (status) {
        case "ดีมาก":
          return "#30b2fc";
        case "ดี":
          return "#6dd951";
        case "ปานกลาง":
          return "#e9db51";
        case "แย่":
          return "#efa628";
        case "อันตราย":
          return "red";
        default:
          return "black";
      }
    },

    debugMarkers() {
      console.log("=== DEBUG MARKER STATE ===");
      console.log("Filter states:", {
        showAirQuality: this.showAirQuality,
        showFires: this.showFires,
        showEarthquakes: this.showEarthquakes,
      });
      console.log("Data counts:", {
        devices: this.devices.length,
        fires: this.fires.length,
        earthquakes: this.earthquakes.length,
      });
      console.log("Marker counts:", {
        airQuality: this.airQualityMarkers.size,
        fires: this.fireMarkers.size,
        earthquakes: this.earthquakeMarkers.size,
      });

      // Check if markers are actually on the map
      let actualOnMap = {
        airQuality: 0,
        fires: 0,
        earthquakes: 0,
      };

      this.airQualityMarkers.forEach((marker) => {
        if (marker.getMap() !== null) actualOnMap.airQuality++;
      });
      this.fireMarkers.forEach((marker) => {
        if (marker.getMap() !== null) actualOnMap.fires++;
      });
      this.earthquakeMarkers.forEach((marker) => {
        if (marker.getMap() !== null) actualOnMap.earthquakes++;
      });

      console.log("Markers actually on map:", actualOnMap);
      console.log("=== END DEBUG ===");
    },
  },
};
</script>

<style scoped>
/* Your existing styles remain the same, add these new ones */
/* Map Container Styles */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.bg-white {
  background-color: white;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-3 {
  padding: 0.75rem;
}

/* Data Filter Styles */
.data-filter {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.space-y-1 > * + * {
  margin-top: 0.1rem;
}

.space-y-0 > * + * {
  margin-top: 0;
}

.space-y-px > * + * {
  margin-top: 1px;
}

.filter-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* .space-x-2>*+* {
    margin-left: 0.5rem;
} */

.w-8 {
  width: 2rem;
}

.h-8 {
  height: 2rem;
}

.rounded-full {
  border-radius: 9999px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.transition-all {
  transition: all 0.2s;
}

.duration-200 {
  transition-duration: 200ms;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-orange-500 {
  background-color: #f97316;
}

.bg-red-500 {
  background-color: #ef4444;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.text-white {
  color: white;
}

.text-gray-600 {
  color: #4b5563;
}

.hover\:bg-gray-300:hover {
  background-color: #d1d5db;
}

.text-xs {
  font-size: 0.75rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.rounded {
  border-radius: 0.25rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.opacity-0 {
  opacity: 0;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.transition-opacity {
  transition: opacity 0.2s;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.hidden {
  display: none;
}

/* New UI Styles */
.max-w-7xl {
  max-width: 80rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.text-center {
  text-align: center;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.font-bold {
  font-weight: 700;
}

.text-gray-900 {
  color: #1f2937;
}

.text-gray-600 {
  color: #4b5563;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-row {
  flex-direction: row;
}

.justify-between {
  justify-content: space-between;
}

.items-start {
  align-items: flex-start;
}

.items-center {
  align-items: center;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-0 > * + * {
  margin-top: 0;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.w-full {
  width: 100%;
}

.w-1\/2 {
  width: 50%;
}

.ml-2 {
  margin-left: 0.5rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}

.text-white {
  color: white;
}

.transition {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}

.bg-white {
  background-color: white;
}

.rounded-2xl {
  border-radius: 1rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.overflow-hidden {
  overflow: hidden;
}

.data-filter {
  display: flex;
  gap: 15px;
  margin-left: 20px;
  align-items: center;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  font-family: "Sarabun", sans-serif;
  cursor: pointer;
}

.filter-label input {
  margin: 0;
}

/* Banner variations */
.fire-banner {
  border-left: 4px solid #ff6b00;
}

.earthquake-banner {
  border-left: 4px solid #ff0000;
}

.fire-info,
.earthquake-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.fire-details,
.earthquake-magnitude {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.fire-intensity,
.magnitude-value {
  font-size: 18px;
  font-weight: bold;
  font-family: "Sarabun", sans-serif;
}

.fire-confidence,
.magnitude-depth {
  font-size: 14px;
  color: #666;
}

.fire-additional,
.earthquake-additional {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Media Queries */
@media screen and (max-width: 1024px) {
  .data-filter {
    flex-direction: column;
    gap: 8px;
    margin-left: 10px;
  }
}

@media screen and (max-width: 768px) {
  .data-filter {
    margin-top: 10px;
    width: 100%;
    justify-content: center;
  }

  .search-container {
    flex-wrap: wrap;
  }
}

/* Rest of your existing CSS styles remain the same */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  font-family: "Angsana New", sans-serif;
}

.search-container {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 100px;
  padding: 10px;
  background-color: #070d22;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-input {
  padding: 12px 20px;
  border: 1px solid #ccc;
  border-radius: 20px;
  width: 50%;
  max-width: 800px;
  font-size: 16px;
  color: #333;
  margin-right: 10px;
}

.search-button {
  padding: 12px 25px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
}

.search-input::placeholder {
  color: #999;
  font-style: italic;
}

#map {
  height: 100vh;
  margin-top: 0px;
}

/* .banner {
    position: absolute;
    background: #fffdf9;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    width: 250px;
    z-index: 1000;
    font-family: "Sarabun", sans-serif;
    line-height: 1.5;
    transition: opacity 0.3s ease;
    pointer-events: none;
    margin-top: 200px;
    margin-left: 150px;
} */

#banner {
  position: fixed;
  background: #fffdf9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  width: 250px;
  z-index: 1000;
  font-family: "Sarabun", sans-serif;
  line-height: 1.5;
  transition: opacity 0.3s ease;
  pointer-events: auto;
  display: block !important;
  opacity: 1 !important;
  top: 250px;
  left: 250px;
}

.banner-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.location-title {
  color: #f02a51;
}

.air-quality {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.weather-icon {
  width: 100px;
  height: 100px;
}

.pm25-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.air-quality-status {
  font-size: 16px;
  color: #f5a623;
}

.air-details {
  margin-bottom: 15px;
}

.detail-item {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.detail-item strong {
  color: #000000;
}

/* Add responsive styles for new elements */
@media screen and (max-width: 768px) {
  .data-filter {
    flex-wrap: wrap;
    justify-content: center;
  }

  .fire-info,
  .earthquake-info {
    flex-direction: column;
    text-align: center;
  }
}

@media screen and (max-width: 480px) {
  .banner {
    width: 200px;
    margin-left: 20px;
  }

  #banner {
    width: 200px;
    left: 20px;
  }
}
</style>
