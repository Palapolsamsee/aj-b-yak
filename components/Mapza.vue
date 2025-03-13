<template>
    <div>
        <div class="hidden md:block">
            <div class="bg-slate-900 text-white p-4">
                <div class="container mx-auto flex justify-between items-center">
                    <h1 class="text-2xl font-bold">
                        ยักษ์ขาว <span class="text-red-500">วัดฝุ่น</span>
                    </h1>

                    <!-- Hamburger Menu -->
                    <div class="relative">
                        <button class="menu-button" @click="toggleMenu">☰</button>
                        <div class="dropdown-menu" v-if="isMenuOpen">
                            <a href="MainPage">หน้าแรก</a>
                            <a href="MapPage">แผนที่ยักษ์ขาว</a>
                            <a href="News">ข่าว</a>
                            <a href="ColorSetting">ตั้งค่าสี</a>
                            <a href="Regis">ซื้อเครื่อง</a>
                            <a href="ContactPage">ติดต่อเรา</a>
                        </div>
                    </div>
                </div>

                <div class="search-container">
                    <input type="text" class="search-input" placeholder="ค้นหาสถานที่..." v-model="searchTerm"
                        @keyup.enter="searchLocation" />
                    <button class="search-button" @click="searchLocation">ค้นหา</button>
                </div>
            </div>
        </div>

        <div ref="mapContainer" id="map"></div>

        <div id="banner" class="banner" v-if="showBanner">
            <h3 class="banner-title">คุณภาพอากาศใน <span class="location-name">{{ selectedLocation.place }}</span></h3>
            <div class="air-quality">
                <img class="weather-icon" :src="selectedLocation.weatherIcon" alt="weather icon">
                <span class="pm25-value">{{ selectedLocation.pm25 }}</span>
                <span class="air-quality-status" :style="{ color: getStatusColor(selectedLocation.airQualityStatus) }">
                    {{ selectedLocation.airQualityStatus }}
                </span>
            </div>
            <div class="air-details">
                <!-- <div class="detail-item">PM2.5: <strong>{{ selectedLocation.pm25 }} µg/m³</strong></div> -->
                <!-- <img class="temp-icon" src="/assets/images/weather_img.png" alt="temp icon"> -->
                <span class="detail-item">
                    Temperature: {{ selectedLocation.temperature }}° | Humidity: {{ selectedLocation.humidity }}%
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


        <div class="footer text-center">
            <img src="/assets/images/yakkaw_dust_measure.jpg" alt="Air Quality Alert Levels" class="mx-auto">
        </div>
    </div>
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
            devices: []
        };
    },
    async mounted() {
        await this.fetchData();
        this.loadGoogleMaps();
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

                // Filter out inactive devices and those missing important values
                this.devices = resData.response.filter(device =>
                    device.status.toLowerCase() !== 'inactive' &&  // Exclude inactive status
                    device.pm25 != null && device.pm25 !== 0 &&   // Ensure PM2.5 has a valid value
                    device.humidity != null && device.humidity !== '' &&  // Ensure humidity is valid
                    device.temperature != null && device.temperature !== '' && // Ensure temperature is valid
                    device.updatetime != null &&  // Ensure updatetime is valid
                    device.deviceid != null &&  // Ensure deviceid is valid
                    device.timestamp != null &&  // Ensure timestamp is valid
                    device.ddate != null && device.ddate !== '' // Ensure ddate is valid
                );
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
                    icon: this.createCustomMarker(device.pm25),
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
        createCustomMarker(pm25) {
            const color = this.getMarkerColor(pm25);
            const canvas = document.createElement('canvas');
            const size = 30; // Size of the marker
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d');

            // Draw circle
            context.beginPath();
            context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();

            // Draw text
            context.fillStyle = 'white';
            context.font = 'bold 13px Sarabun';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(pm25, size / 2, size / 2);

            return {
                url: canvas.toDataURL(),
                scaledSize: new google.maps.Size(size, size)
            };
        },
        getMarkerColor(pm25) {
            if (pm25 <= 25) {
                return 'blue';
            } else if (pm25 <= 37) {
                return 'green';
            } else if (pm25 <= 50) {
                return '#FFD700';
            } else if (pm25 <= 90) {
                return 'orange';
            } else {
                return 'red';
            }
        },
        updateBanner(device) {
            let airQualityStatus = '';
            let weatherIcon = '';

            if (device.pm25 <= 25) {
                airQualityStatus = 'ดีมาก';
                weatherIcon = '/assets/images/yyakkaw_blue_icon.png';
            } else if (device.pm25 <= 37) {
                airQualityStatus = 'ดี';
                weatherIcon = '/assets/images/yyakkaw_green_icon.png';
            } else if (device.pm25 <= 50) {
                airQualityStatus = 'ปานกลาง';
                weatherIcon = '/assets/images/yyakkaw_yellow_icon.png';
            } else if (device.pm25 <= 90) {
                airQualityStatus = 'แย่';
                weatherIcon = '/assets/images/yyakkaw_orange_icon.png';
            } else {
                airQualityStatus = 'อันตราย';
                weatherIcon = '/assets/images/yyakkaw_red_icon.png';
            }

            this.selectedLocation = {
                place: device.place,
                pm25: device.pm25,
                temperature: device.temperature,
                humidity: device.humidity,
                airQualityStatus: airQualityStatus,
                weatherIcon: weatherIcon
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
        getStatusColor(status) {
            switch (status) {
                case 'ดีมาก':
                    return 'blue';
                case 'ดี':
                    return 'green';
                case 'ปานกลาง':
                    return '#FFD700';
                case 'แย่':
                    return 'orange';
                case 'อันตราย':
                    return 'red';
                default:
                    return 'black';
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
    border: 1px solid #000000;
    border-radius: 20px;
    width: 250px;
    font-size: 14px;
    color: #000000
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
    margin-top: 10px;
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
</style>
