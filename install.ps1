[CmdletBinding()]
param(
    [switch] $Global,
    [switch] $Local,
    [string] $Version = "latest",
    [switch] $Force
)

$ErrorActionPreference = "Stop"

function Show-Usage {
    @"
Usage: install.ps1 [-Global | -Local] [-Version VERSION] [-Force]

Install specloop skills from the GitHub release tarball.
"@
}

if ($Global -and $Local) {
    throw "-Global and -Local cannot be used together."
}

$scope = if ($Global) { "global" } else { "local" }
$repository = "SebassContreras/specloop"
$asset = "specloop-skills.tar.gz"
$downloadUrl = if ($Version -eq "latest") {
    "https://github.com/$repository/releases/latest/download/$asset"
} else {
    "https://github.com/$repository/releases/download/$Version/$asset"
}

$temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("specloop-install-" + [guid]::NewGuid())
$archivePath = Join-Path $temporaryDirectory $asset
$extractedDirectory = Join-Path $temporaryDirectory "extracted"

try {
    New-Item -ItemType Directory -Path $extractedDirectory -Force | Out-Null

    Write-Host "Downloading $downloadUrl"
    $requestParameters = @{
        Uri = $downloadUrl
        OutFile = $archivePath
    }
    if ($PSVersionTable.PSVersion.Major -lt 6) {
        $requestParameters.UseBasicParsing = $true
    }
    Invoke-WebRequest @requestParameters

    $tar = Get-Command tar -ErrorAction SilentlyContinue
    if (-not $tar) {
        throw "A tar extractor is required to unpack $asset."
    }
    & $tar.Source -xzf $archivePath -C $extractedDirectory
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to extract $asset."
    }

    $skillsSource = Join-Path $extractedDirectory "skills"
    if (-not (Test-Path (Join-Path $skillsSource "status/SKILL.md") -PathType Leaf)) {
        throw "The release archive does not contain a skills tree."
    }

    $destinations = [System.Collections.Generic.List[string]]::new()
    if ($scope -eq "local") {
        $destinations.Add((Join-Path (Get-Location) ".agents/skills"))
    } else {
        $destinations.Add((Join-Path $HOME ".agents/skills"))
        if (Test-Path (Join-Path (Get-Location) ".claude")) {
            $destinations.Add((Join-Path $HOME ".claude/skills"))
        }
        if (Test-Path (Join-Path (Get-Location) ".opencode")) {
            $destinations.Add((Join-Path $HOME ".config/opencode/skills"))
        }
        if (Test-Path (Join-Path (Get-Location) ".cursor")) {
            $destinations.Add((Join-Path $HOME ".cursor/skills"))
        }
        if (Test-Path (Join-Path (Get-Location) ".github")) {
            $destinations.Add((Join-Path $HOME ".copilot/skills"))
        }
    }

    foreach ($destination in $destinations) {
        New-Item -ItemType Directory -Path $destination -Force | Out-Null
        Copy-Item -Path (Join-Path $skillsSource "*") -Destination $destination -Recurse -Force
        Write-Host "Installed skills in $destination"
    }
} finally {
    if (Test-Path $temporaryDirectory) {
        Remove-Item -Path $temporaryDirectory -Recurse -Force
    }
}
