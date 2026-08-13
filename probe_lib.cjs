const { bijoyToUnicode } = require("@abdalgolabs/ansi-unicode-converter");
console.log("bijoyToUnicode('GLbB'):", JSON.stringify(bijoyToUnicode("GLbB")));
console.log("bijoyToUnicode('GwU'):", JSON.stringify(bijoyToUnicode("GwU")));
console.log("bijoyToUnicode('†ij GLbB Avm‡e'):", JSON.stringify(bijoyToUnicode("†ij GLbB Avm‡e")));
