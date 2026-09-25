import { WebsocketMessageDTO } from "../models/Websocket";

export enum WebSocketState {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTING = "DISCONNECTING",
  ERROR = "ERROR",
}

type MessageHandler = (message: WebsocketMessageDTO) => void;
type StateHandler = (state: WebSocketState) => void;

class WebSocketManager{
  private socket: WebSocket | null = null;

  private handlers = new Set<MessageHandler>();
  private stateHandlers = new Set<StateHandler>();

  private url = "";
  
  private _state: WebSocketState = WebSocketState.DISCONNECTED;
  
  private setState(state: WebSocketState) {
    this._state = state;

    for (const handler of this.stateHandlers) {
      handler(state);
    }
  }
   get state(): WebSocketState {
    return this._state;
  }
  connect(url : string){
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }
    this.url = url;

    const socket = new WebSocket(url);
    this.setState(WebSocketState.CONNECTING);
    this.socket = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      this.setState(WebSocketState.CONNECTED);
    };
    socket.onmessage = (event) => {
      try {
        const message : WebsocketMessageDTO = JSON.parse(event.data);

        for (const handler of this.handlers) {
          handler(message);
        }
      } catch (error) {
        console.error("Invalid WebSocket message", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.socket = null;
      this.setState(WebSocketState.DISCONNECTED);

    };

    socket.onerror = (error) => {
      console.error("WebSocket error", error);
      this.setState(WebSocketState.ERROR);
    };

  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    this.setState(WebSocketState.DISCONNECTING);
    this.socket?.close();
    this.socket = null;
  }

  send(message: WebsocketMessageDTO) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    }

    this.socket.send(JSON.stringify(message));
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
}

   subscribeState(handler: StateHandler) {
    this.stateHandlers.add(handler);

    // Immediately give the subscriber the current state.
    handler(this._state);

    return () => {
      this.stateHandlers.delete(handler);
    };
  }
}

  export const webSocketManager = new WebSocketManager();
