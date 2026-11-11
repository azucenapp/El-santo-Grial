// ============================================================================
// ARCHIVO 1: src/dataOposiciones.js
// Contiene los 223 Temas (CAM, SERMAS, Ayto), Diccionarios, 10 Casos y 60 Preguntas
// ============================================================================

export const CAM_GENERAL_TITLES = [
  'La Constitución Española de 1978: Características y estructura. Derechos fundamentales y libertades públicas. Garantías.',
  'La distribución de competencias entre las Administraciones Públicas. Principio de autonomía local.',
  'La Comunidad de Madrid (I): El Estatuto de Autonomía y competencias autonómicas.',
  'La Comunidad de Madrid (II): La Asamblea, el Presidente y el Gobierno de la Comunidad de Madrid.',
  'La Administración Autonómica de la Comunidad de Madrid: organización, estructura y Administración Institucional.',
  'Los servicios de información administrativa, sugerencias, quejas y transparencia en la Comunidad de Madrid (Ley 10/2019).',
  'Las Instituciones de la Unión Europea: Parlamento, Consejo Europeo, Consejo, Comisión y Tribunal de Justicia.',
  'Las fuentes del Derecho Comunitario Europeo: Derecho originario y derivado. Aplicación en las Comunidades Autónomas.',
  'El principio de legalidad y la jerarquía normativa. La Ley, disposiciones con fuerza de ley y el Reglamento.',
  'La Hacienda Pública de la Comunidad de Madrid y el Presupuesto general autonómico (Ley 9/1990).',
  'Ley 39/2015 del Procedimiento Administrativo Común y Ley 40/2015 de Régimen Jurídico del Sector Público.',
  'La responsabilidad patrimonial de las Administraciones Públicas y de las autoridades y personal a su servicio.',
  'Los contratos del sector público (Ley 9/2017 LCSP): tipología, expediente, adjudicación y ejecución.',
  'El personal empleado público: RDL 5/2015 (TREBEP), Ley 1/1986 Función Pública CAM y teletrabajo (Decreto 79/2020).',
  'Protección de datos personales (RGPD y LO 3/2018 LOPDGDD) y Esquema Nacional de Seguridad (RD 311/2022).',
  'Igualdad efectiva (LO 3/2007), Violencia de Género (LO 1/2004 y Ley 5/2005 CAM) y normativa LGTBI (Leyes 2/2016 y 3/2016 CAM).',
];

export const CAM_SPECIFIC_TITLES = [
  'Historia y evolución de los sistemas de protección social en España. Pobreza, exclusión y tasa AROPE.',
  'Política social y Estado del Bienestar: orígenes, modelos de Esping-Andersen y retos actuales.',
  'Política social en la Unión Europea: Pilar Europeo de Derechos Sociales y Fondo Social Europeo Plus (FSE+).',
  'El Sistema Público de Servicios Sociales en España: marco constitucional, leyes autonómicas y Plan Concertado.',
  'Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid: objeto, principios y derechos.',
  'Organización funcional y territorial en la Ley 12/2022 CAM: Atención Social Primaria y Atención Social Especializada.',
  'La Historia Social Única, el Profesional de Referencia y el Plan Individual de Atención Social (PIAS) en la Ley 12/2022.',
  'Cartera de Servicios Sociales de la Comunidad de Madrid: prestaciones garantizadas y condicionadas, de servicio y económicas.',
  'Calidad, inspección, autorización, acreditación y registro de centros de servicios sociales en la Comunidad de Madrid.',
  'Participación ciudadana, Consejo de Servicios Sociales de la CAM e iniciativa social y mercantil.',
  'Financiación de los Servicios Sociales en la Comunidad de Madrid: convenios, conciertos sociales y contratos.',
  'Ética pública, bioética y deontología profesional en los Servicios Sociales de la Comunidad de Madrid.',
  'El Sistema de la Seguridad Social en España (RDL 8/2015 LGSS): modalidades contributiva y no contributiva.',
  'Pensiones no contributivas de jubilación e invalidez: requisitos, gestión y cuantías en la Comunidad de Madrid.',
  'Garantía de ingresos mínimos: Renta Mínima de Inserción (Ley 15/2001 CAM) e Ingreso Mínimo Vital (Ley 19/2021).',
  'Intervención social individualizada (Casework): fases metodológicas, relación de ayuda y acompañamiento social.',
  'Intervención social familiar: tipologías familiares, ciclo vital, mediación familiar (Ley 1/2001 CAM) y apoyo parental.',
  'Exclusión social y emergencias sociales: sinhogarismo, tipología ETHOS y atención a urgencias sociales.',
  'Trabajo Social Comunitario, voluntariado (Ley 45/2015 y Ley 1/2015 CAM) y desarrollo local participativo.',
  'Vivienda e inclusión residencial en la Comunidad de Madrid: vulnerabilidad habitacional y recursos.',
  'Ley 39/2006 de Promoción de la Autonomía Personal y Atención a las personas en situación de Dependencia (LAPAD).',
  'Valoración de la situación de dependencia: Baremo de Valoración (BVD) y Escala de Valoración Específica (EVE) RD 174/2011.',
  'Procedimiento de reconocimiento de la dependencia y elaboración del PIA en la Comunidad de Madrid (Decreto 54/2015).',
  'Demografía del envejecimiento en la Comunidad de Madrid. Envejecimiento activo y prevención de la soledad no deseada.',
  'Recursos de Atención Social a Personas Mayores en la CAM: SAD, Teleasistencia, Centros de Día, Pisos y Residencias (AMAS).',
  'Salud mental y atención psicosocial en la Comunidad de Madrid: organización, estigma y recuperación.',
  'Red Pública de Atención Social a Personas con Enfermedad Mental Grave y Duradera de la CAM (CRPS, CRL, EASC, Mini-residencias).',
  'Discapacidad: RDL 1/2013, Estrategia Española y nuevo baremo de valoración del grado de discapacidad (Real Decreto 888/2022).',
  'Atención Temprana en la Comunidad de Madrid (Decreto 46/2015 y CRECOVI) y Centros Base de Valoración.',
  'Capacidad jurídica y medidas de apoyo a personas adultas con discapacidad: Ley 8/2021 y Agencia AMAPAD (Ley 1/2023 CAM).',
  'Inmigración en España y en la Comunidad de Madrid: LO 4/2000 y nuevo Reglamento de Extranjería (Real Decreto 1155/2024).',
  'Protección internacional, asilo, refugio (Ley 12/2009) y atención a menores extranjeros no acompañados.',
  'Instituciones penitenciarias (LOGP 1/1979), medidas alternativas y reinserción social de personas reclusas.',
  'Minorías étnicas e inclusión social del Pueblo Gitano en la Comunidad de Madrid.',
  'Violencia de género: LO 1/2004, Ley 5/2005 integral de la Comunidad de Madrid y Red de Atención Integral (PMORVG).',
  'Violencias sexuales (LO 10/2022), trata de seres humanos con fines de explotación y recursos especializados en la CAM.',
  'Marco normativo de protección a la infancia y adolescencia: LO 1/1996, LO 8/2021 (LOPIVI) y Ley 4/2023 de la Comunidad de Madrid.',
  'Situaciones de riesgo y desamparo infantil: valoración, comisión de tutela del menor, guarda y tutela administrativa.',
  'Acogimiento familiar y residencial en la Comunidad de Madrid: modalidades, estatuto del acogedor y red de centros.',
  'Adopción nacional e internacional: requisitos de idoneidad, procedimiento y seguimiento postadoptivo en la CAM.',
  'Responsabilidad penal de los menores (LO 5/2000) y Agencia para la Reinserción y Reeducación del Menor Infractor (Ley 3/2004 ARRMI).',
  'Familias numerosas (Ley 40/2003), familias monoparentales y medidas de apoyo a la maternidad y conciliación en la CAM.',
  'Juventud en dificultad social: programas de autonomía y transición a la vida adulta para jóvenes extutelados.',
  'Diversidad sexual y de género: atención social a personas LGTBI en la Comunidad de Madrid (Leyes 2/2016 y 3/2016).',
  'Sistema educativo y equidad: prevención del absentismo escolar, acoso escolar y Equipos de Orientación (EOEP).',
  'Políticas activas de empleo e inserción sociolaboral de colectivos vulnerables (RDL 3/2015, Centros Especiales de Empleo y Empresas de Inserción).',
  'Derecho a la protección de la salud: Ley 14/1986 General de Sanidad, Ley 16/2003 de Cohesión y Ley 41/2002 de Autonomía del Paciente.',
  'Ordenación sanitaria en la Comunidad de Madrid: Ley 12/2001 (LOSCAM) y estructura del Servicio Madrileño de Salud (Decreto 246/2023).',
  'Coordinación sociosanitaria en la Comunidad de Madrid: continuidad asistencial, cuidados paliativos (Ley 4/2017) y pacientes crónicos.',
  'Salud Pública y determinantes sociales de la salud: desigualdades en salud, promoción y educación para la salud.',
  'El Trabajo Social en el ámbito sanitario: funciones en Atención Primaria y Atención Hospitalaria del SERMAS.',
  'Adicciones y drogodependencias: Ley 5/2002 de la Comunidad de Madrid, prevención y Red de atención CAID.',
  'Conductas adictivas sin sustancia (juego patológico y adicciones tecnológicas): prevención e intervención psicosocial.',
  'Concepto, epistemología e historia del Trabajo Social en España y a nivel internacional.',
  'Modelos teóricos de intervención en Trabajo Social: psicodinámico, sistémico-ecológico, centrado en la tarea, crisis y humanista.',
  'El método científico en Trabajo Social: estudio-investigación, diagnóstico social, planificación, ejecución y evaluación.',
  'La investigación social aplicada al Trabajo Social: paradigmas cuantitativo y cualitativo, técnicas e indicadores.',
  'Planificación y evaluación de políticas y proyectos sociales: nivel estratégico, táctico y operativo. Enfoque del Marco Lógico.',
  'Técnicas e instrumentos específicos del Trabajo Social: entrevista, visita domiciliaria, Ficha Social, Historia Social, Informe Social, Genograma y Ecomapa.',
  'Código Deontológico del Trabajo Social, secreto profesional, dilemas éticos y Comités de Ética en Intervención Social.',
  'El trabajo en equipo interdisciplinar, trabajo en red, supervisión profesional y prevención del síndrome de burnout.',
  'Habilidades de comunicación, escucha activa, gestión de conflictos y negociación en la intervención social.',
  'Perspectiva de género e interseccionalidad aplicada al diagnóstico y la intervención del Trabajo Social.',
  'Accesibilidad universal, diseño para todas las personas y apoyos tecnológicos para la autonomía personal.',
  'Sistemas de información en Servicios Sociales, transformación digital, interoperabilidad y brecha digital.',
  'Participación comunitaria, mapeo de activos en salud y bienestar, y metodologías participativas (IAP).',
  'Gestión de la calidad en los Servicios Sociales: Cartas de Servicios (Decreto 27/1997 CAM), evaluación y mejora continua.',
];

export const OFFICIAL_CAM_TOPICS = [
  ...CAM_GENERAL_TITLES.map((title, idx) => ({
    id: `G${idx + 1}`,
    block: 'General CAM',
    subArea: 'general',
    number: idx + 1,
    prob: idx < 6 || idx >= 10 ? 'Alta' : 'Media',
    equivalentIds:
      idx === 0
        ? ['S-1', 'AY-1']
        : idx === 10
        ? ['S-6', 'AY-12', 'AY-13', 'AY-14']
        : idx === 13
        ? ['S-6', 'AY-11']
        : idx === 15
        ? ['S-8', 'AY-20']
        : [],
    title: `Tema General ${idx + 1}. ${title}`,
    lawUpdate:
      'Constitución 1978, Ley 39/2015, Ley 40/2015, TREBEP y Normativa Autonómica CAM 2026.',
  })),
  ...CAM_SPECIFIC_TITLES.map((title, idx) => ({
    id: `E${idx + 1}`,
    block: 'Específico CAM',
    subArea:
      idx < 20
        ? 'area1_ss'
        : idx < 30
        ? 'area2_dep'
        : idx < 46
        ? 'area3_inf'
        : 'area4_san_met',
    number: idx + 1,
    prob: 'Alta',
    equivalentIds:
      idx === 4
        ? ['S-11', 'AY-22']
        : idx === 20
        ? ['S-43', 'AY-24']
        : idx === 27
        ? ['S-10', 'AY-76']
        : idx === 34
        ? ['S-8', 'S-34', 'AY-78']
        : idx === 36
        ? ['S-30', 'S-31', 'AY-26', 'AY-72']
        : idx === 47
        ? ['S-2', 'S-3']
        : [],
    title: `Tema Específico ${idx + 1}. ${title}`,
    lawUpdate:
      'Ley 12/2022 Servicios Sociales CAM, Decreto 54/2015, RD 888/2022, Ley 4/2023 Infancia, Ley 1/2023 AMAPAD y RD 1155/2024.',
  })),
];

export const SERMAS_TITLES = [
  'Tema 1. La Constitución Española de 1978: estructura y contenido. Protección de la salud (Art. 43). Corona, Cortes, Gobierno y Poder Judicial.',
  'Tema 2. Ley 14/1986 General de Sanidad y Ley 12/2001 de Ordenación Sanitaria de la Comunidad de Madrid (LOSCAM).',
  'Tema 3. Estructura y régimen jurídico del Servicio Madrileño de Salud (Decreto 246/2023). Ley 11/2017 de Buen Gobierno Sanitario.',
  'Tema 4. Ley 16/2003 de cohesión y calidad del Sistema Nacional de Salud: prestaciones, Consejo Interterritorial y sistema de información.',
  'Tema 5. Ley 44/2003 de ordenación de las profesiones sanitarias (LOPS).',
  'Tema 6. Ley 55/2003 del Estatuto Marco del personal estatutario de los servicios de salud: clasificación, derechos, deberes, nombramientos, situaciones y régimen disciplinario.',
  'Tema 7. Real Decreto 39/1997 Reglamento de los Servicios de Prevención y Ley 31/1995 LPRL en el SERMAS.',
  'Tema 8. LO 1/2004, Ley 5/2005 CAM Violencia de Género, LO 3/2007 Igualdad y Ley 3/2016 LGTBIfobia en salud.',
  'Tema 9. LO 3/2018 LOPDGDD y Ley 41/2002 de autonomía del paciente, consentimiento informado e instrucciones previas.',
  'Tema 10. RDL 1/2013 y RD 888/2022 de valoración de la discapacidad: discapacidades físicas, psíquicas y sensoriales.',
  'Tema 11. Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid [sustituye a la derogada Ley 11/2003]: Atención Social Primaria y Especializada.',
  'Tema 12. Conceptos y teorías del Trabajo Social, código deontológico, secreto profesional y bioética.',
  'Tema 13. Evolución metodológica en Trabajo Social: estudio, diagnóstico, planificación, ejecución y evaluación.',
  'Tema 14. La investigación social, diagnóstico social, planificación y evaluación en Trabajo Social.',
  'Tema 15. Técnicas e instrumentos básicos del Trabajo Social: Informe social, ficha social, historia social y entrevista.',
  'Tema 16. El Trabajador Social en el equipo interdisciplinar: funciones, comunicación y trabajo en equipo.',
  'Tema 17. Calidad en el Sistema Nacional de Salud: métodos de evaluación y dimensiones de calidad.',
  'Tema 18. Salud y Trabajo Social: determinantes sociales de la salud, salud pública y epidemiología.',
  'Tema 19. Las desigualdades en salud: indicadores sociales de riesgo y estrategias de intervención.',
  'Tema 20. Sistemas de información en Atención Hospitalaria y Primaria (AP-Madrid, HCIS, Visor Horus).',
  'Tema 21. Trabajo Social en Atención Primaria de Salud: funciones en el EAP y promoción de la salud.',
  'Tema 22. Trabajo Social en Atención Hospitalaria: planificación del alta hospitalaria y continuidad asistencial.',
  'Tema 23. Procesos Asistenciales Integrados (PAI), criterios de riesgo social y participación del Trabajador Social.',
  'Tema 24. Trabajo Social individualizado: objetivos, proceso metodológico y técnicas.',
  'Tema 25. Trabajo Social familiar: intervención en crisis, mediación y orientación familiar.',
  'Tema 26. Trabajo Social de grupo: tipologías, técnicas y dinámica grupal.',
  'Tema 27. Trabajo Social comunitario: metodología, instrumentos y participación comunitaria.',
  'Tema 28. Intervención indirecta en Trabajo Social y trabajo en redes sociales.',
  'Tema 29. Sistemas de información y registro de Trabajo Social en Salud e investigación social.',
  'Tema 30. Legislación de Protección Integral de la Infancia en la CAM: Ley 4/2023 y LO 8/2021 LOPIVI [derogada Ley 6/1995].',
  'Tema 31. Menores en dificultad social: protocolo sanitario ante el maltrato infantil, riesgo, desamparo, acogimiento y adopción.',
  'Tema 32. Salud durante la infancia y la adolescencia: aspectos psicosociales y Trabajo Social pediátrico.',
  'Tema 33. Mujer y salud: embarazo, parto, puerperio y factores sociales de riesgo.',
  'Tema 34. Violencia de género en el Sistema Sanitario: detección, atención y protocolo de actuación sanitaria.',
  'Tema 35. Educación para la salud en grupos de pacientes crónicos.',
  'Tema 36. Conductas adictivas y drogodependencias: Ley 5/2002 CAM, Red CAID e intervención social.',
  'Tema 37. La Salud Mental: internamiento involuntario (Art. 763 LEC), medidas de apoyo (Ley 8/2021 y Ley 1/2023 AMAPAD) e intervención.',
  'Tema 38. El proceso de envejecimiento: anciano de riesgo y Trabajo Social con personas mayores.',
  'Tema 39. Atención al paciente inmovilizado en domicilio e intervención del Trabajador Social Sanitario.',
  'Tema 40. Atención en cuidados paliativos (Ley 4/2017 CAM), acompañamiento en el duelo y pacientes terminales.',
  'Tema 41. Atención temprana: Decreto 46/2015, valoración CRECOVI e intervención del Trabajador Social.',
  'Tema 42. Continuidad de cuidados, atención a la dependencia y prevención de la sobrecarga del cuidador (Escala Zarit).',
  'Tema 43. Ley 39/2006 de Dependencia: valoración BVD y EVE (RD 174/2011) y Decreto 54/2015 en la Comunidad de Madrid.',
  'Tema 44. Estimulación de la autonomía personal, prevención de la dependencia y servicios de reinserción.',
  'Tema 45. La atención sociosanitaria y el Trabajador Social como nexo entre el sistema sanitario y el social.',
  'Tema 46. Hospitalización domiciliaria (UHD) y abordaje psicosocial de hábitos adictivos.',
  'Tema 47. Movimientos migratorios y minorías étnicas en salud: RDL 7/2018 y nuevo Reglamento de Extranjería RD 1155/2024.',
  'Tema 48. Población penitenciaria: asistencia sanitaria e intervención del Trabajador Social.',
  'Tema 49. Exclusión social y personas sin hogar: atención a la salud en zonas de exclusión.',
  'Tema 50. El voluntariado en salud (Ley 45/2015 y Ley 1/2015 CAM), grupos de autoayuda y asociaciones.',
];

export const SERMAS_50_TOPICS = SERMAS_TITLES.map((title, idx) => ({
  id: `S-${idx + 1}`,
  block: idx < 7 ? 'General SERMAS (1-7)' : 'Específico SERMAS (8-50)',
  subArea:
    idx < 7
      ? 'general'
      : idx < 23
      ? 'area4_san_met'
      : idx < 35
      ? 'area3_inf'
      : 'area2_dep',
  number: idx + 1,
  prob: 'Alta',
  equivalentIds:
    idx === 0
      ? ['G1']
      : idx === 10
      ? ['E5', 'E6']
      : idx === 29
      ? ['E37']
      : idx === 42
      ? ['E21', 'E22', 'E23']
      : [],
  title,
  lawUpdate:
    'Normativa Sanitaria y Sociosanitaria Vigente SERMAS (Resolución 20/10/2026 BOCM).',
}));

export const AYTO_90_TITLES = [
  '1.- La Constitución Española (I): estructura, contenido y derechos fundamentales.',
  '2.- La Constitución Española (II): Gobierno, Administración, Cortes y Poder Judicial.',
  '3.- La elaboración de las leyes en la Constitución Española, disposiciones con fuerza de ley y el Reglamento.',
  '4.- La Organización territorial del Estado: Administración Local y Comunidades Autónomas.',
  '5.- La Comunidad de Madrid: competencias y organización institucional.',
  '6.- El Municipio: régimen común y municipios de gran población (Ley 7/1985 LBRL).',
  '7.- Organización política y administrativa del Ayuntamiento de Madrid (I): Pleno, Alcalde y Junta de Gobierno (Ley 22/2006).',
  '8.- Organización política y administrativa del Ayuntamiento de Madrid (II): Intervención, Tesorería, TEAM y Asesoría Jurídica.',
  '9.- Reglamento Orgánico del Gobierno y de la Administración del Ayuntamiento de Madrid (I): Áreas de Gobierno.',
  '10.- Reglamento Orgánico del Gobierno y de la Administración del Ayuntamiento de Madrid (II): los Distritos.',
  '11.- El personal al servicio de la Administración Pública conforme al RDL 5/2015 (TREBEP).',
  '12.- Ley 39/2015 del Procedimiento Administrativo Común (I): De los actos administrativos.',
  '13.- Ley 39/2015 del Procedimiento Administrativo Común (II): Disposiciones sobre el procedimiento.',
  '14.- Ley 40/2015 de Régimen Jurídico del Sector Público: órganos y responsabilidad patrimonial.',
  '15.- RDL 2/2004 Ley Reguladora de las Haciendas Locales.',
  '16.- Ley 9/2017 de Contratos del Sector Público (I): principios, adjudicación y extinción.',
  '17.- Ley 9/2017 de Contratos del Sector Público (II): contratos de obras, concesión, suministro y servicios.',
  '18.- Ley 19/2013 de transparencia y Ordenanza de Transparencia de la Ciudad de Madrid.',
  '19.- Ley 31/1995 de Prevención de Riesgos Laborales y Acuerdo Convenio del Ayuntamiento de Madrid.',
  '20.- LO 3/2007 de Igualdad, Ley 4/2023 Trans/LGTBI y III Plan de Igualdad del Ayuntamiento de Madrid.',
  '21.- El sistema público de Servicios Sociales en el marco del Bienestar Social.',
  '22.- La Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid.',
  '23.- La Unión Europea y las políticas sociales: Pilar Europeo, MRR y Fondo Social Europeo Plus (FSE+).',
  '24.- Ley 39/2006 de Dependencia y Decreto 54/2015 de la Comunidad de Madrid.',
  '25.- Ley 15/2001 de Renta Mínima de Inserción de la CAM e Ingreso Mínimo Vital (Ley 19/2021).',
  '26.- Ley Orgánica 8/2021 (LOPIVI) de protección integral a la infancia frente a la violencia.',
  '27.- Las Organizaciones: tipos, estructuras y comunicación organizacional.',
  '28.- La dirección en las organizaciones: toma de decisiones y resolución del conflicto.',
  '29.- El concepto de conflicto social, cambio social y mediación.',
  '30.- Estereotipos, prejuicios y cambio de actitudes.',
  '31.- La planificación de la gestión pública: estratégica, operativa y gestión de proyectos.',
  '32.- Los grupos: estructura, dinámica grupal y técnicas participativas.',
  '33.- Liderazgo, gestión de equipos, inteligencia emocional y trabajo en equipo.',
  '34.- Dirección eficaz de reuniones de trabajo y resolución de situaciones conflictivas.',
  '35.- La comunicación humana, medios de comunicación social y opinión pública.',
  '36.- Tecnologías de la Información y la Comunicación (TIC) y redes sociales.',
  '37.- Cultura organizativa y ética pública: códigos éticos y conflictos de intereses.',
  '38.- Gestión de recursos humanos en organismos públicos, inteligencia artificial y cuidado de equipos.',
  '39.- El papel de la formación en el desarrollo de las personas y planificación formativa.',
  '40.- Estructura social y familias en el siglo XXI: nuevas formas de convivencia.',
  '41.- Organización de los Servicios Sociales en la CAM: Atención Social Primaria y Especializada.',
  '42.- El sistema de la Seguridad Social en España: Régimen General y prestaciones.',
  '43.- Información y atención a la ciudadanía en el Ayuntamiento de Madrid (Línea Madrid) y protección de datos.',
  '44.- Gestión de la calidad en los servicios públicos y Sistema de Cartas de Servicios en el Ayuntamiento de Madrid.',
  '45.- La investigación social: teoría y fases de la investigación social.',
  '46.- Métodos de investigación social: técnicas cuantitativas y cualitativas.',
  '47.- Perspectiva cualitativa: observación, entrevistas, historias de vida y grupos de discusión.',
  '48.- Técnicas de análisis cuantitativo: encuesta y estadística.',
  '49.- La informática y paquetes estadísticos aplicados a las ciencias sociales.',
  '50.- Sistemas de información integrados y Cuadros de Mando en el ámbito municipal.',
  '51.- Evaluación de políticas públicas y de programas sociales: modelos, fases e indicadores.',
  '52.- Necesidades individuales y sociales: tipología y detección para el diseño de políticas públicas.',
  '53.- El estudio de la población: demografía, fuentes e indicadores demográficos.',
  '54.- La población de la Ciudad de Madrid: características demográficas y distribución territorial.',
  '55.- Desigualdades territoriales en la Ciudad de Madrid y reequilibrio territorial (FRT).',
  '56.- La vivienda en el municipio de Madrid: EMVS, vulnerabilidad residencial y servicios sociales.',
  '57.- El sistema educativo: distribución de competencias entre Estado, CAM y municipios.',
  '58.- Servicios educativos del Ayuntamiento de Madrid: Escuelas Infantiles y prevención del absentismo.',
  '59.- El mercado laboral de la Ciudad de Madrid y Agencia para el Empleo de Madrid.',
  '60.- Participación ciudadana en el Ayuntamiento de Madrid: Consejos de Proximidad y Decide Madrid.',
  '61.- La Cooperación Internacional para el Desarrollo en el Ayuntamiento de Madrid.',
  '62.- Salud Pública en la Ciudad de Madrid: Madrid Salud, Centros CMSc y coordinación sociosanitaria.',
  '63.- Adicciones: conceptos básicos y Plan de Adicciones de la Ciudad de Madrid (CAD).',
  '64.- La Salud Mental: aspectos sociales y legales en la intervención social.',
  '65.- Estructura y competencias del Área de Gobierno de Políticas Sociales, Familia e Igualdad.',
  '66.- La prevención en intervención social: primaria, secundaria y terciaria.',
  '67.- Servicios Sociales del Ayuntamiento de Madrid y Plan Estratégico 2023-2027.',
  '68.- La red de Atención Social Primaria del Ayuntamiento de Madrid: Centros de Servicios Sociales.',
  '69.- Intervención en situaciones de urgencia y emergencia en Madrid: 112, SAMUR-Protección Civil y SAMUR Social.',
  '70.- Atención social a la infancia, adolescencia y familias en el Ayuntamiento de Madrid: CAI y programas.',
  '71.- Parentalidad positiva y apoyo familiar municipal: CAF, PEF y CERPA.',
  '72.- Protección social del menor: actuaciones ante riesgo y desamparo y menores infractores.',
  '73.- Política de juventud del Ayuntamiento de Madrid: Centros Juveniles y OIJ.',
  '74.- Atención a las personas mayores en la Ciudad de Madrid: soledad no deseada y prevención del maltrato.',
  '75.- Ordenanza 10/2022, de 28 de junio, reguladora del SAD, Centros de Día, Residencias, Apartamentos y Centros de Atención Integral Neurocognitiva.',
  '76.- Discapacidad: RDL 1/2013, RD 888/2022 y programas municipales para personas con discapacidad.',
  '77.- Políticas públicas de igualdad y Espacios de Igualdad en el Ayuntamiento de Madrid.',
  '78.- Violencia de género: Ley 5/2005 CAM y Red Municipal de Atención Integral (SAVG 24h, CAPSEM, PMORVG).',
  '79.- Las personas LGTBI: servicios y programas de atención municipal del Ayuntamiento de Madrid.',
  '80.- El sinhogarismo en la Ciudad de Madrid: factores de riesgo y tipología ETHOS.',
  '81.- Respuesta institucional al sinhogarismo en Madrid: red de centros y modelo Housing First.',
  '82.- Movimientos migratorios en Madrid y normativa de extranjería (LO 4/2000 y nuevo Reglamento RD 1155/2024).',
  '83.- Población inmigrante: refugiados, asilados y Sistema Nacional de Acogida.',
  '84.- Intervención del Ayuntamiento de Madrid con la población inmigrante: programas y recursos.',
  '85.- Minorías étnicas e inclusión del Pueblo Gitano en la Ciudad de Madrid.',
  '86.- Modelo de Voluntariado del Ayuntamiento de Madrid (Voluntarios por Madrid).',
  '87.- Incidencia social de la acción urbanística: urbanismo inclusivo, impacto de género y accesibilidad.',
  '88.- Acción municipal en materia cultural como herramienta de inclusión social.',
  '89.- Acción municipal en materia deportiva como medio de integración social.',
  '90.- Estrategia de transformación digital de los Servicios Sociales municipales del Ayuntamiento de Madrid.',
];

export const AYUNTAMIENTO_90_TOPICS = AYTO_90_TITLES.map((title, idx) => ({
  id: `AY-${idx + 1}`,
  block:
    idx < 20
      ? 'Grupo I · General Ayto (1-20)'
      : 'Grupo II · Específico Social Ayto (21-90)',
  subArea:
    idx < 20
      ? 'general'
      : idx < 45
      ? 'area1_ss'
      : idx < 66
      ? 'area4_san_met'
      : idx < 77
      ? 'area2_dep'
      : 'area3_inf',
  number: idx + 1,
  prob: idx >= 20 ? 'Alta' : 'Media',
  equivalentIds:
    idx === 21
      ? ['E5']
      : idx === 23
      ? ['E21', 'E23']
      : idx === 68
      ? ['E18']
      : idx === 77
      ? ['E35']
      : [],
  title,
  lawUpdate:
    'BOAM 2026 · Normativa Municipal Ayuntamiento de Madrid y CAM 2026.',
}));
// ============================================================================
// CONTINUACIÓN DE src/dataOposiciones.js (Pegar al final del archivo)
// Diccionarios de Auditoría, 10 Supuestos Prácticos y 60 Preguntas de Examen
// ============================================================================

export const OBSOLETE_TERMS_DICTIONARY = [
  {
    regex: /ley\s+11\/2003/gi,
    replacement:
      'Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid (que deroga la antigua Ley 11/2003)',
    alert:
      'Cita la Ley 11/2003 de Servicios Sociales sin especificar que está DEROGADA por la actual Ley 12/2022.',
  },
  {
    regex: /ley\s+6\/1995/gi,
    replacement:
      'Ley 4/2023, de 22 de marzo, de Derechos, Garantías y Protección Integral de la Infancia y la Adolescencia de la CAM (que deroga la Ley 6/1995)',
    alert:
      'Cita la Ley 6/1995 de Infancia CAM sin indicar que está DEROGADA por la Ley 4/2023.',
  },
  {
    regex: /(?:real\s+decreto|rd|r\.d\.)\s+557\/2011/gi,
    replacement:
      'Real Decreto 1155/2024, de 19 de noviembre, por el que se aprueba el nuevo Reglamento de Extranjería (que deroga el RD 557/2011)',
    alert:
      'Cita el antiguo Reglamento de Extranjería (RD 557/2011), sustituido por el nuevo Real Decreto 1155/2024.',
  },
  {
    regex: /\bAMTA\b|agencia\s+madrileña\s+para\s+la\s+tutela\s+de\s+adultos/gi,
    replacement:
      'Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (AMAPAD, regulada por Ley 1/2023 tras la Ley 8/2021)',
    alert:
      'Menciona la antigua AMTA (Sustituida por la AMAPAD mediante la Ley 1/2023 y la Ley 8/2021).',
  },
  {
    regex: /incapacitaci[oó]n\s+judicial/gi,
    replacement:
      'provisión judicial de medidas de apoyo / curatela conforme a la Ley 8/2021 (que suprimió la incapacitación judicial)',
    alert:
      'Utiliza el término "incapacitación judicial" (Suprimido por la Ley 8/2021).',
  },
];

