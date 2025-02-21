<template>
    <div>
        <div class="header">
            <div class="title">แผนที่ติดตั้ง ยักษ์ขาววัดฝุ่น</div>
            <div class="search-container">
                <input type="text" class="search-input" placeholder="ค้นหาสถานที่..." v-model="searchTerm"
                    @keyup.enter="searchLocation" />
                <button class="search-button" @click="searchLocation">ค้นหา</button>
            </div>
        </div>

        <div ref="mapContainer" id="map"></div>

        <div id="banner" class="banner" v-if="showBanner">
            <h3 class="banner-title">คุณภาพอากาศใน <span class="location-name">{{ selectedLocation.place }}</span></h3>
            <div class="air-quality">
                <img class="weather-icon" src="/assets/images/yakkaw_yellow_icon.png" alt="yakkaw yellow">
                <span class="pm25-value">{{ selectedLocation.pm25 }}</span>
                <span class="air-quality-status">ปานกลาง</span>
            </div>
            <div class="air-details">
                <div class="detail-item">PM2.5: <strong>{{ selectedLocation.pm25 }} µg/m³</strong></div>
                <!-- <img class="temp-icon" src="/assets/images/weather_img.png" alt="temp icon"> -->
                <span class="detail-item">
                {{ selectedLocation.temperature }}° | Humidity: {{ selectedLocation.humidity }}%
                <!-- {{ selectedLocation.windSpeed }} km/h -->
                </span>
            </div>
        </div>
<!--             <div>
                <div class="forecast">
            <div>
                <div class="value"></div>
                <img src="/assets/images/weather_img.png" alt="Rain Icon">
                <div>พฤหัสบดี</div>
            </div>
            <div>
                <div class="value">79</div>
                <img src="/assets/images/weather_img.png" alt="Rain Icon">
                <div>ศุกร์</div>
            </div>
            <div>
                <div class="value">5</div>
                <img src="/assets/images/weather_img.png" alt="Rain Icon">
                <div>เสาร์</div>
            </div>
        </div>
            </div> -->
        

        <div class="footer">
            <img src="/assets/images/yakkaw_dust_measure.png" alt="Air Quality Alert Levels">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            map: null,
            markers: new Map(),
            searchTerm: '',
            selectedLocation: {},
            showBanner: false,
            devices: []
        };
    },
    async mounted() {
        await this.fetchData();
        this.loadGoogleMaps();
    },
    methods: {
        async fetchData() {
            try {
                const response = await fetch('https://yakkaw.mfu.ac.th/api/yakkaw/devices');
                if (!response.ok) {
                    throw new Error('ไม่สามารถโหลดข้อมูลได้');
                }
                const resData = await response.json();
                this.devices = resData.response;
            } catch (error) {
                console.error('เกิดข้อผิดพลาด:', error);
            }
        },
        loadGoogleMaps() {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD9TDjlJEO60ksYuV2mCk-j6R2lHjrjx6k&callback=initMap`;
            script.async = true;
            script.defer = true;
            window.initMap = this.initMap;
            document.head.appendChild(script);
        },
        initMap() {
            this.map = new google.maps.Map(this.$refs.mapContainer, {
                center: { lat: 13.7563, lng: 100.5018 },
                zoom: 6
            });

            this.devices.forEach(device => {
                const marker = new google.maps.Marker({
                    position: { lat: device.latitude, lng: device.longitude },
                    map: this.map,
                    title: device.place
                });

                this.markers.set(device.dvid, marker);

                marker.addListener('mouseover', () => {
                    this.updateBanner(device);
                    this.showBanner = true;
                });

                marker.addListener('mouseout', () => {
                    this.showBanner = false;
                });
            });
        },
        updateBanner(device) {
            this.selectedLocation = {
                place: device.place,
                pm25: device.pm25,
                temperature: device.temperature,
                humidity: device.humidity,
                /* windSpeed: device.windSpeed */
            };
            this.showBanner = true;
        },
        searchLocation() {
            const term = this.searchTerm.toLowerCase();
            const found = this.devices.find(device => device.place.toLowerCase().includes(term));

            if (found) {
                this.map.setCenter({ lat: found.latitude, lng: found.longitude });
                this.map.setZoom(12);
                this.updateBanner(found);
                this.showBanner = true;
            } else {
                alert('ไม่พบสถานที่ที่ค้นหา');
            }
        }
    }
};
</script>
<style scoped>
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
    font-family: 'Sarabun', sans-serif;
}

.search-container {
    display: flex;
    gap: 10px;
}

.search-input {
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    width: 250px;
    font-size: 14px;
}

.search-button {
    padding: 8px 20px;
    background: #f02a51;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
}

#map {
    height: 100vh;
    margin-top: 60px;
}

.banner {
    position: absolute;
    background: #fffdf9;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    width: 250px;
    z-index: 1000;
    font-family: Arial, sans-serif;
    line-height: 1.5;
    transition: opacity 0.3s ease;
    pointer-events: none;
    /* Prevents it from blocking the map */
}

#banner {
    position: fixed;
    background: #fffdf9;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    width: 250px;
    z-index: 1000;
    font-family: Arial, sans-serif;
    line-height: 1.5;
    transition: opacity 0.3s ease;
    pointer-events: auto;
    /* Temporary style for debugging */
    display: block !important;
    opacity: 1 !important;
    top: 100px;
    left: 100px;
}

.banner-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.location-name {
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
    /* Smaller size for the weather icon */
    height: 100px;
    /* Keep it proportional */
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
    color: #f5a623;
}

.forecast {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.forecast-day {
    text-align: center;
}

.forecast-day-name {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
}

.forecast-icon {
    width: 50px;
    /* Smaller size for the forecast icon */
    height: 50px;
    /* Keep it proportional */
    margin: 5px 0;
    /* Add some spacing */
}

.forecast-value {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.footer {
    background: #ffffff;
    padding: 10px;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
</style>