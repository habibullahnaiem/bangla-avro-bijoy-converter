
import {
  convert,
  convertToBijoy,
  convertToUnicode,
  segmentBijoyText,
  mapSegmentsToBijoy,
} from "./client/src/lib/converter.ts";
globalThis.convert = convert;
globalThis.convertToBijoy = convertToBijoy;
globalThis.convertToUnicode = convertToUnicode;
globalThis.segmentBijoyText = segmentBijoyText;
globalThis.mapSegmentsToBijoy = mapSegmentsToBijoy;
