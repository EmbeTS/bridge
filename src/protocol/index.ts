import { CFG_BRIDGE_INIT_SEQ } from "../config/packet";
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

    await this.sendPacket(new RequestRestartPacket());
    await this.#waitForSerialInitialized();

    this.#serial!.on(EmbetsSerialEvent.Data, (d: string) =>
      process.stdout.write(d)
    );
  }

  #waitForSerialOpen(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.#serial) throw new Error("Serial not attached");

      this.#serial.on(EmbetsSerialEvent.Open, resolve);
    });
  }

  #waitForSerialInitialized(): Promise<void> {
    let buffer = "";

    return new Promise((res) => {
      const onData = (data: string) => {
        buffer += data;

        if (!buffer.includes(Buffer.from(CFG_BRIDGE_INIT_SEQ).toString()))
          return;

        this.#serial!.off(EmbetsSerialEvent.Data, onData);
        res();
      };

      this.#serial?.on(EmbetsSerialEvent.Data, onData);
    });
  }

  async sendPacket(data: Packet) {
    if (!this.#serial) throw new Error("Serial not attached");

    await this.#serial.send(data.get());
  }
}
