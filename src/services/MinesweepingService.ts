import http from "@/utils/http/http";

export default class SignService {
    static getRecord(params) {
      return http.get("/api/minesweeping/record/list", {
        params
      })
    }
    static getMyRecord(params) {
      return http.get("/api/minesweeping/my-record/list", {
        params
      })
    }

    static getGroup(params) {
      return http.get("/api/minesweeping/group/list", {
        params
      })
    }
    static getGroupSkin(id) {
      return http.get("/api/minesweeping/group/skin", {
        params: {
          group_id: id
        }
      })
    }
    static createRoom(data) {
      return http.post("/api/minesweeping/room/create", data);
    }
    static start(data) {
      return http.post("/api/minesweeping/start", data);
    }
    
    static end(data) {
      return http.post("/api/minesweeping/surrender", data);
    }

    
    

  }