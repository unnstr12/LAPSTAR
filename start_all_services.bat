@echo off
echo ========================================
echo Starting LapVN Chatbot Services
echo ========================================

echo.
echo [1/3] Starting FastAPI Gemini Service (Port 8001)...
start "FastAPI Gemini" cmd /k "cd /d %~dp0 && python ask_product.py"

echo.
echo [2/3] Starting Spring Boot Backend (Port 8082)...
start "Spring Boot Backend" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

echo.
echo [3/3] Starting React Frontend (Port 3000)...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Services:
echo - FastAPI Gemini: http://localhost:8001
echo - Spring Boot Backend: http://localhost:8082
echo - React Frontend: http://localhost:3000
echo.
echo Wait for all services to fully start before testing chatbot.
echo Press any key to exit this window...
pause > nul