# AgriBridge Automatic GitHub Sync Service
# Monitors the workspace folder recursively and automatically pushes to GitHub on change.

$WorkspaceRoot = "d:\Agri-Bridge"
$TargetBranch = "main"

# Folders and files to ignore
$IgnorePatterns = @("node_modules", "\.git", "dist", "\.log", "tmp")

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   AgriBridge Auto-Sync Engine Starting..." -ForegroundColor Green
Write-Host "   Monitoring: $WorkspaceRoot" -ForegroundColor Yellow
Write-Host "   Target Remote Branch: $TargetBranch" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

# Create the filesystem watcher
$Watcher = New-Object System.IO.FileSystemWatcher
$Watcher.Path = $WorkspaceRoot
$Watcher.IncludeSubdirectories = $true
$Watcher.EnableRaisingEvents = $true

# Track changed files for debounced committing
$ChangedFiles = [System.Collections.Generic.HashSet[string]]::new()
$LastEventTime = [DateTime]::MinValue
$SyncTimer = $null

# Function to execute git push
function Sync-ToGitHub {
    if ($ChangedFiles.Count -eq 0) { return }

    # Copy files list and clear original to prevent race conditions
    $Files = $ChangedFiles | ForEach-Object { $_ }
    $ChangedFiles.Clear()

    $FilesSummary = ($Files | ForEach-Object { [System.IO.Path]::GetFileName($_) }) -join ", "
    if ($FilesSummary.Length -gt 60) {
        $FilesSummary = $FilesSummary.Substring(0, 57) + "..."
    }

    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Change detected: $FilesSummary" -ForegroundColor Cyan
    Write-Host "Staging changes..." -ForegroundColor DarkGray
    git add -A

    $CommitMessage = "Auto-update: $FilesSummary"
    Write-Host "Committing: '$CommitMessage'..." -ForegroundColor DarkGray
    git commit -m $CommitMessage

    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    $PushResult = git push origin $TargetBranch 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully synced with GitHub!" -ForegroundColor Green
    } else {
        Write-Host "Sync failed. Check connection or branch status." -ForegroundColor Red
        Write-Host $PushResult -ForegroundColor DarkGray
    }
}

# File change handler
$Action = {
    $Path = $Event.SourceEventArgs.FullPath
    
    # Ignore specific paths
    $Ignore = $false
    foreach ($Pattern in $IgnorePatterns) {
        if ($Path -match $Pattern) {
            $Ignore = $true
            break
        }
    }

    if (-not $Ignore -and (Test-Path $Path -PathType Leaf)) {
        $ChangedFiles.Add($Path) | Out-Null
        $script:LastEventTime = Get-Date

        # Debounce/Cooldown of 2 seconds before pushing
        if ($script:SyncTimer) {
            $script:SyncTimer.Stop()
            $script:SyncTimer.Dispose()
        }

        $script:SyncTimer = New-Object System.Timers.Timer
        $script:SyncTimer.Interval = 2000 # 2 seconds
        $script:SyncTimer.AutoReset = $false
        
        $TimerAction = {
            Sync-ToGitHub
        }
        
        Register-ObjectEvent -InputObject $script:SyncTimer -EventName Elapsed -Action $TimerAction | Out-Null
        $script:SyncTimer.Start()
    }
}

# Bind watcher events
$Handlers = @()
$Handlers += Register-ObjectEvent -InputObject $Watcher -EventName Changed -Action $Action
$Handlers += Register-ObjectEvent -InputObject $Watcher -EventName Created -Action $Action
$Handlers += Register-ObjectEvent -InputObject $Watcher -EventName Deleted -Action $Action

Write-Host "Auto-Sync is live! Press Ctrl+C in this terminal window to stop monitoring." -ForegroundColor White

try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    # Cleanup event handlers and watcher
    Write-Host "`nStopping Auto-Sync Engine..." -ForegroundColor Red
    foreach ($Handler in $Handlers) {
        Unregister-Event -Source.SourceIdentifier $Handler.Name -ErrorAction SilentlyContinue
    }
    $Watcher.EnableRaisingEvents = $false
    $Watcher.Dispose()
    if ($script:SyncTimer) {
        $script:SyncTimer.Dispose()
    }
    Write-Host "Cleanup complete. Bye!" -ForegroundColor Red
}
