export interface RoomItem {
  audit_status: number;
  avatar: string;
  award_num: number;
  created_at: number;
  id: number;
  is_password_room: boolean;
  join_level: number;
  join_num: number;
  lottery_status: number;
  lottery_time: number;
  nickname: string;
  prize_num: number;
  prize_pool: number;
  recharge_amount: number;
  recharge_end_time: number;
  recharge_start_time: number;
  reject_reason: string;
  room_desc: string;
  room_name: string;
  room_type: number;
  start_time: number;
  status: number;
  updated_at: number;
  user_id: number;
}

export interface RoomDetail {
  // 0: 未审核 1: 审核通过 2: 审核失败
  audit_status: number;
  avatar: string;
  award_num: number;
  created_at: number;
  id: number;
  is_password_room: boolean;
  join_level: number;
  join_num: number;
  join_users: any[];
  // 0: 未开奖 1: 已开奖
  lottery_status: number;
  lottery_time: number;
  nickname: string;
  prize_num: number;
  prize_pool: number;
  recharge_amount: number;
  recharge_end_time: number;
  recharge_start_time: number;
  reject_reason: string;
  room_desc: string;
  room_name: string;
  room_type: number;
  skin_list: any[];
  start_time: number;
  status: number; // 0: 正常 1: 禁用
  updated_at: number;
  user_id: number;
  winning_users: any[];
  max_join_num: number;
}

export interface CreateRoomForm {
  room_name: string;
  room_desc: string;
  room_pass: string;
  max_join_num: number;
  start_time: number | string;
  lottery_time: number | string;
  recharge_amount: number | string;
  recharge_start_time: number | string;
  recharge_end_time: number | string;
  is_promotion: number;
}
