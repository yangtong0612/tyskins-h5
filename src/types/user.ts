export interface UserSeedResponse {
  round: number;
  user_seed: string;
}

export interface UserRetrievRecord {
  auto_delivery: number;
  avatar: string;
  backpack_id: number;
  buy_price: number;
  created_at: number;
  deliver_status: number;
  id: number;
  image_url: string;
  item_id: string;
  item_name: string;
  mobile: string;
  nickname: string;
  num: number;
  offer_id: string;
  order_id: string;
  order_no: string;
  price: number;
  status: number;
  trade_time: number;
  trade_url: string;
  updated_at: number;
  user_id: number;
}

export interface UserRetrievRecordResponse {
  list: UserRetrievRecord[];
  total: number;
}

export interface InviterInfo {
  avatar: string;
  coin: number;
  created_at: number;
  diamond: number;
  email: string;
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
}

export interface LevelSettingData {
  created_at: number;
  id: number;
  level: number;
  num: number;
  rebate_rate: number;
}

export interface PromoteRecord {
  created_at: number;
  id: number;
  invitees_id: number;
  inviter_id: number;
  rebate_total: number;
  source: string;
  updated_at: number;
}

export interface PromoteStat {
  created_at: number;
  id: number;
  level: number;
  num: number;
  rebate_current: number;
  rebate_rate: number;
  rebate_total: number;
  recharge: number;
  updated_at: number;
  user_id: number;
}

export interface BackpackSkinItem {
  app_id: number;
  created_at: number;
  exterior: string;
  exterior_name: string;
  id: number;
  image_url: string;
  item_id: string;
  item_name: string;
  market_hash_name: string;
  price: number;
  rarity_color: string;
  skin_id: number;
  status: number;
  updated_at: number;
}