export const FORBIDDEN_ACRONYMS_DICTIONARY = [
  {
    acronym: 'CE',
    regex: /\bCE\b/g,
    checkFull: /constituci[oó]n\s+española/i,
    expansion: 'Constitución Española (en adelante, CE)',
  },
  {
    acronym: 'PIAS',
    regex: /\bPIAS\b/g,
    checkFull: /plan\s+individual\s+de\s+atenci[oó]n\s+social/i,
    expansion: 'Plan Individual de Atención Social (en adelante, PIAS)',
  },
  {
    acronym: 'SERMAS',
    regex: /\bSERMAS\b/g,
    checkFull: /servicio\s+madrileño\s+de\s+salud/i,
    expansion: 'Servicio Madrileño de Salud (en adelante, SERMAS)',
  },
  {
    acronym: 'LOSCAM',
    regex: /\bLOSCAM\b/g,
    checkFull: /ordenaci[oó]n\s+sanitaria\s+de\s+la\s+comunidad\s+de\s+madrid/i,
    expansion:
      'Ley de Ordenación Sanitaria de la Comunidad de Madrid (en adelante, LOSCAM)',
  },
  {
    acronym: 'AMAPAD',
    regex: /\bAMAPAD\b/g,
    checkFull:
      /agencia\s+madrileña\s+para\s+el\s+apoyo\s+a\s+las\s+personas\s+adultas\s+con\s+discapacidad/i,
    expansion:
      'Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (en adelante, AMAPAD)',
  },
  {
    acronym: 'AMAS',
    regex: /\bAMAS\b/g,
    checkFull: /agencia\s+madrileña\s+de\s+atenci[oó]n\s+social/i,
    expansion: 'Agencia Madrileña de Atención Social (en adelante, AMAS)',
  },
  {
    acronym: 'LOPIVI',
    regex: /\bLOPIVI\b/g,
    checkFull:
      /protecci[oó]n\s+integral\s+a\s+la\s+infancia\s+y\s+la\s+adolescencia\s+frente\s+a\s+la\s+violencia/i,
    expansion:
      'Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia (en adelante, LOPIVI)',
  },
  {
    acronym: 'LAPAD',
    regex: /\bLAPAD\b/g,
    checkFull:
      /promoci[oó]n\s+de\s+la\s+autonom[ií]a\s+personal\s+y\s+atenci[oó]n\s+a\s+las\s+personas\s+en\s+situaci[oó]n\s+de\s+dependencia/i,
    expansion:
      'Ley de Promoción de la Autonomía Personal y Atención a las personas en situación de dependencia (en adelante, LAPAD)',
  },
  {
    acronym: 'BVD',
    regex: /\bBVD\b/g,
    checkFull: /baremo\s+de\s+valoraci[oó]n\s+de\s+la\s+dependencia/i,
    expansion: 'Baremo de Valoración de la Dependencia (en adelante, BVD)',
  },
  {
    acronym: 'EVE',
    regex: /\bEVE\b/g,
    checkFull: /escala\s+de\s+valoraci[oó]n\s+espec[ií]fica/i,
    expansion: 'Escala de Valoración Específica (en adelante, EVE)',
  },
  {
    acronym: 'SAD',
    regex: /\bSAD\b/g,
    checkFull: /servicio\s+de\s+ayuda\s+a\s+domicilio/i,
    expansion: 'Servicio de Ayuda a Domicilio (en adelante, SAD)',
  },
  {
    acronym: 'RMI',
    regex: /\bRMI\b/g,
    checkFull: /renta\s+m[ií]nima\s+de\s+inserci[oó]n/i,
    expansion: 'Renta Mínima de Inserción (en adelante, RMI)',
  },
  {
    acronym: 'IMV',
    regex: /\bIMV\b/g,
    checkFull: /ingreso\s+m[ií]nimo\s+vital/i,
    expansion: 'Ingreso Mínimo Vital (en adelante, IMV)',
  },
  {
    acronym: 'TREBEP',
    regex: /\bTREBEP\b/g,
    checkFull: /estatuto\s+b[aá]sico\s+del\s+empleado\s+p[uú]blico/i,
    expansion:
      'Texto Refundido de la Ley del Estatuto Básico del Empleado Público (en adelante, TREBEP)',
  },
  {
    acronym: 'LPAC',
    regex: /\bLPAC\b/g,
    checkFull: /procedimiento\s+administrativo\s+com[uú]n/i,
    expansion:
      'Ley del Procedimiento Administrativo Común de las Administraciones Públicas (en adelante, LPAC)',
  },
  {
    acronym: 'LRJSP',
    regex: /\bLRJSP\b/g,
    checkFull: /r[eé]gimen\s+jur[ií]dico\s+del\s+sector\s+p[uú]blico/i,
    expansion:
      'Ley de Régimen Jurídico del Sector Público (en adelante, LRJSP)',
  },
  {
    acronym: 'ARRMI',
    regex: /\bARRMI\b/g,
    checkFull:
      /agencia\s+de\s+la\s+comunidad\s+de\s+madrid\s+para\s+la\s+reeducaci[oó]n\s+y\s+reinserci[oó]n/i,
    expansion:
      'Agencia de la Comunidad de Madrid para la Reeducación y Reinserción del Menor Infractor (en adelante, ARRMI)',
  },
  {
    acronym: 'RGPD',
    regex: /\bRGPD\b/g,
    checkFull: /reglamento\s+general\s+de\s+protecci[oó]n\s+de\s+datos/i,
    expansion: 'Reglamento General de Protección de Datos (en adelante, RGPD)',
  },
];

export const ERROR_ROOT_CAUSES = [
  '1. Desconocimiento normativo o literal',
  '2. Confusión entre plazos u órganos (Mutación)',
  '3. Lectura incompleta de enunciado negativo (INCORRECTA)',
  '4. Duda entre 2 opciones muy similares',
  '5. Confusión con ley anterior derogada',
  '6. Precipitación o fatiga de bloque',
];

// ============================================================================
// LOS 10 SUPUESTOS PRÁCTICOS OFICIALES RESUELTOS (MÓDULO 05)
// ============================================================================
export const OFFICIAL_10_PRACTICAL_CASES = [
  {
    id: 'caso_1_cam_vg',
    badge: '01 · 🏛️ CAM · Infancia + Violencia de Género + Dependencia',
    enunciado:
      'Mujer de 36 años acude a Atención Social Primaria con dos hijos (11 y 5 años). Relata violencia física y control económico por su pareja, abandonó ayer el domicilio sin ingresos y convive con su madre de 79 años con deterioro cognitivo moderado sin valorar.',
    claves:
      'Título Habilitante (Ley 5/2005 CAM), Punto Municipal del Observatorio Regional de Violencia de Género (PMORVG), hoja SIMIA / valoración de riesgo (Ley 4/2023), Renta Mínima de Inserción (RMI) / Ingreso Mínimo Vital (IMV) y Decreto 54/2015.',
    normativaEspecifica:
      'Ley 5/2005, de 20 de diciembre, Integral contra la Violencia de Género de la Comunidad de Madrid (Título Habilitante sin requerir denuncia judicial previa), Ley Orgánica 1/2004, Ley 4/2023, de 22 de marzo, de Derechos, Garantías y Protección Integral de la Infancia y la Adolescencia de la Comunidad de Madrid (que derogó la Ley 6/1995), Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia (en adelante, LOPIVI) y Decreto 54/2015 de dependencia.',
    escalasEspecificas:
      'Escala de Valoración Sociofamiliar de Gijón, Cuestionario de valoración del riesgo en violencia de género, indicadores de riesgo infantil (sistema SIMIA), Índice de Barthel, Test de Pfeiffer y Escala de sobrecarga del cuidador de Zarit.',
    intervencionEspecifica:
      'a) Urgencia (0-72h): Expedición del Título Habilitante por los Servicios Sociales para acceso inmediato a la Red de Atención Integral para la Violencia de Género (Centro de Emergencia), garantizando la protección de los menores y de la abuela dependiente.\nb) Corto y medio plazo: Apertura de expediente de riesgo infantil en Atención Social Primaria con apoyo familiar; tramitación urgente de Ingreso Mínimo Vital (en adelante, IMV) y Renta Mínima de Inserción (en adelante, RMI); solicitud de valoración de dependencia conforme a la Ley de Promoción de la Autonomía Personal y Atención a las personas en situación de dependencia (en adelante, LAPAD) aplicando el Baremo de Valoración de la Dependencia (en adelante, BVD, Real Decreto 174/2011) con Servicio de Ayuda a Domicilio (en adelante, SAD) y Centro de Día.',
  },
  {
    id: 'caso_2_sermas_alta',
    badge: '02 · 🏥 SERMAS · Alta Hospitalaria + Riesgo Sociosanitario',
    enunciado:
      'Paciente de 82 años ingresado en Hospital del SERMAS por fractura de cadera e ictus secundario. Vive solo en un 3.º sin ascensor, sin red familiar activa y con desorientación parcial. Previsión de alta médica en 72 horas.',
    claves:
      'Historia Clínica Electrónica (HCIS) y Visor Horus, planificación precoz del alta, coordinación con Trabajador/a Social de Atención Primaria, estancia temporal en residencia de la Agencia Madrileña de Atención Social (AMAS) y comunicación a Fiscalía (Ley 8/2021).',
    normativaEspecifica:
      'Ley 14/1986 General de Sanidad, Ley de Ordenación Sanitaria de la Comunidad de Madrid (en adelante, LOSCAM, Ley 12/2001), Decreto 246/2023 de estructura del Servicio Madrileño de Salud (en adelante, SERMAS), Ley 41/2002 de Autonomía del Paciente, Ley 8/2021 de reforma civil para el apoyo a las personas con discapacidad en el ejercicio de su capacidad jurídica y Decreto 54/2015.',
    escalasEspecificas:
      'Índice de Barthel (actividades básicas de la vida diaria), Escala de Lawton y Brody (actividades instrumentales), Test de Pfeiffer (cribado cognitivo), Escala de Valoración Sociofamiliar de Gijón y criterios de riesgo social al ingreso hospitalario.',
    intervencionEspecifica:
      'a) Urgencia hospitalaria (0-72h): Interconsulta social en planta registrada en el sistema informático hospitalario HCIS; activación del protocolo de planificación al alta sociosanitaria y coordinación telemática mediante Visor Horus con el/la Trabajador/a Social del Centro de Salud de Atención Primaria y con Atención Social Primaria.\nb) Recursos al alta: Solicitud por vía de emergencia sociosanitaria de plaza residencial temporal o unidad de media estancia rehabilitadora de la Agencia Madrileña de Atención Social (en adelante, AMAS) ante la imposibilidad de retorno al domicilio sin ascensor; comunicación al Ministerio Fiscal sobre la situación de desvalimiento y deterioro cognitivo conforme a la Ley 8/2021.',
  },
  {
    id: 'caso_3_ayto_samur',
    badge: '03 · 🏢 AYTO MADRID · Emergencia Social + Sinhogarismo',
    enunciado:
      'Aviso del 112 a SAMUR Social por familia con menor de 3 años pernoctando en un vehículo tras pérdida repentina de habitación subarrendada en Madrid, sin empadronamiento estable ni ingresos.',
    claves:
      'Unidad Móvil de Emergencia Social (UMES) de SAMUR Social, alojamiento de emergencia, derivación a Centro de Servicios Sociales municipal, Plan Estratégico 2023-2027, Tarjeta Familias y Centro de Atención a la Infancia (CAI).',
    normativaEspecifica:
      'Ley 22/2006 de Capitalidad y de Régimen Especial de Madrid, Plan Estratégico del Nuevo Sistema Público de Servicios Sociales de la Ciudad de Madrid 2023-2027, Ordenanza de Prestaciones Económicas del Ayuntamiento de Madrid, Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid y Ley 4/2023 de Protección a la Infancia.',
    escalasEspecificas:
      'Tipología Europea de Sinhogarismo y Exclusión Residencial (ETHOS), Escala de Valoración Sociofamiliar de Gijón e indicadores municipales de vulnerabilidad residencial y protección infantil.',
    intervencionEspecifica:
      'a) Respuesta inmediata en calle (0-24h): Desplazamiento de la Unidad Móvil de Emergencia Social de SAMUR Social tras aviso de Madrid 112; cobertura inmediata de alojamiento protegido de urgencia para la unidad familiar evitando la situación de calle del menor de 3 años.\nb) Continuidad en red municipal: Alta y traspaso de caso mediante Historia Social al Centro de Servicios Sociales del distrito correspondiente; tramitación de empadronamiento social; concesión de prestación económica de emergencia y Tarjeta Familias para cobertura alimentaria; coordinación con el Centro de Atención a la Infancia y con la Empresa Municipal de la Vivienda y Suelo.',
  },
  {
    id: 'caso_4_amapad_disc',
    badge: '04 · 🏛️ Discapacidad + Provisión de Apoyos (AMAPAD Ley 1/2023)',
    enunciado:
      'Varón de 49 años con discapacidad intelectual (68%) y trastorno orgánico tras fallecimiento repentino de su padre (único cuidador). Desconoce cómo gestionar su pensión, sufre presiones económicas de terceros y carece de familiares hasta 4.º grado.',
    claves:
      'Supresión de la incapacitación judicial (Ley 8/2021), medidas judiciales de apoyo / curatela representativa, Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (AMAPAD, Ley 1/2023), Real Decreto 888/2022 y guarda de hecho cautelar.',
    normativaEspecifica:
      'Ley 8/2021, de 2 de junio, por la que se reforma la legislación civil y procesal para el apoyo a las personas con discapacidad en el ejercicio de su capacidad jurídica (que suprimió la antigua incapacitación judicial), Ley 1/2023, de 15 de febrero, de creación de la Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (en adelante, AMAPAD, que sustituyó a la antigua AMTA), Real Decreto Legislativo 1/2013 y nuevo baremo de discapacidad del Real Decreto 888/2022, de 18 de octubre.',
    escalasEspecificas:
      'Baremo de evaluación de las capacidades/limitaciones en las actividades y restricciones en la participación del Real Decreto 888/2022 (con sus 4 baremos anexos: BDGP, BLA, BRP y BFCA), Baremo de Valoración de la Dependencia (en adelante, BVD) y Escala de Gijón.',
    intervencionEspecifica:
      'a) Medidas urgentes de protección patrimonial y personal: Puesta en conocimiento inmediata del Ministerio Fiscal (Fiscalía de Protección de Personas con Discapacidad) solicitando medidas cautelares de defensa patrimonial y designación de curatela ejercida por la Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (AMAPAD) conforme a la Ley 1/2023, respetando la voluntad, deseos y preferencias de la persona.\nb) Recursos especializados: Revisión del grado de discapacidad y dependencia por agravamiento; solicitud de plaza en Vivienda Comunitaria o Centro Ocupacional de la Red de Atención a Personas con Discapacidad de la Comunidad de Madrid y gestión de Pensión No Contributiva / orfandad.',
  },
  {
    id: 'caso_5_salud_mental_crps',
    badge: '05 · 🏥 Salud Mental Grave y Duradera (CRPS / CRL / EASC)',
    enunciado:
      'Joven de 27 años diagnosticado de esquizofrenia paranoide tras segundo ingreso hospitalario breve (Art. 763 LEC). Presenta aislamiento severo en domicilio, abandono formativo, nula conciencia de enfermedad y elevada sobrecarga en su madre.',
    claves:
      'Derivación desde Centro de Salud Mental (CSM) a la Red Pública de Atención Social a Personas con Enfermedad Mental Grave y Duradera CAM: Equipo de Apoyo Social Comunitario (EASC), Centro de Rehabilitación Psicosocial (CRPS), Centro de Rehabilitación Laboral (CRL) y psicoeducación familiar.',
    normativaEspecifica:
      'Ley 14/1986 General de Sanidad (artículo 20 de integración de la salud mental), artículo 763 de la Ley de Enjuiciamiento Civil (internamiento no voluntario por razón de trastorno psíquico con autorización judicial), Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid y Cartera de Servicios de la Red Pública de Atención Social a Personas con Enfermedad Mental Grave y Duradera.',
    escalasEspecificas:
      'Escala de Evaluación de la Actividad Global (EEAG/GAF), Escala de Discapacidad de la Organización Mundial de la Salud (WHO-DAS 2.0), Escala de sobrecarga del cuidador de Zarit y Baremo del Real Decreto 888/2022.',
    intervencionEspecifica:
      'a) Vinculación comunitaria inicial: Coordinación estrecha entre el/la Trabajador/a Social del Centro de Salud Mental del Servicio Madrileño de Salud (en adelante, SERMAS) y los Servicios Sociales para tramitar la derivación a la Red de Atención Social a Personas con Enfermedad Mental; intervención inicial en domicilio mediante el Equipo de Apoyo Social Comunitario para lograr adherencia terapéutica y romper el aislamiento.\nb) Rehabilitación psicosocial y laboral: Incorporación progresiva al Centro de Rehabilitación Psicosocial para entrenamiento en habilidades cotidianas y prevención de recaídas, e inclusión de la madre en el programa de psicoeducación y apoyo familiar; posterior derivación al Centro de Rehabilitación Laboral y tramitación del certificado de discapacidad (Real Decreto 888/2022).',
  },
  {
    id: 'caso_6_infancia_acogimiento',
    badge: '06 · 🏛️ Infancia · Desamparo, Acogimiento y Adopción (Ley 4/2023)',
    enunciado:
      'Niña de 4 años e infante de 18 meses cuyos progenitores presentan consumo activo grave y negligencia severa constatada tras fracasar durante 12 meses la intervención de preservación familiar en situación de riesgo. Ambos cuentan con abuelos maternos dispuestos a cuidarlos.',
    claves:
      'Declaración de desamparo y asunción de tutela por ministerio de la ley (Comisión de Tutela del Menor, Ley 4/2023 CAM), prioridad del acogimiento familiar sobre el residencial (menores de 6 años, LO 1/1996 y LOPIVI), acogimiento en familia extensa y estatuto del acogedor.',
    normativaEspecifica:
      'Ley Orgánica 1/1996 de Protección Jurídica del Menor (modificada por la Ley 26/2015 y la Ley Orgánica 8/2015), Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia (en adelante, LOPIVI) y Ley 4/2023, de 22 de marzo, de Derechos, Garantías y Protección Integral de la Infancia y la Adolescencia de la Comunidad de Madrid (que derogó expresamente la Ley 6/1995), junto con el Código Civil (artículos 172 y siguientes).',
    escalasEspecificas:
      'Instrumento técnico de valoración de la gravedad de las situaciones de riesgo y desamparo infantil (VALÓRAME / sistema SIMIA), Genograma trigeneracional, Ecomapa y valoración psicosocial de idoneidad de familia extensa.',
    intervencionEspecifica:
      'a) Medida de protección jurídica: Emisión de Informe Social de propuesta desde Atención Social Primaria hacia la Dirección General de Infancia, Familia y Fomento de la Natalidad; resolución de declaración de desamparo y asunción de la tutela automática por la Comisión de Tutela del Menor de la Comunidad de Madrid (artículo 172 del Código Civil y Ley 4/2023).\nb) Prelación del acogimiento familiar: En cumplimiento del mandato legal que prohíbe el acogimiento residencial para menores de tres años y prioriza el familiar para menores de seis años (aplicando la Escala de Valoración Específica, en adelante EVE, si concurre dependencia), se valora de urgencia la idoneidad de los abuelos maternos para formalizar un Acogimiento Familiar en Familia Extensa, asignando las prestaciones económicas de apoyo al acogimiento.',
  },
  {
    id: 'caso_7_mayores_amas',
    badge: '07 · 🏛️ Mayores · Soledad No Deseada, Maltrato y Red AMAS',
    enunciado:
      'Mujer de 85 años viuda, con Grado II de Dependencia reconocido. Vecinos alertan a Servicios Sociales de que pasa días sin comida caliente; su sobrino convive esporádicamente en la vivienda, retira su pensión completa y le impide asistir al Centro de Día.',
    claves:
      'Sospecha de maltrato económico y negligencia hacia persona mayor, protocolo de coordinación sociosanitaria y comunicación a Fiscalía, revisión del Programa Individual de Atención (PIA, Decreto 54/2015), Teleasistencia Avanzada y plaza residencial AMAS.',
    normativaEspecifica:
      'Ley de Promoción de la Autonomía Personal y Atención a las personas en situación de dependencia (en adelante, LAPAD, Ley 39/2006), Decreto 54/2015, de 21 de mayo, por el que se regula el procedimiento para reconocer la situación de dependencia en la Comunidad de Madrid, Ley 12/2022 de Servicios Sociales y Ordenanza 10/2022, de 28 de junio, del Ayuntamiento de Madrid.',
    escalasEspecificas:
      'Escala de detección de sospecha de maltrato hacia las personas mayores (Índice EASI), Baremo de Valoración de la Dependencia (en adelante, BVD), Índice de Barthel, Escala de Lawton y Brody y Escala de Gijón.',
    intervencionEspecifica:
      'a) Protección frente a presunto maltrato y abuso patrimonial: Visita domiciliaria conjunta (Trabajo Social de Atención Social Primaria y Enfermería/Trabajo Social del Centro de Salud); emisión de Informe Social reservado a Fiscalía de Mayores y Personas con Discapacidad solicitando medidas cautelares de protección patrimonial y alejamiento si procede.\nb) Modificación urgente del PIA de Dependencia: Revisión de oficio del Programa Individual de Atención conforme al Decreto 54/2015 por cambio sobrevenido del entorno convivencial, sustituyendo la prestación previa por Atención Residencial pública en centro de la Agencia Madrileña de Atención Social (en adelante, AMAS) o activando de inmediato Servicio de Ayuda a Domicilio (en adelante, SAD) intensivo, comida a domicilio y Teleasistencia Avanzada.',
  },
  {
    id: 'caso_8_extranjeria_rd1155',
    badge: '08 · 🏢 Extranjería (Nuevo RD 1155/2024) + Asistencia Sanitaria',
    enunciado:
      'Familia monoparental (madre de 31 años e hijo de 7 años escolarizado) con 2 años y 4 meses de permanencia continuada en Madrid en situación administrativa irregular. La madre cuenta con precontrato laboral parcial de 22 horas semanales y presenta patología crónica sin tarjeta sanitaria.',
    claves:
      'Nuevo Reglamento de Extranjería (Real Decreto 1155/2024, que derogó el RD 557/2011), arraigo sociolaboral (mínimo 20h semanales y 2 años en España) o arraigo social, derecho a la asistencia sanitaria (RDL 7/2018) y becas de comedor.',
    normativaEspecifica:
      'Ley Orgánica 4/2000 sobre derechos y libertades de los extranjeros en España y su integración social, Real Decreto 1155/2024, de 19 de noviembre, por el que se aprueba el nuevo Reglamento de la Ley Orgánica 4/2000 (que derogó expresamente el antiguo Real Decreto 557/2011), Real Decreto-ley 7/2018 sobre el acceso universal al Sistema Nacional de Salud y Ley 12/2022 de Servicios Sociales CAM.',
    escalasEspecificas:
      'Indicadores de integración social y vulnerabilidad socioeconómica para informes de extranjería, Escala de Valoración Sociofamiliar de Gijón y ficha social de arraigo.',
    intervencionEspecifica:
      'a) Regularización administrativa bajo el nuevo Real Decreto 1155/2024: Orientación técnica y apoyo en la tramitación de autorización de residencia por arraigo sociolaboral (artículo 127.b del Real Decreto 1155/2024, al cumplir los dos años de permanencia continuada y contar con contrato superior al mínimo de veinte horas semanales) o emisión del Informe Social de arraigo social/socioformativo acreditando la escolarización obligatoria del menor de 7 años.\nb) Acceso universal a salud y prestaciones básicas: Derivación a la unidad de tramitación del Centro de Salud del Servicio Madrileño de Salud (en adelante, SERMAS) para el alta en el Documento de Asistencia Sanitaria para Extranjeros (garantizada en todo caso para menores de edad, embarazadas y seguimiento de patologías conforme al Real Decreto-ley 7/2018); tramitación de ayudas de emergencia social y reducción/exención de comedor escolar.',
  },
  {
    id: 'caso_9_adicciones_caid',
    badge: '09 · 🏥 Adicciones y Patología Dual (Red CAID / CAD Madrid Salud)',
    enunciado:
      'Varón de 38 años con dependencia severa a cocaína y alcohol y trastorno depresivo mayor, en situación de desempleo de larga duración y riesgo de pérdida de vivienda en alquiler. Acude a consulta acompañado de su hermana solicitando tratamiento.',
    claves:
      'Ley 5/2002 de Drogodependencias CAM, Centros de Atención Integral a Drogodependientes (CAID) o Centros de Atención a las Adicciones (CAD de Madrid Salud), abordaje de patología dual, comunidad terapéutica e inserción sociolaboral (Empresa de Inserción).',
    normativaEspecifica:
      'Ley 5/2002, de 27 de junio, sobre Drogodependencias y otros Trastornos Adictivos de la Comunidad de Madrid, Plan de Adicciones de la Ciudad de Madrid (organismo autónomo Madrid Salud), Ley 14/1986 General de Sanidad y Ley 19/2021 del Ingreso Mínimo Vital (en adelante, IMV).',
    escalasEspecificas:
      'Índice de Gravedad de la Adicción (EuropASI / ASI), Cuestionario AUDIT (cribado de alcohol), Escala de Valoración Sociofamiliar de Gijón y rueda de estadios del cambio de Prochaska y DiClemente.',
    intervencionEspecifica:
      'a) Abordaje biopsicosocial en red de adicciones: Acogida y valoración interdisciplinar en el Centro de Atención Integral a Drogodependientes de la Comunidad de Madrid o en el Centro de Atención a las Adicciones del organismo autónomo Madrid Salud; coordinación con el Centro de Salud Mental del Servicio Madrileño de Salud (en adelante, SERMAS) para el tratamiento simultáneo de la patología dual.\nb) Sostenimiento habitacional y reinserción: Coordinación con Atención Social Primaria para solicitar ayuda de emergencia de alquiler y tramitar el Ingreso Mínimo Vital (IMV) o la Renta Mínima de Inserción (en adelante, RMI); una vez lograda la estabilización clínica, derivación a itinerario personalizado de empleo protegido y Empresas de Inserción.',
  },
  {
    id: 'caso_10_mediacion_arrrmi',
    badge: '10 · 🏛️ Conflicto Familiar + Menor Infractor (Ley 1/2001 y ARRMI)',
    enunciado:
      'Adolescente de 15 años con medida judicial de libertad vigilada tras delito leve y absentismo escolar reiterado en 3.º de ESO. Fuerte conflictividad en el hogar tras ruptura conflictiva de los progenitores e impago de pensión de alimentos.',
    claves:
      'Ley Orgánica 5/2000 de Responsabilidad Penal de los Menores, Agencia para la Reeducación y Reinserción del Menor Infractor (ARRMI, Ley 3/2004 CAM), Mediación Familiar (Ley 1/2001 CAM / CAF municipal) y Mesa de Absentismo Escolar (EOEP / PTSC).',
    normativaEspecifica:
      'Ley Orgánica 5/2000, de 12 de enero, reguladora de la responsabilidad penal de los menores, Ley 3/2004, de 10 de diciembre, de creación de la Agencia de la Comunidad de Madrid para la Reeducación y Reinserción del Menor Infractor (en adelante, ARRMI), Ley 1/2001, de 18 de abril, reguladora de la Mediación Familiar de la Comunidad de Madrid y Ley 4/2023 de Protección a la Infancia.',
    escalasEspecificas:
      'Inventario de Gestión e Intervención para Jóvenes (IGI-J de valoración de riesgo de reincidencia en ARRMI), Genograma de relaciones y conflicto, Ecomapa y protocolo municipal de absentismo escolar.',
    intervencionEspecifica:
      'a) Ejecución socioeducativa y retorno escolar: Coordinación entre el equipo técnico de la Agencia de la Comunidad de Madrid para la Reeducación y Reinserción del Menor Infractor (ARRMI), el/la Profesor/a Técnico de Servicios a la Comunidad del instituto y la Comisión de Absentismo Escolar del distrito para diseñar un plan socioeducativo individualizado.\nb) Mediación familiar y apoyo parental: Derivación de ambos progenitores al Servicio de Mediación Familiar de la Comunidad de Madrid (regulado por la Ley 1/2001) o a los Centros de Apoyo a las Familias del Ayuntamiento de Madrid para consensuar pautas educativas y acuerdos parentales, tramitando paralelamente el acceso al Fondo de Garantía del Pago de Alimentos.',
  },
];

