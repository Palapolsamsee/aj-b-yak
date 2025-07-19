<script setup>  
import { onMounted, ref } from "vue";

const isClient = ref(false);  
let L = null;  

// Store PM2.5 data and color settings  
const pm25Data = ref([]);  
const colorSettings = ref([]);  
const mapInteractionsEnabled = ref(true); // State to manage map interactions  

// Load color settings  
const loadSettings = async () => {  
  try {  
    //load จากไหน
    const response = await fetch("http://localhost:3000/api/settings");  
    const data = await response.json();  
    colorSettings.value = data.colorSettings || [];  
  } catch (error) {  
    console.error("Error loading settings:", error);  
    alert("Failed to load color settings.");  
  }  
};  

// Function to get color based on PM2.5 value  
function getColor(pm25) {  
  if (!Array.isArray(colorSettings.value) || colorSettings.value.length === 0) {  
    console.error("Color settings are not available or not an array");  
    return "gray";  
  }  

  for (const range of colorSettings.value) {  
    if (pm25 >= range.min && pm25 <= range.max) {  
      return range.color; // Return the color that matches PM2.5  
    }  
  }  

  return "gray"; // Default return value if no match  
}  

onMounted(async () => {  
  if (typeof window !== "undefined") {  
    isClient.value = true;  

    try {  
      // Load color settings  
      await loadSettings();  

      // Fetch PM2.5 data  
      const response = await fetch("http://localhost:3000/api/pm25");  
      const data = await response.json();  

      if (Array.isArray(data)) {  
        pm25Data.value = data;  
      } else {  
        console.error("PM2.5 data is not an array:", data);  
        return;  
      }  

      // Dynamic import of Leaflet s
      const leaflet = await import("leaflet");  
      await import("leaflet/dist/leaflet.css");  
      L = leaflet.default;  

      // Create map  
      const map = L.map("map", {  
        dragging: mapInteractionsEnabled.value,  
        touchZoom: mapInteractionsEnabled.value,  
        scrollWheelZoom: mapInteractionsEnabled.value,  
        doubleClickZoom: mapInteractionsEnabled.value,  
      }).setView([13.736717, 100.523186], 10);  

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {  
        attribution: "&copy; OpenStreetMap contributors",  
      }).addTo(map);  

      // Add markers to the map  
      pm25Data.value.forEach((location) => {  
        if (!location.lat || !location.lng || typeof location.pm25 !== "number") {  
          console.warn("Invalid location data:", location);  
          return;  
        }  

        const color = getColor(location.pm25); // Get color based on PM2.5  

        const markerIcon = L.divIcon({  
          className: "custom-marker",  
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,  
        });  

        L.marker([location.lat, location.lng], { icon: markerIcon })  
          .addTo(map)  
          .bindPopup(`  
            <div style="  
              background-color: white;  
              padding: 15px;  
              border-radius: 8px;  
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  
              font-family: Arial, sans-serif;  
              font-size: 14px;  
              max-width: 250px;  
              text-align: center;  
            ">  
              <div style="  
                background-color: ${color};  
                width: 100%;  
                height: 50px;  
                border-radius: 8px 8px 0 0;  
                margin-bottom: 10px;  
              "></div>  
              <h4 style="  
                margin: 0;  
                font-size: 16px;  
                color: #333;  
              ">PM2.5 Details</h4>  
              <p style="  
                margin: 5px 0 10px;  
                color: #555;  
              ">PM2.5: ${location.pm25}</p>  
              <span style="  
                display: inline-block;  
                padding: 5px 10px;  
                background-color: #f5f5f5;  
                border-radius: 5px;  
                color: #666;  
                font-size: 12px;  
              ">Color: ${color}</span>  
            </div>  
          `);  
      });  

      // Add "Locate Me" button  
      const locateButton = L.control({ position: "topright" });  
      locateButton.onAdd = function () {  
        const button = L.DomUtil.create("button", "locate-btn");  
        button.innerHTML = "📍 Locate Me";  
        button.onclick = () => {  
          if (navigator.geolocation) {  
            navigator.geolocation.getCurrentPosition(  
              (position) => {  
                const { latitude, longitude } = position.coords;  
                map.setView([latitude, longitude], 12);  
                L.marker([latitude, longitude]);  
              },  
              (error) => {  
                alert("Unable to retrieve your location");  
              }  
            );  
          } else {  
            alert("Geolocation is not supported by this browser.");  
          }  
        };  
        return button;  
      };  
      locateButton.addTo(map);  

      const toggleInteractionButton = L.control({ position: "topright" });

toggleInteractionButton.onAdd = function () {
  const button = L.DomUtil.create("button", "toggle-btn p-2 rounded-full bg-gray-200 hover:bg-gray-300 active:ring-4 active:ring-blue-500 transition-all duration-200");
  
  // ใช้ไอคอนจาก Heroicons (เล่น/หยุด)
  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 12L6 6V18Z" /></svg>';
  
  button.onclick = () => {
    mapInteractionsEnabled.value = !mapInteractionsEnabled.value;
    
    // เปิด/ปิดการโต้ตอบทั้งหมด
    if (mapInteractionsEnabled.value) {
      // เปิดการโต้ตอบ
      map.dragging.enable();
      map.touchZoom.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      
      // เปลี่ยนไอคอนเป็น "หยุด"
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6L18 12L6 18V6Z" /></svg>';
    } else {
      // ปิดการโต้ตอบ
      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      
      // เปลี่ยนไอคอนเป็น "เล่น"
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 12L6 6V18Z" /></svg>';
    }

    // เพิ่มคลาสสำหรับทำให้ปุ่มเด่น
    button.classList.add('bg-blue-500', 'text-white', 'ring-4', 'ring-blue-300');
    setTimeout(() => {
      button.classList.remove('bg-blue-500', 'text-white', 'ring-4', 'ring-blue-300');
    }, 300);
  };

  return button;
};

toggleInteractionButton.addTo(map);


    } catch (error) {  
      console.error("Error loading data or setting up the map:", error);  
    }  
  }  
});  
</script>  
<template>
  <div>
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between my-4 space-y-4 sm:space-y-0">
    <h1 class="text-lg sm:text-2xl font-bold text-center sm:text-left">สถานการณ์คุณภาพอากาศ</h1>
    <div class="w-full sm:w-auto">
      <input
        type="text"
        placeholder="ค้นหา..."
        class="border rounded px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  </div>

    <!-- Map Section -->
    <div id="map" class="h-64 sm:h-80 md:h-96 lg:h-[500px] w-full"></div>
  </div>
</template>


<style scoped>

#map {
    height: 250px; /* default for mobile */
    width: 100%;
  }

  @media (min-width: 640px) { /* sm */
    #map {
      height: 320px;
    }
  }

  @media (min-width: 768px) { /* md */
    #map {
      height: 384px;
    }
  }

  @media (min-width: 1024px) { /* lg */
    #map {
      height: 500px;
    }
  }

</style>
