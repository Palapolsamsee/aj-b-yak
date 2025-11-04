<template>
  <div class="bg-gray-500">
    <section id="advice" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Latest Air Quality News
          </h2>
          <p class="text-gray-600">Stay updated with recent news and updates</p>
        </div>

        <!-- Loading/Error -->
        <div v-if="pending" class="text-center text-gray-500">
          Loading news...
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          {{ error.message }}
        </div>

        <!-- News Grid -->
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="item in news"
            :key="item.id"
            class="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              :src="getImageUrl(item.image)"
              alt="News Image"
              class="w-full h-48 object-cover"
            />
            <div class="p-5">
              <h3 class="text-xl font-bold text-gray-800 mb-2">
                {{ item.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-4">
                {{ formatThaiDate(item.date) }}
              </p>
              <p class="text-gray-700 text-sm line-clamp-3">
                {{ item.summary }}
              </p>
              <a
                :href="item.url"
                target="_blank"
                class="mt-4 inline-block text-blue-600 font-semibold"
                >Read More</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const API_URL = "http://localhost:8080/news";
const news = ref([]);
const pending = ref(true);
const error = ref(null);

function getImageUrl(url) {
  return url || "https://via.placeholder.com/300x200?text=No+Image";
}

function formatThaiDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  };
  return date.toLocaleDateString("th-TH", options);
}

async function fetchNews() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    news.value = Array.isArray(data)
      ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
      : [];
  } catch (err) {
    error.value = err;
  } finally {
    pending.value = false;
  }
}

onMounted(async () => {
  await fetchNews();

  if (process.client) {
    const fb = await loadFacebookSDK();
  }
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
