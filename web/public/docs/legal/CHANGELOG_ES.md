# Historial de Cambios - Reglas de Gobernanza

Todos los cambios notables a las reglas de gobernanza serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [1.4.2] - 2026-02-06

### Cambiado
- **QUAL_006**: Temporalmente desactivada para lanzamiento inicial de plataforma
- Actualizado algoritmo de cálculo de puntaje de confianza para mejor precisión
- Mejorada captura de detalles de registro de auditoría para violaciones de CORE_002

### Corregido
- **CORE_001**: Corregido caso límite donde marca de tiempo de verificación podía ser modificada dentro del período de gracia
- Corregidas traducciones al español para descripciones de reglas

## [1.4.1] - 2026-01-15

### Agregado
- **QUAL_005**: Nueva reducción automática de puntaje de confianza para datos scrapeados
- Registro de auditoría para todos los eventos de reducción

### Cambiado
- **CORE_002**: Extendida verificación de propietario a modificaciones de API
- Incrementada sensibilidad de detección de violación de propiedad

## [1.4.0] - 2025-12-01

### Agregado
- **QUAL_006**: Requisitos de exposición pública (inicialmente ACTIVA, ahora INACTIVA)
- Sistema de recomendaciones de calidad de fotos

### Cambiado
- **CORE_001**: Expandida lista de campos protegidos
- Agregado período de gracia de 24 horas para correcciones post-verificación

## [1.3.0] - 2025-10-15

### Agregado
- **CORE_001**: Regla de inmutabilidad de versión de listado
- **CORE_002**: Regla de cumplimiento de propiedad de corredor

### Seguridad
- Implementado registro de auditoría encriptado
- Agregada autenticación multifactor para sobrepasos de reglas

## [No Lanzado]

### Planeado
- **PRICE_001**: Monitoreo de variación de precio
- **LOC_001**: Requisito de verificación de ubicación
- **MEDIA_001**: Verificación de autenticidad de imagen

---

## Numeración de Versiones

- **Mayor** (X.0.0): Cambios que rompen compatibilidad, nuevas reglas críticas
- **Menor** (1.X.0): Nuevas reglas sin romper compatibilidad, modificaciones significativas
- **Parche** (1.4.X): Correcciones de errores, ajustes menores, traducciones

## Calendario de Revisión

- **Trimestral**: Revisión completa de gobernanza
- **Mensual**: Análisis de métricas de rendimiento
- **Ad-hoc**: Modificaciones de emergencia según sea necesario
