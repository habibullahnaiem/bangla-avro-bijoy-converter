// টোকেন-লেভেল টেস্ট: কোন টোকেন ব2য-কোড নাকি ইংরেজি?
// নিয়ম: (ক) টোকেনে †/‡/v/w থাকলে → নিশ্চিত ব2য;
// (খ) টোকেন সম্পূর্ণ ছোটহাতের এবাং লম্বা (≥2) → ব2য (ইংরেজি শব্দ space-রানে আলাদা, মার্কার-রানে এটা দুর্লভ);
// (গ) টোকেনে ক্যাপিটাল শুধু শুরুতে এবাং বাকীতে ব2য-কোড/ডায়াক্রিটিক → ব2য;
// (ঘ) অন্যথা → লিটারেল-ইংরেজি।
const DIACRITIC = /[vw\/\u2020\u2021]/; // v=ো, w=ৌ; / বযবহার না হওয়ায় রাখা হলো

function classifyToken(tok: string): "bijoy" | "english" {
  if (DIAKRITIC_TEST(tok)) return "bijoy";
  return "english";
}
const DIAKRITIC_TEST = (s: string) => DIACRITIC.test(s);

const tests = [
  "Avwg", "evsjv", "mvbvi", "The", "quick", "brown", "GB", "e", "GwU", "Zvgvq",
];
for (const t of tests) console.log(t, "→", classifyToken(t));
