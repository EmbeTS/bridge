import { Packet } from "./_packet";

export class RequestRestartPacket extends Packet {
  static #PCKT_ID = 0x32;

  constructor() {
    super(RequestRestartPacket.#PCKT_ID);
  }
}
