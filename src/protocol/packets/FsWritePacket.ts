import { Packet } from "./_packet";

export class FsWritePacket extends Packet {
  static #PCKT_ID = 0x33;

  constructor(path: string, data: string) {
    super(FsWritePacket.#PCKT_ID, [path, data].join(";"));
  }
}
