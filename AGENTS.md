<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# File encoding

Write source files as UTF-8 **without** a BOM, with LF line endings. `.gitattributes` and `.editorconfig` enforce this for git and for editors, but neither can stop a shell from writing a BOM.

On Windows PowerShell, `Set-Content` and `Out-File` add a UTF-8 BOM unless you pass `-Encoding utf8`. A BOM at the top of a `.ts`/`.tsx` file makes the entire file read as modified, which buries real changes in the diff. If you see a file whose only change is its first line, check for one:

```bash
head -c3 path/to/file.tsx | od -An -tx1   # efbbbf means there is a BOM
```
