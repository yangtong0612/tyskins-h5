import http from "@/utils/http/http";

export default class RedenvelopeService {
  static receiveRedEnvelope(data) {
    return http.post("/api/redEnvelope/receive", data);
  }

  static getRedEnvelopeRecord(params) {
    return http.get("/api/redEnvelope/record", { params });
  }

  static getRedEnvelopeList(params) {
    return http.get("/api/redEnvelope/list", { params });
  }

  static getRedEnvelopeDetails(red_envelope_id) {
    return http.get('/api/redEnvelope/details', {
      params: {
        red_envelope_id
      }
    })
  }
}
