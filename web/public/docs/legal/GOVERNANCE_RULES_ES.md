# Reglas de Gobernanza - Blue Jax MLS

## Resumen Ejecutivo

Este documento contiene la documentación legal y técnica completa de todas las reglas de gobernanza implementadas en el sistema Blue Jax MLS. Estas reglas aseguran la integridad de datos, derechos de propiedad de corredores y transparencia del sistema.

**Versión**: 1.4.2  
**Última Actualización**: 6 de Febrero, 2026  
**Jurisdicción**: Chihuahua, México

---

## Reglas Fundamentales (CORE)

### CORE_001: Inmutabilidad de Versión de Listado

**Tipo**: BLOQUEO | **Estado**: ACTIVA | **Severidad**: CRÍTICA

#### Descripción
Previene la modificación de campos bloqueados en listados Verificados. Una vez que un listado alcanza el estado "VERIFICADO", ciertos campos críticos se vuelven inmutables para preservar la integridad de datos y el rastro de auditoría.

#### Justificación Legal
Bajo la ley inmobiliaria mexicana (Ley Federal de Corredores Inmobiliarios), los registros de propiedades verificadas deben mantener un rastro de auditoría inmutable. Esta regla asegura cumplimiento con:
- **Artículo 23**: Representación veraz de datos de propiedad
- **Artículo 45**: Requisitos de mantenimiento de registros
- Estándares de protección al consumidor de PROFECO

#### Campos Protegidos
Cuando un listado es marcado como VERIFICADO, los siguientes campos se vuelven inmutables:
- Dirección de la propiedad
- Tamaño del lote / metros cuadrados
- Identificador legal de propiedad
- Fecha de listado original
- Marca de tiempo de verificación
- ID del agente verificador

#### Lógica de Negocio
```
SI estado_listado === "VERIFICADO" ENTONCES
  SI intentando modificar campos bloqueados ENTONCES
    BLOQUEAR acción
    Registrar evento de auditoría
    Notificar administrador del sistema
  FIN SI
FIN SI
```

#### Ejemplos

**✅ PERMITIDO**:
- Actualizar precio en listado verificado
- Agregar nuevas fotos
- Modificar texto de descripción
- Cambiar estado de disponibilidad

**❌ BLOQUEADO**:
- Cambiar dirección de propiedad en listado verificado
- Modificar metros cuadrados después de verificación
- Alterar fecha de listado original
- Cambiar agente verificador

#### Consecuencias de Violación
- **Automatizado**: La acción es bloqueada inmediatamente
- **Registro de Auditoría**: Violación registrada con ID del actor, marca de tiempo, cambios intentados
- **Escalación**: Violaciones múltiples disparan revisión de administrador
- **Legal**: Puede constituir fraude bajo Artículo 388-bis del Código Penal

---

### CORE_002: Cumplimiento de Propiedad del Corredor

**Tipo**: BLOQUEO | **Estado**: ACTIVA | **Severidad**: CRÍTICA

#### Descripción
Sólo el corredor propietario designado puede modificar un listado comercial. Esta regla hace cumplir el principio legal de que los corredores retienen derechos exclusivos para administrar sus propios listados.

#### Justificación Legal
Basado en:
- **Ley Federal de Correduría Pública Artículo 12**: Exclusividad de corredor
- **Código de Comercio Artículo 75**: Atribución de actos comerciales
- Estándares de ética profesional (Código de Ética AMPI)

#### Lógica de Negocio
```
SI acción === "MODIFICAR_LISTADO" ENTONCES
  SI usuario.id !== listado.propietarioId ENTONCES
    SI usuario.rol !== "ADMIN_SISTEMA" ENTONCES
      BLOQUEAR acción
      Registrar intento no autorizado
      Notificar propietario del listado
    FIN SI
  FIN SI
FIN SI
```

#### Acciones Protegidas
- Editar detalles del listado
- Cambiar precio
- Modificar estado de propiedad (activo/inactivo)
- Eliminar listado
- Transferir propiedad

#### Rastro de Auditoría
Todas las verificaciones de propiedad son registradas con:
- ID del actor y rol
- ID del listado e ID del propietario
- Marca de tiempo del intento
- Acción intentada
- Razón del bloqueo

---

## Reglas de Calidad (QUAL)

### QUAL_005: Reducción de Datos Scrapeados

**Tipo**: REDUCCIÓN | **Estado**: ACTIVA | **Severidad**: MEDIA

#### Descripción
Reduce automáticamente el puntaje de confianza de feeds de ingesta scrapeados para contabilizar potenciales problemas de calidad de datos.

