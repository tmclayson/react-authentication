set CURRENT_DIRECTORY="%~dp0
set DB_PATH=%CURRENT_DIRECTORY%data\db"
mongod --dbpath %DB_PATH% --nojournal
cmd /k