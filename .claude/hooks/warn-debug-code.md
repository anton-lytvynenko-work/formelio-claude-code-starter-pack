---
name: warn-debug-code
enabled: true
event: file
pattern: console\.(log|debug|info)|debugger
action: warn
---

Debug code detected. Remove before committing:
- `console.log` / `console.debug` / `console.info`
- `debugger` statements

Use proper logging infrastructure for production code.
