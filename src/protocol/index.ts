import { EmbetsSerialEvent, type EmbetsSerial } from "../serial";
import type { Packet } from "./packets/_packet";
import { RequestRestartPacket } from "./packets/RequestRestartPacket";

export class EmbetsProtocol {
  #serial?: EmbetsSerial;

  constructor() {}

  attachSerial(serial: EmbetsSerial) {
    this.#serial = serial;
  }

  async initialize(): Promise<void> {
    await this.#waitForSerialOpen();
    this.#sendPacket(new RequestRestartPacket());
  }

  #waitForSerialOpen(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.#serial) throw new Error("Serial not attached");

      this.#serial.on(EmbetsSerialEvent.Open, resolve);
    });
  }

  #sendPacket(data: Packet): void {
    if (!this.#serial) throw new Error("Serial not attached");

    this.#serial.send(data.get());
  }
}
