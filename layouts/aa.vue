layouts/default.vue
<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-blue-500 text-white p-4 text-center">
      <h1 class="text-2xl">PM2.5 Map</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>© 2023 PM2.5 Monitoring</p>
    </footer>
  </div>
</template>

<script setup>
// No script is needed here unless you want to add dynamic data.
</script>
