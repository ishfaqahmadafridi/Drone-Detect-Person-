param([switch]$Stop)

$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$backendDir = Join-Path $projectRoot 'backend'
$frontendDir = Join-Path $projectRoot 'frontend'
$logDir = Join-Path $projectRoot 'runs\system'
$stateFile = Join-Path $logDir 'processes.json'

function Stop-RecordedProcess($record) {
    $process = Get-Process -Id $record.Id -ErrorAction SilentlyContinue
    # Check the creation time so a reused PID cannot stop an unrelated process.
    if ($process -and [string]$process.StartTime.ToUniversalTime().Ticks -eq $record.StartTicks) {
        & taskkill.exe /PID $process.Id /T /F | Out-Null
    }
}

if ($Stop) {
    if (Test-Path -LiteralPath $stateFile) {
        $records = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
        foreach ($record in $records) { Stop-RecordedProcess $record }
        Remove-Item -LiteralPath $stateFile
        Write-Host 'AERO-GUARD services stopped.'
    } else {
        Write-Host 'No services recorded by this launcher.'
    }
    exit 0
}

$python = Join-Path $backendDir '.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $python)) {
    $python = Join-Path $backendDir 'venv\Scripts\python.exe'
}
if (-not (Test-Path -LiteralPath $python)) {
    throw 'Backend environment missing. Follow the Windows setup in README.md first.'
}
$node = (Get-Command node.exe -ErrorAction Stop).Source
$next = Join-Path $frontendDir 'node_modules\next\dist\bin\next'
if (-not (Test-Path -LiteralPath $next)) {
    throw 'Frontend dependencies missing. Run npm ci in frontend first.'
}

foreach ($port in @(8000, 3000)) {
    if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) {
        throw "Port $port is already in use. Stop the existing service before launching again."
    }
}

New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$env:PYTHONUNBUFFERED = '1'
$env:PYTHONUTF8 = '1'
$env:YOLO_CONFIG_DIR = Join-Path $projectRoot 'runs\ultralytics'
New-Item -ItemType Directory -Force -Path $env:YOLO_CONFIG_DIR | Out-Null
$started = @()

try {
    $backend = Start-Process -FilePath $python -WorkingDirectory $backendDir `
        -ArgumentList '-m uvicorn main:app --host 127.0.0.1 --port 8000' `
        -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $logDir 'backend.log') `
        -RedirectStandardError (Join-Path $logDir 'backend-error.log')
    $started += [pscustomobject]@{
        Name = 'backend'; Id = $backend.Id
        StartTicks = [string]$backend.StartTime.ToUniversalTime().Ticks
    }
    $started | ConvertTo-Json | Set-Content -LiteralPath $stateFile

    $frontend = Start-Process -FilePath $node -WorkingDirectory $frontendDir `
        -ArgumentList ('"' + $next + '" dev --hostname 127.0.0.1 --port 3000') `
        -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $logDir 'frontend.log') `
        -RedirectStandardError (Join-Path $logDir 'frontend-error.log')
    $started += [pscustomobject]@{
        Name = 'frontend'; Id = $frontend.Id
        StartTicks = [string]$frontend.StartTime.ToUniversalTime().Ticks
    }
    $started | ConvertTo-Json | Set-Content -LiteralPath $stateFile

    Write-Host 'Starting both services. The first launch generates demo footage and compiles the dashboard.'
    Write-Host "Logs: $logDir"
    $deadline = (Get-Date).AddMinutes(5)
    $ready = $false
    while ((Get-Date) -lt $deadline) {
        $backend.Refresh()
        $frontend.Refresh()
        if ($backend.HasExited -or $frontend.HasExited) {
            throw "A service exited during startup. See the logs in $logDir."
        }
        try {
            $health = Invoke-RestMethod 'http://127.0.0.1:8000/api/health' -TimeoutSec 3
            $page = Invoke-WebRequest 'http://127.0.0.1:3000' -UseBasicParsing -TimeoutSec 5
            if ($health.status -eq 'online' -and $page.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch {
            Start-Sleep -Seconds 2
        }
    }
    if (-not $ready) { throw "Startup timed out. See the logs in $logDir." }

    Write-Host 'Dashboard: http://127.0.0.1:3000'
    Write-Host 'API docs:  http://127.0.0.1:8000/docs'
    Write-Host 'Both services keep running after this command returns.'
    Write-Host 'Stop: powershell -NoProfile -ExecutionPolicy Bypass -File .\start_system.ps1 -Stop'
} catch {
    foreach ($record in $started) { Stop-RecordedProcess $record }
    if (Test-Path -LiteralPath $stateFile) { Remove-Item -LiteralPath $stateFile }
    throw
}
