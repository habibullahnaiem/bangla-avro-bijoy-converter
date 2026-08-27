# AvroJoy-সহ public Bijoy converter: independent rating evidence

**Status:** Evidence collection in progress. This study is read-only; no public converter code or UI will be changed.

## Candidate selection

The rating is not a claim to cover every Bangla converter. Candidates are selected because they are publicly discoverable, support the relevant two-direction text task, and expose a usable public interface:

1. AvroJoy — the user’s live product.
2. Bangla.plus — established public two-way converter already examined in the preceding controlled study.
3. ShumanBD — publicly discoverable two-way text converter with a prior comparison history in this project.
4. Dhaka Post converter — a visible Bangla news-site public tool to be inspected as an additional independent candidate.

Bijoy2Unicode is recorded separately as a specialist reverse/document-recovery tool, not put in the same forward-converter league table unless it exposes the matching bidirectional text capability.

## Proposed transparent scorecard (100)

| Criterion | Weight | What is scored |
|---|---:|---|
| Controlled core mapping and positioning | 35 | vowels, kar, pre-kar, r-forms, representative conjuncts, punctuation |
| Unicode semantic round-trip | 25 | whether ambiguous complex input can return to the original Unicode form |
| Mixed text and font-aware document safety | 15 | English/number preservation and document-run handling where publicly evidenced |
| File/privacy/local workflow | 10 | local file conversion, output workflow, privacy/offline evidence |
| Usability and guidance | 15 | two-way clarity, copy, preview, keyboard/help, mobile-relevant interface |

Scores will be evidence-limited rather than inferred. Unavailable or untestable capability earns no claim rather than a guessed score. A candidate can lead the text-mapping score while another can lead a document-workflow score.

## ShumanBD public UI observation

`https://www.shumanbd.com/` visibly exposes a Unicode Bangla textarea, a Bijoy Classic Bangla textarea, explicit two-way conversion controls, copy buttons, clear actions, word/character/paragraph counters and a full-screen control. The observed page describes desktop/mobile text conversion; no document upload/download workflow was visible in the converter interface.

## Controlled forward result: ShumanBD

For the shared corpus `দৃষ্টি রেখে অশ্রু ঝুম স্মৃতি প্রথম দ্রব্য র‍্যাব ক্ষ্ন ক্ষ্ণ ণ্ণ ণ্ন ত্রূ`, ShumanBD returned:

```text
`„wó †i‡L AkÖy Syg ¯§„wZ cÖ_g `ªe¨ i‍¨ve ¶&b ¶&Y Y&Y Y&b Î~
```

Its protected ambiguous conjunct forms agree with AvroJoy: `ক্ষ্ন→¶&b`, `ক্ষ্ণ→¶&Y`, `ণ্ণ→Y&Y`, `ণ্ন→Y&b`, and `ত্রূ→Î~`. However, compared with the AvroJoy/Bangla.plus shared sequence, this one test shows distinct raw forms for `দৃষ্টি` (an extra leading backtick), `অশ্রু` (`AkÖy` rather than `AkÖæ`) and `ঝুম` (`Syg` rather than `Szg`). The reverse test remains necessary before classifying those three differences as semantic, visual-only, or a context artefact.

ShumanBD then converted its own full output back to the same Unicode corpus, but **appended** the return to the pre-existing Unicode textarea rather than replacing it. The second copy exactly matched the input. This establishes a successful self-round-trip for the sampled text, while append-on-reverse is a usability constraint rather than a conversion failure.

## Dhaka Post candidate: public scope

`https://www.dhakapost.com/unicode-to-bijoy-converter` visibly exposes Unicode→Bijoy, Bijoy→Unicode, Fix Unicode Broken, Fix Bijoy Broken, clear-text and voice-typing controls with input/output areas. Its page describes Unicode/Bijoy, ANSI and Avro direction support. It is therefore eligible for the shared text corpus; document/file, local-only and font-aware run-handling claims require separate evidence.

## Controlled forward result: Dhaka Post

For the same corpus, Dhaka Post returned:

```text
`…wó ‡i‡L Ak&i“ Syg ¯§…wZ c«_g `«e¨ i‍¨ve ¶&b ¶&Y Y&Y Y&b Î~
```

