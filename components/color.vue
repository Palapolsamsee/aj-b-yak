<template>
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold mb-4">PM2.5 Color Settings</h1>
  
      <!-- Display color range settings -->
      <div v-if="colorSettings.length > 0">
        <div
          v-for="(range, index) in colorSettings"
          :key="range.id"
          class="mb-4 flex items-center justify-between border p-4 rounded"
        >
          <p>
            Range: {{ range.min }} - {{ range.max }} PM2.5,
            Color: <span :style="{ color: range.color }">{{ range.color }}</span>
          </p>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">No color settings available. Please add one.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  // State variables
  const colorSettings = ref([]);
  
  // Load color settings
  const loadSettings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/settings");
      const data = await response.json();
      colorSettings.value = data.colorSettings || [];
    } catch (error) {
      console.error("Error loading settings:", error);
      alert("Failed to load color settings.");
    }
  };
  
  // Fetch settings on component mount
  onMounted(() => {
    loadSettings();
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 20px auto;
  }
  </style>
  