@echo off
if exist .\\..\\src\\nui rmdir /s /q .\\..\\src\\nui
xcopy /E .\\build\\* .\\..\\src\\nui\\