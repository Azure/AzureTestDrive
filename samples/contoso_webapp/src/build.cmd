call "%VS140COMNTOOLS%\vsvars32.bat" || goto :EOF
cmd /C nuget restore ContosoWebApp.sln || goto :EOF
MSBuild /t:Build /p:Configuration=Release /p:DeployOnBuild=true /p:PublishProfile=Properties\PublishProfiles\DefaultProfile.pubxml || goto :EOF
powershell -NoProfile -NonInteractive "Write-Host 'Success' -ForegroundColor Green"
