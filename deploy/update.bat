@echo off
echo Updating ABC Dashboard...
copy ..\demo.html index.html
copy ..\dashboard_abc_analysis.js dashboard_abc_analysis.js
surge . abc-dashboard-demo-2025.surge.sh
echo.
echo Dashboard updated at: https://abc-dashboard-demo-2025.surge.sh
pause
