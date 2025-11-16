import { CFG_PCKT_START } from "../../config/packet";

export class Packet {
  #id: number;

  constructor(id: number) {
    this.#id = id;
  }

  get(): Uint8Array {
    return new Uint8Array([...CFG_PCKT_START, this.#id]);
  }
}
