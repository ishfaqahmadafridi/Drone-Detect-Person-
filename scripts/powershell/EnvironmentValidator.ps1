# ==============================================================================
# Environment & Prerequisites Validation for AERO-GUARD Launcher
# ==============================================================================

function Get-PythonExecutable {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BackendDir
    )
    $python = Join-Path $BackendDir '.venv\Scripts\python.exe'
    if (-not (Test-Path -LiteralPath $python)) {
        $python = Join-Path $BackendDir 'venv\Scripts\python.exe'
    }
    if (-not (Test-Path -LiteralPath $python)) {
        throw 'Backend environment missing. Follow the Windows setup in README.md first.'
    }
    return $python
}

function Get-NodeExecutable {
    try {
        return (Get-Command node.exe -ErrorAction Stop).Source
    } catch {
        throw 'Node.js is not found in PATH. Install Node.js (v18+) first.'
    }
}

function Get-NextExecutable {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FrontendDir
    )
    $next = Join-Path $FrontendDir 'node_modules\next\dist\bin\next'
    if (-not (Test-Path -LiteralPath $next)) {
        throw 'Frontend dependencies missing. Run npm ci in frontend first.'
    }
    return $next
}

function Test-PortAvailability {
    param(
        [Parameter(Mandatory = $false)]
        [int[]]$Ports = @(8000, 3000)
    )
    foreach ($port in $Ports) {
        if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) {
            throw "Port $port is already in use. Stop the existing service before launching again."
        }
    }
}

function Initialize-SystemDirectories {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ProjectRoot,
        [Parameter(Mandatory = $true)]
        [string]$LogDir
    )
    New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
    $env:PYTHONUNBUFFERED = '1'
    $env:PYTHONUTF8 = '1'
    $env:YOLO_CONFIG_DIR = Join-Path $ProjectRoot 'runs\ultralytics'
    New-Item -ItemType Directory -Force -Path $env:YOLO_CONFIG_DIR | Out-Null
}
