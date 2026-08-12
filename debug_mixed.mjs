import { build } from "esbuild";
import { JSDOM } from "jsdom";
import JSZip from "jszip";
import { writeFileSync } from "fs";

await build({
  entryPoints: ["client/src/lib/converter.ts"],
  bundle: true, format: "esm", outfile: "/home/ubuntu/conv_debug.mjs",
  platform: "browser", target: "es2022",
});
const mod = await import("/home/ubuntu/conv_debug.mjs");
const NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const dom = new JSDOM("");
globalThis.DOMParser = dom.window.DOMParser;
globalThis.XMLSerializer = dom.window.XMLSerializer;

function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
const docXml = '<w:document xmlns:w="'+NS+'"><w:body><w:p>'+
  ['রেল schedule 12:45'].map(r=>`<w:r><w:rPr><w:rFonts w:ascii="Kalpurush"/></w:rPr><w:t>${esc(r)}</w:t></w:r>`).join('')+
  '</w:p></w:body></w:document>';
const zip = new JSZip();
zip.file('[Content_Types].xml', `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="app"/></Types>`);
zip.file('_rels/.rels', `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="od/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
zip.file('word/_rels/document.xml.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>');
zip.file('word/document.xml', docXml);
const buf = await zip.generateAsync({type:'arraybuffer'});
const file = new File([buf],'test.docx',{type:'app/vnd.openxmlformats-officedocument.wordprocessingml.document'});
const res = await mod.convertFile(file, 'u2b');
const zip2 = await JSZip.loadAsync(await res.blob.arrayBuffer());
const xml = await zip2.file('word/document.xml').async('string');
writeFileSync('/home/ubuntu/debug_mixed_out.xml', xml);
const doc = new DOMParser().parseFromString(xml,'text/xml');
const runs = Array.from(doc.getElementsByTagNameNS(NS,'r'));
for (const r of runs){
  const rf = r.querySelector('rFonts');
  const t = (r.querySelector('t')?.textContent)||'';
  console.log(JSON.stringify(t), '=>', rf?.getAttribute('w:ascii'));
}
