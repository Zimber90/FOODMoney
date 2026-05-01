@echo off
:: Script per fare commit e push automatico su GitHub
:: Da eseguire nella cartella principale del progetto

echo ===========================================
echo  Script Push Automatico per GitHub
echo ===========================================
echo.

:: Controlla se siamo in una cartella Git
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRORE: Questa cartella non e' un repository Git.
    echo Eseguire prima: git init
    pause
    exit /b 1
)

:: Aggiorna la lista dei file
echo [1/4] Aggiornamento file...
git add .
if %errorlevel% neq 0 (
    echo ERRORE durante l'aggiunta dei file.
    pause
    exit /b 1
)

:: Chiede il messaggio del commit
set /p commit_msg="[2/4] Scrivi il messaggio del commit (es. 'Aggiornamento homepage'): "
if "%commit_msg%"=="" (
    echo ERRORE: Messaggio del commit vuoto.
    pause
    exit /b 1
)

:: Esegue il commit
echo [3/4] Creazione commit...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo ERRORE durante la creazione del commit.
    echo Forse non ci sono modifiche da salvare.
    pause
    exit /b 1
)

:: Esegue il push
echo [4/4] Push su GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERRORE durante il push. Verifica la connessione internet.
    echo Prova a usare: git push origin master
    pause
    exit /b 1
)

echo.
echo ===========================================
echo  Push completato con successo!
echo ===========================================
echo.
echo Il tuo sito su Vercel si aggiornera' automaticamente.
pause