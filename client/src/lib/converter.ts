/*
 * ডিজাইন দিক: টিল ডেস্ক — কনভার্টার ইঞ্জিন
 * অভ্র/ইউনিকোড ⇄ বিজয় (সুতন্নী এমজে) রূপান্তর পরিষেবা।
 * ইনপুট ফন্ট: সোলাইমান লিপি / কালপুরুষ (হিন্দ সিলিগুড়ি দিয়ে প্রিভিউ)
 * আউটপুট ফন্ট: SutonniMJ; ইংরেজি অংশে Times New Roman ফলব্যাক।
 * ন্ত, ল্ল, য়, ড়, ঢ়, র-ফলা, রেফ, জ্ঞ, ক্ষ, শ্র এবং দাঁড়ি (।) সঠিকভাবে রূপান্তরিত হয়।
 */
import {
  unicodeToBijoy as libUnicodeToBijoy,
  bijoyToUnicode as libBijoyToUnicode,
} from "@abdalgolabs/ansi-unicode-converter";

export type ConvertDirection = "u2b" | "b2u";

export function convertToBijoy(text: string): string {
  return libUnicodeToBijoy(text);
}

export function convertToUnicode(text: string): string {
  return libBijoyToUnicode(text);
}

export function convert(text: string, direction: ConvertDirection): string {
  if (direction === "u2b") return convertToBijoy(text);
  return convertToUnicode(text);
}
