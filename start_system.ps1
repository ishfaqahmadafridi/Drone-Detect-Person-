# ==============================================================================
# AERO-GUARD System Launcher Orchestrator (Windows PowerShell)
# ==============================================================================
param([switch]$Stop)

$ErrorActionPreference = 'Stop'

# Project paths
$projectRoot  = $PSScriptRoot
$backendDir   = Join-Path $projectRoot 'backend'
$frontendDir  = Join-Path $projectRoot 'frontend'
$scriptsDir   = Join-Path $projectRoot 'scripts\powershell'
$logDir       = Join-Path $projectRoot 'runs\system'
$stateFile    = Join-Path $logDir 'processes.json'

# Dot-source modular subpackages
. (Join-Path $scriptsDir 'ProcessManager.ps1')
. (Join-Path $scriptsDir 'EnvironmentValidator.ps1')
. (Join-Path $scriptsDir 'ServiceLauncher.ps1')
. (Join-Path $scriptsDir 'HealthProbe.ps1')

# Stop requested: delegate to ProcessManager
if ($Stop) {
    Stop-AllRecordedServices -StateFilePath $stateFile
    exit 0
}

# 1. Environment & Pre-flight Validation
$python = Get-PythonExecutable -BackendDir $backendDir
$node   = Get-NodeExecutable
$next   = Get-NextExecutable -FrontendDir $frontendDir

Test-PortAvailability -Ports @(8000, 3000)
Initialize-SystemDirectories -ProjectRoot $projectRoot -LogDir $logDir

$started = @()

try {
    # 2. Start Backend Microservice
    $backendRecord = Start-BackendService -PythonPath $python -BackendDir $backendDir -LogDir $logDir
    $started += [pscustomobject]@{
        Name       = $backendRecord.Name
        Id         = $backendRecord.Id
        StartTicks = $backendRecord.StartTicks
    }
    Save-ProcessState -StartedProcesses $started -StateFilePath $stateFile

    # 3. Start Frontend Dashboard
    $frontendRecord = Start-FrontendService -NodePath $node -FrontendDir $frontendDir -NextPath $next -LogDir $logDir
    $started += [pscustomobject]@{
        Name       = $frontendRecord.Name
        Id         = $frontendRecord.Id
        StartTicks = $frontendRecord.StartTicks
    }
    Save-ProcessState -StartedProcesses $started -StateFilePath $stateFile

    # 4. Wait for System Readiness
    Wait-SystemReadiness -BackendProcess $backendRecord.Process -FrontendProcess $frontendRecord.Process -LogDir $logDir

    Write-Host 'Dashboard: http://127.0.0.1:3000'
    Write-Host 'API docs:  http://127.0.0.1:8000/docs'
    Write-Host 'Both services keep running after this command returns.'
    Write-Host 'Stop: powershell -NoProfile -ExecutionPolicy Bypass -File .\start_system.ps1 -Stop'
} catch {
    foreach ($record in $started) {
        Stop-RecordedProcess -Record $record
    }
    Remove-ProcessStateFile -StateFilePath $stateFile
    throw
}
