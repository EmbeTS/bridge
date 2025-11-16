import { EmbetsBridge } from "../src";

const bridge = new EmbetsBridge();
await bridge.connect("/dev/ttyUSB0", 115200);
