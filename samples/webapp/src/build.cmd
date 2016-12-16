call "%VS140COMNTOOLS%\vsvars32.bat" || goto :EOF
powershell -NoProfile -NonInteractive "if (-not (Test-Path temp)) { md temp | Out-Null }"
powershell -NoProfile -NonInteractive "if (-not (Test-Path temp\nuget.exe)) { Invoke-WebRequest https://dist.nuget.org/win-x86-commandline/latest/nuget.exe -OutFile temp\nuget.exe }"
temp\nuget restore ContosoWebApp.sln || goto :EOF
MSBuild /t:Build /p:Configuration=Release /p:DeployOnBuild=true /p:PublishProfile=Properties\PublishProfiles\DefaultProfile.pubxml || goto :EOF
powershell -NoProfile -NonInteractive "Write-Host 'Success' -ForegroundColor Green"
