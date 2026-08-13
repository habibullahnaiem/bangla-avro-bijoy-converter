import { convertToUnicode } from "./client/src/lib/converter";
// ব2য-কোড-মাত্র রান (কোনো মার্কার নেই): 'GLbB' = এখনই
console.log("convertToUnicode('GLbB'):", JSON.stringify(convertToUnicode("GLbB")));
console.log("convertToUnicode('Avwg'):", JSON.stringify(convertToUnicode("Avwg")));
// এগুলো আমাদের pIpelae থেকে আসে না — কিন্তু ইউজার নিজেরা পেস্ট করতে পারে।
// আগের চেকপয়েন্টে (e06b6c7d) আমরা a-z ব2য-অক্ষর-কোড রানও ব2u করতাম নাকি? যাচাই:
// আগে আমরা পুরো-ব2য টেক্সট "Avgvi ‡mvbvi evsjv" (D1–D5 থাকা) টেস্ট করেছিলাম এবাং পাস করেছিল।
// কিন্তু মার্কার-বিহীন পুরো-ব2য টেক্সট ("Avwg" ন্যা) কী হতো?
