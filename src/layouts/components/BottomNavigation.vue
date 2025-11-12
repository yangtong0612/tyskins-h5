<template>
  <div class="bottom-navigation" v-if="isMobile">
    <!-- 一级导航项循环 -->
    <div
      v-for="(item, index) in navItems"
      :key="item.path"
      class="nav-item"
      :class="{ active: isActive(item) }"
      @click="handleNavClick(item, index)"
    >
      <div class="nav-icon-wrapper">
        <!-- 原 svg 图标代码保持不变 -->
        <span v-if="item.badge && item.badge > 0" class="nav-badge">{{
          item.badge
        }}</span>
        <!-- <svg v-if="item.children && item.children.length" class="submenu-indicator" ...></svg> -->
      </div>
      <span class="nav-label">{{ item.name }}</span>
    </div>

    <!-- 二级菜单容器 移到循环外部 -->
    <div
      class="submenu-container"
      v-if="showSubmenu !== null && navItems[showSubmenu]?.children?.length"
      :style="{ left: `${showSubmenu * 20}%` }"
    >
      <div class="submenu-arrow"></div>
      <div class="submenu-list">
        <div
          v-for="(subItem, subIndex) in navItems[showSubmenu].children"
          :key="subItem.path"
          class="submenu-item"
          @click="handleSubmenuClick(subItem)"
        >
          {{ subItem.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Index from "../index.vue";
const showSubmenu = ref<number | null>(null); // 存储当前展开二级菜单的索引（null为关闭）
const route = useRoute();
const router = useRouter();
const isMobile = computed(() => window.innerWidth < 768);

const navItems = ref([
  { name: "首页", path: "/", icon: "gift", badge: 0, children: [] },
  {
    name: "游戏",
    path: "/games",
    icon: "trophy",
    badge: null,
    children: [
      { name: "追梦升级", path: "/upgrade", icon: "upgrade", badge: null },
      { name: "热血对战", path: "/battle", icon: "battle", badge: null },
      {
        name: "扫雷战场",
        path: "/mine-sweeping",
        icon: "mine-sweeping",
        badge: null,
      },
    ],
  },
  { name: "Roll房", path: "/roll", icon: "games", badge: null },
  { name: "商城", path: "/mall", icon: "gift", badge: null },
  {
    name: "功能",
    path: "/set",
    icon: "trophy",
    badge: null,
    children: [
      { name: "福利任务", path: "/task", icon: "task", badge: null },
      { name: "每日签到", path: "/user/signin", icon: "signin", badge: null },
      {
        name: "免费宝箱",
        path: "/grade-reward",
        icon: "grade-reward",
        badge: null,
      },
      { name: "推广", path: "/promote", icon: "promote", badge: null },
    ],
  },
]);

function isActive(item: any): boolean {
  if (item.path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(item.path);
}

// function handleNavClick(item: any) {
//   if (item.path) {
//     router.push(item.path);
//   }
// }
function handleNavClick(item: any, index: number) {
  if (item.children && item.children.length) {
    // 有二级菜单：点击当前项则关闭，点击其他项则切换
    showSubmenu.value = showSubmenu.value === index ? null : index;
  } else {
    // 无子菜单：直接跳转
    router.push(item.path);
    showSubmenu.value = null; // 关闭可能存在的二级菜单
  }
}

// 【新增】二级菜单点击事件：跳转并关闭菜单
function handleSubmenuClick(subItem: any) {
  router.push(subItem.path);
  showSubmenu.value = null; // 点击后关闭二级菜单
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
.submenu-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  transform: rotate(90deg); // 旋转为向下箭头
}

// 【新增】二级菜单容器
.submenu-container {
  position: absolute;
  bottom: 60px; // 显示在一级导航上方
  width: 20%; // 与一级导航项宽度匹配
  padding: 8px 0;
  background: rgba(26, 26, 32, 0.98);
  border: 1px solid rgba(243, 164, 93, 0.3);
  border-radius: 8px;
  z-index: 999;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.3);
}

// 【新增】二级菜单箭头（指向一级导航）
.submenu-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(243, 164, 93, 0.3);
}

// 【新增】二级菜单列表
.submenu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

// 【新增】二级菜单项
.submenu-item {
  padding: 10px 8px;
  text-align: center;
  font-size: 12px;
  color: #99a5b7;
  cursor: pointer;

  &:hover {
    background: rgba(243, 164, 93, 0.2);
    color: #f3a45d;
  }

  &:active {
    background: rgba(243, 164, 93, 0.3);
  }
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
  .submenu-container {
    bottom: 56px; // 与一级导航高度匹配
  }

  .submenu-item {
    padding: 8px 6px;
    font-size: 11px;
  }
}
</style>
