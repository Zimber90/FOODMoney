@echo off
:: Script per caricare il progetto su GitHub
:: Da eseguire nella cartella principale del progetto

echo ===========================================
echo  Caricamento su GitHub
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
echo [1/2] Aggiornamento file...
git add .
if %errorlevel% neq 0 (
    echo ERRORE durante l'aggiunta dei file.
    pause
    exit /b 1
)

:: Esegue il commit
echo [2/2] Creazione commit...
git commit -m "Caricamento iniziale"
if %errorlevel% neq 0 (
    echo ERRORE durante la creazione del commit.
    echo Forse non ci sono modifiche da salvare.
    pause
    exit /b 1
)

:: Esegue il push
echo [3/3] Push su GitHub...
git push -u https://github.com/Zimber90/FOODMONEY.git main
if %errorlevel% neq 0 (
    echo ERRORE durante il push. Verifica la connessione internet.
    pause
    exit /b 1
)

echo.
echo ===========================================
echo  Caricamento completato con successo!
echo ===========================================
echo.
pause