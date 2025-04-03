<template>
    <div v-if="!entry">Loading...</div>
    <div v-else>
      <!-- วนลูปข้อมูลและแสดงผลเป็นการ์ด -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="data in entry"
          :key="data.id"
          class="p-4 border rounded shadow bg-white"
        >
          <h2 class="font-semibold">Location ID: {{ data.id }}</h2>
          <p><strong>PM2.5:</strong> {{ data.pm25 }}</p>
          <p><strong>Color:</strong> <span :style="{ color: data.color }">{{ data.color }}</span></p>
          <p><strong>Lat:</strong> {{ data.lat }}, <strong>Lng:</strong> {{ data.lng }}</p>
        data.
        </div>
      </div>
    </div>
    </template>
    <script setup>
    import { useFetch } from "#app";
    
    // ใช้ useFetch ดึงข้อมูลจาก API
    const { data: entry } = await useFetch('/api/pm25', {
      lazy: true, // โหลดข้อมูลแบบ Lazy
    });
    </script>
    