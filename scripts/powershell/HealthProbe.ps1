# ==============================================================================
# Health Probe and System Readiness Waiter for AERO-GUARD Launcher
# ==============================================================================

function Wait-SystemReadiness {
    param(
        [Parameter(Mandatory = $true)]
        [object]$BackendProcess,
        [Parameter(Mandatory = $true)]
        [object]$FrontendProcess,
        [Parameter(Mandatory = $true)]
        [string]$LogDir,
        [Parameter(Mandatory = $false)]
        [int]$TimeoutMinutes = 5
    )

    Write-Host 'Starting both services. The first launch generates demo footage and compiles the dashboard.'
    Write-Host "Logs: $LogDir"

    $deadline = (Get-Date).AddMinutes($TimeoutMinutes)
    $ready = $false

    while ((Get-Date) -lt $deadline) {
        $BackendProcess.Refresh()
        $FrontendProcess.Refresh()
        if ($BackendProcess.HasExited -or $FrontendProcess.HasExited) {
            throw "A service exited during startup. See the logs in $LogDir."
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

    if (-not $ready) {
        throw "Startup timed out. See the logs in $LogDir."
    }
}
