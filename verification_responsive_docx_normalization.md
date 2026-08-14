# Post-change responsive verification

## Scope

The DOCX-only change normalizes indented/list paragraphs into ordinary paragraph semantics and preserves a visual `w:ind` property. The browser UI should therefore remain unchanged.

## Desktop

At 1280×720, the AvroJoy header, cultural hero banner, direction controls, font-size control, editor/output workspace, and install prompt remained visible and readable. No layout regression was observed.

## Mobile

At 375×812, the header, hero banner, converter tabs, direction controls, and install prompt remained usable. The narrow layout continues to stack and wrap without the previous line-overlap issue.

## Automated verification

TypeScript compilation, production build, 8/8 core conversion tests, 6/6 e-kar tests, 12/12 r-fola tests, and the updated DOCX stability audit passed. The audit confirms that an indented/list fixture is emitted with ordinary paragraph semantics, a plain `w:ind`, explicit SutonnyMJ run metadata, and no paragraph numbering or list style.

## Manual confirmation still required

The available fixture is synthetic. The user should generate a fresh DOCX, apply indent, switch Bengali text to Times New Roman, then select SutonnyMJ again. If Word still refuses to restore the font, the failed DOCX is required for an exact XML comparison.
