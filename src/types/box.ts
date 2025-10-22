export interface OpenBoxResult {
  backpack_id: number;
  box_id: number;
  cost: number;
  created_at: number;
  id: number;
  image_url: string;
  item_id: string;
  item_name: string;
  price: number;
  public_hash: string;
  round: number;
  updated_at: number;
  user_id: number;
  user_seed: string;
  // 非接口返回
  has_sold?: boolean;
  rarity_color: string;
}

export interface OpenBoxResponse {
  code: number;
  data: OpenBoxResult[];
  msg: string;
  request_id: string;
  timestamp: number;
}

export interface SkinItem {
  app_id: number;
  auto_delivery: number;
  box_id: number;
  created_at: number;
  id: number;
  image_url: string;
  item_id: string;
  item_name: string;
  price: number;
  probability: number;
  show_probability: number;
  rarity_name: string;
  skin_id: number;
  sort: number;
  status: number;
  stock: number;
  type_name: string;
  rarity_color: string;
}

export interface SkinListResponse {
  code: number;
  data: {
    list: SkinItem[];
    total: number;
  };
  msg: string;
  request_id: string;
  timestamp: number;
}
