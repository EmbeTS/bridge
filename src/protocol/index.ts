import { EmbetsSerialEvent, type EmbetsSerial } from "../serial";

export class EmbetsProtocol {
  #serial?: EmbetsSerial;

  constructor() {}

  attachSerial(serial: EmbetsSerial) {
    this.#serial = serial;
  }

  async initialize(): Promise<void> {
    await this.#waitForSerialOpen();
  }

  #waitForSerialOpen(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.#serial) throw new Error("Serial not attached");

      this.#serial.on(EmbetsSerialEvent.Open, resolve);
    });
  }
}
