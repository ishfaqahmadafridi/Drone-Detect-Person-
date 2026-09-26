param([switch]$SkipDependencies)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$runtimeDirectory = Join-Path $projectRoot '.runtime'
$cacheDirectory = Join-Path $projectRoot '.cache'
New-Item -ItemType Directory -Force -Path $runtimeDirectory, $cacheDirectory | Out-Null
$env:UV_CACHE_DIR = Join-Path $cacheDirectory 'uv'
$env:UV_PYTHON_INSTALL_DIR = Join-Path $runtimeDirectory 'python'
$env:YOLO_CONFIG_DIR = Join-Path $runtimeDirectory 'ultralytics'
New-Item -ItemType Directory -Force -Path $env:YOLO_CONFIG_DIR | Out-Null
$env:PYTHONUTF8 = '1'
$uvPath = Join-Path $runtimeDirectory 'uv\uv.exe'
if (-not (Test-Path -LiteralPath $uvPath)) {
    $uvArchive = Join-Path $runtimeDirectory 'uv.zip'
    Write-Output 'Downloading the official portable uv package manager into this project...'
    Invoke-WebRequest -Uri 'https://github.com/astral-sh/uv/releases/latest/download/uv-x86_64-pc-windows-msvc.zip' -OutFile $uvArchive -UseBasicParsing
    Expand-Archive -LiteralPath $uvArchive -DestinationPath (Join-Path $runtimeDirectory 'uv') -Force
}
$pythonPath = Join-Path $projectRoot '.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $pythonPath)) {
    & $uvPath venv --python 3.12 (Join-Path $projectRoot '.venv')
    if ($LASTEXITCODE -ne 0) { throw 'Could not create the project Python environment.' }
}
if (-not $SkipDependencies) {
    Write-Output 'Installing CPU PyTorch and the detection/API dependencies into .venv...'
    & $uvPath pip install --python $pythonPath torch torchvision --index-url https://download.pytorch.org/whl/cpu
    if ($LASTEXITCODE -ne 0) { throw 'Could not install PyTorch.' }
    & $uvPath pip install --python $pythonPath -r (Join-Path $projectRoot 'requirements.txt')
    if ($LASTEXITCODE -ne 0) { throw 'Could not install the application dependencies.' }
}
& $pythonPath (Join-Path $PSScriptRoot 'download_models.py')
if ($LASTEXITCODE -ne 0) { throw 'A model download failed.' }
Write-Output 'Models and Python environment are ready. Start with: .\.venv\Scripts\python.exe app.py'