// ============================================================================
// BATERÍA OFICIAL DE 60 PREGUNTAS DE ALTA DIFICULTAD (CAM, SERMAS Y AYTO)
// ============================================================================
export const HIGH_DIFFICULTY_60_QUESTIONS = [
  // BLOQUE I: LEY 12/2022 SERVICIOS SOCIALES CAM (1-6)
  {
    id: 'q-hd-01',
    topicId: 'E5',
    difficulty: 'Alta (Plazos y Vigencia)',
    originType: '🏛️ OFICIAL BOCM · LEY 12/2022',
    question:
      'De conformidad con la Disposición Final Tercera y la Disposición Derogatoria Única de la Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid, señale la afirmación CORRECTA:',
    options: [
      'A) Deroga expresamente la Ley 11/2003, de 27 de marzo, de Servicios Sociales de la Comunidad de Madrid, y entró en vigor a los veinte días de su publicación en el BOCM.',
      'B) Mantiene vigente con carácter supletorio el Título II de la Ley 11/2003 relativo al catálogo de prestaciones y entró en vigor al día siguiente de su publicación en el BOE.',
      'C) Deroga la Ley 11/2003 y el Decreto 54/2015 de dependencia, entrando en vigor a los tres meses naturales desde su publicación en el BOCM.',
      'D) Entró en vigor el 1 de enero de 2024 tras una vacatio legis de seis meses hábiles.',
    ],
    correctIndex: 0,
    explanation:
      'La Ley 12/2022 (BOCM de 22/12/2022) deroga expresamente la Ley 11/2003 en su Disposición Derogatoria Única y entró en vigor a los 20 días de su publicación en el BOCM.',
  },
  {
    id: 'q-hd-02',
    topicId: 'E7',
    difficulty: 'Alta (Instrumentos Técnicos)',
    originType: '🏛️ OFICIAL BOCM · LEY 12/2022',
    question:
      'Según los artículos 19 a 23 de la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid, en relación con la Historia Social Única, el Profesional de Referencia y el Plan Individual de Atención Social (PIAS), señale la opción INCORRECTA:',
    options: [
      'A) El PIAS constituye una prestación meramente graciable cuya elaboración corresponde en exclusiva a los órganos directivos de la Atención Social Especializada sin participación del usuario.',
      'B) Todas las personas usuarias del Sistema Público de Servicios Sociales tendrán asignado un Profesional de Referencia en Atención Social Primaria para asegurar la globalidad e integralidad de la intervención.',
      'C) La Historia Social Única es el instrumento técnico básico que recoge en soporte electrónico la información relevante de diagnóstico, seguimiento y evaluación, garantizando la interoperabilidad con el sistema sanitario.',
      'D) El PIAS requiere el consentimiento informado de la persona usuaria o de quien ejerza su representación o provisión de apoyos, salvo en supuestos de urgencia vital o desprotección regulados legalmente.',
    ],
    correctIndex: 0,
    explanation:
      'Es INCORRECTA la A: el PIAS se diseña desde Atención Social Primaria (o en coordinación con Especializada) por el Profesional de Referencia con participación activa y consentimiento de la persona usuaria.',
  },
  {
    id: 'q-hd-03',
    topicId: 'E8',
    difficulty: 'Alta (Derecho Subjetivo)',
    originType: '🏛️ OFICIAL BOCM · LEY 12/2022',
    question:
      'Conforme a los artículos 25 a 28 de la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid, la diferencia jurídica esencial entre las prestaciones garantizadas y las prestaciones condicionadas de la Cartera de Servicios Sociales radica en que:',
    options: [
      'A) Las prestaciones garantizadas son exigibles como derecho subjetivo ante la Administración por quienes reúnan los requisitos objetivos establecidos, mientras que las condicionadas están sujetas a disponibilidad presupuestaria y criterios de prelación o concurrencia.',
      'B) Las prestaciones garantizadas son exclusivamente económicas y de pago único, mientras que las condicionadas son exclusivamente prestaciones tecnológicas o de servicio.',
      'C) Las prestaciones condicionadas constituyen derechos subjetivos reclamables en vía jurisdiccional contencioso-administrativa sin necesidad de crédito presupuestario previo.',
      'D) Las prestaciones garantizadas solo pueden prestarse mediante gestión indirecta mercantil y nunca por las Entidades Locales.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 26 y 27 de la Ley 12/2022: las prestaciones garantizadas tienen naturaleza de derecho subjetivo exigible administrativa y judicialmente; las condicionadas dependen de los recursos y consignaciones presupuestarias disponibles.',
  },
  {
    id: 'q-hd-04',
    topicId: 'E6',
    difficulty: 'Alta (Estructura Funcional)',
    originType: '🏛️ OFICIAL BOCM · LEY 12/2022',
    question:
      'En la arquitectura organizativa del Sistema Público de Servicios Sociales regulada en el Título II de la Ley 12/2022 de la Comunidad de Madrid, señale qué afirmación define correctamente la relación entre Atención Social Primaria y Atención Social Especializada:',
    options: [
      'A) La Atención Social Primaria constituye el primer nivel de referencia y puerta de entrada ordinaria al sistema en el ámbito local/municipal, correspondiendo a la Atención Social Especializada las intervenciones de mayor complejidad técnica o intensidad de apoyos, salvo situaciones de urgencia o emergencia social que permiten el acceso directo.',
      'B) La Atención Social Especializada es la única puerta de entrada para menores de edad y personas mayores de 65 años, quedando la Atención Social Primaria reservada a personas en edad laboral.',
      'C) Ambos niveles están jerárquicamente subordinados al Consejo Interterritorial del Sistema Nacional de Salud.',
      'D) El acceso a la Atención Social Especializada exige en todo caso resolución judicial firme previa dictada por los Juzgados de Primera Instancia.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 31 a 37 de la Ley 12/2022: la Atención Social Primaria es el nivel básico y puerta de entrada ordinaria al sistema, articulándose la derivación hacia Atención Social Especializada salvo en los supuestos tasados de urgencia o emergencia.',
  },
  {
    id: 'q-hd-05',
    topicId: 'E10',
    difficulty: 'Alta (Órganos Consultivos)',
    originType: '🏛️ OFICIAL BOCM · LEY 12/2022',
    question:
      'De acuerdo con el Título IV y el Título V de la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid, ¿cuál es el órgano superior de carácter consultivo y de participación ciudadana en materia de servicios sociales en el ámbito autonómico, y cuál es el órgano encargado de deliberar sobre dilemas éticos en la intervención?',
    options: [
      'A) El Consejo de Servicios Sociales de la Comunidad de Madrid como órgano superior consultivo de participación, y el Comité de Ética de los Servicios Sociales de la Comunidad de Madrid en el ámbito bioético y deontológico.',
      'B) La Comisión de Tutela del Menor como órgano de participación ciudadana y el Tribunal Económico-Administrativo como órgano ético.',
      'C) La Asamblea de Madrid en pleno y el Colegio Oficial de Médicos de Madrid.',
      'D) El Observatorio Estatal de la Dependencia y la Agencia de Protección de Datos.',
    ],
    correctIndex: 0,
    explanation:
      'La Ley 12/2022 regula el Consejo de Servicios Sociales de la Comunidad de Madrid como órgano colegiado superior de participación y consulta, e institucionaliza el Comité de Ética de los Servicios Sociales.',
  },
  {
    id: 'q-hd-06',
    topicId: 'E9',
    difficulty: 'Alta (Régimen Sancionador y Prescripción)',
    originType: '🏛️ OFICIAL BOCM · LEY 12/2022',
    question:
      'En virtud del Título VIII de la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid relativo a la función inspectora y al régimen sancionador en centros y servicios sociales, las infracciones administrativas se clasifican en leves, graves y muy graves, prescribiendo las infracciones muy graves a los:',
    options: [
      'A) Cuatro años, las graves a los tres años y las leves al año.',
      'B) Tres años las muy graves, dos años las graves y seis meses las leves.',
      'C) Cinco años las muy graves, dos años las graves y tres meses las leves.',
      'D) Diez años las muy graves y un año las graves y leves.',
    ],
    correctIndex: 0,
    explanation:
      'En el régimen sancionador de la Ley 12/2022 de Servicios Sociales de la CAM (Título VIII), los plazos de prescripción de las infracciones son de 4 años para las muy graves, 3 años para las graves y 1 año para las leves.',
  },

  // BLOQUE II: DECRETO 54/2015 DEPENDENCIA CAM (7-12)
  {
    id: 'q-hd-07',
    topicId: 'E23',
    difficulty: 'Alta (Plazo y Silencio Administrativo)',
    originType: '🏛️ OFICIAL BOCM · DECRETO 54/2015',
    question:
      'Conforme al Decreto 54/2015, de 21 de mayo, por el que se regula el procedimiento para reconocer la situación de dependencia y el derecho a las prestaciones del sistema para la autonomía y atención a la dependencia en la Comunidad de Madrid, el plazo máximo para dictar y notificar la resolución de grado y de Programa Individual de Atención (PIA), así como el sentido del silencio administrativo, es de:',
    options: [
      'A) Seis meses desde la fecha de entrada de la solicitud en el registro del órgano competente, entendiéndose desestimada por silencio administrativo negativo si vence dicho plazo sin notificación expresa.',
      'B) Tres meses hábiles para el grado y otros tres meses hábiles para el PIA, operando el silencio administrativo positivo en ambos casos.',
      'C) Cuatro meses naturales desde el informe social de Atención Primaria, con silencio positivo.',
      'D) Doce meses desde la valoración en el domicilio, produciéndose la caducidad automática imputable al interesado.',
    ],
    correctIndex: 0,
    explanation:
      'El Decreto 54/2015 establece un procedimiento unificado cuyo plazo máximo de resolución y notificación es de 6 meses, teniendo el silencio administrativo carácter desestimatorio (negativo).',
  },
  {
    id: 'q-hd-08',
    topicId: 'E23',
    difficulty: 'Alta (Requisito de Residencia)',
    originType: '🏛️ OFICIAL BOCM · DECRETO 54/2015',
    question:
      'Para el reconocimiento de la situación de dependencia en la Comunidad de Madrid según el artículo 4 del Decreto 54/2015 y el artículo 5 de la Ley 39/2006 (LAPAD), el requisito de residencia en territorio español exige:',
    options: [
      'A) Residir en territorio español y haberlo hecho durante cinco años, de los cuales dos deberán ser inmediatamente anteriores a la fecha de presentación de la solicitud; para los menores de cinco años el periodo de residencia se exigirá a quien ejerza su guarda y custodia.',
      'B) Estar empadronado ininterrumpidamente en un municipio de la Comunidad de Madrid durante los diez años inmediatamente anteriores a la solicitud.',
      'C) Haber residido en España durante tres años naturales, de los cuales uno deberá ser inmediatamente anterior a la valoración técnica.',
      'D) No se exige periodo previo de residencia en España a ningún solicitante mayor de 65 años.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 5 Ley 39/2006 y Art. 4 Decreto 54/2015: 5 años de residencia en España, de los cuales 2 han de ser inmediatamente anteriores a la solicitud (en menores de 5 años el requisito se traslada a quien ejerza su guarda y custodia).',
  },
  {
    id: 'q-hd-09',
    topicId: 'E22',
    difficulty: 'Alta (Baremos BVD y EVE)',
    originType: '🏛️ OFICIAL BOCM · RD 174/2011 Y DECRETO 54/2015',
    question:
      'De acuerdo con el Real Decreto 174/2011 y el Decreto 54/2015 de la Comunidad de Madrid, señale los intervalos exactos de puntuación del Baremo de Valoración de la Dependencia (BVD) y el rango de edad en el que se aplica la Escala de Valoración Específica (EVE):',
    options: [
      'A) La EVE se aplica a menores de 3 años (0 a 3 años); en el BVD, el Grado I (Dependencia moderada) comprende de 25 a 49 puntos, el Grado II (Dependencia severa) de 50 a 74 puntos y el Grado III (Gran dependencia) de 75 a 100 puntos.',
      'B) La EVE se aplica a menores de 6 años; en el BVD, el Grado I es de 33 a 49 puntos, el Grado II de 50 a 64 puntos y el Grado III de 65 a 100 puntos.',
      'C) La EVE se aplica hasta los 18 años; en el BVD, el Grado I es de 15 a 39 puntos, el Grado II de 40 a 69 puntos y el Grado III de 70 a 100 puntos.',
      'D) El BVD se aplica desde el nacimiento y exige un mínimo de 30 puntos para el Grado I.',
    ],
    correctIndex: 0,
    explanation:
      'RD 174/2011 y art. 26 Ley 39/2006: EVE para menores de 3 años. Puntuaciones BVD: 0-24 sin grado, 25-49 Grado I, 50-74 Grado II, 75-100 Grado III.',
  },
  {
    id: 'q-hd-10',
    topicId: 'E23',
    difficulty: 'Alta (Subsanación y Desistimiento)',
    originType: '🏛️ OFICIAL BOCM · DECRETO 54/2015',
    question:
      'En la tramitación del procedimiento regulado en el Decreto 54/2015 de la Comunidad de Madrid, si la solicitud de reconocimiento de la dependencia no reúne los requisitos exigidos o no acompaña la documentación preceptiva, se requerirá al interesado para que subsane la falta en el plazo de:',
    options: [
      'A) Diez días hábiles, con indicación de que, si así no lo hiciera, se le tendrá por desistido de su solicitud previa resolución dictada en los términos de la legislación de procedimiento administrativo común.',
      'B) Quince días naturales improrrogables, archivándose sin necesidad de dictar resolución expresa.',
      'C) Treinta días hábiles desde la visita domiciliaria del órgano de valoración.',
      'D) Cinco días hábiles por tratarse de un procedimiento de tramitación de urgencia preferente.',
    ],
    correctIndex: 0,
    explanation:
      'Conforme al Decreto 54/2015 en relación con el art. 68 de la Ley 39/2015 (LPAC), el plazo de subsanación de la solicitud es de 10 días hábiles.',
  },
  {
    id: 'q-hd-11',
    topicId: 'E23',
    difficulty: 'Alta (Revisión de Grado y PIA)',
    originType: '🏛️ OFICIAL BOCM · DECRETO 54/2015',
    question:
      'Según los artículos 15 y 28 del Decreto 54/2015 de la Comunidad de Madrid, la revisión del grado de dependencia por mejoría o empeoramiento a instancia de parte no podrá solicitarse hasta que hayan transcurrido desde la fecha en que se dictó la resolución anterior al menos:',
    options: [
      'A) Dos años, salvo que se acredite suficientemente mediante informe médico o social una variación sustancial de las condiciones de salud o del entorno que motive la revisión antes de dicho plazo.',
      'B) Seis meses en todos los casos sin posibilidad de excepción médica.',
      'C) Cinco años desde la aprobación del primer Programa Individual de Atención.',
      'D) Un año natural contado desde la fecha de empadronamiento en la Comunidad de Madrid.',
    ],
    correctIndex: 0,
    explanation:
      'El Decreto 54/2015 establece el plazo general de 2 años para instar nueva revisión de grado por empeoramiento o mejoría, salvo que se acredite documentalmente un agravamiento o cambio sustancial sobrevenido.',
  },
  {
    id: 'q-hd-12',
    topicId: 'E23',
    difficulty: 'Alta (Régimen de Incompatibilidades CAM)',
    originType: '🏛️ OFICIAL BOCM · DECRETO 54/2015',
    question:
      'De acuerdo con el régimen de compatibilidades e incompatibilidades de los servicios y prestaciones económicas del catálogo de dependencia en la Comunidad de Madrid (Decreto 54/2015), señale la afirmación CORRECTA:',
    options: [
      'A) El servicio de Atención Residencial permanente es incompatible con el Servicio de Ayuda a Domicilio, con el servicio de Centro de Día y con el servicio de Teleasistencia, mientras que la Teleasistencia es compatible con el resto de servicios salvo con el residencial.',
      'B) El servicio de Atención Residencial es plenamente compatible con la percepción simultánea de la Prestación Económica para Cuidados en el Entorno Familiar (PECEF).',
      'C) El servicio de Teleasistencia es incompatible con el Servicio de Ayuda a Domicilio y con los Centros de Día en los Grados II y III.',
      'D) La Prestación Económica Vinculada al Servicio (PEVS) puede percibirse sin necesidad de justificar la contratación efectiva del servicio acreditado.',
    ],
    correctIndex: 0,
    explanation:
      'En el catálogo SAAD y en el Decreto 54/2015 de la CAM, la Atención Residencial permanente es incompatible con la Teleasistencia, el SAD y el Centro de Día.',
  },

  // BLOQUE III: REAL DECRETO 888/2022 DISCAPACIDAD (13-18)
  {
    id: 'q-hd-13',
    topicId: 'E28',
    difficulty: 'Alta (Entrada en Vigor y Derogación)',
    originType: '🏛️ OFICIAL BOE · RD 888/2022',
    question:
      'El Real Decreto 888/2022, de 18 de octubre, por el que se establece el procedimiento para el reconocimiento, declaración y calificación del grado de discapacidad:',
    options: [
      'A) Derogó el antiguo Real Decreto 1971/1999, entró en vigor a los seis meses de su publicación en el BOE (el 20 de abril de 2023) y adapta la valoración al modelo biopsicosocial de la Clasificación Internacional del Funcionamiento, de la Discapacidad y de la Salud (CIF-OMS).',
      'B) Mantiene vigentes los baremos médicos del Real Decreto 1971/1999 para mayores de 65 años y fija el umbral de discapacidad legal en el 25 por ciento.',
      'C) Sustituye al Baremo de Valoración de la Dependencia del Real Decreto 174/2011 unificando ambos procedimientos en un plazo de tres meses.',
      'D) Entró en vigor el 1 de enero de 2025 y atribuye la competencia exclusiva de valoración a los Ayuntamientos.',
    ],
    correctIndex: 0,
    explanation:
      'El RD 888/2022 (BOE 20/10/2022) derogó el RD 1971/1999 tras una vacatio legis de 6 meses (entrando en vigor el 20/04/2023) e implanta el modelo biopsicosocial de la CIF.',
  },
  {
    id: 'q-hd-14',
    topicId: 'E28',
    difficulty: 'Alta (Los 4 Baremos Anexos)',
    originType: '🏛️ OFICIAL BOE · RD 888/2022',
    question:
      'Según el artículo 4 y los Anexos del Real Decreto 888/2022, la evaluación del grado de discapacidad se realiza mediante la aplicación articulada de cuatro baremos objetivos, que son:',
    options: [
      'A) 1) Baremo de Deficiencias Globales de la Persona (BDGP), 2) Baremo de Limitaciones en la Actividad (BLA), 3) Baremo de Restricciones en la Participación (BRP, cuestionario de desempeño WHO-DAS 2.0) y 4) Baremo de Factores Contextuales y Barreras Ambientales (BFCA).',
      'B) 1) Escala de Gijón, 2) Índice de Barthel, 3) Escala de Zarit y 4) Test Mini-Mental de Lobo.',
      'C) 1) Baremo Médico Hospitalario, 2) Baremo Tributario de Rentas, 3) Baremo de Empleabilidad y 4) Baremo de Movilidad Reducida.',
      'D) Únicamente el Baremo de Diagnóstico Clínico y el Baremo de Tercera Persona.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 4 y Anexos III y IV del RD 888/2022: la valoración integra el BDGP, el BLA, el BRP y el BFCA (factores contextuales y barreras ambientales).',
  },
  {
    id: 'q-hd-15',
    topicId: 'E28',
    difficulty: 'Alta (Peso del Baremo Social BFCA)',
    originType: '🏛️ OFICIAL BOE · RD 888/2022',
    question:
      'En la fórmula de cálculo del grado final de discapacidad establecida en el Real Decreto 888/2022, una vez obtenido el "Grado de Discapacidad Inicial" (combinación de BDGP, BLA y BRP), el Baremo de Factores Contextuales y Barreras Ambientales (BFCA) elaborado con la intervención del profesional de Trabajo Social:',
    options: [
      'A) Actúa como factor modificador neto que puede adicionar hasta un máximo de 24 puntos porcentuales, siempre y cuando el Grado de Discapacidad Inicial alcance al menos un 15 % (Clase 2 o superior).',
      'B) Se suma en todos los casos aunque la persona tenga un 0 % de deficiencia física, psíquica o sensorial, hasta un máximo de 15 puntos.',
      'C) Puede restar hasta 20 puntos porcentuales si la persona cuenta con apoyo familiar y vivienda adaptada.',
      'D) Solo se aplica cuando el Grado de Discapacidad Inicial supera el 75 %.',
    ],
    correctIndex: 0,
    explanation:
      'Conforme al Anexo III/IV del RD 888/2022, el BFCA puede sumar hasta un máximo de 24 puntos como modificador de ajuste neto, pero solo se adiciona cuando la persona presenta una deficiencia/limitación encuadrada al menos en la Clase 2 (igual o superior al 15%).',
  },
  {
    id: 'q-hd-16',
    topicId: 'E28',
    difficulty: 'Alta (Las 5 Clases de Discapacidad)',
    originType: '🏛️ OFICIAL BOE · RD 888/2022',
    question:
      'Conforme a la clasificación de grados del Real Decreto 888/2022, ¿en cuántas Clases se agrupan los porcentajes de discapacidad y a partir de qué clase y porcentaje se tiene la consideración legal de persona con discapacidad conforme al artículo 4 del Real Decreto Legislativo 1/2013?',
    options: [
      'A) Se agrupan en cinco clases: Clase 0 Inexistente (0 % a 4 %), Clase 1 Leve (5 % a 24 %), Clase 2 Moderada (25 % a 49 %), Clase 3 Grave (50 % a 95 %) y Clase 4 Total o Completa (96 % a 100 %); reconociéndose la condición legal de persona con discapacidad dentro de la Clase 2 a partir del 33 %.',
      'B) Se agrupan en tres grados idénticos a los de dependencia: Grado I (25-49 %), Grado II (50-74 %) y Grado III (75-100 %).',
      'C) Se agrupan en cuatro clases, adquiriéndose la condición legal de discapacidad desde el 25 % en la Clase 1.',
      'D) La Clase 4 Total empieza en el 65 % y la Clase 3 Grave abarca del 33 % al 64 %.',
    ],
    correctIndex: 0,
    explanation:
      'El RD 888/2022 estructura las 5 clases de la CIF (0: 0-4%, 1: 5-24%, 2: 25-49%, 3: 50-95%, 4: 96-100%), manteniéndose el umbral legal del 33% (dentro de la Clase 2 Moderada).',
  },
  {
    id: 'q-hd-17',
    topicId: 'E28',
    difficulty: 'Alta (Plazo de Resolución y Tramitación Urgente)',
    originType: '🏛️ OFICIAL BOE · RD 888/2022',
    question:
      'Según los artículos 9 y 11 del Real Decreto 888/2022, ¿cuál es el plazo máximo para dictar y notificar la resolución del procedimiento de reconocimiento de grado de discapacidad en tramitación ordinaria y a cuánto se reduce cuando se acuerda la tramitación de urgencia?',
    options: [
      'A) El plazo máximo ordinario es de seis meses, reduciéndose a la mitad (tres meses) cuando se acuerde la tramitación de urgencia.',
      'B) El plazo máximo ordinario es de tres meses y el de urgencia de quince días hábiles.',
      'C) El plazo máximo ordinario es de doce meses y el de urgencia de seis meses, con silencio administrativo positivo.',
      'D) El plazo máximo es de noventa días naturales sin posibilidad de tramitación urgente.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 9 y 11 del RD 888/2022: el plazo máximo de resolución y notificación en vía ordinaria es de 6 meses (con silencio negativo), reduciéndose a la mitad (3 meses) en los supuestos tasados de tramitación preferente/urgente.',
  },
  {
    id: 'q-hd-18',
    topicId: 'E29',
    difficulty: 'Alta (Equipo Multiprofesional y Plazo de Revisión)',
    originType: '🏛️ OFICIAL BOE · RD 888/2022',
    question:
      'De acuerdo con los artículos 7 y 13 del Real Decreto 888/2022, en relación con los equipos multiprofesionales de calificación y la revisión del grado de discapacidad:',
    options: [
      'A) El equipo multiprofesional está conformado por profesionales del área sanitaria y del área social, y la revisión a instancia de parte requerirá que hayan transcurrido al menos dos años desde la resolución anterior, salvo acreditación de cambio sustancial o error de diagnóstico.',
      'B) El equipo multiprofesional está integrado exclusivamente por médicos inspectores del INSS, pudiendo solicitarse revisión cada tres meses sin justificación.',
      'C) El dictamen debe ser emitido siempre de forma presencial sin que el Real Decreto 888/2022 permita en ningún supuesto la valoración por medios telemáticos.',
      'D) El grado de discapacidad reconocido a mayores de 65 años se extingue de oficio al cumplir los 70 años.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 7, 8 y 13 del RD 888/2022: el equipo multiprofesional combina área sanitaria y social y fija el plazo general de 2 años para solicitar revisión de grado salvo cambio sustancial acreditado o error diagnóstico.',
  },

  // BLOQUE IV: LEY 4/2023 INFANCIA Y ADOLESCENCIA CAM (19-24)
  {
    id: 'q-hd-19',
    topicId: 'E37',
    difficulty: 'Alta (Derogación y Objeto)',
    originType: '🏛️ OFICIAL BOCM · LEY 4/2023',
    question:
      'La Ley 4/2023, de 22 de marzo, de Derechos, Garantías y Protección Integral de la Infancia y la Adolescencia de la Comunidad de Madrid:',
    options: [
      'A) Deroga expresamente la Ley 6/1995, de 28 de marzo, de Garantías de los Derechos de la Infancia y la Adolescencia en la Comunidad de Madrid, y la Ley 18/1999 reguladora de los Consejos de Atención a la Infancia, alineando el sistema autonómico con la Ley Orgánica 8/2021 (LOPIVI).',
      'B) Mantiene en vigor la Ley 6/1995 para los adolescentes de 14 a 17 años y se aplica únicamente a menores de 12 años.',
      'C) Sustituye a la Ley Orgánica 5/2000 de Responsabilidad Penal de los Menores atribuyendo la competencia penal a los Ayuntamientos.',
      'D) Suprime la Comisión de Tutela del Menor trasladando sus funciones a la Agencia AMAPAD.',
    ],
    correctIndex: 0,
    explanation:
      'La Disposición Derogatoria Única de la Ley 4/2023 de la CAM deroga de forma expresa la histórica Ley 6/1995 y la Ley 18/1999.',
  },
  {
    id: 'q-hd-20',
    topicId: 'E38',
    difficulty: 'Alta (Riesgo vs. Desamparo: Competencias)',
    originType: '🏛️ OFICIAL BOCM · LEY 4/2023',
    question:
      'De conformidad con el Título III de la Ley 4/2023 de la Comunidad de Madrid y la Ley Orgánica 1/1996, la distribución competencial entre la declaración de la situación de riesgo y la declaración de la situación de desamparo se articula del siguiente modo:',
    options: [
      'A) La valoración, intervención y declaración administrativa de la situación de riesgo corresponde a la Entidad Local (Servicios Sociales de Atención Social Primaria / municipales) mediante un proyecto de intervención social y educativo familiar, mientras que la declaración de desamparo y la consiguiente asunción de la tutela por ministerio de la ley corresponde a la Administración Autonómica a través de la Comisión de Tutela del Menor.',
      'B) Tanto la declaración de riesgo como la asunción de la tutela automática por desamparo corresponden exclusivamente al Alcalde o Junta de Gobierno Local.',
      'C) La declaración de riesgo conlleva la privación inmediata de la patria potestad y la separación del menor de su núcleo familiar.',
      'D) La situación de desamparo solo puede ser declarada por sentencia firme de la Audiencia Provincial.',
    ],
    correctIndex: 0,
    explanation:
      'En la Ley 4/2023 CAM y arts. 17 y 18 LO 1/1996: la situación de riesgo es competencia de las Entidades Locales; la declaración de desamparo y asunción de tutela ex lege corresponde a la CAM (Comisión de Tutela del Menor).',
  },
  {
    id: 'q-hd-21',
    topicId: 'E39',
    difficulty: 'Alta (Prelación del Acogimiento Familiar)',
    originType: '🏛️ OFICIAL BOCM · LEY 4/2023 Y LO 1/1996',
    question:
      'En relación con las medidas de protección de guarda y tutela reguladas en la Ley 4/2023 de la Comunidad de Madrid y en el artículo 21 de la Ley Orgánica 1/1996, señale la afirmación CORRECTA sobre la prioridad del acogimiento familiar frente al acogimiento residencial:',
    options: [
      'A) Prevalecerá siempre la medida de acogimiento familiar sobre la de acogimiento residencial para cualquier menor, y de forma muy especial para los menores de seis años; no se acordará el acogimiento residencial para menores de tres años salvo en supuestos de imposibilidad debidamente acreditada o cuando convenga a su interés superior, no pudiendo superar en estos casos la estancia residencial los tres meses.',
      'B) Los menores de tres años ingresarán preferentemente en residencias de primera infancia durante un periodo mínimo de dos años antes de pasar a familia acogedora.',
      'C) El acogimiento familiar en familia ajena tiene siempre preferencia legal absoluta sobre el acogimiento en familia extensa.',
      'D) El acogimiento familiar temporal tiene una duración máxima de cinco años prorrogables por otros cinco.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 21.3 LO 1/1996 y Ley 4/2023 CAM: prioridad del acogimiento familiar para menores de 6 años; prohibición general del residencial para menores de 3 años salvo imposibilidad acreditada, con un tope máximo de estancia residencial de 3 meses.',
  },
  {
    id: 'q-hd-22',
    topicId: 'E38',
    difficulty: 'Alta (Guarda Voluntaria: Plazo)',
    originType: '🏛️ OFICIAL BOCM · LEY 4/2023',
    question:
      'Cuando quienes tienen potestad sobre un menor solicitan a la Entidad Pública (Comunidad de Madrid) que asuma su guarda provisional por concurrir circunstancias graves y transitorias que les impiden cuidarlo (guarda voluntaria), la Ley 4/2023 y el artículo 172 bis del Código Civil establecen que dicha guarda:',
    options: [
      'A) No podrá sobrepasar el plazo máximo de dos años, salvo que el interés superior del menor aconseje excepcionalmente la prórroga de la medida por la previsible reintegración familiar en un plazo breve, debiendo formalizarse por escrito con compromiso de someterse a la intervención profesional.',
      'B) Tendrá carácter indefinido hasta que el menor alcance la mayoría de edad, produciendo la suspensión automática de la patria potestad.',
      'C) Tendrá una duración máxima improrrogable de tres meses naturales.',
      'D) Requiere previa declaración administrativa de desamparo por la Comisión de Tutela del Menor.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 172 bis del Código Civil y Ley 4/2023 CAM: la guarda voluntaria a petición de los progenitores o tutores tiene una duración máxima de 2 años (salvo prórroga excepcional por inminente retorno familiar).',
  },
  {
    id: 'q-hd-23',
    topicId: 'E39',
    difficulty: 'Alta (Modalidades de Acogimiento Familiar por Duración)',
    originType: '🏛️ OFICIAL BOCM · LEY 4/2023 Y CÓDIGO CIVIL',
    question:
      'Atendiendo a su duración y objetivos conforme al artículo 173 bis del Código Civil y la Ley 4/2023 de la Comunidad de Madrid, las modalidades del acogimiento familiar son:',
    options: [
      'A) Acogimiento familiar de urgencia (principalmente para menores de seis años, con una duración no superior a seis meses en tanto se decide la medida de protección), acogimiento familiar temporal (de carácter transitorio por preverse la reintegración familiar, con una duración máxima de dos años salvo prórroga excepcional) y acogimiento familiar permanente.',
      'B) Acogimiento simple (máximo un año), acogimiento preadoptivo (máximo tres años) y acogimiento judicial.',
      'C) Acogimiento de urgencia (máximo quince días), acogimiento temporal (máximo seis meses) y acogimiento definitivo.',
      'D) Acogimiento diurno, acogimiento nocturno y acogimiento de fin de semana exclusivamente.',
    ],
    correctIndex: 0,
    explanation:
      'Las tres modalidades por duración son: Urgencia (menores de 6 años, máx. 6 meses), Temporal (máx. 2 años) y Permanente.',
  },
  {
    id: 'q-hd-24',
    topicId: 'E37',
    difficulty: 'Alta (Deber de Comunicación Cualificado)',
    originType: '🏛️ OFICIAL BOCM · LEY 4/2023 Y LO 8/2021 LOPIVI',
    question:
      'En virtud del deber de comunicación cualificado regulado en los artículos 15 y 16 de la Ley Orgánica 8/2021 (LOPIVI) y en la Ley 4/2023 de la Comunidad de Madrid, ¿qué profesionales tienen la obligación reforzada de comunicar de forma inmediata a los Servicios Sociales, a la Entidad Pública de protección o al Ministerio Fiscal cualquier indicio de violencia o desprotección sobre una persona menor de edad?',
    options: [
      'A) El personal de los centros sanitarios, centros educativos, servicios sociales, fuerzas y cuerpos de seguridad y centros deportivos o de ocio que tengan contacto habitual con personas menores de edad, garantizándose la confidencialidad y protección de la persona comunicante.',
      'B) Exclusivamente los jueces de menores y los médicos forenses cuando exista parte de lesiones hospitalario grave.',
      'C) Únicamente los progenitores que ostenten la patria potestad compartida.',
      'D) El personal funcionario solo cuando disponga de pruebas periciales concluyentes tras seis meses de seguimiento.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 15 y 16 LOPIVI y Ley 4/2023 CAM: deber de comunicación cualificado para el personal de ámbitos sanitario, educativo, social, policial y de ocio/deporte que trabaja habitualmente con menores.',
  },

  // BLOQUE V: LEY 55/2003 ESTATUTO MARCO SERMAS (25-30)
  {
    id: 'q-hd-25',
    topicId: 'S-6',
    difficulty: 'Alta (Reforma Temporalidad Art. 9 Ley 55/2003)',
    originType: '🏥 OFICIAL SERMAS · LEY 55/2003',
    question:
      'Tras la modificación del artículo 9 de la Ley 55/2003, de 16 de diciembre, del Estatuto Marco del personal estatutario de los servicios de salud (operada por el Real Decreto-ley 12/2022), señale cuál es el plazo máximo de duración del nombramiento de personal estatutario temporal de carácter interino por exceso o acumulación de tareas:',
    options: [
      'A) Un plazo máximo de nueve meses, dentro de un período de dieciocho meses, habiéndose suprimido la antigua figura del nombramiento eventual.',
      'B) Un plazo máximo de doce meses dentro de un período de veinticuatro meses, renovable indefinidamente.',
      'C) Un plazo máximo de tres años prorrogables por otros dos años.',
      'D) Un plazo máximo de seis meses dentro de un año natural bajo la modalidad de contrato eventual de guardia.',
    ],
    correctIndex: 0,
    explanation:
      'El nuevo art. 9 de la Ley 55/2003 suprimió el nombramiento eventual y regula el nombramiento interino en tres supuestos: vacante (máx. 3 años), programas temporales (máx. 3 años) y exceso o acumulación de tareas (máx. 9 meses dentro de un período de 18 meses).',
  },
  {
    id: 'q-hd-26',
    topicId: 'S-6',
    difficulty: 'Alta (Clasificación Funcional TS en SERMAS)',
    originType: '🏥 OFICIAL SERMAS · LEY 55/2003',
    question:
      'Conforme a los artículos 6 y 7 de la Ley 55/2003 del Estatuto Marco y a la Resolución de convocatoria del Servicio Madrileño de Salud (BOCM 06/11/2026), la categoría estatutaria de Trabajador/a Social se encuadra dentro de:',
    options: [
      'A) El Personal Estatutario de Gestión y Servicios, de formación universitaria, en el Grupo A, Subgrupo A2 (Diplomado Universitario o Grado equivalente en Trabajo Social).',
      'B) El Personal Estatutario Sanitario Facultativo en el Subgrupo A1.',
      'C) El Personal Laboral Temporal sujeto exclusivamente al Convenio Colectivo de Oficinas y Despachos.',
      'D) El Cuerpo de Técnicos Auxiliares de Administración General en el Subgrupo C1.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 7.2.a) de la Ley 55/2003 y Base 1 de la convocatoria SERMAS: Personal Estatutario de Gestión y Servicios de formación universitaria, Grupo A, Subgrupo A2.',
  },
  {
    id: 'q-hd-27',
    topicId: 'S-6',
    difficulty: 'Alta (Excedencia Voluntaria Art. 67)',
    originType: '🏥 OFICIAL SERMAS · LEY 55/2003',
    question:
      'Según el artículo 67 de la Ley 55/2003 del Estatuto Marco, para que el personal estatutario fijo pueda obtener la declaración de excedencia voluntaria por interés particular, y en cuanto a su tiempo mínimo de permanencia en ella, se requiere:',
    options: [
      'A) Haber prestado servicios efectivos en cualquiera de las Administraciones Públicas durante los cinco años inmediatamente anteriores, y el tiempo mínimo de permanencia en la situación de excedencia voluntaria será de dos años.',
      'B) Haber prestado servicios efectivos durante tres años y permanecer al menos un año en excedencia.',
      'C) Haber superado el periodo de prueba de seis meses, sin exigirse tiempo mínimo de permanencia en la situación de excedencia.',
      'D) Contar con diez años de antigüedad en el mismo hospital del SERMAS y permanecer un máximo de tres años.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 67.1.a) y 67.2 de la Ley 55/2003: exige 5 años de servicios efectivos inmediatamente anteriores en cualquiera de las AAPP y un tiempo mínimo de permanencia de 2 años en excedencia voluntaria.',
  },
  {
    id: 'q-hd-28',
    topicId: 'S-6',
    difficulty: 'Alta (Trampa de Prescripción de Faltas Art. 72)',
    originType: '🏥 OFICIAL SERMAS · LEY 55/2003',
    question:
      '¡Pregunta de contraste normativo! De acuerdo con el artículo 72.2 de la Ley 55/2003 del Estatuto Marco del personal estatutario de los servicios de salud, los plazos de prescripción de las faltas disciplinarias muy graves, graves y leves son, respectivamente:',
    options: [
      'A) Las faltas muy graves prescribirán a los cuatro años, las graves a los dos años y las leves a los seis meses (a diferencia del TREBEP general donde las muy graves prescriben a los tres años).',
      'B) Las faltas muy graves a los tres años, las graves a los dos años y las leves al año.',
      'C) Las faltas muy graves a los cinco años, las graves a los tres años y las leves a los dos meses.',
      'D) Las faltas muy graves no prescriben nunca y las graves prescriben al año.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 72.2 de la Ley 55/2003: en el Estatuto Marco las faltas MUY GRAVES prescriben a los 4 AÑOS, las graves a los 2 años y las leves a los 6 meses.',
  },
  {
    id: 'q-hd-29',
    topicId: 'S-6',
    difficulty: 'Alta (Sanciones Disciplinarias Art. 73)',
    originType: '🏥 OFICIAL SERMAS · LEY 55/2003',
    question:
      'Conforme al artículo 73 de la Ley 55/2003 del Estatuto Marco, en relación con las sanciones disciplinarias de "separación del servicio" y de "suspensión de funciones", señale la opción CORRECTA:',
    options: [
      'A) La separación del servicio solo se impondrá por faltas muy graves y durante los seis años siguientes a su ejecución el interesado no podrá concurrir a pruebas de selección ni prestar servicios como estatutario; la suspensión firme de funciones por falta muy grave tendrá una duración de entre dos y seis años, y por falta grave no superará los dos años.',
      'B) La separación del servicio puede imponerse tanto por faltas graves como muy graves e inhabilita de por vida.',
      'C) La suspensión de funciones por falta muy grave tiene una duración máxima de seis meses y nunca conlleva pérdida del destino.',
      'D) Si la suspensión firme de funciones no supera los doce meses, el interesado pierde la titularidad de su destino.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 73.1.a) y c) de la Ley 55/2003: la separación del servicio impide concurrir como estatutario durante los 6 años siguientes; la suspensión por falta muy grave va de 2 a 6 años, y por falta grave hasta 2 años.',
  },
  {
    id: 'q-hd-30',
    topicId: 'S-6',
    difficulty: 'Alta (Toma de Posesión y Baremo SERMAS)',
    originType: '🏥 OFICIAL SERMAS · LEY 55/2003 Y BOCM 06/11/2026',
    question:
      'Según el artículo 20 de la Ley 55/2003 y las Bases 11 y 13 de la convocatoria de Trabajador Social del SERMAS (Resolución de 20 de octubre de 2026, BOCM 06/11/2026), señale la afirmación CORRECTA sobre el plazo de toma de posesión y el baremo de méritos:',
    options: [
      'A) El plazo para la toma de posesión es de un mes a contar desde el día siguiente al de la publicación de la resolución de nombramiento en el BOCM; y en la fase de concurso (máximo 50 puntos), los servicios prestados como Trabajador/a Social en Administraciones Públicas distintas a instituciones sanitarias (epígrafe 1.2) puntúan a razón de 0,006 puntos por día trabajado.',
      'B) El plazo de toma de posesión es de diez días naturales y la fase de concurso vale un máximo de 30 puntos.',
      'C) Los servicios prestados en el Ayuntamiento de Madrid o en la Consejería de Familia no se valoran en ningún apartado del baremo del SERMAS.',
      'D) Para superar la fase de oposición basta con obtener un 25 % de la media de las diez mejores notas sin penalización por errores.',
    ],
    correctIndex: 0,
    explanation:
      'Base 13.2 y Anexo II del BOCM de 06/11/2026: toma de posesión en el plazo de 1 mes; fase de concurso 50 puntos, puntuando el epígrafe 1.2 (otras AAPP fuera de centros sanitarios) a 0,006 puntos por día.',
  },

  // BLOQUE VI: AYUNTAMIENTO DE MADRID · SAMUR SOCIAL, ORDENANZA 10/2022 Y PLAN 2023-2027 (31-40)
  {
    id: 'q-hd-31',
    topicId: 'AY-69',
    difficulty: 'Alta (Arquitectura SAMUR Social)',
    originType: '🏢 OFICIAL AYTO MADRID · TEMA 69',
    question:
      'En la estructura operativa del Servicio de Emergencias Sociales del Ayuntamiento de Madrid (SAMUR Social), la atención social inmediata in situ las 24 horas de los 365 días del año ante emergencias individuales, familiares o colectivas en vía pública se articula a través de:',
    options: [
      'A) La Central de Comunicaciones de SAMUR Social (integrada con Madrid 112), las Unidades Móviles de Emergencia Social (UMES), los Equipos de Calle de atención a personas sin hogar y las Unidades de Estancia Breve (UEB).',
      'B) Exclusivamente las Comisiones de Tutela del Menor en turno de guardia judicial dependientes del Ministerio del Interior.',
      'C) Los Puntos de Atención Continuada de los Centros de Salud Mental del SERMAS.',
      'D) Las Juntas Municipales de Distrito únicamente en horario de mañana de lunes a viernes.',
    ],
    correctIndex: 0,
    explanation:
      'SAMUR Social opera 24h/365d mediante su Central de Comunicaciones, las Unidades Móviles de Emergencia Social (UMES), los Equipos de Calle y las Unidades de Estancia Breve (UEB).',
  },
  {
    id: 'q-hd-32',
    topicId: 'AY-69',
    difficulty: 'Alta (Campaña del Frío y Emergencias Colectivas)',
    originType: '🏢 OFICIAL AYTO MADRID · TEMA 69',
    question:
      'Dentro de los protocolos de actuación de SAMUR Social y de la Red Municipal de Atención a Personas Sin Hogar del Ayuntamiento de Madrid, señale la afirmación CORRECTA:',
    options: [
      'A) Ante grandes emergencias colectivas o catástrofes en la ciudad de Madrid, SAMUR Social se activa en coordinación con SAMUR-Protección Civil, Bomberos y Policía Municipal para prestar atención psicosocial inmediata, filiación de afectados y alojamiento alternativo de emergencia; liderando además el dispositivo especial de la Campaña contra el Frío.',
      'B) SAMUR Social carece de competencias en siniestros de viviendas o derrumbes, interviniendo únicamente cuando existe orden judicial firme de desahucio.',
      'C) La activación de las Unidades Móviles de Emergencia Social exige que la persona afectada acredite un mínimo de cinco años de empadronamiento previo en el distrito.',
      'D) Los Equipos de Calle de SAMUR Social tienen potestad sancionadora y de internamiento forzoso administrativo sin intervención sanitaria ni judicial.',
    ],
    correctIndex: 0,
    explanation:
      'En el PEMAM del Ayuntamiento de Madrid, SAMUR Social es el servicio responsable de la respuesta social de urgencia, apoyo psicosocial y alojamiento alternativo ante siniestros, catástrofes y campaña invernal.',
  },
  {
    id: 'q-hd-33',
    topicId: 'AY-75',
    difficulty: 'Alta (Ordenanza 10/2022 SAD y Centros)',
    originType: '🏢 OFICIAL AYTO MADRID · ORDENANZA 10/2022',
    question:
      'La Ordenanza 10/2022, de 28 de junio, del Ayuntamiento de Madrid (BOAM y BOCM de 14/07/2022), tiene por objeto regular el régimen jurídico y de acceso a los siguientes servicios municipales:',
    options: [
      'A) El Servicio de Ayuda a Domicilio (SAD) para personas mayores y personas con discapacidad, los servicios de Centros de Día, Residencias y Apartamentos para personas mayores, y los Centros Municipales de Atención Integral Neurocognitiva.',
      'B) Exclusivamente la Teleasistencia Domiciliaria y las prestaciones económicas de emergencia social de pago único.',
      'C) Los Centros de Rehabilitación Psicosocial (CRPS) y los Centros de Atención Integral a Drogodependientes (CAID) de titularidad autonómica.',
      'D) Las Escuelas Infantiles municipales y los Centros de Apoyo a las Familias (CAF).',
    ],
    correctIndex: 0,
    explanation:
      'La Ordenanza 10/2022, de 28 de junio, regula el SAD municipal, Centros de Día, Residencias, Apartamentos para mayores y los Centros Municipales de Atención Integral Neurocognitiva.',
  },
  {
    id: 'q-hd-34',
    topicId: 'AY-75',
    difficulty: 'Alta (Modalidades e Intensidades SAD Municipal)',
    originType: '🏢 OFICIAL AYTO MADRID · ORDENANZA 10/2022',
    question:
      'Conforme a la Ordenanza 10/2022, de 28 de junio, reguladora del Servicio de Ayuda a Domicilio (SAD) del Ayuntamiento de Madrid, señale qué afirmación es CORRECTA respecto a sus prestaciones y régimen de incompatibilidades:',
    options: [
      'A) Comprende actuaciones de atención personal en las actividades de la vida diaria y actuaciones de atención doméstica o del hogar, pudiendo reducirse la intensidad horaria resultante a petición fehaciente de la persona solicitante, y siendo incompatible con la atención residencial permanente.',
      'B) Solo incluye tareas de limpieza general de la vivienda, excluyendo expresamente el apoyo en higiene personal, movilización o acompañamiento.',
      'C) Es plenamente compatible con que la persona usuaria resida de forma permanente en una residencia pública de la Comunidad de Madrid.',
      'D) Se concede exclusivamente a personas que tengan reconocido el Grado III de Gran Dependencia por la Comunidad de Madrid, excluyendo la prevención de la dependencia.',
    ],
    correctIndex: 0,
    explanation:
      'La Ordenanza 10/2022 regula el SAD municipal incluyendo atención personal y doméstica, permitiendo reducir la intensidad a petición del interesado y declarando su incompatibilidad con residencias permanentes.',
  },
  {
    id: 'q-hd-35',
    topicId: 'AY-75',
    difficulty: 'Alta (Apartamentos y Centros Neurocognitivos)',
    originType: '🏢 OFICIAL AYTO MADRID · ORDENANZA 10/2022',
    question:
      'Según la Ordenanza 10/2022, de 28 de junio, del Ayuntamiento de Madrid, ¿a qué perfil se destinan prioritariamente los Apartamentos Municipales para Personas Mayores y qué requisito funcional se les exige al ingreso?',
    options: [
      'A) Se destinan a personas mayores que carecen de alojamiento adecuado o presentan vulnerabilidad habitacional pero conservan autonomía personal suficiente para realizar por sí mismas las actividades básicas de la vida diaria en el momento del ingreso.',
      'B) Se destinan exclusivamente a personas mayores en situación de Gran Dependencia (Grado III) encamadas que requieren cuidados médicos hospitalarios permanentes.',
      'C) Están reservados a jóvenes menores de 30 años en procesos de emancipación laboral.',
      'D) Exigen que la persona solicitante sea propietaria de al menos dos bienes inmuebles en el término municipal de Madrid.',
    ],
    correctIndex: 0,
    explanation:
      'En la Ordenanza 10/2022 del Ayuntamiento de Madrid, los Apartamentos para Personas Mayores exigen conservar autonomía en las actividades básicas de la vida diaria en el momento del ingreso.',
  },
  {
    id: 'q-hd-36',
    topicId: 'AY-67',
    difficulty: 'Alta (Plan Estratégico Servicios Sociales 2023-2027)',
    originType: '🏢 OFICIAL AYTO MADRID · TEMA 67',
    question:
      'El Plan Estratégico del Nuevo Sistema Público de Servicios Sociales de la Ciudad de Madrid 2023-2027 articula la transformación del modelo municipal de atención social Primaria en torno a un cambio organizativo clave en los Centros de Servicios Sociales:',
    options: [
      'A) La diferenciación funcional entre un primer momento de Recepción, Primera Atención y Triaje Social (para dar respuesta ágil a demandas puntuales o urgentes) y el Nivel de Acompañamiento e Intervención Social Integral continuada mediante el Profesional de Referencia y el Plan Individual de Atención Social.',
      'B) La supresión de todos los Centros de Servicios Sociales de los 21 distritos para concentrar la atención presencial en una única oficina centralizada.',
      'C) La sustitución de los Trabajadores Sociales por algoritmos automatizados sin entrevista presencial.',
      'D) El traslado de las competencias de Atención Social Primaria a las mutuas colaboradoras con la Seguridad Social.',
    ],
    correctIndex: 0,
    explanation:
      'El Plan Estratégico 2023-2027 del Ayuntamiento de Madrid reorganiza el circuito de los Centros de Servicios Sociales separando la Primera Atención/Triaje de las Unidades de Intervención y Acompañamiento Social profundo.',
  },
  {
    id: 'q-hd-37',
    topicId: 'AY-68',
    difficulty: 'Alta (Tarjeta Familias Ayuntamiento de Madrid)',
    originType: '🏢 OFICIAL AYTO MADRID · TEMA 68',
    question:
      'Dentro del sistema de prestaciones económicas de los Servicios Sociales del Ayuntamiento de Madrid, la "Tarjeta Familias" se configura como:',
    options: [
      'A) Una prestación económica municipal mediante tarjeta bancaria prepago recargable destinada a sufragar gastos de cobertura de necesidades básicas de alimentación, aseo e higiene en establecimientos comerciales, preservando la dignidad y autonomía de la persona o familia usuaria previa valoración técnica del Trabajador/a Social.',
      'B) Un título de transporte gratuito vitalicio expedido por el Consorcio Regional de Transportes sin valoración social.',
      'C) Una pensión contributiva vitalicia incompatible con el empadronamiento en la ciudad de Madrid.',
      'D) Un préstamo bancario con interés de mercado avalado por la Agencia Tributaria Madrid.',
    ],
    correctIndex: 0,
    explanation:
      'La Tarjeta Familias del Ayuntamiento de Madrid es una tarjeta prepago vinculada a la valoración técnica de Atención Social Primaria para adquirir productos básicos de alimentación, aseo e higiene.',
  },
  {
    id: 'q-hd-38',
    topicId: 'AY-71',
    difficulty: 'Alta (Red Municipal Infancia y Familia: CAI y CAF)',
    originType: '🏢 OFICIAL AYTO MADRID · TEMAS 70 Y 71',
    question:
      'En la red municipal de atención a la infancia, adolescencia y familia del Ayuntamiento de Madrid, ¿cuál es la diferencia competencial fundamental entre los Centros de Apoyo a las Familias (CAF) y los Centros de Atención a la Infancia (CAI)?',
    options: [
      'A) Los CAF son dispositivos de carácter preventivo, universal y comunitario que ofrecen orientación psicológica, educativa, mediación familiar y apoyo a la parentalidad positiva a cualquier familia de la ciudad, mientras que los CAI son dispositivos especializados de segundo nivel que intervienen ante situaciones de desprotección, riesgo o maltrato infantil derivadas desde los Centros de Servicios Sociales.',
      'B) Los CAF asumen la tutela legal por desamparo de los menores y los CAI gestionan exclusivamente las escuelas infantiles de 0 a 3 años.',
      'C) Los CAI son centros abiertos sin derivación previa para actividades de ocio juvenil y los CAF son juzgados de violencia sobre la mujer.',
      'D) Ambos son centros residenciales de internamiento cerrado para menores infractores dependientes de la ARRMI.',
    ],
    correctIndex: 0,
    explanation:
      'Los CAF prestan apoyo preventivo, asesoramiento y mediación familiar universal; los CAI constituyen el nivel especializado municipal en maltrato y riesgo infantil.',
  },
  {
    id: 'q-hd-39',
    topicId: 'AY-78',
    difficulty: 'Alta (Red Municipal Violencia de Género: SAVG 24h)',
    originType: '🏢 OFICIAL AYTO MADRID · TEMA 78',
    question:
      'En la Red Municipal de Atención Integral a Víctimas de Violencia de Género del Ayuntamiento de Madrid (en el ámbito de la pareja o expareja), el dispositivo de puerta de entrada y atención de emergencia que funciona las 24 horas de los 365 días del año es:',
    options: [
      'A) El Servicio de Atención a Víctimas de Violencia de Género 24 horas (SAVG 24h), dotado de unidades móviles y articulado con los Puntos Municipales del Observatorio Regional de la Violencia de Género (PMORVG) y los centros de emergencia y acogida.',
      'B) Exclusivamente los Espacios de Igualdad municipales en horario de 10:00 a 14:00 horas.',
      'C) El Centro de Crisis 24 horas Pilar Estébanez, que atiende exclusivamente conflictos laborales sindicales.',
      'D) Las Oficinas de Información Juvenil de cada Junta Municipal de Distrito.',
    ],
    correctIndex: 0,
    explanation:
      'El SAVG 24h atiende urgencias las 24h en violencia de género (pareja/expareja) junto con los PMORVG.',
  },
  {
    id: 'q-hd-40',
    topicId: 'AY-81',
    difficulty: 'Alta (Red Municipal Sinhogarismo y Housing First)',
    originType: '🏢 OFICIAL AYTO MADRID · TEMAS 80 Y 81',
    question:
      'En la respuesta institucional al sinhogarismo en la Ciudad de Madrid, el modelo de intervención "Housing First" se diferencia del modelo tradicional en escalera en que:',
    options: [
      'A) Proporciona acceso directo e inmediato a una vivienda individual, estable y autónoma integrada en la comunidad a personas sin hogar con larga trayectoria de calle, enfermedad mental o adicciones, separando el derecho al alojamiento de la obligatoriedad de superar previamente fases de abstinencia o albergues colectivos.',
      'B) Exige que la persona supere primero seis meses en un centro de acogida masivo y doce meses en un piso compartido antes de acceder a una vivienda individual.',
      'C) Se desarrolla exclusivamente en pabellones deportivos de campaña durante los meses de diciembre a febrero.',
      'D) Condiciona la permanencia semanal en la vivienda a la obtención de un contrato indefinido a jornada completa en los primeros quince días.',
    ],
    correctIndex: 0,
    explanation:
      'El modelo Housing First facilita primero el alojamiento estable e individual con apoyo técnico flexible sin exigir abstinencia previa ni paso escalonado por albergues.',
  },

  // BLOQUE VII: GARANTÍA DE INGRESOS · IMV (LEY 19/2021) Y RMI CAM (LEY 15/2001) (41-45)
  {
    id: 'q-hd-41',
    topicId: 'E15',
    difficulty: 'Alta (Naturaleza y Edad IMV Ley 19/2021)',
    originType: '🏛️ OFICIAL BOE · LEY 19/2021 IMV',
    question:
      'De conformidad con los artículos 1 a 10 de la Ley 19/2021, de 20 de diciembre, por la que se establece el Ingreso Mínimo Vital (IMV), señale cuál de las siguientes afirmaciones es CORRECTA respecto a su naturaleza jurídica y a la edad general de las personas titulares:',
    options: [
      'A) Es una prestación económica de la Seguridad Social en su modalidad no contributiva, configurada como derecho subjetivo; con carácter general las personas titulares deben tener al menos 23 años (salvo que tengan hijos o menores en régimen de guarda con fines de adopción o acogimiento familiar permanente, en cuyo caso basta con ser mayor de edad o menor emancipado).',
      'B) Es una subvención graciable sujeta a concurrencia competitiva anual reservada exclusivamente a personas mayores de 65 años.',
      'C) Solo pueden ser titulares las personas mayores de 30 años con al menos quince años de cotización efectiva en el Régimen General.',
      'D) Es una prestación gestionada y financiada íntegramente por los presupuestos de cada Ayuntamiento sin intervención del INSS.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 2 y 10 de la Ley 19/2021: el IMV es una prestación no contributiva de la Seguridad Social (derecho subjetivo); la edad general del titular es de al menos 23 años (18 con menores a cargo o jóvenes extutelados).',
  },
  {
    id: 'q-hd-42',
    topicId: 'E15',
    difficulty: 'Alta (Plazo de Resolución y Silencio en IMV)',
    originType: '🏛️ OFICIAL BOE · LEY 19/2021 IMV',
    question:
      'Según el artículo 28 de la Ley 19/2021 del Ingreso Mínimo Vital, el Instituto Nacional de la Seguridad Social (INSS) deberá dictar resolución y notificarla a la persona solicitante en el plazo máximo de:',
    options: [
      'A) Seis meses desde la fecha de entrada de la solicitud en el registro del INSS; transcurrido dicho plazo sin que se haya notificado resolución expresa, la solicitud se entenderá desestimada por silencio administrativo negativo.',
      'B) Tres meses hábiles desde la solicitud, entendiéndose estimada por silencio administrativo positivo.',
      'C) Un mes natural desde la emisión del informe social municipal, con silencio positivo.',
      'D) Diez días hábiles, devengándose intereses de demora a partir del undécimo día.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 28.3 de la Ley 19/2021: el plazo máximo para resolver y notificar el IMV es de 6 meses desde la entrada en el registro del INSS, operando el silencio administrativo negativo.',
  },
  {
    id: 'q-hd-43',
    topicId: 'E15',
    difficulty: 'Alta (CAPI · Complemento de Ayuda para la Infancia)',
    originType: '🏛️ OFICIAL BOE · LEY 19/2021 IMV',
    question:
      'El Complemento de Ayuda para la Infancia (CAPI) regulado en el artículo 11.6 de la Ley 19/2021 del Ingreso Mínimo Vital consiste en una cuantía mensual por cada menor de edad miembro de la unidad de convivencia en función de su edad a 1 de enero del ejercicio correspondiente, estructurándose en:',
    options: [
      'A) Tres tramos de edad: menores de 3 años (cuantía superior), mayores de 3 y menores de 6 años (cuantía intermedia), y mayores de 6 y menores de 18 años (cuantía base); pudiendo percibirse con umbrales de renta de hasta el 300 % de la renta garantizada del IMV.',
      'B) Un pago único anual idéntico para todos los menores entre 0 y 16 años que solo pueden cobrar quienes tengan renta cero.',
      'C) Dos tramos de edad (0 a 12 años y 12 a 25 años) gestionados exclusivamente por los colegios públicos.',
      'D) Una prestación incompatible con el cobro de la renta garantizada del Ingreso Mínimo Vital.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 11.6 de la Ley 19/2021: el CAPI se estructura en 3 tramos por edad cumplida a 1 de enero (<3 años, de 3 a <6 años, y de 6 a <18 años) y amplía el umbral de ingresos al 300% de la renta garantizada.',
  },
  {
    id: 'q-hd-44',
    topicId: 'E15',
    difficulty: 'Alta (Subsidiariedad RMI CAM vs. IMV)',
    originType: '🏛️ OFICIAL BOCM · LEY 15/2001 RMI CAM',
    question:
      'En relación con la Renta Mínima de Inserción de la Comunidad de Madrid (regulada por la Ley 15/2001, de 27 de diciembre, y su Reglamento aprobado por Decreto 126/2014), señale la afirmación CORRECTA:',
    options: [
      'A) Tiene naturaleza subsidiaria y complementaria respecto del Ingreso Mínimo Vital y de cualquier otra pensión o prestación pública a la que pudiera tener derecho la unidad de convivencia, exigiéndose haber solicitado previamente las prestaciones de carácter estatal.',
      'B) Es incompatible en términos absolutos con haber solicitado alguna vez el Ingreso Mínimo Vital, aunque este haya sido denegado por el INSS.',
      'C) Se concede de oficio a toda persona empadronada en la Comunidad de Madrid sin necesidad de suscribir un Programa Individual de Inserción.',
      'D) Carece de límite de recursos económicos o patrimoniales para su concesión.',
    ],
    correctIndex: 0,
    explanation:
      'La RMI de la Comunidad de Madrid (Ley 15/2001 y Decreto 126/2014) tiene carácter subsidiario respecto del IMV estatal y de las pensiones no contributivas.',
  },
  {
    id: 'q-hd-45',
    topicId: 'E15',
    difficulty: 'Alta (Requisitos RMI Ley 15/2001 CAM)',
    originType: '🏛️ OFICIAL BOCM · LEY 15/2001 RMI CAM',
    question:
      'Según el artículo 6 de la Ley 15/2001 de Renta Mínima de Inserción en la Comunidad de Madrid, con carácter general, ¿qué requisito de residencia efectiva y qué rango de edad se exige para ser titular de la prestación (salvo las excepciones legalmente tasadas)?',
    options: [
      'A) Tener residencia legal y efectiva e ininterrumpida en la Comunidad de Madrid durante el año inmediatamente anterior a la solicitud, y ser mayor de 25 años y menor de 65 años (salvo menores de 25 o mayores de 65 con menores o personas con discapacidad a cargo o en supuestos de exclusión grave tasados).',
      'B) Llevar diez años empadronado en el mismo inmueble de la Comunidad de Madrid y tener entre 16 y 70 años.',
      'C) Residir en cualquier Comunidad Autónoma durante cinco años y tener más de 65 años en todo caso.',
      'D) No se exige antigüedad de empadronamiento ni suscripción de convenio de inserción con los Servicios Sociales de Atención Primaria.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 6 de la Ley 15/2001 CAM: residencia efectiva y continuada en la Comunidad de Madrid con 1 año de antelación, unidad de convivencia de 6 meses y edad general entre 25 y 65 años.',
  },

  // BLOQUE VIII: PROVISIÓN DE APOYOS · LEY 8/2021 Y LEY 1/2023 AMAPAD (46-52)
  {
    id: 'q-hd-46',
    topicId: 'E30',
    difficulty: 'Alta (Nuevo Paradigma Ley 8/2021)',
    originType: '🏛️ OFICIAL BOE · LEY 8/2021',
    question:
      'La Ley 8/2021, de 2 de junio, por la que se reforma la legislación civil y procesal para el apoyo a las personas con discapacidad en el ejercicio de su capacidad jurídica, introdujo un cambio de paradigma en el Código Civil (artículos 249 a 299) consistente en:',
    options: [
      'A) Suprimir la declaración judicial de incapacitación, la prodigalidad, la patria potestad prorrogada y rehabilitada, y la tutela sobre personas mayores de edad; instaurando un sistema de provisión de apoyos (voluntarios, guarda de hecho, curatela y defensor judicial) basado en el respeto a la voluntad, deseos y preferencias de la persona.',
      'B) Mantener la tutela judicial ordinaria para todas las personas mayores de edad con un grado de discapacidad igual o superior al 33 %.',
      'C) Sustituir la curatela por la figura de la interdicción civil automática decretada por los Servicios Sociales municipales.',
      'D) Prohibir el otorgamiento de poderes y mandatos preventivos ante Notario.',
    ],
    correctIndex: 0,
    explanation:
      'La Ley 8/2021 eliminó del ordenamiento español la incapacitación judicial y reservó la tutela exclusivamente para menores de edad no emancipados en desamparo o no sujetos a patria potestad.',
  },
  {
    id: 'q-hd-47',
    topicId: 'E30',
    difficulty: 'Alta (Carácter de la Curatela y Revisión)',
    originType: '🏛️ OFICIAL BOE · LEY 8/2021 (ARTS. 268 Y 269 CC)',
    question:
      'Conforme a los artículos 268 y 269 del Código Civil tras la reforma de la Ley 8/2021, señale cuál es la naturaleza ordinaria de la curatela y cada cuánto tiempo máximo deben revisarse periódicamente las medidas de apoyo adoptadas judicialmente:',
    options: [
      'A) La curatela tiene carácter primordialmente asistencial y solo en los casos excepcionales en los que resulte imprescindible por las circunstancias de la persona con discapacidad el juez determinará en resolución motivada los actos concretos en los que el curador asumirá funciones representativas; las medidas se revisarán periódicamente en un plazo máximo de tres años (o excepcionalmente hasta seis años).',
      'B) La curatela es siempre representativa y universal para todos los actos civiles y patrimoniales, sin necesidad de revisión periódica.',
      'C) Las medidas judiciales de apoyo caducan automáticamente cada seis meses naturales.',
      'D) En ningún caso puede la autoridad judicial atribuir facultades representativas al curador.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 268 y 269 del Código Civil (Ley 8/2021): la regla general es la curatela asistencial y la excepción motivada es la curatela con facultades representativas; revisión periódica en un plazo máximo de 3 años (ampliable motivadamente hasta 6 años).',
  },
  {
    id: 'q-hd-48',
    topicId: 'E30',
    difficulty: 'Alta (La Guarda de Hecho en la Ley 8/2021)',
    originType: '🏛️ OFICIAL BOE · LEY 8/2021 (ARTS. 263-267 CC)',
    question:
      'Respecto a la "guarda de hecho" regulada en los artículos 263 a 267 del Código Civil tras la Ley 8/2021, señale la opción CORRECTA:',
    options: [
      'A) Deja de ser una situación meramente provisional para convertirse en una medida informal de apoyo estable cuando resulte suficiente y adecuada para la salvaguarda de los derechos de la persona con discapacidad, sin que proceda constituir curatela salvo que se requiera actuación representativa continuada; pudiendo el guardador de hecho solicitar autorización judicial ad hoc para actos concretos.',
      'B) Está expresamente prohibida por el Código Civil, obligando al Ministerio Fiscal a promover siempre la constitución de una curatela representativa aunque la familia preste apoyos adecuados.',
      'C) Solo puede ser ejercida por entidades bancarias o fundaciones públicas inscritas en el Registro Mercantil.',
      'D) Otorga al guardador de hecho la libre disposición para vender bienes inmuebles de la persona con discapacidad sin autorización judicial.',
    ],
    correctIndex: 0,
    explanation:
      'Si existe una guarda de hecho que funciona adecuadamente como apoyo suficiente, no se judicializa la vida de la persona instituyendo una curatela.',
  },
  {
    id: 'q-hd-49',
    topicId: 'E30',
    difficulty: 'Alta (Norma de Creación de la AMAPAD)',
    originType: '🏛️ OFICIAL BOCM · LEY 1/2023 AMAPAD',
    question:
      'La transformación de la antigua Agencia Madrileña para la Tutela de Adultos (AMTA, creada por la derogada Ley 4/1995) en la actual Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (AMAPAD) se aprobó mediante:',
    options: [
      'A) La Ley 1/2023, de 15 de febrero, de creación de la Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (BOCM de 17/02/2023), configurándola como un Ente de Derecho Público sin fin de lucro con personalidad jurídica propia adscrito a la Consejería competente en servicios sociales.',
      'B) El Real Decreto 1971/1999 del Ministerio de Sanidad, configurándola como una sociedad anónima municipal.',
      'C) La Ordenanza 10/2022 del Ayuntamiento de Madrid, adscribiéndola al Área de Gobierno de Hacienda.',
      'D) La Ley Orgánica 5/2000 de Responsabilidad Penal de los Menores.',
    ],
    correctIndex: 0,
    explanation:
      'La Ley 1/2023, de 15 de febrero, creó la AMAPAD como Ente de Derecho Público y derogó expresamente la Ley 4/1995 de la antigua AMTA.',
  },
  {
    id: 'q-hd-50',
    topicId: 'E30',
    difficulty: 'Alta (Órganos de Gobierno y Áreas de Apoyo AMAPAD)',
    originType: '🏛️ OFICIAL BOCM · LEY 1/2023 AMAPAD (ARTS. 7 Y 12)',
    question:
      'De conformidad con los artículos 7 y 12 de la Ley 1/2023, de 15 de febrero, de creación de la Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (AMAPAD), ¿cuáles son sus tres Órganos de Gobierno y cuáles son las tres Áreas especializadas en las que organiza su actividad de apoyo?',
    options: [
      'A) Sus órganos de gobierno son el Consejo de Administración, el Presidente y el Director; y su actividad técnica se organiza en tres áreas de apoyo: Área de Apoyo Jurídico, Área de Apoyo Social y Área de Apoyo Económico, asignando a cada persona apoyada un profesional de referencia dentro de un equipo multidisciplinar.',
      'B) Sus órganos de gobierno son el Pleno Municipal y el Alcalde; y sus áreas son Pediatría, Geriatría y Urgencias.',
      'C) Tiene un único órgano unipersonal (el Fiscal Jefe) y carece de Área de Apoyo Social o Económico.',
      'D) Sus áreas son exclusivamente de Inspección Tributaria y Recaudación Ejecutiva.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 7 a 12 de la Ley 1/2023 de la CAM: Área de Apoyo Jurídico, Área de Apoyo Social y Área de Apoyo Económico; órganos de gobierno: Consejo de Administración, Presidente y Director.',
  },
  {
    id: 'q-hd-51',
    topicId: 'E30',
    difficulty: 'Alta (Destinatarios de la AMAPAD)',
    originType: '🏛️ OFICIAL BOCM · LEY 1/2023 AMAPAD',
    question:
      'Según la Ley 1/2023 de la Comunidad de Madrid, la Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (AMAPAD) asume por designación de la autoridad judicial el ejercicio de la curatela, la defensa judicial o medidas cautelares respecto de:',
    options: [
      'A) Personas mayores de edad (o menores emancipados) con discapacidad residentes en la Comunidad de Madrid que precisen medidas de apoyo para el ejercicio de su capacidad jurídica y carezcan de familiares o allegados idóneos o cuando así lo acuerde la autoridad judicial.',
      'B) Niños y niñas de 0 a 12 años en situación de desamparo infantil, cuya tutela ya no corresponde a la Comisión de Tutela del Menor.',
      'C) Menores de 14 a 17 años que hayan cometido hechos tipificados como delitos en el Código Penal.',
      'D) Cualquier ciudadano mayor de 65 años jubilado aunque conserve plenamente su capacidad de autogobierno y no precise medidas de apoyo.',
    ],
    correctIndex: 0,
    explanation:
      'La AMAPAD ejerce las medidas judiciales de apoyo para personas adultas con discapacidad residentes en la Comunidad de Madrid.',
  },
  {
    id: 'q-hd-52',
    topicId: 'S-37',
    difficulty: 'Alta (Internamiento Involuntario Art. 763 LEC)',
    originType: '🏥 OFICIAL SERMAS / CAM · ART. 763 LEC',
    question:
      'En relación con el internamiento no voluntario por razón de trastorno psíquico regulado en el artículo 763 de la Ley 1/2000 de Enjuiciamiento Civil, cuando el internamiento se realiza por razones de urgencia inmediata sin autorización judicial previa:',
    options: [
      'A) El responsable del centro donde se hubiere producido el internamiento deberá dar cuenta de este al tribunal competente lo antes posible y, en todo caso, dentro del plazo de veinticuatro horas, a los efectos de que se proceda a la preceptiva ratificación de dicha medida, que deberá efectuarse en el plazo máximo de setenta y dos horas desde que el internamiento llegue a conocimiento del tribunal.',
      'B) El director del hospital dispone de quince días hábiles para comunicarlo al Ayuntamiento y el juez tiene seis meses para ratificarlo.',
      'C) Basta con la firma del familiar más próximo sin necesidad de comunicar el ingreso a la autoridad judicial durante los primeros treinta días.',
      'D) Solo puede acordarse respecto de personas que tuvieran previamente nombrado un curador representativo.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 763.1 LEC: comunicación al Juzgado dentro del plazo máximo de 24 horas y ratificación judicial en el plazo máximo de 72 horas desde que llegue a conocimiento del tribunal.',
  },

  // BLOQUE IX: NUEVO REGLAMENTO DE EXTRANJERÍA · REAL DECRETO 1155/2024 (53-60)
  {
    id: 'q-hd-53',
    topicId: 'E31',
    difficulty: 'Alta (Vigencia y Derogación RD 1155/2024)',
    originType: '🏛️ OFICIAL BOE · RD 1155/2024 EXTRANJERÍA',
    question:
      'El Real Decreto 1155/2024, de 19 de noviembre, por el que se aprueba el Reglamento de la Ley Orgánica 4/2000, de 11 de enero, sobre derechos y libertades de los extranjeros en España y su integración social:',
    options: [
      'A) Derogó expresamente el Real Decreto 557/2011, de 20 de abril, y entró en vigor a los seis meses de su publicación en el Boletín Oficial del Estado (el 20 de mayo de 2025).',
      'B) Mantiene en vigor los artículos de arraigo social de 3 años del Real Decreto 557/2011 hasta el año 2030.',
      'C) Derogó la Ley Orgánica 4/2000 y suprimió todas las autorizaciones de residencia por circunstancias excepcionales.',
      'D) Entró en vigor al día siguiente de su publicación en el BOCM y se aplica únicamente a ciudadanos de Estados miembros de la Unión Europea.',
    ],
    correctIndex: 0,
    explanation:
      'El Real Decreto 1155/2024 (BOE 20/11/2024) derogó el antiguo RD 557/2011 y entró plenamente en vigor el 20 de mayo de 2025.',
  },
  {
    id: 'q-hd-54',
    topicId: 'E31',
    difficulty: 'Alta (Las 5 Modalidades de Arraigo Art. 125-127)',
    originType: '🏛️ OFICIAL BOE · RD 1155/2024 EXTRANJERÍA',
    question:
      'De conformidad con los artículos 125 a 127 del Real Decreto 1155/2024, ¿cuáles son exactamente las cinco modalidades de autorización de residencia temporal por razones de arraigo vigentes y cuál es el tiempo general de permanencia continuada previa en España que se exige?',
    options: [
      'A) Las cinco modalidades son: 1) Arraigo de segunda oportunidad, 2) Arraigo sociolaboral, 3) Arraigo social, 4) Arraigo socioformativo y 5) Arraigo familiar; exigiéndose dos años de permanencia continuada previa en España en todas ellas salvo en el arraigo familiar, que no requiere permanencia mínima.',
      'B) Son tres modalidades (laboral, social y familiar) que exigen tres años de permanencia continuada previa en todos los casos.',
      'C) Son cuatro modalidades que exigen cinco años de residencia legal previa y carecer de empadronamiento municipal.',
      'D) El nuevo Reglamento suprimió el arraigo formativo y elevó el arraigo social a cuatro años de permanencia en España.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 125 a 127 del RD 1155/2024: rebaja de 3 a 2 años la permanencia continuada previa en España para los arraigos de segunda oportunidad, sociolaboral, social y socioformativo; el arraigo familiar no requiere permanencia mínima.',
  },
  {
    id: 'q-hd-55',
    topicId: 'E31',
    difficulty: 'Alta (Duración y Habilitación para Trabajar en Arraigo)',
    originType: '🏛️ OFICIAL BOE · RD 1155/2024 EXTRANJERÍA',
    question:
      'Según el artículo 125.2 y concordantes del Real Decreto 1155/2024, en relación con la duración de las autorizaciones de residencia por arraigo y su habilitación para trabajar:',
    options: [
      'A) Tienen una vigencia de un año, salvo el arraigo familiar cuya duración es de cinco años; todas habilitan a trabajar por cuenta ajena y propia, con la particularidad del arraigo socioformativo que autoriza a trabajar por cuenta ajena hasta un máximo de 30 horas semanales.',
      'B) Todas las modalidades de arraigo tienen una duración de seis meses improrrogables y prohíben trabajar durante el primer año.',
      'C) El arraigo sociolaboral dura cinco años y el arraigo familiar dura únicamente un año sin permiso de trabajo.',
      'D) El arraigo socioformativo autoriza a trabajar exclusivamente por cuenta propia como autónomo hasta 40 horas semanales.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 125.2 y 127.d) del RD 1155/2024: duración general de 1 año excepto el arraigo familiar (5 años). El arraigo socioformativo autoriza a trabajar por cuenta ajena hasta un tope de 30 horas semanales.',
  },
  {
    id: 'q-hd-56',
    topicId: 'E31',
    difficulty:
      'Alta (Separación Familiares de Españoles vs. Arraigo Familiar)',
    originType: '🏛️ OFICIAL BOE · RD 1155/2024 EXTRANJERÍA',
    question:
      'En el nuevo Reglamento de Extranjería (Real Decreto 1155/2024), ¿cómo se regula la situación de los familiares extranjeros de personas con nacionalidad española frente al nuevo "arraigo familiar" del artículo 127.e)?',
    options: [
      'A) Los familiares de personas con nacionalidad española cuentan ahora con un estatuto específico propio ("Residencia temporal de familiares de personas con nacionalidad española", artículos 93 a 99, por cinco años), mientras que el "arraigo familiar" del artículo 127.e) queda reservado a progenitores o tutores de menores nacionales de otros Estados de la UE, EEE o Suiza o quienes presten apoyo a familiares con discapacidad de dichas nacionalidades.',
      'B) Los cónyuges e hijos de ciudadanos españoles deben solicitar obligatoriamente el arraigo de segunda oportunidad tras permanecer dos años en situación irregular.',
      'C) El Real Decreto 1155/2024 suprimió el derecho a la reagrupación y residencia de los familiares de ciudadanos españoles.',
      'D) Los padres de menores de nacionalidad española solo pueden obtener una estancia de estudios de noventa días.',
    ],
    correctIndex: 0,
    explanation:
      'El RD 1155/2024 crea un régimen propio para familiares de españoles en los arts. 93 a 99 (autorización de 5 años), dejando el "arraigo familiar" (art. 127.e) para progenitores/cuidadores de ciudadanos de otros países de la UE/EEE/Suiza.',
  },
  {
    id: 'q-hd-57',
    topicId: 'E31',
    difficulty: 'Alta (Requisitos del Arraigo Sociolaboral Art. 127.b)',
    originType: '🏛️ OFICIAL BOE · RD 1155/2024 EXTRANJERÍA',
    question:
      'Conforme al artículo 127.b) del Real Decreto 1155/2024, para acceder a la autorización de residencia temporal por "arraigo sociolaboral" (además de los dos años de permanencia continuada en España), en relación con los contratos de trabajo aportados se exige:',
    options: [
      'A) Aportar uno o varios contratos de trabajo que garanticen al menos el Salario Mínimo Interprofesional o el salario establecido en convenio colectivo aplicable en proporción a la jornada trabajada, y cuya suma represente una jornada semanal no inferior a veinte horas en cómputo global.',
      'B) Aportar obligatoriamente un único contrato indefinido a jornada completa de cuarenta horas semanales con una antigüedad previa en la empresa de tres años.',
      'C) Aportar siempre informe social municipal de esfuerzo de integración aunque se disponga de contrato de trabajo a tiempo completo.',
      'D) Acreditar haber trabajado previamente en situación irregular durante dieciocho meses mediante sentencia firme del orden penal.',
    ],
    correctIndex: 0,
    explanation:
      'En el art. 127.b) del RD 1155/2024 (arraigo sociolaboral), el contrato o suma de contratos debe alcanzar al menos 20 horas semanales en cómputo global con retribución proporcional al SMI o convenio.',
  },
  {
    id: 'q-hd-58',
    topicId: 'E31',
    difficulty: 'Alta (Cómputo de Tiempo en Protección Internacional Art. 126)',
    originType: '🏛️ OFICIAL BOE · RD 1155/2024 EXTRANJERÍA',
    question:
      'Según el artículo 126 del Real Decreto 1155/2024, respecto a la compatibilidad entre la solicitud de protección internacional (asilo) y el cómputo de los dos años de permanencia continuada para solicitar las autorizaciones de arraigo en régimen ordinario:',
    options: [
      'A) Para solicitar un arraigo no se puede tener la condición de solicitante de protección internacional en el momento de presentar la solicitud ni durante su tramitación, y el tiempo de permanencia en España durante la tramitación de la solicitud de protección internacional hasta su resolución firme en sede administrativa y, en su caso, judicial, no será computable a efectos de los dos años requeridos.',
      'B) Todo el tiempo transcurrido con la tarjeta roja de solicitante de asilo computa al doble (dos días por cada día natural) para pedir simultáneamente el arraigo social.',
      'C) La mera presentación de la solicitud de protección internacional concede automáticamente el arraigo de segunda oportunidad.',
      'D) Los solicitantes de protección internacional tienen prohibido recibir atención humanitaria o sanitaria en España.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 126.a) y b) del RD 1155/2024: no será computable el tiempo de permanencia en España durante la tramitación de la solicitud de protección internacional hasta su resolución firme administrativa y, en su caso, judicial.',
  },
  {
    id: 'q-hd-59',
    topicId: 'E31',
    difficulty: 'Alta (Arraigo de Segunda Oportunidad Art. 127.a)',
    originType: '🏛️ OFICIAL BOE · RD 1155/2024 EXTRANJERÍA',
    question:
      'El nuevo "arraigo de segunda oportunidad" regulado en el artículo 127.a) del Real Decreto 1155/2024 está dirigido a personas extranjeras que acrediten dos años de permanencia continuada en España y que:',
    options: [
      'A) Hayan sido titulares de una autorización de residencia (que no hubiera sido otorgada por circunstancias excepcionales) en los dos años inmediatamente anteriores a la fecha de presentación de la solicitud, y cuya renovación no se hubiera producido por motivos distintos a razones de orden público, seguridad o salud pública.',
      'B) Acaben de llegar por primera vez a territorio español hace menos de noventa días con visado de estancia turística.',
      'C) Sean nacionales de Estados miembros de la Unión Europea inscritos en el Registro Central de Extranjeros.',
      'D) Hayan sido expulsadas del territorio nacional con prohibición de entrada vigente por diez años.',
    ],
    correctIndex: 0,
    explanation:
      'El art. 127.a) del RD 1155/2024 regula el arraigo de segunda oportunidad para quienes fueron titulares de una autorización de residencia (no excepcional) en los 2 años previos y no pudieron renovarla por causas ajenas a orden público, seguridad o salud pública.',
  },
  {
    id: 'q-hd-60',
    topicId: 'AY-82',
    difficulty: 'Alta (Informe Social de Arraigo y Plazo de Resolución)',
    originType: '🏢 OFICIAL BOE / AYTO MADRID · RD 1155/2024',
    question:
      'En el procedimiento de "arraigo social" (artículo 127.c) y de "arraigo socioformativo" (artículo 127.d) del Real Decreto 1155/2024, en relación con el informe de integración social y el plazo de resolución de la Oficina de Extranjería:',
    options: [
      'A) El informe de integración social es emitido por la Comunidad Autónoma (o el Ayuntamiento cuando así se haya habilitado) valorando el tiempo de permanencia, los medios de vida y el esfuerzo de integración; el plazo máximo de resolución de la autorización de arraigo es de tres meses desde la solicitud, operando el silencio administrativo desestimatorio.',
      'B) El informe de integración es vinculante para el Juez de lo Penal y el plazo de resolución de Extranjería es de diez días naturales con silencio positivo.',
      'C) En el nuevo Real Decreto 1155/2024 se ha eliminado por completo la figura del informe de integración social en todas las modalidades de arraigo.',
      'D) El plazo de resolución del informe social es de dos años y el de la autorización de residencia de un año con silencio positivo.',
    ],
    correctIndex: 0,
    explanation:
      'En el RD 1155/2024, el informe de esfuerzo de integración social se mantiene en el arraigo social sin vínculos familiares y en el socioformativo, siendo el plazo general de resolución de 3 meses con silencio administrativo negativo.',
  },
  // =========================================================================
  // BLOQUE X: CONSTITUCIÓN ESPAÑOLA DE 1978 Y ESTATUTO CAM (61-65)
  // =========================================================================
  {
    id: 'q-hd-61',
    topicId: 'G1',
    difficulty: 'Alta (Reforma Art. 49 CE de 2024 y Garantías Art. 53)',
    originType: '🏛️ OFICIAL BOE · CONSTITUCIÓN 1978',
    question:
      'Tras la reforma del artículo 49 de la Constitución Española (publicada en el BOE el 17 de febrero de 2024), en relación con los derechos de las personas con discapacidad y su sistema de garantías constitucionales del artículo 53, señale la afirmación CORRECTA:',
    options: [
      'A) Los poderes públicos impulsarán las políticas que garanticen la plena autonomía personal y la inclusión social de las personas con discapacidad en entornos universalmente accesibles, atendiendo particularmente las necesidades específicas de las mujeres y los menores con discapacidad; al ubicarse en el Capítulo III del Título I, informará la legislación positiva, la práctica judicial y la actuación de los poderes públicos, pero solo podrá ser alegado ante la jurisdicción ordinaria de acuerdo con lo que dispongan las leyes que lo desarrollen.',
      'B) La reforma de 2024 reubicó el artículo 49 dentro de la Sección 1.ª del Capítulo II del Título I, por lo que es susceptible de recurso de amparo directo ante el Tribunal Constitucional y requiere Ley Orgánica para su desarrollo.',
      'C) Su reforma exigió el procedimiento agravado del artículo 168 de la Constitución con disolución inmediata de las Cortes Generales y referéndum obligatorio vinculante.',
      'D) El nuevo artículo 49 mantiene el término "disminuidos físicos, sensoriales y psíquicos" a efectos exclusivamente de pensiones no contributivas.',
    ],
    correctIndex: 0,
    explanation:
      'El nuevo art. 49 CE (reforma de febrero de 2024 por la vía del art. 167 CE) sustituyó el término "disminuidos" por "personas con discapacidad", incorporó mención expresa a mujeres y menores con discapacidad, y se mantiene en el Capítulo III del Título I (Principios rectores de la política social y económica, protegidos por el art. 53.3 CE).',
  },
  {
    id: 'q-hd-62',
    topicId: 'G1',
    difficulty: 'Alta (Suspensión de Derechos Art. 55.1 CE)',
    originType: '🏛️ OFICIAL BOE · CONSTITUCIÓN 1978',
    question:
      'De conformidad con los artículos 55.1 y 116 de la Constitución Española, ¿cuál de los siguientes derechos fundamentales puede ser suspendido cuando se acuerde la declaración del estado de sitio, pero NUNCA puede ser suspendido bajo la declaración del estado de excepción ni del estado de alarma?',
    options: [
      'A) Los derechos del detenido reconocidos en el artículo 17.3 de la Constitución (a ser informado de forma inmediata de sus derechos y de las razones de su detención, a no ser obligado a declarar y a la asistencia de abogado en las diligencias policiales y judiciales).',
      'B) El derecho a la inviolabilidad del domicilio y al secreto de las comunicaciones (artículo 18.2 y 18.3 de la Constitución).',
      'C) El derecho de reunión pacífica y sin armas y el derecho de huelga (artículos 21 y 28.2 de la Constitución).',
      'D) El derecho a la producción y creación literaria, artística, científica y técnica (artículo 20.1.b de la Constitución).',
    ],
    correctIndex: 0,
    explanation:
      'Trampa clásica del art. 55.1 CE: el artículo 17 se puede suspender en estado de excepción y de sitio, EXCEPTUANDO el apartado 17.3 (garantías del detenido y asistencia letrada), que solo puede suspenderse cuando se declare el estado de sitio (y nunca en el de excepción).',
  },
  {
    id: 'q-hd-63',
    topicId: 'G1',
    difficulty: 'Alta (Reforma Constitucional Art. 167 vs 168 CE)',
    originType: '🏛️ OFICIAL BOE · CONSTITUCIÓN 1978',
    question:
      'Si se promoviera una reforma constitucional para trasladar el derecho a la protección de la salud (artículo 43 CE) o los servicios sociales (artículo 50 CE) a la Sección 1.ª del Capítulo II del Título I, o si se pretendiera reformar únicamente el Capítulo III del Título I sin alterar la Sección 1.ª del Capítulo II, ¿qué procedimiento y mayorías exigiría la Constitución?',
    options: [
      'A) Cualquier reforma que afecte a la Sección 1.ª del Capítulo II del Título I (artículos 15 a 29) exige el procedimiento agravado del artículo 168 (mayoría de dos tercios de cada Cámara, disolución de las Cortes, ratificación, nueva mayoría de dos tercios y referéndum obligatorio); en cambio, la reforma del Capítulo III del Título I (artículos 39 a 52) se tramita por el procedimiento ordinario del artículo 167 (mayoría de tres quintos de cada Cámara y referéndum facultativo si lo solicita una décima parte de los miembros de cualquiera de las Cámaras dentro de los quince días siguientes).',
      'B) Todo el Título I completo (artículos 10 a 55) requiere siempre el procedimiento agravado del artículo 168 con mayoría de dos tercios y disolución de las Cortes.',
      'C) La reforma de los derechos fundamentales de los artículos 15 a 29 se aprueba por mayoría absoluta del Congreso y mayoría simple del Senado sin referéndum.',
      'D) El referéndum en el procedimiento del artículo 167 es siempre obligatorio y requiere ser solicitado por el Defensor del Pueblo en el plazo de treinta días.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 167 y 168 CE: el procedimiento agravado (art. 168: 2/3, disolución y referéndum obligatorio) solo se aplica a la revisión total o a la parcial que afecte al Título Preliminar, al Capítulo II Sección 1.ª del Título I (arts. 15 a 29) o al Título II (La Corona). El resto del Título I (como los arts. 43, 49 o 50) va por el art. 167 (3/5 y referéndum solo si lo pide 1/10 de diputados o senadores en 15 días).',
  },
  {
    id: 'q-hd-64',
    topicId: 'G3',
    difficulty: 'Alta (Estatuto de Autonomía CAM LO 3/1983)',
    originType: '🏛️ OFICIAL BOCM · LO 3/1983 ESTATUTO CAM',
    question:
      'Conforme a los artículos 26, 27 y 28 del Estatuto de Autonomía de la Comunidad de Madrid (Ley Orgánica 3/1983, de 25 de febrero) y al artículo 148.1.20.ª de la Constitución Española, la competencia de la Comunidad de Madrid en materia de "asistencia social" y "promoción y ayuda a la tercera edad, emigrantes, minusválidos y demás grupos sociales necesitados de especial atención, incluida la creación de centros de protección, reinserción y rehabilitación" tiene el carácter de:',
    options: [
      'A) Competencia exclusiva de la Comunidad de Madrid (artículos 26.1.23 y 26.1.24 del Estatuto de Autonomía), correspondiéndole la potestad legislativa, la reglamentaria y la función ejecutiva.',
      'B) Competencia meramente ejecutiva de la legislación que dicte el Estado, careciendo la Asamblea de Madrid de potestad legislativa en servicios sociales.',
      'C) Competencia exclusiva del Estado conforme al artículo 149.1.17.ª de la Constitución, delegada temporalmente en los municipios.',
      'D) Competencia de desarrollo legislativo en el marco de la legislación básica estatal, idéntica al régimen económico de la Seguridad Social.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 26.1.23 y 26.1.24 de la LO 3/1983 de Estatuto de Autonomía de la CAM: la Comunidad de Madrid ostenta competencia EXCLUSIVA en materia de asistencia social y atención a colectivos vulnerables (mientras que en sanidad e higiene ostenta el desarrollo legislativo y ejecución del art. 27.4, y en gestión de la asistencia sanitaria de la Seguridad Social la función ejecutiva del art. 28.1.1).',
  },
  {
    id: 'q-hd-65',
    topicId: 'G4',
    difficulty: 'Alta (Instituciones CAM y Reforma Estatutaria)',
    originType: '🏛️ OFICIAL BOCM · LO 3/1983 Y LEY 1/1983',
    question:
      'Según el Título I del Estatuto de Autonomía de la Comunidad de Madrid (LO 3/1983), en relación con la Asamblea de Madrid, el Presidente y la reforma del propio Estatuto (artículo 64), señale la opción CORRECTA:',
    options: [
      'A) La Asamblea es elegida por cuatro años mediante sufragio universal (fijándose un diputado por cada 50.000 habitantes o fracción superior a 25.000, con barrera electoral del 5 % de los votos válidos emitidos en toda la Comunidad); y la propuesta de reforma del Estatuto requiere la aprobación de la Asamblea por mayoría de dos tercios de sus miembros y la aprobación de las Cortes Generales mediante Ley Orgánica.',
      'B) La barrera electoral en las elecciones a la Asamblea de Madrid es del 3 % de los votos válidos y la reforma del Estatuto exige mayoría de tres quintos de la Asamblea y referéndum autonómico obligatorio.',
      'C) El Presidente de la Comunidad de Madrid puede ser elegido entre ciudadanos que no ostenten la condición de diputados de la Asamblea de Madrid.',
      'D) La iniciativa de reforma del Estatuto corresponde a una quinta parte de los Diputados y requiere mayoría absoluta de la Asamblea.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 10, 18 y 64 de la LO 3/1983: 1 diputado por cada 50.000 hab. o fracción >25.000; barrera electoral del 5% (en Ayuntamientos es el 5% LOREG y en Congreso el 3%); el Presidente debe ser elegido de entre los miembros de la Asamblea; y la iniciativa de reforma corresponde al Gobierno, a la Asamblea (a propuesta de 1/3 de sus miembros o de 2 Grupos Parlamentarios) o a las Cortes, requiriendo mayoría de 2/3 de la Asamblea y Ley Orgánica de las Cortes.',
  },

  // =========================================================================
  // BLOQUE XI: LEY 39/2015 DEL PROCEDIMIENTO ADMINISTRATIVO COMÚN - LPAC (66-72)
  // =========================================================================
  {
    id: 'q-hd-66',
    topicId: 'G11',
    difficulty: 'Alta (Cómputo de Plazos por Meses y Horas Art. 30 LPAC)',
    originType: '🏛️ OFICIAL BOE · LEY 39/2015 LPAC',
    question:
      'De conformidad con el artículo 30 de la Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Común de las Administraciones Públicas (LPAC), en relación con el cómputo de plazos administrativos, señale la afirmación CORRECTA:',
    options: [
      'A) Salvo que por Ley o en el Derecho de la Unión Europea se disponga otro cómputo, cuando los plazos se señalen por horas se entiende que estas son hábiles y no podrán tener una duración superior a veinticuatro horas; y si el plazo se fija en meses o años, se computará a partir del día siguiente a aquel en que tenga lugar la notificación o publicación, concluyendo el mismo día en que se produjo la notificación, publicación o silencio en el mes o el año de vencimiento (o el último día del mes si en el mes de vencimiento no hubiera día equivalente).',
      'B) En vía administrativa los sábados tienen la consideración de días hábiles, excluyéndose del cómputo únicamente los domingos y los declarados festivos.',
      'C) Cuando los plazos se fijan en meses, un mes equivale legalmente a treinta días hábiles contados sin incluir sábados ni domingos.',
      'D) Cuando un día fuese hábil en el municipio o Comunidad Autónoma en que residiese el interesado e inhábil en la sede del órgano administrativo, se considerará hábil en todo caso.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 30 de la Ley 39/2015: los sábados son inhábiles; los plazos por horas son hábiles por defecto y no pueden superar 24h (si superan 24h se expresarán en días); los plazos por meses se computan de fecha a fecha iniciándose al día siguiente de la notificación y venciendo en el día correlativo al de la notificación (jurisprudencia consolidada del TS y art. 30.4); y si un día es hábil en uno de los dos lugares e inhábil en el otro, se considera INHÁBIL en todo caso (art. 30.6).',
  },
  {
    id: 'q-hd-67',
    topicId: 'G11',
    difficulty: 'Alta (Notificaciones Electrónicas Art. 43 LPAC)',
    originType: '🏛️ OFICIAL BOE · LEY 39/2015 LPAC',
    question:
      'Según los artículos 41 y 43 de la Ley 39/2015 (LPAC), cuando la notificación por medios electrónicos sea de carácter obligatorio o haya sido expresamente elegida por el interesado, ¿en qué momento se entenderá rechazada si no se accede a su contenido, y qué efecto produce la falta de envío del aviso informativo al correo electrónico o dispositivo móvil del interesado?',
    options: [
      'A) Se entenderá rechazada cuando hayan transcurrido diez días naturales desde la puesta a disposición de la notificación sin que se acceda a su contenido; y la falta de práctica del aviso electrónico informativo no impedirá que la notificación sea considerada plenamente válida.',
      'B) Se entenderá rechazada cuando hayan transcurrido diez días hábiles desde la puesta a disposición, y la omisión del aviso por SMS o correo electrónico provoca la nulidad de pleno derecho de la notificación.',
      'C) Se entenderá rechazada a los quince días naturales, debiendo la Administración reiterar el intento en papel en el domicilio del interesado dentro de los tres días siguientes.',
      'D) El plazo de acceso en sede electrónica es de veinte días hábiles para procedimientos de servicios sociales y dependencia.',
    ],
    correctIndex: 0,
    explanation:
      'Trampa mortal de examen (arts. 41.6 y 43.2 de la Ley 39/2015): mientras que casi todos los plazos de trámite de la LPAC son en días hábiles, el rechazo de la notificación electrónica puesta a disposición en sede se produce a los DIEZ DÍAS NATURALES sin acceder a su contenido; además, la falta de envío del aviso electrónico no invalida la notificación.',
  },
  {
    id: 'q-hd-68',
    topicId: 'G11',
    difficulty:
      'Alta (Nulidad de Pleno Derecho vs. Anulabilidad Arts. 47 y 48)',
    originType: '🏛️ OFICIAL BOE · LEY 39/2015 LPAC',
    question:
      'Conforme a los artículos 47 y 48 de la Ley 39/2015 (LPAC), señale cuál de los siguientes vicios determina la ANULABILIDAD del acto administrativo (artículo 48) y NO su nulidad de pleno derecho (artículo 47):',
    options: [
      'A) Los actos de la Administración que incurran en cualquier infracción del ordenamiento jurídico, incluso la desviación de poder, o los dictados por órgano manifiestamente incompetente por razón de jerarquía.',
      'B) Los actos dictados por órgano manifiestamente incompetente por razón de la materia o del territorio.',
      'C) Los actos dictados prescindiendo total y absolutamente del procedimiento legalmente establecido o de las normas que contienen las reglas esenciales para la formación de la voluntad de los órganos colegiados.',
      'D) Los actos expresos o presuntos contrarios al ordenamiento jurídico por los que se adquieren facultades o derechos cuando se carezca de los requisitos esenciales para su adquisición.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 47.1 y 48 de la Ley 39/2015: la desviación de poder y la incompetencia jerárquica (que es convalidable por el superior según el art. 52.3) son causas de ANULABILIDAD (art. 48.1), mientras que la incompetencia manifiesta por razón de la materia o del territorio, la omisión total del procedimiento y la adquisición de derechos sin requisitos esenciales son causas tasadas de NULIDAD DE PLENO DERECHO (art. 47.1).',
  },
  {
    id: 'q-hd-69',
    topicId: 'G11',
    difficulty:
      'Alta (Silencio Administrativo e Informes Arts. 21, 24 y 80 LPAC)',
    originType: '🏛️ OFICIAL BOE · LEY 39/2015 LPAC',
    question:
      'En relación con la obligación de resolver, el silencio administrativo y la emisión de informes (como el Informe Social en procedimientos administrativos) según los artículos 21, 24 y 80 de la Ley 39/2015 (LPAC), señale la opción CORRECTA:',
    options: [
      'A) Cuando las normas reguladoras del procedimiento no fijen el plazo máximo para resolver y notificar, este será de tres meses (sin que pueda exceder de seis meses salvo que una norma con rango de Ley o de Derecho de la UE establezca uno mayor); y salvo disposición expresa en contrario, los informes serán facultativos y no vinculantes, y serán evacuados en el plazo de diez días.',
      'B) Cuando la norma no fije plazo máximo de resolución, este será siempre de seis meses, y todos los informes emitidos por funcionarios públicos tienen por defecto carácter preceptivo y vinculante.',
      'C) En los procedimientos relativos al ejercicio del derecho de petición del artículo 29 de la Constitución o aquellos cuya estimación tuviera como consecuencia transferir al solicitante facultades relativas al dominio público o al servicio público, el silencio administrativo es siempre positivo.',
      'D) Cuando el silencio administrativo sea desestimatorio (negativo), la resolución expresa posterior que dicte la Administración solo podrá ser igualmente desestimatoria por quedar vinculada al sentido del silencio.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 21, 24 y 80 de la Ley 39/2015: plazo supletorio de resolución de 3 meses (tope de 6 meses salvo Ley o norma UE); informes por defecto facultativos y no vinculantes a emitir en 10 días hábiles; en derecho de petición, dominio público o servicio público el silencio es NEGATIVO (art. 24.1); y en caso de silencio negativo, la resolución expresa tardía se adoptará sin vinculación alguna al sentido del silencio (art. 24.3.b).',
  },
  {
    id: 'q-hd-70',
    topicId: 'G11',
    difficulty: 'Alta (Revisión de Oficio y Lesividad Arts. 106 y 107 LPAC)',
    originType: '🏛️ OFICIAL BOE · LEY 39/2015 LPAC',
    question:
      'Según los artículos 106 y 107 de la Ley 39/2015 (LPAC), en relación con la revisión de oficio de actos nulos de pleno derecho y la declaración de lesividad de actos anulables favorables para los interesados, señale la afirmación CORRECTA:',
    options: [
      'A) En la revisión de oficio de actos nulos de pleno derecho (art. 106) iniciada de oficio, el transcurso del plazo de seis meses sin dictarse resolución produce la caducidad del procedimiento; y la declaración de lesividad de actos anulables (art. 107) no podrá adoptarse una vez transcurridos cuatro años desde que se dictó el acto administrativo y exigirá la previa audiencia de los interesados, caducando el procedimiento a los seis meses de su iniciación.',
      'B) La declaración de lesividad de actos anulables puede acordarse en cualquier momento sin límite temporal y requiere dictamen favorable vinculante del Consejo de Estado.',
      'C) En la revisión de oficio de actos nulos iniciada a solicitud de interesado, el transcurso de tres meses sin resolución produce la estimación por silencio positivo.',
      'D) Las Administraciones Públicas no pueden rectificar en ningún momento los errores materiales, de hecho o aritméticos una vez transcurridos cuatro años.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 106, 107 y 109 de la Ley 39/2015: la revisión de actos nulos (art. 106) no tiene plazo de prescripción, requiere dictamen favorable del Consejo de Estado u órgano consultivo autonómico y caduca a los 6 meses si se inició de oficio (desestimación por silencio negativo si se inició a instancia de parte); la lesividad de actos anulables (art. 107) tiene un límite de 4 años desde que se dictó el acto y caduca a los 6 meses; y los errores materiales o aritméticos (art. 109.2) se pueden rectificar en cualquier momento.',
  },
  {
    id: 'q-hd-71',
    topicId: 'G11',
    difficulty: 'Alta (Recursos de Alzada y Reposición Arts. 121 a 124 LPAC)',
    originType: '🏛️ OFICIAL BOE · LEY 39/2015 LPAC',
    question:
      'Compare los plazos de interposición y de resolución del Recurso de Alzada y del Recurso Potestativo de Reposición conforme a los artículos 121 a 124 de la Ley 39/2015 (LPAC) y señale la opción CORRECTA:',
    options: [
      'A) En ambos recursos el plazo de interposición es de un mes si el acto fuera expreso (y en cualquier momento a partir del día siguiente a aquel en que se produzcan los efectos del silencio si no fuera expreso); sin embargo, el plazo máximo para dictar y notificar la resolución es de tres meses en el Recurso de Alzada y de un mes en el Recurso de Reposición.',
      'B) El plazo de interposición del Recurso de Alzada es de un mes si el acto es expreso y de tres meses si el acto es presunto, siendo el plazo de resolución de un mes en ambos recursos.',
      'C) Contra la resolución de un Recurso de Reposición cabe interponer un nuevo Recurso de Reposición o un Recurso de Alzada en el plazo de quince días.',
      'D) En el Recurso de Alzada el sentido del silencio administrativo es siempre positivo sin ninguna excepción.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 122 y 124 de la Ley 39/2015: si el acto es expreso, tanto en Alzada como en Reposición el plazo de interposición es de 1 MES; si el acto no es expreso (presunto), NO hay plazo de 3 meses (tras la STC 52/2014 recogida en la Ley 39/2015 se puede interponer en cualquier momento desde el día siguiente a producirse el silencio). Plazo para resolver: 3 meses en Alzada (con la excepción de doble silencio positivo del art. 24.1 párrafo 3.º) y 1 mes en Reposición.',
  },
  {
    id: 'q-hd-72',
    topicId: 'G11',
    difficulty:
      'Alta (Tramitación Simplificada del Procedimiento Art. 96 LPAC)',
    originType: '🏛️ OFICIAL BOE · LEY 39/2015 LPAC',
    question:
      'Cuando razones de interés público o la falta de complejidad del procedimiento así lo aconsejen, las Administraciones Públicas podrán acordar de oficio o a solicitud del interesado la tramitación simplificada del procedimiento (artículo 96 de la Ley 39/2015), en cuyo caso:',
    options: [
      'A) Si alguno de los interesados manifestara su oposición expresa en el plazo de cinco días, la Administración deberá seguir la tramitación ordinaria; y salvo que reste menos para su tramitación ordinaria, los procedimientos tramitados de manera simplificada deberán ser resueltos en treinta días a contar desde el siguiente al que se notifique al interesado el acuerdo de tramitación simplificada.',
      'B) La oposición del interesado no vincula a la Administración, y el procedimiento simplificado deberá resolverse en el plazo máximo de tres meses naturales.',
      'C) Los treinta días del procedimiento simplificado son siempre días naturales improrrogables.',
      'D) En la tramitación simplificada se suprime incluso el trámite de audiencia cuando la resolución vaya a ser desfavorable para el interesado.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 96 de la Ley 39/2015: si un interesado manifiesta su oposición expresa, la Administración DEBE seguir la tramitación ordinaria; el procedimiento simplificado debe resolverse en 30 días (hábiles, conforme al art. 30.2); e incluye trámite de audiencia de 5 días únicamente cuando la resolución vaya a ser desfavorable.',
  },

  // =========================================================================
  // BLOQUE XII: LEY 40/2015 DE RÉGIMEN JURÍDICO DEL SECTOR PÚBLICO - LRJSP (73-77)
  // =========================================================================
  {
    id: 'q-hd-73',
    topicId: 'G11',
    difficulty:
      'Alta (Delegación de Competencias vs. Avocación Arts. 9 y 10 LRJSP)',
    originType: '🏛️ OFICIAL BOE · LEY 40/2015 LRJSP',
    question:
      'De conformidad con los artículos 9 y 10 de la Ley 40/2015, de 1 de octubre, de Régimen Jurídico del Sector Público (LRJSP), en relación con la delegación de competencias y la avocación, señale la afirmación CORRECTA:',
    options: [
      'A) En la delegación de competencias, las resoluciones administrativas que se adopten por delegación indicarán expresamente esta circunstancia y se considerarán dictadas por el órgano delegante, debiendo publicarse la delegación y su revocación en el diario oficial correspondiente; por el contrario, contra el acuerdo motivado de avocación no cabrá recurso, aunque podrá impugnarse en el que, en su caso, se interponga contra la resolución del procedimiento.',
      'B) En la delegación de competencias se transfiere la titularidad de la competencia al órgano delegado, pudiendo delegarse la adopción de disposiciones de carácter general y la resolución de recursos en los mismos órganos que dictaron los actos objeto de recurso.',
      'C) La encomienda de gestión y la delegación de firma suponen alteración de la titularidad de la competencia y exigen publicación en el BOE para su validez en el caso de la delegación de firma.',
      'D) Contra el acuerdo de avocación cabe interponer recurso de alzada directo e independiente en el plazo de diez días.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 8 a 12 de la Ley 40/2015: la delegación solo traslada el ejercicio (no la titularidad), los actos se consideran dictados por el delegante y no cabe delegar reglamentos ni resolver recursos en el mismo órgano que dictó el acto recurrido; en la avocación (art. 10.2) no cabe recurso directo; y en la delegación de firma (art. 12.2) no es necesaria su publicación para su validez.',
  },
  {
    id: 'q-hd-74',
    topicId: 'G11',
    difficulty: 'Alta (Órganos Colegiados Art. 17 LRJSP)',
    originType: '🏛️ OFICIAL BOE · LEY 40/2015 LRJSP',
    question:
      'Según el artículo 17 de la Ley 40/2015 (LRJSP), para la válida constitución de un órgano colegiado (como una Comisión de Valoración o un Tribunal de selección), a efectos de la celebración de sesiones, deliberaciones y toma de acuerdos, se requerirá:',
    options: [
      'A) La asistencia, presencial o a distancia, del Presidente y Secretario o en su caso, de quienes les suplan, y la de la mitad, al menos, de sus miembros; y no podrá ser objeto de deliberación o acuerdo ningún asunto que no figure incluido en el orden del día, salvo que asistan todos los miembros del órgano colegiado y sea declarada la urgencia del asunto por el voto favorable de la mayoría.',
      'B) La asistencia exclusiva del Presidente y de dos vocales cualesquiera aunque no asista el Secretario ni su suplente.',
      'C) Que la convocatoria sea remitida siempre en papel con un mes de antelación, prohibiéndose celebrar sesiones a distancia por medios electrónicos.',
      'D) Quienes acrediten la titularidad de un interés legítimo podrán dirigirse al Secretario para que les sea expedida certificación de las deliberaciones secretas y de todos los votos particulares emitidos.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 17 de la Ley 40/2015: quórum de Presidente + Secretario (o suplentes) + al menos la mitad de sus miembros; los asuntos fuera del orden del día exigen asistencia de TODOS los miembros y declaración de urgencia por mayoría; y quienes acrediten interés legítimo tienen derecho a certificación de los ACUERDOS (art. 17.7), no de las deliberaciones.',
  },
  {
    id: 'q-hd-75',
    topicId: 'G11',
    difficulty: 'Alta (Abstención y Recusación Arts. 23 y 24 LRJSP)',
    originType: '🏛️ OFICIAL BOE · LEY 40/2015 LRJSP',
    question:
      'En relación con las causas y el procedimiento de abstención y recusación del personal al servicio de las Administraciones Públicas regulados en los artículos 23 y 24 de la Ley 40/2015 (LRJSP), señale la afirmación CORRECTA:',
    options: [
      'A) Es motivo de abstención tener parentesco de consanguinidad dentro del cuarto grado o de afinidad dentro del segundo con cualquiera de los interesados; la no abstención cuando concurra alguna de esas causas no implicará, necesariamente, y en todo caso, la invalidez de los actos en que hayan intervenido; y contra las resoluciones adoptadas en materia de recusación no cabrá recurso, sin perjuicio de alegar la recusación al interponer el recurso que proceda contra el acto que ponga fin al procedimiento.',
      'B) El parentesco que obliga a abstenerse abarca hasta el cuarto grado tanto de consanguinidad como de afinidad, y la intervención de un funcionario incurso en causa de abstención produce siempre la nulidad de pleno derecho del acto.',
      'C) La recusación solo puede promoverse dentro de los primeros cinco días hábiles desde la iniciación del procedimiento.',
      'D) Planteada la recusación, el procedimiento principal continúa su curso sin suspenderse en ningún momento y el superior jerárquico dispone de un mes para resolver.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 23 y 24 de la Ley 40/2015: parentesco hasta 4.º grado de consanguinidad o 2.º de afinidad (en administradores/asesores de sociedades es 2.º de consanguinidad y 2.º de afinidad); la actuación de autoridad en quien concurra motivo de abstención NO implicará necesariamente la invalidez de los actos (art. 23.4); la recusación puede promoverse en cualquier momento de la tramitación (suspende el curso del procedimiento según art. 74 LPAC, manifestando el recusado al día siguiente si se da o no la causa y resolviendo el superior en 3 días si la niega); y contra la resolución de recusación no cabe recurso directo.',
  },
  {
    id: 'q-hd-76',
    topicId: 'G11',
    difficulty: 'Alta (Plazo de Vigencia de los Convenios Art. 49 LRJSP)',
    originType: '🏛️ OFICIAL BOE · LEY 40/2015 LRJSP',
    question:
      'De acuerdo con el artículo 49.h) de la Ley 40/2015 (LRJSP), los convenios suscritos por las Administraciones Públicas (como los convenios interadministrativos en materia de servicios sociales o dependencia, salvo disposición legal especial) deberán tener una duración determinada, que:',
    options: [
      'A) No podrá ser superior a cuatro años, salvo que normativamente se prevea un plazo superior; y en cualquier momento antes de la finalización de dicho plazo los firmantes del convenio podrán acordar unánimemente su prórroga por un periodo de hasta cuatro años adicionales o su extinción.',
      'B) Tendrá una duración inicial máxima de diez años prorrogables tácitamente por periodos iguales.',
      'C) No podrá exceder de un año natural, quedando prohibida cualquier prórroga expresa o tácita.',
      'D) Los convenios se perfeccionan únicamente cuando se publican en el Diario Oficial de la Unión Europea.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 49.h) de la Ley 40/2015: plazo máximo general de vigencia de los convenios de 4 años, con posibilidad de acordar unánimemente antes de su vencimiento una prórroga por hasta otros 4 años adicionales.',
  },
  {
    id: 'q-hd-77',
    topicId: 'G12',
    difficulty: 'Alta (Responsabilidad Patrimonial Arts. 32 LRJSP y 67 LPAC)',
    originType: '🏛️ OFICIAL BOE · LEYES 39/2015 Y 40/2015',
    question:
      'En materia de responsabilidad patrimonial de las Administraciones Públicas y de su personal (artículos 32 a 36 de la Ley 40/2015 y artículos 67, 81 y 91 de la Ley 39/2015), señale la afirmación CORRECTA sobre los plazos de prescripción y tramitación:',
    options: [
      'A) El derecho a reclamar prescribirá al año de producido el hecho o el acto que motive la indemnización o se manifieste su efecto lesivo (en caso de daños físicos o psíquicos a las personas el plazo empezará a computarse desde la curación o la determinación del alcance de las secuelas); el plazo máximo para resolver y notificar es de seis meses con silencio administrativo negativo; y para exigir de oficio la responsabilidad en vía de regreso a las autoridades o personal por dolo, o culpa o negligencia graves, el plazo de instrucción es de quince días y de audiencia de diez días.',
      'B) El derecho a reclamar prescribe a los cuatro años y el sentido del silencio administrativo transcurridos tres meses es estimatorio (positivo).',
      'C) Los particulares deben dirigir su reclamación civil directamente contra el Trabajador Social o funcionario que hubiera causado el daño en el ejercicio de sus funciones.',
      'D) Solo es preceptivo el dictamen del Consejo de Estado u órgano consultivo autonómico cuando las indemnizaciones reclamadas sean de cuantía igual o superior a 3.000 euros.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 67, 81.2 y 91 LPAC y art. 36 LRJSP: prescripción de 1 año; dictamen preceptivo del órgano consultivo cuando la reclamación sea igual o superior a 50.000 euros (o la cuantía que fije la legislación autonómica); plazo de resolución de 6 meses con silencio negativo; y los particulares exigen directamente a la Administración (art. 36.1 LRJSP), la cual, tras indemnizar, exigirá de oficio en vía de regreso a sus autoridades o personal cuando hubieran incurrido en dolo, o culpa o negligencia graves.',
  },

  // =========================================================================
  // BLOQUE XIII: PERSONAL EMPLEADO PÚBLICO · RDL 5/2015 TREBEP Y CAM (78-82)
  // =========================================================================
  {
    id: 'q-hd-78',
    topicId: 'G14',
    difficulty: 'Alta (Funcionarios Interinos Art. 10 TREBEP tras Ley 20/2021)',
    originType: '🏛️ OFICIAL BOE · RDL 5/2015 TREBEP',
    question:
      'Conforme al artículo 10 del Texto Refundido de la Ley del Estatuto Básico del Empleado Público (RDL 5/2015, TREBEP, tras la reforma operada por la Ley 20/2021 de medidas urgentes para la reducción de la temporalidad en el empleo público), señale los plazos máximos legales de los nombramientos de funcionarios interinos:',
    options: [
      'A) Por existencia de plazas vacantes cuando no sea posible su cobertura por funcionarios de carrera, por un máximo de tres años; para la ejecución de programas de carácter temporal, que no podrán tener una duración superior a tres años, ampliable hasta doce meses más por las leyes de Función Pública; y por el exceso o acumulación de tareas por plazo máximo de nueve meses, dentro de un periodo de dieciocho meses.',
      'B) Por plaza vacante hasta cinco años; por programas temporales hasta dos años improrrogables; y por exceso o acumulación de tareas por un máximo de seis meses dentro de un periodo de doce meses.',
      'C) Transcurridos tres años desde el nombramiento del funcionario interino en plaza vacante, este adquiere de forma automática la condición de funcionario de carrera sin necesidad de superar proceso selectivo.',
      'D) Los funcionarios interinos carecen del derecho al reconocimiento de trienios y a la carrera profesional.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 10.1 y 10.4 del TREBEP (reformado por Ley 20/2021): vacante máx. 3 años; programas temporales máx. 3 años (ampliable 12 meses más por leyes de función pública); y exceso o acumulación de tareas máx. 9 meses dentro de 18 meses (antiguamente era 6 meses en 12 meses, trampa muy frecuente en test).',
  },
  {
    id: 'q-hd-79',
    topicId: 'G14',
    difficulty: 'Alta (Permisos Art. 48 TREBEP tras RDL 5/2023)',
    originType: '🏛️ OFICIAL BOE · RDL 5/2015 TREBEP',
    question:
      'Tras la modificación del artículo 48.a) y l) del TREBEP operada por el Real Decreto-ley 5/2023, de 28 de junio, ¿cuántos días hábiles de permiso corresponden a un funcionario público por accidente o enfermedad graves, hospitalización o intervención quirúrgica sin hospitalización que precise de reposo domiciliario del cónyuge, pareja de hecho o parientes de primer grado por consanguinidad o afinidad, y cuántos cuando se trate de un pariente de segundo grado?',
    options: [
      'A) Cinco días hábiles cuando se trate del cónyuge, pareja de hecho o parientes dentro del primer grado por consanguinidad o afinidad (así como de cualquier otra persona distinta que conviva con el funcionario en el mismo domicilio y requiera el cuidado efectivo de aquel); y cuatro días hábiles cuando se trate de un familiar dentro del segundo grado de consanguinidad o afinidad.',
      'B) Tres días hábiles si el suceso se produce en la misma localidad y cinco días hábiles si se produce en distinta localidad para el primer grado; y dos o cuatro días hábiles para el segundo grado.',
      'C) Quince días naturales en el primer grado y cinco días naturales en el segundo grado.',
      'D) Cuatro días naturales con independencia del grado de parentesco.',
    ],
    correctIndex: 0,
    explanation:
      'Pregunta estrella de actualización 2023-2026 (art. 48.a del TREBEP reformado por el RDL 5/2023): el permiso por accidente/enfermedad grave u hospitalización pasó a ser de 5 DÍAS HÁBILES para cónyuge, pareja de hecho, 1.er grado o conviviente que requiera cuidado efectivo, y de 4 DÍAS HÁBILES para el 2.º grado (eliminándose en este permiso de enfermedad/hospitalización la antigua distinción entre misma o distinta localidad, la cual sí se mantiene en el permiso por fallecimiento del art. 48.a segundo párrafo: 3 o 5 días hábiles en 1.er grado y 2 o 4 días hábiles en 2.º grado).',
  },
  {
    id: 'q-hd-80',
    topicId: 'G14',
    difficulty: 'Alta (Permiso Parental Art. 49.g TREBEP)',
    originType: '🏛️ OFICIAL BOE · RDL 5/2015 TREBEP',
    question:
      'El nuevo "permiso parental" para el cuidado de hijo, hija o menor acogido por tiempo superior a un año, incorporado en la letra g) del artículo 49 del TREBEP, tiene las siguientes características:',
    options: [
      'A) Tendrá una duración no superior a ocho semanas, continuas o discontinuas, podrá disfrutarse a tiempo completo, o en régimen de jornada a tiempo parcial, hasta el momento en que el menor cumpla ocho años, y constituye un derecho individual de las personas progenitoras, adoptantes o acogedoras sin que pueda transferirse su ejercicio.',
      'B) Tiene una duración máxima de dieciséis semanas ininterrumpidas hasta que el menor cumpla doce años, pudiendo cederse íntegramente de un progenitor al otro.',
      'C) Solo puede solicitarse para menores de tres años y exige una antigüedad previa en el cuerpo de cinco años.',
      'D) Es incompatible con haber disfrutado previamente del permiso por nacimiento, adopción o acogimiento.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 49.g) del TREBEP (introducido por el RDL 5/2023): duración no superior a 8 semanas, continuas o discontinuas, hasta que el menor cumpla 8 años, siendo un derecho individual intransferible.',
  },
  {
    id: 'q-hd-81',
    topicId: 'G14',
    difficulty:
      'Alta (Situaciones Administrativas y Excedencias Arts. 85 y 89 TREBEP)',
    originType: '🏛️ OFICIAL BOE · RDL 5/2015 TREBEP',
    question:
      'Conforme a los artículos 85 y 89 del TREBEP, en relación con las modalidades de excedencia de los funcionarios de carrera, señale la afirmación CORRECTA:',
    options: [
      'A) En la excedencia por cuidado de familiares (no superior a tres años para atender al cuidado de cada hijo o de un familiar hasta el segundo grado), el tiempo de permanencia será computable a efectos de trienios, carrera y derechos en el régimen de Seguridad Social que sea de aplicación, y el puesto de trabajo desempeñado se reservará, al menos, durante dos años; por su parte, en la excedencia por razón de violencia de género o de violencia sexual o terrorista no se exigirá haber prestado un tiempo mínimo de servicios previos.',
      'B) La excedencia voluntaria por interés particular da derecho a la reserva del puesto de trabajo durante los primeros dieciocho meses y computa a efectos de trienios.',
      'C) Para solicitar la excedencia por cuidado de un hijo menor de tres años es requisito indispensable haber prestado servicios efectivos durante los cinco años inmediatamente anteriores.',
      'D) En la excedencia por violencia de género, la funcionaria solo tiene derecho a la reserva del puesto de trabajo durante los dos primeros meses sin posibilidad de prórroga.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 89 del TREBEP: la excedencia voluntaria por interés particular (89.2) exige 5 años de servicios previos y no computa ni reserva puesto; la de cuidado de familiares (89.4) dura hasta 3 años, no exige antigüedad previa, computa a efectos de trienios/carrera/Seguridad Social y reserva el puesto al menos 2 años; y la de violencia de género/sexual (89.5) no exige servicios previos, reservando el puesto los 6 primeros meses (prorrogables de 3 en 3 hasta un máximo de 18 meses) y percibiendo retribuciones íntegras los 2 primeros meses.',
  },
  {
    id: 'q-hd-82',
    topicId: 'G14',
    difficulty:
      'Alta (Contraste Prescripción TREBEP Art. 97 vs Estatuto Marco)',
    originType: '🏛️ OFICIAL BOE · RDL 5/2015 TREBEP',
    question:
      '¡Contraste clave para no confundir CAM/Ayuntamiento con SERMAS! Según el artículo 97 del RDL 5/2015 (TREBEP), ¿cuáles son los plazos de prescripción de las faltas disciplinarias y de las sanciones impuestas al personal funcionario y laboral regido por el TREBEP?',
    options: [
      'A) Las infracciones muy graves prescribirán a los tres años, las graves a los dos años y las leves a los seis meses (contados desde que la falta se hubiera cometido, y desde el cese de su comisión cuando se trate de faltas continuadas); y las sanciones impuestas por faltas muy graves prescribirán a los tres años, las impuestas por faltas graves a los dos años y las impuestas por faltas leves al año.',
      'B) Las infracciones muy graves prescriben a los cuatro años, las graves a los dos años y las leves a los seis meses, y las sanciones leves prescriben a los seis meses.',
      'C) Tanto las infracciones como las sanciones prescriben a los cuatro años (muy graves), tres años (graves) y un año (leves).',
      'D) El plazo de caducidad del procedimiento disciplinario en el TREBEP es de tres meses naturales improrrogables.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 97 del TREBEP: en el régimen funcionarial general (CAM y Ayuntamiento de Madrid), las FALTAS prescriben a los 3 años (muy graves), 2 años (graves) y 6 meses (leves); y las SANCIONES prescriben a los 3 años (muy graves), 2 años (graves) y 1 AÑO (leves). Recuerda que en el SERMAS (art. 72 Ley 55/2003) las faltas y sanciones muy graves prescriben a los 4 años y las leves a los 6 meses.',
  },

  // =========================================================================
  // BLOQUE XIV: CONTRATOS DEL SECTOR PÚBLICO - LEY 9/2017 LCSP Y CONCIERTOS (83-86)
  // =========================================================================
  {
    id: 'q-hd-83',
    topicId: 'G13',
    difficulty: 'Alta (Contratos Menores Art. 118 LCSP)',
    originType: '🏛️ OFICIAL BOE · LEY 9/2017 LCSP',
    question:
      'De conformidad con los artículos 29.8 y 118 de la Ley 9/2017, de 8 de noviembre, de Contratos del Sector Público (LCSP), se consideran contratos menores aquellos cuyo valor estimado sea inferior a las siguientes cuantías (IVA excluido) y con la siguiente limitación temporal:',
    options: [
      'A) Inferior a 40.000 euros cuando se trate de contratos de obras, o inferior a 15.000 euros cuando se trate de contratos de suministro o de servicios; no pudiendo tener una duración superior a un año ni ser objeto de prórroga.',
      'B) Inferior a 50.000 euros en contratos de obras e inferior a 18.000 euros en contratos de suministros y servicios, pudiendo prorrogarse por un año adicional.',
      'C) Inferior a 60.000 euros en obras e inferior a 35.000 euros en servicios sociales, con una duración máxima de dos años.',
      'D) Inferior a 15.000 euros en todo tipo de contratos incluido el de concesión de servicios.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 29.8 y 118.1 de la Ley 9/2017 (LCSP): en la LCSP vigente los umbrales de contrato menor (valor estimado sin IVA) son inferiores a 40.000 € en obras e inferiores a 15.000 € en suministros o servicios (las antiguas cifras de 50.000 € y 18.000 € pertenecían al derogado TRLCSP de 2011), con duración máxima de 1 año y sin prórroga.',
  },
  {
    id: 'q-hd-84',
    topicId: 'G13',
    difficulty:
      'Alta (Duración Contratos de Servicios y Prestaciones Directas Art. 29.4 LCSP)',
    originType: '🏛️ OFICIAL BOE · LEY 9/2017 LCSP',
    question:
      'Según el artículo 29.4 de la Ley 9/2017 de Contratos del Sector Público (LCSP), ¿cuál es el plazo máximo de duración general de los contratos de suministros y de servicios de prestación sucesiva (incluidas las posibles prórrogas), y qué regla especial establece dicho artículo para los contratos de servicios que tengan por objeto la asistencia a la dirección de obra o la gestión de prestaciones directas a los ciudadanos (como servicios sanitarios o sociales)?',
    options: [
      'A) Con carácter general tendrán un plazo máximo de duración de cinco años, incluyendo las posibles prórrogas (siendo la prórroga obligatoria para el empresario siempre que su preaviso se produzca al menos con dos meses de antelación a la finalización del plazo del contrato); no obstante, los contratos de servicios que impliquen prestaciones directas a los ciudadanos o cuando lo exija el período de recuperación de las inversiones podrán tener un plazo de duración superior, que no excederá de cinco años salvo en los supuestos excepcionales del artículo 29.4.',
      'B) Tienen una duración máxima general de cuatro años incluidas las prórrogas, y la prórroga puede acordarse de forma tácita por silencio de ambas partes.',
      'C) Los contratos de servicios no pueden superar en ningún caso los dos años de duración total.',
      'D) El preaviso obligatorio para imponer la prórroga forzosa al contratista es de quince días naturales.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 29.2 y 29.4 de la Ley 9/2017 (LCSP): duración máxima general de los contratos de suministros y servicios de prestación sucesiva de 5 años incluidas las prórrogas; prohibición absoluta de prórroga por consentimiento tácito; y obligatoriedad de la prórroga para el contratista si el órgano de contratación preavisa con al menos 2 meses de antelación (salvo en contratos de duración inferior a 2 meses).',
  },
  {
    id: 'q-hd-85',
    topicId: 'G13',
    difficulty:
      'Alta (Procedimiento Abierto Simplificado y Supersimplificado Art. 159 LCSP)',
    originType: '🏛️ OFICIAL BOE · LEY 9/2017 LCSP',
    question:
      'En el procedimiento abierto simplificado abreviado (conocido como "supersimplificado") regulado en el artículo 159.6 de la Ley 9/2017 de Contratos del Sector Público (LCSP), aplicable en contratos de obras de valor estimado inferior a 80.000 euros y en contratos de suministros y de servicios de valor estimado inferior a 60.000 euros (excepto los que tengan por objeto prestaciones de carácter intelectual), señale la opción CORRECTA:',
    options: [
      'A) Se eximirá a los licitadores de la acreditación de la solvencia económica y financiera y técnica o profesional, no se requerirá la constitución de garantía definitiva, y la valoración de las ofertas se podrá efectuar automáticamente mediante dispositivos informáticos sobre criterios cuantificables mediante la mera aplicación de fórmulas.',
      'B) Se exige constituir una garantía provisional del 3 % y una garantía definitiva del 5 % del precio final ofertado.',
      'C) Permite utilizar criterios evaluables mediante juicio de valor con una ponderación de hasta el 45 % del total.',
      'D) Es el procedimiento obligatorio para adjudicar contratos de redacción de proyectos de arquitectura e ingeniería de carácter intelectual.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 159.6 de la Ley 9/2017 (LCSP): en el abierto simplificado abreviado (<80.000 € obras y <60.000 € suministros/servicios no intelectuales) no hay criterios de juicio de valor (100% fórmulas), se exime de acreditar solvencia y NO se requiere garantía definitiva.',
  },
  {
    id: 'q-hd-86',
    topicId: 'E11',
    difficulty:
      'Alta (Concierto Social vs. Contrato Mercantil LCSP y Ley 12/2022)',
    originType: '🏛️ OFICIAL BOCM / BOE · LEY 9/2017 Y LEY 12/2022 CAM',
    question:
      'En relación con las fórmulas no contractuales de provisión de servicios públicos dirigidos a las personas (Disposición Adicional 49.ª de la Ley 9/2017 LCSP y Título VI de la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid), el "Concierto Social" se define jurídicamente como:',
    options: [
      'A) Un instrumento organizativo de naturaleza no contractual mediante el cual la Administración encomienda la provisión de prestaciones del Sistema Público de Servicios Sociales a entidades privadas de iniciativa social (sin ánimo de lucro) debidamente acreditadas, con sujeción a los principios de publicidad, transparencia, no discriminación y eficiencia presupuestaria, al margen de los procedimientos contractuales ordinarios de la LCSP.',
      'B) Un contrato menor de servicios de duración máxima de un año adjudicado libremente a cualquier empresa mercantil con ánimo de lucro.',
      'C) Una subvención nominativa otorgada sin contraprestación de plazas ni control de calidad.',
      'D) Un contrato de concesión de obras públicas regulado por el artículo 14 de la Ley 9/2017.',
    ],
    correctIndex: 0,
    explanation:
      'Con amparo en las Directivas europeas de 2014, la DA 49.ª de la LCSP y los arts. 62 y ss. de la Ley 12/2022 de Servicios Sociales de la CAM regulan la acción concertada (concierto social) como fórmula diferenciada del contrato administrativo para proveer servicios a las personas a través de entidades de iniciativa social acreditadas.',
  },

  // =========================================================================
  // BLOQUE XV: PROTECCIÓN DE DATOS (RGPD / LO 3/2018), TRANSPARENCIA Y LEY 41/2002 (87-90)
  // =========================================================================
  {
    id: 'q-hd-87',
    topicId: 'G15',
    difficulty:
      'Alta (Edad Consentimiento Menores y Categorías Especiales LO 3/2018)',
    originType: '🏛️ OFICIAL BOE · LO 3/2018 LOPDGDD Y RGPD',
    question:
      'De conformidad con los artículos 7 y 9 de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), y el artículo 9 del Reglamento (UE) 2016/679 (RGPD), señale la afirmación CORRECTA:',
    options: [
      'A) El tratamiento de los datos personales de un menor de edad únicamente podrá fundarse en su propio consentimiento cuando sea mayor de catorce años (salvo los supuestos en que la ley exija la asistencia de los titulares de la patria potestad o tutela); y respecto a las categorías especiales de datos (como salud, origen étnico, ideología u orientación sexual), el mero consentimiento del afectado no bastará por sí solo para levantar la prohibición de tratamiento cuando la finalidad principal sea identificar su ideología, afiliación sindical, religión, orientación sexual, creencias u origen racial o étnico.',
      'B) En España la edad mínima para prestar consentimiento para el tratamiento de datos personales es de dieciséis años cumplidos en todos los casos.',
      'C) Los datos relativos a la salud y a la Historia Social Única nunca tienen la consideración de categorías especiales de datos en el artículo 9 del RGPD.',
      'D) Los profesionales de los Servicios Sociales necesitan pedir consentimiento firmado ante Notario aunque el tratamiento sea necesario para el cumplimiento de una misión realizada en interés público o en el ejercicio de poderes públicos conferidos por la Ley 12/2022.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 7.1 y 9.1 de la LO 3/2018 (LOPDGDD): mientras el RGPD permitía a los Estados fijar la edad entre 13 y 16 años, España la fijó en el art. 7.1 LOPDGDD en mayores de 14 AÑOS; además, el art. 9.1 LOPDGDD establece que el solo consentimiento no basta para levantar la prohibición cuando la finalidad principal sea identificar ideología, afiliación sindical, religión, orientación sexual, creencias u origen racial/étnico, amparándose el tratamiento en Servicios Sociales y Sanidad en las bases de los arts. 6.1.e) y 9.2.b), h) e i) del RGPD (interés público esencial y gestión de sistemas de asistencia sanitaria y social).',
  },
  {
    id: 'q-hd-88',
    topicId: 'G15',
    difficulty:
      'Alta (Plazo Respuesta Derechos ARSULIPO y Violaciones de Seguridad RGPD)',
    originType: '🏛️ OFICIAL BOE · RGPD (ARTS. 12 Y 33) Y LO 3/2018',
    question:
      'Según los artículos 12.3 y 33.1 del Reglamento General de Protección de Datos (RGPD), ¿en qué plazo debe responder el responsable del tratamiento a las solicitudes de ejercicio de los derechos de acceso, rectificación, supresión, limitación, portabilidad u oposición, y en qué plazo máximo debe notificar una violación de la seguridad de los datos personales a la Autoridad de Control (AEPD)?',
    options: [
      'A) Debe responder al interesado sin dilación indebida y, a más tardar, en el plazo de un mes a partir de la recepción de la solicitud (prorrogable otros dos meses en caso necesario teniendo en cuenta la complejidad y el número de solicitudes); y en caso de violación de la seguridad de los datos, deberá notificarla a la Autoridad de Control sin dilación indebida y, de ser posible, a más tardar 72 horas después de que haya tenido constancia de ella.',
      'B) Debe responder a los derechos de acceso en el plazo de diez días hábiles y cancelar los datos en cinco días, disponiendo de treinta días para notificar las brechas de seguridad a la AEPD.',
      'C) El plazo para responder al ejercicio de cualquier derecho en el RGPD es de tres meses naturales improrrogables.',
      'D) El nombramiento de un Delegado de Protección de Datos (DPD) es puramente voluntario para las Administraciones Públicas y organismos públicos.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 12.3, 33.1 y 37.1.a) del RGPD: el antiguo plazo de 10 días del RLOPD de 2007 fue sustituido por el plazo único del RGPD de 1 MES para responder a todos los derechos (ampliable 2 meses más en casos complejos informando al interesado en el primer mes); las brechas de seguridad se notifican a la AEPD en un máximo de 72 HORAS; y el Delegado de Protección de Datos (DPD) es OBLIGATORIO en todas las autoridades y organismos públicos (art. 37.1.a RGPD y art. 34 LOPDGDD).',
  },
  {
    id: 'q-hd-89',
    topicId: 'S-9',
    difficulty:
      'Alta (Autonomía del Paciente y Mayoría de Edad Sanitaria Ley 41/2002)',
    originType: '🏥 OFICIAL SERMAS / CAM · LEY 41/2002',
    question:
      'De acuerdo con los artículos 8, 9 y 18 de la Ley 41/2002, de 14 de noviembre, básica reguladora de la autonomía del paciente y de derechos y obligaciones en materia de información y documentación clínica, señale la afirmación CORRECTA sobre el consentimiento informado, la mayoría de edad sanitaria y el derecho de acceso a la historia clínica:',
    options: [
      'A) El consentimiento será verbal por regla general, pero se prestará por escrito en los casos de intervención quirúrgica, procedimientos diagnósticos y terapéuticos invasores y procedimientos que suponen riesgos o inconvenientes de notoria y previsible repercusión negativa; cuando se trate de menores emancipados o con dieciséis años cumplidos no cabe prestar el consentimiento por representación (salvo actuación de grave riesgo para la vida o salud del menor según criterio del facultativo); y el derecho de acceso del paciente a la historia clínica no puede ejercitarse en perjuicio del derecho de los profesionales participantes en su elaboración a oponer al acceso la reserva de sus anotaciones subjetivas.',
      'B) El consentimiento informado debe prestarse siempre por escrito para cualquier acto médico o social rutinario, y la mayoría de edad sanitaria se sitúa en los catorce años.',
      'C) La historia clínica debe destruirse íntegramente al mes del alta hospitalaria.',
      'D) El paciente no puede revocar nunca su consentimiento una vez firmado el documento de ingreso hospitalario.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 8.2, 9.4, 17 y 18.3 de la Ley 41/2002 (y Ley 4/2017 CAM): el consentimiento es verbal por regla general y escrito en cirugías y procedimientos invasores; es libremente revocable por escrito en cualquier momento; la mayoría de edad sanitaria se alcanza a los 16 AÑOS (no cabe representación salvo grave riesgo); el paciente tiene derecho de acceso salvo respecto a datos de terceras personas y a la reserva de las anotaciones subjetivas de los profesionales; y la documentación clínica se conserva como mínimo 5 años contados desde la fecha del alta de cada proceso asistencial (art. 17.1).',
  },
  {
    id: 'q-hd-90',
    topicId: 'G6',
    difficulty: 'Alta (Transparencia Ley 19/2013 y Ley 10/2019 CAM)',
    originType: '🏛️ OFICIAL BOCM · LEY 19/2013 Y LEY 10/2019 CAM',
    question:
      'Compare el régimen del derecho de acceso a la información pública en la Ley 19/2013 estatal y en la Ley 10/2019, de 10 de abril, de Transparencia y de Participación de la Comunidad de Madrid, y señale la opción CORRECTA respecto al plazo de resolución y al órgano garante autonómico:',
    options: [
      'A) El solicitante no está obligado a motivar su solicitud de acceso a la información; en la Ley 10/2019 de la Comunidad de Madrid el plazo máximo para dictar y notificar la resolución es de veinte días hábiles desde la recepción de la solicitud por el órgano competente (ampliable por otros veinte días hábiles si el volumen o la complejidad lo hacen necesario), operando el silencio administrativo desestimatorio (negativo), y pudiendo interponerse reclamación potestativa en el plazo de un mes ante el Consejo de Transparencia y Participación de la Comunidad de Madrid.',
      'B) Para solicitar acceso a información pública es obligatorio acreditar la condición de interesado legítimo y motivar la petición mediante firma de abogado.',
      'C) Tanto en la Ley 19/2013 como en la Ley 10/2019 de la Comunidad de Madrid el sentido del silencio administrativo ante una solicitud de acceso a información pública es siempre positivo.',
      'D) El plazo de resolución en la Ley 10/2019 de la Comunidad de Madrid es de seis meses naturales.',
    ],
    correctIndex: 0,
    explanation:
      'Trampa de contraste autonómico (arts. 17 y 20 Ley 19/2013 vs arts. 39, 42 y 47 Ley 10/2019 CAM): el solicitante NO está obligado a motivar su solicitud; mientras en la Ley estatal 19/2013 el plazo es de 1 mes, en la Ley 10/2019 de la Comunidad de Madrid (art. 42.1) el plazo máximo para resolver y notificar se redujo a 20 DÍAS HÁBILES (prorrogables otros 20 días hábiles), siendo el silencio administrativo NEGATIVO en ambas leyes y conociéndose la reclamación potestativa (1 mes) ante el Consejo de Transparencia y Participación de la CAM.',
  },
  // =========================================================================
  // BLOQUE XVI: HISTORIA, EPISTEMOLOGÍA Y MODELOS DEL TRABAJO SOCIAL (91-97)
  // =========================================================================
  {
    id: 'q-hd-91',
    topicId: 'E54',
    difficulty: 'Alta (Obras Clásicas Mary Richmond y Gordon Hamilton)',
    originType: '🏛️ OFICIAL CAM / SERMAS / AYTO · EPISTEMOLOGÍA TS',
    question:
      'En la evolución histórica y epistemológica del Trabajo Social de casos (Casework), señale cuál de las siguientes afirmaciones atribuye correctamente las obras fundacionales y aportaciones conceptuales de Mary Ellen Richmond y Gordon Hamilton:',
    options: [
      'A) Mary Ellen Richmond publicó "Social Diagnosis" en 1917 (sistematizando la investigación y la evidencia social: real, testimonial y circunstancial) y "What is Social Case Work?" en 1922; por su parte, Gordon Hamilton (Escuela Diagnóstica) introdujo el concepto de "persona-en-situación" y publicó "Teoría y práctica del Trabajo Social de casos" en 1940.',
      'B) Mary Ellen Richmond fundó la Escuela Funcional de Pensilvania inspirada en Otto Rank en 1930, mientras que Gordon Hamilton fundó la Charity Organization Society (COS) en Londres en 1869.',
      'C) Gordon Hamilton publicó "Social Diagnosis" en 1917 y Mary Ellen Richmond acuñó el modelo de modificación de conducta operante en 1957.',
      'D) Mary Ellen Richmond creó el primer Settlement House (Toynbee Hall, 1884) junto con Jane Addams, rechazando la sistematización diagnóstica individual.',
    ],
    correctIndex: 0,
    explanation:
      'Distinción clásica de examen: Mary Richmond ("Social Diagnosis", 1917; "Caso social individual", 1922) sentó las bases metodológicas científicas; Gordon Hamilton ("Theory and Practice of Social Case Work", 1940) consolidó la Escuela Diagnóstica acuñando el binomio psicosocial "persona-en-situación" (mientras que Toynbee Hall fue fundado por Samuel y Henrietta Barnett en 1884 y Hull House por Jane Addams y Ellen Gates Starr en Chicago en 1889).',
  },
  {
    id: 'q-hd-92',
    topicId: 'E55',
    difficulty: 'Alta (Escuela Diagnóstica vs. Escuela Funcional)',
    originType: '🏛️ OFICIAL CAM / SERMAS · MODELOS CLÁSICOS',
    question:
      'Compare la "Escuela Diagnóstica" (o psicosocial) y la "Escuela Funcional" en la historia del Trabajo Social norteamericano y señale la opción CORRECTA:',
    options: [
      'A) La Escuela Diagnóstica (Gordon Hamilton, Florence Hollis, Escuela de Nueva York/Columbia) se fundamenta en la teoría psicoanalítica de Sigmund Freud y articula la intervención sobre el binomio "estudio-diagnóstico-tratamiento"; en cambio, la Escuela Funcional (Virginia Robinson, Jessie Taft, Escuela de Pensilvania) se basa en la psicología de la "voluntad" de Otto Rank, sustituye el concepto de tratamiento por el de "proceso de ayuda" centrado en el "aquí y ahora" y utiliza los límites y funciones de la agencia social como motor de cambio.',
      'B) La Escuela Funcional se basa en el determinismo psicoanalítico de Freud e insiste en reconstruir los traumas de la primera infancia durante al menos dos años.',
      'C) Florence Hollis es la máxima representante de la Escuela Funcional de Pensilvania y Virginia Robinson de la Escuela Conductista.',
      'D) Ambas escuelas rechazan el trabajo con casos individuales y se dedican exclusivamente a la acción política revolucionaria.',
    ],
    correctIndex: 0,
    explanation:
      'Pregunta recurrente de modelos (Malcolm Payne y Viscarret): Escuela Diagnóstica (Freud -> Hamilton, Hollis: diagnóstico etiológico y tratamiento psicosocial) frente a Escuela Funcional (Otto Rank -> Virginia Robinson, Jessie Taft, Herbert Aptekar: voluntad del cliente, tiempo presente, uso de la función de la institución/agencia).',
  },
  {
    id: 'q-hd-93',
    topicId: 'E55',
    difficulty: 'Alta (Clasificación de las 6 Técnicas de Florence Hollis)',
    originType: '🏥 OFICIAL SERMAS / CAM · MODELO PSICOSOCIAL',
    question:
      'Dentro del Modelo Psicosocial o Diagnóstico, Florence Hollis ("Casework: A Psychosocial Therapy", 1964) distingue entre el trabajo con el entorno (tratamiento indirecto) y el apoyo psicológico directo con el usuario, clasificando los procedimientos de intervención directa en seis categorías exactas:',
    options: [
      'A) 1) Sostén o apoyo (sustainment), 2) Influencia directa (direct influence), 3) Exploración, descripción y ventilación o catarsis, 4) Reflexión sobre la configuración persona-situación actual, 5) Reflexión sobre la dinámica de los patrones de respuesta y 6) Reflexión sobre el desarrollo o génesis en el pasado temprano.',
      'B) 1) Extinción operante, 2) Castigo negativo, 3) Desensibilización sistemática, 4) Contrato de contingencias, 5) Modelado y 6) Economía de fichas.',
      'C) 1) Concienciación política, 2) Huelga de alquileres, 3) Investigación-Acción Participativa, 4) Mapeo de activos, 5) Deriva urbana y 6) Asamblea barrial.',
      'D) Únicamente dos técnicas: la hipnosis clínica regresiva y la libre asociación de ideas en diván.',
    ],
    correctIndex: 0,
    explanation:
      'La tipología de las 6 técnicas de tratamiento directo de Florence Hollis es una de las preguntas de mayor discriminación en oposiciones de Trabajo Social (Sostén, Influencia directa, Ventilación/Catarsis y los 3 niveles de reflexión: persona-situación actual, dinámica psicológica y desarrollo genético/infancia).',
  },
  {
    id: 'q-hd-94',
    topicId: 'E55',
    difficulty: 'Alta (Modelo Centrado en la Tarea: Reid y Epstein 1972)',
    originType: '🏛️ OFICIAL CAM / SERMAS / AYTO · MODELO TAREA',
    question:
      'De conformidad con el "Modelo Centrado en la Tarea" formulado por William J. Reid y Laura Epstein ("Task-Centered Casework", 1972, con raíces en los estudios previos de Reid y Shyne de 1969 sobre intervenciones breves), señale la afirmación CORRECTA respecto a sus límites temporales, número de problemas diana y criterios de exclusión:',
    options: [
      'A) Es una intervención breve y estructurada en el tiempo (generalmente entre 6 y 12 sesiones a lo largo de dos a cuatro meses), que selecciona de mutuo acuerdo con la persona usuaria un máximo de tres "problemas diana" (target problems) explícitamente reconocidos por esta, articulando el cambio a través de tareas operativas y un contrato formal.',
      'B) Es una psicoterapia profunda de duración indefinida (mínimo tres años) en la que el Trabajador Social impone unilateralmente los problemas inconscientes sin que el usuario los reconozca.',
      'C) Permite abordar simultáneamente hasta quince problemas estructurales en una única sesión sin fijar plazos ni tareas entre sesiones.',
      'D) Fue creado por Urie Bronfenbrenner y Carel Germain dentro de la corriente marxista radical.',
    ],
    correctIndex: 0,
    explanation:
      'En el Modelo Centrado en la Tarea (Reid y Epstein, 1972): intervención breve (6-12 entrevistas / 2 a 4 meses), problemas reconocidos y queridos trabajar por el cliente (máximo 3 problemas diana priorizados), definición de tareas entre sesiones y uso de contrato.',
  },
  {
    id: 'q-hd-95',
    topicId: 'E55',
    difficulty:
      'Alta (Modelo de Intervención en Crisis: Caplan, Rapoport y Golan)',
    originType: '🏢 OFICIAL AYTO / SERMAS / CAM · MODELO CRISIS',
    question:
      'En el "Modelo de Intervención en Crisis" (desarrollado a partir de la teoría de Erich Lindemann y Gerald Caplan y aplicado al Trabajo Social por Lydia Rapoport, Naomi Golan y Howard Parad), señale la opción CORRECTA sobre las fases de la crisis y la ventana temporal de intervención:',
    options: [
      'A) La crisis es un estado temporal de trastorno y desorganización ante un factor precipitante que desborda los mecanismos habituales de resolución de problemas; tiene una duración autolimitada de entre cuatro y seis semanas (fase de impacto/tensión, fase de ascenso de tensión por fallo de estrategias, fase de emergencia de recursos internos/externos y fase de reequilibrio o desorganización grave), siendo la primera entrevista de contención e intervención inmediata.',
      'B) En el modelo de crisis existe una primera fase de estudio diagnóstico pausado de tres meses antes de iniciar cualquier actuación de apoyo.',
      'C) Solo existen crisis imprevisibles o accidentales (catástrofes), negando Gerald Caplan y Erik Erikson la existencia de crisis evolutivas o del desarrollo vital.',
      'D) La intervención en crisis prohíbe dar consejos directivos o movilizar recursos materiales urgentes.',
    ],
    correctIndex: 0,
    explanation:
      'Autores clave en Crisis: Lindemann (duelo agudo tras el incendio de Coconut Grove, 1944), Caplan (psiquiatría preventiva, 4 fases de tensión y ventana de 4 a 6 semanas; distinción entre crisis evolutivas/madurativas de Erikson y crisis accidentales/situacionales), Lydia Rapoport y Naomi Golan (tríada: factor precipitante, estado vulnerable y percepción cognitiva).',
  },
  {
    id: 'q-hd-96',
    topicId: 'E55',
    difficulty:
      'Alta (Modelo Ecológico "Life Model" y Niveles de Bronfenbrenner)',
    originType: '🏛️ OFICIAL CAM / SERMAS / AYTO · MODELO SISTÉMICO-ECOLÓGICO',
    question:
      'En relación con la teoría ecológica del desarrollo humano de Urie Bronfenbrenner (1979) y el "Modelo de Vida" (Life Model) del Trabajo Social formulado por Carel B. Germain y Alex Gitterman (1980), señale la afirmación CORRECTA:',
    options: [
      'A) Bronfenbrenner estructura el ambiente ecológico en sistemas concéntricos: Microsistema (entorno inmediato de roles y relaciones directas), Mesosistema (interrelaciones entre dos o más microsistemas en los que la persona participa activamente, como familia y escuela), Exosistema (entornos en los que la persona no está incluida directamente pero cuyos hechos afectan a su entorno, como el trabajo de los padres) y Macrosistema (patrones culturales, ideológicos e institucionales); mientras que Germain y Gitterman centran el Life Model en las transacciones adaptativas entre personas y entornos en tres áreas: transiciones vitales, presiones ambientales y procesos interpersonales.',
      'B) En la teoría de Bronfenbrenner, el Mesosistema es el nivel cultural y legislativo global de un país, y el Exosistema es la familia nuclear conviviente.',
      'C) El modelo sistémico se basa en la causalidad lineal mecanicista (causa A produce efecto B) rechazando la causalidad circular, la homeostasis y la equifinalidad de Ludwig von Bertalanffy.',
      'D) Carel Germain y Alex Gitterman son los creadores del Trabajo Social Radical Marxista británico junto con Corrigan y Leonard.',
    ],
    correctIndex: 0,
    explanation:
      'Trampa habitual de test en Bronfenbrenner: confundir el Mesosistema (relación entre dos o más microsistemas donde participa el sujeto) con el Exosistema (entorno donde el sujeto NO participa directamente pero le influye). En el Life Model (Germain y Gitterman, 1980), el foco son los problemas de ajuste (fit/adaptación) en transiciones vitales, presiones del entorno y procesos interpersonales.',
  },
  {
    id: 'q-hd-97',
    topicId: 'E19',
    difficulty:
      'Alta (Modelos de Trabajo Social Comunitario de Jack Rothman 1968)',
    originType: '🏢 OFICIAL AYTO / CAM / SERMAS · TS COMUNITARIO',
    question:
      'En su clásica tipología de la intervención comunitaria ("Three Models of Community Organization Practice", 1968), Jack Rothman distingue tres modelos puros de práctica comunitaria. Señale cuál de las siguientes relaciones entre modelo, objetivo y rol del profesional es CORRECTA:',
    options: [
      'A) 1) Desarrollo de la localidad (o desarrollo comunitario): orientado al proceso de capacitación, autoayuda e integración comunitaria mediante el consenso, donde el profesional actúa como "capacitador, catalizador o facilitador"; 2) Planificación social: orientada a la tarea técnica de resolución de problemas sustantivos (vivienda, salud mental, delincuencia), donde el profesional actúa como "experto, analista o planificador"; y 3) Acción social: orientada tanto al proceso como a la tarea para redistribuir el poder y recursos en favor de colectivos oprimidos mediante estrategias de conflicto/confrontación, donde el profesional actúa como "activista, abogado (advocate) o agitador".',
      'B) En el modelo de Planificación Social el rol del Trabajador Social es el de agitador político huelguista y se rechaza el uso de datos estadísticos.',
      'C) En el modelo de Acción Social se asume que la comunidad es homogénea, sin conflictos de intereses con la estructura de poder.',
      'D) Los tres modelos fueron formulados por Mary Richmond en 1917 exclusivamente para hospitales psiquiátricos.',
    ],
    correctIndex: 0,
    explanation:
      'La matriz de Jack Rothman (1968: Desarrollo de la Localidad, Planificación Social y Acción Social) junto con las aportaciones de Marco Marchioni (los 4 protagonistas de la comunidad: Administración, Recursos técnicos/profesionales, Población y Documentación/Conocimiento; y las 3 fases de audición/estudio, diagnóstico comunitario y programación) son fijas en los exámenes de Madrid.',
  },

  // =========================================================================
  // BLOQUE XVII: MÉTODO, INVESTIGACIÓN, PLANIFICACIÓN Y EVALUACIÓN (98-103)
  // =========================================================================
  {
    id: 'q-hd-98',
    topicId: 'E56',
    difficulty:
      'Alta (Las 9 Cuestiones de Planificación de Ander-Egg y Niveles)',
    originType: '🏢 OFICIAL AYTO / CAM · PLANIFICACIÓN SOCIAL',
    question:
      'Según Ezequiel Ander-Egg ("Introducción a la planificación") y María José Aguilar Idáñez, la diferenciación entre los niveles de la planificación (Plan, Programa, Proyecto, Actividad y Tarea) y las preguntas básicas que responden a los elementos de la programación se estructuran del siguiente modo:',
    options: [
      'A) El Plan corresponde al nivel estratégico global (largo plazo, fija grandes prioridades y políticas), el Programa al nivel táctico (medio plazo, articula un conjunto coherente de proyectos de una misma área) y el Proyecto al nivel operativo (corto plazo, unidad mínima de asignación de recursos que produce un bien o servicio concreto); respondiendo "Qué se quiere hacer" a la naturaleza del proyecto, "Por qué" a la fundamentación/origen, "Para qué" a los objetivos y "Cuánto" a las metas.',
      'B) El Proyecto es el nivel estratégico superior que engloba varios Planes nacionales, y el Programa es la tarea individual más pequeña.',
      'C) En la matriz de Ander-Egg, la pregunta "¿Para qué se quiere hacer?" define el presupuesto financiero y "¿Por qué se quiere hacer?" define el calendario de actividades.',
      'D) Las metas (cuánto se quiere hacer) son formulaciones abstractas y filosóficas no cuantificables ni sujetas a plazo.',
    ],
    correctIndex: 0,
    explanation:
      'Jerarquía clásica de planificación (Ander-Egg): Plan (Estratégico) -> Programa (Táctico) -> Proyecto (Operativo) -> Actividad (medio de intervención) -> Tarea (acción concreta que operacionaliza la actividad). Preguntas clave: Qué (naturaleza), Por qué (origen/fundamentación), Para qué (objetivos), Cuánto (metas cuantificadas en tiempo y lugar), Dónde (localización física y cobertura espacial), Cómo (actividades/metodología), Cuándo (ubicación en el tiempo/diagrama de Gantt), A quiénes (destinatarios), Quiénes (RR.HH.) y Con qué (recursos materiales y financieros).',
  },
  {
    id: 'q-hd-99',
    topicId: 'E58',
    difficulty: 'Alta (Enfoque del Marco Lógico: Lógica Vertical y Horizontal)',
    originType: '🏢 OFICIAL AYTO / CAM · MARCO LÓGICO',
    question:
      'En la planificación y gestión de proyectos sociales mediante el "Enfoque del Marco Lógico" (EML), la "Matriz de Planificación del Proyecto" (MPP, de 4 filas por 4 columnas) exige una estricta coherencia en su lógica vertical y horizontal, de tal forma que:',
    options: [
      'A) En cada proyecto debe formularse un único "Objetivo Específico" (propósito o efecto directo central sobre la población beneficiaria), con el fin de evitar objetivos múltiples difusos; las cuatro filas de abajo arriba son Actividades, Resultados (productos), Objetivo Específico y Objetivo General (fin/impacto); y las cuatro columnas son Resumen descriptivo, Indicadores verificables objetivamente (IVO), Fuentes de verificación e Hipótesis o factores externos (supuestos fuera del control directo de la gestión del proyecto).',
      'B) Todo proyecto del Marco Lógico debe tener al menos diez Objetivos Específicos distintos y carecer de indicadores cuantificables.',
      'C) En el Árbol de Problemas previo a la matriz, las raíces inferiores representan los efectos o consecuencias finales y la copa superior representa las causas primarias.',
      'D) Las hipótesis o factores externos que tienen un 100 % de probabilidad de ocurrir de forma negativa o un 0 % de relevancia deben incluirse obligatoriamente en la cuarta columna.',
    ],
    correctIndex: 0,
    explanation:
      'En el Enfoque del Marco Lógico (NORAD / CIDEAL - Camacho, Cámara, Cascante y Sainz): en el Árbol de Problemas el tronco es el problema focal, las raíces son las causas y las ramas/copa son los efectos; al pasarlo a Árbol de Objetivos los medios pasan a ser fines; y la regla de oro de la Matriz (MPP) es formular UN SOLO Objetivo Específico por proyecto para garantizar unidad de dirección y evaluación.',
  },
  {
    id: 'q-hd-100',
    topicId: 'E58',
    difficulty:
      'Alta (Tríada de Calidad de Avedis Donabedian y Eficacia/Eficiencia)',
    originType: '🏥 OFICIAL SERMAS / AYTO / CAM · CALIDAD Y EVALUACIÓN',
    question:
      'De acuerdo con el modelo clásico de evaluación de la calidad asistencial y de servicios sociales de Avedis Donabedian (1966) y los criterios de evaluación de políticas públicas, señale la afirmación CORRECTA:',
    options: [
      'A) Avedis Donabedian articula la evaluación de la calidad en tres dimensiones: 1) Estructura (recursos materiales, instalaciones, dotación y cualificación de personal y organización), 2) Proceso (conjunto de actuaciones profesionales, aplicación de protocolos y relación técnica con el usuario) y 3) Resultado (cambios producidos en el estado de salud o bienestar social y satisfacción del usuario); diferenciándose la "eficacia" (logro de objetivos en condiciones ideales o de referencia), la "efectividad" (logro de objetivos en las condiciones reales de aplicación) y la "eficiencia" (relación entre los resultados obtenidos y el coste o recursos empleados).',
      'B) En Donabedian, la "Eficiencia" consiste en alcanzar los objetivos al máximo coste posible sin tener en cuenta los recursos presupuestarios.',
      'C) La evaluación "ex ante" (o a priori) es la que se realiza cinco años después de haber finalizado el proyecto para medir el impacto duradero.',
      'D) Los indicadores de estructura miden exclusivamente el grado de satisfacción emocional de las familias al finalizar la intervención.',
    ],
    correctIndex: 0,
    explanation:
      'Pregunta fija en SERMAS (Tema 17), Ayuntamiento (Tema 44 y 51) y CAM (Tema E58 y E67): tríada de Donabedian (Estructura, Proceso y Resultado) y distinción conceptual entre Eficacia (logro de metas/condiciones ideales), Efectividad (impacto real en la práctica) y Eficiencia (máximo resultado con el mínimo coste de recursos, o mínimo coste para un resultado dado).',
  },
  {
    id: 'q-hd-101',
    topicId: 'E57',
    difficulty:
      'Alta (Tipología de Necesidades Sociales de Jonathan Bradshaw 1972)',
    originType: '🏢 OFICIAL AYTO / SERMAS / CAM · NECESIDADES SOCIALES',
    question:
      'En el estudio y detección de las necesidades sociales para el diseño de políticas públicas ("Taxonomy of Social Need", 1972), Jonathan Bradshaw clasifica las necesidades en cuatro grandes categorías operativas. Señale cuál de las siguientes definiciones es CORRECTA:',
    options: [
      'A) 1) Necesidad normativa: la que definen las personas expertas, profesionales o administraciones respecto a un estándar o norma óptima; 2) Necesidad sentida (o percibida): la percepción subjetiva de carencia que tienen las personas (lo que desean o sienten necesitar, aunque aún no lo hayan solicitado); 3) Necesidad expresada (o demandada): la necesidad sentida que se transforma en acción o demanda efectiva ante un servicio (por ejemplo, solicitudes registradas o listas de espera); y 4) Necesidad comparativa: la que se deduce al observar que un grupo o territorio con características similares a otro no recibe los servicios que sí recibe el primero.',
      'B) En Bradshaw, la necesidad normativa es la que expresa espontáneamente el ciudadano en una manifestación callejera, y la necesidad expresada es el estándar fijado por la OMS.',
      'C) Jonathan Bradshaw postula la pirámide jerárquica de cinco escalones (fisiológicas, seguridad, afiliación, estima y autorrealización) formulada en 1943.',
      'D) Según Doyal y Gough ("Teoría de las necesidades humanas", 1991), las necesidades humanas son absolutamente relativas culturalmente, negando que la salud física y la autonomía sean necesidades básicas universales.',
    ],
    correctIndex: 0,
    explanation:
      'Contraste clásico de teorías de necesidades: 1) Bradshaw (1972): Normativa (expertos), Sentida (percepción subjetiva), Expresada (demanda efectiva/lista de espera) y Comparativa (agravio entre grupos/territorios); 2) Maslow (1943): pirámide de 5 niveles; 3) Max-Neef (Desarrollo a Escala Humana): matriz de necesidades axiológicas (Ser, Tener, Hacer, Estar) y existenciales (Subsistencia, Protección, Afecto, Entendimiento, Participación, Ocio, Creación, Identidad y Libertad), diferenciando necesidades (finitas y universales) de satisfactores (culturales e históricos); y 4) Doyal y Gough (1991): dos necesidades básicas universales objetivas (Salud física y Autonomía personal/crítica) y 11 necesidades intermedias.',
  },
  {
    id: 'q-hd-102',
    topicId: 'E57',
    difficulty:
      'Alta (Investigación Cualitativa vs. Cuantitativa y Triangulación)',
    originType: '🏢 OFICIAL AYTO (TEMAS 45-48) / CAM / SERMAS',
    question:
      'En metodología de la investigación social aplicada al Trabajo Social, en relación con las técnicas cualitativas ("Grupo de Discusión", "Grupo Focal", "Entrevista en profundidad", "Observación participante") y las estrategias de "Triangulación" sistematizadas por Norman K. Denzin (1970), señale la afirmación CORRECTA:',
    options: [
      'A) El Grupo de Discusión (desarrollado en la Escuela Cualitativista de Madrid por Jesús Ibáñez y Alfonso Ortí) busca reproducir el discurso ideológico social espontáneo mediante una conducción no directiva (normalmente entre 5 y 10 participantes desconocidos entre sí pero con homogeneidad estructural e heterogeneidad discursiva), mientras que el Focus Group anglosajón (Merton) es más directivo y focalizado en un tema o test concreto; por su parte, Denzin distingue cuatro tipos de triangulación: de datos, de investigadores, teórica y metodológica (intramétodo e intermétodo).',
      'B) En el Grupo de Discusión es requisito obligatorio que todos los participantes sean familiares directos o amigos íntimos previos para que exista consenso inmediato.',
      'C) El muestreo en la investigación cualitativa es siempre probabilístico aleatorio estratificado con cálculo de error muestral del 95,5 %.',
      'D) En estadística descriptiva, la "mediana" es el valor que más veces se repite en una distribución (frecuencia absoluta máxima) y la "moda" es la media aritmética ponderada.',
    ],
    correctIndex: 0,
    explanation:
      'Temas 45 a 48 del Ayuntamiento y E57 de la CAM: en el Grupo de Discusión (Jesús Ibáñez, "Más allá de la sociología", 1979) los participantes NO deben conocerse previamente entre sí; el muestreo cualitativo es estructural/intencional (por saturación teórica de Glaser y Strauss); Denzin (1970) clasifica las 4 triangulaciones (datos, investigadores, teórica y metodológica); y en estadística la Mediana divide la distribución ordenada en el 50% (percentil 50), la Moda es el valor más frecuente y la Media es el promedio aritmético.',
  },
  {
    id: 'q-hd-103',
    topicId: 'E1',
    difficulty: 'Alta (Indicador AROPE de Pobreza y Exclusión Social UE 2030)',
    originType: '🏛️ OFICIAL CAM (TEMA E1) / AYTO / SERMAS',
    question:
      'Conforme a la metodología revisada de la Estrategia Europa 2030 (aplicada por Eurostat y el INE en la Encuesta de Condiciones de Vida), la tasa AROPE ("At Risk Of Poverty or Social Exclusion") mide la población que se encuentra en alguna de las tres situaciones siguientes:',
    options: [
      'A) 1) Riesgo de pobreza relativa (ingresos por unidad de consumo inferiores al 60 % de la mediana de los ingresos nacionales equivalentes tras transferencias sociales); 2) Carencia material y social severa (no poder permitirse al menos 7 de los 13 ítems de consumo y vida social establecidos a nivel europeo); o 3) Baja intensidad en el empleo (hogares en los que sus miembros en edad de trabajar, de 18 a 64 años excluidos estudiantes, lo hicieron menos del 20 % de su potencial total de trabajo en el año de referencia).',
      'B) Se calcula tomando el 40 % de la media aritmética del Producto Interior Bruto (PIB) y exigiendo carecer de al menos 4 de 9 ítems materiales.',
      'C) Solo incluye a las personas que carecen de empadronamiento municipal y perciben simultáneamente una pensión contributiva máxima.',
      'D) Mide exclusivamente el índice de Gini multiplicado por la tasa de mortalidad infantil.',
    ],
    correctIndex: 0,
    explanation:
      'Pregunta de actualización técnica del Tema E1 de la CAM: en la nueva definición AROPE 2030, los 3 subindicadores son: 1) Umbral del 60% de la MEDIANA (nunca la media) de ingresos por unidad de consumo (escala OCDE modificada: 1 adulto = 1; resto >=14 años = 0,5; <14 años = 0,3); 2) Carencia material y social severa: al menos 7 de 13 ítems (antes en Europa 2020 eran 4 de 9 ítems); y 3) Baja intensidad de empleo: <20% del potencial laboral en personas de 18 a 64 años (antes era de 18 a 59 años).',
  },

  // =========================================================================
  // BLOQUE XVIII: INSTRUMENTOS ESPECÍFICOS DEL TRABAJO SOCIAL (104-110)
  // =========================================================================
  {
    id: 'q-hd-104',
    topicId: 'E59',
    difficulty:
      'Alta (Los Documentos Básicos del Trabajo Social: Ficha, Historia e Informe)',
    originType: '🏛️ OFICIAL CAM / SERMAS / AYTO · INSTRUMENTOS TS',
    question:
      'En relación con los instrumentos específicos de registro y diagnóstico del Trabajo Social (Ficha Social, Historia Social, Informe Social, Proyecto de Intervención Social y Escalas), señale cuál de las siguientes definiciones es CORRECTA:',
    options: [
      'A) La Ficha Social es el soporte documental básico de primer nivel que recoge de forma codificada y sistematizada los datos cuantificables sociodemográficos y de la demanda inicial (alimentando la estadística SIUSS); la Historia Social es el expediente matriz que recoge de forma cronológica, longitudinal y exhaustiva toda la evolución, diagnósticos e intervenciones del caso; y el Informe Social es el dictamen técnico que sirve de instrumento documental para comunicar a otros profesionales, órganos administrativos o judiciales la situación objeto de valoración, el diagnóstico social y la propuesta técnica.',
      'B) El Informe Social es un documento de uso estrictamente privado y personal del Trabajador Social que nunca puede ser remitido a un juez ni a otra institución.',
      'C) La Ficha Social solo puede abrirse cuando el expediente lleva más de tres años en Atención Social Especializada.',
      'D) La Historia Social y el Informe Social son documentos idénticos que contienen únicamente los datos bancarios del usuario sin valoración diagnóstica.',
    ],
    correctIndex: 0,
    explanation:
      'Diferenciación canónica del Consejo General del Trabajo Social y Montserrat Colomer: Ficha Social (registro homogéneo codificado de datos básicos y demandas para planificación/SIUSS), Historia Social (documento base longitudinal de todo el proceso metodológico), Registro de entrevistas/Hojas de seguimiento (evolución secuencial) e Informe Social (síntesis explicativa y dictamen técnico-profesional con juicio diagnóstico y propuesta).',
  },
  {
    id: 'q-hd-105',
    topicId: 'E59',
    difficulty:
      'Alta (Genograma de McGoldrick y Gerson vs. Ecomapa de Hartman)',
    originType: '🏥 OFICIAL SERMAS / CAM / AYTO · GENOGRAMA Y ECOMAPA',
    question:
      'Compare los instrumentos gráficos de representación diagnóstica "Genograma" (sistematizado por Monica McGoldrick y Randy Gerson, 1985) y "Ecomapa" (creado por Ann Hartman, 1978) y señale la opción CORRECTA:',
    options: [
      'A) El Genograma representa gráficamente la estructura familiar interna, la adaptación al ciclo vital y las pautas relacionales a lo largo de al menos tres generaciones (representándose los hombres con un cuadrado a la izquierda, las mujeres con un círculo a la derecha, la persona índice con doble línea y el hogar conviviente rodeado con una línea discontinua); por su parte, el Ecomapa dibuja a la familia nuclear en un gran círculo central rodeado de círculos externos que representan los sistemas del entorno (trabajo, escuela, salud, servicios sociales, ocio), uniendo ambos con líneas que indican la naturaleza, fuerza y dirección del flujo de energía o estrés.',
      'B) En el Genograma estándar de McGoldrick y Gerson, los hombres se representan con un círculo a la derecha y las mujeres con un triángulo a la izquierda, bastando con reflejar una sola generación.',
      'C) El Ecomapa fue diseñado por Sigmund Freud para medir el cociente intelectual de los menores escolarizados.',
      'D) En el Genograma, una línea recta continua doble entre dos personas indica conflicto violento grave y ruptura de la relación.',
    ],
    correctIndex: 0,
    explanation:
      'Simbología estándar de McGoldrick y Gerson ("Genogramas en la evaluación familiar", 1985): mínimo 3 generaciones; hombre = cuadrado (izquierda en la pareja), mujer = círculo (derecha); persona índice/identificada = doble cuadrado o doble círculo; embarazo = triángulo; fallecimiento = X interior; convivencia actual = línea punteada/discontinua envolviendo a quienes viven juntos; líneas de relación: dos líneas paralelas (unión estrecha), tres líneas (fusión), línea quebrada en zigzag (conflicto/hostilidad), línea cortada con dos barras (ruptura/distanciamiento). Ecomapa (Ann Hartman, 1978): mapa ecológico de conexiones suprasistémicas de la familia con su entorno.',
  },
  {
    id: 'q-hd-106',
    topicId: 'E59',
    difficulty:
      'Alta (La Entrevista en Trabajo Social: Teresa Rossell y Kadushin)',
    originType: '🏛️ OFICIAL CAM / SERMAS / AYTO · LA ENTREVISTA',
    question:
      'Conforme a la obra de referencia de Teresa Rossell ("La entrevista en el Trabajo Social") y Alfred Kadushin, la entrevista en el Trabajo Social no es un mero cuestionario mecánico sino una relación interpersonal técnica que se estructura metodológicamente en las siguientes fases:',
    options: [
      'A) 1) Fase inicial o de recepción y acogida (reducción de la ansiedad inicial, encuadre y explicitación de expectativas); 2) Fase de exploración e indagación (escucha activa, clarificación y expresión del problema por la persona usuaria); 3) Fase de intercambio o concreción (delimitación conjunta de objetivos, acuerdos y tareas); y 4) Fase final o de despedida y cierre (síntesis de lo tratado, concertación de próxima cita y registro posterior de la entrevista, evitando introducir temas nucleares nuevos en el último minuto, salvo el fenómeno de "la mano en el pomo de la puerta").',
      'B) Una única fase de interrogatorio policial directivo donde el profesional toma notas taquigráficas literales sin establecer contacto visual con el usuario.',
      'C) En la entrevista de Trabajo Social está prohibido utilizar silencios instrumentales, reformulaciones o preguntas abiertas.',
      'D) Según Teresa Rossell, la transferencia y la contratransferencia son fenómenos exclusivos de la psiquiatría hospitalaria que nunca ocurren en la relación de ayuda social.',
    ],
    correctIndex: 0,
    explanation:
      'Teresa Rossell destaca en "La entrevista en el Trabajo Social" la doble dimensión (técnica de obtención/intercambio de información y espacio de relación de ayuda), los conceptos psicodinámicos aplicados (transferencia, contratransferencia, contención, ansiedad de separación), las 4 fases de desarrollo y la recomendación técnica de realizar el registro escrito inmediatamente después de finalizar la entrevista para no interferir en la comunicación no verbal y la escucha activa.',
  },
  {
    id: 'q-hd-107',
    topicId: 'E59',
    difficulty:
      'Alta (Escala de Valoración Sociofamiliar de Gijón: Dimensiones y Puntos)',
    originType: '🏥 OFICIAL SERMAS / CAM / AYTO · ESCALA DE GIJÓN',
    question:
      '¡Pregunta técnica de escalas! La "Escala de Valoración Sociofamiliar de Gijón" (original de Díaz Palacios et al., 1993, de 5 dimensiones con 5 ítems cada una puntuados de 1 a 5), utilizada de forma estandarizada en Atención Primaria del SERMAS y en Servicios Sociales para detectar riesgo social en personas mayores, evalúa exactamente las siguientes cinco áreas y establece los siguientes puntos de corte:',
    options: [
      'A) Evalúa: 1) Situación familiar, 2) Situación económica, 3) Vivienda, 4) Relaciones sociales y 5) Apoyos de la red social; la puntuación oscila entre un mínimo de 5 y un máximo de 25 puntos, considerándose de 5 a 9 puntos situación social buena o aceptable, de 10 a 14 puntos existencia de riesgo social, y de 15 o más puntos (15 a 25) existencia de problema social establecido.',
      'B) Evalúa: 1) Alimentación, 2) Vestido, 3) Continencia de esfínteres, 4) Deambulación y 5) Subir escaleras, con una puntuación de 0 a 100 puntos.',
      'C) Evalúa únicamente la sobrecarga emocional del cuidador principal a través de 22 preguntas tipo Likert puntuadas de 0 a 88.',
      'D) Evalúa el deterioro cognitivo mediante 10 preguntas sobre orientación temporal y cálculo matemático.',
    ],
    correctIndex: 0,
    explanation:
      'En la Escala de Gijón clásica (25 puntos máx.): 5 dimensiones (Situación familiar, Situación económica, Vivienda, Relaciones sociales y Apoyos de la red social), puntuadas de 1 a 5 cada una. Puntos de corte: 5-9 normal/bajo riesgo; 10-14 riesgo social; >=15 problema social (existe también la versión abreviada de Barcelona/Miralles de 3 ítems: situación familiar, económica y vivienda, con punto de corte >7).',
  },
  {
    id: 'q-hd-108',
    topicId: 'S-42',
    difficulty: 'Alta (Escala de Sobrecarga del Cuidador de Zarit)',
    originType: '🏥 OFICIAL SERMAS / CAM · ESCALA DE ZARIT',
    question:
      'En la valoración de cuidadores no profesionales de personas en situación de dependencia o demencia (Tema 42 del SERMAS y E25/E49 de la CAM), el cuestionario validado de "Sobrecarga del Cuidador de Zarit" (versión española de Martín et al., 1996, de 22 ítems con respuesta tipo Likert de 1 "nunca" a 5 "casi siempre", o de 0 a 4 según codificación) presenta los siguientes puntos de corte en su escala original de 22 a 110 puntos:',
    options: [
      'A) Una puntuación de 22 a 46 puntos indica "ausencia de sobrecarga", de 47 a 55 puntos indica "sobrecarga leve" (riesgo de claudicación), y una puntuación de 56 o más puntos (56 a 110) indica "sobrecarga intensa" del cuidador.',
      'B) Consta de 8 ítems dicotómicos (0 o 1 punto) que miden si el cuidador sabe usar el teléfono, hacer la compra y lavar la ropa.',
      'C) Una puntuación inferior a 20 puntos indica sobrecarga extrema e ingreso hospitalario psiquiátrico inmediato del cuidador.',
      'D) Es una escala pediátrica exclusiva para medir el desarrollo psicomotor de recién nacidos de 0 a 6 meses.',
    ],
    correctIndex: 0,
    explanation:
      'La Escala de Zarit consta de 22 ítems que valoran la repercusión física, psíquica, social y económica del cuidado sobre el cuidador principal: en la puntuación 1-5 (rango 22 a 110), <=46 es no sobrecarga, 47-55 sobrecarga leve y >=56 sobrecarga intensa (en la codificación 0-4 de rango 0 a 88, los cortes equivalentes son <=24, 25-33 y >=34). Existe además el Zarit abreviado (7 ítems, punto de corte >=17).',
  },
  {
    id: 'q-hd-109',
    topicId: 'S-39',
    difficulty:
      'Alta (Contraste Escalas Funcionales y Cognitivas: Barthel, Lawton, Pfeiffer)',
    originType: '🏥 OFICIAL SERMAS / CAM / AYTO · VALORACIÓN GERIÁTRICA',
    question:
      'En la Valoración Geriátrica Integral (VGI) y sociosanitaria, relacione correctamente el Índice de Barthel, la Escala de Lawton y Brody, el Cuestionario de Pfeiffer (SPMSQ) y la Escala de Apgar Familiar de Smilkstein:',
    options: [
      'A) El Índice de Barthel valora las Actividades Básicas de la Vida Diaria (ABVD, 10 ítems, de 0 dependencia total a 100 independencia); la Escala de Lawton y Brody valora las Actividades Instrumentales de la Vida Diaria (AIVD, 8 ítems, de 0 máxima dependencia a 8 independencia total); el Cuestionario de Pfeiffer realiza el cribado de deterioro cognitivo (10 preguntas donde se contabilizan los errores: 0-2 normal, 3-4 leve, 5-7 moderado y 8-10 importante, permitiendo un error más si tiene estudios elementales y uno menos si tiene estudios superiores); y el Apgar Familiar de Smilkstein valora la percepción de funcionalidad familiar en 5 áreas (Adaptabilidad, Participación, Gradiente de crecimiento, Afecto y Resolución).',
      'B) En el Índice de Barthel una puntuación de 100 puntos significa dependencia absoluta (encamado total) y 0 puntos significa independencia completa.',
      'C) En el Cuestionario de Pfeiffer se suman los aciertos sobre 100 puntos y la Escala de Lawton y Brody mide exclusivamente la continencia urinaria y fecal.',
      'D) La Escala de Norton y la Escala de Braden se utilizan para medir los ingresos económicos per cápita de la unidad familiar.',
    ],
    correctIndex: 0,
    explanation:
      'Resumen de escalas imprescindibles en SERMAS y CAM: 1) Barthel (ABVD: 0-100; <20 total, 20-35 grave, 40-55 moderada, >=60 leve, 100 independiente; 90 si usa silla de ruedas); 2) Katz (ABVD: letras A independiente a G dependiente en las 6 funciones); 3) Lawton y Brody (AIVD: 0 a 8 puntos); 4) Pfeiffer (cognitivo: 10 ítems contando ERRORES); 5) MEC de Lobo (cognitivo: 30 o 35 puntos contando ACIERTOS); 6) Norton/Braden (riesgo de úlceras por presión); 7) Tinetti (marcha y equilibrio/riesgo de caídas); 8) Yesavage (depresión geriátrica); 9) Apgar Familiar de Smilkstein (disfunción familiar, 5 ítems) y 10) Duke-UNC (apoyo social percibido: confidencial y afectivo, 11 ítems).',
  },
  {
    id: 'q-hd-110',
    topicId: 'E59',
    difficulty: 'Alta (La Visita Domiciliaria en Trabajo Social)',
    originType: '🏛️ OFICIAL CAM / SERMAS / AYTO · VISITA DOMICILIARIA',
    question:
      'En relación con la técnica de la "Visita Domiciliaria" en el Trabajo Social (utilizada tanto en Atención Social Primaria como en valoración de Dependencia, Atención Primaria de Salud y protección de menores), señale la afirmación CORRECTA:',
    options: [
      'A) Combina las técnicas de la entrevista y de la observación en el medio natural de convivencia de la persona o familia, permitiendo contrastar la información verbal con las condiciones reales de habitabilidad, barreras arquitectónicas e interacciones relacionales; exige planificación previa de objetivos y, por regla general y respeto a la inviolabilidad del domicilio (art. 18.2 CE), contar con el consentimiento y concertación previa con la persona usuaria.',
      'B) Los profesionales de Trabajo Social ostentan la condición de agentes de la autoridad judicial para entrar por la fuerza en cualquier domicilio particular sin consentimiento del titular ni autorización judicial.',
      'C) Ha sido suprimida del procedimiento de valoración de la dependencia del Decreto 54/2015 de la Comunidad de Madrid.',
      'D) Carece de fases metodológicas y prohíbe observar el estado de conservación e higiene de la vivienda.',
    ],
    correctIndex: 0,
    explanation:
      'La visita domiciliaria (pionera desde las friendly visitors de Mary Richmond y eje del Decreto 54/2015 de dependencia y de la intervención comunitaria/sanitaria) une entrevista + observación participante en el contexto natural, sujetándose siempre al respeto a la intimidad e inviolabilidad del domicilio (art. 18 CE).',
  },

  // =========================================================================
  // BLOQUE XIX: CÓDIGO DEONTOLÓGICO, BIOÉTICA, SECRETO Y BURNOUT (111-116)
  // =========================================================================
  {
    id: 'q-hd-111',
    topicId: 'E60',
    difficulty:
      'Alta (Código Deontológico del Trabajo Social 2012: Estructura y Principios)',
    originType: '🏛️ OFICIAL CAM / SERMAS / AYTO · CÓDIGO DEONTOLÓGICO',
    question:
      'De conformidad con el vigente Código Deontológico de Trabajo Social aprobado por la Asamblea General del Consejo General del Trabajo Social el 9 de junio de 2012 (entrada en vigor el 29 de junio de 2012), señale cuáles son los tres "Principios Básicos" que emanan de la Declaración Internacional de Principios Éticos de la FITS y en los que se sustentan los principios generales del Capítulo II:',
    options: [
      'A) La Dignidad (la persona humana, única e inviolable, tiene valor en sí misma con intereses y derechos), la Libertad (la persona, en posesión de sus facultades humanas, es capaz de tomar decisiones relativas a su propio bienestar) y la Igualdad (cada persona posee los mismos derechos y deberes compatibles con sus peculiaridades y diferencias).',
      'B) La Beneficencia paternalista, la Obediencia jerárquica incondicional y la Rentabilidad económica privada.',
      'C) El Código Deontológico de 2012 carece de principios básicos y consta únicamente de diez artículos sobre tarifas colegiales.',
      'D) La Neutralidad pasiva, la Publicidad de los expedientes clínicos y la Subordinación judicial.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 7 del Código Deontológico del Trabajo Social (2012, estructurado en Preámbulo, 6 Capítulos, 57 artículos y 1 Disposición Final): los 3 Principios Básicos son Dignidad, Libertad e Igualdad, de los cuales se derivan los principios generales (respeto a los derechos humanos, autodeterminación, justicia social, integridad profesional, confidencialidad, etc.).',
  },
  {
    id: 'q-hd-112',
    topicId: 'E60',
    difficulty:
      'Alta (Excepciones al Secreto Profesional Art. 53 Código Deontológico)',
    originType: '🏛️ OFICIAL CAM / SERMAS / AYTO · SECRETO PROFESIONAL',
    question:
      'Según el Capítulo V ("La confidencialidad y secreto profesional", artículos 48 a 54) del Código Deontológico de Trabajo Social de 2012, el deber de secreto profesional no tiene límite temporal y permanece incluso después de haber cesado la intervención o tras el fallecimiento de la persona usuaria; no obstante, conforme al artículo 53, ¿en qué supuestos tasados se exime al profesional de Trabajo Social del secreto profesional?',
    options: [
      'A) Entre otros supuestos tasados: cuando fuera relevado del secreto por la propia persona usuaria o sus herederos (por escrito); cuando exista riesgo grave e inminente para la propia persona usuaria, para el profesional o para terceras personas; para evitar una grave vulneración de los derechos fundamentales de una persona (especialmente menores o personas vulnerables); por requerimiento judicial o legal expreso; o cuando el profesional fuera denunciado por la persona usuaria por comisión de delito o falta deontológica y sea estrictamente necesario para su defensa.',
      'B) Únicamente cuando lo solicite verbalmente un medio de comunicación o un concejal de la oposición municipal.',
      'C) El secreto profesional se extingue automáticamente a los seis meses de cerrarse el expediente en SIUSS o cuando fallece el usuario.',
      'D) En ningún caso puede romperse el secreto profesional, ni siquiera ante el riesgo inminente de homicidio o maltrato infantil grave.',
    ],
    correctIndex: 0,
    explanation:
      'Arts. 49, 50 y 53 del Código Deontológico de 2012: el secreto profesional es un derecho de la persona usuaria y un deber moral y jurídico del profesional (tipificado además en el art. 199 del Código Penal); no se extingue por cese ni por muerte del usuario (art. 50), pero cede ante los supuestos tasados del art. 53 bajo los principios de calidad, prioridad e interés superior.',
  },
  {
    id: 'q-hd-113',
    topicId: 'E12',
    difficulty:
      'Alta (Los 4 Principios de la Bioética de Beauchamp y Childress y Diego Gracia)',
    originType: '🏥 OFICIAL SERMAS / CAM · BIOÉTICA Y ÉTICA APLICADA',
    question:
      'En la resolución de dilemas bioéticos y sociosanitarios en los Comités de Ética Asistencial y de Servicios Sociales, combinando el modelo principialista de Tom L. Beauchamp y James F. Childress ("Principles of Biomedical Ethics", 1979) con la jerarquización ética en dos niveles de Diego Gracia Guillén, señale la opción CORRECTA:',
    options: [
      'A) Los cuatro principios bioéticos son No maleficencia, Justicia, Autonomía y Beneficencia; según la jerarquización de Diego Gracia, el "Nivel 1" (ética de mínimos, exigible pública y jurídicamente a todos por igual) está integrado por los principios de No maleficencia y de Justicia, mientras que el "Nivel 2" (ética de máximos, vinculada al proyecto vital y sistema de valores de cada persona) está integrado por los principios de Autonomía y de Beneficencia, prevaleciendo en caso de conflicto el Nivel 1 sobre el Nivel 2.',
      'B) Según Diego Gracia, el principio de Beneficencia paternalista del profesional prevalece siempre por encima del principio de No maleficencia y de la Autonomía del paciente.',
      'C) Los siete principios de la relación de ayuda formulados por Félix Biestek en 1957 son idénticos a los cuatro principios de Beauchamp y Childress.',
      'D) La confidencialidad, la privacidad y la fidelidad a las promesas no guardan ninguna relación con las reglas derivadas de la bioética.',
    ],
    correctIndex: 0,
    explanation:
      'Pregunta de altísimo nivel para SERMAS y CAM (Temas E12, E60 y S-12): Beauchamp y Childress formularon los 4 principios prima facie (Autonomía, Beneficencia, No maleficencia y Justicia) más 4 reglas derivadas (Veracidad, Privacidad, Confidencialidad y Fidelidad). Diego Gracia los jerarquizó en dos niveles: Nivel 1 de Mínimos/Deberes perfectos/Públicos (No maleficencia y Justicia) y Nivel 2 de Máximos/Privados (Autonomía y Beneficencia). Por su parte, Félix Biestek (1957) formuló los 7 principios clásicos del Casework: Individualización, Expresión intencionada de sentimientos, Participación emocional controlada, Aceptación, Actitud no enjuiciadora, Autodeterminación del cliente y Confidencialidad.',
  },
  {
    id: 'q-hd-114',
    topicId: 'E61',
    difficulty:
      'Alta (Trabajo Interdisciplinar, Multidisciplinar y Transdisciplinar)',
    originType: '🏥 OFICIAL SERMAS (TEMA 16) / CAM (E61) / AYTO',
    question:
      'En la teoría del trabajo en equipo en Servicios Sociales y Salud, diferencie con precisión conceptual entre equipo "multidisciplinar" (o pluridisciplinar), equipo "interdisciplinar" y equipo "transdisciplinar":',
    options: [
      'A) En el equipo multidisciplinar coexisten profesionales de distintas disciplinas que trabajan de forma paralela o yuxtapuesta sobre un mismo caso sin integrar sus marcos metodológicos; en el equipo interdisciplinar existe interacción, reciprocidad, intercambio horizontal e integración metodológica para construir un diagnóstico y plan de intervención común manteniendo cada profesión su especificidad; y en el equipo transdisciplinar se trascienden las fronteras disciplinares construyendo un marco conceptual y de roles compartido superior.',
      'B) En el equipo interdisciplinar el Trabajador Social pierde sus competencias propias y pasa a realizar exclusivamente funciones de enfermería clínica.',
      'C) El trabajo en red consiste en derivar masivamente el expediente a otra administración desentendiéndose por completo del seguimiento del usuario.',
      'D) La supervisión profesional en Trabajo Social tiene una finalidad exclusivamente inspectora y sancionadora disciplinaria.',
    ],
    correctIndex: 0,
    explanation:
      'Distinción clave en el Tema 16 del SERMAS y E61 de la CAM. Asimismo, recuerda que la Supervisión en Trabajo Social (Alfred Kadushin y Carmina Puig Cruells) cumple tres funciones esenciales: 1) Función educativa/formativa (capacitación técnica), 2) Función administrativa/de gestión (calidad del servicio) y 3) Función de apoyo/expresiva (contención emocional y prevención del burnout).',
  },
  {
    id: 'q-hd-115',
    topicId: 'E61',
    difficulty: 'Alta (Síndrome de Burnout de Maslach y Jackson 1981)',
    originType: '🏥 OFICIAL SERMAS / CAM / AYTO · PREVENCIÓN DEL BURNOUT',
    question:
      'Según la conceptualización clásica de Christina Maslach y Susan E. Jackson (1981, evaluada mediante el cuestionario MBI - Maslach Burnout Inventory), el síndrome de desgaste profesional o "burnout" en profesionales de ayuda se caracteriza por la presencia simultánea de tres dimensiones específicas:',
    options: [
      'A) 1) Alto agotamiento o cansancio emocional (pérdida de recursos emocionales y sensación de no poder dar más de sí), 2) Alta despersonalización o cinismo (desarrollo de actitudes frías, distantes e insensibles hacia las personas usuarias) y 3) Baja realización personal en el trabajo (tendencia a evaluar negativamente el propio desempeño y sentimiento de incompetencia o ineficacia).',
      'B) 1) Alta realización personal, 2) Exceso de empatía afectiva y 3) Adicción al trabajo nocturno.',
      'C) Es un trastorno genético hereditario que aparece en el primer día de incorporación al puesto de trabajo sin relación con los factores organizacionales.',
      'D) En el MBI de Maslach, una puntuación muy elevada en la subescala de realización personal indica el grado más grave de burnout.',
    ],
    correctIndex: 0,
    explanation:
      'Trampa clásica en la pregunta del MBI de Maslach y Jackson (1981): el síndrome de Burnout cursa con puntuaciones ALTAS en las subescalas de Agotamiento Emocional y de Despersonalización, y puntuaciones BAJAS en la subescala de Realización Personal en el trabajo.',
  },
  {
    id: 'q-hd-116',
    topicId: 'E62',
    difficulty:
      'Alta (Axiomas de la Comunicación Humana de Watzlawick y Estilos de Thomas-Kilmann)',
    originType: '🏢 OFICIAL AYTO (TEMAS 28 Y 35) / CAM (E62) / SERMAS',
    question:
      'En relación con la "Teoría de la Comunicación Humana" de la Escuela de Palo Alto (Paul Watzlawick, Beavin y Jackson, 1967) y los cinco estilos de afrontamiento del conflicto del modelo de Thomas-Kilmann (combinación de asertividad/interés propio y cooperación/interés por el otro), señale la afirmación CORRECTA:',
    options: [
      'A) Los cinco axiomas de Watzlawick son: 1) Es imposible no comunicar, 2) Toda comunicación tiene un aspecto de contenido (referencial) y un aspecto relacional (conativo, clasificando el segundo al primero y siendo por tanto una metacomunicación), 3) La naturaleza de una relación depende de la puntuación de las secuencias de comunicación, 4) Los seres humanos se comunican tanto digital (verbal/sintaxis lógica) como analógicamente (no verbal/semántica relacional) y 5) Todos los intercambios comunicacionales son simétricos (basados en la igualdad) o complementarios (basados en la diferencia); y en Thomas-Kilmann el estilo que combina alta asertividad y alta cooperación es el "Colaborativo" (ganar-ganar).',
      'B) Según Watzlawick, cuando una persona permanece en silencio e inmóvil en una entrevista de Trabajo Social deja por completo de comunicar.',
      'C) En Watzlawick la comunicación digital es exclusivamente el lenguaje corporal de los gestos y la mirada, y la analógica es la escritura alfabética.',
      'D) En el modelo de Thomas-Kilmann, el estilo "Acomodativo o complaciente" se caracteriza por una altísima asertividad y nula cooperación.',
    ],
    correctIndex: 0,
    explanation:
      'Pregunta fija en el Ayuntamiento de Madrid (Temas 28, 29 y 35) y en la CAM (E62): los 5 axiomas de Paul Watzlawick (ojo a no confundir digital = palabra/código arbitrario con analógico = no verbal/gestual, ni contenido = digital con relación = analógico) y los 5 estilos de gestión del conflicto de Thomas-Kilmann: Competitivo (alta asertividad / baja cooperación), Complaciente o acomodativo (baja asertividad / alta cooperación), Evasivo (baja / baja), Comprometido o negociador (intermedia / intermedia) y Colaborativo (alta asertividad / alta cooperación: ganar-ganar).',
  },

  // =========================================================================
  // BLOQUE XX: GÉNERO, ACCESIBILIDAD, DIGITALIZACIÓN Y CALIDAD CAM (117-120)
  // =========================================================================
  {
    id: 'q-hd-117',
    topicId: 'E63',
    difficulty:
      'Alta (Interseccionalidad de Kimberlé Crenshaw y Mainstreaming de Género)',
    originType: '🏛️ OFICIAL CAM (E63) / AYTO (TEMA 77) / SERMAS',
    question:
      'En la aplicación de la perspectiva de género a la intervención social, ¿quién acuñó en 1989 el concepto de "Interseccionalidad" y qué implica metodológicamente junto con el principio de "transversalidad" (mainstreaming de género, consagrado en la IV Conferencia Mundial sobre la Mujer de Pekín de 1995 y en el artículo 15 de la LO 3/2007)?',
    options: [
      'A) El término "Interseccionalidad" fue acuñado por la jurista afroamericana Kimberlé Crenshaw (1989) para analizar cómo las distintas categorías sociales y ejes de desigualdad (género, raza/etnia, clase social, discapacidad, edad, orientación sexual o estatus migratorio) no se suman de forma aislada sino que interaccionan simultáneamente generando experiencias específicas de discriminación múltiple; mientras que el mainstreaming exige integrar la perspectiva de igualdad de género en todas las políticas, niveles y todas las fases (diseño, ejecución y evaluación) de la actuación administrativa.',
      'B) El concepto de interseccionalidad fue creado por Mary Richmond en 1917 para clasificar el tráfico viario urbano.',
      'C) La transversalidad de género implica que las políticas de igualdad competen única y exclusivamente al Ministerio de Igualdad, quedando exentas las áreas de urbanismo, hacienda o sanidad.',
      'D) Marcela Lagarde y Rita Segato niegan la existencia de desigualdades estructurales de género en las sociedades contemporáneas.',
    ],
    correctIndex: 0,
    explanation:
      'En el Tema E63 de la CAM y 77 del Ayuntamiento: Kimberlé Crenshaw acuñó en 1989 la "Interseccionalidad" (interacción de múltiples ejes de opresión/desigualdad); y el mainstreaming o transversalidad de género (Conferencia de Pekín 1995, Tratado de Ámsterdam 1997 y art. 15 LO 3/2007) obliga a todas las áreas de las AAPP en todas las fases de las políticas públicas.',
  },
  {
    id: 'q-hd-118',
    topicId: 'E64',
    difficulty:
      'Alta (Accesibilidad Universal, Diseño para Todos y Ajustes Razonables RDL 1/2013)',
    originType: '🏛️ OFICIAL CAM (E64) / AYTO (TEMA 87) · RDL 1/2013',
    question:
      'De conformidad con las definiciones legales del artículo 2 del Texto Refundido de la Ley General de derechos de las personas con discapacidad y de su inclusión social (Real Decreto Legislativo 1/2013, de 29 de noviembre), distinga entre "Diseño universal o diseño para todas las personas" y "Ajustes razonables":',
    options: [
      'A) El "Diseño universal" es la actividad por la que se conciben o proyectan desde el origen, y siempre que ello sea posible, entornos, procesos, bienes, productos, servicios, objetos, instrumentos, programas, dispositivos o herramientas, de tal forma que puedan ser utilizados por todas las personas en la mayor extensión posible sin necesidad de adaptación ni diseño especializado (sin excluir las ayudas técnicas para grupos particulares); mientras que los "Ajustes razonables" son las modificaciones y adaptaciones necesarias y adecuadas del ambiente físico, social y actitudinal a las necesidades específicas de las personas con discapacidad que no impongan una carga desproporcionada o indebida, cuando se requieran en un caso particular de manera eficaz y práctica para facilitar la accesibilidad en igualdad de condiciones.',
      'B) Los ajustes razonables deben realizarse desde el origen para toda la población general aunque nadie los solicite, y su denegación nunca constituye discriminación.',
      'C) El diseño universal prohíbe expresamente el uso de productos de apoyo o ayudas técnicas individuales como lectores de pantalla o audífonos.',
      'D) Los principios del Diseño Universal formulados por Ronald L. Mace son únicamente dos: el coste elevado y la exclusividad arquitectónica.',
    ],
    correctIndex: 0,
    explanation:
      'Art. 2 letras k), l) y m) del RDL 1/2013 (y 7 Principios del Diseño Universal de Ronald L. Mace: 1. Uso equiparable, 2. Uso flexible, 3. Uso simple e intuitivo, 4. Información perceptible, 5. Tolerancia al error, 6. Que exija poco esfuerzo físico y 7. Tamaño y espacio para el acceso y uso). Además, recuerda que conforme al art. 2.c) y d) del RDL 1/2013, el incumplimiento de la obligación de realizar ajustes razonables constituye discriminación por motivos de discapacidad.',
  },
  {
    id: 'q-hd-119',
    topicId: 'E66',
    difficulty:
      'Alta (Metodologías Participativas: IAP, Salutogénesis y Mapeo de Activos)',
    originType: '🏥 OFICIAL SERMAS / CAM (E66) / AYTO · COMUNIDAD Y ACTIVOS',
    question:
      'En relación con las metodologías participativas y el enfoque comunitario en salud y bienestar social (Tema E66 de la CAM y Temas 21 y 27 del SERMAS), señale cuál de las siguientes relaciones de autores y conceptos es CORRECTA:',
    options: [
      'A) El modelo de "Salutogénesis" fue formulado por Aaron Antonovsky (centrado en los factores que generan salud, los Recursos Generales de Resistencia y el "Sentido de Coherencia": comprensibilidad, manejabilidad y significatividad); el modelo de "Activos para la Salud" (Asset Model) y "Mapeo de Activos" fue desarrollado por Antony Morgan y Erio Ziglio (2007) junto con el desarrollo comunitario basado en activos (ABCD) de Kretzmann y McKnight; y en la "Escalera de la Participación Ciudadana" de Sherry Arnstein (1969), los peldaños inferiores (manipulación y terapia) corresponden a la "no participación", los intermedios (información, consulta y apaciguamiento) al "simbolismo o tokenismo" y los superiores (asociación, poder delegado y control ciudadano) al "poder ciudadano".',
      'B) El modelo de Salutogénesis de Aaron Antonovsky se centra exclusivamente en el déficit patogénico y en la prescripción farmacológica hospitalaria.',
      'C) En la Escalera de la Participación de Sherry Arnstein (1969), la "Manipulación" es el grado máximo de empoderamiento y autogestión vecinal.',
      'D) La Investigación-Acción Participativa (IAP, Kurt Lewin, Orlando Fals Borda y Paulo Freire) exige que la comunidad sea tratada como un objeto pasivo sin acceso a los resultados del estudio.',
    ],
    correctIndex: 0,
    explanation:
      'Pregunta de oro para el Tema E66 de la CAM y los temas de comunitaria del SERMAS y Ayuntamiento: 1) Aaron Antonovsky (Salutogénesis: Sentido de Coherencia SOC y Recursos Generales de Resistencia); 2) Morgan y Ziglio (Modelo de Activos en Salud, 2007) y Kretzmann y McKnight (ABCD - Asset-Based Community Development); 3) Sherry Arnstein (1969, Escalera de la participación de 8 peldaños en 3 bloques: No participación, Tokenismo/Simbolismo y Poder ciudadano); y 4) IAP (Lewin, Fals Borda, Freire, Villasante con los sociogramas y conjuntos de acción).',
  },
  {
    id: 'q-hd-120',
    topicId: 'E67',
    difficulty:
      'Alta (Cartas de Servicios en la Comunidad de Madrid: Decreto 27/1997)',
    originType: '🏛️ OFICIAL BOCM · DECRETO 27/1997 CARTAS DE SERVICIOS CAM',
    question:
      'De conformidad con el Decreto 27/1997, de 6 de marzo, del Consejo de Gobierno, por el que se regulan las Cartas de Servicios y los Premios Anuales a la Excelencia y Calidad del Servicio Público en la Comunidad de Madrid, señale la afirmación CORRECTA respecto a su naturaleza jurídica, aprobación y actualización:',
    options: [
      'A) Las Cartas de Servicios son documentos escritos a través de los cuales los órganos, organismos y entidades de la Administración de la Comunidad de Madrid informan a los ciudadanos sobre los servicios que tienen encomendados y los compromisos de calidad en su prestación (que en ningún caso podrán ser inferiores a los exigidos por la normativa vigente); son aprobadas mediante Orden del Consejero correspondiente (previo informe favorable de la Dirección General competente en materia de Calidad de los Servicios) y publicadas en el BOCM, debiendo actualizarse periódicamente y siempre que se produzcan modificaciones sustanciales.',
      'B) Las Cartas de Servicios tienen rango de Ley Orgánica aprobada por las Cortes Generales y derogan los plazos de la Ley 39/2015.',
      'C) Su aprobación corresponde exclusivamente a los Ayuntamientos y no requieren publicación en el Boletín Oficial de la Comunidad de Madrid.',
      'D) Los compromisos de calidad de una Carta de Servicios pueden fijar plazos de resolución más lentos y menos garantistas para el ciudadano que los previstos en las leyes.',
    ],
    correctIndex: 0,
    explanation:
      'Cierre del temario específico de la CAM (Tema E67, Decreto 27/1997): las Cartas de Servicios explicitan los estándares y compromisos de calidad frente a la ciudadanía (estructura: datos identificativos y fines del órgano, relación de servicios, derechos de los usuarios, forma de presentación de quejas y sugerencias, compromisos de calidad e indicadores para su evaluación y medidas de subsanación/compensación); se aprueban por Orden del titular de la Consejería respectiva previo informe favorable de la DG de Calidad/Transparencia y se publican en el BOCM.',
  },
];
