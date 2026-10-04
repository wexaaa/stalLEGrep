param([Parameter(Mandatory=$true)][string]$SourceWorkspace,
      [Parameter(Mandatory=$true)][string]$GameRoot)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$utf8 = [Text.UTF8Encoding]::new($false)
$gamePrefix = $GameRoot.TrimEnd('\','/').Replace('\','/') + '/'
$gameLiteralPattern = "'" + [regex]::Escape($gamePrefix) + "([^']*)'"
New-Item -ItemType Directory -Path (Join-Path $repoRoot 'work') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $repoRoot 'launcher') -Force | Out-Null
$sourceFiles = @(Get-ChildItem -LiteralPath (Join-Path $SourceWorkspace 'work') -File | Where-Object {
    $_.Name -match '^(build-|test-|verify-|fix-).+\.js$' -or $_.Name -like '*.methods.java'
})
$prefix = "var offlineHome=java.lang.System.getenv('STALCRAFT_HOME'); if(!offlineHome) throw new Error('Set STALCRAFT_HOME to the game directory'); offlineHome=String(offlineHome).replace(/\\/g,'/').replace(/\/$/,'');`n"
foreach ($sourceFile in $sourceFiles) {
    $original = [IO.File]::ReadAllText($sourceFile.FullName)
    $portable = [regex]::Replace($original, $gameLiteralPattern, {param($match) "(offlineHome+'/$($match.Groups[1].Value)')"})
    if ($portable -cne $original) { $portable = $prefix + $portable }
    [IO.File]::WriteAllText((Join-Path $repoRoot "work/$($sourceFile.Name)"),$portable,$utf8)
}
foreach ($instruction in Get-ChildItem -LiteralPath (Join-Path $SourceWorkspace 'outputs') -Filter '*-инструкция.md' -File) {
    $contents = [IO.File]::ReadAllText($instruction.FullName)
    $contents = $contents.Replace($GameRoot.TrimEnd('\','/'),'<GAME_ROOT>').Replace($gamePrefix.TrimEnd('/'),'<GAME_ROOT>')
    [IO.File]::WriteAllText((Join-Path $repoRoot "docs/$($instruction.Name)"),$contents,$utf8)
}
Copy-Item -LiteralPath (Join-Path $GameRoot 'tools/prepare-launch.ps1') -Destination (Join-Path $repoRoot 'launcher/prepare-launch.ps1')
# The original launcher resolves tools/ relative to the game root.
# This archive copy is placed in launcher/ for documentation, not auto-installation.
Copy-Item -LiteralPath (Join-Path $GameRoot 'START.cmd') -Destination (Join-Path $repoRoot 'launcher/START.cmd')
Write-Host "Prepared $($sourceFiles.Count) source scripts/method files; game binaries excluded."
