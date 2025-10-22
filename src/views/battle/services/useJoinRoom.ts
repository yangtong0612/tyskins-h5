import { emitter } from "@/libs";
import BattleService from "@/services/BattleService";
import { useStore } from "@/store";
import { ElMessageBox } from "element-plus";

const joinRoom = (id: number, seatNumber: number, isRobot: boolean) => {
  return BattleService.joinRoom({
    seat_no: seatNumber,
    room_id: id,
    is_robot: isRobot,
  });
};

export const useJoinRoom = () => {
  const store = useStore();

  return async (id: number, seatNumber: number, price: number, isRobot = false) => {
    return new Promise((resolve, reject) => {
      const userInfo = store.getters.userInfo;

      if (!userInfo) {
        emitter.emit("login");
        return reject();
      }

      const join = () => {
        return joinRoom(id, seatNumber, isRobot).then(resolve).catch(reject);
      }

      ElMessageBox.confirm(isRobot ? '确定邀请AI对战吗？' : `是否确认消耗${price.toFixed(2)}硬币加入该房间？`, '提示', {
        customClass: "custom-message-box",
        lockScroll: false,
      }).then(() => {
        return join();
      }).catch(reject);
    })
  }
}
