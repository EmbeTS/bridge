import { EmbetsProtocol } from "./protocol";
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
}
