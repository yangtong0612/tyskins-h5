export interface WebsocketMessageResponse {
  code: number;
  data: any;
  msg: string;
}

export interface WebsocketMessage {
  cmd: string;
  response: WebsocketMessageResponse;
  seq: string;
}

export enum MessageAction {
  ping = "ping",
  scrollCard = "scrollCard",
  BattleJoin = "battle_join",
  BattleStart = "battle_start",
  BattleRounds = "battle_rounds",
  BattleEnd = "battle_end",
  BattleNewRoom = "battle_room",
  BattleTimeout = "battle_timeout",
}
