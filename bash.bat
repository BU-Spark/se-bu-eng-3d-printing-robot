@echo off
echo Windows setup script

REM Create Python virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing npm dependencies...
npm install

REM Ask to start server
set /p start_server="Do you want to start the development server now? (y/n): "
if /i "%start_server%"=="y" (
    echo Starting development server...
    npm run dev
) else (
    echo Setup complete!
    echo To start the development server, run: npm run dev
    echo To deactivate the virtual environment, run: deactivate
)