#### Fundamento
Los datos de fuentes externas (scrapers web, feeds de terceros) no han sido verificados por el sistema y pueden contener:
- Precios desactualizados
- Medidas incorrectas
- Descripciones engañosas
- Listados duplicados
- Contenido fraudulento

#### Lógica de Negocio
```
SI listado.fuente === "SCRAPEADO" O listado.fuente === "FEED_EXTERNO" ENTONCES
  listado.puntajeConfianza = min(listado.puntajeConfianza, 60)
  listado.requiereVerificación = verdadero
  Agregar etiquetas de advertencia
FIN SI
```

#### Impactos en Puntaje de Confianza
- **Entrada Manual**: Puntaje de confianza predeterminado 80
- **Datos Scrapeados**: Puntaje de confianza máximo 60
- **Externo No Verificado**: Puntaje de confianza máximo 50
- **Después de Verificación**: Puede alcanzar 100

#### Fuentes Scrapeadas Típicas
- Mercado Libre (plataforma de e-commerce)
- Sistemas MLS de la competencia
- Portales inmobiliarios (Vivanuncios, Inmuebles24)
- Marketplace de redes sociales

---

### QUAL_006: Requisitos de Exposición Pública

**Tipo**: ADVERTENCIA | **Estado**: INACTIVA | **Severidad**: BAJA

#### Descripción
Asegura calidad mínima de fotos y descripción para visibilidad pública. Esta regla está actualmente **DESACTIVADA** durante el lanzamiento inicial de la plataforma.

#### Requisitos (cuando está activa)
Para visibilidad pública, el listado debe tener:
- **Mínimo**: 3 fotos
- **Recomendado**: 6+ fotos
- **Descripción**: Al menos 100 caracteres
- **Detalles Clave**: Precio, ubicación, tipo de propiedad

#### Por Qué Está Inactiva Actualmente
Desactivada durante el lanzamiento inicial de la plataforma para fomentar la adopción de corredores. Será reactivada después de:
- 90% de incorporación de corredores completada
- Campaña educativa sobre mejores prácticas
- Herramientas proporcionadas para carga fácil de fotos

#### Reactivación Planeada
- **Fecha Objetivo**: Q2 2026
- **Cambio de Tipo**: ADVERTENCIA → BLOQUEO para listados premium
- **Protección de Derechos Adquiridos**: Listados existentes obtienen período de gracia de 60 días

---

## Proceso de Modificación de Reglas

### Proponer Cambios de Reglas

1. **Propuesta**: Propuesta escrita con justificación de negocio
2. **Revisión Legal**: Equipo legal revisa implicaciones de cumplimiento
3. **Retroalimentación de Interesados**: Período de retroalimentación de corredores de 30 días
4. **Evaluación Técnica**: Ingeniería evalúa implementación
5. **Aprobación**: Requiere voto de 2/3 del consejo de gobernanza
6. **Implementación**: Lanzamiento por etapas con monitoreo

### Control de Versiones
- Todas las reglas tienen versión (actual: v1.4.2)
- Cambios documentados en CHANGELOG.md
- Las reglas no pueden aplicarse retroactivamente
- Cláusulas de derechos adquiridos obligatorias para reglas de BLOQUEO

### Modificaciones de Emergencia
En caso de problemas críticos de seguridad o legales:
- El CTO puede desactivar reglas temporalmente
- Debe ser ratificado dentro de 72 horas
- Todas las partes afectadas notificadas inmediatamente

---

## Cumplimiento Legal

### Ley Inmobiliaria Mexicana
Este sistema cumple con:
- **Ley Federal de Correduría Pública**
- **Código Penal** (prevención de fraude)
- **Ley Federal de Protección de Datos Personales** (LFPDPPP)
- Estándares de protección al consumidor de **PROFECO**

### Protección de Datos
- Todos los registros de auditoría encriptados en reposo
- Datos personales minimizados en registros
- Derecho a eliminación honrado (estilo GDPR)
- Cumplimiento de transferencia de datos transfronteriza

### Estándares Profesionales de Corredores
Alineado con:
- **AMPI** (Asociación Mexicana de Profesionales Inmobiliarios) Código de Ética
- **NAR** (National Association of Realtors) mejores prácticas
- Requisitos locales del colegio inmobiliario de Chihuahua

---

## Contacto y Soporte

**Comité de Gobernanza**:  
Email: governance@bluejax.ai  
Dirección: Av. Universidad, Chihuahua, México

**Departamento Legal**:  
Email: legal@bluejax.ai  
Teléfono: +52 (614) 123-4567

**Soporte Técnico**:  
Email: support@bluejax.ai  
Portal: https://support.bluejax.ai

---

**Versión del Documento**: 1.0  
**Fecha Efectiva**: 6 de Febrero, 2026  
**Próxima Revisión**: 1 de Mayo, 2026
