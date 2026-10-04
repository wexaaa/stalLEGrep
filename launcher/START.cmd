@echo off
setlocal EnableExtensions
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\prepare-launch.ps1"
if errorlevel 1 goto failed
set "PATH=%~dp0native-exbo;%~dp0native-exbo\fmod;%~dp0natives;%~dp0runtime\java\bin;%PATH%"
pushd "%~dp0game"
"..\runtime\java\bin\java.exe" -Xms256m -Xmx3g ^
  "-Dfile.encoding=UTF-8" ^
  "-Doffline.world=RegionsLocal" ^
  "-Doffline.new=" ^
  "-Djava.library.path=..\natives;..\runtime\java\bin;..\native-exbo;..\native-exbo\fmod" ^
  "-Dshow_globally_enabled=false" "-Dread_derived=true" ^
  "-DCustomNpcsSoundCache=true" "-Dload_dumped_event_classes=true" ^
  "-DusePrestitchedAtlas=true" "-Ddisable_item_atlas=true" ^
  "-Ddisable_mod_parsing=true" "-Duse_system_class_loader=true" ^
  "-Dfml.coreMods.load=codechicken.core.launch.CodeChickenCorePlugin" ^
  -cp "..\classes\offline-patches.jar;..\classes\classes.jar;..\classes\libs.jar;modassets" ^
  net.minecraft.launchwrapper.Launch ^
  --version STALCRAFT-2019-DECODED --gameDir . --assetsDir assets ^
  --username wexa --session 0 ^
  --tweakClass cpw.mods.fml.common.launcher.FMLTweaker
set "GAME_EXIT=%ERRORLEVEL%"
popd
if not "%GAME_EXIT%"=="0" goto failed
exit /b 0
:failed
echo.
echo Launch failed or another EXBO client is already open.
echo Close the other client normally. Check game\crash-reports and game\ForgeModLoader-client-0.log.
pause
exit /b 1
