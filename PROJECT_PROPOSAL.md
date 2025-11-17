# EMPRESA DE DISEÑO Y SERVICIOS DE INGENIERÍA UEB INFORMÁTICA PINAR DEL RÍO

## PROPUESTA DE PROYECTO PACTA

### Plataforma de Automatización y Control de Contratos Empresariales Versión de escritorio

**English Summary:** This project proposal outlines the development of PACTA, a desktop application for automating and controlling the lifecycle of business contracts and supplements. Designed for offline operation, PACTA aims to centralize contract management, reduce manual errors, and improve traceability in Cuban enterprise environments. The proposal covers project phases, team, documentation, technical architecture using Electron, React, and SQLite, economic analysis, risks, and implementation methodology using Scrum.

## Índice

1. Introducción
2. Fases por la que Transcurrirá el Proyecto
   2.1. Fase Inicial: Concebir e Iniciar el Proyecto
   2.2. En la Gestión de Proyecto
   2.3. En la Ingeniería
   2.4. Desarrollo
3. Equipo de Trabajo para la Creación de PACTA
4. Documentación
   4.1. Documentación que Deben Entregar los Clientes en la Fase Inicial
   4.2. Entrega de Documentación Inicial del Proyecto por Parte del Grupo de Desarrollo
5. Definir Formalmente la Creación del Proyecto
6. Descripción y Resumen del Proyecto
   6.1. Descripción y resumen del proyecto
   6.2. Resumen de la solución propuesta
7. Importancia y Beneficios
   7.1. Importancia
   7.2. Beneficios esperados
   7.3. Medición del éxito
8. Tecnologías y Arquitectura
   8.1. Tecnologías a Utilizar
   8.2. Comparativa de soluciones tecnológicas
   8.3. Justificación de las Herramientas Seleccionadas
   8.4. Estructura y arquitectura del Proyecto
   8.5. Escalabilidad del proyecto
9. Antecedentes del Proyecto
10. Impacto de No Resolver el Problema
11. Planificación y Metodología
    11.1. Plan de aplicación, cronograma y metodología a utilizar
    11.2. Cronograma
    11.3. Diagrama de Gantt para la estimación del trabajo del proyecto
    11.4. Diagrama de arquitectura del sistema
    11.5. Diagrama de flujo del proceso de PACTA
12. Aspectos Económicos y Recursos
    12.1. Presupuesto y costes
    12.2. Evaluación del Impacto Económico
13. Riesgos y Contingencias
14. Consideraciones Adicionales
15. Conclusiones
16. Referencias

# Introducción

El presente documento detalla la propuesta de proyecto para el desarrollo e implementación de PACTA (Plataforma de Automatización y Control de Contratos Empresariales), una aplicación de escritorio diseñada para optimizar la gestión del ciclo de vida de contratos y suplementos en entornos empresariales, con un enfoque particular en la operación offline.

# Fases por la que Transcurrirá el Proyecto

El proyecto PACTA transcurrirá por las siguientes fases principales:

## Fase Inicial: Concebir e Iniciar el Proyecto

- Definir formalmente la creación del proyecto, el equipo de trabajo y los objetivos.
- Obtener del cliente la documentación inicial necesaria: modelos de contratos, tipos de suplementos, glosario de campos, y especificación detallada de requisitos y funcionalidades.
- Capacitar al personal del equipo de desarrollo en las tecnologías y metodologías a emplear.
- Identificar y socializar el conocimiento relevante.
- Proteger los bienes y la información suministrada por el cliente.

## En la Gestión de Proyecto

- Definir y formalizar el alcance y los objetivos del proyecto PACTA.
- Realizar estimaciones detalladas de tiempo y recursos.
- Definir el ciclo de vida del proyecto, coherente con la metodología ágil (Scrum).
- Elaborar un plan de proyecto detallado, incluyendo cronograma, hitos y actividades clave.
- Monitorear y controlar continuamente el progreso del proyecto, gestionando desviaciones y problemas.
- Identificar necesidades de adquisición (aunque se prevé uso de software libre).
- Seleccionar proveedores y establecer acuerdos si fuera necesario.
- Gestionar cambios en los requisitos a través de un proceso controlado.

## En la Ingeniería

- Gestionar y refinar los requisitos funcionales y no funcionales de PACTA.
- Desarrollar los requisitos técnicos y agruparlos según la arquitectura definida.
- Definir y aprobar la arquitectura del sistema (capas, seguridad, base de datos).
- Diseñar la estructura de la base de datos local (SQLite).
- Diseñar la interfaz de usuario (UI) y la experiencia de usuario (UX).

## Desarrollo

- Construcción iterativa de los módulos y componentes de PACTA según las prioridades establecidas (Gestor de Contratos, Dashboard, Notificaciones, Suplementos, Gestión de Usuarios, Repositorio).
- Integración continua de los diferentes componentes.
- Realización de pruebas internas (QA) y con usuarios finales (UAT).
- Despliegue de la aplicación final y capacitación a usuarios.

# Equipo de Trabajo para la Creación de PACTA

El equipo de trabajo involucrado en el proyecto PACTA es el siguiente:

