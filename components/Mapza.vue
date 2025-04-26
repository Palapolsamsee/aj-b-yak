<template>
    <!-- <div style="background-color: white;"> -->
    <div>
        <div class="search-container"
            style="text-align: center; align-items: center; justify-content: center; margin-top: 100px;">
            <span style="font-size: 22px; font-weight: bold; margin-right: 250px;">สำรวจคุณภาพอากาศ</span>
            <input type="text" class="search-input" placeholder="ค้นหาสถานที่..." v-model="searchTerm"
                @keyup.enter="searchLocation" />
            <button class="search-button" @click="searchLocation">ค้นหา</button>
        </div>

        <div class="map-container" style="max-width: 1200px; margin: 0 auto; border-radius: 10px; overflow: hidden;">
            <div ref="mapContainer" id="map" style="height: 500px; width: 100%;"></div>
        </div>

        <div id="banner" class="banner" v-if="showBanner">
            <h3 class="banner-title">คุณภาพอากาศใน <span class="location-name">{{ selectedLocation.place }}</span></h3>
            <div class="air-quality">
                <img class="weather-icon" :src="selectedLocation.weatherIcon" alt="weather icon">
                <span class="pm25-marker">{{ selectedLocation.pm25_marker }}</span>
                <span style="font-size: 18px; font-weight: bold; font-family: 'Sarabun', sans-serif;"
                    class="air-quality-status" :style="{ color: getStatusColor(selectedLocation.airQualityStatus) }">
                    {{ selectedLocation.airQualityStatus }}
                </span>
            </div>
            <div class="air-details">
                <span class="detail-item"
                    style="display: flex; align-items: center; justify-content: center; gap: 20px; padding: 5px 10px; border-radius: 15px;">
                    <div style="display: flex; align-items: center;">
                        <img src="/assets/images/temperature_icon.png" alt="Temperature" class="temp-icon"
                            style="width: 24px; height: 24px; margin-right: 5px;">
                        <span style="font-size: 16px;">{{ selectedLocation.temperature }}°C</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <img src="/assets/images/humidity_icon.png" alt="Humidity" class="humidity-icon"
                            style="width: 22px; height: 22px; margin-right: 5px;">
                        <span style="font-size: 16px;">{{ selectedLocation.humidity }}%</span>
                    </div>
                </span>
                <span class="detail-item" style="display: block; text-align: center;  font-size: 12px; color: #666;">
                    อัพเดทล่าสุด: {{ selectedLocation.updateTime }}
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

    </div>
    <!-- </div> -->
</template>

