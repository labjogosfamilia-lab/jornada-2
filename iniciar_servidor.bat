@echo off
chcp 65001 > nul
title Jornada II: Arena dos Campeões - Servidor Dedicado
color 0B

echo ===============================================================
echo        ⚔️  JORNADA II: ARENA DOS CAMPEÕES (MULTIPLAYER) ⚔️
echo ===============================================================
echo.
echo  Iniciando Servidor Dedicado de Alta Performance...
echo  (Com suporte a multiplos jogadores e Bots Inteligentes)
echo.

start "" "http://localhost:3000"

".\bin\node.exe" server.js

pause
