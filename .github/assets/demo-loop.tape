# demo-loop.tape — regenerates demo-loop.gif + two PNG frames.
#
# Run from inside a THROWAWAY target repo, not from specloop itself:
#   1. specloop:start has been run there far enough to have a populated
#      roadmap.md and at least one spec with a real tasks.md.
#   2. specloop:loop-setup has installed the orchestrator (`loop` on PATH).
#   3. `vhs demo-loop.tape` (this file copied into that repo's root).
# Copy the three output files back into specloop's .github/assets/ afterward.
#
# Rerun this whenever loop's CLI output changes — no re-recording needed.

Output demo-loop.gif

Set Shell pwsh
Set FontSize 16
Set Width 1000
Set Height 600
Set Padding 20
Set TypingSpeed 60ms

Hide
Type "clear"
Enter
Show

Type "loop status"
Enter
Sleep 2s
Screenshot demo-loop-status.png

Sleep 1s
Type "loop run"
Enter
Sleep 6s
Screenshot demo-loop-run.png

Sleep 2s
