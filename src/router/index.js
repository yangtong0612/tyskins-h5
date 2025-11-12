import { createRouter, createWebHistory } from "vue-router";
import Index from "@/layouts/index.vue";
import NotFound from "@/views/404.vue";
import { emitter } from "@/libs";
import { store } from "@/store";
const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    children: [
      {
        path: "/open",
        name: "BosOpen",
        meta: { title: "Bos开业主题" },
        component: () => import("@/views/topic/open.vue"),
      },
      {
        path: "/",
        name: "Home",
        meta: { title: "首页", module: "home" },
        component: () => import("@/views/home/index.vue"),
      },
      {
        path: "/problem",
        name: "Problem",
        meta: { title: "常见问题" },
        component: () => import("@/views/problem/index.vue"),
      },
      {
        path: "/service",
        name: "Service",
        meta: { title: "服务" },
        component: () => import("@/views/service/index.vue"),
      },
      {
        path: "/openbox/:id",
        name: "OpenBox",
        component: () => import("@/views/openbox/Index.vue"),
        meta: {
          module: "csgo",
        },
      },
      {
        path: "/welfarebox/:id/:box_id",
        name: "WelfareBox",
        component: () => import("@/views/welfarebox/Index.vue"),
        meta: {
          module: "csgo",
        },
      },
      {
        path: "/upgrade",
        name: "Upgrade",
        meta: { title: "升级", module: "upgrade" },
        component: () => import("@/views/upgrade/index.vue"),
      },
      {
        path: "/upgradeDetail",
        name: "UpgradeDetail",
        meta: { title: "升级详情页" },
        component: () => import("@/views/upgrade/detail.vue"),
      },
      {
        path: "/roll",
        name: "Roll",
        meta: { title: "Roll房", module: "roll" },
        component: () => import("@/views/roll/index.vue"),
      },
      {
        path: "/roll/:id",
        name: "RollRoom",
        meta: { title: "Roll房", module: "roll" },
        component: () => import("@/views/roll/RollRoom.vue"),
      },
      {
        path: "/mall",
        name: "Mall",
        meta: { title: "商城", module: "mall" },
        component: () => import("@/views/mall/index.vue"),
      },
      {
        path: "/luckystar",
        name: "Luckystar",
        meta: { title: "幸运星" },
        component: () => import("@/views/luckystar/index.vue"),
      },
      {
        path: "/battle",
        name: "Battle",
        meta: { title: "对战", module: "battle" },
        component: () => import("@/views/battle/index.vue"),
      },
      {
        path: "/battle-detail/:id",
        name: "BattleDetail",
        component: () => import("@/views/battle/Detail.vue"),
        meta: {
          title: "对战详情",
          module: "battle",
        },
      },
      {
        path: "/promote",
        name: "Promote",
        meta: { title: "推广", module: "promote" },
        component: () => import("@/views/promote/index.vue"),
      },
      {
        path: "/lottery",
        name: "Lottery",
        meta: { title: "抽奖", module: "lottery" },
        component: () => import("@/views/lottery/index.vue"),
      },
      {
        path: "/grade-reward",
        name: "GradeReward",
        meta: { title: "等级奖励", module: "gradeReward" },
        component: () => import("@/views/grade-reward/index.vue"),
      },
      {
        path: "/mine-sweeping",
        name: "MineSweeping",
        meta: { title: "排雷战场", module: "mineSweeping" },
        component: () => import("@/views/mine-sweeping/index.vue"),
      },
      {
        path: "/task",
        name: "Task",
        meta: { title: "今日任务", modele: "task" },
        component: () => import("@/views/task/index.vue"),
      },
      {
        path: "/user",
        name: "User",
        meta: { title: "个人中心" },
        redirect: "/user/mystock",
        component: () => import("@/views/user/index.vue"),
        children: [
          {
            path: "mystock",
            name: "MyStock",
            meta: { title: "我的库存" },
            component: () => import("@/views/user/mystock.vue"),
          },
          {
            path: "cdk",
            name: "Cdk",
            meta: { title: "我的CDK" },
            component: () => import("@/views/user/cdk.vue"),
            children: [
              {
                path: "detail/:id",
                name: "CdkDetail",
                meta: { title: "CDK详情" },
                component: () => import("@/views/user/CdkDetail.vue"),
              },
            ],
          },
          {
            path: "record",
            name: "Record",
            meta: { title: "历史记录" },
            component: () => import("@/views/user/record.vue"),
          },
          {
            path: "signin",
            name: "Signin",
            meta: { title: "我的签到" },
            component: () => import("@/views/user/signin.vue"),
          },
          {
            path: "setting",
            name: "Setting",
            meta: { title: "账号设置" },
            component: () => import("@/views/user/setting.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const requireTokenRoutes = [
    "Promote",
    "GradeReward",
    "Signin",
    "MineSweeping",
  ];
  if (requireTokenRoutes.includes(to.name)) {
    // console.log(to.path)
    store.commit("setTargetUrl", to.path);
    if (token) {
      next();
    } else {
      emitter.emit("login");
    }
  } else {
    next();
  }
});
