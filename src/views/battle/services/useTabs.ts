import { ref } from "vue";

export const useTabs = () => {
  return {
    tabs: [
      {
        name: "所有",
        icon: "",
      },
      {
        name: "等待中",
        icon: "",
        value: 0
      },
      {
        name: "进行中",
        icon: "",
        value: 1,
      },
      {
        name: "已结束",
        icon: "",
        value: 2
      },
    ],
    activeTab: ref(0),
  };
};
