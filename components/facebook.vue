<template>
  <div>
    <!-- Facebook SDK Loader -->
    <div id="fb-root"></div>

    <!-- Facebook Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Join Us Online</h2>
        <p class="text-gray-600 mb-8">
          Follow us on Facebook for the latest updates
        </p>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <span class="ml-3 text-gray-600">Loading Facebook pages...</span>
        </div>

        <!-- Error State -->
        <div
          v-if="facebookError"
          class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"
        >
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-red-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="text-red-800"
              >Facebook pages failed to load. Showing alternative links.</span
            >
          </div>
        </div>

        <!-- News Grid -->
        <div class="news-grid">
          <!-- ยักษ์ขาว Page -->
          <div class="news-card">
            <div class="bg-gray-50 rounded-lg p-4 h-full">
              <h3 class="text-xl font-semibold text-gray-900 mb-3">ยักษ์ขาว</h3>

              <!-- Facebook Page Plugin -->
              <div v-if="!useIframe && !facebookError" class="fb-page-wrapper">
                <div
                  class="fb-page"
                  data-href="https://www.facebook.com/profile.php?id=100064516369084"
                  data-tabs="timeline"
                  data-width="400"
                  data-height="400"
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                ></div>
              </div>

              <!-- Fallback iframe -->
              <div v-else class="iframe-wrapper">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100064516369084&tabs=timeline&width=400&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                  width="400"
                  height="400"
                  style="border: none; overflow: hidden; border-radius: 8px"
                  scrolling="no"
                  frameborder="0"
                  allowfullscreen="true"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                >
                </iframe>
              </div>

              <!-- Direct Link Fallback -->
              <div class="mt-4 text-center">
                <a
                  href="https://www.facebook.com/profile.php?id=100064516369084"
                  target="_blank"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  ยักษ์ขาว
                </a>
              </div>
            </div>
          </div>

          <!-- ห้องเรียนสู้ฝุ่น Page -->
          <div class="news-card">
            <div class="bg-gray-50 rounded-lg p-4 h-full">
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                ห้องเรียนสู้ฝุ่น
              </h3>

              <!-- Facebook Page Plugin -->
              <div v-if="!useIframe && !facebookError" class="fb-page-wrapper">
                <div
                  class="fb-page"
                  data-href="https://www.facebook.com/profile.php?id=100063582878340"
                  data-tabs="timeline"
                  data-width="400"
                  data-height="400"
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                ></div>
              </div>

              <!-- Fallback iframe -->
              <div v-else class="iframe-wrapper">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100063582878340&tabs=timeline&width=400&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                  width="400"
                  height="400"
                  style="border: none; overflow: hidden; border-radius: 8px"
                  scrolling="no"
                  frameborder="0"
                  allowfullscreen="true"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                >
                </iframe>
              </div>

              <!-- Direct Link Fallback -->
              <div class="mt-4 text-center">
                <a
                  href="https://www.facebook.com/profile.php?id=100063582878340"
                  target="_blank"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  ห้องเรียนสู้ฝุ่น
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "FacebookSection",
  data() {
    return {
      loading: true,
      facebookError: false,
      useIframe: false,
    };
  },
  mounted() {
    this.initializeFacebook();

    // Set timeout to switch to iframe if Facebook plugin doesn't load
    setTimeout(() => {
      if (this.loading) {
        console.log("Switching to iframe fallback");
        this.useIframe = true;
        this.loading = false;
      }
    }, 5000);
  },
  methods: {
    initializeFacebook() {
      this.loading = true;

      // Check if Facebook SDK is already loaded
      if (window.FB) {
        this.parseFacebookElements();
        return;
      }

      // Initialize Facebook SDK
      window.fbAsyncInit = () => {
        FB.init({
          xfbml: true,
          version: "v18.0",
        });

        console.log("Facebook SDK initialized");
        this.loading = false;
        this.facebookError = false;

        // Force re-render of Facebook elements
        setTimeout(() => {
          if (window.FB) {
            FB.XFBML.parse();
          }
        }, 1000);
      };

      // Load Facebook SDK script
      this.loadFacebookScript();
    },

    loadFacebookScript() {
      // Remove existing script if any
      const existingScript = document.getElementById("facebook-jssdk");
      if (existingScript) {
        existingScript.remove();
      }

      // Create new script element
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src =
        "https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      // Add error handling for script load
      script.onerror = () => {
        console.error("Failed to load Facebook SDK");
        this.facebookError = true;
        this.loading = false;
        this.useIframe = true;
      };

      script.onload = () => {
        console.log("Facebook SDK loaded successfully");
      };

      document.body.appendChild(script);
    },

    parseFacebookElements() {
      if (window.FB) {
        try {
          FB.XFBML.parse();
          this.loading = false;
          this.facebookError = false;
          console.log("Facebook elements parsed");
        } catch (error) {
          console.error("Error parsing Facebook elements:", error);
          this.handleFacebookError();
        }
      }
    },

    handleFacebookError() {
      this.facebookError = true;
      this.loading = false;
      this.useIframe = true;
    },
  },
};
</script>

<style scoped>
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  align-items: start;
}

.news-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.fb-page-wrapper,
.iframe-wrapper {
  min-height: 400px;
  display: flex;
  justify-content: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .news-card {
    margin: 0 1rem;
  }

  .fb-page-wrapper,
  .iframe-wrapper {
    min-height: 300px;
  }
}

/* Loading animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
