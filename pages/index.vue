<script setup lang="ts">
import Sponsors from '~/components/Sponsors.vue';
</script>

<template>
  <div class="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen flex flex-col">
    <!-- Header Section -->
    <Header />

    <!-- Main Content -->
    <main class="flex-grow">
      <div class="container mx-auto px-4 py-8">
        <!-- Show Component -->
        <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
          <show />
        </div>

        <!-- Sponsors Section -->
        <div class="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md rounded-lg p-6 mb-8">
          <Sponsors />
        </div>

        <!-- Contact Form Section -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <ContactForm />
        </div>
      </div>
    </main>

    <!-- Footer Section -->
    <Footer />
  </div>
</template>

<style scoped>
/* Background gradient for the page */
body {
  background: linear-gradient(to bottom, #e0f7fa, #ffffff);
  font-family: 'Inter', sans-serif;
}

/* Add smooth scrolling for better UX */
html {
  scroll-behavior: smooth;
}

/* Styling for the container */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Add subtle shadow for cards */
.bg-white {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Gradient background for sponsors section */
.bg-gradient-to-r {
  background: linear-gradient(to right, #e0e7ff, #c7d2fe);
}

/* Add hover effect for interactive elements */
button:hover, a:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}
</style>

