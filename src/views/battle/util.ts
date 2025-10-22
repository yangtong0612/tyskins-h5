import { BattleUserInfo } from "./services"
import robotAvatar from "@/assets/img/battle/robot-avatar.jpg";

export const status2str = (status: number) => {
  switch (status) {
    case -1:
      return "超时"
    case 0:
      return "等待中"
    case 1:
      return "进行中"
    case 2:
      return "已结束"
    default:
      return "-"
  }
}

export const processRobot = (data: BattleUserInfo) => {
  if (data.user_id === 0) {
    data.nickname = "Ai";
    data.avatar = robotAvatar;
  }
  return data;
}

export const processScore = (score) => {
	if(!score) return;
  return score > 1000 ? Number((score / 1000)?.toFixed(1)) + 'k' : Number(score.toFixed(1));
}
