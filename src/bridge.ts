import { EmbetsProtocol } from "./protocol";
import { FsWritePacket } from "./protocol/packets/FsWritePacket";
import { RequestRestartPacket } from "./protocol/packets/RequestRestartPacket";
import { EmbetsSerial } from "./serial";

export class EmbetsBridge {
  #serial?: EmbetsSerial;
  #protocol: EmbetsProtocol = new EmbetsProtocol();

  constructor() {}

  async connect(port: string, baudrate: number): Promise<void> {
    const serial = new EmbetsSerial(port, baudrate);
    this.#serial = serial;
    this.#protocol.attachSerial(serial);

    return await this.#protocol.initialize();
  }

  async fsWrite(path: string, data: string): Promise<void> {
    this.#protocol.sendPacket(new FsWritePacket(path, data));
  }

  async osRestart(): Promise<void> {
    this.#protocol.sendPacket(new RequestRestartPacket());
  }
}
