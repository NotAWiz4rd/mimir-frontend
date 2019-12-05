# SeFrontendAngular

Konfiguration der Umgebung:
  * `environments/environment.ts` enthält die Standard-Konfiguration, die den API-Server auf localhost:8080 erwartet.
  * In der `angular.json` wird sie mit `configuration.production.fileReplacements` durch die produktive environment-Konfiguration ersetzt, die die Domain des produktiven Servers konfiguriert.

Projekt bauen:
  * development Server, http://localhost:4200 `ng serve`
  * produktiv: `ng build --prod`
  * Die Artefakte liegen in `dist`.