import { ResponseData } from "@/types";
import { CreateRoomForm, RoomDetail, RoomItem } from "@/types/roll";
import http from "@/utils/http/http";

interface GetRoomListQuery {
  room_no?: number;
  is_join: boolean;
  no_password_room: boolean;
}

export class RollService {
  static getRoomList(query?: GetRoomListQuery, token?: string, params?: {
    page: number;
    page_size: number;
  }) {
    return http.post<ResponseData<{
      list: RoomItem[];
      total: number;
    }>>("/api/freeRoom/list", query, {
      headers: {
        Authorization: token
      },
      params
    })
  }

  static getRoomDetail(id: string | number) {
    return http.get<ResponseData<RoomDetail>>("/api/freeRoom/details", {
      params: {
        free_room_id: id
      },
    })
  }

  static createRoom(data: CreateRoomForm) {
    return http.post<ResponseData>("/api/freeRoom/add", data);
  }

  static addSkin(data: {
    free_room_id: number;
    backpack_id: number;
  }) {
    return http.post("/api/freeRoom/addSkin", data);
  }

  static cancelRoom(roomId: number) {
    return http.post<ResponseData>("/api/freeRoom/cancel", {
      free_room_id: roomId
    });
  }

  static editRoom(data) {
    return http.post("/api/freeRoom/edit", data);
  }

  static joinRoom(data: {
    free_room_id: number;
    password?: string;
  }) {
    return http.post("/api/freeRoom/join", data);
  }
}
