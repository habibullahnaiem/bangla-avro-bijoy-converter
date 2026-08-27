# Mixed Bangla–English rich-copy diagnosis

**Status:** তদন্ত চলছে; production behaviour এখনও বদলানো হয়নি।

## User-supplied screenshot evidence

The first 763×174 screenshot was inspected in two overlapping left-to-right crops. The red-boxed English run does not appear as `Bangla`; it appears as Bengali-shaped legacy glyphs. That is consistent with the underlying Latin letters being pasted into a SutonnyMJ/legacy Bengali font context, not with the English text being removed by Unicode conversion.

The proposed correction must therefore change only the emitted clipboard HTML font boundaries: Bengali Bijoy bytes must retain `SutonnyMJ`, while English/number runs must carry an explicit Times New Roman family that Word preserves after paste. Plain-text clipboard data and all converter mapping logic must remain unchanged.

The second screenshot was likewise inspected in two overlapping crops. Its split converter preview shows the English word `Bangla` correctly as Latin on both the Unicode side and the SutonnyMJ output side. This distinguishes the defect: **preview segmentation is already correct; rich clipboard HTML is not carrying a sufficiently Word-compatible English font boundary into the paste destination.**