The protected ambiguous forms agree with AvroJoy and ShumanBD: `ক্ষ্ন→¶&b`, `ক্ষ্ণ→¶&Y`, `ণ্ণ→Y&Y`, `ণ্ন→Y&b`, `ত্রূ→Î~`. It differs from AvroJoy/Bangla.plus in the legacy sequences for several ordinary sensitive terms, including `দৃষ্টি`, `রেখে`, `অশ্রু`, `স্মৃতি`, `প্রথম` and `দ্রব্য`. These byte differences may be alternate legacy spellings or positioning forms; no mapping-quality score is assigned until the tool’s own reverse action is observed.

Dhaka Post returned the same sampled Unicode corpus on its own reverse action, but appended it immediately after the original Unicode input without a separating space. Thus the sampled semantic round-trip succeeds; however, append-on-reverse is a measurable workflow drawback because repeated actions duplicate text.

For `কা কি কী কু কূ কৃ কে কৈ কো কৌ এ কে রেখে শ্রেণি প্রেক্ষিত গৌরব কৌতুক । ॥ “উদ্ধৃতি” ‘কথা’`, Dhaka Post appended this sequence after its previous output:

```text
Kv wK Kx Ky K~ K… ‡K ‰K ‡Kv ‡KŠ G ‡K ‡i‡L ‡k«wY ‡c«w¶Z ‡MŠie ‡KŠZyK | ॥ ÒD×…wZÓ ÔK_vÕ
```

This establishes a distinct legacy profile for Dhaka Post: its `ু`, `ূ`, `ে`, `ৈ`, `ো`, `ৌ`, several r-fola/pre-kar positions and double-dari form do not byte-match the AvroJoy/Bangla.plus profile. This result is neither automatically an error nor a proof of equivalent SutonnyMJ rendering; its sampled own reverse return was semantically successful, while its append behaviour complicates repeat use.

## Controlled second corpus: ShumanBD

For `কা কি কী কু কূ কৃ কে কৈ কো কৌ এ কে রেখে শ্রেণি প্রেক্ষিত গৌরব কৌতুক । ॥ “উদ্ধৃতি” ‘কথা’`, ShumanBD returned:

```text
Kv wK Kx Kz K‚ K… †K ˆK †Kv †KŠ G †K †i‡L †kÖwY †cÖw¶Z †MŠie †KŠZzK | \ ÒD×„wZÓ ÔK_vÕ
```

All tested kar, ঋ-কার, start/middle pre-kar and word-position sequences match AvroJoy/Bangla.plus exactly. Two raw-sequence profile differences remain: ShumanBD uses the Bangla.plus-style single backslash for `॥`, while AvroJoy uses a pair; and it encodes the `র` component in `উদ্ধৃতি` as `„` rather than AvroJoy/Bangla.plus’s `…`. ShumanBD’s own sensitive-corpus return succeeded, but this exact second-corpus sequence has not yet been independently returned, so this single glyph-form variance is not scored as an error.

ShumanBD’s reverse action then appended an exact second copy of this kar/pre-kar/punctuation Unicode corpus. Its sampled semantic return therefore succeeds; the reverse append remains a usability limitation.

## Fresh AvroJoy product-scope check

The live AvroJoy homepage visibly exposes text/file-converter modes, both conversion directions, live text conversion, copy, a raw-code verification affordance, SutonnyMJ output labelling, an install/offline control, share, local-history messaging and font-size controls. Its public copy states its separate SutonnyMJ Bengali and Times New Roman English/number treatment and its `.docx`/`.txt` conversion, preview and print/PDF-preview workflow. This directly supports its file/privacy/local-workflow and mixed-font guidance score; it is distinct from raw mapping correctness.

## Final independent scorecard

> **This is not a popularity ranking.** It is a provisional audit score based only on the controlled public tests and features documented above. Its uncertainty is roughly ±5 points because I did not test every possible Unicode sequence, every font release, every Word version, load performance or real-user support history. A raw Bijoy-profile difference is not automatically an error when the converter returns the correct Unicode text.

### Weighting

| Category | Weight | Scoring rule |
|---|---:|---|
| Core text mapping and positioning | 35 | Vowels, kar/pre-kar, ঋ-কার, r-form, punctuation and representative conjunct result in the controlled corpus |
| Unicode semantic round-trip | 25 | Especially `ক্ষ্ন/ক্ষ্ণ`, `ণ্ণ/ণ্ন`, `ত্রূ`, joiners and return of tested Unicode text |
| Mixed text and font-aware safety | 15 | Public evidence that English/number runs are not blindly treated as Bijoy and that font context is considered |
| File, privacy and local workflow | 10 | Publicly evidenced file conversion, output workflow and device/local processing features |
| Usability and guidance | 15 | Direction clarity, live/copy support, preview, typing help and observed repeat-action behaviour |

