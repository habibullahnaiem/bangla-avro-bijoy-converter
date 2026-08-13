const { bijoyToUnicode } = require("@abdalgolabs/ansi-unicode-converter");
console.log("1:", JSON.stringify(bijoyToUnicode("GLbB")));
console.log("2:", JSON.stringify(bijoyToUnicode("GLbB Avm‡e")));
console.log("3:", JSON.stringify(bijoyToUnicode("GLbB‡ij")));