| Rol | Nombre | Contacto |
|-----|--------|----------|
| Gestor de Documentación, Información, Coordinación, Calidad y Seguridad | Daynee Calle Díaz | daynee.calle@ids.alinet.cu |
| Administrador de Proyecto | Jelvys Triana Castro | jelvys.triana@ids.alinet.cu |
| Jefe de Proyecto | Jelvys Triana Castro | jelvys.triana@ids.alinet.cu |
| Desarrollador Front-end / Integración Electron | Jelvys Triana Castro | jelvys.triana@ids.alinet.cu |
| Desarrollador Back-end / Base de datos SQLite | Raciel Reyes Carballo | raciel.reyes@ids.alinet.cu |
| QA / Seguridad | Daynee Calle Díaz | daynee.calle@ids.alinet.cu |
| Gestor de Configuración (Control de versiones y empaquetado) | Raciel Reyes Carballo | raciel.reyes@ids.alinet.cu |
| Gestor de Configuración (Entrega de builds y releases) | Jelvys Triana Castro | jelvys.triana@ids.alinet.cu |
| Responsable principal frente a clientes / usuarios finales | Daynee Calle Díaz | daynee.calle@ids.alinet.cu |

Grupo de Expertos / Usuarios Finales:
- Caridad Castro Hernández – Especialista C en Recursos Humanos (caridad.castro@ids.alinet.cu)
- Ivania Loaces Mariño – Contador C (ivania.loaces@ids.alinet.cu)
- Melissa
- Rodolfo
- Estrella

# Documentación

## Documentación que Deben Entregar los Clientes en la Fase Inicial

- Modelos de contrato
- Tipos de contratos y suplementos
- Glosario de campos
- Especificación de requisitos o funcionalidades
- Especificación del entorno donde se usará la aplicación.
- Prioridades de los módulos a desarrollar.
- Planificar un cronograma de encuentros con los expertos para un mejor entendimiento del negocio.
- Datos de contacto de los expertos (correo y número de teléfono).

## Entrega de Documentación Inicial del Proyecto por Parte del Grupo de Desarrollo

- Ficha Técnica de la aplicación PACTA.
- Instalador de PACTA (aplicación de escritorio).
- Manual de Ayuda (usuario y técnico).
- Manual de Usuario paso a paso.
- Manual Técnico de instalación y configuración.
- Guías rápidas y presentaciones de formación para usuarios finales.

# Definir Formalmente la Creación del Proyecto

Mediante la presente se formaliza el inicio del proyecto PACTA (Plataforma de Automatización y Control de Contratos Empresariales), cuyo objetivo es facilitar y centralizar la gestión de contratos y sus suplementos en una única herramienta de escritorio, permitiendo crear, editar, aprobar y reportar el ciclo de vida contractual, incluso sin conexión a Internet.

# Descripción y Resumen del Proyecto

## Descripción y resumen del proyecto

El proyecto PACTA consiste en el desarrollo de una aplicación de escritorio robusta y fácil de usar para la gestión integral de contratos empresariales. La herramienta abordará la problemática de las gestiones manuales (Excel, papel) que conllevan alto riesgo de omisión de vencimientos y pérdida de trazabilidad, así como la falta de un repositorio único y seguro que funcione offline, crucial en entornos con conectividad limitada. PACTA ofrecerá operación offline, notificaciones automáticas de vencimiento, un historial inmutable de suplementos y una interfaz moderna.

## Resumen de la solución propuesta

PACTA es una solución de escritorio que centraliza la gestión de contratos en una base de datos SQLite local. Permite la creación, edición, búsqueda y filtrado de contratos y suplementos. Incluye notificaciones configurables para vencimientos, un dashboard con estadísticas, gestión de usuarios y roles, y un repositorio local de documentos con respaldo automático. La aplicación está empaquetada para escritorio utilizando Electron, con un frontend desarrollado en Vite.js (React) y TypeScript, estilizado con Tailwind CSS y ShadcnUI. La autenticación se gestiona mediante JWT con hashing y salting de contraseñas.

# Importancia y Beneficios

## Importancia

La implementación de PACTA es de suma importancia para las organizaciones que actualmente gestionan sus contratos de forma manual o con herramientas inadecadas. Resolverá problemas críticos como la omisión de vencimientos, la pérdida de trazabilidad y la falta de acceso a la información en entornos sin conexión. PACTA proporcionará un repositorio seguro y centralizado, mejorando la eficiencia operativa y la seguridad de la información contractual.

## Beneficios esperados

- Reducción de hasta 70% en tiempo de gestión manual de contratos.
- Eliminación casi total de vencimientos no detectados gracias a las notificaciones automáticas.
- Mejora significativa en la trazabilidad contractual y facilitación de auditorías.
- Operación offline adaptada al contexto cubano, garantizando la continuidad del trabajo.
- Mejora en la seguridad y organización de la información contractual.

## Medición del éxito

El éxito del proyecto se medirá a través de:
- KPIs de tiempo promedio de creación/aprobación de contratos.
- Porcentaje de notificaciones atendidas antes del vencimiento.
- Nivel de satisfacción de usuarios finales (encuestas).
- Cumplimiento del cronograma y presupuesto del proyecto.

# Tecnologías y Arquitectura

## Tecnologías a Utilizar

Se han seleccionado las siguientes tecnologías para el desarrollo de PACTA, considerando sus características, ventajas y adecuación al contexto del proyecto:

### Frontend: Vite.js (React), TypeScript, Tailwind CSS, ShadcnUI

