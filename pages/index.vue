<!-- <template>
  <div class="page-container">
    <Header />
    <Mapza />
    <table_show />
    <ContactForm />
  </div>
</template>

<style scoped>
.page-container {
  background-color: #ffffff; /* Replace #ffffff with your desired background color */
  min-height: 100vh; /* Ensure the background covers the full viewport height */
}
</style>
 -->
<template bg-white-100>
  <div class="min-h-screen bg-white">
    <Header />
    <main>
      <HeroSection />
      <CurrentAirQuality />
      <Mapza />
      <!-- Place Heatmap between the map and the table -->
      <heatmap />
      <!-- <Mapza />  -->
      <DeviceTable />
      <!-- <Static /> -->
      <AQIGuide />
     <Facebook />
      <Sponsors />
      
    
    </main>
    <AppFooter />
  </div>
  
</template>

<script setup>
import Header from '~/components/Header.vue';

// Global styles and meta
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

html {
  font-family: 'Inter', sans-serif;
}
</style>

