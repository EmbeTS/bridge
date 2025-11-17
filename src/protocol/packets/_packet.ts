import { CFG_PCKT_END, CFG_PCKT_START } from "../../config/packet";

export class Packet {
  #id: number;
  #data: string;

  constructor(id: number, data?: string) {
    this.#id = id;
    this.#data = data ?? "";
  }

  get(): Uint8Array {
    return new Uint8Array([
      ...CFG_PCKT_START,
      this.#id,
      ...Buffer.from(this.#data),
      ...CFG_PCKT_END,
    ]);
  }
}
