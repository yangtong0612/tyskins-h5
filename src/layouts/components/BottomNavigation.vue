<template>
  <div class="bottom-navigation" v-if="isMobile">
    <div
      v-for="item in navItems"
      :key="item.path"
      class="nav-item"
      :class="{ active: isActive(item) }"
      @click="handleNavClick(item)"
    >
      <div class="nav-icon-wrapper">
        <svg
          v-if="item.icon === 'chat'"
          class="nav-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
            fill="currentColor"
          />
        </svg>
        <svg
          v-else-if="item.icon === 'games'"
          class="nav-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M15.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-7 0c0 .83-.67 1.5-1.5 1.5S6 12.83 6 12s.67-1.5 1.5-1.5S9 11.17 9 12zm-4-6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H5z"
            fill="currentColor"
          />
        </svg>
        <svg
          v-else-if="item.icon === 'gift'"
          class="nav-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"
            fill="currentColor"
          />
        </svg>
        <svg
          v-else-if="item.icon === 'trophy'"
          class="nav-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
            fill="currentColor"
          />
        </svg>
        <span v-if="item.badge && item.badge > 0" class="nav-badge">{{
          item.badge
        }}</span>
      </div>
      <span class="nav-label">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isMobile = computed(() => window.innerWidth < 768);

const navItems = ref([
  { name: "商城", path: "/mall", icon: "gift", badge: 0 },
  { name: "游戏", path: "/games", icon: "games", badge: null },
  { name: "礼物", path: "/grade-reward", icon: "gift", badge: null },
  { name: "排行版", path: "/battle", icon: "trophy", badge: null },
]);

function isActive(item: any): boolean {
  if (item.path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(item.path);
}

function handleNavClick(item: any) {
  if (item.path) {
    router.push(item.path);
  }
}
</script>

<style lang="scss" scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(
    180deg,
    rgba(26, 26, 32, 0.98) 0%,
    rgba(23, 23, 31, 0.98) 100%
  );
  border-top: 1px solid rgba(243, 164, 93, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
  backdrop-filter: blur(10px);
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.3);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s ease;
  color: #99a5b7;
  min-height: 60px;

  &.active {
    color: #f3a45d;

    .nav-icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.nav-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}

.nav-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease;
  color: currentColor;
}

.nav-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: #ff4444;
  color: #ffffff;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  padding: 0 4px;
  border: 2px solid rgba(26, 26, 32, 0.98);
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
  line-height: 1;
}

@media screen and (max-width: 480px) {
  .bottom-navigation {
    height: 56px;
  }

  .nav-item {
    min-height: 56px;
    padding: 2px 4px;
  }

  .nav-icon {
    width: 22px;
    height: 22px;
  }

  .nav-label {
    font-size: 10px;
  }
}
</style>
