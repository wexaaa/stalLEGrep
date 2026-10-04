param([string]$Repository = 'wexaaa/stalLEGrep', [string]$NodeExecutable = 'node')
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$url = "https://api.github.com/repos/$Repository/git/trees/main?recursive=1"
# Public API only: no credentials, tokens or browser cookies.
$treeJson = & $NodeExecutable -e "fetch(process.argv[1],{headers:{'User-Agent':'offline-patch-source-check'}}).then(async r=>{if(!r.ok)throw Error('HTTP '+r.status);console.log(await r.text())}).catch(e=>{console.error(e.message);process.exitCode=1})" $url
if ($LASTEXITCODE -ne 0) {throw 'Cannot read the public GitHub tree'}
$tree = ($treeJson -join "`n") | ConvertFrom-Json
if ($tree.truncated) {throw 'GitHub tree is truncated'}
$remote = @{}
foreach ($entry in $tree.tree) {if ($entry.type -eq 'blob') {$remote[$entry.path] = $entry.sha}}
$files = @(Get-ChildItem -LiteralPath $repoRoot -Recurse -File | Where-Object {$_.FullName -notmatch '[\\/]\.git[\\/]'})
$mismatches = @()
foreach ($file in $files) {
    $relative = [IO.Path]::GetRelativePath($repoRoot,$file.FullName).Replace('\','/')
    $data = [IO.File]::ReadAllBytes($file.FullName)
    $header = [Text.Encoding]::ASCII.GetBytes("blob $($data.Length)`0")
    $sha = [Security.Cryptography.SHA1]::Create()
    try {
        [void]$sha.TransformBlock($header,0,$header.Length,$header,0)
        [void]$sha.TransformFinalBlock($data,0,$data.Length)
        $hash = [Convert]::ToHexString($sha.Hash).ToLowerInvariant()
    } finally {$sha.Dispose()}
    if ($remote[$relative] -ne $hash) {$mismatches += $relative}
    $remote.Remove($relative)
}
if ($mismatches.Count -or $remote.Count) {throw "Mismatch/missing: $($mismatches -join ', '); unexpected: $($remote.Keys -join ', ')"}
Write-Host "PASS: all $($files.Count) published files match the local source snapshot."
