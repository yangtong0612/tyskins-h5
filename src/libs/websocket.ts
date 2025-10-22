import { emitter } from "./mitt";
import { WebsocketMessage, MessageAction, WebsocketMessageResponse } from "@/types";

const url = import.meta.env.VITE_WSS_URL;

class WebSocketClient {
  private connected = false;
	private ws?: WebSocket;
	private firstConnect = true;
	private heartbeatTimer = -1;
	private reconnectTimer = -1;

  public connect() {
    if (this.connected) return;

    const ws = new WebSocket(url);
		this.ws = ws;

    ws.onopen = () => {
			console.log("已建立连接");
      this.connected = true;
			this.openHeartbeat();

			if (this.firstConnect) {
				this.firstConnect = false;
				this.getOpenBoxList();
			}
    };

    ws.onmessage = (event) => {
      this.onMessage(JSON.parse(event.data));
    };

		ws.onerror = (err) => {
			this.connected = false;
			this.stopHeartbeat();
			console.log("websocket error: ", err);
			this.reconnect();
		}

		ws.onclose = (event) => {
			this.stopHeartbeat();
			this.connected = false;
			console.log("websocket closed", event);
			this.reconnect();
		}
  }

  private onMessage(data: WebsocketMessage) {
    const { cmd, response } = data;

    if (cmd === MessageAction.scrollCard) {
			this.onOpenBox(response);
			return;
    }

		if (response) {
			if (response.code === 0) {
				emitter.emit(cmd, response.data);
			} else {
				console.error("websocket response error", response);
			}
		}
  }

  private onOpenBox(response: WebsocketMessageResponse, errorCount = 0) {
		if (response.code !== 0) {
			// warning
			console.log("websocket message 状态异常(on open box)", response);
			return;
		}

		if (window.openBoxEventStatus) {
			emitter.emit(MessageAction.scrollCard, response.data);
		} else {
			setTimeout(() => {
				console.log("wait..");
				this.onOpenBox(response, errorCount + 1);
			}, errorCount >= 10 ? 1000 : 100);
		}
	}

	private forward(data: WebsocketMessage) {
		const { cmd, response } = data;
	}

	private getOpenBoxList() {
		this.sendMessage({
			cmd: MessageAction.scrollCard,
			data: {
				limit: 30,
			}
		})
	}

	private sendMessage(message: {
		cmd: MessageAction;
		data?: any;
	}) {
		if (!this.ws) {
			console.error("sendMessage: ws实例不存在");
			return;
		}

		if (this.ws.readyState !== this.ws.OPEN) {
			console.error("sendMessage: ws状态异常: " + this.ws.readyState);
			return;
		}

		if (message.cmd !== MessageAction.ping) {
			this.resetHeartbeat();
		}

		this.ws.send(JSON.stringify({
			...message,
			seq: this.generatorSeq(),
		}));
	}

	private generatorSeq() {
		// 13位时间戳 + 随机五位数
		const timestamp = Math.floor(Date.now() / 1000);
		const randomNumber = Math.random().toString().slice(2, 7);
		return timestamp + randomNumber;
	}

	private reconnect() {
		console.log("5秒后重连");
		clearTimeout(this.reconnectTimer);
		this.reconnectTimer = setTimeout(() => {
			console.log("开始重连");
			this.connect();
		}, 1000 * 5);
	}

	private openHeartbeat() {
		this.heartbeatTimer = setInterval(() => {
			this.sendMessage({
				cmd: MessageAction.ping,
			})
		}, 1000 * 10);
	}

	private stopHeartbeat() {
		clearTimeout(this.heartbeatTimer);
	}

	private resetHeartbeat() {
		this.stopHeartbeat();
		this.openHeartbeat();
	}
}

export const websocketClient = new WebSocketClient();