**Características y Ventajas:**
- **Vite.js:** es una herramienta de build y servidor de desarrollo ultrarrápida para proyectos modernos. Ofrece arranque instantáneo gracias al uso de módulos ES en desarrollo, con un Hot Module Replacement (HMR) muy veloz que permite una experiencia de desarrollo fluida. La compilación para producción es altamente optimizada mediante Rollup, generando código eficiente y ligero. Vite incluye soporte nativo para TypeScript, JSX, CSS y otros formatos sin necesidad de configuración adicional. Su ecosistema de plugins es robusto y fácil de extender, y su configuración flexible permite personalizar fácilmente el comportamiento del proyecto. Es ideal para aplicaciones modernas que buscan velocidad y eficiencia desde el desarrollo hasta la producción.
- **React:** es una librería de JavaScript diseñada para construir interfaces de usuario interactivas y eficientes. Está basada en un sistema de componentes reutilizables, lo que permite mejorar la organización y escalabilidad del código. Su sistema de reconciliación permite un renderizado eficiente y reactivo, lo que mejora el rendimiento general de la aplicación.
- **TypeScript:** es un superset de JavaScript que añade tipado estático. Esto mejora la detectabilidad de errores en tiempo de desarrollo, facilita la mantenibilidad del código y optimiza el trabajo en equipo, especialmente en proyectos grandes donde la colaboración entre varios desarrolladores es constante.
- **Tailwind CSS:** es un framework CSS de utilidad primero que permite construir diseños complejos rápidamente aplicando clases directamente en el HTML o JSX. Esto agiliza el desarrollo del frontend y promueve un diseño visual consistente en toda la aplicación. Además, permite mantener un sistema de diseño coherente sin tener que escribir CSS personalizado desde cero.
- **ShadcnUI:** es una colección de componentes de interfaz construidos con Radix UI y estilizados con Tailwind CSS. Proporciona componentes accesibles y totalmente personalizables que aceleran la construcción de interfaces modernas. Su diseño moderno y su integración fluida con Tailwind facilitan la adaptación visual de los componentes al tema del proyecto sin fricciones.

### Contenedor de Escritorio: Electron

**Características y Ventajas:**
- **Electron:** Permite construir aplicaciones de escritorio multiplataforma utilizando tecnologías web (HTML, CSS, JavaScript). Ideal para aprovechar el conocimiento del equipo en desarrollo web para crear una aplicación de escritorio nativa.

### Base de Datos: SQLite local

**Características y Ventajas:**
- **Base de datos embebida, ligera y sin servidor.** Ideal para aplicaciones de escritorio que requieren almacenar datos localmente sin depender de un servidor de base de datos externo.
- **Fácil de configurar y gestionar.** Almacena la base de datos en un único archivo.
- **Soporta transacciones ACID,** garantizando la integridad de los datos.

### Autenticación: JSON Web Tokens (JWT)

**Características y Ventajas:**
- **Método estándar para la transmisión segura de información** entre partes como un objeto JSON.
- **Permite la autenticación sin estado en el servidor** (o en este caso, en la lógica de negocio), ya que la información del usuario y sus permisos están contenidos en el token firmado.
- **Combinado con hashing y salting de contraseñas,** proporciona un mecanismo robusto para la seguridad de las credenciales de usuario.

## Comparativa de soluciones tecnológicas

Aunque PACTA es una aplicación de escritorio, la elección de tecnologías web para su desarrollo (a través de Electron) implica considerar alternativas comunes en el desarrollo de aplicaciones.

