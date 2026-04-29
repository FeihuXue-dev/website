param(
    [string]$TaskName = "WebsitePhotographySync",
    [string]$SourceDir = "G:\Lumix_Photo",
    [string]$SiteDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [string]$At = "03:00",
    [switch]$CommitAndPush
)

$ErrorActionPreference = "Stop"

$node = (Get-Command node).Source
$syncScript = Join-Path $SiteDir "scripts\sync-photography.mjs"

if (-not (Test-Path $SourceDir)) {
    throw "Source folder does not exist: $SourceDir"
}

if (-not (Test-Path $syncScript)) {
    throw "Sync script does not exist: $syncScript"
}

$actionArgs = "`"$syncScript`" --source `"$SourceDir`" --site `"$SiteDir`""

if ($CommitAndPush) {
    $actionArgs = "$actionArgs --commit-and-push"
}
$action = New-ScheduledTaskAction -Execute $node -Argument $actionArgs -WorkingDirectory $SiteDir
$trigger = New-ScheduledTaskTrigger -Daily -DaysInterval 1 -At $At
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Settings $settings `
    -Description "Publish one random photography image from $SourceDir into the website gallery." `
    -Force | Out-Null

Write-Host "Registered scheduled task: $TaskName"
Write-Host "Runs daily at: $At"
Write-Host "Source: $SourceDir"
Write-Host "Site: $SiteDir"
Write-Host "Commit and push: $CommitAndPush"
