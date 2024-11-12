import {Str, Num} from "chanfana";
import {z} from "zod";

export const Device = z.object({
  id: Str({example: "tz4a98xxAt96iws9zmo1r3j3a"}),
  token: Str({example: "0521441257845151564545"}),
  key: Str({example: "kON2vDisBin2dosYk2"}),
  deleted: Num({example: 0})
});

export const Message = z.object({
  id: Str({example: "tz4a98xxAt96iws9zmo1r3j3a"}),
  token: Str({example: "0521441257845151564545"}),
  title: Str({example: "Hello, World!"}),
  body: Str({example: "This is a test message."}),
  category: Str({example: "test"}),
  payload: Str({example: "This is a test payload."}),
  timestamp: Num({example: 1620000000000})
})