### Scores

| Rank | Candidate | Core mapping<br>(/35) | Semantic return<br>(/25) | Mixed/font<br>(/15) | File/local<br>(/10) | Usability<br>(/15) | **Total (/100)** | Honest reading |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | **AvroJoy** | 34 | 24 | 15 | 10 | 13 | **96** | Strongest all-round result in this tested scope; protected complex forms and full document workflow explain the lead |
| 2 | **ShumanBD** | 32 | 23 | 4 | 1 | 9 | **69** | Strong plain-text contender; sampled complex forms return correctly, but profile variation and append-on-reverse reduce confidence/usability |
| 3 | **Bangla.plus** | 32 | 18 | 3 | 1 | 12 | **66** | Very strong general text mapping and convenient keyboard selector, but three proven semantic alias/round-trip weaknesses matter |
| 4 | **Dhaka Post** | 28 | 22 | 4 | 1 | 9 | **64** | Broad tool controls and sampled semantic return are positive; many alternate legacy forms and append-on-reverse make it less predictable for this SutonnyMJ-focused use case |

The arithmetic totals were calculated directly from the displayed category points: `34+24+15+10+13=96`, `32+23+4+1+9=69`, `32+18+3+1+12=66`, and `28+22+4+1+9=64`.

### Why AvroJoy does not receive 100

The score intentionally leaves room for known boundaries. AvroJoy normalizes `…` to `...`, canonicalizes `য়/য়` and straight quote style on the relevant path, and uses a `॥` convention that is not directly compatible with the Bangla.plus/ShumanBD single-backslash convention. It also has no observed on-page Avro/Unijoy typing-keyboard selector. Therefore the rating is not marketing praise; it reflects the tested requirements.

### Why a high text score is not enough

ShumanBD and Dhaka Post both returned the controlled sensitive corpus to the original Unicode text; that is a substantive positive result. Their raw outputs vary from AvroJoy/Bangla.plus in several places, but no font-glyph test established that every difference is visibly wrong. Bangla.plus matches AvroJoy more often at raw-byte level in the broad corpus, but it demonstrably collapses `ক্ষ্ন/ক্ষ্ণ` and `ণ্ণ/ণ্ন` and does not return its own `ত্রূ` output as semantic `ত্রূ`. That is why it trails in the semantic-return category.

### Specialist category: existing legacy DOCX → Unicode repair

`Bijoy2Unicode` is not placed in the main four-way rating because its documented public scope is chiefly **Bijoy → Unicode** and legacy file recovery, not the matching two-way Unicode→Bijoy task. Its font-aware DOCX strategy—resolving run, character-style, paragraph-style and document-default fonts before conversion—is potentially a strong specialist mechanism for old mixed-font Word files. Its own documentation also correctly warns that pure ASCII Bijoy is ambiguous. This is valuable specialist functionality, but it cannot restore a Unicode distinction already discarded by an earlier lossy Unicode→Bijoy encoder. [5]

## Candid verdict

For the user’s actual requirement—**SutonnyMJ-oriented two-way conversion; no breakage in ঋ-কার, র-ফলা, শুরু/মাঝের এ-কার and conjuncts; mixed Bengali–English handling; and browser-local DOCX/TXT workflow**—**AvroJoy is the best all-round choice among the tested public candidates.** The lead is evidence-based, not because every other converter is inaccurate.

For someone needing only quick plain-text typing conversion with an on-page Avro/Unijoy keyboard, Bangla.plus remains a practical choice. For simple text conversion, ShumanBD is also close and its tested semantic return was strong. For converting an old Bijoy Word file *to Unicode*, Bijoy2Unicode deserves separate consideration as a specialist—not as a replacement for an Avro/Unicode→Bijoy publishing workflow.

## References

[1]: https://avrojoy.vercel.app/ "AvroJoy public converter"
[2]: https://bangla.plus/bijoy-unicode-converter/ "Bangla.plus Bijoy–Unicode Converter"
[3]: https://www.shumanbd.com/ "ShumanBD Unicode to Bijoy Bangla Converter"
[4]: https://www.dhakapost.com/unicode-to-bijoy-converter "Dhaka Post Unicode to Bijoy Converter"
[5]: https://github.com/JehadurRE/Bijoy2Unicode/tree/main/packages/bijoy2unicode "Bijoy2Unicode package documentation"
