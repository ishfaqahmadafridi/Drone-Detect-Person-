# ==============================================================================
# Service Process Launcher for AERO-GUARD (FastAPI & Next.js)
# ==============================================================================

function Start-BackendService {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PythonPath,
        [Parameter(Mandatory = $true)]
        [string]$BackendDir,
        [Parameter(Mandatory = $true)]
        [string]$LogDir
    )
    $backend = Start-Process -FilePath $PythonPath -WorkingDirectory $BackendDir `
        -ArgumentList '-m uvicorn main:app --host 127.0.0.1 --port 8000' `
        -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $LogDir 'backend.log') `
        -RedirectStandardError (Join-Path $LogDir 'backend-error.log')

    return [pscustomobject]@{
        Name       = 'backend'
        Id         = $backend.Id
        StartTicks = [string]$backend.StartTime.ToUniversalTime().Ticks
        Process    = $backend
    }
}

function Start-FrontendService {
    param(
        [Parameter(Mandatory = $true)]
        [string]$NodePath,
        [Parameter(Mandatory = $true)]
        [string]$FrontendDir,
        [Parameter(Mandatory = $true)]
        [string]$NextPath,
        [Parameter(Mandatory = $true)]
        [string]$LogDir
    )
    $frontend = Start-Process -FilePath $NodePath -WorkingDirectory $FrontendDir `
        -ArgumentList ('"' + $NextPath + '" dev --hostname 127.0.0.1 --port 3000') `
        -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $LogDir 'frontend.log') `
        -RedirectStandardError (Join-Path $LogDir 'frontend-error.log')

    return [pscustomobject]@{
        Name       = 'frontend'
        Id         = $frontend.Id
        StartTicks = [string]$frontend.StartTime.ToUniversalTime().Ticks
        Process    = $frontend
    }
}
