@echo off
setlocal enabledelayedexpansion

:: PostgreSQL bilgileri
set PGPASSWORD=C36g4f,15
set DB_NAME=amida
set DB_USER=postgres
set BACKUP_DIR=%~dp0
set DATE_FORMAT=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE_FORMAT=%DATE_FORMAT: =0%

:: Yedek dosyasının adını oluştur
set BACKUP_FILE=%BACKUP_DIR%backup_%DATE_FORMAT%.sql

:: Yedekleme işlemi
echo Veritabani yedekleniyor...
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U %DB_USER% %DB_NAME% > "%BACKUP_FILE%"

:: Yedekleme başarılı mı kontrol et
if %ERRORLEVEL% EQU 0 (
    echo Yedekleme basarili: %BACKUP_FILE%
) else (
    echo Yedekleme basarisiz!
)

:: 30 günden eski yedekleri temizle
echo Eski yedekler temizleniyor...
forfiles /P "%BACKUP_DIR%" /M backup_*.sql /D -30 /C "cmd /c del @path" 2>nul

:: PostgreSQL şifresini temizle
set PGPASSWORD=

echo Islem tamamlandi.
pause 