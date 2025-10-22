import http from "@/utils/http/http";

export default class TaskService {
  static dailyTaskMyList(params) {
    return http.get("/api/dailyTask/my-list", { params });
  }

  static dailyTaskList(params) {
    return http.get("/api/dailyTask/list", { params });
  }

  static receiveDailyTask(data) {
    return http.post("/api/dailyTask/receive", data);
  }

}