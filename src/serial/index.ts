import { SerialPort } from "serialport";

export enum EmbetsSerialEvent {
  Open = "open",
}

export class EmbetsSerial {
  #port: string;
  #baudrate: number;
  #serialport: SerialPort;

  #eventListeners: Map<EmbetsSerialEvent, Function[]> = new Map();

  constructor(port: string, baudrate: number) {
    this.#port = port;
    this.#baudrate = baudrate;
    this.#serialport = new SerialPort({
      path: this.#port,
      baudRate: this.#baudrate,
    });

    this.#serialport.on("open", this.#onOpen.bind(this));
  }

  #onOpen() {
    this.#emit(EmbetsSerialEvent.Open);
  }

  on(event: EmbetsSerialEvent, listener: Function) {
    if (!this.#eventListeners.has(event)) {
      this.#eventListeners.set(event, []);
    }

    this.#eventListeners.get(event)?.push(listener);
  }

  #emit(event: EmbetsSerialEvent, ...args: any[]) {
    const listeners = this.#eventListeners.get(event);

    if (!listeners) return;

    for (const listener of listeners) {
      listener(...args);
    }
  }
}
