import { SerialPort } from "serialport";

export enum EmbetsSerialEvent {
  Open = "open",
  Data = "data",
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
    this.#serialport.on("data", this.#onData.bind(this));
  }

  async send(data: Uint8Array) {
    const chunkSize = 64;

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      this.#serialport.write(chunk);

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  #onOpen() {
    this.#emit(EmbetsSerialEvent.Open);
  }

  #onData(data: Buffer) {
    this.#emit(EmbetsSerialEvent.Data, data.toString());
  }

  on(event: EmbetsSerialEvent, listener: Function) {
    if (!this.#eventListeners.has(event)) {
      this.#eventListeners.set(event, []);
    }

    this.#eventListeners.get(event)?.push(listener);
  }

  off(event: EmbetsSerialEvent, listener: Function) {
    const listeners = this.#eventListeners.get(event);
    if (!listeners) return;

    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  #emit(event: EmbetsSerialEvent, ...args: any[]) {
    const listeners = this.#eventListeners.get(event);

    if (!listeners) return;

    for (const listener of listeners) {
      listener(...args);
    }
  }
}
