# Track only processes started by this launcher. Start time protects against PID reuse.
function Save-ProcessState {
    param([object[]]$StartedProcesses, [string]$StateFilePath)
    ConvertTo-Json -InputObject @($StartedProcesses) | Set-Content -LiteralPath $StateFilePath -Encoding UTF8
}

function Remove-ProcessStateFile {
    param([string]$StateFilePath)
    if (Test-Path -LiteralPath $StateFilePath) {
        Remove-Item -LiteralPath $StateFilePath -Force
    }
}

function Stop-RecordedProcess {
    param([object]$Record)
    $recordedProcess = Get-Process -Id ([int]$Record.Id) -ErrorAction SilentlyContinue
    if ($null -eq $recordedProcess) { return }
    if ([string]$recordedProcess.StartTime.ToUniversalTime().Ticks -ne [string]$Record.StartTicks) {
        Write-Warning "Skipping reused process ID $($Record.Id)."
        return
    }
    # Include Next.js and inference child processes belonging to this service.
    & taskkill.exe /PID $recordedProcess.Id /T /F | Out-Null
}

function Stop-AllRecordedServices {
    param([string]$StateFilePath)
    if (-not (Test-Path -LiteralPath $StateFilePath)) { return }
    $records = Get-Content -LiteralPath $StateFilePath -Raw | ConvertFrom-Json
    foreach ($record in $records) { Stop-RecordedProcess -Record $record }
    Remove-ProcessStateFile -StateFilePath $StateFilePath
}
