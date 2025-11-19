<template>
  <header class="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <a href="#home" class="flex items-center gap-3">
        <img
          src="/assets/images/yakkaw_nouse.jpg"
          alt="Yakkaw Logo"
          class="h-12 w-12 rounded-xl object-cover shadow-sm sm:h-16 sm:w-16"
        />
        <div>
          <p class="text-lg font-bold text-gray-900 sm:text-2xl">
            <span class="text-blue-950">ยักษ์ขาว</span>
            <span class="text-red-600">วัดฝุ่น</span>
          </p>
          <p class="text-xs uppercase tracking-[0.3em] text-gray-400">
            Air Quality Watch
          </p>
        </div>
      </a>

      <nav class="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
        <a
          v-for="item in menuItems"
          :key="item.href"
          :href="item.href"
          class="rounded-full px-4 py-2 transition hover:bg-blue-50 hover:text-blue-700"
          @click.prevent="handleNavClick(item.href)"
        >
          {{ item.label }}
        </a>
      </nav>

      <button
        type="button"
        class="inline-flex items-center rounded-full border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:hidden"
        @click="toggleMobileMenu"
        :aria-expanded="mobileMenuOpen.toString()"
        aria-controls="mobile-nav"
      >
        <span class="sr-only">เมนู</span>
        <svg
          v-if="!mobileMenuOpen"
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 7h14M5 12h14M5 17h10" />
        </svg>
        <svg
          v-else
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18 18 6" />
        </svg>
      </button>
    </div>

    <Transition name="mobile-nav">
      <div
        v-if="mobileMenuOpen"
        id="mobile-nav"
        class="md:hidden border-t border-gray-100 bg-white/95 px-4 py-4 shadow-inner"
      >
        <nav class="flex flex-col gap-2 text-base font-medium text-gray-700">
          <a
            v-for="item in menuItems"
            :key="item.label"
            :href="item.href"
            class="rounded-2xl px-4 py-3 transition hover:bg-blue-50 hover:text-blue-700"
            @click.prevent="handleNavClick(item.href)"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { nextTick, ref } from "vue";

const router = useRouter();
const route = useRoute();

const mobileMenuOpen = ref(false);

const menuItems = [
  { label: "หน้าหลัก", href: "#home" },
  { label: "แผนที่", href: "#map" },
  { label: "คุณภาพอากาศ", href: "#data" },
  { label: "ข่าว", href: "#advice" },
  { label: "ผู้สนับสนุน", href: "#supporters" },
  { label: "ร่วมสนับสนุน", href: "#regis" },
  { label: "ติดต่อเรา", href: "#contact" },
];

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const scrollToSection = (hash) => {
  const target = document.querySelector(hash);
  if (!target) return;

  const headerOffset = 96; // keep section visible under the sticky header
  const elementPosition = target.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

const handleNavClick = async (href) => {
  closeMobileMenu();

  if (!href.startsWith("#")) {
    await router.push(href);
    return;
  }

  if (route.path !== "/") {
    await router.push({ path: "/", hash: href });
    await nextTick();
  }

  scrollToSection(href);
};
</script>

<style scoped>
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
