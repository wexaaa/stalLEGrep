$ErrorActionPreference = 'Stop'
$bundleRoot = Split-Path -Parent $PSScriptRoot
try {
    $clients = @(Get-CimInstance Win32_Process -Filter "Name='java.exe' OR Name='javaw.exe'" | Where-Object {
        $_.CommandLine -like '*STALCRAFT-2019-DECODED*' -and $_.CommandLine -like '*-Doffline.world=*'
    })
    if ($clients.Count -gt 0) {
        Write-Host 'Another EXBO offline client is already running. Close it normally first.'
        foreach ($client in $clients) { Write-Host ('PID: ' + $client.ProcessId) }
        exit 2
    }
    $levelDatPath = Join-Path $bundleRoot 'game\saves\RegionsLocal\level.dat'
    $levelDatOldPath = Join-Path $bundleRoot 'game\saves\RegionsLocal\level.dat_old'
    if (-not (Test-Path -LiteralPath $levelDatPath -PathType Leaf) -and (Test-Path -LiteralPath $levelDatOldPath -PathType Leaf)) {
        Copy-Item -LiteralPath $levelDatOldPath -Destination $levelDatPath -Force
    }

    foreach ($relative in @('classes\classes.jar','classes\libs.jar','classes\offline-patches.jar','runtime\java\bin\java.exe','runtime\java\bin\server\jvm.dll','game\saves\RegionsLocal\level.dat','metadata\modlist.txt')) {
        if (-not (Test-Path -LiteralPath (Join-Path $bundleRoot $relative) -PathType Leaf)) { throw ('Required file missing: ' + $relative) }
    }
    # EXBO writes generated mod metadata; restore the bundled pristine metadata each run.
    Copy-Item -LiteralPath (Join-Path $bundleRoot 'metadata\modlist.txt') -Destination (Join-Path $bundleRoot 'game\modlist.txt') -Force
    $asmTarget = Join-Path $bundleRoot 'game\mods\asmdata'
    New-Item -ItemType Directory -Path $asmTarget -Force | Out-Null
    Get-ChildItem -LiteralPath (Join-Path $bundleRoot 'metadata\asmdata') -File | Copy-Item -Destination $asmTarget -Force
    exit 0
} catch {
    Write-Host ('Cannot launch safely: ' + $_.Exception.Message)
    exit 1
}