| Criterio | Herramienta Seleccionada (PACTA) | Alternativa Común 1 (Escritorio Nativo) | Alternativa Común 2 (Web App) | Ventajas del Sistema Propuesto (PACTA) |
|----------|---------------------------------|----------------------------------------|-------------------------------|---------------------------------------|
| Tipo de Aplicación | Escritorio (con tecnologías web) | Escritorio Nativo (ej: C#, JavaFX) | Aplicación Web | Combina la operación offline de escritorio con la agilidad de desarrollo web y una vista y experiencia moderna. |
| Frontend | Vite.js (React), TypeScript, etc. | C# (WPF/WinForms), JavaFX, C++ (Qt) | Angular, Vue.js, React (sin Electron) | Aprovecha el ecosistema y las herramientas de desarrollo web modernas. |
| Backend/Lógica | JavaScript/TypeScript (en Electron) | C#, Java, C++ | Node.js, Python (Django/Flask), .NET Core | Desarrollo unificado en un solo lenguaje (JavaScript/TypeScript) para frontend y lógica de escritorio. |
| Base de Datos | SQLite local | SQLite local, bases de datos nativas | PostgreSQL, MySQL, SQL Server, MongoDB | Base de datos embebida ideal para operación offline y datos locales. |
| Conectividad | Opera Offline y Online | Offline | Requiere Internet continua | Permite trabajar sin conexión, crucial en entornos con conectividad limitada. |
| Distribución | Instalador (.exe/.msi) | Instalador (.exe/.msi) | Despliegue en servidor | Control total sobre la instalación y el entorno del usuario. |

## Justificación de las Herramientas Seleccionadas

La selección de Vite.js, React, TypeScript, Tailwind CSS y ShadcnUI para el frontend, encapsulados en Electron, se justifica por varios factores:
- **Aprovechamiento de habilidades:** El equipo de desarrollo posee experiencia en tecnologías web modernas, lo que permite construir una aplicación de escritorio robusta sin necesidad de aprender lenguajes o frameworks nativos complejos.
- **Desarrollo rápido y eficiente:** La combinación de React para componentes, TypeScript para robustez, Tailwind CSS para estilizado ágil y ShadcnUI para componentes pre-construidos acelera significativamente el proceso de desarrollo del frontend.
- **Interfaz de usuario moderna y accesible:** Estas tecnologías facilitan la creación de una interfaz de usuario atractiva, responsiva y con consideraciones de accesibilidad.
- **Operación offline:** Electron permite que la aplicación se ejecute localmente, interactuando directamente con el sistema de archivos y la base de datos SQLite sin necesidad de conexión constante a un servidor.
- **Base de Datos local:** SQLite es la elección natural para una aplicación de escritorio que necesita almacenar datos localmente de manera fiable y sin dependencias de infraestructura de servidor.
- **Seguridad:** JWT, combinado con prácticas seguras de manejo de contraseñas, proporciona un mecanismo de autenticación adecuado para una aplicación de escritorio con múltiples usuarios locales.

Esta combinación tecnológica ofrece el balance ideal entre la agilidad del desarrollo web y las capacidades de una aplicación de escritorio, adaptándose perfectamente a los requisitos de operación offline y al contexto técnico del proyecto.

## Estructura y arquitectura del Proyecto

La arquitectura propuesta para PACTA se basa en un diseño por capas, lo que promueve la modularidad, la separación de responsabilidades, la mantenibilidad y la escalabilidad (aunque la escalabilidad horizontal es inherente a las aplicaciones de escritorio, la arquitectura facilita futuras extensiones o integraciones).

(See Anexo #1)

Las capas principales son:

1. **Capa de Presentación (UI/UX):** Es la capa más externa, responsable de la interacción directa con el usuario. Incluye la interfaz gráfica de usuario (GUI) desarrollada con Vite.js, React, etc., ejecutándose dentro del contenedor Electron. Su función es mostrar la información al usuario y capturar sus entradas. Se comunica con la Capa de Lógica de Negocio para obtener y enviar datos.
2. **Capa de Lógica de Negocio:** Contiene las reglas de negocio, procesos y lógica central de la aplicación. Es el "cerebro" de PACTA, coordinando las operaciones, validando datos y aplicando las políticas de gestión contractual. Recibe peticiones de la Capa de Presentación y se comunica con la Capa de Acceso a Datos para obtener o guardar información.
3. **Capa de Acceso a Datos:** Esta capa se encarga de interactuar directamente con la base de datos. Proporciona una interfaz abstracta para que la Capa de Lógica de Negocio pueda acceder a los datos sin necesidad de conocer los detalles específicos de la base de datos subyacente (SQLite en este caso). Incluye la lógica para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar). Depende de la Capa de Persistencia.
4. **Capa de Persistencia:** Representa el almacenamiento físico de los datos. En PACTA, corresponde al archivo de base de datos SQLite en el sistema de archivos local del usuario. Es la capa más interna y no tiene dependencias de otras capas.

**Fundamentación de la Arquitectura por Capas:**
- **Separación de Responsabilidades:** Cada capa tiene un rol específico y bien definido, lo que facilita el desarrollo, las pruebas y el mantenimiento.
- **Modularidad:** Permite modificar o reemplazar una capa (por ejemplo, cambiar la base de datos subyacente en el futuro) sin afectar significativamente las otras capas.
- **Mantenibilidad:** Al estar el código organizado lógicamente, es más fácil entender, depurar y modificar la aplicación.
- **Reutilización:** La lógica de negocio puede ser potencialmente reutilizada si en el futuro se decidiera desarrollar una interfaz diferente (por ejemplo, una API).

Además de la arquitectura por capas, se seguirán principios de diseño como SOLID para asegurar un código limpio, flexible y extensible.

## Escalabilidad del proyecto

Aunque PACTA en su versión 1.0 es una aplicación de escritorio monousuario sin concurrencia, la arquitectura y las tecnologías seleccionadas sientan las bases para una potencial escalabilidad futura:
- **Escalabilidad Vertical:** La aplicación puede beneficiarse de hardware más potente en la máquina del usuario (CPU, RAM, SSD), lo que mejoraría el rendimiento al manejar grandes volúmenes de datos contractuales.
- **Escalabilidad Funcional:** La arquitectura por capas y el diseño modular facilitan la adición de nuevas funcionalidades (módulos, reportes, integraciones) en futuras versiones sin requerir una reestructuración completa del código base. Los módulos se pueden desarrollar de forma relativamente independientes.
- **Potencial Escalabilidad Horizontal (Futuro):** Aunque la versión inicial es monousuario, la elección de tecnologías web y una arquitectura clara podría, en fases posteriores y si fuera necesario, explorar modelos de sincronización de datos o incluso una versión multiusuario cliente-servidor, aprovechando la base de código existente. La base de datos SQLite, aunque local, es eficiente para volúmenes de datos considerables en una aplicación de escritorio. Para escenarios de sincronización o multiusuario concurrente a gran escala, se podría considerar la migración a una base de datos cliente-servidor en el futuro, lo cual sería facilitado por la separación de la Capa de Acceso a Datos.

# Antecedentes del Proyecto

En el entorno empresarial actual, la gestión de contratos a menudo se realiza mediante métodos manuales, como hojas de cálculo en Excel o expedientes físicos en papel. Esta práctica, aunque común, presenta desafíos significativos. La dependencia de procesos manuales incrementa el riesgo de errores humanos, especialmente en la omisión de fechas clave como vencimientos o renovaciones automáticas. La falta de un sistema centralizado y estructurado dificulta enormemente la trazabilidad de las modificaciones (suplementos o adendas) y el historial completo de cada contrato. Además, en contextos con conectividad a Internet limitada o inestable, el acceso a repositorios centralizados basados en la nube o a sistemas ERP que requieren conexión constante se convierte en un obstáculo. La información contractual, vital para la operación diaria y la toma de decisiones, puede volverse inaccesible o difícil de gestionar eficientemente. La ausencia de una herramienta especializada que combine la facilidad de uso, la operación offline y funcionalidades específicas para el ciclo de vida contractual genera ineficiencias operativas, riesgos legales y financieros (por incumplimiento de plazos) y una pérdida de control sobre uno de los activos más importantes de una empresa: sus acuerdos contractuales. PACTA surge como respuesta directa a esta problemática, buscando modernizar y optimizar la gestión contractual en estos entornos.

# Impacto de No Resolver el Problema

No abordar la problemática de la gestión manual o inadecuada de contratos tendría un impacto negativo significativo en las organizaciones:
- **Riesgos Financieros y Legales:** La omisión de vencimientos puede llevar a la expiración de contratos importantes, la pérdida de oportunidades de renovación o, peor aún, a renovaciones automáticas no deseadas que generen obligaciones financieras. La falta de trazabilidad dificulta las auditorías y puede complicar la resolución de disputas legales.
- **Ineficiencia Operativa:** La gestión manual consume tiempo y recursos valiosos del personal administrativo y legal, desviándolos de tareas más estratégicas. La búsqueda de información en archivos físicos o múltiples hojas de cálculo es lenta y propensa a errores.
- **Pérdida de Trazabilidad y Control:** Sin un historial inmutable de suplementos y un repositorio centralizado, es difícil saber el estado actual de un contrato, quién realizó la última modificación o acceder rápidamente a versiones anteriores. Esto debilita el control interno y la visibilidad sobre los compromisos contractuales.
- **Vulnerabilidad en Entornos Offline:** La dependencia de soluciones que requieren conexión a Internet deja a las organizaciones vulnerables en situaciones de conectividad limitada, impidiendo el acceso a información crítica cuando más se necesita.
- **Dificultad para la Toma de Decisiones:** La falta de acceso rápido a métricas y reportes sobre el estado de los contratos (vencimientos próximos, distribución por tipo/estado, etc.) limita la capacidad de la gerencia para tomar decisiones informadas y estratégicas relacionadas con los acuerdos comerciales.

# Planificación y Metodología

## Plan de aplicación, cronograma y metodología a utilizar

La planificación del proyecto PACTA se basa en un enfoque ágil, utilizando la metodología Scrum. Esta elección se fundamenta en la necesidad de adaptabilidad a posibles cambios en los requisitos, la entrega incremental de valor a los usuarios finales y la promoción de la colaboración constante dentro del equipo de desarrollo y con los stakeholders.

**Metodología de Desarrollo (Scrum):** Scrum es un marco de trabajo para desarrollar y mantener productos complejos. Se caracteriza por ser ligero, fácil de entender, pero difícil de dominar. Promueve la colaboración, la auto-organización y la entrega iterativa de incrementos de producto potencialmente utilizables.
- **Argumentación Teórica:** La elección de Scrum para PACTA se basa en sus principios fundamentales:
  - **Transparencia:** Todos los involucrados (equipo, expertos, stakeholders) tienen visibilidad sobre el progreso del proyecto y el estado del producto.
  - **Inspección:** Se inspecciona frecuentemente el trabajo realizado y el progreso hacia los objetivos para detectar desviaciones indeseadas.
  - **Adaptación:** Si se detectan desviaciones significativas, se ajustan los procesos o el producto lo antes posible para minimizar problemas.
  - **Iteración y Entrega Incremental:** El trabajo se divide en Sprints de duración fija (2 semanas en este proyecto), al final de los cuales se entrega un incremento de software funcional. Esto permite obtener feedback temprano y validar supuestos.
  - **Roles Definidos:** Scrum define roles claros (Product Owner, Scrum Master, Equipo de Desarrollo) con responsabilidades específicas, lo que facilita la organización y la comunicación.

La implementación de Scrum en PACTA permitirá gestionar la complejidad del desarrollo de una aplicación de escritorio con múltiples funcionalidades, asegurando que el producto final se alinee con las necesidades reales de los usuarios y se entregue de manera eficiente.

## Cronograma

El cronograma propuesto para el proyecto PACTA, basado en Sprints de 2 semanas, es el siguiente:

| Fase | Duración Estimada | Entregables |
|------|-------------------|-------------|
| Requisitos y Diseño | 4 semanas | Documentos de requisitos, prototipos de UI |
| Desarrollo MVP | 8 semanas | Módulo de Contratos + Base de Datos (SQLite) |
| Desarrollo Complementario | 6 semanas | Dashboard, Notificaciones, Suplementos |
| Pruebas Internas (QA) | 4 semanas | Informes de pruebas y correcciones |
| Pruebas con Usuarios (UAT) | 3 semanas | Feedback y ajustes finales |
| Despliegue y Formación | 2 semanas | Instalador final + capacitación |

Fechas críticas:
- **Inicio del Proyecto:** Fecha de formalización
- **Versión Beta:** Aproximadamente 4 meses después del inicio del proyecto. Esta versión incluirá el MVP (Gestor de Contratos con DB) y funcionalidades complementarias (Dashboard, Notificaciones, Suplementos) para pruebas tempranas con usuarios.
- **Entrega Final (Versión 1.0):** Aproximadamente 6 meses después del inicio del proyecto. Esta versión incluirá todos los módulos planificados (Gestión de Usuarios, Repositorio) y habrá pasado por las fases de pruebas internas y UAT.

Este cronograma es una estimación inicial y podrá ajustarse en función de los resultados de los Sprints, el feedback de los usuarios y la gestión de cambios, manteniendo la flexibilidad inherente a la metodología ágil.

## Diagrama de Gantt para la estimación del trabajo del proyecto

(See Anexo #2)

**Explicación del Diagrama de Gantt:** Este diagrama de Gantt presenta una representación visual del cronograma del proyecto PACTA. En el eje vertical se listan las fases principales del proyecto, mientras que el eje horizontal representa el tiempo, dividido en semanas o meses. Cada barra horizontal en el diagrama corresponde a una fase o tarea específica, indicando su duración estimada y sus fechas de inicio y fin. Las dependencias entre tareas (si las hay) se pueden representar con flechas. Los hitos clave, como la "Versión Beta" y la "Entrega Final", se marcan con símbolos específicos.

La utilidad de este diagrama radica en su capacidad para:
- **Visualizar el cronograma:** Permite tener una vista clara de la secuencia de actividades y la duración total del proyecto.
- **Identificar dependencias:** Ayuda a comprender qué tareas deben completarse antes de que otras puedan comenzar.
- **Comunicar el plan:** Facilita la comunicación del cronograma y los plazos a todos los miembros del equipo y stakeholders.
- **Monitorear el progreso:** Permite comparar el progreso real con el plan inicial y identificar posibles retrasos.

El diagrama de Gantt es una herramienta fundamental en la gestión de proyectos, proporcionando una hoja de ruta visual para la ejecución de PACTA.

## Diagrama de arquitectura del sistema

(See Anexo #1)

**Explicación del Diagrama de Arquitectura del Sistema (por Capas):** Este diagrama ilustra la arquitectura lógica de PACTA, basada en un diseño por capas. Cada caja o sección en el diagrama representa una capa distinta del sistema, con responsabilidades bien definidas. Las flechas entre las capas indican la dirección principal del flujo de información o las dependencias.

Las capas representadas son:
- **Capa de Presentación (UI/UX):** Situada en la parte superior, representa la interfaz de usuario con la que interactúa directamente el usuario final. Incluye todos los elementos visuales y la lógica de interacción del lado del cliente. Su responsabilidad es mostrar la información y capturar las entradas del usuario. Depende de la Capa de Lógica de Negocio.
- **Capa de Lógica de Negocio:** Ubicada debajo de la Capa de Presentación, contiene las reglas de negocio, procesos y lógica central de la aplicación. Es donde se implementan las funcionalidades principales, como la creación, edición y validación de contratos, la gestión de suplementos y la lógica de notificaciones. Actúa como intermediario entre la interfaz de usuario y los datos. Depende de la Capa de Acceso a Datos.
- **Capa de Acceso a Datos:** Esta capa se encarga de interactuar directamente con la base de datos. Proporciona una interfaz abstracta para que la Capa de Lógica de Negocio pueda acceder a los datos sin necesidad de conocer los detalles específicos de la base de datos subyacente (SQLite en este caso). Incluye la lógica para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar). Depende de la Capa de Persistencia.
- **Capa de Persistencia:** Representa el almacenamiento físico de los datos. En PACTA, corresponde al archivo de base de datos SQLite en el sistema de archivos local del usuario. Es la capa más interna y no tiene dependencias de otras capas.

La fundamentación de esta arquitectura por capas ya fue detallada en la sección "Estructura y arquitectura del Proyecto", destacando la separación de responsabilidades, modularidad, mantenibilidad y escalabilidad.

El diagrama visualiza esta estructura lógica, facilitando la comprensión de cómo se organizan y comunican los diferentes componentes del sistema.

## Diagrama de flujo del proceso de PACTA

(See Anexo #3)

**Explicación del Diagrama de Flujo del Proceso de Gestión de Contratos en PACTA:** Este diagrama de flujo ilustrará de manera gráfica los pasos secuenciales y las decisiones clave involucradas en los procesos principales de gestión de contratos dentro de la aplicación PACTA. Utilizará símbolos estándar de diagramas de flujo (óvalos para inicio/fin, rectángulos para procesos, diamantes para decisiones, flechas para la dirección del flujo).

A continuación, se describen textualmente los pasos de algunos de los flujos de trabajo clave que representará este diagrama:

**Flujo: Creación de un Nuevo Contrato**
1. Inicio: El usuario inicia el proceso de creación de un nuevo contrato en la interfaz de PACTA.
2. Ingreso de Datos: El usuario completa los campos requeridos y opcionales del formulario de contrato (partes, objeto, fechas, monto, etc.).
3. Adjuntar Documentos (Opcional): El usuario puede adjuntar archivos relevantes al contrato desde el sistema de archivos local.
4. Validación de Datos: El sistema realiza validaciones sobre los datos ingresados para asegurar su formato y consistencia.
5. Guardar Contrato: Si los datos son válidos, el sistema guarda la información del nuevo contrato en la base de datos SQLite local.
6. Confirmación: El sistema muestra un mensaje de confirmación al usuario indicando que el contrato ha sido creado exitosamente.
7. Fin: El proceso de creación de contrato finaliza.

**Flujo: Adición de un Suplemento (Adenda)**
1. Inicio: El usuario selecciona un contrato existente y elige la opción para agregar un suplemento.
2. Ingreso de Datos del Suplemento: El usuario especifica los detalles del suplemento, incluyendo el campo del contrato que se modifica, el valor anterior, el nuevo valor y la fecha efectiva del cambio.
3. Validación de Datos: El sistema valida la información del suplemento.
4. Registro Inmutable: El sistema registra el suplemento en un historial inmutable asociado al contrato, conservando un registro de todos los cambios.
5. Actualización del Contrato: El sistema actualiza los campos correspondientes en el registro principal del contrato con la nueva información del suplemento.
6. Confirmación: El sistema confirma al usuario que el suplemento ha sido registrado y el contrato actualizado.
7. Fin: El proceso de adición de suplemento finaliza.

**Flujo: Notificación de Vencimiento (Proceso Automático)**
1. Inicio (Proceso Programado): Un proceso interno de PACTA se ejecuta periódicamente (por ejemplo, diariamente).
2. Verificar Vencimientos: El sistema consulta la base de datos para identificar contratos cuyas fechas de vencimiento se aproximan (según la configuración de notificaciones del usuario, ej. 30 días antes).
3. Generar Alerta: Para cada contrato próximo a vencer, el sistema genera una alerta.
4. Mostrar Notificación: La alerta se presenta al usuario a través del feed de actividades en el dashboard o mediante una notificación nativa del sistema operativo (si está configurado y soportado por Electron).
5. Posible Envío de Correo (Futuro): En versiones futuras, se podría integrar el envío de notificaciones por correo electrónico.
6. Fin: El proceso de verificación y notificación finaliza hasta la próxima ejecución programada.

**Flujo: Búsqueda y Visualización de Contratos**
1. Inicio: El usuario accede a la función de búsqueda o listado de contratos.
2. Ingreso de Criterios: El usuario introduce términos de búsqueda o aplica filtros (por estado, tipo, parte, etc.).
3. Consulta a Base de Datos: El sistema ejecuta una consulta en la base de datos SQLite basada en los criterios especificados.
4. Presentación de Resultados: El sistema muestra una lista de contratos que coinciden con la búsqueda/filtro.
5. Selección de Contrato: El usuario selecciona un contrato de la lista.
6. Visualización de detalles: El sistema muestra la información detallada del contrato seleccionado, incluyendo sus suplementos asociados.
7. Fin: El usuario ha visualizado la información del contrato.

La argumentación para incluir este diagrama se basa en que proporciona una comprensión clara y paso a paso de cómo se realizan las operaciones clave en PACTA. Es útil para:
- **Documentar procesos:** Sirve como documentación visual de los flujos de trabajo.
- **Identificar cuellos de botella:** Ayuda a visualizar posibles ineficiencias en el proceso.
- **Facilitar la comunicación:** Permite a los desarrolladores, usuarios y stakeholders entender el funcionamiento del sistema de manera sencilla.
- **Validar requisitos:** Puede ser utilizado para validar que el sistema implementa los procesos de negocio de manera correcta.

Este diagrama se elaborará y refinará durante la fase de requisitos y diseño, en estrecha colaboración con los expertos y usuarios finales, para asegurar que refleje fielmente los flujos de trabajo deseados en la gestión contractual.

# Aspectos Económicos y Recursos

## Presupuesto y costes

La ejecución del proyecto PACTA se basa en el uso de recursos internos de la UEB Informática Pinar del Río y software libre, lo que minimiza los costos de licenciamiento. Sin embargo, existen necesidades de inversión en recursos técnicos y gastos operativos asociados al desarrollo y la implementación.

**Detalle de Recursos y Gastos del Proyecto**

**Recursos Iniciales que Necesitan Aprobación de Presupuesto de Inversión**

| No. | ALCANCE | DESCRIPCIÓN | CARACTERÍSTICAS (mínimas) | OBJETIVO | CANT | UM | VALOR (estimado) |
|-----|---------|-------------|---------------------------|----------|------|----|------------------|
| 1 | Desarrollador | Laptop i7 12ª Gen, 16 GB RAM, 1 TB SSD | Desarrollo óptimo de software con tecnologías modernas | 5 | U | $1,500,000.00 |
| 2 | Proyecto | Split 1 Tonelada | Climatización del área de trabajo | 1 | U | $250,000.00 |
| 3 | Proyecto | Transporte dedicado 5 pasajeros | Facilitar desplazamientos para reuniones, capacitaciones y visitas a clientes | 1 | U | $0.00 |

**TOTAL DE RECURSOS: $1,840,000.00**

**Recursos que No Necesitan Aprobación de Presupuesto de Inversión**

| No. | ALCANCE | DESCRIPCIÓN | CARACTERÍSTICAS (mínimas) | OBJETIVO | CANT | UM | VALOR (estimado) |
|-----|---------|-------------|---------------------------|----------|------|----|------------------|
| 4 | Desarrollador | HDD Externo 1 TB | Almacenamiento portátil y seguro para datos del proyecto | 3 | U | $90,000.00 |

**TOTAL GASTOS: $90,000.00**

**Otros Gastos por Elementos Iniciales**

| No. | ALCANCE | DESCRIPCIÓN | CARACTERÍSTICAS (mínimas) | OBJETIVO | CANT | UM | VALOR (estimado) |
|-----|---------|-------------|---------------------------|----------|------|----|------------------|
| 5 | Proyecto | Viáticos Reglamentados | Alimentación y hospedaje para desplazamientos | 3 | MES | $189,000.00 |
| 6 | Proyecto | Salario Decreto 87 | Remuneración del equipo de desarrollo | 1 | MES | $95,000.00 |
| 7 | Proyecto | Resultado | Remuneración por desarrollo Incentivo por hitos alcanzados | 1 | MES | $140,000.00 |
| 8 | Proyecto | Utilidades | 1 salario Beneficio anual para el equipo | 4 | AÑO | $95,000.00 |
| 9 | Proyecto | Electricidad | Ajustado al plan Consumo eléctrico del área de trabajo | 1 | MES | $2,000.00 |
| 10 | Proyecto | Telefonía fija | Básica Comunicación interna | 1 | MES | $1,000.00 |
| 11 | Proyecto | Combustible | Según viajes planificados Desplazamientos para capacitaciones y reuniones | 1 | AÑO | $14,000.00 |
| 12 | Proyecto | Depreciación | Anual Amortización de equipos | 1 | AÑO | $300,000.00 |
| 13 | Proyecto | Telefonía móvil | Básica Comunicación con equipo y clientes | 1 | MES | $2,170.00 |
| 14 | Proyecto | Conexión de datos | Básica Acceso a internet para desarrollo | 1 | MES | $2,800.00 |
| 15 | Proyecto | Material de oficina | Papel, bolígrafos, tóner, agendas Suministros para documentación | 5 | HOMBRE | $50,000.00 |
| 16 | Proyecto | Otros gastos | Imprevistos Gastos no planificados | 1 | AÑO | $100,000.00 |

**TOTAL GASTOS: $990,970.00**

**TOTAL GENERAL ESTIMADO DEL PROYECTO: $2,830,970.00**

## Evaluación del Impacto Económico

La gestión eficiente de los contratos en las empresas estatales cubanas es un factor clave para garantizar el cumplimiento legal, la optimización de recursos y la reducción de riesgos financieros. Este punto presenta un análisis cuantitativo del impacto económico derivado de la implementación de "PACTA", sustentado en cálculos basados en datos reales y en la consideración de beneficios directos e indirectos.

**Metodología para el Cálculo del Impacto Económico**

Para evaluar el impacto económico se consideraron dos tipos de beneficios: 
- **Beneficios directos:** ahorro en costos laborales y reducción en el consumo de papel para impresión y archivo.
- **Beneficios indirectos:** reducción de errores, mejor control de vencimientos, disminución del riesgo legal y mejora en la eficiencia operativa.

Se utilizaron fórmulas matemáticas simples para cuantificar los ahorros y ganancias mensuales, tomando como referencia datos promedio del contexto empresarial cubano y la tasa de cambio oficial.

**Cálculo de Beneficios Directos**

**Ahorro en Horas de Trabajo**
- Horas trabajadas antes del sistema: $$ H_{antes} = 2 \text{ trabajadores} \times 160 \text{ horas/mes} = 320 \text{ horas/mes} $$
- Horas trabajadas después del sistema: $$ H_{después} = 1 \text{ trabajador} \times 80 \text{ horas/mes} = 80 \text{ horas/mes} $$
- Horas ahorradas: $$ H_{ahorro} = H_{antes} - H_{después} = 320 - 80 = 240 \text{ horas/mes} $$

**Costo Laboral por Hora (en CUP)**
- Salario mensual promedio: 3600 CUP
- Jornada laboral mensual: 160 horas
- Costo por hora: $$ C_h = \frac{3600 \text{ CUP}}{160 \text{ horas}} = 22.5 \text{ CUP/hora} $$

**Ahorro en Costo Laboral (en CUP)** $$ A_{laboral} = H_{ahorro} \times C_h = 240 \times 22.5 = 5400 \text{ CUP/mes} $$

**Ahorro en Papel (en CUP)**
- Consumo mensual de papel antes: 10 kg
- Reducción estimada con sistema: 80%
- Consumo después: $$ P_{después} = 10 \text{ kg} \times 0.20 = 2 \text{ kg} $$
- Papel ahorrado: $$ P_{ahorro} = 10 - 2 = 8 \text{ kg} $$
- Precio del papel: 48 CUP/kg
- Ahorro en papel: $$ A_{papel} = P_{ahorro} \times 48 = 8 \times 48 = 384 \text{ CUP/mes} $$

**Impacto Económico Directo Total** $$ I_{directo} = A_{laboral} + A_{papel} = 5400 + 384 = 5784 \text{ CUP/mes} $$

**Cálculo de Beneficios Indirectos**

**Reducción de Pérdidas por Errores**
Considerando que una mala gestión contractual puede representar hasta el 1% de pérdidas sobre el EBITDA (Ganancias antes de intereses, impuestos, depreciación y amortización) mensual:
- EBITDA mensual estimado: 1,200,000 CUP
- Ahorro por reducción de errores: $$ A_{errores} = 1,200,000 \times 0.01 = 12,000 \text{ CUP/mes} $$

**Evitación de Penalizaciones**
Se estima un ahorro mensual conservador por multas evitadas de: $$ A_{multas} = 50 \text{ USD/mes} \times 120 \text{ CUP/USD} = 6000 \text{ CUP/mes} $$

**Ahorro en Costos Legales**
Reducción de gastos legales por mejor control contractual: $$ A_{legales} = 30 \text{ USD/mes} \times 120 \text{ CUP/USD} = 3600 \text{ CUP/mes} $$

**Incremento por Mayor Rapidez en Gestión**
Incremento en ingresos por acelerar cierre de contratos en un 20%: $$ A_{rapidez} = 50 \text{ USD/mes} \times 120 \text{ CUP/USD} = 6000 \text{ CUP/mes} $$

**Impacto Económico Indirecto Total (en CUP)** $$ I_{indirecto} = A_{errores} + A_{multas} + A_{legales} + A_{rapidez} = 12,000 + 6000 + 3600 + 6000 = 27,600 \text{ CUP/mes} $$

**Impacto Económico Total Mensual** $$ I_{total} = I_{directo} + I_{indirecto} = 5784 + 27,600 = 33,384 \text{ CUP/mes} $$

La implementación de la aplicación "PACTA" genera un impacto económico mensual estimado en aproximadamente 33,384 CUP, combinando ahorros directos en costos laborales y materiales, con beneficios indirectos derivados de la reducción de errores, mejor control de vencimientos, menor riesgo legal y mayor eficiencia operativa. Este resultado evidencia que la inversión en esta herramienta informática no solo optimiza recursos, sino que también protege a la empresa de pérdidas financieras y mejora su competitividad.

# Riesgos y Contingencias

La ejecución de cualquier proyecto de desarrollo de software conlleva riesgos inherentes. A continuación, se detallan los principales riesgos identificados para el proyecto PACTA, su argumentación