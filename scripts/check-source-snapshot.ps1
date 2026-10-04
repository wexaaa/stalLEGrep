$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$files = @(Get-ChildItem -LiteralPath $repoRoot -Recurse -File | Where-Object {$_.FullName -notmatch '[\\/]\.git[\\/]'})
$allowed = @('.md','.java','.js','.ps1','.cmd','.gitignore','.gitattributes')
foreach ($file in $files) {
    if ($file.Extension -notin $allowed) {throw "Unexpected publish file: $($file.Name)"}
    $contents = [IO.File]::ReadAllText($file.FullName)
    if ($contents -match 'C:[/\\]Users[/\\]|github_pat_[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|BEGIN [A-Z ]*PRIVATE KEY') {throw "Private data candidate: $($file.Name)"}
}
$sources = @($files | Where-Object {$_.Directory.Name -eq 'work' -and $_.Extension -in @('.js','.java')})
if ($sources.Count -ne 94) {throw "Expected 94 source files; got $($sources.Count)"}
Write-Host "PASS: $($files.Count) text files; 94 source files; no game binaries or personal paths."