<script>
export default {
    data() {
        return {
            isMenuOpen: false,
            map: null,
            markers: new Map(),
            searchTerm: '',
            selectedLocation: {},
            showBanner: false,
            devices: [],
            previousPm25Values: new Map(),
            lastUpdateTime: null,
            colorRanges: [],

        };
    },
    async mounted() {
        const { colorRanges } = useColorSettings(); // Get colorRanges
        this.colorRanges = colorRanges.value; // Assign to component data


        await this.fetchData();
        this.loadGoogleMaps();

        // Fetch data every 30 seconds (adjust as needed)
        this.interval = setInterval(this.fetchData, 30000);
    },
    beforeUnmount() {
        // Clear interval when the component is destroyed to prevent memory leaks
        clearInterval(this.interval);
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        async fetchData() {
            try {
                const response = await fetch('https://yakkaw.mfu.ac.th/api/yakkaw/devices');
                if (!response.ok) {
                    throw new Error('ไม่สามารถโหลดข้อมูลได้');
                }
                const resData = await response.json();

                const today = new Date().toISOString().split('T')[0];

                this.devices = resData.response.filter(device =>
                    device.status && device.status.toLowerCase() === 'active' &&
                    device.av6h !== '' &&
                    device.av3h !== '' &&
                    device.av1h !== '' &&
                    device.aqi !== '' &&
                    device.pm25 !== null && device.pm25 !== '' &&
                    device.humidity !== null && device.humidity !== '' &&
                    device.temperature !== null && device.temperature !== '' &&
                    device.ddate === today &&
                    device.pm25_6h !== null && device.pm25_6h !== 0
                );

                // Update last update time from the first device
                if (this.devices.length > 0) {
                    this.lastUpdateTime = new Date(this.devices[0].updatetime * 1000).toLocaleString('th-TH');
                }

                // Update previous PM2.5 values
                this.devices.forEach(device => {
                    const previousPm25 = this.previousPm25Values.get(device.deviceid) || device.pm25;
                    this.previousPm25Values.set(device.deviceid, device.pm25);

                    // Update marker with new PM2.5 and previous value
                    const marker = this.markers.get(device.deviceid);
                    if (marker) {
                        marker.setIcon(this.createCustomMarker(device.pm25, previousPm25, device.trend));
                    }
                });
            } catch (error) {
                console.error('เกิดข้อผิดพลาด:', error);
            }
        },
        loadGoogleMaps() {
            // Check if the Google Maps script already exists
            if (typeof google === 'undefined') {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD9TDjlJEO60ksYuV2mCk-j6R2lHjrjx6k&callback=initMap`;
                script.async = true;
                script.defer = true;
                window.initMap = this.initMap;  // Directly assign the method
                document.head.appendChild(script);
            } else {
                this.initMap(); // If already loaded, initialize immediately
            }
        },
        initMap() {
            // Check if the map container exists
            if (!this.$refs.mapContainer) {
                console.error('Map container not found!');
                return;
            }

            // Initialize Google Maps
            this.map = new google.maps.Map(this.$refs.mapContainer, {
                center: { lat: 13.7563, lng: 100.5018 }, // Default location (Bangkok)
                zoom: 6
            });

            // Place markers if devices are available
            if (this.devices.length > 0) {
                this.devices.forEach(device => {
                    const marker = new google.maps.Marker({
                        position: { lat: device.latitude, lng: device.longitude },
                        map: this.map,
                        icon: this.createCustomMarker(device.pm25, this.previousPm25Values.get(device.deviceid) || device.pm25, device.trend),
                        title: device.place
                    });

                    this.markers.set(device.deviceid, marker);

                    marker.addListener('mouseover', () => {
                        this.updateBanner(device);
                        this.showBanner = true;
                    });

                    marker.addListener('mouseout', () => {
                        this.showBanner = false;
                    });
                });
            }
        },
        createCustomMarker(pm25_marker, pm25Prev, trend) {
            const color = this.getMarkerColor(pm25_marker);
            const size = 50;
            const circleSize = 30;
            const arrowCircleSize = 20; // Outer circle for arrow

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d');

            console.log('Canvas width:', canvas.width);
            console.log('Canvas height:', canvas.height);

            // Draw the main PM2.5 circle marker
            context.beginPath();
            context.arc(size / 2 - 5, size / 2, circleSize / 2, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();

            // Draw PM2.5 value in the center
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.lineWidth = 1;
            context.stroke();
            context.font = 'bold 20px "Angsana New"';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(pm25_marker, size / 2 - 5, size / 2);

            // Calculate arrow position
            const arrowBaseX = size - arrowCircleSize / 2 - 2;
            const arrowBaseY = arrowCircleSize / 2 + 2;

            // Draw outer circle for the arrow
            context.beginPath();
            context.arc(arrowBaseX, arrowBaseY, arrowCircleSize / 2, 0, 2 * Math.PI);
            context.fillStyle = 'white';
            context.fill();
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.stroke();

            // Draw SVG arrow based on trend
            context.beginPath();
            if (trend === 'd') {
                // Downward arrow
                context.moveTo(arrowBaseX, arrowBaseY + 5); // Bottom point of the arrow
                context.lineTo(arrowBaseX - 5, arrowBaseY - 5); // Top left
                context.lineTo(arrowBaseX + 5, arrowBaseY - 5); // Top right
                context.fillStyle = 'green'; // Arrow color for downward trend
            } else if (trend === 'u') {
                // Upward arrow
                context.moveTo(arrowBaseX, arrowBaseY - 5); // Top point of the arrow
                context.lineTo(arrowBaseX - 5, arrowBaseY + 5); // Bottom left
                context.lineTo(arrowBaseX + 5, arrowBaseY + 5); // Bottom right
                context.fillStyle = 'red'; // Arrow color for upward trend
            } else {
                // Neutral line
                context.moveTo(arrowBaseX - 5, arrowBaseY); // Left
                context.lineTo(arrowBaseX + 5, arrowBaseY); // Right
                context.strokeStyle = 'gray'; // Line color for neutral trend
                context.lineWidth = 2;
                context.stroke();
                return canvas.toDataURL();
            }
            context.closePath();
            context.fill();

            return canvas.toDataURL();
        },

        getMarkerColor(pm25_marker) {
            if (pm25_marker <= 15) {
                return '#30b2fc';
            } else if (pm25_marker <= 25) {
                return '#6dd951';
            } else if (pm25_marker <= 37.5) {
                return '#e9db51';
            } else if (pm25_marker <= 75) {
                return '#efa628';
            } else {
                return 'red';
            }
        },

        getStatusColor(status) {
            switch (status) {
                case 'ดีมาก':
                    return '#30b2fc';
                case 'ดี':
                    return '#6dd951';
                case 'ปานกลาง':
                    return '#e9db51';
                case 'แย่':
                    return '#efa628';
                case 'อันตราย':
                    return 'red';
                default:
                    return 'black';
            }
        },

        updateBanner(device) {
            let airQualityStatus = '';
            let weatherIcon = '';

            if (device.pm25 <= 15) {
                airQualityStatus = 'ดีมาก';
                weatherIcon = '/assets/images/yyakkaw_blue_icon.png';
            } else if (device.pm25 <= 25) {
                airQualityStatus = 'ดี';
                weatherIcon = '/assets/images/yyakkaw_green_icon.png';
            } else if (device.pm25 <= 37.5) {
                airQualityStatus = 'ปานกลาง';
                weatherIcon = '/assets/images/yyakkaw_yellow_icon.png';
            } else if (device.pm25 <= 75) {
                airQualityStatus = 'แย่';
                weatherIcon = '/assets/images/yyakkaw_orange_icon.png';
            } else {
                airQualityStatus = 'อันตราย';
                weatherIcon = '/assets/images/yyakkaw_red_icon.png';
            }

            this.selectedLocation = {
                place: device.place,
                pm25_6h: device.pm25_6h,
                temperature: device.temperature,
                humidity: device.humidity,
                airQualityStatus: airQualityStatus,
                weatherIcon: weatherIcon,
                updateTime: this.lastUpdateTime
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
        },
    }
}
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
    font-family: 'Angsana New', sans-serif;
}

.search-container {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 20px;
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
    /*   WHITE SPACE BETWEEN HEADER AND MAP
    margin: 0;
    padding: 0; */
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
    font-family: "Sarabun", sans-serif;
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
    font-family: "Sarabun", sans-serif;
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

.menu-button {
    font-size: 30px;
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    padding: 10px;
}

.dropdown-menu {
    position: absolute;
    top: 40px;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 150px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
}

.dropdown-menu a {
    padding: 10px;
    text-decoration: none;
    color: black;
    font-size: 16px;
}

.dropdown-menu a:hover {
    background: #f0f0f0;
}

svg {
    width: 100px;
    height: 100px;
    background-color: red;
}
</style>

