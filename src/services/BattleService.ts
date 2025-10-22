import request from "@/utils/http/http";
import { IHttpResponse } from "@/utils/http/IHttpResponse";

export default class BattleService {
  static createRoom(data: {
    num: number;
    box_ids: number[];
  }): Promise<IHttpResponse> {
    return request.post("/api/battle/room", data);
  }

  static roomDetail(id: string) {
    return request.get("/api/battle/room/details", {
      params: {
        room_id: id
      }
    })
  }

  static joinRoom(data: {
    seat_no: number;
    room_id: number;
    is_robot: boolean;
  }) {
    return request.post("/api/battle/room/join", data);
  }

  static roomList(query: {
    keyword?: string;
    status?: number;
    page: number;
    page_size: number;
  }) {
    return request.get("/api/battle/room/list", {
      params: query
    })
  }

  static runking(query: {
    date: string;
    size: number;
  }) {
    return request.get("/api/battle/ranking", {
      params: query
    })
  }

  static myHistory(query: {
    page: number;
    page_size: number;
  }) {
    return request.get("/api/battle/my-record", {
      params: query
    })
  }

  static allHistory(query: {
    page: number;
    page_size: number;
  }) {
    return request.get("/api/battle/record", {
      params: query
    })
  }

  static boxAllSkin(query: {
    page: number;
    page_size: number;
  }) {
    return request.get("/api/box/skin/all", {
      params: query
    })
  }
}
