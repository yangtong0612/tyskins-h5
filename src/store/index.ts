import { createStore, Store, useStore as baseUseStore } from "vuex";
import type { App, InjectionKey } from "vue";
import { UserService } from "@/services/UserService";

import {
  InviterInfo,
  LevelSettingData,
  PromoteRecord,
  PromoteStat,
  SkinItem,
} from "@/types";
import { PromoteService } from "@/services/PromoteService";
import TopService from "@/services/TopService";

export interface State {
  token: string | null;
  user: IUser | null;
  seed: string;
  loadingTime: number;
  disableOpenBoxAnimation: boolean;
  inviterInfo: InviterInfo | null;
  levelSetting: {
    list: LevelSettingData[];
    total: number;
  };
  promoteRecord: {
    list: PromoteRecord[];
    total: number;
  };
  promoteStat: PromoteStat | null;

  upgrade_profit_rate: string;
  upgradeLoadingTime: number;
  comfortSkin: SkinItem | null;
  rechargeWelfareBoxTypeId: number;
  targetUrl: string;
}

export interface IUser {
  avatar: string;
  coin: number;
  diamond: number;
  email: string;
  created_at: number;
  invite_code: string;
  is_take: number;
  last_login_ip: string;
  last_login_time: number;
  level: number;
  mobile: string;
  nickname: string;
  recharge_total: number;
  role: string;
  status: number;
  trade_url: string;
  updated_at: number;
  user_id: number;
  set_password: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    token: localStorage.getItem("token"),
    user: null,
    seed: "",
    loadingTime: 6000,
    disableOpenBoxAnimation: false,
    inviterInfo: null,
    levelSetting: {
      list: [],
      total: 0,
    },
    promoteRecord: {
      list: [],
      total: 0,
    },
    promoteStat: null,
    upgrade_profit_rate: "",
    upgradeLoadingTime: 0,
    comfortSkin: null,
    rechargeWelfareBoxTypeId: 0,
    upgradeSkin: null,
    targetUrl: '/',
  },
  mutations: {
    setTargetUrl(state, url) {
      state.targetUrl = url;
    },
    setUpgradeSkin(state, skin) {
      state.upgradeSkin = skin
    },
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, data) {
      state.user = data;
    },
    setSeed(state, seed: string) {
      state.seed = seed;
    },
    changeOpenBoxAnimationStatus(state, status) {
      state.disableOpenBoxAnimation = status;
    },
    setInviter(state, inviterInfo) {
      state.inviterInfo = inviterInfo;
    },
    setLevelSetting(state, levelSetting) {
      state.levelSetting = levelSetting;
    },
    setPromoteRecord(state, promoteRecord) {
      state.promoteRecord = promoteRecord;
    },
    setPromoteStat(state, stat) {
      state.promoteStat = stat;
    },
    setUpgradeProfitRate(state, val: string) {
      state.upgrade_profit_rate = val;
    },
    setUpgradeLoadingTime(state, loadingTime: number) {
      state.upgradeLoadingTime = loadingTime;
    },
    setComfortSkin(state, skin: SkinItem) {
      state.comfortSkin = skin;
    },
    setRechargeWelfareBoxTypeId(state, val: number) {
      state.rechargeWelfareBoxTypeId = val
    }
  },
  getters: {
    getTargetUrl: (state) => state.targetUrl || null,
    userInfo: (state) => state.user || null,
    userSeed: (state) => state.seed,
    loadingTime: (state) => state.loadingTime,
    disableOpenBoxAnimation: (state) => state.disableOpenBoxAnimation,
    inviterInfo: (state) => state.inviterInfo,
    levelSetting: (state) => state.levelSetting,
    promoteRecord: (state) => state.promoteRecord,
    promoteStat: (state) => state.promoteStat || {},
    upgrade_profit_rate: (state) => state.upgrade_profit_rate,
    upgradeLoadingTime: (state) => state.upgradeLoadingTime,
    comfortSkin: (state) => state.comfortSkin,
    rechargeWelfareBoxTypeId: (state) =>  state.rechargeWelfareBoxTypeId,
  },
  actions: {
    getUserSeed: () => {
      return UserService.seed().then((response) => {
        store.commit("setSeed", response.data.data.user_seed);
        return response;
      });
    },
    getUserInfo: () => {
      return UserService.info().then((response) => {
        store.commit("setUser", response.data.data);
        return response;
      });
    },
    getInviterInfo: () => {
      return UserService.inviterInfo().then((res) => {
        store.commit("setInviter", res.data.data);
        return res;
      });
    },
    getLevelSetting: () => {
      return PromoteService.levelSetting().then((response) => {
        store.commit("setLevelSetting", response.data.data);
      });
    },
    getPromoteRecord: () => {
      return PromoteService.record({
        page: 1,
        page_size: 10
      }).then((response) => {
        store.commit("setPromoteRecord", response.data.data);
      });
    },
    getPromoteStat: () => {
      return PromoteService.stat().then((response) => {
        store.commit("setPromoteStat", response.data.data);
      });
    },
    getUpgradeProfitRate: () => {
      return TopService.getConfig("upgrade_profit_rate").then((response) => {
        let val = "";
        if (response.data.code === 0) {
          val = response.data.data.value;
          store.commit("setUpgradeProfitRate", val);
        }
        return val;
      });
    },
    getRechargeWelfareBoxTypeId: () => {
      return TopService.getConfig("recharge_welfare_box_type_id").then((response) => {
        let val =  Number(response?.data?.data?.value) || 0
        store.commit("setRechargeWelfareBoxTypeId", val)
        return val
      })
    },
    getComfortSkin() {
      return TopService.getConfig("upgrade_comfort_skin_id")
        .then((response) => {
          let val = "";
          if (response.data.code === 0) {
            val = response.data.data.value;
          }
          return val;
        })
        .then((skinId) => {
          if (skinId) {
            return TopService.getSkinDetail(skinId).then((response) => {
              if (response.data.code === 0) {
                const skin = response.data.data;
                store.commit("setComfortSkin", skin);
                return skin;
              }
              throw new Error(response.data);
            });
          }
          throw new Error(`error skin id`);
        });
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}

export function setupStore(app: App<Element>) {
  app.use(store, key);
}
