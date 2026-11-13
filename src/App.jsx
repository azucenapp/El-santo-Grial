import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import ThemeSwitch from './ThemeSwitch';
import * as pdfjsLib from 'pdfjs-dist';
import {
 OFFICIAL_CAM_TOPICS,
 SERMAS_50_TOPICS,
 AYUNTAMIENTO_90_TOPICS,
 OBSOLETE_TERMS_DICTIONARY,
 FORBIDDEN_ACRONYMS_DICTIONARY,
 ERROR_ROOT_CAUSES,
 OFFICIAL_10_PRACTICAL_CASES,
 HIGH_DIFFICULTY_60_QUESTIONS,
} from './dataOposiciones';
import { generateMaster6PagesPDF } from './pdfMasterGenerator';
// Configuración del worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// 1. MOTOR INDEXEDDB DE ALTA CAPACIDAD
const DB_NAME = 'OposicionesTS_TripleMaster_2026_V5_DB';
const STORE_DOCS = 'pdfs_library_v5';
const STORE_ESSAYS = 'essays_ej2_library_v5';

function openAppDB() {
 return new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, 5);
  req.onupgradeneeded = (e) => {
   const db = e.target.result;
   if (!db.objectStoreNames.contains(STORE_DOCS))
    db.createObjectStore(STORE_DOCS, { keyPath: 'id' });
   if (!db.objectStoreNames.contains(STORE_ESSAYS))
    db.createObjectStore(STORE_ESSAYS, { keyPath: 'id' });
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
 });
}

async function getAllFromStore(storeName) {
 try {
  const db = await openAppDB();
  return new Promise((resolve, reject) => {
   const tx = db.transaction(storeName, 'readonly');
   const req = tx.objectStore(storeName).getAll();
   req.onsuccess = () => resolve(req.result || []);
   req.onerror = () => reject(req.error);
  });
 } catch {
  return [];
 }
}

async function saveToStore(storeName, itemsArray) {
 try {
  const db = await openAppDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  for (const item of itemsArray) store.put(item);
  return new Promise((resolve) => {
   tx.oncomplete = () => resolve(true);
  });
 } catch (e) {
  console.error('Error en IndexedDB:', e);
 }
}

async function deleteFromStore(storeName, id) {
 try {
  const db = await openAppDB();
  const tx = db.transaction(storeName, 'readwrite');
  tx.objectStore(storeName).delete(id);
  return new Promise((resolve) => {
   tx.oncomplete = () => resolve(true);
  });
 } catch (e) {
  console.error('Error eliminando de IndexedDB:', e);
 }
}

// 2. FUNCIONES DE AUDITORÍA, SIGLAS, EXTENSIÓN MANUSCRITA Y MUTACIÓN
function findTopicAcrossAllCatalogs(topicId) {
 if (!topicId) return null;
 return (
  OFFICIAL_CAM_TOPICS.find((t) => t.id === topicId) ||
  SERMAS_50_TOPICS.find((t) => t.id === topicId) ||
  AYUNTAMIENTO_90_TOPICS.find((t) => t.id === topicId) ||
  null
 );
}

function getConvocatoriaLabelByTopicId(topicId = '') {
 if (topicId.startsWith('S-'))
  return 'SERMAS · Personal Estatutario A2 (BOCM 06/11/2026)';
 if (topicId.startsWith('AY-'))
  return 'Ayuntamiento de Madrid · Rama Social (BOAM 2026)';
 return 'Comunidad de Madrid · Trabajo Social A2 (Orden 1049/2026)';
}

function extractSubEpigraphsFromTitle(rawTitle = '') {
 const cleaned = rawTitle.replace(
  /^(Tema\s+(General|Espec[ií]fico)?\s*\d+\.?|\d+\.-)\s*/i,
  ''
 );
 return cleaned
  .split(/[.:;]/)
  .map((s) => s.trim())
  .filter((s) => s.length > 4);
}

function autoExpandFirstMentionAcronyms(rawText = '') {
 let updated = rawText;
 let expandedCount = 0;

 FORBIDDEN_ACRONYMS_DICTIONARY.forEach((item) => {
  item.regex.lastIndex = 0;
  if (item.regex.test(updated) && !item.checkFull.test(updated)) {
   let replacedFirst = false;
   updated = updated.replace(item.regex, (match) => {
    if (!replacedFirst) {
     replacedFirst = true;
     expandedCount++;
     return item.expansion;
    }
    return match;
   });
  }
 });

 return { updated, expandedCount };
}

// MOTOR NARRATIVO: GENERADOR AUTOMÁTICO DE HISTORIAS LÓGICAS Y CUENTOS
function buildNarrativeStoryForTopic(topicObj, rawText = '', existingStory = null) {
 const id = topicObj?.id || 'E1';
 const title = topicObj?.title || 'Intervención Social en la Comunidad de Madrid';
 const lawUpdate =
  topicObj?.lawUpdate ||
  'Ley 12/2022 de Servicios Sociales de la CAM y Decreto 51/2023 (HSUe)';
 const epigraphs = extractSubEpigraphsFromTitle(title);

 const combinedSource = `${title} ${lawUpdate} ${rawText.slice(0, 6000)}`;
 const lawsFound = Array.from(
  new Set(
   combinedSource.match(
    /\b(?:Ley\s+Org[aá]nica\s+\d+\/\d{4}|Ley\s+\d+\/\d{4}|Real\s+Decreto(?:-Ley)?\s+\d+\/\d{4}|Decreto\s+\d+\/\d{4}|Orden\s+\d+\/\d{4}|Art(?:[ií]culo|\.)\s*\d+(?:\.\d+)?)/gi
   ) || [
    'Art. 9.2 CE',
    'Ley 12/2022',
    'Art. 16.2',
    'Art. 40',
    'Art. 69',
    'Decreto 51/2023',
   ]
  )
 ).slice(0, 10);

 // Detectar Caja Mnemotécnica real (9.1 o 10.1 en PDF Extenso: P-R-O-T-E-C-T, A-R-O-P-E, B-I-E-N-E-S-T-A-R, etc.)
 const cajaMatch = rawText.match(
  /(?:(?:9|10)\.1\.\s*(?:Recursos\s+Mnemot[eé]cnicos|Mnemotecnias\s+Magistrales)|ACR[OÓ]NIMO\s+MAESTRO)[\s\S]*?(?=\b(?:9|10)\.2\.|DESARROLLO\s+COMPLEMENTARIO|(?:\d+\.\s*)?S[IÍ]NTESIS\s+METODOL[OÓ]GICA|$)/i
 );
 const extractedRule = cajaMatch
  ? cajaMatch[0]
    .replace(/COMUNIDAD\s+DE\s+MADRID[^\n]*/gi, ' ')
    .replace(/Edici[oó]n\s+Maestra[^\n]*/gi, ' ')
    .replace(/P[aá]gina\s+\d+/gi, ' ')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 850)
  : existingStory?.logicHook ||
   `Sigue la escalera lógica: 1.º Puerta de Entrada (Art. 16.2 TS exclusivo) ➔ 2.º Carpeta Digital (Decreto 51/2023 HSUe) ➔ 3.º Reloj de 10 días hábiles (Art. 40 PIIS) ➔ 4.º Llave Maestra (Art. 69 Informe Social prescriptor).`;

 // Si el PDF subido es un documento de "Narración en 5 Actos", guardar su narrativa vivencial real en la pestaña 07
 if (/ACTO\s+I\s*:/i.test(rawText) && /ACTO\s+II\s*:/i.test(rawText)) {
  const brujulaMatch = rawText.match(
   /(?:BR[UÚ]JULA\s+DEL\s+OPOSITOR|00\s*[—–-]\s*05\s*min:)[\s\S]*?(?=ACTO\s+I\s*:\s*[A-ZÁÉÍÓÚÑ]{2,})/
  );
  const actsMatch = rawText.match(/ACTO\s+I\s*:\s*[A-ZÁÉÍÓÚÑ]{2,}[\s\S]*$/);
  const cleanActs = stripNonEssaySectionsFromPdf(
   actsMatch ? actsMatch[0] : rawText
  );

  const { microRetos, glosario } = extractMicroRetosAndGlosarioFromPdf(
   rawText,
   id
  );
  return {
   id: `story-${id}`,
   topicId: id,
   title: `[${id}] ${title} (Guía Narrativa Vivencial en 5 Actos)`,
   protagonist: 'Narración Mnemotécnica Oficial en 5 Actos',
   lawsChain: lawsFound.join(' ➔ '),
   storyText: cleanActs,
   logicHook: cajaMatch
    ? extractedRule
    : brujulaMatch
    ? brujulaMatch[0].replace(/\s+/g, ' ').trim()
    : extractedRule,
   epigraphOrder:
    'Acto I ➔ Acto II ➔ Acto III ➔ Acto IV (Ley 12/2022 y Red CAM) ➔ Acto V (Bioética Brody/Payton y Cierre al Tribunal)',
   microRetos:
    microRetos.length > 0 ? microRetos : existingStory?.microRetos || [],
   glosario: glosario.length > 0 ? glosario : existingStory?.glosario || [],
  };
 }

 // Si ya teníamos una Narración en 5 Actos guardada para este tema y ahora subimos el PDF Extenso, conservar los 5 Actos y añadirle el Acrónimo Maestro del Extenso
 const { microRetos: extRetos, glosario: extGlos } =
  extractMicroRetosAndGlosarioFromPdf(rawText, id);

 if (
  existingStory &&
  existingStory.protagonist === 'Narración Mnemotécnica Oficial en 5 Actos'
 ) {
  return {
   ...existingStory,
   lawsChain: lawsFound.join(' ➔ '),
   logicHook: extractedRule,
   microRetos:
    extRetos.length > 0 ? extRetos : existingStory.microRetos || [],
   glosario: extGlos.length > 0 ? extGlos : existingStory.glosario || [],
  };
 }

 const protagonistByArea = id.startsWith('G')
  ? 'Clara, una ciudadana que acude por primera vez a la Administración autonómica buscando amparo constitucional'
  : /52|adiccion/i.test(id + title)
  ? 'Marco, un hombre en situación de calle con adicción activa que empieza su recuperación sin exigencias imposibles'
  : /53|inmigra|asilo/i.test(id + title)
  ? 'Amina, recién llegada a Madrid en situación de vulnerabilidad administrativa que necesita regularización y acogida'
  : /menor|infancia|familia/i.test(title)
  ? 'Lucas (9 años) y su familia, que necesitan apoyo socioeducativo y protección integral'
  : /dependencia|mayor|discapacidad/i.test(title)
  ? 'Doña Carmen (82 años), que empieza a perder autonomía en su domicilio y necesita apoyos graduados'
  : 'Elena, vecina de Madrid que atraviesa una crisis sobrevenida de vulnerabilidad social';

 const ep1 = epigraphs[0] || 'el marco conceptual y constitucional';
 const ep2 = epigraphs[1] || 'la red de dispositivos y competencias';
 const ep3 = epigraphs[2] || 'el procedimiento metodológico y prestaciones';
 const ep4 =
  epigraphs.slice(3).join(' y ') ||
  'la coordinación interinstitucional y evaluación';

 const storyText = `📖 EL CUENTO LÓGICO DE [${id}]:
Imagina a ${protagonistByArea}. Para que no se te olvide ningún epígrafe ni ninguna ley en el examen, sigue su recorrido por estas 4 puertas conectadas por pura lógica de causa y efecto:

🚪 1.ª PUERTA · EL ESCUDO DE DERECHOS (${ep1.toUpperCase()}):
Nada más empezar la historia, ${protagonistByArea.split(',')[0]} no pide caridad ni beneficencia decimonónica: lleva en la mano un escudo grabado con su derecho subjetivo (${lawsFound.slice(0, 3).join(', ')}). La lógica es simple: la Administración existe para remover obstáculos (Art. 9.2 CE) y proteger la dignidad (Art. 10.1 CE), pasando del antiguo control social a la atención centrada en la persona.

🔑 2.ª PUERTA · LA RECEPCIÓN Y EL MAPA DE RECURSOS (${ep2.toUpperCase()}):
Al cruzar el umbral del Centro de Servicios Sociales (Atención Social Primaria), la ley prohíbe que le atienda cualquier perfil al azar: el Art. 16.2 de la Ley 12/2022 establece con reserva legal exclusiva que su Profesional de Referencia eres tú, la Trabajadora Social. Tú abres su Historia Social Única electrónica (Decreto 51/2023 - HSUe) para que sanidad (SERMAS) y servicios sociales lean el mismo libro sin hacerle repetir su vida, y activas la red específica de este tema (${ep2}).

⏱️ 3.ª PUERTA · EL RELOJ DE LOS 10 DÍAS Y LA LLAVE PRESCRIPTORA (${ep3.toUpperCase()}):
Una vez diagnosticada la situación con tus escalas técnicas, se activa un reloj en la pared: el Art. 40 de la Ley 12/2022 te da exactamente 10 días hábiles para pactar con la persona su hoja de ruta (PIAS / PIIS), respetando su autodeterminación (Ley 8/2021 y AMAPAD Ley 1/2023). Para abrir los recursos especializados de "${ep3}", necesitas una llave legal que solo tú puedes firmar: el Informe Social prescriptor (Art. 69 Ley 12/2022).

🌉 4.ª PUERTA · EL PUENTE EN RED Y EL CIERRE (${ep4.toUpperCase()}):
Ningún caso se resuelve en una isla. En el capítulo final, conectas Atención Primaria con Atención Especializada y el SERMAS bajo los plazos de la Ley 39/2015 (LPAC), cerrando la historia a los 3 y 6 meses midiendo con indicadores reales si la vida de nuestro protagonista ha mejorado.`;

 return {
  id: `story-${id}`,
  topicId: id,
  title: `[${id}] ${title}`,
  protagonist: protagonistByArea.split(',')[0],
  lawsChain: lawsFound.join(' ➔ '),
  storyText,
  logicHook: extractedRule,
  epigraphOrder: epigraphs.map((e, i) => `Paso ${i + 1}: ${e}`).join(' ➔ '),
  microRetos:
   extRetos.length > 0 ? extRetos : existingStory?.microRetos || [],
  glosario: extGlos.length > 0 ? extGlos : existingStory?.glosario || [],
 };
}

// VERIFICADOR DE COHERENCIA SEMÁNTICA PDF <-> DATAOPOSICIONES.JS (TRIBUNAL)
function normalizeAccents(str = '') {
 return String(str || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');
}

const TOPIC_MATCH_STOPWORDS = new Set([
 'trabajo',
 'social',
 'sociales',
 'comunidad',
 'madrid',
 'atencion',
 'intervencion',
 'marco',
 'normativo',
 'personas',
 'situacion',
 'papel',
 'profesional',
 'funciones',
 'general',
 'especifico',
 'sistema',
 'publico',
 'programa',
 'servicio',
 'servicios',
 'ambito',
 'fases',
 'concepto',
 'caracteristicas',
 'aspectos',
 'principales',
 'especial',
 'referencia',
 'reguladora',
 'procedimiento',
 'organizacion',
 'estructura',
 'competencias',
 'recursos',
 'centros',
 'medidas',
 'prestaciones',
]);

function findBestMatchingTopicByContent(
 rawText = '',
 catalog = OFFICIAL_CAM_TOPICS,
 fileName = ''
) {
 const cleanFileName = normalizeAccents(
  String(fileName || '').replace(/[_\-.]+/g, ' ')
 ).replace(
  /\b(extenso|narracion|narrativo|tratado|tema|especifico|general|pdf|doc|ej2|ej1|\d+)\b/g,
  ' '
 );
 const sample = normalizeAccents(rawText.slice(0, 4500));
 const headerSample = sample.slice(0, 1200);

 let bestTopic = null;
 let bestScore = 0;

 catalog.forEach((t) => {
  const cleanTitle = normalizeAccents(
   t.title.replace(/^(Tema\s+(General|Espec[ií]fico)?\s*\d+\.?|\d+\.-)\s*/i, '')
  );
  const firstClause = cleanTitle.split('.')[0].trim();

  let score = 0;
  if (firstClause.length >= 10 && cleanFileName.includes(firstClause)) {
   score += 60;
  }
  if (firstClause.length >= 10 && headerSample.includes(firstClause)) {
   score += 45;
  }

  const keywords = cleanTitle
   .split(/[\s,.:;()/]+/)
   .filter((w) => w.length > 3 && !TOPIC_MATCH_STOPWORDS.has(w));

  keywords.forEach((kw) => {
   const stem = kw.slice(0, Math.max(4, kw.length - 2));
   if (cleanFileName.includes(stem)) score += 8;
   if (headerSample.includes(stem)) score += 4;
   else if (sample.includes(stem)) score += 2;
  });

  if (score > bestScore) {
   bestScore = score;
   bestTopic = t;
  }
 });

 return { bestTopic, bestScore };
}

function verifyTopicContentCoherence(
 text = '',
 topicObj = null,
 catalog = OFFICIAL_CAM_TOPICS,
 fileName = ''
) {
 if (!topicObj) {
  return {
   isCoherent: true,
   matchScorePct: 100,
   alertMsg: null,
   suggestedTopic: null,
  };
 }

 const cleanOfficialTitle = normalizeAccents(
  topicObj.title.replace(
   /^(Tema\s+(General|Espec[ií]fico)?\s*\d+\.?|\d+\.-)\s*/i,
   ''
  )
 );
 const titleKeywords = cleanOfficialTitle
  .split(/[\s,.:;()/]+/)
  .filter((w) => w.length > 3 && !TOPIC_MATCH_STOPWORDS.has(w));

 const normSource = normalizeAccents(`${fileName} ${text.slice(0, 8000)}`);
 let matchedKw = 0;

 titleKeywords.forEach((kw) => {
  const stem = kw.slice(0, Math.max(4, kw.length - 2));
  if (normSource.includes(stem)) matchedKw++;
 });

 const firstClause = cleanOfficialTitle.split('.')[0].trim();
 const hasFirstClause =
  firstClause.length >= 10 && normSource.includes(firstClause);

 const rawPct =
  titleKeywords.length > 0
   ? Math.round((matchedKw / titleKeywords.length) * 100)
   : 100;
 const matchScorePct = hasFirstClause ? Math.max(85, rawPct) : rawPct;

 const { bestTopic, bestScore } = findBestMatchingTopicByContent(
  text,
  catalog,
  fileName
 );
 const isCoherent = matchScorePct >= 30 || hasFirstClause;

 let alertMsg = null;
 if (!isCoherent) {
  alertMsg = `🚨 DISCORDANCIA TEMÁTICA DETECTADA: Este PDF está asignado a [${topicObj.id}] "${topicObj.title}", pero su título/contenido corresponde a otro epígrafe del BOCM 2026 (${matchScorePct}% de afinidad).`;
  if (bestTopic && bestTopic.id !== topicObj.id && bestScore >= 6) {
   alertMsg += ` Según el título del documento, corresponde realmente a [${bestTopic.id}] "${bestTopic.title}".`;
  }
 }

 return {
  isCoherent,
  matchScorePct,
  alertMsg,
  suggestedTopic:
   !isCoherent && bestTopic && bestTopic.id !== topicObj.id
    ? bestTopic
    : null,
 };
}

function stripNonEssaySectionsFromPdf(rawText = '') {
 let clean = rawText
  // 1. Limpiar cabeceras y pies de página de todos los temas (Narración y Tratado Extenso)
  .replace(
   /TEMA\s+\d+\s*:[^\n]{5,110}?EJERCICIO\s+2\s*\(DESARROLLO\s+90\s+MIN\)\s*COMUNIDAD\s+DE\s+MADRID\s*[•·—–-]?\s*SUBGRUPO\s+A2(?:\s*Cr[oó]nica\s+Narrativa\s+de\s+Estudio\s+y\s+Redacci[oó]n\s+R[aá]pida\s*(?:P[aá]gina\s+\d+)?)?/gi,
   ' '
  )
  .replace(
   /Cr[oó]nica\s+Narrativa\s+de\s+Estudio\s+y\s+Redacci[oó]n\s+R[aá]pida\s*(?:P[aá]gina\s+\d+)?/gi,
   ' '
  )
  .replace(
   /EJERCICIO\s+2\s*[—–·•-]?\s*DESARROLLO\s+EN\s+90\s+MINUTOS\s*\(ESCALA\s+ASISTENTES\s+SOCIALES\s+A2\s+CM\)\s*(?:TEMA\s+\d+:\s+NARRACI[OÓ]N\s+MNEMOT[EÉ]CNICA\s+INTEGRAL)?/gi,
   ' '
  )
  .replace(
   /OPOSICI[OÓ]N\s+COMUNIDAD\s+DE\s+MADRID\s*[•·—–-]?\s*ESCALA\s+ASISTENTES\s+SOCIALES\s*\(GRUPO\s+A,\s*SUBGRUPO\s+A2\)/gi,
   ' '
  )
  .replace(
   /GU[IÍ]A\s+(?:NARRATIVA\s+VIVENCIAL\s+EN\s+5\s+ACTOS\s+PARA\s+RECORDAR\s+Y\s+REDACTAR\s+EL\s+EJERCICIO\s+2\s+EN\s+90\s+MINUTOS|MAESTRA\s+DE\s+DESARROLLO\s+ESCRITO\s+EN\s+90\s+MINUTOS\s*[•·—–-]?\s*M[EÉ]TODO\s+NARRATIVO\s+INTEGRAL)/gi,
   ' '
  )
  .replace(
   /Comunidad\s+de\s+Madrid\s*[•·—–-]?\s*Orden\s+1049\/2026\s*[•·—–-]?\s*M[eé]todo\s+de\s+Materia\s+[UÚ]nica\s+Doble\s+Salida\s*(?:P[aá]gina\s+\d+)?/gi,
   ' '
  )
  .replace(
   /COMUNIDAD\s+DE\s+MADRID[\s\S]{0,160}?LITERALIDAD/gi,
   ' '
  )
  .replace(
   /COMUNIDAD\s+DE\s+MADRID\s*[•·—–-]?\s*CONVOCATORIA\s+DE\s+ACCESO\s+LIBRE\s+2026[\s\S]{0,140}?399\s+PLAZAS/gi,
   ' '
  )
  .replace(
   /TRATADO\s+EXTENSO\s+DE\s+CONSULTA,\s+LITERALIDAD\s+NORMATIVA[\s\S]{0,120}?CASO\s+PR[AÁ]CTICO\)/gi,
   ' '
  )
  .replace(
   /Edici[oó]n\s+Maestra\s+de\s+Alto\s+Rendimiento[\s\S]{0,120}?P[aá]gina\s+\d+/gi,
   ' '
  )
  .replace(
   /OPOSICIONES\s+TRABAJO\s+SOCIAL\s+CAM\s+2026[\s\S]{0,180}?Escala\s+de\s+Asistentes\s+Sociales\s*\(Subgrupo\s+A2\)/gi,
   ' '
  )
  .replace(
   /OPOSICIONES\s+A2\s+TRABAJO\s+SOCIAL\s+COMUNIDAD\s+DE\s+MADRID\s*[—–-]*\s*TEMARIO\s+INTEGRAL\s+DE\s+EXCELENCIA/gi,
   ' '
  )
  .replace(
   /OPOSICIONES\s+A2\s+TRABAJO\s+SOCIAL\s+CAM\s*\|\s*MANUAL\s+MASTER\s+TEMA\s+\d+\s+P[aá]g\.\s+\d+/gi,
   ' '
  )
  .replace(
   /OPOSICIONES\s+AL\s+CUERPO\s+DE\s+T[EÉ]CNICOS\s+Y\s+DIPLOMADOS\s+ESPECIALISTAS\s*\(SUBGRUPO\s+A2\)\s*ESCALA\s+DE\s+ASISTENTES\s+SOCIALES\s+DE\s+LA\s+COMUNIDAD\s+DE\s+MADRID\s*[—–-]*\s*EDICI[OÓ]N\s+EXTENDIDA/gi,
   ' '
  )
  .replace(
   /Comunidad\s+de\s+Madrid\s*[—–-]+\s*Escala\s+de\s+Asistentes\s+Sociales\s*\(Subgrupo\s+A2\)(?:\s*[—–-]+\s*Edici[oó]n\s+2026(?:\s+P[aá]g\.\s+\d+)?)?/gi,
   ' '
  )
  .replace(/P[aá]gina\s+\d+(\s+de\s+\d+)?/gi, ' ');

 // 2. Eliminar "BRÚJULA DEL OPOSITOR" o tabla cronometrada "00-05 min: Esquema en sucio..." hasta el título en MAYÚSCULAS "ACTO I:" o "1."
 clean = clean.replace(
  /(?:BR[UÚ]JULA\s+DEL\s+OPOSITOR|00\s*[—–-]\s*05\s*min:\s*Esquema)[\s\S]*?(?=(?:ACTO\s+I|CAP[IÍ]TULO\s+I|\b1\.)\s*[:.-]?\s*[A-ZÁÉÍÓÚÑ]{2,}\s+[A-ZÁÉÍÓÚÑ]{2,})/,
  '\n\n'
 );

 // Limpiar restos de la Brújula si ya se había subido antes
 clean = clean.replace(
  /(?:1\.\s*Templo\s+Constitucional|05\s*[—–-]\s*18\s*min:)[\s\S]*?(?=(?:ACTO\s+I|\b1\.)\s*[:.-]?\s*[A-ZÁÉÍÓÚÑ]{2,}\s+[A-ZÁÉÍÓÚÑ]{2,})/,
  '\n\n'
 );

 // 3. Eliminar "FICHA TÉCNICA...", "PRESENTACIÓN DEL MANUAL MAESTRO...", "PARÁMETRO SELECTIVO" e "ÍNDICE..." hasta CAPÍTULO I o ACTO I en mayúsculas
 clean = clean.replace(
  /(?:FICHA\s+T[EÉ]CNICA|PRESENTACI[OÓ]N\s+DEL\s+MANUAL\s+MAESTRO|PAR[AÁ]METRO\s+SELECTIVO|[IÍ]NDICE\s+(?:GENERAL\s+)?SISTEM[AÁ]TICO)[\s\S]*?(?=(?:CAP[IÍ]TULO\s+I|ACTO\s+I|\b1\.)\s*[:.-]?\s*[A-ZÁÉÍÓÚÑ]{2,}\s+[A-ZÁÉÍÓÚÑ]{2,})/,
  '\n\n'
 );

 // 4. Eliminar Matriz de Caso Práctico, Baterías de Preguntas Tipo Test (Cap VIII o IX) y Caja Mnemotécnica (Cap IX o X) del texto de desarrollo
 clean = clean.replace(
  /(?:CAP[IÍ]TULO\s+VIII\s*:\s*|\d+\.\d+\.\s*|\d+\.\s*)?(?:MATRIZ|METODOLOG[IÍ]A)\s+DE\s+RESOLUCI[OÓ]N\s+DE\s+(?:CASO|SUPUESTOS)\s+PR[AÁ]CTICOS?[\s\S]*?(?=CAP[IÍ]TULO\s+(?:VIII|IX|X)\s*:|BLOQUE\s+(?:FINAL|PR[AÁ]CTICO)|(?:\d+\.\s*)?S[IÍ]NTESIS\s+METODOL[OÓ]GICA|$)/gi,
  '\n\n'
 );

 clean = clean.replace(
  /(?:CAP[IÍ]TULO\s+(?:VIII|IX)\s*:\s*|(?:\d+\.\s*)?BLOQUE\s+(?:FINAL|PR[AÁ]CTICO)\s*[I1V\d]*\s*:\s*)(?:BATER[IÍ]A\s+(?:OFICIAL\s+)?DE\s+(?:\d+\s+)?)?PREGUNTAS\s+TIPO\s+TEST[\s\S]*?(?=CAP[IÍ]TULO\s+(?:IX|X)\s*:|BLOQUE\s+PR[AÁ]CTICO\s+II|(\d+\.\s*)?CAJA\s+(?:DE\s+HERRAMIENTAS\s+)?MNEMOT[EÉ]CNICA|DESARROLLO\s+COMPLEMENTARIO|(?:\d+\.\s*)?S[IÍ]NTESIS\s+METODOL[OÓ]GICA|$)/gi,
  '\n\n'
 );

 clean = clean.replace(
  /(?:CAP[IÍ]TULO\s+(?:IX|X)\s*:\s*|(?:\d+\.\s*)?|BLOQUE\s+PR[AÁ]CTICO\s+II\s*:\s*)CAJA\s+(?:DE\s+HERRAMIENTAS\s+MNEMOT[EÉ]CNICAS|MNEMOT[EÉ]CNICA)[\s\S]*?(?=DESARROLLO\s+COMPLEMENTARIO|(?:\d+\.\s*)?S[IÍ]NTESIS\s+METODOL[OÓ]GICA|$)/gi,
  '\n\n'
 );

 return clean
  .replace(/<<|>>/g, '"')
  .replace(/\$(\d+(?:[.,]\d+)?)\s*\\in\/mes\$/gi, '$1 €/mes')
  .replace(/\$([^$]+)\$/g, '$1')
  .replace(/[ \t]{2,}/g, ' ')
  .trim();
}

function adjustTextToHandwrittenTarget(rawText = '') {
 return stripNonEssaySectionsFromPdf(rawText);
}

function autoEnhanceStructureAndAnalysis(rawText = '', topicId = 'E1') {
 const topicObj = findTopicAcrossAllCatalogs(topicId);
 const officialTitle = topicObj
  ? topicObj.title
  : 'el epígrafe oficial de la convocatoria';

 // Numerar formalmente SOLO los títulos de ACTO en mayúsculas sin alterar ni una sola palabra de tu redacción
 let clean = stripNonEssaySectionsFromPdf(rawText)
  .replace(/\s*ACTO\s+I\s*[:.-]\s*(?=[A-ZÁÉÍÓÚÑ]{2,})/g, '\n\n1. ')
  .replace(/\s*ACTO\s+II\s*[:.-]\s*(?=[A-ZÁÉÍÓÚÑ]{2,})/g, '\n\n2. ')
  .replace(/\s*ACTO\s+III\s*[:.-]\s*(?=[A-ZÁÉÍÓÚÑ]{2,})/g, '\n\n3. ')
  .replace(/\s*ACTO\s+IV\s*[:.-]\s*(?=[A-ZÁÉÍÓÚÑ]{2,})/g, '\n\n4. ')
  .replace(/\s*ACTO\s+V\s*[:.-]\s*(?=[A-ZÁÉÍÓÚÑ]{2,})/g, '\n\n5. ')
  .replace(
   /\s*EP[IÍ]LOGO:\s*CIERRE\s+DE\s+IMPACTO\s+PARA\s+EL\s+TRIBUNAL\s+DE\s+OPOSICIONES\s*/gi,
   '\n\n6. EPÍLOGO Y SÍNTESIS METODOLÓGICA PARA EL TRIBUNAL DE OPOSICIONES\n'
  )
  .replace(/\s*•\s*/g, '\n- ')
  .replace(/\s+(?=\d+\.\s+[A-ZÁÉÍÓÚÑ]{2,})/g, '\n\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

 if (
  !/SÍNTESIS METODOLÓGICA|EPÍLOGO Y SÍNTESIS|Señores miembros del Tribunal|conclusión magistral/i.test(
   clean
  )
 ) {
  clean += `\n\n6. SÍNTESIS METODOLÓGICA, DIAGNÓSTICO E INDICADORES DE EVALUACIÓN (CIERRE DE EXCELENCIA)
En conclusión, cabe destacar que el análisis expuesto sobre "${officialTitle}" exige una intervención interdisciplinar desde la Atención Social Primaria y Especializada regulada por la Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid. Asimismo, y desde la perspectiva del método científico del Trabajo Social, el diagnóstico social recogido en la Historia Social Única (Decreto 51/2023) y en el Informe Social (artículo 69) debe articularse, por consiguiente, con el Plan Individual de Atención Social (en adelante, PIAS, artículo 40 en el plazo de 10 días hábiles) bajo la dirección del Trabajador Social como Profesional de Referencia exclusivo (artículo 16.2).`;
 }

 const { updated } = autoExpandFirstMentionAcronyms(clean);
 return updated;
}

function auditDocumentTextValidity(
 text = '',
 topicInput = null,
 fileName = ''
) {
 const topicObj =
  typeof topicInput === 'string'
   ? findTopicAcrossAllCatalogs(topicInput)
   : topicInput;
 const warnings = [];
 const acronymAlerts = [];

 const coherence = verifyTopicContentCoherence(
  text,
  topicObj,
  OFFICIAL_CAM_TOPICS,
  fileName
 );
 if (!coherence.isCoherent && coherence.alertMsg) {
  warnings.push(coherence.alertMsg);
 }

 OBSOLETE_TERMS_DICTIONARY.forEach((rule) => {
  const matches = [...text.matchAll(rule.regex)];
  if (matches.length > 0) {
   let hasUncontextualizedError = false;
   matches.forEach((m) => {
    const idx = m.index || 0;
    const surroundingContext = text.slice(
     Math.max(0, idx - 85),
     Math.min(text.length, idx + 140)
    );
    if (
     !/derogad[ao]|antigu[ao]|anterior|sustituid[ao]/i.test(
      surroundingContext
     )
    ) {
     hasUncontextualizedError = true;
    }
   });
   if (hasUncontextualizedError) warnings.push(rule.alert);
  }
 });

 FORBIDDEN_ACRONYMS_DICTIONARY.forEach((item) => {
  item.regex.lastIndex = 0;
  if (item.regex.test(text) && !item.checkFull.test(text)) {
   acronymAlerts.push(
    `Sigla "${item.acronym}" usada sin desplegar antes "${item.expansion}"`
   );
  }
 });

 const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
 const handwrittenMinutes = Math.round(wordCount / 23);
 let pacingStatus = 'ÓPTIMO PARA EXAMEN DE DESARROLLO (80-90 MIN)';
 if (wordCount > 2650) {
  pacingStatus = `EXTENSO (${handwrittenMinutes} min a mano · Pulsa Limpiar Cabeceras para dejar solo el examen)`;
 } else if (wordCount < 1300) {
  pacingStatus = `CORTO PARA DESARROLLO (${handwrittenMinutes} min a mano · Recomendado 1.400-2.400 pal.)`;
 }

 const articleMentions = (
  text.match(
   /\b(art[ií]culo|art\.|arts\.|ley|decreto|orden|real\s+decreto|reglamento|constituci[oó]n|ordenanza|estatuto|baremo|pacto)\b/gi
  ) || []
 ).length;
 const analyticalConnectors = (
  text.match(
   /\b(asimismo|por\s+consiguiente|en\s+consecuencia|no\s+obstante|sin\s+embargo|en\s+cambio|mientras\s+que|a\s+diferencia\s+de|desde\s+la\s+perspectiva|en\s+conclusi[oó]n|cabe\s+destacar|interdisciplinar|multidimensional|estructural|diagn[oó]stico|evaluaci[oó]n|indicadores|paradigma|dicot[oó]mic[ao]|tridimensional|intergeneracional|desafiliaci[oó]n|desmercantilizaci[oó]n|desestratificaci[oó]n|desfamiliarizaci[oó]n|vulnerabilidad|exclusi[oó]n|derecho\s+subjetivo|deliberaci[oó]n\s+bio[eé]tica|inviolable|preceptivo)\b/gi
  ) || []
 ).length;
 const numberedHeadings = (text.match(/^\s*(\d+\.|[A-Z]\)|-\s+)/gm) || [])
  .length;

 const epigraphs = topicObj
  ? extractSubEpigraphsFromTitle(topicObj.title)
  : [];
 const missingEpigraphs = [];
 let coveredCount = 0;
 const normText = normalizeAccents(`${fileName} ${text}`);

 epigraphs.forEach((ep) => {
  const keyWords = normalizeAccents(ep)
   .split(/[\s,.:;()/]+/)
   .filter((w) => w.length > 4);
  if (
   keyWords.length === 0 ||
   keyWords.some((kw) =>
    normText.includes(kw.slice(0, Math.max(4, kw.length - 2)))
   )
  ) {
   coveredCount++;
  } else {
   missingEpigraphs.push(ep);
  }
 });

 const coveragePct =
  epigraphs.length > 0
   ? Math.round((coveredCount / epigraphs.length) * 100)
   : 100;

 const conocimientos70 = Math.min(
  7.0,
  (coveragePct / 100) * 3.5 + Math.min(3.5, (articleMentions / 14) * 3.5)
 );
 const analitico15 = Math.min(1.5, (analyticalConnectors / 8) * 1.5);

 let expresionBase =
  wordCount >= 1350 && wordCount <= 3500
   ? 1.0
   : wordCount > 3500
   ? 0.95
   : Math.min(1.0, (wordCount / 1350) * 1.0);
 if (acronymAlerts.length > 0) {
  expresionBase = Math.max(0.2, expresionBase - acronymAlerts.length * 0.15);
 }
 const expresion10 = expresionBase;
 const presentacion5 = Math.min(0.5, (numberedHeadings / 5) * 0.5);

 const essayMalpracticeRegex =
  /\b(?:ignora|omite|prescinde|incumple|vulnera)\b[^.]{0,65}\b(?:art[ií]culo\s+16\.2|art[ií]culo\s+40|art[ií]culo\s+69|ley\s+12\/2022|historia\s+social|informe\s+social|pias|piis|secreto\s+profesional|imparcialidad|objetividad\s+pericial)/i;
 if (essayMalpracticeRegex.test(text)) {
  warnings.push(
   '🚨 MALA PRAXIS / CONTRADICCIÓN DETECTADA: Se menciona un precepto o instrumento nuclear precedido de un verbo de omisión o vulneración.'
  );
 }

 let rawFinal = conocimientos70 + analitico15 + expresion10 + presentacion5;
 if (!coherence.isCoherent) rawFinal -= 2.5;
 if (warnings.length > (coherence.isCoherent ? 0 : 1)) {
  rawFinal -= (warnings.length - (coherence.isCoherent ? 0 : 1)) * 1.25;
 }
 const finalScore = Math.max(0, Math.min(10, rawFinal)).toFixed(2);

 let ej1TestQualityScore =
  3.5 +
  Math.min(4.5, (articleMentions / 12) * 4.5) +
  (coveragePct / 100) * 2.0;
 if (!coherence.isCoherent) ej1TestQualityScore -= 3.0;
 ej1TestQualityScore = Math.max(0, Math.min(10, ej1TestQualityScore)).toFixed(
  2
 );

 return {
  wordCount,
  handwrittenMinutes,
  pacingStatus,
  articleMentions,
  coveragePct,
  missingEpigraphs,
  acronymAlerts,
  conocimientosScore: conocimientos70.toFixed(2),
  analiticoScore: analitico15.toFixed(2),
  expresionScore: expresion10.toFixed(2),
  presentacionScore: presentacion5.toFixed(2),
  ej1TestQualityScore,
  finalScore,
  warnings,
  coherence,
  officialTitle: topicObj?.title || 'Sin epígrafe asignado',
  convocatoriaLabel: getConvocatoriaLabelByTopicId(topicObj?.id || ''),
  validityStatus: !coherence.isCoherent
   ? '❌ ERROR: CONTENIDO NO ACORDE AL TÍTULO OFICIAL'
   : warnings.length === 0
   ? 'VIGENCIA Y TEMÁTICA VERIFICADAS (BOCM/BOAM 2026)'
   : 'ALERTA: NORMATIVA DEROGADA',
  lastAuditedAt: new Date().toLocaleTimeString('es-ES', {
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
  }),
 };
}

function autoFixObsoleteLawsInText(rawText) {
 let updated = rawText;
 let countFixed = 0;
 OBSOLETE_TERMS_DICTIONARY.forEach((rule) => {
  updated = updated.replace(rule.regex, (match, offset, fullStr) => {
   const context = fullStr.slice(
    Math.max(0, offset - 80),
    Math.min(fullStr.length, offset + 130)
   );
   if (/derogad[ao]|sustituid[ao]/i.test(context)) return match;
   countFixed++;
   return rule.replacement;
  });
 });
 return { updated, countFixed };
}

function getDomainSpecificKnowledgeForTopic(topicObj) {
 const full = `${topicObj.id} ${topicObj.title} ${topicObj.lawUpdate || ''}`.toLowerCase();

 if (/forense|pericial|justicia|juzgado|audiencia|imlc|víctimas\s+de\s+delito|oavd|sede\s+judicial/i.test(full)) {
  return {
   marcoEspecifico:
    'Título VI de la Constitución Española; Ley Orgánica 6/1985 del Poder Judicial (LOPJ, art. 479 sobre Institutos de Medicina Legal y Ciencias Forenses, reformada por LO 1/2025 de Tribunales de Instancia); Ley 1/2000 de Enjuiciamiento Civil (LEC, arts. 335 a 352 sobre el dictamen de peritos y ratificación en vista oral); Decreto 37/2006 del Instituto de Medicina Legal y Ciencias Forenses (IMLCF) de la Comunidad de Madrid; y Ley 4/2015 del Estatuto de la Víctima del Delito junto con el Real Decreto 1109/2015 de las Oficinas de Asistencia a las Víctimas del Delito (OAVD).',
   dispositivosRed:
    'Instituto de Medicina Legal y Ciencias Forenses de la Comunidad de Madrid (IMLCF, Servicio de Especialidades y Equipos Técnicos Psicosociales adscritos a los Tribunales de Instancia, Juzgados de Familia, Violencia sobre la Mujer, Menores, Provisión de Apoyos y Audiencia Provincial de Madrid) y Red de Oficinas de Asistencia a las Víctimas del Delito (OAVD) en sede judicial.',
   instrumentosEspecificos:
    'Dictamen o Informe Social Pericial Forense (encabezamiento y oficio judicial, juramento o promesa de objetividad del art. 335.2 LEC, metodología pericial y triangulación de fuentes, vaciado de autos, entrevistas periciales semiestructuradas, visita domiciliaria forense, valoración técnica e indicadores periciales, conclusiones orientadoras al Juez y defensa/ratificación oral en juicio conforme al art. 347 LEC) y Plan de Apoyo Individualizado en OAVD para prevenir la victimización secundaria.',
   autoresDoctrina:
    'Pilar Ruiz Rodríguez (Trabajo Social Forense y pericia social), Luis Fernando Hernández, Guía de Buenas Prácticas para la elaboración de Informes Periciales Sociales del Colegio Oficial del Trabajo Social de Madrid, Mary Ellen Richmond (Social Diagnosis y pruebas periciales/testimoniales, 1917) y Código Deontológico del Trabajo Social (arts. 15, 31 y 48-55).',
  };
 }

 if (/seguridad\s+social|desempleo|pensiones\s+no\s+contributivas|renta\s+m[ií]nima|ingreso\s+m[ií]nimo\s+vital|pobreza\s+energ[eé]tica|empleo/i.test(full)) {
  return {
   marcoEspecifico:
    'Artículo 41 de la Constitución Española; Real Decreto Legislativo 8/2015 por el que se aprueba el Texto Refundido de la Ley General de la Seguridad Social (TRLGSS: nivel contributivo y nivel no contributivo en arts. 363 a 373); Real Decreto 357/1991 de Pensiones No Contributivas; Ley 3/2023 de Empleo y Real Decreto-ley 2/2024 de reforma del nivel asistencial por desempleo; Ley 19/2021 del Ingreso Mínimo Vital (IMV y CAPI); y Ley 15/2001 junto al Decreto 126/2014 de Renta Mínima de Inserción (RMI) de la Comunidad de Madrid.',
   dispositivosRed:
    'Instituto Nacional de la Seguridad Social (INSS), Servicio Público de Empleo Estatal (SEPE / Agencia Española de Empleo), Oficinas de Empleo de la Comunidad de Madrid, Dirección General de Servicios Sociales e Integración de la CAM (gestión de PNC y RMI) y Centros de Servicios Sociales de Atención Social Primaria (acompañamiento y Programas Individuales de Inserción).',
   instrumentosEspecificos:
    'Programa Individual de Inserción (PII en RMI CAM) y Plan Individual de Atención Social (PIAS/PIIS en 10 días hábiles, art. 40 Ley 12/2022), Informe Social para acreditación de vulnerabilidad socioeconómica o unidades de convivencia especiales en el IMV (Ley 19/2021), valoración de carencia de rentas en PNC de Jubilación e Invalidez (>=65% y complemento de tercera persona >=75%), e informe de riesgo de exclusión para el Bono Social Eléctrico y suministros vitales.',
   autoresDoctrina:
    'William Beveridge y Otto von Bismarck (modelos de Seguridad Social universal vs contributivo), Gøsta Esping-Andersen (desmercantilización), Robert Castel (metamorfosis de la cuestión social y desafiliación), Guy Standing (precariado) y Amartya Sen (enfoque de las capacidades).',
  };
 }

 if (/administraci[oó]n\s+educativa|orientaci[oó]n\s+educativa|psicopedag[oó]gica|escolarizaci[oó]n|eoep/i.test(full)) {
  return {
   marcoEspecifico:
    'Artículo 27 de la Constitución Española; Ley Orgánica 2/2006 de Educación (LOE) modificada por la Ley Orgánica 3/2020 (LOMLOE); Decreto 23/2023, de 22 de marzo, por el que se regula la atención educativa a las diferencias individuales del alumnado en la Comunidad de Madrid; Ley Orgánica 8/2021 (LOPIVI, figura del Coordinador de Bienestar y Protección en centros educativos) y Ley 4/2023 de Infancia de la CAM.',
   dispositivosRed:
    'Equipos de Orientación Educativa y Psicopedagógica (EOEP generales, Equipos de Atención Temprana EAT de 0 a 6 años y Equipos Específicos), Departamentos de Orientación en Institutos de Educación Secundaria (con presencia del Profesor Técnico de Servicios a la Comunidad - PTSC / Trabajador Social), Comisiones de Escolarización Extraordinaria por urgencia social y Mesas Locales de Prevención y Control del Absentismo Escolar.',
   instrumentosEspecificos:
    'Evaluación Psicopedagógica e Informe Sociofamiliar del EOEP/EAT (identificación de barreras para el aprendizaje y necesidades educativas especiales ACNEE y ACNEAE), Protocolo de actuación e intervención ante el absentismo escolar en coordinación con Atención Social Primaria, Hoja de Notificación de riesgo infantil desde el ámbito educativo y Plan de Convivencia e Inclusión.',
   autoresDoctrina:
    'Urie Bronfenbrenner (mesosistema familia-escuela), Paulo Freire (pedagogía crítica e inclusiva), Lev Vygotsky (constructivismo sociocultural) y el índice de Inclusión Educativa de Booth y Ainscow.',
  };
 }

 if (/ética|deontol[oó]gico|secreto\s+profesional|bio[eé]tica|método\s+cient[ií]fico|t[eé]cnicas\s+en\s+trabajo\s+social|modelos\s+de\s+intervenci[oó]n|equipo\s+interdisciplinar/i.test(full)) {
  return {
   marcoEspecifico:
    'Código Deontológico de Trabajo Social (Consejo General del Trabajo Social, 2012: principios básicos de Dignidad, Libertad e Igualdad art. 7, y confidencialidad/secreto profesional arts. 48 a 55); Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid (profesional de referencia exclusivo TS en art. 16.2, PIIS en 10 días hábiles en art. 40, Informe Social en art. 69 y Comité de Ética de los Servicios Sociales); Decreto 51/2023 regulador de la Historia Social Única Electrónica (HSUe) y LO 3/2018 (LOPDGDD).',
   dispositivosRed:
    'Equipos interdisciplinares de Atención Social Primaria y Atención Social Especializada de la Comunidad de Madrid, Unidades de Trabajo Social Sanitario del SERMAS, Equipos Psicosociales Forenses del IMLCF y Comité de Ética de los Servicios Sociales de la Comunidad de Madrid.',
   instrumentosEspecificos:
    'Fases del método científico (estudio-investigación, diagnóstico social, planificación, ejecución y evaluación); técnicas (entrevista social según Teresa Rossell y Kadushin, visita domiciliaria y observación); e instrumentos exclusivos: Historia Social Única Electrónica (Decreto 51/2023), Ficha Social SIUSS, Informe Social prescriptor (art. 69 Ley 12/2022), Plan Individual (PIAS/PIIS en 10 días hábiles, art. 40), Genograma (McGoldrick y Gerson), Ecomapa (Ann Hartman) y Escala de Gijón.',
   autoresDoctrina:
    'Mary Ellen Richmond (Social Diagnosis, 1917), Gordon Hamilton y Florence Hollis (modelo psicosocial), Virginia Robinson (modelo funcional), Helen H. Perlman (resolución de problemas), Reid y Epstein (centrado en la tarea), Caplan y Golan (intervención en crisis), Bronfenbrenner y Germain/Gitterman (sistémico-ecológico), Malcolm Payne, Beauchamp y Childress, Diego Gracia, Howard Brody y Rita Payton (deliberación bioética), y Maslach y Jackson (prevención del Burnout).',
  };
 }

 if (/penitenciaria|personas\s+sin\s+hogar|violencia\s+de\s+g[eé]nero|igualdad\s+entre\s+mujeres|trata\s+de\s+seres\s+humanos|lgtbi|urgencia\s+y\s+emergencia\s+social|vivienda\s+social/i.test(full)) {
  return {
   marcoEspecifico:
    'Ley Orgánica 1/1979 General Penitenciaria y RD 840/2011 de los Servicios de Gestión de Penas y Medidas Alternativas (SGPMA); Ley Orgánica 1/2004, Ley Orgánica 10/2022 y Ley 5/2005 de la Comunidad de Madrid contra la Violencia de Género (modificada por Ley 3/2018, título habilitante art. 31); Ley 4/2023 estatal y Leyes 2/2016 y 3/2016 de la CAM en materia LGTBI; Ley 12/2022 de Servicios Sociales de la CAM (urgencia social art. 41); y Decreto 244/2015 de la Agencia de Vivienda Social (AVS) junto al Decreto 52/2016 de adjudicación por especial necesidad.',
   dispositivosRed:
    'Servicios Sociales Penitenciarios y CIS; Red de Atención a Personas Sin Hogar y modelo Housing First (SAMUR Social, UMES, centros de acogida y emergencia); Red de Atención Integral para la Violencia de Género de la CAM (Puntos Municipales PMORVG, Centros de Emergencia, Centros de Acogida, Pisos Tutelados, Centros de Crisis 24h y SAVG 24h); Programa Madrileño de Información y Atención LGTBI; y Agencia de Vivienda Social de la CAM.',
   instrumentosEspecificos:
    'Título Habilitante administrativo expedido por Servicios Sociales para acreditar la condición de víctima de violencia de género sin denuncia previa (art. 23 LO 1/2004 y art. 31 Ley 5/2005 CAM), Tipología Europea de Sinhogarismo y Exclusión Residencial (ETHOS de FEANTSA), Informe Social de vulnerabilidad habitacional ante lanzamientos judiciales (art. 441.5 LEC), PIAS/PIIS de urgencia e Historia Social Única (Decreto 51/2023).',
   autoresDoctrina:
    'Sam Tsemberis (modelo Housing First), Leonore Walker (ciclo de la violencia de género), Kimberlé Crenshaw (interseccionalidad), Marcela Lagarde, Erving Goffman (instituciones totales y estigma) y Robert Castel (exclusión social).',
  };
 }

 if (/sanitari|salud|hospital|sermas|atenci[oó]n primaria de salud|mental/i.test(full)) {
  return {
   marcoEspecifico:
    'Ley 14/1986 General de Sanidad, Ley 16/2003 de Cohesión y Calidad del SNS, Ley 44/2003 (LOPS), Ley 41/2002 de Autonomía del Paciente, Ley 12/2001 de Ordenación Sanitaria de la Comunidad de Madrid (LOSCAM), Ley 6/2009 de Libertad de Elección Sanitaria en la CAM, Decreto 246/2023 de estructura del SERMAS y Cartera de Servicios Estandarizados de Trabajo Social Sanitario.',
   dispositivosRed:
    'Unidades de Trabajo Social (UTS) en los Centros de Salud de Atención Primaria (Zonas Básicas de Salud), Servicios de Trabajo Social Hospitalario (planificación precoz del alta hospitalaria, intervención en crisis en Urgencias, maternidad, VIH/SIDA y cuidados paliativos), Centros de Salud Mental (CSM), Hospitales de Día y Red Pública de Atención Social a personas con enfermedad mental grave y duradera de la CAM (Decreto 122/1997: CRPS, CRL, Centros de Día, Mini-residencias, Pisos Supervisados y EASC) en coordinación sociosanitaria mediante el Visor Horus, HCIS y la Historia Social Única (Decreto 51/2023).',
   instrumentosEspecificos:
    'Historia Social Sanitaria integrada en AP-Madrid/HCIS e interoperable con la HSUe (Decreto 51/2023), Informe Social Sanitario al alta hospitalaria, Escala de Gijón de riesgo sociofamiliar, Índice de Barthel y Lawton-Brody, cuestionario Pfeiffer, escala de sobrecarga de Zarit y protocolos de detección precoz de maltrato infantil, violencia de género, seguimiento biopsicosocial en VIH/SIDA y anciano frágil.',
   autoresDoctrina:
    'Ida Cannon (pionera del Trabajo Social Médico en el Massachusetts General Hospital), Richard Cabot, Amaya Ituarte (Trabajo Social Clínico), Dolors Colom (Trabajo Social Sanitario), Aaron Antonovsky (salutogénesis), Marc Lalonde y Michael Marmot (determinantes sociales de la salud) y el modelo biopsicosocial de George Engel.',
  };
 }

 if (/calidad|carta|evaluaci[oó]n|planificaci[oó]n|indicador|inspecci[oó]n|organiza/i.test(full)) {
  return {
   marcoEspecifico:
    'Decreto 27/1997, de 6 de marzo, por el que se regulan las Cartas de Servicios en la Comunidad de Madrid; Ley 12/2022 de Servicios Sociales de la CAM (Título VI sobre Calidad, Inspección y Registro arts. 77 a 98); Ley 11/2002 de Ordenación de la Actividad de los Centros y Servicios de Acción Social en la CAM; Ley 19/2013 y Ley 10/2019 de Transparencia de la CAM; y Plan de Inspección de Servicios Sociales.',
   dispositivosRed:
    'Dirección General de Evaluación, Calidad e Innovación de la Consejería de Familia, Juventud y Asuntos Sociales; Subdirección General de Inspección de Servicios Sociales; Registro de Entidades, Centros, Servicios y de Directores de Centros de Atención Social; y Sistema de Información de Usuarios de Servicios Sociales (SIUSS / HSUe Decreto 51/2023).',
   instrumentosEspecificos:
    'Cartas de Servicios (compromisos de calidad, indicadores de seguimiento y medidas de subsanación aprobadas por Orden del Consejero y publicadas en BOCM), Enfoque del Marco Lógico (EML), Ciclo PDCA de Deming (Planificar, Hacer, Verificar, Actuar), Modelo EFQM de Excelencia Europea, normas ISO 9001/UNE 158000, encuestas de satisfacción percibida y actas de inspección.',
   autoresDoctrina:
    'Avedis Donabedian (tríada de evaluación de la calidad asistencial: Estructura, Proceso y Resultado), W. Edwards Deming (mejora continua), Ezequiel Ander-Egg y María José Aguilar Idáñez (niveles estratégicos de planificación: Plan, Programa, Proyecto, Actividad y Tarea).',
  };
 }

 if (/inmigra|asilo|refugia|extranjer|intercultural/i.test(full)) {
  return {
   marcoEspecifico:
    'Artículo 13 de la Constitución Española, Ley Orgánica 4/2000 sobre derechos y libertades de los extranjeros en España (LOEX) y su nuevo Reglamento aprobado por Real Decreto 1155/2024, de 19 de noviembre (5 modalidades de arraigo: segunda oportunidad, sociolaboral, social, socioformativo y familiar), Ley 12/2009 reguladora del Derecho de Asilo y de la Protección Subsidiaria, y Real Decreto 220/2022 del Sistema de Acogida de Protección Internacional (SAPI).',
   dispositivosRed:
    'Red de 8 Centros de Participación e Integración de Inmigrantes (CEPI) de la Comunidad de Madrid, Centros de Acogida a Refugiados (CAR), dispositivos de emergencia del SAPI (Fases de evaluación inicial, acogida y autonomía) y Centros de Servicios Sociales de Atención Social Primaria (emisión de Informes de Arraigo y de Adecuación de Vivienda).',
   instrumentosEspecificos:
    'Informe Social autonómico/municipal de Integración Social para autorización de residencia por Arraigo (art. 127 del RD 1155/2024), Informe de adecuación de vivienda para reagrupación familiar, protocolo de atención a menores extranjeros no acompañados (art. 35 LOEX), mediación intercultural y diagnóstico del duelo migratorio.',
   autoresDoctrina:
    'Joseba Achotegui (Síndrome de Ulises o síndrome del inmigrante con estrés crónico y múltiple), Carlos Giménez Romero (modelos de integración intercultural y mediación) y Kimberlé Crenshaw (enfoque de interseccionalidad).',
  };
 }

 if (/adiccion|drog|sustancia|alcohol|juego|caid/i.test(full)) {
  return {
   marcoEspecifico:
    'Ley 5/2002, de 27 de junio, sobre Drogodependencias y otros Trastornos Adictivos de la Comunidad de Madrid; Ley 17/2003 del Fondo de bienes decomisados; Estrategia Nacional sobre Adicciones del Plan Nacional sobre Drogas; y Ley 12/2022 de Servicios Sociales de la CAM (arts. 16.2, 40 y 69).',
   dispositivosRed:
    'Red de Centros de Atención Integral a Drogodependientes (CAID de la Comunidad de Madrid), Centro Regional de Documentación de Educación Sanitaria y Adicciones de la CAM, Centros de Atención a las Adicciones (CAD de Madrid Salud), Unidades de Desintoxicación Hospitalaria (UDH del SERMAS), Comunidades Terapéuticas, Pisos de Apoyo al Tratamiento y dispositivos de Reducción del Daño y Disminución de Riesgos.',
   instrumentosEspecificos:
    'Índice de Severidad de la Adicción (EuropASI), cuestionarios de cribado y diagnóstico de alcoholismo (AUDIT de la OMS, CAGE, MALT y cálculo de Unidades de Bebida Estándar UBE), entrevista motivacional en las etapas del cambio, Plan Individualizado de Intervención Social (PIIS en 10 días hábiles, art. 40 Ley 12/2022), Informe Social prescriptor (art. 69) e Historia Social Única Electrónica (Decreto 51/2023).',
   autoresDoctrina:
    'Prochaska y DiClemente (modelo transteórico de las etapas del cambio: precontemplación, contemplación, preparación, acción, mantenimiento y recaída), Miller y Rollnick (entrevista motivacional), Marlatt (prevención de recaídas y reducción de daños) y E.M. Jellinek (tipologías clínicas del alcoholismo).',
  };
 }

 if (/infancia|menor|adolescen|acogimiento|adopci|familia/i.test(full)) {
  return {
   marcoEspecifico:
    'Convención sobre los Derechos del Niño de 1989; Ley Orgánica 1/1996 de Protección Jurídica del Menor (modificada por LO 8/2015 y Ley 26/2015); Ley Orgánica 8/2021 de Protección Integral a la Infancia y la Adolescencia frente a la Violencia (LOPIVI); Ley 4/2023, de 22 de marzo, de Derechos, Garantías y Protección Integral de la Infancia y la Adolescencia de la Comunidad de Madrid (que deroga la antigua Ley 6/1995 y regula la Comisión de Protección a la Infancia y la Adolescencia de la CAM); Ley Orgánica 5/2000 de Responsabilidad Penal de los Menores y Ley 3/2004 de creación de la ARRMI.',
   dispositivosRed:
    'Comisión de Protección a la Infancia y la Adolescencia de la Comunidad de Madrid (órgano colegiado que sustituye a la antigua Comisión de Tutela del Menor conforme a la Ley 4/2023), Consejos de Derechos de la Infancia y Adolescencia, Equipos de Trabajo con Menores y Familias en Atención Social Primaria, Centros de Apoyo y Encuentro Familiar (CAEF) y Puntos de Encuentro Familiar (PEF), Red de Acogimiento Familiar (urgencia, temporal máx. 2 años y permanente) y Residencial, Organismos Acreditados de Adopción Internacional (OAAI) y Agencia ARRMI.',
   instrumentosEspecificos:
    'Instrumento VALÓRAME de valoración de la gravedad de las situaciones de riesgo y desamparo infantil en la Comunidad de Madrid, Registro Unificado de Maltrato Infantil (RUMA / SIMIA), figuras del Coordinador de Bienestar y del Delegado de Protección (LO 8/2021), Genograma y Ecomapa familiar, y Proyecto de Intervención Familiar.',
   autoresDoctrina:
    'Urie Bronfenbrenner (modelo ecológico del desarrollo humano), John Bowlby y Mary Ainsworth (teoría del apego seguro e inseguro), Jorge Barudy y Maryorie Dantagnan (buenos tratos a la infancia y parentalidad positiva) y Salvador Minuchin (terapia familiar estructural).',
  };
 }

 if (/dependencia|mayor|envejec|discapacidad|autonom[ií]a/i.test(full)) {
  return {
   marcoEspecifico:
    'Artículo 49 de la Constitución Española (reformado en febrero de 2024), Real Decreto Legislativo 1/2013 de derechos de las personas con discapacidad, Estrategia Española 2022-2030 y Estrategia Madrileña Horizonte 2028, Real Decreto 888/2022 del nuevo baremo de discapacidad (4 baremos BLA, BDGP, BFCA y BRP; Clases 0 a 4), Ley 39/2006 (LAPAD), Decreto 54/2015 de procedimiento de dependencia en la CAM, Ley 8/2021 de reforma civil de apoyos y Ley 1/2023 de creación de la AMAPAD.',
   dispositivosRed:
    'Dirección General de Atención al Mayor y a la Dependencia, Red de Centros Base de Valoración y Orientación a personas con discapacidad de la CAM y CRECOVI (Centro Regional de Coordinación y Valoración Infantil), Agencia Madrileña de Atención Social (AMAS), Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad (AMAPAD y su Comité de Ética) y catálogo del SAAD (Teleasistencia Avanzada, SAD, Centros de Día/Noche, Atención Residencial y Prestaciones Económicas PECEF, PEAP y PEVS).',
   instrumentosEspecificos:
    'Baremo de Valoración de la Dependencia (BVD y Escala de Valoración Específica EVE para menores de 3 años del RD 174/2011: Grado I de 25 a 49 puntos, Grado II de 50 a 74 puntos, Grado III de 75 a 100 puntos), Informe Social de Entorno, Programa Individual de Atención (PIA en plazo máximo de 6 meses con silencio negativo en Decreto 54/2015), e índices de Barthel, Lawton-Brody, Pfeiffer, Gijón y Zarit.',
   autoresDoctrina:
    'Modelo de Atención Integral y Centrada en la Persona (AICP de Teresa Martínez y Tom Kitwood), paradigma de Vida Independiente y modelo social y de derechos humanos de la discapacidad (Mike Oliver y Convención de la ONU de Nueva York de 2006).',
  };
 }

 return {
  marcoEspecifico:
   topicObj.lawUpdate ||
   'Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid, Decreto 51/2023 regulador de la Historia Social Única Electrónica (HSUe), Catálogo y Cartera de Prestaciones del Sistema Público de Servicios Sociales, Concierto Social (arts. 54 a 67) y Ley 39/2015 (LPAC).',
  dispositivosRed:
   'Red de Centros de Servicios Sociales de Atención Social Primaria (puerta de entrada universal y territorializada conforme al artículo 16.2 de la Ley 12/2022) en articulación con la Atención Social Especializada (Consejería de Familia, Juventud y Asuntos Sociales, AMAS Decreto 230/2015, AMAPAD Ley 1/2023), el Ministerio competente en Derechos Sociales e IMSERSO, el Fondo Social Europeo Plus (FSE+) y el Servicio Madrileño de Salud (SERMAS).',
  instrumentosEspecificos:
   'Historia Social Única Electrónica (HSUe, Decreto 51/2023), Ficha Social SIUSS, Informe Social exclusivo como dictamen técnico prescriptor (artículo 69 de la Ley 12/2022), Plan Individual de Atención Social (PIAS/PIIS en un plazo máximo de 10 días hábiles conforme al artículo 40), Genograma, Ecomapa y Escala de Gijón.',
  autoresDoctrina:
   'Mary Ellen Richmond (Diagnóstico Social, 1917), Gordon Hamilton (escuela diagnóstica psicosocial), Helen Harris Perlman (resolución de problemas), Richard Titmuss y Gøsta Esping-Andersen (regímenes de bienestar), T.H. Marshall (ciudadanía social), Jonathan Bradshaw (tipología de necesidades sociales), Natalio Kisnerman, Ezequiel Ander-Egg y Teresa Zamanillo.',
 };
}

function buildMagistralTopicText(topicObj, convocatoriaKey) {
 const epigraphs = extractSubEpigraphsFromTitle(topicObj.title);
 const domain = getDomainSpecificKnowledgeForTopic(topicObj);
 const instName =
  convocatoriaKey === 'sermas'
   ? 'el Servicio Madrileño de Salud (en adelante, SERMAS, regulado por la Ley 12/2001, de Ordenación Sanitaria de la Comunidad de Madrid, en adelante LOSCAM, y el Decreto 246/2023)'
   : convocatoriaKey === 'ayto'
   ? 'el Ayuntamiento de Madrid (regulado por la Ley 22/2006 de Capitalidad, el Plan Estratégico de Servicios Sociales 2023-2027 y la Ordenanza 10/2022, de 28 de junio)'
   : 'la Administración de la Comunidad de Madrid (bajo el marco de la Orden 1049/2026 y la Ley 12/2022, de 21 de diciembre, de Servicios Sociales)';

 const sectionVariants = [
  (ep, idx) => `
${idx}. FUNDAMENTACIÓN CONCEPTUAL, DOCTRINAL Y MARCO NORMATIVO DE: ${ep.toUpperCase()}
El abordaje técnico-científico de "${ep}" exige partir del bloque de constitucionalidad (artículos 9.2, 10.1, 14 y 39 a 50 de la Constitución Española, en adelante CE, incluyendo la reforma del artículo 49 de enero de 2024) y del Estatuto de Autonomía de la Comunidad de Madrid (Ley Orgánica 3/1983, artículo 26.1.23).
De manera específica para esta materia, el ordenamiento jurídico vigente en 2026 se articula a través de: ${domain.marcoEspecifico}
En el plano teórico y epistemológico, la intervención del Trabajo Social en "${ep}" se fundamenta en las aportaciones de ${domain.autoresDoctrina}, superando los antiguos modelos asistencialistas o graciables para consolidar un enfoque de derechos subjetivos, atención centrada en la persona e interseccionalidad en el ámbito de ${instName}.`,

  (ep, idx) => `
${idx}. ARQUITECTURA INSTITUCIONAL, RED DE DISPOSITIVOS Y COMPETENCIAS EN: ${ep.toUpperCase()}
La materialización operativa de "${ep}" dentro del territorio de la Comunidad de Madrid se despliega mediante una red pública y concertada de responsabilidad pública integrada por: ${domain.dispositivosRed}
De conformidad con la Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid (que derogó expresamente la antigua Ley 11/2003), esta red actúa bajo los principios de universalidad, equidad territorial, proximidad y coordinación interadministrativa (artículo 140 de la Ley 40/2015, de Régimen Jurídico del Sector Público, en adelante LRJSP).
El acceso y tránsito por los dispositivos vinculados a "${ep}" garantiza la continuidad asistencial entre el nivel primario y el nivel especializado, diferenciando con rigor jurídico entre las prestaciones garantizadas (exigibles como derecho subjetivo ante la Administración) y las prestaciones condicionadas a disponibilidad presupuestaria.`,

  (ep, idx) => `
${idx}. PROCEDIMIENTO METODOLÓGICO, INSTRUMENTOS TÉCNICOS Y RESERVA LEGAL EN: ${ep.toUpperCase()}
El procedimiento de intervención profesional en materia de "${ep}" se sujeta a las garantías y plazos de la Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Común de las Administraciones Públicas (en adelante, LPAC) y a los preceptos nucleares de la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid:
a) Reserva legal del Profesional de Referencia (artículo 16.2 de la Ley 12/2022): En la Atención Social Primaria, el profesional de referencia de acceso al sistema es exclusivamente un Trabajador/a Social, quien asume la dirección técnica del itinerario en "${ep}".
b) Instrumentos y escalas específicas aplicables a este epígrafe: ${domain.instrumentosEspecificos}
c) Plazo legal de planificación y potestad prescriptora: La formulación consensuada del Plan Individual de Atención Social (en adelante, PIAS) debe realizarse en el plazo máximo de 10 días hábiles (artículo 40 de la Ley 12/2022), quedando registrada en la Historia Social Única Electrónica (Decreto 51/2023) y respaldada por el Informe Social como dictamen técnico exclusivo (artículo 69).`,

  (ep, idx) => `
${idx}. COORDINACIÓN INTERDISCIPLINAR, EVALUACIÓN E INDICADORES DE CALIDAD EN: ${ep.toUpperCase()}
La eficacia de las actuaciones desarrolladas en "${ep}" requiere un trabajo en red interdisciplinar que conecte los Servicios Sociales de Atención Primaria con el Servicio Madrileño de Salud (SERMAS), el ámbito educativo, judicial y las entidades del Tercer Sector de Acción Social.
Asimismo, toda actuación en este ámbito incorpora una evaluación ex ante, intermedia (a los 3 meses) y final (a los 6 meses), aplicando indicadores cuantitativos de cobertura, tiempos medios de respuesta administrativa y tasas de resolución efectiva, junto a indicadores cualitativos de satisfacción percibida conforme al Decreto 27/1997 de Cartas de Servicios de la Comunidad de Madrid, al modelo de calidad de Avedis Donabedian (estructura, proceso y resultado) y al Reglamento General de Protección de Datos (en adelante, RGPD) y la Ley Orgánica 3/2018.`
 ];

 const sectionsText = epigraphs
  .map((ep, i) => {
   const builder = sectionVariants[i % sectionVariants.length];
   return builder(ep, i + 2);
  })
  .join('\n');

 const fullDraft = `TEMA MAGISTRAL OFICIAL [${
  topicObj.id
 }] · ${topicObj.title.toUpperCase()}
MARCO NORMATIVO ESPECÍFICO VERIFICADO 2026: ${domain.marcoEspecifico}

1. INTRODUCCIÓN TÉCNICA, ENCUADRE CONSTITUCIONAL Y OBJETO DEL TEMA
El estudio de "${topicObj.title}" constituye un bloque esencial del programa oficial de acceso al Cuerpo de Técnicos y Diplomados Especialistas, Escala de Asistentes Sociales (Subgrupo A2), conforme al Texto Refundido de la Ley del Estatuto Básico del Empleado Público (en adelante, TREBEP) en ${instName}.
Su relevancia técnica radica en articular la normativa específica de este ámbito (${domain.marcoEspecifico}) con el método científico del Trabajo Social y las aportaciones doctrinales de ${domain.autoresDoctrina}, garantizando siempre el secreto profesional y el Código Deontológico del Trabajo Social.
${sectionsText}

${
 epigraphs.length + 2
}. SÍNTESIS METODOLÓGICA, DIAGNÓSTICO E INDICADORES DE EVALUACIÓN (CIERRE DE EXCELENCIA)
En conclusión, cabe destacar que el análisis expuesto sobre "${
  topicObj.title
 }" exige una intervención interdisciplinar desde la Atención Social Primaria y Especializada regulada por la Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid, en estrecha conexión con los dispositivos específicos de este ámbito (${domain.dispositivosRed.slice(0, 140)}...). Asimismo, y desde la perspectiva del método científico del Trabajo Social, el diagnóstico social recogido en la Historia Social Única (Decreto 51/2023) y en el Informe Social (artículo 69) debe articularse, por consiguiente, con el Plan Individual de Atención Social (en adelante, PIAS, artículo 40 en 10 días hábiles). No obstante la complejidad estructural de los factores analizados, en consecuencia resulta preceptivo implementar una evaluación continua mediante indicadores cuantitativos y cualitativos de cobertura, eficacia y calidad asistencial conforme a la LPAC.`;

 const { updated } = autoExpandFirstMentionAcronyms(fullDraft);
 return updated;
}

// FILTRO ANTI-BOE/PLAZAS Y EXTRACTOR DE LAS 20 PREGUNTAS LITERALES DEL PDF
const ADMIN_CALL_FORBIDDEN_REGEX =
 /\b(convocatoria\s+y\s+plazas|cuerpo\s+y\s+escala|sistema\s+selectivo|sistema\s+de\s+selecci[oó]n|titulaci[oó]n\s+exigida|titulaci[oó]n\s+habilitante|nota\s+de\s+corte|reglas\s+metodol[oó]gicas|materia\s+[uú]nica|doble\s+salida|[ií]ndice\s+sistem[aá]tico|br[uú]jula\s+del\s+opositor|estrategia\s+de\s+examen\s+manual|par[aá]metro\s+selectivo|presentaci[oó]n\s+del\s+manual|plazas?\s+libres|plazas?\s+ofertadas|cupo\s+de\s+discapacidad|399\s+plazas|380\s+plazas|173\s+plazas|bolsa\s+de\s+interinos|orden\s+1472\/2026|bocm\s+n\.?[º°]\s*100|tasas?\s+de\s+examen|derechos\s+de\s+examen|presentaci[oó]n\s+de\s+instancias|oferta\s+de\s+empleo\s+p[uú]blico|ficha\s+t[eé]cnica\s+oficial|tres\s+ejercicios\s+eliminatorios)\b/i;

function isDefectiveOrAdminQuestion(q) {
 if (!q || !Array.isArray(q.options) || q.options.length < 3) return true;
 const optsJoined = (q.options || []).join(' ');
 const fullTxt = `${q.question || ''} ${optsJoined} ${q.explanation || ''}`;
 if (ADMIN_CALL_FORBIDDEN_REGEX.test(fullTxt)) return true;

 if (
  /\b(CAP[IÍ]TULO\s+[IVXLCDM\d]+|ACTO\s+[IVXLCDM\d]+|EP[IÍ]LOGO|P[aá]gs?\.|P[aá]g,|SUB-EP[IÍ]GRAFE\s+OFICIAL|TEMA\s+MAGISTRAL\s+OFICIAL)\b/i.test(
   `${q.question || ''} ${optsJoined}`
  )
 ) {
  return true;
 }

 if (
  /suspensi[oó]n\s+discrecional\s+en\s+el\s+plazo\s+de\s+diez\s+d[ií]as\s+naturales|autorizaci[oó]n\s+judicial\s+previa\s+de\s+la\s+Fiscal[ií]a\s+Superior\s+en\s+el\s+t[eé]rmino\s+improrrogable|En\s+ning[uú]n\s+caso\s+resultar[aá]\s+aplicable\s+\d/i.test(
   optsJoined
  )
 ) {
  return true;
 }

 for (const opt of q.options) {
  const body = opt.replace(/^[A-Da-d][).]\s*/, '').trim();
  if (/^(?:\d+[).ªº]|[,;:])/.test(body)) return true;
  if (/\((?:Arts?|P[aá]gs?|Decreto|Ley)[.,]?\s*$/i.test(body)) return true;
  if (/(?:\b[A-ZÁÉÍÓÚÑ]{3,}\b\s+){3,}\b[A-ZÁÉÍÓÚÑ]{3,}\b/.test(body)) {
   return true;
  }
 }
 const normalizedOpts = (q.options || []).map((o) =>
  o
   .replace(/^[A-Da-d][).]\s*/, '')
   .replace(/\s+/g, ' ')
   .trim()
   .toLowerCase()
 );
 if (new Set(normalizedOpts).size < normalizedOpts.length) {
  return true; // Descartar preguntas donde dos opciones sean idénticas
 }

 // 4. Descartar preguntas del generador antiguo donde las opciones repiten el mismo inicio de frase (>32 caracteres iguales)
 const prefixes = normalizedOpts
  .filter((o) => o.length > 35)
  .map((o) => o.slice(0, 32));
 if (prefixes.length >= 3 && new Set(prefixes).size === 1) {
  return true;
 }

 return false;
}

function extractLiteralTestQuestionsFromPdf(rawText = '', topicId = 'E1') {
 const extracted = [];
 const clean = rawText
  .replace(/COMUNIDAD\s+DE\s+MADRID[\s\S]{0,160}?LITERALIDAD/gi, ' ')
  .replace(
   /Edici[oó]n\s+Maestra\s+de\s+Alto\s+Rendimiento[\s\S]{0,120}?P[aá]gina\s+\d+/gi,
   ' '
  )
  .replace(/P[aá]gina\s+\d+/gi, ' ')
  .replace(/\$([^$]+)\$/g, '$1')
  .replace(/<<|>>/g, '"');

 const blockRegex =
  /(?:Pregunta\s*)?(\d{1,2})\.\s+([^A-Z]*?[¿A-ZÁÉÍÓÚÑ][\s\S]{10,450}?)\s+[A-Da-d][).]\s+([\s\S]{1,300}?)\s+[B-Db-d][).]\s+([\s\S]{1,300}?)\s+[C-Dc-d][).]\s+([\s\S]{1,300}?)\s+[D-dd][).]\s+([\s\S]{1,300}?)\s+(?:\*\s*)?(?:Respuesta\s+correcta|Soluci[oó]n)\s*:\s*([A-Da-d])\)?[.:]?\s*([\s\S]{10,550}?)(?=(?:\s+(?:Pregunta\s*)?\d{1,2}\.\s+)|(?:\s+CAP[IÍ]TULO\s+(?:IX|X))|(?:\s+BLOQUE\s+PR[AÁ]CTICO\s+II)|(?:\s+\d+\.\s+CAJA)|$)/gi;

 let match;
 while ((match = blockRegex.exec(clean)) !== null) {
  const qNum = match[1];
  const qText = match[2].replace(/\s+/g, ' ').trim();
  const optA = match[3].replace(/\s+/g, ' ').trim();
  const optB = match[4].replace(/\s+/g, ' ').trim();
  const optC = match[5].replace(/\s+/g, ' ').trim();
  const optD = match[6].replace(/\s+/g, ' ').trim();
  const correctLetter = match[7].toUpperCase();
  const rawExplanation = match[8]
   .replace(/^Justificaci[oó]n(?:\s+t[eé]cnico-jur[ií]dica)?\s*:\s*/i, '')
   .replace(/\s+/g, ' ')
   .trim();

  if (
   ADMIN_CALL_FORBIDDEN_REGEX.test(qText) ||
   ADMIN_CALL_FORBIDDEN_REGEX.test(rawExplanation)
  ) {
   continue;
  }

  const correctIdx = { A: 0, B: 1, C: 2, D: 3 }[correctLetter] ?? 0;

  extracted.push({
   id: `q-pdf-lit-${topicId}-${qNum}`,
   topicId,
   difficulty: 'Oficial PDF Extenso (Literal)',
   originType: '📘 BATERÍA OFICIAL PDF EXTENSO',
   question: `[${topicId}] ${qText}`,
   options: [`A) ${optA}`, `B) ${optB}`, `C) ${optC}`, `D) ${optD}`],
   correctIndex: correctIdx,
   explanation:
    rawExplanation ||
    `Respuesta oficial del solucionario: ${correctLetter}.`,
  });
 }

 return extracted;
}

// EXTRACTOR AUTOMÁTICO DE MICRO-RETOS 15s, GLOSARIO Y CASO PRÁCTICO EN 5 PASOS
function buildDefaultRetosAndGlosarioForTopic(topicObj, rawText = '') {
 const id = topicObj?.id || 'E1';
 const cleanTitle = (
  topicObj?.title || 'Servicios Sociales en la Comunidad de Madrid'
 ).replace(/^(Tema\s+(General|Espec[ií]fico)?\s*\d+\.?|\d+\.-)\s*/i, '');

 const epigraphs = extractSubEpigraphsFromTitle(topicObj?.title || cleanTitle);
 const lawUpdate = topicObj?.lawUpdate || '';
 const domain = getDomainSpecificKnowledgeForTopic(
  topicObj || { id, title: cleanTitle, lawUpdate }
 );

 const lawSegments = lawUpdate
  .split(/;|\.(?=\s+[A-ZÁÉÍÓÚÑ])/)
  .map((s) => s.trim())
  .filter((s) => s.length > 8);

 const pdfSentences = rawText ? extractCleanDoctrinalSentences(rawText) : [];

 const ep1 = epigraphs[0] || cleanTitle;
 const ep2 = epigraphs[1] || epigraphs[0] || 'la estructura y competencias del tema';
 const ep3 = epigraphs[2] || epigraphs[1] || 'el régimen jurídico y prestacional';

 const defaultRetos = [
  {
   id: `reto-def-${id}-1`,
   topicId: id,
   num: '1',
   question: `[${id}] ¿Qué normativa específica y preceptos legales regulan en 2026 «${ep1}»?`,
   answer: lawSegments[0] || lawUpdate || domain.marcoEspecifico,
  },
  {
   id: `reto-def-${id}-2`,
   topicId: id,
   num: '2',
   question: `[${id}] En relación con «${ep2}», ¿cuáles son los elementos clave, requisitos o estructura que exige el programa oficial?`,
   answer:
    lawSegments[1] ||
    pdfSentences[0] ||
    `${lawUpdate || domain.marcoEspecifico} — En conexión con: ${domain.dispositivosRed}`,
  },
  {
   id: `reto-def-${id}-3`,
   topicId: id,
   num: '3',
   question: `[${id}] ¿Qué órganos, recursos institucionales o instrumentos técnicos intervienen específicamente en «${ep3}»?`,
   answer:
    pdfSentences[1] ||
    `Dispositivos/Órganos: ${domain.dispositivosRed} · Instrumentos: ${domain.instrumentosEspecificos}`,
  },
  {
   id: `reto-def-${id}-4`,
   topicId: id,
   num: '4',
   question: `[${id}] ¿Qué referentes teóricos, jurisprudenciales o criterios técnicos fundamentan «${cleanTitle.slice(0, 75)}»?`,
   answer:
    lawSegments[2] ||
    pdfSentences[2] ||
    `${domain.autoresDoctrina} (${lawUpdate.slice(0, 180)})`,
  },
 ];

 const defaultGlosario = epigraphs.slice(0, 4).map((ep, idx) => ({
  id: `glos-def-${id}-${idx + 1}`,
  topicId: id,
  term: `[${id}] ${ep.slice(0, 62)}`,
  definition:
   lawSegments[idx] ||
   pdfSentences[idx] ||
   (idx === 0
    ? `Marco normativo específico [${id}]: ${lawUpdate || domain.marcoEspecifico}`
    : idx === 1
    ? `Arquitectura institucional y red en [${id}]: ${domain.dispositivosRed}`
    : idx === 2
    ? `Instrumentos y herramientas aplicables a [${id}]: ${domain.instrumentosEspecificos}`
    : `Fundamentación doctrinal de [${id}]: ${domain.autoresDoctrina}`),
 }));

 while (defaultGlosario.length < 4) {
  const n = defaultGlosario.length + 1;
  defaultGlosario.push({
   id: `glos-def-${id}-${n}`,
   topicId: id,
   term: `[${id}] Clave Normativa ${n}: ${cleanTitle.slice(0, 38)}`,
   definition:
    lawSegments[n - 1] ||
    lawUpdate ||
    `${domain.marcoEspecifico} · ${domain.instrumentosEspecificos}`,
  });
 }

 return { defaultRetos, defaultGlosario };
}

function extractMicroRetosAndGlosarioFromPdf(
 rawText = '',
 topicId = 'E1',
 topicObj = null
) {
 const microRetos = [];
 const glosario = [];
 const clean = rawText
  .replace(/COMUNIDAD\s+DE\s+MADRID[\s\S]{0,160}?LITERALIDAD/gi, ' ')
  .replace(
   /Edici[oó]n\s+Maestra\s+de\s+Alto\s+Rendimiento[\s\S]{0,120}?P[aá]gina\s+\d+/gi,
   ' '
  )
  .replace(/P[aá]gina\s+\d+/gi, ' ')
  .replace(/\$([^$]+)\$/g, '$1')
  .replace(/<<|>>/g, '"');

 // 1. Extraer Micro-Retos de 15 segundos de cualquier tema (Sección 9.3 / 10.3 / 8.3)
 const retoRegex =
  /Micro-Reto\s*(\d{1,2})\s*:\s*([^?]+\?)\s*Respuesta\s*:\s*([\s\S]{5,380}?)(?=\s*[^\wÁÉÍÓÚÑáéíóúñ]*Micro-Reto\s*\d|\s*CAP[IÍ]TULO|$)/gi;
 let rMatch;
 while ((rMatch = retoRegex.exec(clean)) !== null) {
  microRetos.push({
   id: `reto-${topicId}-${rMatch[1]}`,
   topicId,
   num: rMatch[1],
   question: rMatch[2].replace(/\s+/g, ' ').trim(),
   answer: rMatch[3].replace(/\s+/g, ' ').trim(),
  });
 }

 // 2. Extractor Universal de Glosario Técnico-Jurídico para cualquiera de los 67 temas
 const glosarioSectionMatch = clean.match(
  /(?:(?:8|9|10)\.2\.\s*)?Glosario\s+T[eé]cnico-Jur[ií]dico\s+Esencial\s*[:]?[\s\S]*?(?=(?:(?:8|9|10)\.3\.|Micro-Reto\s*1|CAP[IÍ]TULO\s+[IXV]+|$))/i
 );
 if (glosarioSectionMatch) {
  const gSec = glosarioSectionMatch[0]
   .replace(
    /^(?:(?:8|9|10)\.2\.\s*)?Glosario\s+T[eé]cnico-Jur[ií]dico\s+Esencial\s*[:]?/i,
    ' '
   )
   .replace(
    /T[eé]rmino\s+(?:T[eé]cnico|Dogm[aá]tico)\s+Definici[oó]n\s+(?:Doctrinal\s+y\s+Legal\s+Exacta|T[eé]cnico-Jur[ií]dica\s+Exacta(?:\s+para\s+el\s+Tribunal)?)/i,
    ' '
   )
   .trim();

  // Proteger abreviaturas ("Art.", "Arts.", "n.º", "s.") antes de separar cada fila por su punto final
  const prot = gSec.replace(
   /\b(Arts?|N\.?[º°]|n\.?[º°]|s|D|Dña|RD|RDL)\.\s*/g,
   '$1__DOT__ '
  );
  const rawEntries = prot
   .split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÑ])/)
   .map((e) => e.replace(/__DOT__/g, '.').replace(/\s+/g, ' ').trim())
   .filter((e) => e.length > 35);

  const defStarterRegex =
   /^([A-ZÁÉÍÓÚÑ][^.:]{2,52}?)\s+((?:Poder|F[oó]rmula|Doctrina|Regla|Concepto|Categor[ií]a|Fen[oó]meno|Expediente|Metodolog[ií]a|Capacidad|Grado|Asunci[oó]n|Garant[ií]a|Principio|Modalidad|Plataforma|Dictamen|Derecho|Prestaci[oó]n|Instrumento|Sistema|Procedimiento|Conjunto|Medida|[OÓ]rgano|Situaci[oó]n|Proceso|Modelo|Escala|[IÍ]ndice|Baremo|Red|Servicio|Nivel|Tasa|Umbral|Indicador|Pacto|Acuerdo|Obligaci[oó]n|Deber|Mecanismo|Criterio|Figura|R[eé]gimen|T[eé]cnica|Herramienta|Acci[oó]n|Intervenci[oó]n|Valoraci[oó]n|Provisi[oó]n|Transferencia|Asignaci[oó]n|Pensi[oó]n|Subsidio|Ayuda|Recurso|Dispositivo|Centro|Unidad|Equipo)\b[\s\S]+)$/;

  rawEntries.forEach((entry) => {
   const m = entry.match(defStarterRegex);
   if (m) {
    glosario.push({
     id: `glos-${topicId}-${glosario.length + 1}`,
     topicId,
     term: m[1].trim(),
     definition: m[2].trim(),
    });
   } else {
    const words = entry.split(' ');
    const termWords = [words[0]];
    for (let i = 1; i < Math.min(5, words.length); i++) {
     const w = words[i];
     if (
      /^[A-ZÁÉÍÓÚÑ(]/.test(w) ||
      /^(de|del|la|el|los|las|y|por|en|a|para|con|sin|al)$/i.test(w)
     ) {
      termWords.push(w);
     } else {
      break;
     }
    }
    const term = termWords.join(' ').trim();
    const definition = entry.slice(term.length).trim();
    if (term.length >= 3 && definition.length >= 20) {
     glosario.push({
      id: `glos-${topicId}-${glosario.length + 1}`,
      topicId,
      term,
      definition,
     });
    }
   }
  });
 }

 const resolvedTopic = topicObj || findTopicAcrossAllCatalogs(topicId);
 const { defaultRetos, defaultGlosario } =
  buildDefaultRetosAndGlosarioForTopic(resolvedTopic, rawText);

 return {
  microRetos: microRetos.length > 0 ? microRetos : defaultRetos,
  glosario: glosario.length > 0 ? glosario : defaultGlosario,
 };
}

function extractPracticalCaseFromExtensoPdf(rawText = '', topicObj = null) {
 const topicId = topicObj?.id || 'E1';
 const clean = rawText
  .replace(/COMUNIDAD\s+DE\s+MADRID[\s\S]{0,160}?LITERALIDAD/gi, ' ')
  .replace(
   /Edici[oó]n\s+Maestra\s+de\s+Alto\s+Rendimiento[\s\S]{0,120}?P[aá]gina\s+\d+/gi,
   ' '
  )
  .replace(/P[aá]gina\s+\d+/gi, ' ')
  .replace(/\$([^$]+)\$/g, '$1')
  .replace(/<<|>>/g, '"');

 const caseMatch = clean.match(
  /(?:CAP[IÍ]TULO\s+VIII:\s*MATRIZ\s+DE\s+RESOLUCI[OÓ]N\s+DE\s+SUPUESTOS\s+PR[AÁ]CTICOS|7\.5\.\s*Metodolog[ií]a\s+de\s+Resoluci[oó]n\s+de\s+Supuestos\s+Pr[aá]cticos\s+en\s+5\s+Pasos(?!\s+Aplicada\s+a\s+Caso\s+Real\s+P[aá]g))[\s\S]{120,3800}?(?=CAP[IÍ]TULO\s+(?:VIII|IX)\s*:\s*BATER[IÍ]A\s+OFICIAL)/i
 );

 if (!caseMatch) return null;
 const block = caseMatch[0].replace(/\s+/g, ' ').trim();
 const supuestoMatch = block.match(/Supuesto:\s*([\s\S]{40,650}?)(?=Paso\s+Metodol[oó]gico|PASO\s+1)/i);
 const pasosMatch = block.match(/PASO\s+1:[\s\S]*$/i);

 return {
  id: `pdf-case-${topicId}`,
  topicId,
  badge: `📘 SUPUESTO OFICIAL PDF EXTENSO [${topicId}] · ${(
   topicObj?.title || 'Caso Práctico en 5 Pasos'
  ).slice(0, 58)}`,
  enunciado: supuestoMatch
   ? supuestoMatch[1].trim()
   : `Resolución técnica en 5 pasos aplicada al epígrafe oficial [${topicId}] (${
     topicObj?.title || ''
    }).`,
  claves:
   'Matriz Oficial en 5 Pasos: 1) Encuadre Normativo CE y Ley 12/2022 · 2) Jefatura Técnica Art. 16.2 y HSUe Decreto 51/2023 · 3) Informe Social Prescriptor Art. 69 · 4) PIIS en 10 días hábiles Art. 40 · 5) Deliberación Bioética Brody y Payton.',
  escalasEspecificas:
   'Historia Social Única electrónica (HSUe - Decreto 51/2023), Ficha Social SIUSS, Genograma de 3 generaciones, Ecomapa y Escala de Gijón.',
  normativaEspecifica:
   topicObj?.lawUpdate ||
   'Artículos 1.1, 9.2, 10.1, 39 a 50 CE; Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid (Arts. 16.2, 40 y 69); Decreto 51/2023 (HSUe) y Código Deontológico (Arts. 7 y 55).',
  intervencionEspecifica: pasosMatch ? pasosMatch[0] : block,
  fullResolutionText: block
   .replace(/\s*(PASO\s+[1-5]\s*:)/gi, '\n\n$1')
   .replace(/\s*•\s*/g, '\n- '),
 };
}

function extractCleanDoctrinalSentences(rawText = '') {
 const body = stripNonEssaySectionsFromPdf(rawText);

 // Proteger abreviaturas jurídicas ("Art. 69", "Arts. 72-76", "Pág. 4") para no partir frases por la mitad
 const protectedText = body
  .replace(
   /\b(Arts?|P[aá]gs?|N\.?[º°]|n\.?[º°]|D|Dña|Dr|Dra|Sr|Sra|Cap|Vol|n[uú]m|coord|dir|ed|op|cit|ss|etc|p\.?\s*ej|v\.?\s*gr|EE\.?\s*UU|CC\.?\s*AA|AA\.?\s*PP|s|S)\.\s*/g,
   '$1__DOT__ '
  )
  .replace(/(\d+)\.(\d+)/g, '$1__DOT__$2')
  .replace(/\b([IVXLCDM]+|\d+)\.\s+/g, '$1__DOT__ ');

 const rawParts = protectedText.split(/(?<=[.?!])\s+(?=[A-ZÁÉÍÓÚÑ])/);

 const validSentences = [];
 for (const part of rawParts) {
  const s = part
   .replace(/__DOT__/g, '.')
   .replace(/^(?:[-•*]|\d+(?:\.\d+)*[).]?|[A-Za-z][).])\s*/, '')
   .replace(/\s+/g, ' ')
   .trim();

  if (s.length < 85 || s.length > 245) continue;
  if (ADMIN_CALL_FORBIDDEN_REGEX.test(s)) continue;

  // Rechazar cualquier título, subtítulo, capítulo, acto, epílogo, paso o referencia de página
  if (
   /\b(CAP[IÍ]TULO\s+[IVXLCDM\d]+|ACTO\s+[IVXLCDM\d]+|EP[IÍ]LOGO|P[aá]gs?\.|[IÍ]NDICE|BR[UÚ]JULA|FICHA\s+T[EÉ]CNICA|PAR[AÁ]METRO|BATER[IÍ]A\s+OFICIAL|RESPUESTA\s+CORRECTA|JUSTIFICACI[OÓ]N|MICRO-RETO|PASO\s+[1-5]|SUB-EP[IÍ]GRAFE|TEMA\s+MAGISTRAL)\b/i.test(
    s
   )
  ) {
   continue;
  }

  // Rechazar si contiene 3 o más palabras seguidas en MAYÚSCULAS (indica título o subtítulo incrustado)
  if (/(?:\b[A-ZÁÉÍÓÚÑ]{3,}\b\s+){2,}\b[A-ZÁÉÍÓÚÑ]{3,}\b/.test(s)) {
   continue;
  }

  // Rechazar si tiene sub-numeraciones internas ("1. ", "2. ") o empieza por números/paréntesis ("69),")
  if (/\b\d+\.\s+[A-ZÁÉÍÓÚÑ]/.test(s)) continue;
  if (!/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,}\b/.test(s)) continue;

  // Debe terminar en punto cerrado y no dejar paréntesis abiertos ni abreviaturas colgadas
  if (!s.endsWith('.') || /\([A-Za-z0-9.\s-]*$/.test(s)) continue;
  const openParens = (s.match(/\(/g) || []).length;
  const closeParens = (s.match(/\)/g) || []).length;
  if (openParens !== closeParens) continue;

  // Debe contener contenido técnico-jurídico o doctrinal real del tema
  if (
   !/\b(Ley|Decreto|Art[ií]culo|Art\.|Constituci[oó]n|d[ií]as|meses|a[ñn]os|\d{4}|Beveridge|Bismarck|Esping-Andersen|Titmuss|Marshall|Richmond|servicios\s+sociales|derecho\s+subjetivo|Atenci[oó]n\s+Social|Informe\s+Social|Historia\s+Social|PIIS|PIAS|universal|contributiv[ao])\b/i.test(
    s
   )
  ) {
   continue;
  }

  validSentences.push(s);
 }

 return Array.from(new Set(validSentences));
}

function falsifyDoctrinalSentence(sentence, variantIdx = 0) {
 let m = sentence;

 const swaps = [
  [/\b(diez|10)\s+d[ií]as\s+h[aá]biles\b/gi, 'treinta días naturales improrrogables'],
  [/\b(veinte|20)\s+d[ií]as\b/gi, 'cuarenta y cinco días naturales'],
  [/\b(tres|3)\s+meses\b/gi, 'doce meses naturales'],
  [/\b(seis|6)\s+meses\b/gi, 'dos meses hábiles'],
  [/\bh[aá]biles\b/gi, 'naturales sin exclusión de festivos'],
  [/\bAtenci[oó]n\s+Social\s+Primaria\b/gi, 'Atención Social Especializada de segundo nivel'],
  [/\bAtenci[oó]n\s+Social\s+Especializada\b/gi, 'Atención Social Primaria municipal'],
  [/\bDerecho\s+Subjetivo(?:\s+Universal)?\b/gi, 'concesión graciable sujeta a disponibilidad presupuestaria anual'],
  [/\buniversales\b/gi, 'focalizados exclusivamente mediante comprobación estricta de pobreza'],
  [/\buniversal\b/gi, 'asistencial y estrictamente discrecional'],
  [/\bimpuestos(?:\s+generales|\s+directos)?\b/gi, 'cotizaciones sociales exclusivas de los trabajadores en activo'],
  [/\bfiscalidad\s+general\b/gi, 'cuotas obrero-patronales de naturaleza estrictamente contributiva'],
  [/\bcotizaciones(?:\s+sociales|\s+laborales)?\b/gi, 'impuestos indirectos sin vinculación laboral previa'],
  [/\bexclusiv[ao](?:mente)?\b/gi, 'compartida de forma rotatoria con personal administrativo'],
  [/\bpreceptivo\b/gi, 'meramente facultativo y prescindible'],
  [/\bLey\s+12\/2022\b/gi, 'Ley 11/2003 de Servicios Sociales aún vigente'],
  [/\bDecreto\s+51\/2023\b/gi, 'Decreto 88/2002 de archivo municipal cerrado'],
  [/\bArt(?:[ií]culo|\.)\s*16\.2\b/gi, 'Artículo 84.3 de libre designación administrativa'],
  [/\bArt(?:[ií]culo|\.)\s*40\b/gi, 'Artículo 95 de ejecución trimestral'],
  [/\bArt(?:[ií]culo|\.)\s*69\b/gi, 'Artículo 12 de carácter meramente informativo'],
  [/\bsin\s+[aá]nimo\s+de\s+lucro\b/gi, 'mercantiles con ánimo de lucro prioritario'],
  [/\bno\s+contractual\b/gi, 'contractual mediante subasta mercantil al mejor postor'],
  [/\bdesmercantilizaci[oó]n\b/gi, 'mercantilización obligatoria de la fuerza de trabajo'],
  [/\binviolable\b/gi, 'condicionada a la capacidad contributiva previa'],
  [/\bprogresiva\b/gi, 'regresiva basada en tasas de copago obligatorio'],
  [/\btercera\s+generaci[oó]n\b/gi, 'primera generación asistencialista y benéfica'],
 ];

 let changesCount = 0;
 for (const [rgx, replacement] of swaps) {
  if (rgx.test(m)) {
   m = m.replace(rgx, replacement);
   changesCount++;
   if (changesCount >= 2) break;
  }
 }

 if (changesCount === 0 && /\b(18\d{2}|19\d{2}|20[012]\d)\b/.test(m)) {
  m = m.replace(/\b(18\d{2}|19\d{2}|20[012]\d)\b/, (yr) =>
   String(Number(yr) + (variantIdx % 2 === 0 ? 14 : -12))
  );
  changesCount++;
 }

 if (changesCount === 0) {
  if (/\b(establece|reconoce|garantiza|configura|sit[uú]a|define|descansa|impone)\b/i.test(m)) {
   m = m.replace(
    /\b(establece|reconoce|garantiza|configura|sit[uú]a|define|descansa|impone)\b/i,
    'excluye expresamente del ámbito público y supedita a copago privado'
   );
  } else {
   m = m.replace(
    /\.$/,
    ', quedando supeditado en todo caso a carácter graciable y disponibilidad presupuestaria municipal sin generar derecho subjetivo.'
   );
  }
 }

 return m;
}

function generateMutatedQuestionsFromText(text, topicId, count = 10) {
 const topicObj = findTopicAcrossAllCatalogs(topicId);
 const topicShortTitle = topicObj
  ? topicObj.title.replace(/^(Tema\s+(General|Espec[ií]fico)?\s*\d+\.?|\d+\.-)\s*/i, '')
  : `el epígrafe ${topicId}`;

 const cleanSentences = extractCleanDoctrinalSentences(text);
 if (cleanSentences.length < 4) {
  return [];
 }

 const questionStems = [
  `[${topicId}] En relación con ${topicShortTitle}, señale cuál de las siguientes afirmaciones es jurídicamente y técnicamente CORRECTA:`,
  `[${topicId}] De acuerdo con el marco normativo y doctrinal desarrollado en este tema, indique la opción CORRECTA:`,
  `[${topicId}] Conforme a la regulación vigente en la Comunidad de Madrid y la doctrina del Trabajo Social analizada en este epígrafe, es CORRECTO afirmar que:`,
  `[${topicId}] Respecto a los principios, normas y modelos de intervención de este tema, señale la proposición VERDADERA:`,
 ];

 const totalToBuild = Math.min(count, cleanSentences.length);
 const generated = [];

 for (let i = 0; i < totalToBuild; i++) {
  const truth = cleanSentences[i];
  const other1 = cleanSentences[(i + 1) % cleanSentences.length];
  const other2 = cleanSentences[(i + 2) % cleanSentences.length];
  const other3 = cleanSentences[(i + 3) % cleanSentences.length];

  const false1 = falsifyDoctrinalSentence(other1, i + 1);
  const false2 = falsifyDoctrinalSentence(other2, i + 2);
  const false3 = falsifyDoctrinalSentence(other3, i + 3);

  const targetCorrectIdx = (i + topicId.charCodeAt(topicId.length - 1)) % 4;
  const rawOptions = [false1, false2, false3];
  rawOptions.splice(targetCorrectIdx, 0, truth);

  const labeledOptions = rawOptions.map(
   (optText, idx) => `${['A', 'B', 'C', 'D'][idx]}) ${optText}`
  );

  const qObj = {
   id: `q-mut-${topicId}-${Date.now()}-${i}`,
   topicId,
   difficulty:
    i % 2 === 0
     ? 'Alta (Contraste Doctrinal y Legal)'
     : 'Media (Precisión Normativa CAM)',
   originType: '🧬 GENERADOR DOCTRINAL INTELIGENTE',
   question: questionStems[i % questionStems.length],
   options: labeledOptions,
   correctIndex: targetCorrectIdx,
   explanation: `La única afirmación verdadera (${
    ['A', 'B', 'C', 'D'][targetCorrectIdx]
   }) recoge literalmente el contenido del tema: «${truth}» Las demás opciones contienen alteraciones deliberadas de plazos, leyes o naturaleza jurídica.`,
  };

  if (!isDefectiveOrAdminQuestion(qObj)) {
   generated.push(qObj);
  }
 }

 return generated;
}

function buildMonographicQuestionsForTopic(topicObj, existingDocs = []) {
 if (!topicObj) return [];
 const topicId = topicObj.id;
 const cleanTitle = topicObj.title.replace(
  /^(Tema\s+(General|Espec[ií]fico)?\s*\d+\.?|\d+\.-)\s*/i,
  ''
 );
 const domain = getDomainSpecificKnowledgeForTopic(topicObj);
 const epigraphs = extractSubEpigraphsFromTitle(topicObj.title);

 // 1. Si hay PDFs subidos para este tema, extraer primero sus preguntas literales y doctrinales limpias
 let fromDocs = [];
 existingDocs
  .filter((d) => d.topicId === topicId && d.text)
  .forEach((d) => {
   const lit = extractLiteralTestQuestionsFromPdf(d.text, topicId);
   const docQs = generateMutatedQuestionsFromText(d.text, topicId, 12);
   fromDocs = [...fromDocs, ...lit, ...docQs];
  });

 // 2. Construir preguntas específicas a partir de la Matriz Legal 2026, Dispositivos, Instrumentos y Autores del tema
 const lawStatement = `El marco normativo específico aplicable a «${cleanTitle}» se integra por: ${
  topicObj.lawUpdate || domain.marcoEspecifico
 }.`;
 const redStatement = `En el ámbito de la Comunidad de Madrid, la red de dispositivos y recursos vinculados a este epígrafe comprende: ${domain.dispositivosRed}`;
 const instrStatement = `Para la valoración diagnóstica e intervención técnica en esta materia se emplean como instrumentos específicos: ${domain.instrumentosEspecificos}`;
 const autorStatement = `La fundamentación teórica y epistemológica del Trabajo Social en este ámbito destaca las aportaciones de: ${domain.autoresDoctrina}`;
 const procStatement = `Conforme a la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid, el acceso a la Atención Social Primaria asigna como Profesional de Referencia exclusivo a un Trabajador/a Social (art. 16.2), quien formula el Plan Individual en 10 días hábiles (art. 40) y emite el Informe Social prescriptor (art. 69).`;

 const ep1 = epigraphs[0] || cleanTitle;
 const ep2 = epigraphs[1] || 'la organización y competencias del sistema';

 const specificPool = [
  {
   stem: `[${topicId}] ¿Cuál es el marco normativo vigente en 2026 directamente aplicable al epígrafe «${cleanTitle}»?`,
   truth: lawStatement,
   f1: falsifyDoctrinalSentence(redStatement, 1),
   f2: falsifyDoctrinalSentence(instrStatement, 2),
   f3: `Este epígrafe carece de regulación autonómica en la Comunidad de Madrid, rigiéndose exclusivamente por la beneficencia municipal discrecional de 1985.`,
  },
  {
   stem: `[${topicId}] En relación con la arquitectura institucional y la red de dispositivos de «${ep1}», señale la afirmación CORRECTA:`,
   truth: redStatement,
   f1: falsifyDoctrinalSentence(lawStatement, 2),
   f2: `La competencia sobre estos dispositivos corresponde en exclusiva a entidades mercantiles privadas sin supervisión de la Consejería ni registro administrativo.`,
   f3: falsifyDoctrinalSentence(procStatement, 3),
  },
  {
   stem: `[${topicId}] ¿Qué instrumentos técnicos, escalas y herramientas diagnósticas resultan de aplicación específica en «${cleanTitle}»?`,
   truth: instrStatement,
   f1: `Se prohíbe el uso de la Historia Social Única electrónica (Decreto 51/2023) y del Informe Social, bastando una nota verbal sin firma facultativa.`,
   f2: falsifyDoctrinalSentence(autorStatement, 1),
   f3: falsifyDoctrinalSentence(redStatement, 3),
  },
  {
   stem: `[${topicId}] Desde la perspectiva doctrinal y metodológica del Trabajo Social aplicable a «${ep2}», indique la opción VERDADERA:`,
   truth: autorStatement,
   f1: falsifyDoctrinalSentence(instrStatement, 1),
   f2: `La doctrina contemporánea propugna el retorno al modelo asilar y graciable del siglo XIX, suprimiendo el enfoque de derechos subjetivos.`,
   f3: falsifyDoctrinalSentence(procStatement, 2),
  },
  {
   stem: `[${topicId}] Respecto a las garantías procedimentales y reserva legal del Trabajo Social en materia de «${cleanTitle}», es CORRECTO afirmar que:`,
   truth: procStatement,
   f1: `El Plan Individual de Atención Social tiene un plazo de elaboración de 90 días naturales y puede ser prescrito por cualquier auxiliar administrativo sin titulación en Trabajo Social.`,
   f2: falsifyDoctrinalSentence(lawStatement, 3),
   f3: falsifyDoctrinalSentence(redStatement, 2),
  },
 ];

 const builtSpecific = specificPool.map((item, idx) => {
  const correctIdx = (idx + topicId.charCodeAt(topicId.length - 1)) % 4;
  const opts = [item.f1, item.f2, item.f3];
  opts.splice(correctIdx, 0, item.truth);
  return {
   id: `q-mono-${topicId}-${idx}`,
   topicId,
   difficulty: 'Oficial Monográfico del Tema',
   originType: '🎯 TEST MONOGRÁFICO DEL EPÍGRAFE',
   question: item.stem,
   options: opts.map((t, i) => `${['A', 'B', 'C', 'D'][i]}) ${t}`),
   correctIndex: correctIdx,
   explanation: `Respuesta verificada conforme a la matriz oficial del tema [${topicId}]: ${item.truth}`,
  };
 });

 return [...fromDocs, ...builtSpecific];
}

function buildCaseResolutionText(c) {
 return `1. ENCUADRE METODOLÓGICO Y RECEPCIÓN DE LA DEMANDA (${c.badge.toUpperCase()})
Ante el supuesto práctico planteado ("${
  c.enunciado
 }"), el/la profesional de Trabajo Social articula una respuesta integral desde el Sistema Público de Servicios Sociales y de Salud aplicando el método científico del Trabajo Social (estudio-investigación, diagnóstico social, planificación, ejecución y evaluación) conforme a las aportaciones teóricas de Mary Richmond, Gordon Hamilton y el modelo sistémico-ecológico. Toda la actuación se rige por los principios de universalidad, atención centrada en la persona, prevención e interdisciplinariedad consagrados en la Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid y el Código Deontológico de Trabajo Social.

2. RECOGIDA DE INFORMACIÓN, TÉCNICAS E INSTRUMENTOS ESPECÍFICOS Y ESCALAS VALIDADAS
Se realiza entrevista individual y familiar de acogida, visita domiciliaria de valoración contextual y consulta de antecedentes en la Historia Social Única interoperable (y, en el ámbito sanitario del Servicio Madrileño de Salud, en adelante SERMAS, a través de la historia clínica electrónica HCIS y el Visor Horus). Se cumplimentan la Ficha Social, el Genograma trigeneracional, el Ecomapa de redes de apoyo y el Informe Social como dictamen técnico facultativo.
Para objetivar la valoración del caso concreto se aplican las siguientes escalas e instrumentos técnicos: ${
  c.escalasEspecificas
 }

3. DIAGNÓSTICO SOCIAL DIFERENCIAL, FACTORES DE RIESGO Y PRONÓSTICO POR ÁREAS
A partir del estudio técnico se formula la hipótesis diagnóstica identificando indicadores de vulnerabilidad en las áreas:
a) Área personal, de salud y autonomía funcional: valoración de las limitaciones en las actividades de la vida diaria y necesidades de apoyo o tratamiento especializado.
b) Área convivencial, relacional y de protección jurídica: detección de situaciones de desprotección, urgencia social, sobrecarga familiar o conflicto requeridor de medidas de apoyo o amparo administrativo/judicial.
c) Área socioeconómica, formativo-laboral y de vivienda: carencia o insuficiencia de rentas, barreras arquitectónicas o vulnerabilidad residencial.
Sin una intervención interinstitucional coordinada a corto plazo, el pronóstico evolutivo sería desfavorable por riesgo de cronificación y exclusión social severa.

4. MARCO NORMATIVO VIGENTE APLICABLE AL SUPUESTO (2026)
El encuadre jurídico del supuesto se fundamenta en la Constitución Española (en adelante, CE, artículos 9.2, 10.1, 14, 39, 43 y nuevo artículo 49 reformado en 2024), el Estatuto de Autonomía de la Comunidad de Madrid (Ley Orgánica 3/1983), la Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Común de las Administraciones Públicas (en adelante, LPAC) y la Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid (que derogó la antigua Ley 11/2003).
De manera específica para la materia nuclear de este supuesto resultan de aplicación directa: ${
  c.normativaEspecifica
 }

5. FORMULACIÓN DE OBJETIVOS (OBJETIVO GENERAL Y OBJETIVOS ESPECÍFICOS OPERATIVOS)
- Objetivo General: Restablecer la protección jurídica, el bienestar biopsicosocial y la autonomía personal e integración comunitaria de las personas afectadas mediante el diseño y ejecución consensuada de su Plan Individual de Atención Social (en adelante, PIAS).
- Objetivos Específicos:
 1) Garantizar en las primeras 24 a 72 horas la cobertura de urgencia, seguridad personal y contención del riesgo detectado.
 2) Tramitar las prestaciones garantizadas (exigibles como derecho subjetivo) y condicionadas del catálogo vigente en la Comunidad de Madrid y el Ayuntamiento de Madrid.
 3) Consolidar la red de apoyo interinstitucional y familiar evitando la sobrecarga o desvinculación terapéutica.

6. DISEÑO DEL PLAN INDIVIDUAL DE ATENCIÓN SOCIAL (PIAS), PRESTACIONES Y TRABAJO EN RED
${c.intervencionEspecifica}
c) Articulación del Trabajo en Red Interinstitucional: El/la Trabajador/a Social como Profesional de Referencia coordina las actuaciones entre la Atención Social Primaria (puerta de entrada territorializada), la Atención Social Especializada (Agencia Madrileña de Atención Social, Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad, Red de Infancia o Violencia de Género), los dispositivos sanitarios de Atención Primaria, Hospitalaria y Salud Mental del SERMAS, los recursos municipales (SAMUR Social, Madrid Salud, Centros de Apoyo a las Familias), el ámbito educativo y el Ministerio Fiscal.

7. EVALUACIÓN, INDICADORES CUANTITATIVOS Y CUALITATIVOS, CRONOGRAMA Y PROTECCIÓN DE DATOS
Se establece una evaluación ex ante (diagnóstica), continua/intermedia (a los tres meses hábiles) y final (a los seis meses, coincidiendo con los plazos máximos de resolución administrativa de la LPAC y del Decreto 54/2015).
- Indicadores cuantitativos: Porcentaje de objetivos del PIAS ejecutados en plazo, tiempos de acceso efectivo a las prestaciones garantizadas y variación numérica en las escalas aplicadas (Escala de Gijón, Zarit o Barthel).
- Indicadores cualitativos: Grado de satisfacción percibida por la persona usuaria, calidad de la alianza terapéutica y fortalecimiento de su red natural.
Todo el tratamiento documental observa el deber de secreto profesional y el Reglamento General de Protección de Datos (en adelante, RGPD) junto con la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales.`;
}

// 2B. ARQUITECTURA DESACOPLADA (REACT.MEMO · CERO LAG · ONBOARDING COPILOTO)
const IsolatedFlowTimer = memo(function IsolatedFlowTimer({
 netStudyMinutes,
 onIncrementNetMinute,
}) {
 const [timer, setTimer] = useState({ isRunning: false, secondsLeft: 3600 });

 useEffect(() => {
  if (!timer.isRunning) return;
  const interval = setInterval(() => {
   setTimer((prev) => {
    if (prev.secondsLeft <= 1) {
     return { ...prev, isRunning: false, secondsLeft: 0 };
    }
    if (prev.secondsLeft % 60 === 0 && onIncrementNetMinute) {
     onIncrementNetMinute();
    }
    return { ...prev, secondsLeft: prev.secondsLeft - 1 };
   });
  }, 1000);
  return () => clearInterval(interval);
 }, [timer.isRunning, onIncrementNetMinute]);

 return (
  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-300 text-xs">
   <span className="font-mono font-extrabold text-amber-900 dark:text-amber-300">
    ⏱ {Math.floor(timer.secondsLeft / 60)}:
    {String(timer.secondsLeft % 60).padStart(2, '0')}
   </span>
   <button
    onClick={() => setTimer((p) => ({ ...p, isRunning: !p.isRunning }))}
    className="px-2 py-0.5 rounded bg-[#D97757] text-white font-bold text-[10px] cursor-pointer"
    title="Cronómetro aislado con React.memo (0 re-renderizados globales)"
   >
    {timer.isRunning ? '⏸' : '▶ 60m'}
   </button>
   <span
    className="hidden sm:inline text-[10px] text-stone-500 font-bold"
    title="Tiempo neto real acumulado"
   >
    ({netStudyMinutes}m)
   </span>
  </div>
 );
});

const ZeroLagBufferedTextarea = memo(function ZeroLagBufferedTextarea({
 value,
 onCommit,
 rows = 16,
 placeholder = '',
 className = '',
 showPacingBar = false,
}) {
 const [localText, setLocalText] = useState(value || '');
 const debounceRef = useRef(null);
 const latestValueRef = useRef(value || '');
 const onCommitRef = useRef(onCommit);
 onCommitRef.current = onCommit;

 useEffect(() => {
  if (value !== latestValueRef.current) {
   setLocalText(value || '');
   latestValueRef.current = value || '';
  }
 }, [value]);

 useEffect(() => {
  return () => {
   if (debounceRef.current) {
    clearTimeout(debounceRef.current);
    debounceRef.current = null;
   }
  };
 }, []);

 const handleChange = (e) => {
  const nextVal = e.target.value;
  setLocalText(nextVal);
  latestValueRef.current = nextVal;
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
   debounceRef.current = null;
   if (onCommitRef.current) onCommitRef.current(nextVal);
  }, 260);
 };

 const handleBlur = () => {
  if (debounceRef.current) {
   clearTimeout(debounceRef.current);
   debounceRef.current = null;
   if (onCommitRef.current) onCommitRef.current(latestValueRef.current);
  }
 };

 const wCount = useMemo(
  () => (localText.trim() ? localText.trim().split(/\s+/).length : 0),
  [localText]
 );
 const pct = Math.min(100, Math.round((wCount / 1850) * 100));
 const barColor =
  wCount < 1350
   ? 'bg-amber-500'
   : wCount <= 2450
   ? 'bg-emerald-600'
   : 'bg-rose-600';

 return (
  <div className="space-y-2">
   {showPacingBar && (
    <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border text-[11px] space-y-1.5">
     <div className="flex flex-wrap justify-between items-center gap-2">
      <span className="font-bold">
       ⚡ Editor Fluido 60fps (Buffer Anti-Lag Activo):{' '}
       <b className="text-[#D97757]">{wCount} palabras</b> (~
       {Math.round(wCount / 23)} min a bolígrafo · ~
       {Math.max(1, Math.round(wCount / 130))} min lectura al Tribunal)
      </span>
      <span className="font-extrabold">
       {wCount < 1350
        ? '🟡 Corto (<1.350 pal)'
        : wCount <= 2450
        ? '🟢 Zona Óptima de 10 (1.350 - 2.450 pal)'
        : '🔴 Extenso (>2.450 pal · Usa Limpiar Cabeceras)'}
      </span>
     </div>
     <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
      <div
       className={`h-full transition-all ${barColor}`}
       style={{ width: `${pct}%` }}
      />
     </div>
    </div>
   )}
   <textarea
    rows={rows}
    value={localText}
    onChange={handleChange}
    onBlur={handleBlur}
    placeholder={placeholder}
    className={className}
   />
  </div>
 );
});

const StrategicHighlighterViewer = memo(function StrategicHighlighterViewer({
 text = '',
}) {
 const [highlightActive, setHighlightActive] = useState(true);
 const [showLawsGreen, setShowLawsGreen] = useState(true);
 const [showAuthorsYellow, setShowAuthorsYellow] = useState(true);
 const [showDeadlinesPink, setShowDeadlinesPink] = useState(true);
 const [visualSkeletonOnly, setVisualSkeletonOnly] = useState(false);

 const parsedBlocks = useMemo(() => {
  if (!text) return { paragraphs: [], counts: { laws: 0, authors: 0, deadlines: 0 } };

  const tokenRegex = new RegExp(
   [
    // Grupo 1: Leyes, Decretos, Artículos y Normativa (VERDE)
    '(\\b(?:Constituci[oó]n\\s+Espa[ñn]ola|Ley\\s+Org[aá]nica\\s+\\d+\\/\\d{4}|Ley\\s+\\d+\\/\\d{4}|Real\\s+Decreto(?:-Ley|\\s+Legislativo)?\\s+\\d+\\/\\d{4}|Decreto\\s+\\d+\\/\\d{4}|Orden(?:anza)?\\s+\\d+\\/\\d{4}|Art(?:[ií]culos?|\\.)\\s*\\d+(?:\\.\\d+)?(?:\\s+a\\s+\\d+)?|TREBEP|LPAC|LRJSP|LOPIVI|LOSCAM|LAPAD|HSUe|SIUSS|PIAS|PIIS|RGPD|Código\\s+Deontol[oó]gico)\\b)',
    // Grupo 2: Autores, Escuelas y Modelos Teóricos (AMARILLO)
    '(\\b(?:Mary\\s+(?:Ellen\\s+)?Richmond|Gordon\\s+Hamilton|Helen\\s+(?:Harris\\s+)?Perlman|Urie\\s+Bronfenbrenner|Avedis\\s+Donabedian|G[øo]sta\\s+Esping-Andersen|Richard\\s+Titmuss|T\\.?\\s*H\\.?\\s*Marshall|William\\s+Beveridge|Otto\\s+von\\s+Bismarck|Adela\\s+Cortina|Robert\\s+Castel|Amartya\\s+Sen|Ida\\s+Cannon|Richard\\s+Cabot|Amaya\\s+Ituarte|Dolors\\s+Colom|George\\s+Engel|W\\.?\\s*Edwards\\s+Deming|Ezequiel\\s+Ander-Egg|Aguilar\\s+Id[aá][ñn]ez|Joseba\\s+Achotegui|S[ií]ndrome\\s+de\\s+Ulises|Carlos\\s+Gim[eé]nez|Kimberl[eé]\\s+Crenshaw|Prochaska\\s+y\\s+DiClemente|Miller\\s+y\\s+Rollnick|Marlatt|John\\s+Bowlby|Mary\\s+Ainsworth|Jorge\\s+Barudy|Salvador\\s+Minuchin|Teresa\\s+Mart[ií]nez|Mike\\s+Oliver|Natalio\\s+Kisnerman|Teresa\\s+Zamanillo|Howard\\s+Brody|Rita\\s+Payton|Beauchamp\\s+y\\s+(?:James\\s+F\\.\\s+)?Childress|Diego\\s+Gracia|Jonathan\\s+Bradshaw|Maslach|Watzlawick|Antonovsky|Sherry\\s+Arnstein)\\b)',
    // Grupo 3: Plazos, Baremos, Puntuaciones y Cifras Clave (ROSA)
    '(\\b(?:(?:\\d+|diez|quince|veinte|treinta|veinticuatro|cuarenta\\s+y\\s+ocho|setenta\\s+y\\s+dos|dos|tres|cuatro|cinco|seis|doce)\\s+(?:d[ií]as?(?:\\s+h[aá]biles|\\s+naturales)?|meses|a[ñn]os?|horas?)|\\d+(?:[.,]\\d+)?\\s*%|\\d+\\s+a\\s+\\d+\\s+puntos|Grado\\s+(?:I|II|III)|Clase\\s+[0-4]|Escala\\s+de\\s+Gij[oó]n|Escala\\s+de\\s+Zarit|[IÍ]ndice\\s+de\\s+Barthel|Lawton-Brody|VAL[OÓ]RAME|BVD|EVE|silencio\\s+(?:administrativo\\s+)?(?:negativo|desestimatorio|positivo))\\b)',
   ].join('|'),
   'gi'
  );

  let lawsCount = 0;
  let authorsCount = 0;
  let deadlinesCount = 0;

  const rawParas = text.split(/\n+/);
  const paragraphs = rawParas.map((para) => {
   const isHeading = /^\s*(?:\d+\.|ACTO\s+[IVX]+:|EP[IÍ]LOGO)/i.test(para);
   const parts = [];
   let lastIdx = 0;
   let m;
   tokenRegex.lastIndex = 0;

   while ((m = tokenRegex.exec(para)) !== null) {
    if (m.index > lastIdx) {
     parts.push({ type: 'text', value: para.slice(lastIdx, m.index) });
    }
    if (m[1]) {
     lawsCount++;
     parts.push({ type: 'law', value: m[0] });
    } else if (m[2]) {
     authorsCount++;
     parts.push({ type: 'author', value: m[0] });
    } else if (m[3]) {
     deadlinesCount++;
     parts.push({ type: 'deadline', value: m[0] });
    }
    lastIdx = tokenRegex.lastIndex;
   }
   if (lastIdx < para.length) {
    parts.push({ type: 'text', value: para.slice(lastIdx) });
   }
   return { isHeading, parts };
  });

  return {
   paragraphs,
   counts: { laws: lawsCount, authors: authorsCount, deadlines: deadlinesCount },
  };
 }, [text]);

 return (
  <div className="space-y-3">
   <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 space-y-2.5 text-xs shadow-2xs">
    <div className="flex flex-wrap justify-between items-center gap-2">
     <div>
      <span className="text-[10px] font-extrabold uppercase text-[#D97757] block">
       🎨 SISTEMA DE MEMORIA FOTOGRÁFICA Y SUBRAYADO ESTRATÉGICO TRICOLOR (ANCLAJE ESPACIAL DE EXAMEN)
      </span>
      <span className="text-[11px] text-stone-600 dark:text-stone-300">
       Tu cerebro recuerda posiciones y manchas de color ante el folio en blanco: activa o filtra cada capa cromática.
      </span>
     </div>
     <div className="flex flex-wrap gap-1.5">
      <button
       onClick={() => setHighlightActive(!highlightActive)}
       className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] cursor-pointer transition ${
        highlightActive
         ? 'bg-slate-900 text-white'
         : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
       }`}
      >
       {highlightActive ? '🎨 Subrayado Tricolor: ON' : '📄 Texto Plano: OFF'}
      </button>
      <button
       onClick={() => {
        setHighlightActive(true);
        setVisualSkeletonOnly(!visualSkeletonOnly);
       }}
       className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] cursor-pointer border transition ${
        visualSkeletonOnly
         ? 'bg-indigo-700 text-white border-indigo-800 shadow-xs'
         : 'bg-indigo-50 dark:bg-stone-800 text-indigo-900 dark:text-indigo-300 border-indigo-300'
       }`}
       title="Difumina el texto secundario y deja brillar solo los títulos y los manchones de color para fijar la foto mental del tema"
      >
       {visualSkeletonOnly
        ? '👁️ Viendo Solo Manchones Fotográficos (Ver Todo)'
        : '📸 Modo Foto Mental (Difuminar Relleno)'}
      </button>
     </div>
    </div>

    {highlightActive && (
     <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
      <button
       onClick={() => setShowLawsGreen(!showLawsGreen)}
       className={`px-3 py-1 rounded-xl font-extrabold text-[11px] cursor-pointer border transition flex items-center gap-1.5 ${
        showLawsGreen
         ? 'bg-emerald-200/90 text-emerald-950 border-emerald-500 shadow-2xs'
         : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-300 line-through'
       }`}
      >
       <span>🟢 Leyes, Decretos y Artículos</span>
       <span className="px-1.5 py-0.2 rounded-full bg-white/80 text-emerald-900 text-[10px]">
        {parsedBlocks.counts.laws}
       </span>
      </button>

      <button
       onClick={() => setShowAuthorsYellow(!showAuthorsYellow)}
       className={`px-3 py-1 rounded-xl font-extrabold text-[11px] cursor-pointer border transition flex items-center gap-1.5 ${
        showAuthorsYellow
         ? 'bg-amber-200/90 text-amber-950 border-amber-500 shadow-2xs'
         : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-300 line-through'
       }`}
      >
       <span>🟡 Autores, Escuelas y Doctrina</span>
       <span className="px-1.5 py-0.2 rounded-full bg-white/80 text-amber-900 text-[10px]">
        {parsedBlocks.counts.authors}
       </span>
      </button>

      <button
       onClick={() => setShowDeadlinesPink(!showDeadlinesPink)}
       className={`px-3 py-1 rounded-xl font-extrabold text-[11px] cursor-pointer border transition flex items-center gap-1.5 ${
        showDeadlinesPink
         ? 'bg-pink-200/90 text-pink-950 border-pink-500 shadow-2xs'
         : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-300 line-through'
       }`}
      >
       <span>🩷 Plazos, Baremos y Escalas</span>
       <span className="px-1.5 py-0.2 rounded-full bg-white/80 text-pink-900 text-[10px]">
        {parsedBlocks.counts.deadlines}
       </span>
      </button>
     </div>
    )}
   </div>

   <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border font-serif text-xs leading-loose max-h-[65vh] overflow-y-auto shadow-inner space-y-3">
    {parsedBlocks.paragraphs.map((p, pIdx) => (
     <p
      key={pIdx}
      className={
       p.isHeading
        ? 'font-sans font-extrabold text-sm text-slate-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg border-l-4 border-[#D97757] mt-3'
        : 'text-slate-800 dark:text-stone-200'
      }
     >
      {p.parts.map((part, idx) => {
       if (!highlightActive || part.type === 'text') {
        return (
         <span
          key={idx}
          className={
           visualSkeletonOnly && !p.isHeading
            ? 'opacity-20 hover:opacity-100 transition-opacity'
            : ''
          }
         >
          {part.value}
         </span>
        );
       }
       if (part.type === 'law' && showLawsGreen) {
        return (
         <mark
          key={idx}
          className="bg-emerald-200/90 dark:bg-emerald-800/80 text-emerald-950 dark:text-emerald-100 font-bold px-1 py-0.5 rounded mx-0.5 border-b-2 border-emerald-500"
         >
          {part.value}
         </mark>
        );
       }
       if (part.type === 'author' && showAuthorsYellow) {
        return (
         <mark
          key={idx}
          className="bg-amber-200/95 dark:bg-amber-700/80 text-amber-950 dark:text-amber-100 font-bold px-1 py-0.5 rounded mx-0.5 border-b-2 border-amber-500"
         >
          {part.value}
         </mark>
        );
       }
       if (part.type === 'deadline' && showDeadlinesPink) {
        return (
         <mark
          key={idx}
          className="bg-pink-200/95 dark:bg-pink-800/80 text-pink-950 dark:text-pink-100 font-bold px-1 py-0.5 rounded mx-0.5 border-b-2 border-pink-500"
         >
          {part.value}
         </mark>
        );
       }
       return (
        <span
         key={idx}
         className={
          visualSkeletonOnly && !p.isHeading
           ? 'opacity-20 hover:opacity-100 transition-opacity'
           : ''
         }
        >
         {part.value}
        </span>
       );
      })}
     </p>
    ))}
   </div>
  </div>
 );
});

const InteractiveOnboardingModal = memo(function InteractiveOnboardingModal({
 isOpen,
 onClose,
 isSimplifiedMode,
 onToggleSimplifiedMode,
 onNavigateModule,
}) {
 const [step, setStep] = useState(0);
 if (!isOpen) return null;

 const steps = [
  {
   badge: 'PASO 1 DE 4 · FLUJO DE DOBLE SALIDA (PDFs ➔ TEST Y DESARROLLO)',
   title: 'Cómo subir tus temas y dejar que la plataforma trabaje por ti',
   body: 'Cuando subes tus archivos PDF en la pestaña «01 · Temario» o «04 · Desarrollo Ej. 2», el motor detecta automáticamente si es un Tratado Extenso (extrae sus 20 preguntas literales al Banco, el Caso Práctico en 5 pasos al Módulo 05 y el Glosario/Micro-Retos al Módulo 06) o si es una Narración en 5 Actos (limpia cabeceras, numera los 5 Actos, despliega siglas prohibidas y lo archiva listo para estudiar en la Biblioteca Limpia 04B).',
   actionLabel: '📚 Ir a 01 · Temario Oficial',
   targetMod: '01',
  },
  {
   badge: 'PASO 2 DE 4 · ALGORITMO LEITNER Y GESTIÓN DEL RIESGO 50/50',
   title: 'Cómo ganar puntos netos en el Test y no olvidar lo estudiado',
   body: 'Cada pregunta que fallas o dejas en blanco entra automáticamente en tu «Caja 1 Leitner (+24h)». Además, durante cualquier simulacro puedes pulsar «⚖️ Marcar Duda entre 2 Opciones»: la app descarta visualmente las otras dos alternativas y al finalizar calcula cuántos puntos netos has ganado arriesgando con Esperanza Matemática positiva (+0,33 en CAM/Ayto y +0,375 en SERMAS).',
   actionLabel: '⚡ Ir a 03 · Simulacros y Cloze',
   targetMod: '03',
  },
  {
   badge: 'PASO 3 DE 4 · VELOCIDAD MANUSCRITA Y TELEPROMPTER DE TRIBUNAL',
   title: 'Entrena la escritura a bolígrafo (80-90m) y la lectura pública',
   body: 'En «04 · Desarrollo Ej. 2» y «05 · Prácticos Ej. 3» dispones del Sorteo de 2 Bolas a ciegas, el Checklist en vivo de los 7 bloques del Tribunal y el Teleprompter Oral a 130 palabras/minuto, que marca en amarillo las frases de más de 45 palabras (🫁 [RESPIRA]) y en verde esmeralda los conectores analíticos (🎯 [ÉNFASIS TRIBUNAL]) para levantar la vista ante el Tribunal.',
   actionLabel: '✍️ Ir a 04 · Desarrollo Ej. 2',
   targetMod: '04',
  },
  {
   badge: 'PASO 4 DE 4 · MODO ESENCIAL VS MODO EXPERTO Y GRUPO DE ESTUDIO',
   title: 'Adapta la densidad visual con 1 clic y comparte con tus amigas',
   body: 'Si en algún momento tú o tus compañeras de grupo preferís una pantalla más limpia sin métricas avanzadas ni tablas técnicas, activa abajo el «🌱 Modo Esencial (Sin Sobrecarga)». Tus datos, notas y Cajas Leitner son 100% privados en tu perfil, y podéis intercambiar paquetes de preguntas sin duplicados desde la pestaña 06.',
   actionLabel: '🎯 Empezar en 00 · Mi Plan Diario',
   targetMod: '00',
  },
 ];

 const current = steps[step];

 return (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
   <div className="bg-white dark:bg-stone-900 max-w-2xl w-full rounded-2xl p-6 border-2 border-[#D97757] shadow-2xl space-y-4">
    <div className="flex justify-between items-center border-b pb-3">
     <div>
      <span className="text-[10px] font-extrabold text-[#D97757] uppercase block">
       🧭 GUÍA RÁPIDA DE BIENVENIDA Y MANUAL DE VUELO (ONBOARDING 60 SEG)
      </span>
      <h3 className="text-base font-extrabold mt-0.5">{current.title}</h3>
     </div>
     <button
      onClick={onClose}
      className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-xs font-bold cursor-pointer"
     >
      ✕ Cerrar Guía
     </button>
    </div>

    <div className="flex gap-1.5">
     {steps.map((_, idx) => (
      <button
       key={idx}
       onClick={() => setStep(idx)}
       className={`h-2 flex-1 rounded-full cursor-pointer transition ${
        idx === step
         ? 'bg-[#D97757]'
         : idx < step
         ? 'bg-emerald-600'
         : 'bg-stone-200 dark:bg-stone-700'
       }`}
      />
     ))}
    </div>

    <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2.5 text-xs leading-relaxed">
     <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">
      {current.badge}
     </span>
     <p className="text-stone-700 dark:text-stone-200 text-xs pt-1">
      {current.body}
     </p>
    </div>

    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
     <div>
      <b className="text-emerald-950 dark:text-emerald-200 block">
       🎚️ Selector de Densidad de Interfaz (Para ti o tus compañeras):
      </b>
      <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
       {isSimplifiedMode
        ? '🌱 Modo Esencial Activo: Oculta métricas secundarias y deja solo lo básico.'
        : '🚀 Modo Experto Tribunal Activo: Muestra todas las métricas, baremos y auditorías.'}
      </span>
     </div>
     <button
      onClick={onToggleSimplifiedMode}
      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer shrink-0 transition ${
       isSimplifiedMode
        ? 'bg-emerald-700 text-white'
        : 'bg-slate-900 text-white'
      }`}
     >
      {isSimplifiedMode
       ? '🌱 Modo Esencial (Cambiar a Experto)'
       : '🚀 Modo Experto (Cambiar a Esencial)'}
     </button>
    </div>

    <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t">
     <button
      disabled={step === 0}
      onClick={() => setStep((s) => Math.max(0, s - 1))}
      className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold cursor-pointer disabled:opacity-40"
     >
      ← Paso Anterior
     </button>

     <div className="flex gap-2">
      <button
       onClick={() => {
        onNavigateModule(current.targetMod);
        onClose();
       }}
       className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
      >
       {current.actionLabel}
      </button>

      {step < steps.length - 1 ? (
       <button
        onClick={() => setStep((s) => s + 1)}
        className="px-4 py-2 rounded-xl bg-[#D97757] text-white text-xs font-extrabold cursor-pointer"
       >
        Siguiente Paso →
       </button>
      ) : (
       <button
        onClick={onClose}
        className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
       >
        ✔ ¡Entendido, a por la plaza!
       </button>
      )}
     </div>
    </div>
   </div>
  </div>
 );
});

// 3. COMPONENTE PRINCIPAL APP
export default function App() {
 const [activeModule, setActiveModule] = useState('00');
 const [selectedCleanEj2Id, setSelectedCleanEj2Id] = useState(null);
 const [isHeaderCompact, setIsHeaderCompact] = useState(false);
 const [ej2SubTab, setEj2SubTab] = useState('clean'); // 'clean' (04B Archivo Limpio) | 'workshop' (04 Taller Editor)
 const [plazosDuelOpen, setPlazosDuelOpen] = useState(false);
 const [plazosFilter, setPlazosFilter] = useState('Todos');
 const [bankSubTab, setBankSubTab] = useState('questions'); // 'questions' | 'pdfs'
 const [pdfLabViewMode, setPdfLabViewMode] = useState('only_with_pdfs'); // 'only_with_pdfs' | 'all_topics' | 'flat_files'
 const [pdfLabBlockFilter, setPdfLabBlockFilter] = useState('Todos');
 const [pdfLabSearch, setPdfLabSearch] = useState('');
 const [memoriaSubTab, setMemoriaSubTab] = useState('all'); // 'all' | 'retos' | 'glosario' | 'cuentos' | 'grupo'
 const [onlyReviewFlashcards, setOnlyReviewFlashcards] = useState(false);
 const [collapsedStories, setCollapsedStories] = useState({});
 const [practicalBlindSim, setPracticalBlindSim] = useState({
  isActive: false,
  secondsLeft: 5400,
  isRunning: false,
  activeCaseBadge: '',
  activeEnunciado: '',
 });
 const [activeCaseReferenceSolution, setActiveCaseReferenceSolution] =
  useState('');
 const [showSideBySideCritique, setShowSideBySideCritique] = useState(false);
 const [humanCritiqueChecks, setHumanCritiqueChecks] = useState({
  c1_diagnostico: false,
  c2_bioetica: false,
  c3_derechoSubjetivo: false,
  c4_redCompetencial: false,
  c5_indicadoresMedibles: false,
 });

 // SIMULACRO DÍA D (MODO RESISTENCIA Y FATIGA EXTREMA: TEST ➔ DESCANSO 15M ➔ DESARROLLO 2 BOLAS)
 const [diaDSimulator, setDiaDSimulator] = useState({
  isOpen: false,
  stage: 1, // 1: Test Oficial | 2: Descanso Reglamentario 15m | 3: Desarrollo 2 Bolas bajo Fatiga | 4: Acta Final Día D
  secondsLeft: 5100,
  isRunning: false,
  testQuestions: [],
  testAnswers: {},
  testCurrentIdx: 0,
  testGradeOver10: null,
  testHits: 0,
  testErrors: 0,
  ball1: null,
  ball2: null,
  chosenBall: null,
  essayDraft: '',
  essayAudit: null,
 });

 useEffect(() => {
  if (!diaDSimulator.isOpen || !diaDSimulator.isRunning) return;
  const t = setInterval(() => {
   setDiaDSimulator((prev) => {
    if (!prev.isOpen || !prev.isRunning) return prev;
    if (prev.secondsLeft <= 1) {
     return { ...prev, isRunning: false, secondsLeft: 0 };
    }
    return { ...prev, secondsLeft: prev.secondsLeft - 1 };
   });
  }, 1000);
  return () => clearInterval(t);
 }, [diaDSimulator.isOpen, diaDSimulator.isRunning]);

 useEffect(() => {
  if (!practicalBlindSim.isActive || !practicalBlindSim.isRunning) return;
  const t = setInterval(() => {
   setPracticalBlindSim((prev) => {
    if (prev.secondsLeft <= 1)
     return { ...prev, isRunning: false, secondsLeft: 0 };
    return { ...prev, secondsLeft: prev.secondsLeft - 1 };
   });
  }, 1000);
  return () => clearInterval(t);
 }, [practicalBlindSim.isActive, practicalBlindSim.isRunning]);
 const [theme, setTheme] = useState(
  () => localStorage.getItem('cam_theme_v5') || 'light'
 );
 const isDark = theme === 'dark';
 const [statusBanner, setStatusBanner] = useState('');

 useEffect(() => {
  if (!statusBanner) return;
  const t = setTimeout(() => setStatusBanner(''), 5000);
  return () => clearTimeout(t);
 }, [statusBanner]);

 // 1. SELECTOR MULTI-CONVOCATORIA ('cam_a2' | 'sermas' | 'ayto')
 const [activeConvocatoria, setActiveConvocatoria] = useState(
  () => localStorage.getItem('cam_convocatoria_v5') || 'cam_a2'
 );

 // 2. AISLAMIENTO MULTI-USUARIO (3 Perfiles Privados)
 const [customNames, setCustomNames] = useState(() => {
  const saved = localStorage.getItem('cam_group_names_v5');
  return saved
   ? JSON.parse(saved)
   : { admin: 'Azucena', colab: 'Amiga 1', rev: 'Amiga 2' };
 });
 const [activeProfile, setActiveProfile] = useState(
  () => localStorage.getItem('cam_profile_v5') || 'admin'
 );

 const PROFILES = {
  admin: {
   id: 'admin',
   name: customNames.admin,
   role: 'Administradora',
   desc: 'Gestiona documentos, temario oficial y configuración. Datos 100% privados.',
  },
  colab: {
   id: 'colab',
   name: customNames.colab,
   role: 'Colaboradora',
   desc: 'Propone preguntas y sube materiales. Datos 100% privados.',
  },
  rev: {
   id: 'rev',
   name: customNames.rev,
   role: 'Revisora',
   desc: 'Valida preguntas antes de pasarlas al banco común. Datos 100% privados.',
  },
 };

 const loadPrivateUserData = (profileId) => {
  const td = localStorage.getItem(`cam_priv5_topic_${profileId}`);
  const fq = localStorage.getItem(`cam_priv5_failed_${profileId}`);
  const lb = localStorage.getItem(`cam_priv5_leitner_${profileId}`);
  const ec = localStorage.getItem(`cam_priv5_causes_${profileId}`);
  const eh = localStorage.getItem(`cam_priv5_history_${profileId}`);
  const grades = localStorage.getItem(`cam_priv5_grades_${profileId}`);
  const plan = localStorage.getItem(`cam_priv5_plan_${profileId}`);
  const netMin = localStorage.getItem(`cam_priv5_netmin_${profileId}`);

  const parsedGrades = grades
   ? JSON.parse(grades)
   : { ej1: 7.8, ej2: 9.6, ej3: 9.5 };
  const parsedPlan = plan
   ? JSON.parse(plan)
   : {
     activePhase: 'fase3',
     completedBlocksToday: {},
     pausedSimSession: null,
    };

  return {
   topicData: td ? JSON.parse(td) : {},
   failedQuestionIds: fq ? JSON.parse(fq) : [],
   leitnerBoxes: lb ? JSON.parse(lb) : {},
   errorCausesLog: ec ? JSON.parse(ec) : {},
   examHistory: eh ? JSON.parse(eh) : [],
   grades: parsedGrades,
   studyPlan: parsedPlan,
   netStudyMinutes: netMin ? Number(netMin) : 0,
  };
 };

 const [topicData, setTopicData] = useState(
  () => loadPrivateUserData(activeProfile).topicData
 );
 const [failedQuestionIds, setFailedQuestionIds] = useState(
  () => loadPrivateUserData(activeProfile).failedQuestionIds
 );
 const [leitnerBoxes, setLeitnerBoxes] = useState(
  () => loadPrivateUserData(activeProfile).leitnerBoxes
 );
 const [errorCausesLog, setErrorCausesLog] = useState(
  () => loadPrivateUserData(activeProfile).errorCausesLog
 );
 const [examHistory, setExamHistory] = useState(
  () => loadPrivateUserData(activeProfile).examHistory
 );
 const [calcEj1, setCalcEj1] = useState(
  () => loadPrivateUserData(activeProfile).grades.ej1
 );
 const [calcEj2, setCalcEj2] = useState(
  () => loadPrivateUserData(activeProfile).grades.ej2
 );
 const [calcEj3, setCalcEj3] = useState(
  () => loadPrivateUserData(activeProfile).grades.ej3
 );
 const [studyPlan, setStudyPlan] = useState(
  () => loadPrivateUserData(activeProfile).studyPlan
 );
 const [netStudyMinutes, setNetStudyMinutes] = useState(
  () => loadPrivateUserData(activeProfile).netStudyMinutes
 );

 // MODO ESENCIAL VS EXPERTO Y ONBOARDING INTERACTIVO (ANTI-SOBRECARGA COGNITIVA)
 const [isSimplifiedMode, setIsSimplifiedMode] = useState(
  () => localStorage.getItem('cam_simplified_mode_v5') === 'true'
 );
 const [isOnboardingOpen, setIsOnboardingOpen] = useState(
  () => !localStorage.getItem('cam_onboarding_seen_v5')
 );

 const toggleSimplifiedMode = useCallback(() => {
  setIsSimplifiedMode((prev) => {
   const next = !prev;
   localStorage.setItem('cam_simplified_mode_v5', String(next));
   return next;
  });
 }, []);

 const closeOnboardingModal = useCallback(() => {
  localStorage.setItem('cam_onboarding_seen_v5', 'true');
  setIsOnboardingOpen(false);
 }, []);

 const handleIncrementNetMinute = useCallback(() => {
  setNetStudyMinutes((m) => m + 1);
 }, []);

 const switchUserProfile = (newProfileId) => {
  const priv = loadPrivateUserData(newProfileId);
  setActiveProfile(newProfileId);
  setTopicData(priv.topicData);
  setFailedQuestionIds(priv.failedQuestionIds);
  setLeitnerBoxes(priv.leitnerBoxes);
  setErrorCausesLog(priv.errorCausesLog);
  setExamHistory(priv.examHistory);
  setCalcEj1(priv.grades.ej1);
  setCalcEj2(priv.grades.ej2);
  setCalcEj3(priv.grades.ej3);
  setStudyPlan(priv.studyPlan);
  setNetStudyMinutes(priv.netStudyMinutes);
  setExamSession(null);
  setStatusBanner(
   `👤 Sesión activa: ${PROFILES[newProfileId].name} (${PROFILES[newProfileId].role}). Datos aislados.`
  );
  setTimeout(() => setStatusBanner(''), 4000);
 };

 // CALCULADORA OFICIAL DEL BAREMO RMER DEL SERMAS (ANEXO II BOCM 06/11/2026)
 const [sermasBaremo, setSermasBaremo] = useState(() => {
  const saved = localStorage.getItem('sermas_baremo_rmer_v5');
  return saved
   ? JSON.parse(saved)
   : {
     daysSnsPublic: 0,
     daysOtherPublicAdmin: 365,
     daysPrivateSocioSan: 0,
     postgradPoints: 0,
     cfcEctsCredits: 20,
    };
 });

 const sermasScores = useMemo(() => {
  const exp1_1 = (Number(sermasBaremo.daysSnsPublic) || 0) * 0.008;
  const exp1_2 = (Number(sermasBaremo.daysOtherPublicAdmin) || 0) * 0.006;
  const exp1_4 = (Number(sermasBaremo.daysPrivateSocioSan) || 0) * 0.003;
  const totalExp = Math.min(35, exp1_1 + exp1_2 + exp1_4);
  const totalForm = Math.min(
   15,
   (Number(sermasBaremo.postgradPoints) || 0) +
    (Number(sermasBaremo.cfcEctsCredits) || 0) * 0.25
  );
  const totalConcursoOver50 = (totalExp + totalForm).toFixed(2);
  const testOver50 = ((Number(calcEj1) || 0) * 5).toFixed(2);
  return {
   exp1_2: exp1_2.toFixed(2),
   totalExp: totalExp.toFixed(2),
   totalForm: totalForm.toFixed(2),
   totalConcursoOver50,
   testOver50,
   globalOver100: (Number(totalConcursoOver50) + Number(testOver50)).toFixed(
    2
   ),
  };
 }, [sermasBaremo, calcEj1]);

 // BANCO COMÚN DE PREGUNTAS (INICIALIZADO CON LAS 60 PREGUNTAS DE ALTA DIFICULTAD)
 const [bankFilterTopic, setBankFilterTopic] = useState('Todos');
 const [bankSearchText, setBankSearchText] = useState('');

 const [questionBank, setQuestionBank] = useState(() => {
  const base60 = HIGH_DIFFICULTY_60_QUESTIONS.filter(
   (q) => !isDefectiveOrAdminQuestion(q)
  );
  const saved = localStorage.getItem('cam_qbank_v5');
  if (saved) {
   try {
    const parsed = JSON.parse(saved).filter(
     (q) => !isDefectiveOrAdminQuestion(q)
    );
    if (parsed.length > 0) {
     const existingIds = new Set(parsed.map((q) => q.id));
     return [...parsed, ...base60.filter((q) => !existingIds.has(q.id))];
    }
   } catch (e) {
    console.warn('Error cargando banco:', e);
   }
  }
  return base60;
 });

 const [peerReviewQueue, setPeerReviewQueue] = useState(() => {
  const saved = localStorage.getItem('cam_peer_queue_v5');
  return saved ? JSON.parse(saved) : [];
 });

 const [documentsLibrary, setDocumentsLibrary] = useState([]);
 const [storiesLibrary, setStoriesLibrary] = useState(() => {
  const saved = localStorage.getItem('cam_stories_logic_v6_bocm2026');
  if (saved) {
   try {
    const parsed = JSON.parse(saved);
    if (parsed.length > 0) {
     return parsed.map((st) => {
      const tObj = findTopicAcrossAllCatalogs(st.topicId);
      if (!tObj) return st;
      const hasOldGenericReto = (st.microRetos || []).some((r) =>
       /reserva legal exclusiva del Art[ií]culo 16\.2/i.test(r.question || '')
      );
      if (hasOldGenericReto || !st.microRetos?.length || !st.glosario?.length) {
       return buildNarrativeStoryForTopic(tObj, st.storyText || tObj.lawUpdate);
      }
      return {
       ...st,
       title: `[${tObj.id}] ${tObj.title}${
        st.protagonist === 'Narración Mnemotécnica Oficial en 5 Actos'
         ? ' (Guía Narrativa Vivencial en 5 Actos)'
         : ''
       }`,
      };
     });
    }
   } catch (e) {
    console.warn('Error hidratando historias:', e);
   }
  }
  return OFFICIAL_CAM_TOPICS.map((t) =>
   buildNarrativeStoryForTopic(t, t.lawUpdate)
  );
 });
 const [storySearch, setStorySearch] = useState('');
 const [showStoryInModule04, setShowStoryInModule04] = useState(false);

 useEffect(() => {
  try {
   localStorage.setItem(
    'cam_stories_logic_v6_bocm2026',
    JSON.stringify(storiesLibrary)
   );
  } catch (e) {
   console.warn('Error guardando historias:', e);
  }
 }, [storiesLibrary]);

 const ensureStoryForTopic = (topicObj, rawText = '') => {
  if (!topicObj) return null;
  let built = null;
  setStoriesLibrary((prev) => {
   const existing = prev.find((s) => s.topicId === topicObj.id) || null;
   built = buildNarrativeStoryForTopic(topicObj, rawText, existing);
   return [built, ...prev.filter((s) => s.topicId !== topicObj.id)];
  });
  return built;
 };
 const [essaysLibrary, setEssaysLibrary] = useState([]);
 const [activeEssayView, setActiveEssayView] = useState(null);
 const [selectedBlockFilter, setSelectedBlockFilter] = useState('Todos');
 const [searchTopicQuery, setSearchTopicQuery] = useState('');

 // ENTRENADOR DE ESQUELETO EN FRÍO (7 MINUTOS - ACTIVE RECALL)
 const [skeletonTrainer, setSkeletonTrainer] = useState({
  isOpen: false,
  topic: null,
  userRecallText: '',
  timeLeft: 420,
  evaluationResult: null,
 });

 useEffect(() => {
  if (!skeletonTrainer.isOpen) return;
  const t = setInterval(() => {
   setSkeletonTrainer((prev) => {
    if (!prev.isOpen || prev.timeLeft <= 1)
     return { ...prev, timeLeft: 0 };
    return { ...prev, timeLeft: prev.timeLeft - 1 };
   });
  }, 1000);
  return () => clearInterval(t);
 }, [skeletonTrainer.isOpen]);

 // SIMULADOR REAL DE SORTEO DE 2 BOLAS A CIEGAS (2.º EJERCICIO · 80 MIN)
 const [twoBallsSim, setTwoBallsSim] = useState({
  isOpen: false,
  ball1: null,
  ball2: null,
  chosenTopic: null,
  userDraft: '',
  secondsLeft: 5400,
  isRunning: false,
  auditResult: null,
 });

 useEffect(() => {
  if (!twoBallsSim.isOpen || !twoBallsSim.isRunning) return;
  const t = setInterval(() => {
   setTwoBallsSim((prev) => {
    if (prev.secondsLeft <= 1) return { ...prev, isRunning: false, secondsLeft: 0 };
    return { ...prev, secondsLeft: prev.secondsLeft - 1 };
   });
  }, 1000);
  return () => clearInterval(t);
 }, [twoBallsSim.isOpen, twoBallsSim.isRunning]);

 const launchTwoBallsBlindDraw = () => {
  const specificTopics = activeCatalog.filter((t) => !t.id.startsWith('G'));
  const pool = specificTopics.length >= 2 ? specificTopics : activeCatalog;
  const idx1 = Math.floor(Math.random() * pool.length);
  let idx2 = Math.floor(Math.random() * pool.length);
  if (idx2 === idx1) idx2 = (idx1 + 1) % pool.length;
  setTwoBallsSim({
   isOpen: true,
   ball1: pool[idx1],
   ball2: pool[idx2],
   chosenTopic: null,
   userDraft: '',
   secondsLeft: 5400,
   isRunning: false,
   auditResult: null,
  });
 };

 const launchDiaDMarathonSimulator = () => {
  const cleanBank = questionBank.filter(
   (q) =>
    !isDefectiveOrAdminQuestion(q) &&
    (activeConvocatoria === 'sermas'
     ? !String(q.topicId).startsWith('AY-')
     : activeConvocatoria === 'ayto'
     ? !String(q.topicId).startsWith('S-')
     : !String(q.topicId).startsWith('S-') &&
      !String(q.topicId).startsWith('AY-'))
  );
  const shuffledQs = [...cleanBank]
   .sort(() => Math.random() - 0.5)
   .slice(0, Math.min(85, cleanBank.length));

  const specificTopics = activeCatalog.filter((t) => !t.id.startsWith('G'));
  const pool = specificTopics.length >= 2 ? specificTopics : activeCatalog;
  const idx1 = Math.floor(Math.random() * pool.length);
  let idx2 = Math.floor(Math.random() * pool.length);
  if (idx2 === idx1) idx2 = (idx1 + 1) % pool.length;

  const testSeconds =
   activeConvocatoria === 'ayto'
    ? 7740
    : activeConvocatoria === 'sermas'
    ? 7200
    : 5100;

  setDiaDSimulator({
   isOpen: true,
   stage: 1,
   secondsLeft: testSeconds,
   isRunning: true,
   testQuestions: shuffledQs,
   testAnswers: {},
   testCurrentIdx: 0,
   testGradeOver10: null,
   testHits: 0,
   testErrors: 0,
   ball1: pool[idx1],
   ball2: pool[idx2],
   chosenBall: null,
   essayDraft: '',
   essayAudit: null,
  });
 };

 // SIMULADOR DEL DÍA DE LA LECTURA PÚBLICA ANTE EL TRIBUNAL (TELEPROMPTER 130 PAL/MIN)
 const [tribunalReader, setTribunalReader] = useState({
  isOpen: false,
  title: '',
  text: '',
  elapsedSeconds: 0,
  targetLimitSeconds: 900, // 15 min por defecto para lectura pública
  timerMode: 'countdown', // 'countdown' | 'stopwatch'
  isRunning: false,
  fontSize: 'text-base',
 });

 useEffect(() => {
  if (!tribunalReader.isOpen || !tribunalReader.isRunning) return;
  const t = setInterval(() => {
   setTribunalReader((prev) => ({
    ...prev,
    elapsedSeconds: prev.elapsedSeconds + 1,
   }));
  }, 1000);
  return () => clearInterval(t);
 }, [tribunalReader.isOpen, tribunalReader.isRunning]);

 const openTribunalPublicReader = (title, text) => {
  const words = (text || '').trim()
   ? (text || '').trim().split(/\s+/).length
   : 0;
  const calcSeconds = Math.max(300, Math.round((words / 130) * 60));
  setTribunalReader({
   isOpen: true,
   title: title || 'Lectura Pública ante el Tribunal Calificador',
   text: text || '',
   elapsedSeconds: 0,
   targetLimitSeconds: calcSeconds,
   timerMode: 'countdown',
   isRunning: false,
   fontSize: 'text-base',
  });
 };

 // RÚBRICA DE 5 DIMENSIONES PARA EL 3.er EJERCICIO (SUPUESTO PRÁCTICO)
 const [practicalCaseText, setPracticalCaseText] = useState('');
 const [practicalRubricResult, setPracticalRubricResult] = useState(null);

 const [revealedRetos, setRevealedRetos] = useState({});
 const [flippedGlossary, setFlippedGlossary] = useState({});
 const [flashcardMastery, setFlashcardMastery] = useState(() => {
  const saved = localStorage.getItem('cam_flashcard_mastery_v5');
  return saved ? JSON.parse(saved) : {};
 });

 useEffect(() => {
  try {
   localStorage.setItem(
    'cam_flashcard_mastery_v5',
    JSON.stringify(flashcardMastery)
   );
  } catch (e) {
   console.warn('Error guardando dominio de flashcards:', e);
  }
 }, [flashcardMastery]);
 const [customPracticalCases, setCustomPracticalCases] = useState(() => {
  const saved = localStorage.getItem('cam_custom_cases_v5');
  return saved ? JSON.parse(saved) : [];
 });

 useEffect(() => {
  try {
   localStorage.setItem(
    'cam_custom_cases_v5',
    JSON.stringify(customPracticalCases)
   );
  } catch (e) {
   console.warn('Error guardando supuestos extraídos:', e);
  }
 }, [customPracticalCases]);

 const touchTopicReviewDate = (topicId) => {
  if (!topicId) return;
  setTopicData((prev) => ({
   ...prev,
   [topicId]: {
    ...prev[topicId],
    lastReviewedIso: new Date().toISOString(),
   },
  }));
 };

 const alignDocumentItemToBocm2026 = useCallback((item) => {
  if (!item) return item;
  let currentTopicId = String(item.topicId || 'E1');
  const isNarrOrSpecific =
   /narraci[oó]n|narrativo|extenso|ejercicio\s*2|desarrollo\s+en\s+90/i.test(
    `${item.name || ''} ${(item.text || '').slice(0, 800)}`
   ) ||
   /ACTO\s+I\b|1\.\s+EL\s+DESPERTAR|1\.\s+EL\s+CONCEPTO\s+DE\s+BIENESTAR/i.test(
    (item.text || '').slice(0, 1200)
   );

  if (currentTopicId.startsWith('G') && isNarrOrSpecific) {
   currentTopicId = `E${currentTopicId.replace(/^G/i, '')}`;
  }

  const searchPool = currentTopicId.startsWith('G')
   ? OFFICIAL_CAM_TOPICS.filter((t) => t.id.startsWith('G'))
   : OFFICIAL_CAM_TOPICS.filter((t) => t.id.startsWith('E'));

  const { bestTopic, bestScore } = findBestMatchingTopicByContent(
   item.text || '',
   searchPool,
   item.name || ''
  );

  if (bestTopic && bestScore >= 20 && bestTopic.id !== currentTopicId) {
   currentTopicId = bestTopic.id;
  }

  const targetTopicObj = findTopicAcrossAllCatalogs(currentTopicId);
  const refreshedAudit = auditDocumentTextValidity(
   item.text || '',
   targetTopicObj || currentTopicId,
   item.name || ''
  );

  return {
   ...item,
   topicId: currentTopicId,
   audit: refreshedAudit,
  };
 }, []);

 const handleRealignAllLibraryToBocm2026 = async () => {
  const fixedDocs = (documentsLibrary || []).map(alignDocumentItemToBocm2026);
  const fixedEssays = (essaysLibrary || []).map((es) => ({
   ...alignDocumentItemToBocm2026(es),
   isCorrectedEj2:
    es.isCorrectedEj2 !== undefined ? es.isCorrectedEj2 : true,
  }));

  setDocumentsLibrary(fixedDocs);
  setEssaysLibrary(fixedEssays);
  await saveToStore(STORE_DOCS, fixedDocs);
  await saveToStore(STORE_ESSAYS, fixedEssays);

  if (fixedEssays.length > 0) {
   setActiveEssayView(fixedEssays[0]);
   setSelectedCleanEj2Id(fixedEssays[0].id);
  }

  setStatusBanner(
   `🔄 ¡${fixedDocs.length} archivos PDF realineados al 100% con los epígrafes del BOCM 2026 (corregido el desfase de numeración Temas 15→E16, 16→E17, 17→E18...)!`
  );
  setTimeout(() => setStatusBanner(''), 5500);
 };

 useEffect(() => {
  getAllFromStore(STORE_DOCS).then(async (docs) => {
   const fixedDocs = (docs || []).map(alignDocumentItemToBocm2026);
   setDocumentsLibrary(fixedDocs);
   await saveToStore(STORE_DOCS, fixedDocs);
   setStoriesLibrary(
    OFFICIAL_CAM_TOPICS.map((t) => {
     const matchingDocs = fixedDocs.filter((d) => d.topicId === t.id);
     const combinedRaw = matchingDocs.map((d) => d.text || '').join('\n\n');
     return buildNarrativeStoryForTopic(t, combinedRaw || t.lawUpdate);
    })
   );
  });
  getAllFromStore(STORE_ESSAYS).then(async (essays) => {
   const fixedEssays = (essays || []).map((es) => ({
    ...alignDocumentItemToBocm2026(es),
    isCorrectedEj2:
     es.isCorrectedEj2 !== undefined ? es.isCorrectedEj2 : true,
   }));
   setEssaysLibrary(fixedEssays);
   await saveToStore(STORE_ESSAYS, fixedEssays);
   if (fixedEssays.length > 0) {
    setActiveEssayView(fixedEssays[0]);
    setSelectedCleanEj2Id(fixedEssays[0].id);
   }
  });
 }, [alignDocumentItemToBocm2026]);

 useEffect(() => {
  try {
   localStorage.setItem(
    `cam_priv5_topic_${activeProfile}`,
    JSON.stringify(topicData)
   );
   localStorage.setItem(
    `cam_priv5_failed_${activeProfile}`,
    JSON.stringify(failedQuestionIds)
   );
   localStorage.setItem(
    `cam_priv5_leitner_${activeProfile}`,
    JSON.stringify(leitnerBoxes)
   );
   localStorage.setItem(
    `cam_priv5_causes_${activeProfile}`,
    JSON.stringify(errorCausesLog)
   );
   localStorage.setItem(
    `cam_priv5_history_${activeProfile}`,
    JSON.stringify(examHistory)
   );
   localStorage.setItem(
    `cam_priv5_grades_${activeProfile}`,
    JSON.stringify({ ej1: calcEj1, ej2: calcEj2, ej3: calcEj3 })
   );
   localStorage.setItem(
    `cam_priv5_plan_${activeProfile}`,
    JSON.stringify(studyPlan)
   );
   localStorage.setItem(
    `cam_priv5_netmin_${activeProfile}`,
    String(netStudyMinutes)
   );
   localStorage.setItem('cam_qbank_v5', JSON.stringify(questionBank));
   localStorage.setItem(
    'cam_peer_queue_v5',
    JSON.stringify(peerReviewQueue)
   );
   localStorage.setItem('cam_theme_v5', theme);
   localStorage.setItem('cam_profile_v5', activeProfile);
   localStorage.setItem('cam_convocatoria_v5', activeConvocatoria);
   localStorage.setItem('cam_group_names_v5', JSON.stringify(customNames));
   localStorage.setItem(
    'sermas_baremo_rmer_v5',
    JSON.stringify(sermasBaremo)
   );
  } catch (e) {
   console.warn('Aviso almacenamiento:', e);
  }
 }, [
  topicData,
  failedQuestionIds,
  leitnerBoxes,
  errorCausesLog,
  examHistory,
  calcEj1,
  calcEj2,
  calcEj3,
  studyPlan,
  netStudyMinutes,
  questionBank,
  peerReviewQueue,
  theme,
  activeProfile,
  activeConvocatoria,
  customNames,
  sermasBaremo,
 ]);

 useEffect(() => {
  document.documentElement.classList.toggle('dark', isDark);
 }, [isDark]);

 // CATÁLOGO ACTIVO SEGÚN LA CONVOCATORIA ELEGIDA
 const activeCatalog = useMemo(() => {
  if (activeConvocatoria === 'sermas') return SERMAS_50_TOPICS;
  if (activeConvocatoria === 'ayto') return AYUNTAMIENTO_90_TOPICS;
  return OFFICIAL_CAM_TOPICS;
 }, [activeConvocatoria]);

 const isEstatalCommonTopic = (t) => {
  const txt = `${t.title || ''} ${t.lawUpdate || ''}`;
  return (
   (t.equivalentIds && t.equivalentIds.length > 0) ||
   /\b(Constituci[oó]n|39\/2015|40\/2015|5\/2015|TREBEP|39\/2006|LAPAD|1\/2013|888\/2022|8\/2021|LOPIVI|3\/2007|1\/2004|19\/2021|Ingreso\s+M[ií]nimo\s+Vital|3\/2018|Protecci[oó]n\s+de\s+Datos|14\/1986|16\/2003|41\/2002|4\/2000|12\/2009)\b/i.test(
    txt
   )
  );
 };

 const filteredTopics = useMemo(() => {
  return activeCatalog.filter((t) => {
   const isGen = /^(G|S-[1-7]$|AY-([1-9]|1\d|20)$)/.test(t.id);
   const matchBlock =
    selectedBlockFilter === 'Todos'
     ? true
     : selectedBlockFilter === 'Especificos'
     ? !isGen
     : selectedBlockFilter === 'Generales'
     ? isGen
     : selectedBlockFilter === 'Estatal'
     ? isEstatalCommonTopic(t)
     : t.block === selectedBlockFilter;
   const matchQuery =
    !searchTopicQuery.trim() ||
    t.title.toLowerCase().includes(searchTopicQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTopicQuery.toLowerCase());
   return matchBlock && matchQuery;
  });
 }, [activeCatalog, selectedBlockFilter, searchTopicQuery]);

 // ESTADÍSTICAS REALES DE DOMINIO Y SISTEMA DE VUELTAS POR ARRASTRE (FÓRMULA 3+1+1)
 const masteryStats = useMemo(() => {
  let dominated = 0,
   studied = 0,
   pending = 0;
  activeCatalog.forEach((t) => {
   const st = topicData[t.id]?.status || 'Pendiente';
   if (st === 'Dominado') dominated++;
   else if (st === 'Estudiado') studied++;
   else pending++;
  });

  const pendingList = activeCatalog.filter(
   (t) => (topicData[t.id]?.status || 'Pendiente') === 'Pendiente'
  );
  const studiedOrDominatedList = activeCatalog
   .filter((t) => (topicData[t.id]?.status || 'Pendiente') !== 'Pendiente')
   .sort((a, b) => {
    const dA = topicData[a.id]?.lastReviewedIso
     ? new Date(topicData[a.id].lastReviewedIso).getTime()
     : 0;
    const dB = topicData[b.id]?.lastReviewedIso
     ? new Date(topicData[b.id].lastReviewedIso).getTime()
     : 0;
    return dA - dB;
   });

  // 3 Temas de Avance (Nuevos)
  const avance3 = pendingList.slice(0, 3);
  // 1 Tema de Arrastre de la Vuelta Anterior (el estudiado/dominado más antiguo para no desconectar temas)
  const arrastre1 =
   studiedOrDominatedList[0] ||
   activeCatalog.find((t) => t.id === 'E1') ||
   activeCatalog[0];
  // 1 Tema Transversal del Tronco Estatal Común (puntúa en CAM, SERMAS, Ayto y Estado)
  const estatalCandidates = activeCatalog.filter(
   (t) =>
    isEstatalCommonTopic(t) &&
    !avance3.some((av) => av.id === t.id) &&
    t.id !== arrastre1?.id
  );
  const transversal1 = estatalCandidates[0] || activeCatalog[0];

  const total = Math.max(1, activeCatalog.length);
  const currentVuelta =
   pending > 0
    ? {
      num: 1,
      name: '1.ª Vuelta · Construcción de Base y Esqueletos',
      pct: Math.round(((studied + dominated) / total) * 100),
     }
    : dominated < total
    ? {
      num: 2,
      name: '2.ª Vuelta · Fijación por Arrastre e Interconexión Legal',
      pct: Math.round((dominated / total) * 100),
     }
    : {
      num: 3,
      name: '3.ª Vuelta · Maestría Intensiva y Velocidad de Tribunal',
      pct: 100,
     };

  return {
   dominated,
   studied,
   pending,
   total: activeCatalog.length,
   nextPriorityTopics: pendingList.slice(0, 4),
   dragPack: {
    avance3,
    arrastre1,
    transversal1,
   },
   currentVuelta,
  };
 }, [activeCatalog, topicData]);

 // CONTEO DE LAS 4 CAJAS LEITNER (+1d, +3d, +7d, +21d)
 const leitnerCounts = useMemo(() => {
  const counts = { box1: 0, box2: 0, box3: 0, box4: 0 };
  questionBank.forEach((q) => {
   const b =
    leitnerBoxes[q.id] || (failedQuestionIds.includes(q.id) ? 1 : 2);
   if (b === 1) counts.box1++;
   else if (b === 2) counts.box2++;
   else if (b === 3) counts.box3++;
   else counts.box4++;
  });
  return counts;
 }, [questionBank, leitnerBoxes, failedQuestionIds]);

 // CALCULADORA COMBINATORIA EXACTA DE LAS 2 BOLAS (CAM 67 ESPECÍFICOS)
 const twoBallsProbability = useMemo(() => {
  const specificCamTopics = OFFICIAL_CAM_TOPICS.filter((t) =>
   t.id.startsWith('E')
  );
  const D = specificCamTopics.filter(
   (t) => topicData[t.id]?.status === 'Dominado'
  ).length;
  const totalSpecific = 67;
  if (D <= 0) return { pct: '0.0 %', dominatedSpecific: 0 };
  if (D >= totalSpecific - 1) return { pct: '100 %', dominatedSpecific: D };
  const unfavorable = ((totalSpecific - D) * (totalSpecific - D - 1)) / 2;
  const totalCombos = (totalSpecific * (totalSpecific - 1)) / 2;
  const prob = (1 - unfavorable / totalCombos) * 100;
  return { pct: `${prob.toFixed(1)} %`, dominatedSpecific: D };
 }, [topicData]);

 // PUENTE TRIPARTITO CAM <-> SERMAS <-> AYUNTAMIENTO
 const syncCommonTopicsAcrossExams = () => {
  let cloned = 0;
  const existingQ = new Set(
   questionBank.map((q) => q.question.trim().toLowerCase())
  );
  const newQuestions = [];

  activeCatalog.forEach((targetTopic) => {
   const eqs = targetTopic.equivalentIds || [];
   if (eqs.length === 0) return;
   questionBank.forEach((q) => {
    if (eqs.includes(q.topicId)) {
     const newText = `[Puente ${targetTopic.id}] ${q.question}`;
     if (!existingQ.has(newText.toLowerCase())) {
      newQuestions.push({
       ...q,
       id: `bridge-${targetTopic.id}-${Date.now()}-${cloned}`,
       topicId: targetTopic.id,
       question: newText,
      });
      existingQ.add(newText.toLowerCase());
      cloned++;
     }
    }
   });
  });

  if (newQuestions.length > 0) {
   setQuestionBank((prev) => [...newQuestions, ...prev]);
   setStatusBanner(
    `🔗 Puente Tripartito ejecutado: ${cloned} preguntas equivalentes vinculadas a ${activeConvocatoria.toUpperCase()}.`
   );
  } else {
   setStatusBanner(
    'ℹ️ Todos los temas equivalentes entre CAM, SERMAS y Ayuntamiento ya están sincronizados.'
   );
  }
  setTimeout(() => setStatusBanner(''), 4000);
 };

 // CREAR TEMA MAGISTRAL 10/10 CON IA/PLANTILLA LEGAL 2026
 const handleGenerateMagistralTopic = async (topicObj) => {
  const generatedText = buildMagistralTopicText(topicObj, activeConvocatoria);
  ensureStoryForTopic(topicObj, generatedText);
  const audit = auditDocumentTextValidity(generatedText, topicObj);
  const newEssay = {
   id: `magistral-${topicObj.id}-${Date.now()}`,
   topicId: topicObj.id,
   name: `Tema Magistral 10/10 · [${topicObj.id}] ${topicObj.title.slice(
    0,
    55
   )}.pdf`,
   pages: 10,
   text: generatedText,
   audit,
  };
  const mutatedQuestions = generateMutatedQuestionsFromText(
   generatedText,
   topicObj.id,
   10
  );

  await saveToStore(STORE_ESSAYS, [newEssay]);
  await saveToStore(STORE_DOCS, [newEssay]);
  setEssaysLibrary((prev) => [newEssay, ...prev]);
  setDocumentsLibrary((prev) => [newEssay, ...prev]);
  setActiveEssayView(newEssay);
  setQuestionBank((prev) => [...mutatedQuestions, ...prev]);
  setCalcEj2(Number(audit.finalScore));
  setTopicData((prev) => ({
   ...prev,
   [topicObj.id]: {
    ...prev[topicObj.id],
    status: prev[topicObj.id]?.status || 'Estudiado',
   },
  }));
  setActiveModule('04');
  setStatusBanner(
   `✍️ Tema Magistral [${topicObj.id}] redactado (${audit.wordCount} palabras, ${audit.handwrittenMinutes}m a mano, 0 siglas prohibidas) + 10 preguntas añadidas.`
  );
  setTimeout(() => setStatusBanner(''), 5000);
 };

 // ENTRENAR ESQUELETO EN FRÍO (7 MIN)
 const openSkeletonTrainerForTopic = (topicObj) => {
  setSkeletonTrainer({
   isOpen: true,
   topic: topicObj,
   userRecallText: '',
   timeLeft: 420,
   evaluationResult: null,
  });
 };

 const evaluateSkeletonRecall = () => {
  if (!skeletonTrainer.topic) return;
  const epigraphs = extractSubEpigraphsFromTitle(skeletonTrainer.topic.title);
  const lowerInput = skeletonTrainer.userRecallText.toLowerCase();
  const remembered = [];
  const forgotten = [];

  epigraphs.forEach((ep) => {
   const kw = ep
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4);
   if (kw.length === 0 || kw.some((w) => lowerInput.includes(w)))
    remembered.push(ep);
   else forgotten.push(ep);
  });

  const hasLawCitation =
   /\b(ley|decreto|constituci[oó]n|orden|art[ií]culo|rd|lo)\b/i.test(
    skeletonTrainer.userRecallText
   );
  const scorePct =
   epigraphs.length > 0
    ? Math.round((remembered.length / epigraphs.length) * 100)
    : 100;

  setSkeletonTrainer((prev) => ({
   ...prev,
   evaluationResult: { scorePct, remembered, forgotten, hasLawCitation },
  }));
 };

 // SUBIDA Y AUDITORÍA UNIVERSAL DE PDFs
 const [isExtractingPdf, setIsExtractingPdf] = useState(false);
 const [uploadProgressText, setUploadProgressText] = useState('');

 const deleteEssayById = async (essayId) => {
  await deleteFromStore(STORE_ESSAYS, essayId);
  await deleteFromStore(STORE_DOCS, essayId);
  const remaining = essaysLibrary.filter((e) => e.id !== essayId);
  setEssaysLibrary(remaining);
  setDocumentsLibrary((prev) => prev.filter((d) => d.id !== essayId));
  if (activeEssayView?.id === essayId) {
   setActiveEssayView(remaining.length > 0 ? remaining[0] : null);
  }
  if (selectedCleanEj2Id === essayId) {
   setSelectedCleanEj2Id(remaining.length > 0 ? remaining[0].id : null);
  }
  setStatusBanner(
   '🗑️ Tema eliminado correctamente. Ya puedes subir o generar la nueva versión.'
  );
 };

 const clearAllSavedEssays = async () => {
  const essayIds = new Set(essaysLibrary.map((e) => e.id));
  for (const es of essaysLibrary) {
   await deleteFromStore(STORE_ESSAYS, es.id);
   await deleteFromStore(STORE_DOCS, es.id);
  }
  setEssaysLibrary([]);
  setDocumentsLibrary((prev) => prev.filter((d) => !essayIds.has(d.id)));
  setActiveEssayView(null);
  setSelectedCleanEj2Id(null);
  setStatusBanner(
   '🧹 Todos los temas guardados en el Módulo 04/04B han sido eliminados.'
  );
 };

 const processPdfUpload = async (
  fileList,
  isEssayEj2 = false,
  forcedTopicObj = null
 ) => {
  const files = Array.from(fileList || []);
  if (files.length === 0) return;
  setIsExtractingPdf(true);
  const processedDocs = [];
  const processedEssays = [];
  const extractedCases = [];
  let generatedQsTotal = [];
  let literalQsCount = 0;

  for (let idx = 0; idx < files.length; idx++) {
   const file = files[idx];
   setUploadProgressText(
    `Analizando formato de "${file.name}" (${idx + 1}/${files.length})...`
   );
   try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
     const page = await pdfDoc.getPage(i);
     const textContent = await page.getTextContent();
     fullText +=
      textContent.items.map((item) => item.str).join(' ') + '\n\n';
    }

    const headerSample = fullText.slice(0, 1800);

    // Autodetección inteligente del tipo de PDF ("Narración Ej. 2" vs "Tratado Extenso Ej. 1")
    const isNarrativePdf =
     /narraci[oó]n|narrativo|cr[oó]nica/i.test(file.name) ||
     /NARRACI[OÓ]N\s+MNEMOT[EÉ]CNICA|GU[IÍ]A\s+(?:NARRATIVA|MAESTRA\s+DE\s+DESARROLLO)|M[EÉ]TODO\s+NARRATIVO\s+INTEGRAL|Cr[oó]nica\s+Narrativa|EJERCICIO\s+2[\s·•—–-]*(?:\()?DESARROLLO|ACTO\s+I\s*:/i.test(
      headerSample
     );
    const isExtensoPdf =
     /extenso|tratado/i.test(file.name) ||
     /TRATADO\s+EXTENSO|BATER[IÍ]A\s+OFICIAL\s+DE\s+\d+\s+PREGUNTAS\s+TIPO\s+TEST/i.test(
      fullText.slice(0, 3000)
     );

    const explicitlyGeneral =
     /\bTEMA\s+GENERAL\s+\d+\b|\bBLOQUE\s+GENERAL\b/i.test(
      headerSample
     ) && !isNarrativePdf;

    const specificOnly = activeCatalog.filter(
     (t) => !t.id.startsWith('G')
    );
    const generalOnly = activeCatalog.filter((t) => t.id.startsWith('G'));

    const nameMatch = file.name.match(
     /(?:tema|especifico|e)[\s_-]*0*(\d{1,2})\b/i
    );
    const textMatch = headerSample.match(
     /TEMA\s+(?:ESPEC[IÍ]FICO\s+|GENERAL\s+)?0*(\d{1,2})\b/i
    );
    const detectedNum =
     (nameMatch && nameMatch[1]) || (textMatch && textMatch[1]);

    let targetTopic = forcedTopicObj;

    // REGLA ANTI-CONFUSIÓN: Narración / Ejercicio 2 (y Extenso Específico) NUNCA se asigna a General (G1..G16)
    if (targetTopic && targetTopic.id.startsWith('G') && !explicitlyGeneral) {
     const gNum = targetTopic.id.replace(/^G/i, '');
     const numToUse = detectedNum || gNum;
     const mappedSpecific = specificOnly.find(
      (t) => t.id.toUpperCase() === `E${numToUse}`
     );
     if (mappedSpecific) {
      targetTopic = mappedSpecific;
     }
    }

    if (!targetTopic) {
     const searchPool = explicitlyGeneral ? generalOnly : specificOnly;
     const candidateByNum =
      detectedNum &&
      searchPool.find(
       (t) =>
        t.id.toUpperCase() ===
         `${explicitlyGeneral ? 'G' : 'E'}${detectedNum}` ||
        t.id.endsWith(`-${detectedNum}`) ||
        new RegExp(
         `\\bTema\\s+(?:Espec[ií]fico\\s+|General\\s+)?0*${detectedNum}\\b`,
         'i'
        ).test(t.title)
      );

     const { bestTopic, bestScore } = findBestMatchingTopicByContent(
      fullText,
      searchPool,
      file.name
     );

     if (candidateByNum) {
      const numCoh = verifyTopicContentCoherence(
       fullText,
       candidateByNum,
       searchPool,
       file.name
      );
      // Si el número del archivo venía de la numeración antigua (p.ej. Tema 15 en lugar de E16 en el BOCM 2026), priorizar el epígrafe oficial 2026 que coincide por título
      if (!numCoh.isCoherent && bestTopic && bestScore >= 14) {
       targetTopic = bestTopic;
      } else {
       targetTopic = candidateByNum;
      }
     } else {
      targetTopic =
       bestTopic ||
       (activeEssayView &&
        specificOnly.find((t) => t.id === activeEssayView.topicId)) ||
       specificOnly[0] ||
       activeCatalog[0];
     }
    }

    touchTopicReviewDate(targetTopic.id);

    // Guardar siempre la historia / caja mnemotécnica / micro-retos / glosario en la Pestaña 07
    ensureStoryForTopic(targetTopic, fullText);

    // Extraer Caso Práctico en 5 Pasos si viene en el PDF Extenso (para el Módulo 05)
    const extractedCase = extractPracticalCaseFromExtensoPdf(
     fullText,
     targetTopic
    );
    if (extractedCase) {
     extractedCases.push(extractedCase);
    }

    // 1. Extraer preguntas tipo test literales si el PDF las incluye (Cap. VIII o IX del Extenso)
    const literalQs = extractLiteralTestQuestionsFromPdf(
     fullText,
     targetTopic.id
    );
    literalQsCount += literalQs.length;

    // 2. Si no trae suficientes preguntas literales, complementar con mutación jurídica
    const mutatedQs =
     literalQs.length >= 10
      ? []
      : generateMutatedQuestionsFromText(
        stripNonEssaySectionsFromPdf(fullText),
        targetTopic.id,
        10
       );
    generatedQsTotal = [...generatedQsTotal, ...literalQs, ...mutatedQs];

    // 3. Si es el PDF de Narración (o si se subió al Módulo 04 y no es el Extenso), prepararlo para el Ejercicio 2 (Desarrollo 90 min)
    const shouldSaveAsEssay =
     isNarrativePdf ||
     (isEssayEj2 && !isExtensoPdf) ||
     (isEssayEj2 && files.length === 1 && !isExtensoPdf);

    const cleanedText = shouldSaveAsEssay
     ? autoEnhanceStructureAndAnalysis(fullText, targetTopic.id)
     : adjustTextToHandwrittenTarget(fullText);

    const audit = auditDocumentTextValidity(cleanedText, targetTopic, file.name);
    const itemObj = {
     id: `${shouldSaveAsEssay ? 'essay' : 'doc'}-${Date.now()}-${idx}`,
     topicId: targetTopic.id,
     name: file.name,
     docRole: isNarrativePdf
      ? '✍️ Narración 5 Actos (Ej. 2 · 90m)'
      : isExtensoPdf
      ? '📘 Tratado Extenso + Test (Ej. 1)'
      : '📄 Documento Auditado',
     isCorrectedEj2: shouldSaveAsEssay,
     correctedAt: new Date().toLocaleDateString('es-ES'),
     pages: pdfDoc.numPages,
     text: cleanedText,
     audit,
    };

    processedDocs.push(itemObj);
    if (shouldSaveAsEssay) {
     processedEssays.push(itemObj);
    }
   } catch (e) {
    console.error('Error PDF:', e);
   }
  }

  if (extractedCases.length > 0) {
   setCustomPracticalCases((prev) => {
    const replacedIds = new Set(extractedCases.map((c) => c.topicId));
    return [
     ...extractedCases,
     ...prev.filter((c) => !replacedIds.has(c.topicId)),
    ];
   });
  }

  if (processedDocs.length > 0) {
   const incomingKeys = new Set(
    processedDocs.map((d) => `${d.topicId}__${d.docRole || d.name}`)
   );
   const duplicateOldDocs = documentsLibrary.filter((d) =>
    incomingKeys.has(`${d.topicId}__${d.docRole || d.name}`)
   );
   for (const oldDoc of duplicateOldDocs) {
    await deleteFromStore(STORE_DOCS, oldDoc.id);
   }
   await saveToStore(STORE_DOCS, processedDocs);
   setDocumentsLibrary((prev) => [
    ...processedDocs,
    ...prev.filter(
     (d) => !incomingKeys.has(`${d.topicId}__${d.docRole || d.name}`)
    ),
   ]);

   if (processedEssays.length > 0) {
    const replacedTopicIds = new Set(processedEssays.map((e) => e.topicId));
    const oldEssaysToRemove = essaysLibrary.filter((e) =>
     replacedTopicIds.has(e.topicId)
    );
    for (const oldEs of oldEssaysToRemove) {
     await deleteFromStore(STORE_ESSAYS, oldEs.id);
    }
    await saveToStore(STORE_ESSAYS, processedEssays);
    setEssaysLibrary((prev) => [
     ...processedEssays,
     ...prev.filter((e) => !replacedTopicIds.has(e.topicId)),
    ]);
    setActiveEssayView(processedEssays[0]);
    setSelectedCleanEj2Id(processedEssays[0].id);
    setCalcEj2(Number(processedEssays[0].audit.finalScore));
   }

   if (generatedQsTotal.length > 0) {
    if (activeProfile === 'colab') {
     setPeerReviewQueue((prev) => [...generatedQsTotal, ...prev]);
    } else {
     setQuestionBank((prev) => {
      const existingTexts = new Set(
       prev.map((q) => q.question.trim().toLowerCase())
      );
      const uniqueNew = generatedQsTotal.filter(
       (q) =>
        !existingTexts.has(q.question.trim().toLowerCase()) &&
        !isDefectiveOrAdminQuestion(q)
      );
      return [...uniqueNew, ...prev];
     });
    }
   }

   const refItem = processedEssays[0] || processedDocs[0];
   setStatusBanner(
    processedEssays.length > 0 && literalQsCount > 0
     ? `✅ Doble Salida en TEMA ESPECÍFICO [${refItem.topicId}]: ${literalQsCount} pregs al Banco Test + Caso Práctico en 05 + Narración en "04B · Ej. 2 Corregidos" (${refItem.audit.finalScore}/10).`
     : processedEssays.length > 0
     ? `✅ Narración asignada a TEMA ESPECÍFICO [${refItem.topicId}], corregida (${refItem.audit.finalScore}/10) y archivada en "04B · Ej. 2 Corregidos".`
     : `✅ Tratado Extenso [${refItem.topicId}]: Extraídas ${literalQsCount} pregs al Banco + Glosario/Micro-Retos en 07 + Supuesto en 05.`
   );
  }
  setIsExtractingPdf(false);
  setUploadProgressText('');
  setTimeout(() => setStatusBanner(''), 7000);
 };
 // MOTOR INTERACTIVO CLOZE TEST (HUECOS EN BLANCO · SPRINT 10 MINUTOS)
 const [clozeSession, setClozeSession] = useState(null);

 const buildClozeCardsFromBank = (categoryFilter = 'all', count = 20) => {
  const patterns = {
   plazos:
    /\b((?:veinte|diez|quince|treinta|cuarenta y ocho|setenta y dos|veinticuatro|dos|tres|cuatro|cinco|seis|ocho|nueve|doce|dieciocho)\s+(?:d[ií]as?\s+h[aá]biles|d[ií]as?\s+naturales|d[ií]as?|meses|a[ñn]os?|semanas?|horas?)|un\s+(?:mes|a[ñn]o)|10\s+d[ií]as(?:\s+h[aá]biles)?|20\s+d[ií]as(?:\s+h[aá]biles)?|24\s+horas|48\s+horas|72\s+horas|30\s+horas|20\s+horas)\b/i,
   leyes:
    /\b(Ley\s+Org[aá]nica\s+\d+\/\d{4}|Ley\s+\d+\/\d{4}|Real\s+Decreto(?:-ley|\s+Legislativo)?\s+\d+\/\d{4}|Decreto\s+\d+\/\d{4}|Ordenanza\s+\d+\/\d{4}|[Aa]rt[ií]culos?\s+\d+(?:\.\d+)?)\b/i,
   escalas:
    /\b(\d+\s*%|0,00[368]\s+puntos|0,25\s+puntos|40\.000\s+euros|15\.000\s+euros|80\.000\s+euros|60\.000\s+euros|25\s+a\s+49\s+puntos|50\s+a\s+74\s+puntos|75\s+a\s+100\s+puntos|10\s+a\s+14\s+puntos|22\s+a\s+46\s+puntos|56\s+a\s+110|Grado\s+(?:I|II|III)|Clase\s+[0-4]|Nivel\s+[12])\b/i,
   autores:
    /\b(Mary\s+Ellen\s+Richmond|Gordon\s+Hamilton|Florence\s+Hollis|Virginia\s+Robinson|Reid\s+y\s+Laura\s+Epstein|Gerald\s+Caplan|Urie\s+Bronfenbrenner|Jack\s+Rothman|Avedis\s+Donabedian|Jonathan\s+Bradshaw|Jes[uú]s\s+Ib[aá][ñn]ez|Norman\s+K\.\s+Denzin|McGoldrick\s+y\s+Randy\s+Gerson|Ann\s+Hartman|Teresa\s+Rossell|Beauchamp\s+y\s+James\s+F\.\s+Childress|Diego\s+Gracia|Maslach\s+y\s+Susan\s+E\.\s+Jackson|Paul\s+Watzlawick|Kimberl[eé]\s+Crenshaw|Aaron\s+Antonovsky|Sherry\s+Arnstein|G[øo]sta\s+Esping-Andersen|Richard\s+Titmuss|T\.?\s*H\.?\s*Marshall|William\s+Beveridge|Otto\s+von\s+Bismarck|Adela\s+Cortina|Robert\s+Castel|Amartya\s+Sen|SAMUR\s+Social|AMAPAD|ARRMI|Comisi[oó]n\s+de\s+Tutela\s+del\s+Menor|silencio\s+administrativo\s+(?:negativo|desestimatorio|positivo))\b/i,
  };

  const fallbackPoolsByType = {
   plazos: [
    '10 días hábiles',
    '20 días hábiles',
    'tres meses hábiles',
    'seis meses',
    '24 horas',
    '72 horas',
    'quince días naturales',
   ],
   leyes: [
    'Ley 12/2022',
    'Decreto 51/2023',
    'Artículo 16.2',
    'Artículo 40',
    'Artículo 69',
    'Ley 39/2015',
    'Ley 4/2023',
    'Real Decreto 888/2022',
   ],
   escalas: [
    '25 a 49 puntos',
    '50 a 74 puntos',
    '75 a 100 puntos',
    'Grado I',
    'Grado II',
    'Grado III',
    '60%',
    '0,25 puntos',
   ],
   autores: [
    'Mary Ellen Richmond',
    'Gøsta Esping-Andersen',
    'Richard Titmuss',
    'Avedis Donabedian',
    'Urie Bronfenbrenner',
    'Adela Cortina',
    'Robert Castel',
   ],
  };

  const categoriesOrder =
   categoryFilter === 'plazos'
    ? ['plazos']
    : categoryFilter === 'leyes'
    ? ['leyes']
    : categoryFilter === 'escalas'
    ? ['escalas']
    : categoryFilter === 'autores'
    ? ['autores']
    : ['plazos', 'escalas', 'autores', 'leyes'];

  const poolsByType = {
   plazos: [...fallbackPoolsByType.plazos],
   leyes: [...fallbackPoolsByType.leyes],
   escalas: [...fallbackPoolsByType.escalas],
   autores: [...fallbackPoolsByType.autores],
  };

  const candidateCards = [];
  const cleanQuestions = questionBank.filter(
   (q) => !isDefectiveOrAdminQuestion(q)
  );

  cleanQuestions.forEach((q) => {
   const rawCorrect = (q.options[q.correctIndex] || '').replace(
    /^[A-D]\)\s*/i,
    ''
   );
   let matchedTarget = null;
   let matchedType = null;

   for (const catKey of categoriesOrder) {
    const rgx = patterns[catKey];
    const m = rawCorrect.match(rgx);
    if (m && m[0]) {
     matchedTarget = m[0].trim();
     matchedType = catKey;
     break;
    }
   }

   if (matchedTarget && matchedType) {
    poolsByType[matchedType].push(matchedTarget);
    const maskedSentence = rawCorrect.replace(
     matchedTarget,
     ' [ _______ ] '
    );
    candidateCards.push({
     id: `cloze-${q.id}`,
     sourceQuestionId: q.id,
     topicId: q.topicId,
     targetType: matchedType,
     originType: q.originType,
     promptContext: q.question,
     maskedSentence,
     fullSentence: rawCorrect,
     targetAnswer: matchedTarget,
     explanation: q.explanation,
    });
   }
  });

  // Barajar las tarjetas candidatas para que cada Sprint de 10 min sea nuevo y variado
  const shuffledCards = [...candidateCards].sort(() => Math.random() - 0.5);

  // Generar 3 distractores EXCLUSIVAMENTE de la misma familia (plazos contra plazos, leyes contra leyes, autores contra autores)
  const finalCards = shuffledCards.slice(0, count).map((card) => {
   const sameTypePool = Array.from(
    new Set(
     (poolsByType[card.targetType] || []).filter(
      (t) => t.toLowerCase() !== card.targetAnswer.toLowerCase()
     )
    )
   ).sort(() => Math.random() - 0.5);

   const distractors = sameTypePool.slice(0, 3);
   const choices = [card.targetAnswer, ...distractors].sort(() =>
    Math.random() - 0.5
   );
   return { ...card, choices };
  });

  setClozeSession({
   categoryFilter,
   cards: finalCards,
   currentIdx: 0,
   userInput: '',
   strictWriteMode: false,
   results: {},
   showSolutionCurrent: false,
   timeLeft: 600,
   isFinished: false,
  });
  setExamSession(null);
  setActiveModule('03');
 };

 useEffect(() => {
  if (!clozeSession || clozeSession.isFinished) return;
  const timer = setInterval(() => {
   setClozeSession((prev) => {
    if (!prev || prev.isFinished) return prev;
    if (prev.timeLeft <= 1) return { ...prev, timeLeft: 0, isFinished: true };
    return { ...prev, timeLeft: prev.timeLeft - 1 };
   });
  }, 1000);
  return () => clearInterval(timer);
 }, [Boolean(clozeSession), clozeSession?.isFinished]);

 const submitClozeAnswer = (chosenValue) => {
  if (!clozeSession) return;
  const card = clozeSession.cards[clozeSession.currentIdx];
  const cleanUser = (chosenValue || '').trim().toLowerCase();
  const cleanTarget = card.targetAnswer.trim().toLowerCase();

  const isCorrect =
   cleanUser === cleanTarget ||
   (cleanUser.length >= 4 && cleanTarget.includes(cleanUser)) ||
   (cleanTarget.length >= 4 && cleanUser.includes(cleanTarget));

  // Sincronizar con Cajas Leitner y lista de fallos
  const qId = card.sourceQuestionId;
  setLeitnerBoxes((prev) => ({
   ...prev,
   [qId]: isCorrect ? Math.min(4, (prev[qId] || 2) + 1) : 1
  }));
  if (!isCorrect) {
   setFailedQuestionIds((prev) => Array.from(new Set([...prev, qId])));
  } else {
   setFailedQuestionIds((prev) => prev.filter((id) => id !== qId));
  }

  setClozeSession((prev) => ({
   ...prev,
   results: {
    ...prev.results,
    [card.id]: { isCorrect, userValue: chosenValue }
   },
   showSolutionCurrent: true
  }));
 };
 // SIMULADOR CON GESTIÓN DEL RIESGO (DUDA ENTRE 2 OPCIONES + NAVEGADOR DE 2 VUELTAS)
 const [examSession, setExamSession] = useState(null);

 useEffect(() => {
  if (!examSession || examSession.isFinished) return;
  const timer = setInterval(() => {
   setExamSession((prev) => {
    if (!prev || prev.isFinished) return prev;
    if (prev.timeLeft <= 1) return { ...prev, timeLeft: 0 };
    return { ...prev, timeLeft: prev.timeLeft - 1 };
   });
  }, 1000);
  return () => clearInterval(timer);
 }, [Boolean(examSession), examSession?.isFinished]);

 const launchStrategicSimulator = (
  topicFilterId = null,
  splitPart = null,
  onlyLeitnerBox1 = false
 ) => {
  const isAyto = activeConvocatoria === 'ayto';
  const fullCount = isAyto ? 120 : activeConvocatoria === 'sermas' ? 110 : 85;
  const fullMinutes = isAyto
   ? 129
   : activeConvocatoria === 'sermas'
   ? 120
   : 85;

  const cleanBank = questionBank.filter((q) => !isDefectiveOrAdminQuestion(q));
  if (cleanBank.length !== questionBank.length) {
   setQuestionBank(cleanBank);
  }

  let pool = [...cleanBank];
  if (onlyLeitnerBox1) {
   pool = cleanBank.filter(
    (q) =>
     (leitnerBoxes[q.id] || 2) === 1 || failedQuestionIds.includes(q.id)
   );
  } else if (topicFilterId) {
   const topicSpecificQs = cleanBank.filter(
    (q) => q.topicId === topicFilterId
   );
   if (topicSpecificQs.length >= 8) {
    pool = topicSpecificQs;
   } else {
    const topicObj = findTopicAcrossAllCatalogs(topicFilterId);
    const generatedMono = buildMonographicQuestionsForTopic(topicObj, [
     ...documentsLibrary,
     ...essaysLibrary,
    ]);
    const existingQTexts = new Set(
     topicSpecificQs.map((q) => q.question.trim().toLowerCase())
    );
    const uniqueMono = generatedMono.filter(
     (q) => !existingQTexts.has(q.question.trim().toLowerCase())
    );
    if (uniqueMono.length > 0) {
     setQuestionBank((prev) => [...uniqueMono, ...prev]);
    }
    pool = [...topicSpecificQs, ...uniqueMono];
   }
  } else {
   const isMatchConv = (tid = '') =>
    activeConvocatoria === 'sermas'
     ? tid.startsWith('S-') || tid.startsWith('G') || tid.startsWith('E')
     : activeConvocatoria === 'ayto'
     ? tid.startsWith('AY-') || tid.startsWith('G') || tid.startsWith('E')
     : !tid.startsWith('S-') && !tid.startsWith('AY-');
   const convBank = cleanBank.filter((q) => isMatchConv(q.topicId));
   const sourceBank = convBank.length >= 20 ? convBank : cleanBank;
   const shuffleLocal = (arr) => [...arr].sort(() => Math.random() - 0.5);
   const genPool = shuffleLocal(
    sourceBank.filter((q) =>
     /^(G|S-[1-7]$|AY-([1-9]|1\d|20)$)/.test(q.topicId)
    )
   );
   const espPool = shuffleLocal(
    sourceBank.filter(
     (q) => !/^(G|S-[1-7]$|AY-([1-9]|1\d|20)$)/.test(q.topicId)
    )
   );
   const targetGen = Math.max(1, Math.round(fullCount * 0.2));
   pool = [
    ...genPool.slice(0, targetGen),
    ...espPool.slice(0, fullCount - targetGen),
   ];
  }
  if (pool.length === 0) pool = [...cleanBank];

  // Barajar aleatoriamente el orden de las preguntas y la letra de la opción correcta (A/B/C/D o A/B/C en Ayto)
  const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const shuffledPool = shuffleArr(pool);

  const adaptedPool = shuffledPool.map((q) => {
   const cleanOpts = (q.options || []).map((txt, idx) => ({
    text: txt.replace(/^[A-Da-d][).]\s*/i, '').trim(),
    isCorrect: idx === q.correctIndex,
   }));

   const selectedOpts =
    isAyto && cleanOpts.length > 3
     ? shuffleArr([
       cleanOpts.find((o) => o.isCorrect) || cleanOpts[0],
       ...shuffleArr(cleanOpts.filter((o) => !o.isCorrect)).slice(0, 2),
      ])
     : shuffleArr(cleanOpts);

   const newCorrectIdx = Math.max(
    0,
    selectedOpts.findIndex((o) => o.isCorrect)
   );
   const relabeledOpts = selectedOpts.map(
    (o, idx) => `${['A', 'B', 'C', 'D'][idx]}) ${o.text}`
   );

   return { ...q, options: relabeledOpts, correctIndex: newCorrectIdx };
  });

  const targetQuestions = splitPart
   ? adaptedPool.slice(0, Math.ceil(fullCount / 2))
   : adaptedPool.slice(0, fullCount);

  setExamSession({
   title: onlyLeitnerBox1
    ? `Test de Choque Caja 1 Leitner (+24h)`
    : topicFilterId
    ? `Test Monográfico [${topicFilterId}] (${
      isAyto ? '3 Opciones' : '4 Opciones'
     })`
    : splitPart === 1
    ? `Simulacro Oficial Partido · Parte 1 (Bloque 2 Post-Cole · 60 min)`
    : splitPart === 2
    ? `Simulacro Oficial Partido · Parte 2 (Bloque 3 Sobremesa · 60 min)`
    : `Simulacro Oficial ${activeConvocatoria.toUpperCase()} (20% Gen / 80% Esp · ${
      isAyto
       ? '3 Opciones · -1/3'
       : activeConvocatoria === 'sermas'
       ? '4 Opciones · -0,25'
       : '4 Opciones · -1/3'
     })`,
   questions: targetQuestions,
   answers: {},
   doubtsMap: {},
   selectingDoubtMode: false,
   filterOnlyDoubts: false,
   currentIdx: 0,
   timeLeft: splitPart ? 3600 : fullMinutes * 60,
   isFinished: false,
   riskReport: null,
  });
  setActiveModule('03');
 };

 const pauseSimulatorForBlock3 = () => {
  if (!examSession) return;
  setStudyPlan((prev) => ({ ...prev, pausedSimSession: examSession }));
  setExamSession(null);
  setStatusBanner(
   '⏸ Simulacro guardado en pausa (incluyendo tus marcas de Duda entre 2) para el Bloque 3.'
  );
  setTimeout(() => setStatusBanner(''), 4000);
 };

 const toggleDoubtCandidateOption = (qId, optIdx) => {
  setExamSession((prev) => {
   if (!prev) return prev;
   const currentPair = prev.doubtsMap?.[qId] || [];
   let nextPair;
   if (currentPair.includes(optIdx)) {
    nextPair = currentPair.filter((idx) => idx !== optIdx);
   } else if (currentPair.length < 2) {
    nextPair = [...currentPair, optIdx];
   } else {
    nextPair = [currentPair[1], optIdx];
   }
   return {
    ...prev,
    doubtsMap: { ...prev.doubtsMap, [qId]: nextPair },
   };
  });
 };

 const finishSimulator = () => {
  if (!examSession) return;
  let hits = 0,
   errors = 0,
   blanks = 0;
  let doubtsTotal = 0,
   doubtsAnsweredHits = 0,
   doubtsAnsweredErrors = 0,
   doubtsLeftBlank = 0,
   doubtsWhereCorrectWasInPair = 0;

  const newFailed = new Set(failedQuestionIds);
  const updatedBoxes = { ...leitnerBoxes };
  const penaltyDivisor = activeConvocatoria === 'sermas' ? 4 : 3;

  examSession.questions.forEach((q) => {
   const ans = examSession.answers[q.id];
   const doubtPair = examSession.doubtsMap?.[q.id] || [];
   const isMarkedDoubt = doubtPair.length > 0;
   const currentBox = updatedBoxes[q.id] || 2;

   if (isMarkedDoubt) {
    doubtsTotal++;
    if (doubtPair.includes(q.correctIndex)) {
     doubtsWhereCorrectWasInPair++;
    }
   }

   if (ans === undefined) {
    blanks++;
    if (isMarkedDoubt) doubtsLeftBlank++;
    updatedBoxes[q.id] = 1;
   } else if (ans === q.correctIndex) {
    hits++;
    if (isMarkedDoubt) doubtsAnsweredHits++;
    newFailed.delete(q.id);
    updatedBoxes[q.id] = Math.min(4, currentBox + 1);
   } else {
    errors++;
    if (isMarkedDoubt) doubtsAnsweredErrors++;
    newFailed.add(q.id);
    updatedBoxes[q.id] = 1;
   }
  });

  const netScore = Math.max(0, hits - errors / penaltyDivisor);
  const maxQ = Math.max(1, examSession.questions.length);
  const gradeOver10 = ((netScore / maxQ) * 10).toFixed(2);

  const netPointsFromDoubts = (
   doubtsAnsweredHits -
   doubtsAnsweredErrors / penaltyDivisor
  ).toFixed(2);
  const gradeImpactOver10 = (
   ((doubtsAnsweredHits - doubtsAnsweredErrors / penaltyDivisor) / maxQ) *
   10
  ).toFixed(2);

  const ordCutoff =
   activeConvocatoria === 'ayto'
    ? 120
    : activeConvocatoria === 'sermas'
    ? 100
    : 80;
  let firstHalfErrors = 0,
   secondHalfErrors = 0,
   reserveHits = 0,
   reserveTotal = 0;
  const halfIdx = Math.floor(examSession.questions.length / 2);

  examSession.questions.forEach((q, idx) => {
   const ans = examSession.answers[q.id];
   const isErr = ans !== undefined && ans !== q.correctIndex;
   if (idx < halfIdx && isErr) firstHalfErrors++;
   if (idx >= halfIdx && isErr) secondHalfErrors++;
   if (idx >= ordCutoff) {
    reserveTotal++;
    if (ans === q.correctIndex) reserveHits++;
   }
  });

  const riskReport = {
   doubtsTotal,
   doubtsAnsweredHits,
   doubtsAnsweredErrors,
   doubtsLeftBlank,
   doubtsWhereCorrectWasInPair,
   netPointsFromDoubts,
   gradeImpactOver10,
   firstHalfErrors,
   secondHalfErrors,
   reserveHits,
   reserveTotal,
   ordCutoff,
   penaltyLabel:
    activeConvocatoria === 'sermas' ? '-0,25 (1/4)' : '-0,33 (1/3)',
  };

  setFailedQuestionIds(Array.from(newFailed));
  setLeitnerBoxes(updatedBoxes);
  setCalcEj1(Number(gradeOver10));
  setExamHistory((prev) => [
   {
    id: `hist-${Date.now()}`,
    date: new Date().toLocaleDateString('es-ES'),
    title: examSession.title,
    gradeOver10,
    hits,
    errors,
    blanks,
    netPointsFromDoubts,
   },
   ...prev,
  ]);
  setExamSession((prev) => ({ ...prev, isFinished: true, riskReport }));
 };

 // EXPORTAR / IMPORTAR PAQUETE JSON DEL GRUPO DE ESTUDIO
 const exportGroupPackageJson = () => {
  const pkg = {
   exportedBy: PROFILES[activeProfile].name,
   role: PROFILES[activeProfile].role,
   date: new Date().toISOString(),
   questionBank,
   peerReviewQueue,
  };
  const blob = new Blob([JSON.stringify(pkg, null, 2)], {
   type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PaqueteGrupo_TS_${PROFILES[activeProfile].name}.json`;
  a.click();
  URL.revokeObjectURL(url);
 };

 const importGroupPackageJson = async (file) => {
  if (!file) return;
  try {
   const text = await file.text();
   const pkg = JSON.parse(text);
   const existingBankTexts = new Set(
    questionBank.map((q) => q.question.trim().toLowerCase())
   );
   const existingQueueTexts = new Set(
    peerReviewQueue.map((q) => q.question.trim().toLowerCase())
   );

   const incomingBank = (pkg.questionBank || []).filter(
    (q) => !existingBankTexts.has(q.question.trim().toLowerCase())
   );
   const incomingQueue = (pkg.peerReviewQueue || []).filter(
    (q) =>
     !existingQueueTexts.has(q.question.trim().toLowerCase()) &&
     !existingBankTexts.has(q.question.trim().toLowerCase())
   );

   setQuestionBank((prev) => [...incomingBank, ...prev]);
   setPeerReviewQueue((prev) => [...incomingQueue, ...prev]);
   setStatusBanner(
    `🤝 Paquete de ${
     pkg.exportedBy || 'compañera'
    } fusionado sin duplicados: +${incomingBank.length} al Banco y +${
     incomingQueue.length
    } a Revisión.`
   );
  } catch {
   setStatusBanner('⚠️ Archivo JSON no válido.');
  }
  setTimeout(() => setStatusBanner(''), 5000);
 };

// SEGURIDAD 100%: COPIA DE SEGURIDAD INTEGRAL Y RESTAURACIÓN COMPLETA
const exportFullMasterBackup = () => {
 const fullBackup = {
  version: '2026-MASTER-V6-COMPLETE',
  timestamp: new Date().toISOString(),
  activeProfile,
  customNames,
  topicData,
  failedQuestionIds,
  leitnerBoxes,
  errorCausesLog,
  examHistory,
  grades: { ej1: calcEj1, ej2: calcEj2, ej3: calcEj3 },
  studyPlan,
  netStudyMinutes,
  sermasBaremo,
  questionBank,
  essaysLibrary,
  documentsLibrary,
  storiesLibrary,
  customPracticalCases,
  flashcardMastery
 };
 const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `BACKUP_TOTAL_OPOSICIONES_${PROFILES[activeProfile].name}_${new Date().toISOString().slice(0, 10)}.json`;
 a.click();
 URL.revokeObjectURL(url);
 setStatusBanner('🛡️ Copia de seguridad integral descargada al 100% (Temas, PDFs, Progreso, Leitner y Banco).');
 setTimeout(() => setStatusBanner(''), 4000);
};

const exportMasterCheatSheet6PagesPDF = () => generateMaster6PagesPDF(setStatusBanner);

const restoreFullMasterBackup = async (file) => {
 if (!file) return;
 try {
  const raw = await file.text();
  const data = JSON.parse(raw);
  if (data.customNames) setCustomNames(data.customNames);
  if (data.netStudyMinutes !== undefined)
   setNetStudyMinutes(Number(data.netStudyMinutes) || 0);
  if (data.topicData) setTopicData(data.topicData);
  if (data.failedQuestionIds) setFailedQuestionIds(data.failedQuestionIds);
  if (data.leitnerBoxes) setLeitnerBoxes(data.leitnerBoxes);
  if (data.errorCausesLog) setErrorCausesLog(data.errorCausesLog);
  if (data.examHistory) setExamHistory(data.examHistory);
  if (data.grades) {
   setCalcEj1(data.grades.ej1);
   setCalcEj2(data.grades.ej2);
   setCalcEj3(data.grades.ej3);
  }
  if (data.studyPlan) setStudyPlan(data.studyPlan);
  if (data.sermasBaremo) setSermasBaremo(data.sermasBaremo);
  if (data.questionBank) setQuestionBank(data.questionBank);
  if (data.essaysLibrary) {
   setEssaysLibrary(data.essaysLibrary);
   await saveToStore(STORE_ESSAYS, data.essaysLibrary);
  }
  if (data.documentsLibrary) {
   setDocumentsLibrary(data.documentsLibrary);
   await saveToStore(STORE_DOCS, data.documentsLibrary);
  }
  if (data.storiesLibrary) {
   setStoriesLibrary(data.storiesLibrary);
   localStorage.setItem('cam_stories_logic_v6_bocm2026', JSON.stringify(data.storiesLibrary));
  }
  if (data.customPracticalCases) {
   setCustomPracticalCases(data.customPracticalCases);
   localStorage.setItem('cam_custom_cases_v5', JSON.stringify(data.customPracticalCases));
  }
  if (data.flashcardMastery) {
   setFlashcardMastery(data.flashcardMastery);
   localStorage.setItem('cam_flashcard_mastery_v5', JSON.stringify(data.flashcardMastery));
  }
  setStatusBanner('✅ Restauración completa verificada al 100%: Todos tus temas, historias lógicas, notas y avances han sido recuperados.');
 } catch {
  setStatusBanner('⚠️ El archivo de copia de seguridad no es válido.');
 }
 setTimeout(() => setStatusBanner(''), 5000);
};
 const correctedEj2Topics = useMemo(() => {
  return [...(essaysLibrary || [])]
   .filter(Boolean)
   .map((es) => {
    const rawId = String(es.topicId || 'E1');
    const normalizedId = rawId.startsWith('G')
     ? `E${rawId.replace(/^G/i, '')}`
     : rawId;
    return { ...es, topicId: normalizedId };
   })
   .sort((a, b) => {
    const numA = parseInt((a.topicId || '').replace(/\D/g, ''), 10) || 999;
    const numB = parseInt((b.topicId || '').replace(/\D/g, ''), 10) || 999;
    return numA - numB;
   });
 }, [essaysLibrary]);

 const MODULES_NAV = [
  { id: '00', code: '00', label: '🎯 Mi Plan y Bloques' },
  { id: '01', code: '01', label: `📚 Temario (${activeCatalog.length})` },
  {
   id: '02',
   code: '02',
   label: `🗄️ Banco y PDFs (${questionBank.length})`,
  },
  {
   id: '03',
   code: '03',
   label: `⚡ Simulacros y Plazos (Caja 1: ${leitnerCounts.box1})`,
  },
  {
   id: '04',
   code: '04',
   label: `✍️ Desarrollo Ej. 2 (${correctedEj2Topics.length}/67)`,
  },
  {
   id: '05',
   code: '05',
   label: `📋 Prácticos Ej. 3 (${
    OFFICIAL_10_PRACTICAL_CASES.length + customPracticalCases.length
   })`,
  },
  {
   id: '07',
   code: '06',
   label: `🧠 Memoria, Glosario y Grupo (${storiesLibrary.length})`,
  },
 ];

 return (
  <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-slate-800 dark:text-stone-100 font-sans pb-14 transition-colors">
   {/* CABECERA COMPACTA E INTELIGENTE (OPTIMIZADA PARA MÓVIL Y ESCRITORIO) */}
   <header className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30 shadow-xs">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 space-y-2">
     {!isHeaderCompact && (
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
       <div className="flex items-center justify-between w-full lg:w-auto gap-2.5">
        <div className="flex items-center gap-2.5">
         <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#D97757] text-white flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-xs shrink-0">
          TS
         </div>
         <div>
          <span className="text-[10px] font-extrabold text-[#D97757] uppercase tracking-wider block leading-tight">
           TRIPLE CONVOCATORIA · CAM (83) · SERMAS (50) · AYTO (90) · TRONCO ESTATAL
          </span>
          <h1 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white leading-tight">
           Sistema Integral de Plaza · Leitner, Riesgo 50/50, Cloze y Auditoría Tribunal
          </h1>
         </div>
        </div>

        <button
         onClick={() => setIsHeaderCompact(true)}
         className="lg:hidden px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border text-[10px] font-bold text-stone-600 dark:text-stone-300 shrink-0 cursor-pointer"
         title="Compactar cabecera para ganar pantalla en el móvil"
        >
         🔼 Compactar
        </button>
       </div>

       <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-between lg:justify-end">
        <IsolatedFlowTimer
         netStudyMinutes={netStudyMinutes}
         onIncrementNetMinute={handleIncrementNetMinute}
        />

        <select
         value={activeConvocatoria}
         onChange={(e) => {
          setActiveConvocatoria(e.target.value);
          setSelectedBlockFilter('Todos');
          setExamSession(null);
          setStatusBanner(
           `🔄 Convocatoria activa: ${
            e.target.value === 'sermas'
             ? 'SERMAS Estatutario (50 Temas · 173 Plazas · -0,25)'
             : e.target.value === 'ayto'
             ? 'Ayuntamiento de Madrid (90 Temas · 3 Opciones · -1/3)'
             : 'CAM Orden 1049/2026 y 1472/2026 (83 Temas · 399 Plazas · -1/3)'
           }`
          );
          setTimeout(() => setStatusBanner(''), 4000);
         }}
         className="px-2.5 py-1 rounded-xl border border-stone-300 dark:border-stone-700 text-[11px] font-extrabold bg-[#FAF8F5] dark:bg-stone-800 cursor-pointer max-w-[210px] sm:max-w-none truncate"
        >
         <option value="cam_a2">
          🏛️ CAM Orden 1049/2026 (83 Temas)
         </option>
         <option value="sermas">
          🏥 SERMAS Res. 20/10/2026 (50 Temas)
         </option>
         <option value="ayto">
          🏢 Ayuntamiento Madrid (90 Temas)
         </option>
        </select>

        <div className="flex items-center gap-1.5">
         <button
          onClick={syncCommonTopicsAcrossExams}
          className="px-2 py-1 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-bold cursor-pointer"
          title="Sincroniza preguntas equivalentes entre CAM, SERMAS y Ayuntamiento"
         >
          🔗 Puente
         </button>

         <button
          onClick={toggleSimplifiedMode}
          className={`px-2 py-1 rounded-xl text-[11px] font-bold cursor-pointer border transition ${
           isSimplifiedMode
            ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700'
          }`}
          title="Alternar entre Modo Esencial (sin sobrecarga visual) y Modo Experto Completo"
         >
          {isSimplifiedMode ? '🌱 Esencial' : '🚀 Experto'}
         </button>

         <button
          onClick={launchDiaDMarathonSimulator}
          className="px-2 py-1 rounded-xl bg-rose-800 hover:bg-rose-950 text-white text-[11px] font-extrabold cursor-pointer shadow-2xs"
          title="Simulacro Maratón Día D: Test Oficial + 15m Descanso + Desarrollo 2 Bolas bajo Fatiga"
         >
          ☠️ Día D
         </button>

         <button
          onClick={() => setIsOnboardingOpen(true)}
          className="px-2 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold cursor-pointer"
          title="Abrir Guía Interactiva de Funcionamiento en 4 Pasos"
         >
          🧭 Guía
         </button>

         <button
          onClick={exportFullMasterBackup}
          className="px-2 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold cursor-pointer"
          title="Descargar Copia de Seguridad Total 100% (.json)"
         >
          🛡️ Backup
         </button>

         <span className="hidden sm:inline-block px-2 py-1 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border text-[11px] font-bold text-[#D97757]">
          👤 {PROFILES[activeProfile].name}
         </span>
         <ThemeSwitch
          isDark={isDark}
          onToggle={() => setTheme(isDark ? 'light' : 'dark')}
         />
         <button
          onClick={() => setIsHeaderCompact(true)}
          className="hidden lg:inline-block px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border text-[10px] font-bold text-stone-600 dark:text-stone-300 cursor-pointer"
          title="Modo lectura sin distracciones (compactar cabecera)"
         >
          🔼
         </button>
        </div>
       </div>
      </div>
     )}

     <nav className="flex items-center overflow-x-auto md:flex-wrap gap-1.5 pt-1 pb-0.5 border-t border-stone-100 dark:border-stone-800 no-scrollbar">
      {isHeaderCompact && (
       <button
        onClick={() => setIsHeaderCompact(false)}
        className="px-2.5 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-[11px] font-extrabold shrink-0 cursor-pointer"
        title="Mostrar barra superior completa"
       >
        🔽 Mostrar Barra Superior
       </button>
      )}
      {MODULES_NAV.map((m) => {
       const isCurrent =
        activeModule === m.id ||
        (m.id === '04' && activeModule === '04B') ||
        (m.id === '02' && activeModule === '06') ||
        (m.id === '07' && activeModule === '08');
       return (
        <button
         key={m.id}
         onClick={() => {
          if (m.id === '04' && correctedEj2Topics.length > 0) {
           setEj2SubTab('clean');
          }
          setActiveModule(m.id);
         }}
         className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition shrink-0 flex items-center gap-1.5 ${
          isCurrent
           ? 'bg-[#D97757] text-white shadow-sm ring-2 ring-[#D97757]/30'
           : 'bg-[#FAF8F5] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 border border-stone-200/70 dark:border-stone-700'
         }`}
        >
         <span className="opacity-75 font-mono text-[10px]">
          {m.code}
         </span>
         <span>{m.label}</span>
        </button>
       );
      })}
     </nav>
    </div>
   </header>

   {/* MODAL DE ONBOARDING INTERACTIVO Y SELECTOR DE COMPLEJIDAD VISUAL */}
   <InteractiveOnboardingModal
    isOpen={isOnboardingOpen}
    onClose={closeOnboardingModal}
    isSimplifiedMode={isSimplifiedMode}
    onToggleSimplifiedMode={toggleSimplifiedMode}
    onNavigateModule={(modId) => setActiveModule(modId)}
   />

   {/* MODAL DEL ENTRENADOR DE ESQUELETO EN FRÍO (7 MINUTOS - ACTIVE RECALL) */}
   {skeletonTrainer.isOpen && skeletonTrainer.topic && (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
     <div className="bg-white dark:bg-stone-900 max-w-2xl w-full rounded-2xl p-6 border shadow-xl space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
       <div>
        <span className="text-[11px] font-bold text-[#D97757] uppercase">
         🧠 ENTRENAMIENTO ACTIVE RECALL · ESQUELETO EN FRÍO (7 MINUTOS)
        </span>
        <h3 className="text-sm font-bold mt-0.5">
         [{skeletonTrainer.topic.id}] {skeletonTrainer.topic.title}
        </h3>
       </div>
       <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 font-mono font-extrabold text-xs">
         ⏱ {Math.floor(skeletonTrainer.timeLeft / 60)}:
         {String(skeletonTrainer.timeLeft % 60).padStart(2, '0')}
        </span>
        <button
         onClick={() =>
          setSkeletonTrainer({
           isOpen: false,
           topic: null,
           userRecallText: '',
           timeLeft: 420,
           evaluationResult: null,
          })
         }
         className="text-xs font-bold px-2.5 py-1 rounded bg-stone-200 dark:bg-stone-800 cursor-pointer"
        >
         ✕ Cerrar
        </button>
       </div>
      </div>

      <p className="text-xs text-stone-600 dark:text-stone-300">
       Sin mirar apuntes, teclea el{' '}
       <b>índice de sub-epígrafes, leyes con año y autores</b> que
       recuerdes de este tema antes de abrir el texto:
      </p>

      <ZeroLagBufferedTextarea
       rows={6}
       value={skeletonTrainer.userRecallText}
       onCommit={(nextVal) =>
        setSkeletonTrainer((prev) => ({
         ...prev,
         userRecallText: nextVal,
        }))
       }
       placeholder="1. Introducción y marco constitucional... 2. Ley 12/2022... 3. Plazos e instrumentos..."
       className="w-full p-3 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800"
      />

      <div className="flex gap-2">
       <button
        onClick={evaluateSkeletonRecall}
        className="px-4 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold cursor-pointer"
       >
        ✔ Comprobar Esqueleto frente al Epígrafe Oficial
       </button>
       <button
        onClick={() => {
         const t = skeletonTrainer.topic;
         setSkeletonTrainer({
          isOpen: false,
          topic: null,
          userRecallText: '',
          timeLeft: 420,
          evaluationResult: null,
         });
         handleGenerateMagistralTopic(t);
        }}
        className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
       >
        ✍️ Ver / Generar Tema Magistral 10/10
       </button>
      </div>

      {skeletonTrainer.evaluationResult && (
       <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border text-xs space-y-2">
        <div className="font-extrabold text-emerald-700">
         Cobertura en frío de sub-epígrafes oficiales:{' '}
         {skeletonTrainer.evaluationResult.scorePct}% ·{' '}
         {skeletonTrainer.evaluationResult.hasLawCitation
          ? '✔ Cita normativa detectada'
          : '⚠️ Te faltó citar Leyes/Decretos'}
        </div>
        {skeletonTrainer.evaluationResult.forgotten.length > 0 && (
         <div className="text-rose-700">
          <b>Sub-epígrafes del boletín que olvidaste mencionar:</b>{' '}
          {skeletonTrainer.evaluationResult.forgotten.join(' · ')}
         </div>
        )}
       </div>
      )}
     </div>
    </div>
   )}

   {/* MODAL BLOQUEANTE DEL SIMULACRO MARATÓN "DÍA D" (RESISTENCIA Y FATIGA EXTREMA) */}
   {diaDSimulator.isOpen && (
    <div className="fixed inset-0 bg-stone-950/90 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
     <div className="bg-white dark:bg-stone-900 max-w-4xl w-full rounded-2xl p-5 sm:p-6 border-2 border-rose-600 shadow-2xl space-y-4 my-6">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
       <div>
        <span className="text-[10px] font-extrabold text-rose-700 dark:text-rose-400 uppercase block">
         ☠️ SIMULACRO OFICIAL «DÍA D» · PROTOCOLO DE RESISTENCIA Y FATIGA EXTREMA (SIN SALIR DEL AULA)
        </span>
        <h3 className="text-base font-extrabold">
         {diaDSimulator.stage === 1
          ? `ETAPA 1 DE 3 · CUESTIONARIO TIPO TEST (${diaDSimulator.testQuestions.length} Preguntas)`
          : diaDSimulator.stage === 2
          ? 'ETAPA 2 DE 3 · DESCANSO REGLAMENTARIO DE TRANSICIÓN (15 MINUTOS EN EL AULA)'
          : diaDSimulator.stage === 3
          ? 'ETAPA 3 DE 3 · SORTEO DE 2 BOLAS Y DESARROLLO ESCRITO BAJO FATIGA COGNITIVA (90 MIN)'
          : '🏆 ACTA INTEGRAL DE RESISTENCIA DEL DÍA D (TEST + DESARROLLO BAJO FATIGA)'}
        </h3>
       </div>

       <div className="flex items-center gap-2">
        {diaDSimulator.stage <= 3 && (
         <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-950 font-mono font-extrabold text-xs border border-rose-400">
          ⏱ {Math.floor(diaDSimulator.secondsLeft / 60)}:
          {String(diaDSimulator.secondsLeft % 60).padStart(2, '0')}
         </span>
        )}
        <button
         onClick={() =>
          setDiaDSimulator((p) => ({
           ...p,
           isOpen: false,
           isRunning: false,
          }))
         }
         className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-xs font-bold cursor-pointer"
        >
         ✕ Abandonar Maratón
        </button>
       </div>
      </div>

      {/* BARRA DE PROGRESO DE LAS 3 ETAPAS */}
      <div className="grid grid-cols-3 gap-2 text-[11px] font-extrabold">
       <div
        className={`p-2 rounded-xl border text-center ${
         diaDSimulator.stage === 1
          ? 'bg-rose-700 text-white border-rose-800'
          : diaDSimulator.stage > 1
          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
          : 'bg-stone-100 dark:bg-stone-800'
        }`}
       >
        1. Test Oficial ({diaDSimulator.testGradeOver10 !== null ? `${diaDSimulator.testGradeOver10}/10` : 'En curso'})
       </div>
       <div
        className={`p-2 rounded-xl border text-center ${
         diaDSimulator.stage === 2
          ? 'bg-amber-600 text-white border-amber-700 animate-pulse'
          : diaDSimulator.stage > 2
          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
          : 'bg-stone-100 dark:bg-stone-800'
        }`}
       >
        2. Pausa Fisiológica (15 min)
       </div>
       <div
        className={`p-2 rounded-xl border text-center ${
         diaDSimulator.stage === 3
          ? 'bg-rose-700 text-white border-rose-800'
          : diaDSimulator.stage > 3
          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
          : 'bg-stone-100 dark:bg-stone-800'
        }`}
       >
        3. Desarrollo con Fatiga (90 min)
       </div>
      </div>

      {/* ETAPA 1: TEST */}
      {diaDSimulator.stage === 1 && diaDSimulator.testQuestions.length > 0 && (() => {
       const q = diaDSimulator.testQuestions[diaDSimulator.testCurrentIdx];
       const ans = diaDSimulator.testAnswers[q.id];
       return (
        <div className="space-y-3 text-xs">
         <div className="flex justify-between items-center text-[11px] text-stone-500">
          <span>
           Pregunta <b>{diaDSimulator.testCurrentIdx + 1}</b> de{' '}
           {diaDSimulator.testQuestions.length} · Tema [{q.topicId}]
          </span>
          <span>
           Respondidas: <b>{Object.keys(diaDSimulator.testAnswers).length}</b>
          </span>
         </div>

         <p className="text-sm font-bold leading-relaxed p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border">
          {q.question}
         </p>

         <div className="space-y-2">
          {q.options.map((opt, idx) => (
           <button
            key={idx}
            onClick={() =>
             setDiaDSimulator((p) => ({
              ...p,
              testAnswers: { ...p.testAnswers, [q.id]: idx },
             }))
            }
            className={`w-full p-3 rounded-xl border text-left cursor-pointer transition ${
             ans === idx
              ? 'bg-rose-700 text-white border-rose-800 font-bold'
              : 'bg-[#FAF8F5] dark:bg-stone-800'
            }`}
           >
            {opt}
           </button>
          ))}
         </div>

         <div className="flex justify-between items-center pt-3 border-t">
          <button
           disabled={diaDSimulator.testCurrentIdx === 0}
           onClick={() =>
            setDiaDSimulator((p) => ({
             ...p,
             testCurrentIdx: p.testCurrentIdx - 1,
            }))
           }
           className="px-3.5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 font-bold cursor-pointer disabled:opacity-40"
          >
           ← Anterior
          </button>

          <div className="flex gap-2">
           {diaDSimulator.testCurrentIdx <
            diaDSimulator.testQuestions.length - 1 && (
            <button
             onClick={() =>
              setDiaDSimulator((p) => ({
               ...p,
               testCurrentIdx: p.testCurrentIdx + 1,
              }))
             }
             className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold cursor-pointer"
            >
             Siguiente →
            </button>
           )}
           <button
            onClick={() => {
             let hits = 0,
              errors = 0;
             const pen = activeConvocatoria === 'sermas' ? 4 : 3;
             diaDSimulator.testQuestions.forEach((item) => {
              const a = diaDSimulator.testAnswers[item.id];
              if (a === item.correctIndex) hits++;
              else if (a !== undefined) errors++;
             });
             const net = Math.max(0, hits - errors / pen);
             const grade = (
              (net /
               Math.max(1, diaDSimulator.testQuestions.length)) *
              10
             ).toFixed(2);
             setDiaDSimulator((p) => ({
              ...p,
              stage: 2,
              secondsLeft: 900,
              isRunning: true,
              testGradeOver10: grade,
              testHits: hits,
              testErrors: errors,
             }));
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold cursor-pointer"
           >
            ✔ Entregar Etapa 1 (Test) e Iniciar Descanso de 15m →
           </button>
          </div>
         </div>
        </div>
       );
      })()}

      {/* ETAPA 2: DESCANSO REGLAMENTARIO DE 15 MINUTOS */}
      {diaDSimulator.stage === 2 && (
       <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 text-center space-y-4 text-xs">
        <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-extrabold">
         ✔ 1.er Ejercicio Entregado · Nota Neta en Test: {diaDSimulator.testGradeOver10} / 10 (Aciertos: {diaDSimulator.testHits} · Fallos: {diaDSimulator.testErrors})
        </span>
        <h4 className="text-base font-extrabold text-amber-950 dark:text-amber-100">
         🧘‍♀️ PROTOCOLO DE TRANSICIÓN NEUROFISIOLÓGICA (15 MINUTOS ANTES DE LAS BOLAS)
        </h4>
        <p className="text-stone-700 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
         Tu corteza prefrontal acaba de gastar glucosa decidiendo entre distractores. No cierres esta ventana: bebe agua, estira muñeca y trapecio, haz 5 respiraciones cuadradas (4s inspirar · 4s retener · 4s espirar) y prepárate para redactar con fatiga real.
        </p>
        <div className="pt-2">
         <button
          onClick={() =>
           setDiaDSimulator((p) => ({
            ...p,
            stage: 3,
            secondsLeft: 5400,
            isRunning: true,
           }))
          }
          className="px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold cursor-pointer shadow-md"
         >
          🎱 Terminar Descanso y Extraer las 2 Bolas del 2.º Ejercicio (90m) →
         </button>
        </div>
       </div>
      )}

      {/* ETAPA 3: SORTEO DE 2 BOLAS Y REDACCIÓN BAJO FATIGA */}
      {diaDSimulator.stage === 3 && (
       <div className="space-y-4 text-xs">
        {!diaDSimulator.chosenBall ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[diaDSimulator.ball1, diaDSimulator.ball2].map(
           (b, idx) =>
            b && (
             <div
              key={b.id}
              className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 border-2 border-rose-500/50 space-y-3 flex flex-col justify-between"
             >
              <div>
               <span className="px-2.5 py-0.5 rounded bg-rose-700 text-white font-extrabold text-[11px]">
                🎱 BOLA {idx + 1} · [{b.id}]
               </span>
               <h4 className="text-sm font-bold mt-2">
                {b.title}
               </h4>
              </div>
              <button
               onClick={() =>
                setDiaDSimulator((p) => ({
                 ...p,
                 chosenBall: b,
                }))
               }
               className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-extrabold cursor-pointer"
              >
               ✍️ Elegir esta Bola y Redactar bajo Fatiga (90m)
              </button>
             </div>
            )
          )}
         </div>
        ) : (
         <div className="space-y-3">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 font-bold">
           ✍️ Desarrollando bajo fatiga de 2.ª hora: [{diaDSimulator.chosenBall.id}]{' '}
           {diaDSimulator.chosenBall.title}
          </div>
          <ZeroLagBufferedTextarea
           rows={14}
           showPacingBar={true}
           value={diaDSimulator.essayDraft}
           onCommit={(val) =>
            setDiaDSimulator((p) => ({ ...p, essayDraft: val }))
           }
           placeholder="Demuestra resistencia cognitiva: 1. Introducción Constitucional y Ley 12/2022... 2. Epígrafes oficiales sin dejarte ninguno... 3. Plazos, Art. 16.2, Art. 40, Art. 69 y Decreto 51/2023... 4. Conclusión analítica al Tribunal..."
           className="w-full p-4 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800 font-serif leading-relaxed"
          />
          <button
           onClick={() => {
            const audit = auditDocumentTextValidity(
             diaDSimulator.essayDraft,
             diaDSimulator.chosenBall
            );
            setDiaDSimulator((p) => ({
             ...p,
             stage: 4,
             isRunning: false,
             essayAudit: audit,
            }));
           }}
           className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold cursor-pointer"
          >
           🏆 Finalizar Maratón «Día D» y Generar Acta Integral de Resistencia
          </button>
         </div>
        )}
       </div>
      )}

      {/* ETAPA 4: ACTA INTEGRAL DEL DÍA D */}
      {diaDSimulator.stage === 4 && (
       <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 space-y-3 text-xs">
        <h4 className="text-base font-extrabold text-emerald-950 dark:text-emerald-100">
         🏅 ACTA OFICIAL DEL SIMULACRO DE RESISTENCIA «DÍA D»
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
         <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border">
          <span className="text-[10px] text-stone-500 block">
           1.er Ejercicio (Test en Fresco)
          </span>
          <b className="text-base text-[#D97757]">
           {diaDSimulator.testGradeOver10} / 10
          </b>
         </div>
         <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border">
          <span className="text-[10px] text-stone-500 block">
           2.º Ejercicio (Desarrollo con Fatiga)
          </span>
          <b className="text-base text-emerald-700">
           {diaDSimulator.essayAudit?.finalScore || '0.00'} / 10
          </b>
         </div>
         <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border">
          <span className="text-[10px] text-stone-500 block">
           Media Combinada de Resistencia
          </span>
          <b className="text-base text-indigo-700">
           {(
            (Number(diaDSimulator.testGradeOver10 || 0) +
             Number(diaDSimulator.essayAudit?.finalScore || 0)) /
            2
           ).toFixed(2)}{' '}
           / 10
          </b>
         </div>
        </div>
        <p className="text-[11px] text-stone-600 dark:text-stone-300">
         Cobertura de sub-epígrafes bajo fatiga:{' '}
         <b>{diaDSimulator.essayAudit?.coveragePct || 0}%</b> ·{' '}
         Extensión alcanzada:{' '}
         <b>{diaDSimulator.essayAudit?.wordCount || 0} palabras</b>.
        </p>
       </div>
      )}
     </div>
    </div>
   )}

   {/* MODAL DEL SIMULADOR REAL DE SORTEO DE 2 BOLAS A CIEGAS (2.º EJERCICIO · 80 MIN) */}
   {twoBallsSim.isOpen && (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
     <div className="bg-white dark:bg-stone-900 max-w-4xl w-full rounded-2xl p-6 border shadow-2xl space-y-4 my-8">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
       <div>
        <span className="text-[11px] font-extrabold text-[#D97757] uppercase block">
         🎱 SIMULACRO OFICIAL A CIEGAS · SORTEO DE 2 BOLAS DEL BOMBO (BASE 8.3.2 BOCM: 90 MINUTOS · CORRECCIÓN DIRECTA)
        </span>
        <h3 className="text-base font-bold">
         {twoBallsSim.chosenTopic
          ? `Escribiendo en Frío: [${twoBallsSim.chosenTopic.id}] ${twoBallsSim.chosenTopic.title}`
          : '¡Bombo Extraído! Elige 1 de las 2 bolas extraídas al azar para desarrollar:'}
        </h3>
       </div>
       <div className="flex items-center gap-2">
        {twoBallsSim.chosenTopic && (
         <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-950 font-mono font-extrabold text-xs">
          ⏱ {Math.floor(twoBallsSim.secondsLeft / 60)}:
          {String(twoBallsSim.secondsLeft % 60).padStart(2, '0')}
         </span>
        )}
        <button
         onClick={launchTwoBallsBlindDraw}
         className="px-2.5 py-1 rounded-lg bg-purple-700 text-white text-xs font-bold cursor-pointer"
        >
         🎲 Volver a Sacar 2 Bolas
        </button>
        <button
         onClick={() =>
          setTwoBallsSim((prev) => ({
           ...prev,
           isOpen: false,
           isRunning: false,
          }))
         }
         className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-xs font-bold cursor-pointer"
        >
         ✕ Cerrar
        </button>
       </div>
      </div>

      {!twoBallsSim.chosenTopic ? (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
        {[twoBallsSim.ball1, twoBallsSim.ball2].map(
         (ball, idx) =>
          ball && (
           <div
            key={ball.id}
            className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 border-2 border-[#D97757]/50 space-y-3 flex flex-col justify-between"
           >
            <div className="space-y-1.5">
             <span className="px-2.5 py-1 rounded-full bg-[#D97757] text-white text-xs font-extrabold">
              🎱 BOLA {idx + 1} · [{ball.id}]
             </span>
             <h4 className="text-sm font-bold pt-1">
              {ball.title}
             </h4>
             <p className="text-[11px] text-stone-500">
              Estado actual en tu temario:{' '}
              <b>{topicData[ball.id]?.status || 'Pendiente'}</b>
             </p>
            </div>
            <button
             onClick={() =>
              setTwoBallsSim((prev) => ({
               ...prev,
               chosenTopic: ball,
               isRunning: true,
               secondsLeft: 5400,
               userDraft: '',
               auditResult: null,
              }))
             }
             className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
            >
             ✍️ Elegir esta Bola e Iniciar Reloj Oficial de 90 Minutos (Sin Apuntes)
            </button>
           </div>
          )
        )}
       </div>
      ) : (
       <div className="space-y-3">
        {(() => {
         const wCount = twoBallsSim.userDraft.trim()
          ? twoBallsSim.userDraft.trim().split(/\s+/).length
          : 0;
         const pct = Math.min(100, Math.round((wCount / 1850) * 100));
         const barColor =
          wCount < 1350
           ? 'bg-amber-500'
           : wCount <= 2350
           ? 'bg-emerald-600'
           : 'bg-rose-600';
         return (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs space-y-2">
           <div className="flex flex-wrap justify-between items-center gap-2">
            <span>
             <b>🔒 Modo Examen Real:</b> Palabras escritas:{' '}
             <b>{wCount}</b> / Meta óptima 1.850 pal (~
             {Math.round(wCount / 23)} min a mano)
            </span>
            <div className="flex flex-wrap gap-1.5">
             <button
              onClick={() => {
               const t = twoBallsSim.chosenTopic;
               const eps = extractSubEpigraphsFromTitle(
                t?.title || ''
               );
               const templateText = `1. INTRODUCCIÓN TÉCNICA, ENCUADRE CONSTITUCIONAL Y OBJETO DEL TEMA
El abordaje científico-técnico de «${
                t?.title || ''
               }» parte del Estado Social y Democrático de Derecho (artículos 1.1, 9.2, 10.1, 14 y 39 a 50 de la Constitución Española, en adelante CE, tras la reforma del artículo 49 de enero de 2024), del Estatuto de Autonomía de la Comunidad de Madrid (Ley Orgánica 3/1983, artículo 26.1.23) y de la Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid, consolidando el tránsito desde la beneficencia discrecional hacia el reconocimiento de derechos subjetivos exigibles.

${eps
                .map(
                 (ep, idx) =>
                  `${idx + 2}. ${ep.toUpperCase()}
[Desarrollar aquí contenido normativo, dispositivos de red, instrumentos y autores...]
`
                )
                .join('\n')}
${
                eps.length + 2
               }. SÍNTESIS METODOLÓGICA, DIAGNÓSTICO E INDICADORES DE EVALUACIÓN (CIERRE AL TRIBUNAL)
En conclusión, cabe destacar que la intervención profesional sobre este epígrafe se articula desde la Atención Social Primaria bajo la dirección exclusiva del Trabajador/a Social como Profesional de Referencia (artículo 16.2 de la Ley 12/2022), integrando la valoración en la Historia Social Única electrónica (Decreto 51/2023), el Informe Social prescriptor (artículo 69) y el Plan Individual de Atención Social en el plazo máximo de 10 días hábiles (artículo 40), con evaluación continua a los 3 y 6 meses y observancia de la Ley Orgánica 3/2018 y el Código Deontológico.`;
               setTwoBallsSim((prev) => ({
                ...prev,
                userDraft: prev.userDraft
                 ? `${prev.userDraft}

${templateText}`
                 : templateText,
               }));
              }}
              className="px-2.5 py-1 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[11px] cursor-pointer"
              title="Inserta el esqueleto numerado de epígrafes + introducción y conclusión comodín de alta puntuación"
             >
              ✨ Insertar Plantilla Arranque/Cierre 10/10
             </button>
             <button
              onClick={() =>
               setTwoBallsSim((prev) => ({
                ...prev,
                isRunning: !prev.isRunning,
               }))
              }
              className="px-2.5 py-1 rounded bg-amber-700 text-white font-bold text-[11px] cursor-pointer"
             >
              {twoBallsSim.isRunning
               ? '⏸ Pausar Reloj'
               : '▶ Reanudar'}
             </button>
            </div>
           </div>
           <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
            <div
             className={`h-full transition-all ${barColor}`}
             style={{ width: `${pct}%` }}
            />
           </div>
          </div>
         );
        })()}

        <ZeroLagBufferedTextarea
         rows={12}
         value={twoBallsSim.userDraft}
         onCommit={(nextVal) =>
          setTwoBallsSim((prev) => ({
           ...prev,
           userDraft: nextVal,
          }))
         }
         placeholder="1. INTRODUCCIÓN Y ENCUADRE CONSTITUCIONAL... 2. DESARROLLO DE SUB-EPÍGRAFES OFICIALES... 3. LEY 12/2022 (ARTS. 16.2, 40 Y 69)... 4. CONCLUSIÓN Y EVALUACIÓN..."
         className="w-full p-4 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800 font-serif leading-relaxed"
        />

        <div className="flex flex-wrap gap-2">
         <button
          onClick={() => {
           const audit = auditDocumentTextValidity(
            twoBallsSim.userDraft,
            twoBallsSim.chosenTopic
           );
           setTwoBallsSim((prev) => ({
            ...prev,
            isRunning: false,
            auditResult: audit,
           }));
          }}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
         >
          ✔ Entregar Examen en Frío y Auditar con Rúbrica Oficial (70/15/10/5)
         </button>

         <button
          onClick={() => {
           const t = twoBallsSim.chosenTopic;
           setTwoBallsSim((prev) => ({
            ...prev,
            isOpen: false,
            isRunning: false,
           }));
           handleGenerateMagistralTopic(t);
          }}
          className="px-4 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold cursor-pointer"
         >
          📖 Abrir Solución Magistral 10/10 de [{twoBallsSim.chosenTopic.id}]
         </button>
        </div>

        {twoBallsSim.auditResult && (
         <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-xs space-y-2">
          <div className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
           Calificación en Frío: {twoBallsSim.auditResult.finalScore} / 10 · Cobertura de Epígrafes BOCM:{' '}
           {twoBallsSim.auditResult.coveragePct}%
          </div>
          {twoBallsSim.auditResult.missingEpigraphs?.length > 0 && (
           <div className="text-rose-700">
            <b>Sub-epígrafes oficiales que te faltaron desarrollar:</b>{' '}
            {twoBallsSim.auditResult.missingEpigraphs.join(' · ')}
           </div>
          )}
         </div>
        )}
       </div>
      )}
     </div>
    </div>
   )}

   {/* MODAL DEL SIMULADOR DEL DÍA DE LA LECTURA PÚBLICA ANTE EL TRIBUNAL (VOZ Y RESPIRACIÓN) */}
   {tribunalReader.isOpen && (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 overflow-y-auto">
     <div className="bg-white dark:bg-stone-900 max-w-4xl w-full rounded-2xl p-6 border shadow-2xl space-y-4 my-8">
      {(() => {
       const words = tribunalReader.text.trim()
        ? tribunalReader.text.trim().split(/\s+/).length
        : 0;
       const targetReadMinutes = Math.max(1, Math.round(words / 130));
       const protectedForSpeech = tribunalReader.text
        .replace(
         /\b(Arts?|P[aá]gs?|N\.?[º°]|n\.?[º°]|D|Dña|Dr|Dra|Sr|Sra|Cap|Vol|n[uú]m|s|S)\.\s*/g,
         '$1__DOT__ '
        )
        .replace(/(\d+)\.(\d+)/g, '$1__DOT__$2');
       const sentences = protectedForSpeech
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.replace(/__DOT__/g, '.'))
        .filter((s) => s.trim().length > 0);
       const longSentencesCount = sentences.filter(
        (s) => s.trim().split(/\s+/).length > 45
       ).length;
       const currentWpm =
        tribunalReader.elapsedSeconds > 10
         ? Math.round((words / tribunalReader.elapsedSeconds) * 60)
         : 130;

       return (
        <>
         <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
          <div>
           <span className="text-[11px] font-extrabold text-[#D97757] uppercase block">
            🎙️ AUDITOR DE FLUIDEZ Y CLARIDAD DE REDACCIÓN PARA EL TRIBUNAL (BASE 8.3.2 Y 8.3.3 BOCM: CORRECCIÓN DIRECTA ESCRITA + REPASO ORAL 130 PAL/MIN)
           </span>
           <h3 className="text-base font-bold">
            {tribunalReader.title}
           </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
           {(() => {
            const remSec = Math.max(
             0,
             (tribunalReader.targetLimitSeconds ||
              targetReadMinutes * 60) -
              tribunalReader.elapsedSeconds
            );
            return (
             <span
              className={`px-3 py-1 rounded-xl font-mono font-extrabold text-xs border ${
               remSec <= 60 && tribunalReader.isRunning
                ? 'bg-rose-100 text-rose-900 border-rose-400 animate-pulse'
                : 'bg-amber-50 dark:bg-stone-800 text-amber-950 dark:text-amber-200 border-amber-300'
              }`}
             >
              ⏳ Resta:{' '}
              {Math.floor(remSec / 60)}:
              {String(remSec % 60).padStart(2, '0')} · Leído:{' '}
              {Math.floor(tribunalReader.elapsedSeconds / 60)}:
              {String(
               tribunalReader.elapsedSeconds % 60
              ).padStart(2, '0')}
             </span>
            );
           })()}
           <select
            value={tribunalReader.targetLimitSeconds || 900}
            onChange={(e) =>
             setTribunalReader((prev) => ({
              ...prev,
              targetLimitSeconds: Number(e.target.value),
              elapsedSeconds: 0,
             }))
            }
            className="px-2 py-1 rounded-lg border text-xs font-bold bg-[#FAF8F5] dark:bg-stone-800 cursor-pointer"
            title="Seleccionar tiempo del temporizador de lectura"
           >
            <option value={600}>⏱ Meta 10 min (Lectura rápida)</option>
            <option value={720}>⏱ Meta 12 min (1.550 pal)</option>
            <option value={900}>⏱ Meta 15 min (Tribunal estándar)</option>
            <option value={1200}>⏱ Meta 20 min (Lectura extensa)</option>
            <option value={2700}>⏱ Meta 45 min (Repaso profundo)</option>
            <option value={5400}>⏱ Meta 90 min (Simulacro escrito)</option>
           </select>
           <button
            onClick={() =>
             setTribunalReader((prev) => ({
              ...prev,
              isRunning: !prev.isRunning,
             }))
            }
            className="px-3 py-1 rounded-lg bg-[#D97757] text-white text-xs font-bold cursor-pointer"
           >
            {tribunalReader.isRunning ? '⏸ Pausar Lectura' : '▶ Iniciar Cronómetro Voz'}
           </button>
           <button
            onClick={() =>
             setTribunalReader((prev) => ({
              ...prev,
              elapsedSeconds: 0,
              isRunning: false,
             }))
            }
            className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-xs font-bold cursor-pointer"
           >
            ↺ Reiniciar
           </button>
           <button
            onClick={() =>
             setTribunalReader((prev) => ({
              ...prev,
              isOpen: false,
              isRunning: false,
             }))
            }
            className="px-2.5 py-1 rounded-lg bg-rose-700 text-white text-xs font-bold cursor-pointer"
           >
            ✕ Cerrar
           </button>
          </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border">
           <span className="text-[10px] text-stone-500 block">
            Extensión y Tiempo de Lectura Oral
           </span>
           <b>
            {words} palabras · ~{targetReadMinutes} min en voz alta (a 130 pal/m)
           </b>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border">
           <span className="text-[10px] text-stone-500 block">
            Alerta de Ahogo Vocal (&gt;45 pal/frase)
           </span>
           <b
            className={
             longSentencesCount > 0
              ? 'text-amber-700'
              : 'text-emerald-700'
            }
           >
            {longSentencesCount > 0
             ? `⚠️ ${longSentencesCount} frases largas (marcadas en amarillo para tomar aire)`
             : '✔ Ritmo respiratorio óptimo'}
           </b>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border flex justify-between items-center">
           <div>
            <span className="text-[10px] text-stone-500 block">
             Tamaño Teleprompter
            </span>
            <b>Ritmo actual: ~{currentWpm} pal/min</b>
           </div>
           <div className="flex gap-1">
            <button
             onClick={() =>
              setTribunalReader((p) => ({
               ...p,
               fontSize: 'text-sm',
              }))
             }
             className="px-2 py-1 rounded border text-[10px] font-bold cursor-pointer"
            >
             A-
            </button>
            <button
             onClick={() =>
              setTribunalReader((p) => ({
               ...p,
               fontSize: 'text-lg',
              }))
             }
             className="px-2 py-1 rounded border text-[10px] font-bold cursor-pointer"
            >
             A+
            </button>
           </div>
          </div>
         </div>

         <div
          className={`max-h-[60vh] overflow-y-auto p-5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-950 border font-serif leading-loose space-y-2 ${tribunalReader.fontSize}`}
         >
          {sentences.map((sent, i) => {
           const wCount = sent.trim().split(/\s+/).length;
           const isLong = wCount > 45;
           const hasLaw =
            /\b(Ley|Decreto|Art[ií]culo|Art\.|Constituci[oó]n|Plazo|10\s+d[ií]as|PIAS|PIIS|HSUe)\b/i.test(
             sent
            );
           const hasTransitionConnector =
            /(?:^\s*(?:[1-6]\.|ACTO\s+[IVX]+)|\b(?:En\s+conclusi[oó]n|Cabe\s+destacar|Por\s+consiguiente|En\s+consecuencia|Asimismo|No\s+obstante|Desde\s+la\s+perspectiva|Señores\s+miembros\s+del\s+Tribunal)\b)/i.test(
             sent
            );
           return (
            <span
             key={i}
             className={`inline ${
              isLong
               ? 'bg-amber-100/90 dark:bg-amber-950/60 px-1 rounded border-b border-amber-400'
               : hasTransitionConnector
               ? 'bg-emerald-50/90 dark:bg-emerald-950/50 px-1 rounded border-l-4 border-emerald-600'
               : ''
             }`}
            >
             {hasTransitionConnector && (
              <span
               className="text-[10px] font-sans font-extrabold text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-200/80 mx-1"
               title="Conector de transición o inicio de epígrafe: enfatiza el tono y mira al Tribunal"
              >
               🎯 [ÉNFASIS TRIBUNAL]
              </span>
             )}
             {hasLaw ? <b>{sent}</b> : sent}{' '}
             {isLong && (
              <span
               className="text-[10px] font-sans font-extrabold text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded bg-amber-200/80 mx-1"
               title="Frase de más de 45 palabras: haz una pausa respiratoria aquí ante el Tribunal"
              >
               🫁 [RESPIRA · {wCount} pal]
              </span>
             )}
            </span>
           );
          })}
         </div>
        </>
       );
      })()}
     </div>
    </div>
   )}

   <main className="max-w-7xl mx-auto px-4 py-6">
    {statusBanner && (
     <div className="mb-4 p-3.5 rounded-xl bg-emerald-800 text-white text-xs font-bold text-center shadow-xs">
      {statusBanner}
     </div>
    )}

    {isExtractingPdf && (
     <div className="mb-4 p-3.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold text-center animate-pulse">
      ⏳ {uploadProgressText}
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 00 · MI PREPARACIÓN, LEITNER, 4 BLOQUES Y BAREMO RMER      */}
    {/* ================================================================= */}
    {activeModule === '00' && (
     <div className="space-y-6">
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border shadow-xs space-y-5">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-4">
        <div>
         <span className="text-[11px] font-bold text-[#D97757] uppercase">
          00 · PANEL ESTRATÉGICO DE PLAZA · PERFIL ACTIVO:{' '}
          {PROFILES[activeProfile].name.toUpperCase()}
         </span>
         <h2 className="text-xl font-bold mt-0.5">
          Dominio Actual: {masteryStats.dominated} Dominados ·{' '}
          {masteryStats.studied} Estudiados · {masteryStats.pending}{' '}
          Pendientes (de {masteryStats.total})
         </h2>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-right">
         <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">
          🎲 Probabilidad Sorteo 2 Bolas (67 Específicos CAM)
         </span>
         <span className="text-lg font-extrabold text-emerald-900 dark:text-emerald-200">
          {twoBallsProbability.pct} (
          {twoBallsProbability.dominatedSpecific}/67 dominados)
         </span>
        </div>
       </div>

       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 flex justify-between items-center">
         <div>
          <span className="font-extrabold text-rose-800 block">
           📦 Caja 1 Leitner (+24h)
          </span>
          <span className="text-[11px] text-rose-600">
           Fallos urgentes
          </span>
         </div>
         <span className="text-lg font-extrabold text-rose-900">
          {leitnerCounts.box1}
         </span>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 flex justify-between items-center">
         <div>
          <span className="font-extrabold text-amber-800 block">
           📦 Caja 2 Leitner (+3d)
          </span>
          <span className="text-[11px] text-amber-700">
           En fijación
          </span>
         </div>
         <span className="text-lg font-extrabold text-amber-900">
          {leitnerCounts.box2}
         </span>
        </div>
        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 flex justify-between items-center">
         <div>
          <span className="font-extrabold text-sky-800 block">
           📦 Caja 3 Leitner (+7d)
          </span>
          <span className="text-[11px] text-sky-700">
           Consolidadas
          </span>
         </div>
         <span className="text-lg font-extrabold text-sky-900">
          {leitnerCounts.box3}
         </span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 flex justify-between items-center">
         <div>
          <span className="font-extrabold text-emerald-800 block">
           📦 Caja 4 Leitner (+21d)
          </span>
          <span className="text-[11px] text-emerald-700">
           Blindadas
          </span>
         </div>
         <span className="text-lg font-extrabold text-emerald-900">
          {leitnerCounts.box4}
         </span>
        </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2">
         <div className="flex justify-between items-center">
          <span className="text-xs font-bold">
           1.er Ejercicio · Cuestionario Test
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-extrabold">
           {calcEj1} / 10
          </span>
         </div>
         <p className="text-[11px] text-stone-500">
          {activeConvocatoria === 'ayto'
           ? 'Ayto. Madrid: 120+9 pregs en 129 min · 3 opciones (A,B,C) · Penalización -1/3'
           : activeConvocatoria === 'sermas'
           ? 'SERMAS: 100+10 pregs en 120 min · 4 opciones · Penalización -0,25 (sobre 50 ptos)'
           : 'CAM: 80+5 pregs en 85 min · 4 opciones · Penalización -1/3'}
         </p>
         <button
          onClick={() => launchStrategicSimulator()}
          className="w-full py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold cursor-pointer"
         >
          🚀 Lanzar Simulacro con Gestión de Duda 50/50
         </button>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2">
         <div className="flex justify-between items-center">
          <span className="text-xs font-bold">
           2.º Ejercicio · Desarrollo (1.850 pal / 90m · Corrección Directa)
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-extrabold">
           {calcEj2} / 10
          </span>
         </div>
         <p className="text-[11px] text-stone-500">
          Rúbrica (70/15/10/5), ajuste a velocidad manuscrita y
          detector de siglas.
         </p>
         <button
          onClick={() => setActiveModule('04')}
          className="w-full py-1.5 rounded-lg bg-[#D97757] text-white text-xs font-bold cursor-pointer"
         >
          ✍️ Ir a Aula de Temas y PDF (04)
         </button>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border border-[#D97757]/50 space-y-2">
         <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#D97757]">
           3.er Ejercicio · 10 Supuestos Oficiales ★
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-extrabold">
           {calcEj3} / 10
          </span>
         </div>
         <p className="text-[11px] text-stone-500">
          1.ª Prioridad de desempate (Base 9.4 CAM). 10 casos
          resueltos en 7 bloques.
         </p>
         <button
          onClick={() => setActiveModule('05')}
          className="w-full py-1.5 rounded-lg bg-[#4A7C59] text-white text-xs font-bold cursor-pointer"
         >
          📋 Ir a los 10 Supuestos Prácticos (05)
         </button>
        </div>
       </div>
      </div>

      {/* SISTEMA DE VUELTAS POR ARRASTRE (MACRO-PLANIFICACIÓN 3+1+1 · TELARAÑA COGNITIVA) */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border-2 border-[#D97757]/40 shadow-xs space-y-4">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-3">
        <div>
         <span className="text-[11px] font-extrabold text-[#D97757] uppercase block">
          🕸️ SISTEMA DE VUELTAS POR ARRASTRE · MACRO-PLANIFICACIÓN DE TRIBUNAL (FÓRMULA 3 + 1 + 1)
         </span>
         <h3 className="text-base font-bold mt-0.5">
          {masteryStats.currentVuelta.name} ({masteryStats.currentVuelta.pct}% completado)
         </h3>
         <p className="text-xs text-stone-500">
          No estudies temas aislados: cada ciclo combina <b>3 Temas de Avance</b> + <b>1 Tema de Arrastre (vuelta anterior)</b> + <b>1 Tema Transversal Estatal</b> para tejer conexiones inter-normativas en el examen.
         </p>
        </div>
        <button
         onClick={launchDiaDMarathonSimulator}
         className="px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-950 text-white text-xs font-extrabold cursor-pointer shrink-0 shadow-xs"
        >
         ☠️ Lanzar Simulacro «Día D» (Test + 15m + 2 Bolas)
        </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border-l-4 border-l-[#D97757] border space-y-2">
         <span className="text-[10px] font-extrabold uppercase text-[#D97757] block">
          🚀 1. TRIPLE AVANCE (MATERIA NUEVA EN COLA)
         </span>
         {masteryStats.dragPack.avance3.length > 0 ? (
          <div className="space-y-1.5">
           {masteryStats.dragPack.avance3.map((t) => (
            <div
             key={t.id}
             className="p-2 rounded-lg bg-white dark:bg-stone-900 border flex justify-between items-center gap-2"
            >
             <span className="font-bold truncate">
              [{t.id}] {t.title.slice(0, 42)}...
             </span>
             <button
              onClick={() => handleGenerateMagistralTopic(t)}
              className="px-2 py-0.5 rounded bg-[#D97757] text-white font-bold text-[10px] shrink-0 cursor-pointer"
             >
              Atacar
             </button>
            </div>
           ))}
          </div>
         ) : (
          <p className="text-emerald-700 font-bold">
           ¡100% de temas iniciados! Pasa a fijación total.
          </p>
         )}
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border-l-4 border-l-amber-500 border space-y-2 flex flex-col justify-between">
         <div>
          <span className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-300 block">
           ⚓ 2. ESLABÓN DE ARRASTRE (VUELTA ANTERIOR)
          </span>
          <p className="font-bold mt-1">
           [{masteryStats.dragPack.arrastre1?.id}]{' '}
           {masteryStats.dragPack.arrastre1?.title.slice(0, 68)}...
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
           Conecta lo que ya estudiaste con los temas nuevos de hoy para no perder el hilo conductor ni olvidar sus plazos.
          </p>
         </div>
         <div className="flex gap-1.5 pt-2">
          <button
           onClick={() => {
            if (masteryStats.dragPack.arrastre1) {
             touchTopicReviewDate(
              masteryStats.dragPack.arrastre1.id
             );
             openSkeletonTrainerForTopic(
              masteryStats.dragPack.arrastre1
             );
            }
           }}
           className="flex-1 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-[10px] cursor-pointer"
          >
           🧠 Esqueleto 7m Arrastre
          </button>
          <button
           onClick={() => {
            if (masteryStats.dragPack.arrastre1) {
             touchTopicReviewDate(
              masteryStats.dragPack.arrastre1.id
             );
             launchStrategicSimulator(
              masteryStats.dragPack.arrastre1.id
             );
            }
           }}
           className="flex-1 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-[10px] cursor-pointer"
          >
           🎯 Test Arrastre
          </button>
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border-l-4 border-l-emerald-600 border space-y-2 flex flex-col justify-between">
         <div>
          <span className="text-[10px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300 block">
           🇪🇸 3. ANCLA TRANSVERSAL (TRONCO ESTATAL COMÚN)
          </span>
          <p className="font-bold mt-1">
           [{masteryStats.dragPack.transversal1?.id}]{' '}
           {masteryStats.dragPack.transversal1?.title.slice(0, 68)}...
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
           Normativa estatal básica (CE, LPAC, LAPAD, LOPIVI, Igualdad) para cruzar en el folio del 2.º y 3.er ejercicio.
          </p>
         </div>
         <div className="flex gap-1.5 pt-2">
          <button
           onClick={() => {
            setSelectedBlockFilter('Estatal');
            setActiveModule('01');
           }}
           className="flex-1 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
          >
           🇪🇸 Ver Tronco Estatal
          </button>
          <button
           onClick={() =>
            masteryStats.dragPack.transversal1 &&
            launchStrategicSimulator(
             masteryStats.dragPack.transversal1.id
            )
           }
           className="flex-1 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-[10px] cursor-pointer"
          >
           🎯 Test Transversal
          </button>
         </div>
        </div>
       </div>
      </div>

      {/* GUÍA DIARIA INTERACTIVA DE 4 BLOQUES (FASES 1, 2 Y 3) CON AUTO-ADELANTO */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border shadow-xs space-y-4">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-3">
        <div>
         <span className="text-[11px] font-bold text-[#D97757] uppercase">
          ⏰ GUÍA DIARIA DE TUS 4 BLOQUES DE 60 MINUTOS (28 H/SEMANA ·
          AUTO-AJUSTABLE SI ADELANTAS TEMARIO)
         </span>
         <h3 className="text-base font-bold mt-0.5">
          Hoja de Ruta de Hoy · Próximos Temas en Cola Automática:{' '}
          {masteryStats.nextPriorityTopics
           .map((t) => `[${t.id}]`)
           .join(', ') || '¡Temario Completado!'}
         </h3>
        </div>

        <div className="flex gap-1.5">
         {[
          { id: 'fase1', label: 'Fase 1 (Sem 1-4 · Base)' },
          { id: 'fase2', label: 'Fase 2 (Sem 5-8 · Leitner)' },
          { id: 'fase3', label: 'Fase 3 (6-8 Sem Pre-Examen)' },
         ].map((f) => (
          <button
           key={f.id}
           onClick={() =>
            setStudyPlan((prev) => ({ ...prev, activePhase: f.id }))
           }
           className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
            studyPlan.activePhase === f.id
             ? 'bg-[#D97757] text-white'
             : 'bg-[#FAF8F5] dark:bg-stone-800 border'
           }`}
          >
           {f.label}
          </button>
         ))}
        </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2.5 flex flex-col justify-between">
         <div className="space-y-1.5">
          <div className="flex justify-between items-center">
           <span className="font-extrabold text-[#D97757]">
            🌅 Bloque 1 · Antes del cole (60m)
           </span>
           <input
            type="checkbox"
            checked={!!studyPlan.completedBlocksToday?.b1}
            onChange={(e) =>
             setStudyPlan((p) => ({
              ...p,
              completedBlocksToday: {
               ...p.completedBlocksToday,
               b1: e.target.checked,
              },
             }))
            }
           />
          </div>
          <p className="text-[11px] font-bold">
           Pico de Agudeza Mental:
          </p>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">
           • <b>0-15 min:</b> Vaciar Caja 1 Leitner (
           {leitnerCounts.box1} preguntas).
           <br />• <b>15-60 min:</b> Ataque al tema en cola:{' '}
           <b>
            {masteryStats.nextPriorityTopics[0]?.id || 'Repaso'}
           </b>{' '}
           ({masteryStats.nextPriorityTopics[0]?.title.slice(0, 52)}
           ...).
          </p>
         </div>
         <div className="flex gap-1.5 pt-2">
          <button
           onClick={() => launchStrategicSimulator(null, null, true)}
           className="px-2 py-1.5 rounded bg-rose-700 text-white font-bold text-[10px] cursor-pointer"
          >
           📦 Caja 1
          </button>
          {masteryStats.nextPriorityTopics[0] && (
           <button
            onClick={() =>
             handleGenerateMagistralTopic(
              masteryStats.nextPriorityTopics[0]
             )
            }
            className="flex-1 py-1.5 rounded bg-[#D97757] text-white font-bold text-[10px] cursor-pointer"
           >
            ✍️ {masteryStats.nextPriorityTopics[0].id}
           </button>
          )}
          {masteryStats.nextPriorityTopics[0] && (
           <button
            onClick={() => {
             const id = masteryStats.nextPriorityTopics[0].id;
             setTopicData((prev) => ({
              ...prev,
              [id]: { ...prev[id], status: 'Estudiado' },
             }));
             setStatusBanner(
              `⏩ ¡Tema [${id}] adelantado! El planificador ha cargado automáticamente el siguiente tema.`
             );
             setTimeout(() => setStatusBanner(''), 4000);
            }}
            className="px-2 py-1.5 rounded bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
           >
            ✔ Adelantar
           </button>
          )}
         </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2.5 flex flex-col justify-between">
         <div className="space-y-1.5">
          <div className="flex justify-between items-center">
           <span className="font-extrabold text-sky-700">
            🏫 Bloque 2 · Post-cole (60m)
           </span>
           <input
            type="checkbox"
            checked={!!studyPlan.completedBlocksToday?.b2}
            onChange={(e) =>
             setStudyPlan((p) => ({
              ...p,
              completedBlocksToday: {
               ...p.completedBlocksToday,
               b2: e.target.checked,
              },
             }))
            }
           />
          </div>
          <p className="text-[11px] font-bold">
           Velocidad Ejecutiva:
          </p>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">
           {studyPlan.activePhase === 'fase3'
            ? '• L-X-V: Barrido rápido por test de 3 temas comunes.\n• M-J-S: Parte 1 del Simulacro Oficial (primeras 55 pregs) y pausar.'
            : studyPlan.activePhase === 'fase2'
            ? '• Bloque intensivo de plazos, baremos y órganos + Esqueleto en 7 min.'
            : '• Subida o generación de Temas Magistrales y extracción de preguntas.'}
          </p>
         </div>
         <button
          onClick={() => launchStrategicSimulator(null, 1)}
          className="w-full py-1.5 rounded bg-sky-700 text-white font-bold text-[11px] cursor-pointer"
         >
          ⏱ Iniciar Parte 1 Simulacro (60m)
         </button>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2.5 flex flex-col justify-between">
         <div className="space-y-1.5">
          <div className="flex justify-between items-center">
           <span className="font-extrabold text-amber-700">
            🍽️ Bloque 3 · Sobremesa (60m)
           </span>
           <input
            type="checkbox"
            checked={!!studyPlan.completedBlocksToday?.b3}
            onChange={(e) =>
             setStudyPlan((p) => ({
              ...p,
              completedBlocksToday: {
               ...p.completedBlocksToday,
               b3: e.target.checked,
              },
             }))
            }
           />
          </div>
          <p className="text-[11px] font-bold">
           Cero Lectura Pasiva (Anti-Sueño):
          </p>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">
           • Reanudar Parte 2 del Simulacro (2.ª vuelta sobre tus
           Dudas entre 2) y etiquetar las 6 causas raíz de error.
          </p>
         </div>
         {studyPlan.pausedSimSession ? (
          <button
           onClick={() => {
            setExamSession(studyPlan.pausedSimSession);
            setStudyPlan((p) => ({ ...p, pausedSimSession: null }));
            setActiveModule('03');
           }}
           className="w-full py-1.5 rounded bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
          >
           ▶ Reanudar Simulacro Pausado
          </button>
         ) : (
          <button
           onClick={() => launchStrategicSimulator(null, 2)}
           className="w-full py-1.5 rounded bg-amber-700 text-white font-bold text-[11px] cursor-pointer"
          >
           ⚡ Test Activo Sobremesa (60m)
          </button>
         )}
        </div>

        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2.5 flex flex-col justify-between">
         <div className="space-y-1.5">
          <div className="flex justify-between items-center">
           <span className="font-extrabold text-indigo-700">
            🌙 Bloque 4 · Noche (60m)
           </span>
           <input
            type="checkbox"
            checked={!!studyPlan.completedBlocksToday?.b4}
            onChange={(e) =>
             setStudyPlan((p) => ({
              ...p,
              completedBlocksToday: {
               ...p.completedBlocksToday,
               b4: e.target.checked,
              },
             }))
            }
           />
          </div>
          <p className="text-[11px] font-bold">
           Consolidación Hipocampal (Sin Reloj):
          </p>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">
           • <b>0-30 min:</b> Lectura pausada de artículos fallados
           hoy.
           <br />• <b>30-60 min:</b> Escalas (Gijón, Zarit, BVD/EVE)
           y preparar el tema de mañana:{' '}
           <b>
            {masteryStats.nextPriorityTopics[1]?.id || 'Repaso'}
           </b>
           .
          </p>
         </div>
         <button
          onClick={() =>
           masteryStats.nextPriorityTopics[0] &&
           openSkeletonTrainerForTopic(
            masteryStats.nextPriorityTopics[0]
           )
          }
          className="w-full py-1.5 rounded bg-indigo-700 text-white font-bold text-[11px] cursor-pointer"
         >
          🧠 Repaso Esqueleto sin Cronómetro
         </button>
        </div>
       </div>
      </div>

      {/* CALCULADORA OFICIAL DEL BAREMO RMER DEL SERMAS (OCULTA EN MODO ESENCIAL SALVO CONVOCATORIA SERMAS) */}
      {(!isSimplifiedMode || activeConvocatoria === 'sermas') && (
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border-2 border-sky-600/30 shadow-xs space-y-4">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b pb-3">
        <div>
         <span className="text-[11px] font-extrabold text-sky-700 uppercase">
          🏥 CALCULADORA OFICIAL CONCURSO-OPOSICIÓN SERMAS (BOCM
          06/11/2026 · ANEXO II BAREMO RMER)
         </span>
         <h3 className="text-base font-bold">
          Simulación Nota Global SERMAS (50 ptos Test Único + 50 ptos
          Concurso RMER)
         </h3>
        </div>
        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950 border border-sky-200 text-right">
         <span className="text-[10px] font-bold text-sky-800 uppercase block">
          Total Concurso-Oposición
         </span>
         <span className="text-xl font-extrabold text-sky-900 dark:text-sky-200">
          {sermasScores.globalOver100} / 100 ptos
         </span>
         <span className="block text-[10px] text-sky-700">
          Oposición: {sermasScores.testOver50}/50 + Baremo:{' '}
          {sermasScores.totalConcursoOver50}/50
         </span>
        </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border">
         <label className="font-bold block text-[11px]">
          1.1 Días en Centros Sanitarios Públicos SNS (0,008/día):
         </label>
         <input
          type="number"
          value={sermasBaremo.daysSnsPublic}
          onChange={(e) =>
           setSermasBaremo({
            ...sermasBaremo,
            daysSnsPublic: Number(e.target.value),
           })
          }
          className="w-full mt-1 p-1.5 rounded border font-bold bg-white dark:bg-stone-900"
         />
        </div>
        <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border border-sky-300">
         <label className="font-bold block text-[11px] text-sky-800 dark:text-sky-300">
          1.2 Días TS en Otras AAPP (Ayto / SAMUR Social / CAM ·
          0,006/día):
         </label>
         <input
          type="number"
          value={sermasBaremo.daysOtherPublicAdmin}
          onChange={(e) =>
           setSermasBaremo({
            ...sermasBaremo,
            daysOtherPublicAdmin: Number(e.target.value),
           })
          }
          className="w-full mt-1 p-1.5 rounded border font-bold bg-white dark:bg-stone-900"
         />
         <span className="text-[10px] text-sky-700 font-bold block mt-1">
          Suma 1.2: {sermasScores.exp1_2} ptos
         </span>
        </div>
        <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border">
         <label className="font-bold block text-[11px]">
          1.4 Días en Centros Sociosanitarios Privados (0,003/día):
         </label>
         <input
          type="number"
          value={sermasBaremo.daysPrivateSocioSan}
          onChange={(e) =>
           setSermasBaremo({
            ...sermasBaremo,
            daysPrivateSocioSan: Number(e.target.value),
           })
          }
          className="w-full mt-1 p-1.5 rounded border font-bold bg-white dark:bg-stone-900"
         />
        </div>
        <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border">
         <label className="font-bold block text-[11px]">
          2.2 y 2.3 Créditos ECTS Formación (0,25 ptos/ECTS):
         </label>
         <input
          type="number"
          value={sermasBaremo.cfcEctsCredits}
          onChange={(e) =>
           setSermasBaremo({
            ...sermasBaremo,
            cfcEctsCredits: Number(e.target.value),
           })
          }
          className="w-full mt-1 p-1.5 rounded border font-bold bg-white dark:bg-stone-900"
         />
         <span className="text-[10px] text-stone-500 block mt-1">
          Formación: {sermasScores.totalForm} / 15 ptos
         </span>
        </div>
       </div>
      </div>
      )}
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 01 · TEMARIO OFICIAL CON PARIDAD UNIVERSAL EN LAS 3 OPOS   */}
    {/* ================================================================= */}
    {activeModule === '01' && (
     <div className="space-y-4">
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border space-y-3 shadow-xs">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
         <h2 className="text-base font-bold">
          01 · Temario Oficial Completo ({activeCatalog.length} Temas
          · Paridad 100% CAM / SERMAS / Ayuntamiento)
         </h2>
         <p className="text-xs text-stone-500">
          Filtra entre <b>Temario Específico (Ej. 1, 2 y 3)</b> y{' '}
          <b>Bloque General (Solo Test Ej. 1)</b>. Incluye semáforo
          automático de Curva del Olvido.
         </p>
        </div>
        <div className="flex flex-wrap gap-2">
         <input
          type="text"
          placeholder="Buscar por título, código (ej. E1) o ley..."
          value={searchTopicQuery}
          onChange={(e) => setSearchTopicQuery(e.target.value)}
          className="px-3.5 py-1.5 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800 min-w-[230px]"
         />
        </div>
       </div>

       <div className="flex flex-wrap gap-2 pt-2 border-t">
        {[
         {
          id: 'Especificos',
          label: `✍️ Solo Temario Específico (${
           activeCatalog.filter(
            (t) => !/^(G|S-[1-7]$|AY-([1-9]|1\d|20)$)/.test(t.id)
           ).length
          } · Entra en Ej. 1, 2 y 3)`,
         },
         {
          id: 'Generales',
          label: `🏛️ Solo Bloque General (${
           activeCatalog.filter((t) =>
            /^(G|S-[1-7]$|AY-([1-9]|1\d|20)$)/.test(t.id)
           ).length
          } · Solo Test Ej. 1)`,
         },
         {
          id: 'Estatal',
          label: `🇪🇸 Tronco Estatal y Común (${
           activeCatalog.filter((t) => isEstatalCommonTopic(t))
            .length
          } · Puntúa en CAM, SERMAS, Ayto y Estado)`,
         },
         {
          id: 'Todos',
          label: `📋 Ver Todos (${activeCatalog.length})`,
         },
        ].map((f) => (
         <button
          key={f.id}
          onClick={() => setSelectedBlockFilter(f.id)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
           selectedBlockFilter === f.id
            ? 'bg-[#D97757] text-white shadow-xs'
            : 'bg-[#FAF8F5] dark:bg-stone-800 border text-stone-700 dark:text-stone-300'
          }`}
         >
          {f.label}
         </button>
        ))}
        {activeConvocatoria === 'cam_a2' && (
         <select
          value={
           selectedBlockFilter.startsWith('Bloque')
            ? selectedBlockFilter
            : ''
          }
          onChange={(e) =>
           setSelectedBlockFilter(e.target.value || 'Todos')
          }
          className="px-3 py-1.5 rounded-xl border text-xs font-extrabold bg-[#FAF8F5] dark:bg-stone-800 cursor-pointer"
          title="Filtrar por cualquiera de los 9 Bloques Específicos Oficiales del BOCM n.º 100"
         >
          <option value="">
           🗂️ Filtrar por Bloque BOCM (I a IX)...
          </option>
          <option value="Bloque General">
           I. Temario General (G1-G16 · Constitucional y Adm.)
          </option>
          <option value="Bloque Específico I">
           Bloque I (E1-E11 · Estructura y Ley 12/2022)
          </option>
          <option value="Bloque Específico II">
           Bloque II (E12-E15 · Seg. Social, Empleo, RMI e IMV)
          </option>
          <option value="Bloque Específico III">
           Bloque III (E16-E20 · Atención Primaria, Familia y ONG)
          </option>
          <option value="Bloque Específico IV">
           Bloque IV (E21-E30 · Dependencia, Mayores, SM y Discap.)
          </option>
          <option value="Bloque Específico V">
           Bloque V (E31-E36 · Extranjería, Sin Hogar y Violencia VG)
          </option>
          <option value="Bloque Específico VI">
           Bloque VI (E37-E46 · Infancia, Menores, LGTBI y Vivienda)
          </option>
          <option value="Bloque Específico VII">
           Bloque VII (E47-E54 · Sanidad, Salud Pública, CAID y Educ.)
          </option>
          <option value="Bloque Específico VIII">
           Bloque VIII (E55-E61 · Ética, Método, Técnicas y Modelos)
          </option>
          <option value="Bloque Específico IX">
           Bloque IX (E62-E67 · TS Forense, Pericial, OAVD y Calidad)
          </option>
         </select>
        )}
       </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {filteredTopics.map((t) => {
        const td = topicData[t.id] || {};
        const status = td.status || 'Pendiente';
        const isGenTopic = /^(G|S-[1-7]$|AY-([1-9]|1\d|20)$)/.test(
         t.id
        );
        const topicDocsCount = documentsLibrary.filter(
         (d) => d.topicId === t.id
        ).length;
        const topicQsCount = questionBank.filter(
         (q) => q.topicId === t.id
        ).length;

        const daysSinceReview = td.lastReviewedIso
         ? Math.floor(
           (Date.now() - new Date(td.lastReviewedIso).getTime()) /
            (1000 * 60 * 60 * 24)
          )
         : null;
        const forgettingBadge =
         daysSinceReview === null
          ? status !== 'Pendiente'
           ? {
             label: '🟡 Sin fecha repaso',
             cls: 'bg-amber-50 text-amber-800 border-amber-300',
            }
           : null
          : daysSinceReview <= 7
          ? {
            label: `🟢 Fresco (${
             daysSinceReview === 0
              ? 'hoy'
              : `hace ${daysSinceReview}d`
            })`,
            cls: 'bg-emerald-50 text-emerald-800 border-emerald-300',
           }
          : daysSinceReview <= 14
          ? {
            label: `🟡 Repasar (${daysSinceReview}d)`,
            cls: 'bg-amber-100 text-amber-900 border-amber-400',
           }
          : {
            label: `🔴 Oxidado (${daysSinceReview}d sin tocar)`,
            cls: 'bg-rose-100 text-rose-900 border-rose-400 animate-pulse',
           };

        return (
         <div
          key={t.id}
          className={`bg-white dark:bg-stone-900 p-4 rounded-2xl border space-y-3 shadow-xs flex flex-col justify-between transition hover:shadow-md ${
           isGenTopic
            ? 'border-l-4 border-l-sky-600'
            : 'border-l-4 border-l-[#D97757]'
          }`}
         >
          <div className="space-y-2">
           <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-1.5">
             <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white ${
               isGenTopic ? 'bg-sky-700' : 'bg-[#D97757]'
              }`}
             >
              {isGenTopic
               ? `🏛️ GENERAL [${t.id}]`
               : `✍️ ESPECÍFICO [${t.id}]`}
             </span>
             {forgettingBadge && (
              <span
               className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${forgettingBadge.cls}`}
               title="Semáforo de Curva del Olvido (Ebbinghaus)"
              >
               {forgettingBadge.label}
              </span>
             )}
            </div>

            <div className="flex items-center gap-1.5">
             <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-bold">
              📄 {topicDocsCount} PDF · ❓ {topicQsCount} pregs
             </span>
             <select
              value={status}
              onChange={(e) =>
               setTopicData((prev) => ({
                ...prev,
                [t.id]: {
                 ...prev[t.id],
                 status: e.target.value,
                 lastReviewedIso: new Date().toISOString(),
                },
               }))
              }
              className={`p-1 rounded border text-[10px] font-extrabold cursor-pointer ${
               status === 'Dominado'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : status === 'Estudiado'
                ? 'bg-amber-100 text-amber-900 border-amber-400'
                : 'bg-[#FAF8F5] dark:bg-stone-800'
              }`}
             >
              <option value="Pendiente">Pendiente</option>
              <option value="Estudiado">Estudiado</option>
              <option value="Dominado">Dominado ★</option>
             </select>
            </div>
           </div>

           <h3 className="text-xs font-bold leading-relaxed">
            {t.title}
           </h3>

           <div className="text-[11px] text-stone-600 dark:text-stone-300 bg-[#FAF8F5] dark:bg-stone-800 p-2.5 rounded-xl border">
            <b>Matriz Legal 2026:</b> {t.lawUpdate}
           </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 border-t">
           <button
            onClick={() => {
             touchTopicReviewDate(t.id);
             handleGenerateMagistralTopic(t);
            }}
            className="px-2 py-1.5 rounded-lg bg-[#D97757] hover:bg-[#c46546] text-white text-[10px] font-bold cursor-pointer"
           >
            ✍️ Crear Tema 10/10
           </button>

           <button
            onClick={() => {
             touchTopicReviewDate(t.id);
             openSkeletonTrainerForTopic(t);
            }}
            className="px-2 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-[10px] font-bold cursor-pointer"
           >
            🧠 Esqueleto 7m
           </button>

           <label className="px-2 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold cursor-pointer text-center">
            📤 Subir PDF
            <input
             type="file"
             accept=".pdf"
             multiple
             onChange={(e) => {
              processPdfUpload(e.target.files, true, t);
              e.target.value = '';
             }}
             className="hidden"
            />
           </label>

           <button
            onClick={() => {
             touchTopicReviewDate(t.id);
             launchStrategicSimulator(t.id);
            }}
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold cursor-pointer"
           >
            🎯 Test Tema
           </button>
          </div>
         </div>
        );
       })}
      </div>
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 02 · BANCO DE PREGUNTAS (60 OFICIALES + MUTACIÓN)          */}
    {/* ================================================================= */}
    {(activeModule === '02' || activeModule === '06') && (
     <div className="mb-4 p-2 rounded-2xl bg-white dark:bg-stone-900 border shadow-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
       <button
        onClick={() => {
         setBankSubTab('questions');
         setActiveModule('02');
        }}
        className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
         activeModule === '02' && bankSubTab === 'questions'
          ? 'bg-[#D97757] text-white shadow-xs'
          : 'bg-[#FAF8F5] dark:bg-stone-800 border text-stone-700 dark:text-stone-300'
        }`}
       >
        ❓ 1. Banco de Preguntas Verificado ({questionBank.length})
       </button>
       <button
        onClick={() => {
         setBankSubTab('pdfs');
         setActiveModule('02');
        }}
        className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
         activeModule === '06' ||
         (activeModule === '02' && bankSubTab === 'pdfs')
          ? 'bg-emerald-700 text-white shadow-xs'
          : 'bg-[#FAF8F5] dark:bg-stone-800 border text-stone-700 dark:text-stone-300'
        }`}
       >
        📄 2. Laboratorio de Archivos PDF ({documentsLibrary.length})
       </button>
      </div>
     </div>
    )}
    {activeModule === '02' && bankSubTab === 'questions' && (
     <div className="space-y-4">
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border space-y-3">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
         <h2 className="text-base font-bold">
          02 · Banco Común Verificado ({questionBank.length} Preguntas
          Totales)
         </h2>
         <p className="text-xs text-stone-500">
          Puedes borrar cualquier pregunta individual con el botón{' '}
          <b>🗑️ Borrar</b>, limpiar preguntas defectuosas/BOE o borrar
          todas las de un tema concreto.
         </p>
        </div>

        <div className="flex flex-wrap gap-2">
         <button
          onClick={() => {
           const before = questionBank.length;
           const cleaned = questionBank.filter(
            (q) => !isDefectiveOrAdminQuestion(q)
           );
           setQuestionBank(cleaned);
           setStatusBanner(
            `🧹 Limpieza completada: Eliminadas ${
             before - cleaned.length
            } preguntas de Ficha Técnica/BOE u opciones repetidas.`
           );
           setTimeout(() => setStatusBanner(''), 4500);
          }}
          className="px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
         >
          🧹 Purgar Preguntas BOE / Defectuosas
         </button>

         <button
          onClick={() => {
           const existingIds = new Set(questionBank.map((q) => q.id));
           const toAdd = HIGH_DIFFICULTY_60_QUESTIONS.filter(
            (q) =>
             !existingIds.has(q.id) &&
             !isDefectiveOrAdminQuestion(q)
           );
           if (toAdd.length > 0) {
            setQuestionBank((prev) => [...toAdd, ...prev]);
            setStatusBanner(
             `🔥 ¡${toAdd.length} preguntas oficiales de alta dificultad añadidas al Banco Común!`
            );
           } else {
            setStatusBanner(
             'ℹ️ Las preguntas oficiales de alta dificultad ya están activas.'
            );
           }
           setTimeout(() => setStatusBanner(''), 4000);
          }}
          className="px-3 py-2 rounded-xl bg-[#D97757] hover:bg-[#c26446] text-white text-xs font-bold cursor-pointer"
         >
          🔥 Restaurar 60 Oficiales
         </button>

         <button
          onClick={() => {
           const baseOnly = HIGH_DIFFICULTY_60_QUESTIONS.filter(
            (q) => !isDefectiveOrAdminQuestion(q)
           );
           setQuestionBank(baseOnly);
           setStatusBanner(
            `🗑️ Se han borrado todas las preguntas subidas y se ha reiniciado el banco con las ${baseOnly.length} preguntas base.`
           );
           setTimeout(() => setStatusBanner(''), 4500);
          }}
          className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
         >
          🗑️ Reiniciar Banco (Borrar Subidas)
         </button>
        </div>
       </div>

       <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
        <select
         value={bankFilterTopic}
         onChange={(e) => setBankFilterTopic(e.target.value)}
         className="px-3 py-1.5 rounded-xl border text-xs font-bold bg-[#FAF8F5] dark:bg-stone-800 cursor-pointer"
        >
         <option value="Todos">
          📋 Ver Todos los Temas ({questionBank.length} pregs)
         </option>
         {Array.from(new Set(questionBank.map((q) => q.topicId)))
          .sort()
          .map((tid) => (
           <option key={tid} value={tid}>
            Tema [{tid}] (
            {questionBank.filter((q) => q.topicId === tid).length}{' '}
            pregs)
           </option>
          ))}
        </select>

        <input
         type="text"
         value={bankSearchText}
         onChange={(e) => setBankSearchText(e.target.value)}
         placeholder="Buscar texto en preguntas u opciones..."
         className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800"
        />

        {bankFilterTopic !== 'Todos' && (
         <button
          onClick={() => {
           const countTopic = questionBank.filter(
            (q) => q.topicId === bankFilterTopic
           ).length;
           setQuestionBank((prev) =>
            prev.filter((q) => q.topicId !== bankFilterTopic)
           );
           setStatusBanner(
            `🗑️ Eliminadas las ${countTopic} preguntas del tema [${bankFilterTopic}].`
           );
           setBankFilterTopic('Todos');
           setTimeout(() => setStatusBanner(''), 4000);
          }}
          className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-900 border border-rose-300 text-xs font-bold cursor-pointer"
         >
          🗑️ Borrar todas las de [{bankFilterTopic}]
         </button>
        )}
       </div>
      </div>

      <div className="space-y-2.5">
       {questionBank
        .filter(
         (q) =>
          (bankFilterTopic === 'Todos' ||
           q.topicId === bankFilterTopic) &&
          (!bankSearchText.trim() ||
           `${q.question} ${(q.options || []).join(' ')}`
            .toLowerCase()
            .includes(bankSearchText.toLowerCase()))
        )
        .map((q) => (
         <div
          key={q.id}
          className="p-4 rounded-xl bg-white dark:bg-stone-900 border text-xs space-y-1.5"
         >
          <div className="flex flex-wrap justify-between items-center gap-2">
           <span className="font-extrabold text-[#D97757]">
            [{q.topicId}] · {q.originType} · {q.difficulty}
           </span>
           <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
             Caja Leitner: {leitnerBoxes[q.id] || 2}
            </span>
            <button
             onClick={() => {
              setQuestionBank((prev) =>
               prev.filter((item) => item.id !== q.id)
              );
              setFailedQuestionIds((prev) =>
               prev.filter((id) => id !== q.id)
              );
              setStatusBanner(
               `🗑️ Pregunta eliminada permanentemente del Banco Común.`
              );
              setTimeout(() => setStatusBanner(''), 3000);
             }}
             className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-700 hover:text-white text-rose-800 font-extrabold text-[11px] cursor-pointer transition"
             title="Borrar esta pregunta del banco"
            >
             🗑️ Borrar pregunta
            </button>
           </div>
          </div>
          <p className="font-bold">{q.question}</p>
          <div className="space-y-1 pl-2">
           {q.options.map((opt, idx) => (
            <p
             key={idx}
             className={
              idx === q.correctIndex
               ? 'text-emerald-700 font-bold'
               : 'text-stone-500'
             }
            >
             {idx === q.correctIndex ? '✔ ' : '• '}
             {opt}
            </p>
           ))}
          </div>
          <p className="text-[11px] text-stone-500 pt-1 border-t">
           <b>Justificación jurídica:</b> {q.explanation}
          </p>
         </div>
        ))}
      </div>
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 03 · SIMULACROS CON GESTIÓN DEL RIESGO (DUDA ENTRE 2)      */}
    {/* ================================================================= */}
    {activeModule === '03' && (
     <div className="max-w-4xl mx-auto space-y-6">
      {!examSession ? (
       <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b pb-3">
         <div>
          <span className="text-[11px] font-bold text-[#D97757] uppercase">
           03 · ENTRENADOR DE TÉCNICA DE 2 VUELTAS Y GESTIÓN DEL
           RIESGO ANTE PENALIZACIÓN
          </span>
          <h2 className="text-lg font-bold">
           Simulacros Oficiales (
           {activeConvocatoria === 'ayto'
            ? 'Ayto. Madrid · 3 Opciones (A,B,C) · Penalización -1/3'
            : activeConvocatoria === 'sermas'
            ? 'SERMAS · 110 pregs · Penalización -0,25'
            : 'CAM · 85 pregs · Penalización -1/3'}
           )
          </h2>
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs space-y-1">
         <div className="font-extrabold text-amber-900 dark:text-amber-200">
          ⚖️ Regla Matemática de Tribunal para tus "Dudas entre 2
          Opciones":
         </div>
         <p className="text-amber-800 dark:text-amber-300">
          Cuando descartas las demás opciones y dudas únicamente entre{' '}
          <b>2 alternativas (50% de probabilidad)</b>, la Esperanza
          Matemática es positiva tanto en CAM/Ayto (
          <b>+0,33 ptos netos</b> por pregunta) como en SERMAS (
          <b>+0,375 ptos netos</b>). Usa el botón{' '}
          <b>"⚖️ Duda entre 2"</b> durante el test para marcar tus dos
          candidatas y auditar al final cuántos puntos netos ganas
          arriesgando con criterio.
         </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
         <button
          onClick={() => launchStrategicSimulator()}
          className="py-3.5 px-4 rounded-xl bg-[#D97757] text-white font-bold text-xs cursor-pointer"
         >
          🚀 Simulacro Oficial (20% Gen / 80% Esp)
         </button>
         <button
          onClick={() => launchStrategicSimulator(null, 1)}
          className="py-3.5 px-4 rounded-xl bg-sky-700 text-white font-bold text-xs cursor-pointer"
         >
          ⏸ Simulacro Partido (60m + 60m)
         </button>
         <button
          onClick={() => launchStrategicSimulator(null, null, true)}
          className="py-3.5 px-4 rounded-xl bg-rose-700 text-white font-bold text-xs cursor-pointer"
         >
          📦 Vaciar Caja 1 Leitner ({leitnerCounts.box1})
         </button>
         <button
          onClick={launchDiaDMarathonSimulator}
          className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs cursor-pointer border-2 border-rose-500 shadow-xs"
         >
          ☠️ Simulacro «Día D» (Test + 15m + 2 Bolas)
         </button>
        </div>

        {/* MOTOR CLOZE TEST ACTIVO (SPRINT 10 MINUTOS DE HUECOS EN BLANCO) */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-3 pt-4">
         <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
           <span className="text-[10px] font-extrabold uppercase text-purple-700 dark:text-purple-300 block">
            🧩 ENTRENADOR DE MEMORIA EXACTA · CLOZE TEST (HUECOS EN BLANCO · SPRINT 10 MIN)
           </span>
           <h3 className="text-sm font-bold">
            Oculta automáticamente plazos, leyes, baremos y autores para fijar datos puros sin pistas
           </h3>
          </div>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <button
           onClick={() => buildClozeCardsFromBank('all', 20)}
           className="py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
          >
           🧩 Sprint Mixto (20)
          </button>
          <button
           onClick={() => buildClozeCardsFromBank('plazos', 15)}
           className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer"
          >
           ⏱️ Solo Plazos
          </button>
          <button
           onClick={() => buildClozeCardsFromBank('leyes', 15)}
           className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer"
          >
           ⚖️ Leyes y Arts.
          </button>
          <button
           onClick={() => buildClozeCardsFromBank('escalas', 15)}
           className="py-2.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold cursor-pointer"
          >
           📊 Baremos/Cifras
          </button>
          <button
           onClick={() => buildClozeCardsFromBank('autores', 15)}
           className="py-2.5 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold cursor-pointer"
          >
           🎓 Autores/Órganos
          </button>
         </div>
        </div>

        {/* COMPARADOR INTERACTIVO ANTI-CONFUSIÓN DE PLAZOS Y SILENCIOS (CAM vs SERMAS vs AYTO vs ESTADO) */}
        <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-300 space-y-3">
         <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
           <span className="text-[10px] font-extrabold uppercase text-sky-800 dark:text-sky-300 block">
            ⚖️ TABLA INTERACTIVA ANTI-CONFUSIÓN DE TRIBUNAL · CAM vs SERMAS vs AYUNTAMIENTO vs ESTADO
           </span>
           <h3 className="text-sm font-bold">
            Contraste directo de Plazos, Silencios Administrativos, Baremos y Artículos Nucleares
           </h3>
          </div>
          <div className="flex gap-1.5">
           <button
            onClick={exportMasterCheatSheet6PagesPDF}
            className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold cursor-pointer"
           >
            📊 Descargar PDF 6 Págs
           </button>
           <button
            onClick={() => setPlazosDuelOpen(!plazosDuelOpen)}
            className="px-3 py-1.5 rounded-xl bg-sky-800 text-white text-xs font-bold cursor-pointer"
           >
            {plazosDuelOpen
             ? '🔼 Ocultar Tabla de Plazos'
             : '👁️ Abrir Comparador de Plazos y Silencios'}
           </button>
          </div>
         </div>

         {plazosDuelOpen && (
          <div className="space-y-2.5 pt-2 border-t border-sky-200 text-xs">
           <div className="flex flex-wrap gap-1.5">
            {['Todos', 'CAM Ley 12/2022', 'Dependencia/Discap.', 'Estado LPAC/IMV', 'SERMAS/Ayto'].map(
             (cat) => (
              <button
               key={cat}
               onClick={() => setPlazosFilter(cat)}
               className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                plazosFilter === cat
                 ? 'bg-sky-800 text-white'
                 : 'bg-white dark:bg-stone-900 border'
               }`}
              >
               {cat}
              </button>
             )
            )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
             {
              cat: 'CAM Ley 12/2022',
              proc: 'Elaboración del PIAS / PIIS (Art. 40 Ley 12/2022 CM)',
              plazo: '10 días hábiles tras valoración diagnóstica',
              silencio: 'Impulso de oficio por TS de Referencia (Art. 16.2)',
             },
             {
              cat: 'CAM Ley 12/2022',
              proc: 'Informe Social Prescriptor Exclusivo (Art. 69 Ley 12/2022)',
              plazo: 'Preceptivo y exclusivo del Trabajador/a Social',
              silencio: 'Historia Social Única interoperable (Decreto 51/2023)',
             },
             {
              cat: 'Dependencia/Discap.',
              proc: 'Resolución de Grado y PIA en Dependencia (Decreto 54/2015 CAM y Ley 39/2006)',
              plazo: 'Máximo 6 meses desde solicitud (BVD: G.I 25-49, G.II 50-74, G.III 75-100)',
              silencio: 'Silencio Negativo / Desestimatorio',
             },
             {
              cat: 'Dependencia/Discap.',
              proc: 'Reconocimiento de Grado de Discapacidad (RD 888/2022 · 4 Baremos BLA/BDGP/BFCA/BRP)',
              plazo: 'Máximo 6 meses (Clases 0 a 4 · Pensión No Contrib. >=65% + complemento >=75%)',
              silencio: 'Silencio Negativo (Reclamación previa 30 días hábiles, Art. 71 LRJS)',
             },
             {
              cat: 'Estado LPAC/IMV',
              proc: 'Ingreso Mínimo Vital (Ley 19/2021 INSS) vs RMI CAM (Ley 15/2001)',
              plazo: 'IMV: 6 meses para resolver | RMI CAM: 3 meses para resolver',
              silencio: 'Ambos con Silencio Administrativo Negativo',
             },
             {
              cat: 'Estado LPAC/IMV',
              proc: 'Recursos LPAC 39/2015: Alzada vs Reposición Potestativo',
              plazo: 'Interposición: 1 mes (si acto expreso) | Resolución: 3 meses (Alzada) / 1 mes (Reposición)',
              silencio: 'Desestimatorio (salvo alzada contra silencio con excepción legal)',
             },
             {
              cat: 'SERMAS/Ayto',
              proc: 'SERMAS Concurso-Oposición (Res. 20/10/2026) vs CAM (Orden 1049/2026) vs Ayto Madrid',
              plazo: 'CAM: 80+5 pregs (-1/3) | SERMAS: 100+10 (-0,25) | Ayto: 120+9 (3 opciones A/B/C, -1/3)',
              silencio: 'Baremo RMER SERMAS: 0,008 SNS / 0,006 Otras AAPP (SAMUR/Ayto) / 0,003 Privado',
             },
             {
              cat: 'SERMAS/Ayto',
              proc: 'Tarjeta Social / Emergencia Ayuntamiento de Madrid (Ordenanza 10/2022)',
              plazo: 'Resolución máxima 3 meses · Tramitación de urgencia en Atención Social Primaria',
              silencio: 'Silencio Negativo (Prestación económica municipal)',
             },
            ]
             .filter(
              (r) =>
               plazosFilter === 'Todos' || r.cat === plazosFilter
             )
             .map((item, i) => (
              <div
               key={i}
               className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-sky-200 space-y-1"
              >
               <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-[#D97757] uppercase">
                 {item.cat}
                </span>
               </div>
               <p className="font-bold text-slate-800 dark:text-stone-100">
                {item.proc}
               </p>
               <p className="text-emerald-800 dark:text-emerald-300 font-semibold">
                ⏱️ <b>Plazo / Regla:</b> {item.plazo}
               </p>
               <p className="text-stone-500 text-[11px]">
                ⚖️ <b>Efecto / Clave:</b> {item.silencio}
               </p>
              </div>
             ))}
           </div>
          </div>
         )}
        </div>

        {clozeSession && (
         <div className="p-5 rounded-2xl bg-purple-50/90 dark:bg-purple-950/40 border-2 border-purple-400 space-y-4 text-xs">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-purple-200 pb-2">
           <div>
            <span className="font-extrabold text-purple-900 dark:text-purple-200 uppercase block">
             🧩 SPRINT CLOZE ACTIVO ({clozeSession.categoryFilter.toUpperCase()}) · TARJETA {clozeSession.currentIdx + 1} DE {clozeSession.cards.length}
            </span>
           </div>
           <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-white dark:bg-stone-900 font-mono font-extrabold">
             ⏱ {Math.floor(clozeSession.timeLeft / 60)}:{String(clozeSession.timeLeft % 60).padStart(2, '0')}
            </span>
            <button
             onClick={() =>
              setClozeSession((p) => ({
               ...p,
               strictWriteMode: !p.strictWriteMode,
              }))
             }
             className="px-2.5 py-1 rounded bg-purple-700 text-white font-bold cursor-pointer"
            >
             {clozeSession.strictWriteMode
              ? '⌨️ Modo Teclear Estricto'
              : '🔘 Modo Chips Rápidos'}
            </button>
            <button
             onClick={() => setClozeSession(null)}
             className="px-2.5 py-1 rounded bg-stone-200 dark:bg-stone-800 font-bold cursor-pointer"
            >
             ✕ Cerrar Cloze
            </button>
           </div>
          </div>

          {clozeSession.cards.length > 0 && (() => {
           const currentCard = clozeSession.cards[clozeSession.currentIdx];
           const currentRes = clozeSession.results[currentCard.id];
           return (
            <div className="space-y-3">
             <div className="text-[11px] font-bold text-[#D97757]">
              Tema [{currentCard.topicId}] · {currentCard.promptContext}
             </div>
             <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border text-sm font-bold leading-relaxed">
              {currentCard.maskedSentence}
             </div>

             {!clozeSession.strictWriteMode ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
               {currentCard.choices.map((ch, idx) => (
                <button
                 key={idx}
                 onClick={() => submitClozeAnswer(ch)}
                 className={`p-2.5 rounded-xl border font-extrabold cursor-pointer transition ${
                  currentRes?.userValue === ch
                   ? currentRes.isCorrect
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-rose-700 text-white border-rose-800'
                   : 'bg-white dark:bg-stone-900 hover:bg-purple-100'
                 }`}
                >
                 {ch}
                </button>
               ))}
              </div>
             ) : (
              <div className="flex gap-2">
               <input
                type="text"
                value={clozeSession.userInput}
                onChange={(e) =>
                 setClozeSession((p) => ({
                  ...p,
                  userInput: e.target.value,
                 }))
                }
                placeholder="Escribe el plazo, ley, cifra o autor exacto..."
                className="flex-1 p-2.5 rounded-xl border bg-white dark:bg-stone-900 font-bold"
               />
               <button
                onClick={() =>
                 submitClozeAnswer(clozeSession.userInput)
                }
                className="px-4 py-2 rounded-xl bg-purple-700 text-white font-bold cursor-pointer"
               >
                ✔ Comprobar
               </button>
              </div>
             )}

             {clozeSession.showSolutionCurrent && currentRes && (
              <div
               className={`p-3 rounded-xl border font-semibold ${
                currentRes.isCorrect
                 ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                 : 'bg-rose-100 text-rose-950 border-rose-300'
               }`}
              >
               {currentRes.isCorrect ? '✔ ¡Exacto! ' : '✘ Fallo registrado en Caja 1 Leitner. '}
               Dato oficial: <b>{currentCard.targetAnswer}</b> — {currentCard.explanation}
              </div>
             )}

             <div className="flex justify-between pt-2">
              <button
               disabled={clozeSession.currentIdx === 0}
               onClick={() =>
                setClozeSession((p) => ({
                 ...p,
                 currentIdx: p.currentIdx - 1,
                 showSolutionCurrent: false,
                 userInput: '',
                }))
               }
               className="px-3 py-1.5 rounded-lg bg-white dark:bg-stone-900 border font-bold cursor-pointer"
              >
               ← Anterior
              </button>
              <button
               disabled={
                clozeSession.currentIdx >=
                clozeSession.cards.length - 1
               }
               onClick={() =>
                setClozeSession((p) => ({
                 ...p,
                 currentIdx: p.currentIdx + 1,
                 showSolutionCurrent: false,
                 userInput: '',
                }))
               }
               className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold cursor-pointer"
              >
               Siguiente Hueco →
              </button>
             </div>
            </div>
           );
          })()}
         </div>
        )}
       </div>
      ) : !examSession.isFinished ? (
       <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-4">
        {(() => {
         const currentQ =
          examSession.questions[examSession.currentIdx];
         const currentAns = examSession.answers[currentQ.id];
         const currentDoubtPair =
          examSession.doubtsMap?.[currentQ.id] || [];
         const totalAnswered = Object.keys(examSession.answers).length;
         const totalDoubtsCount = Object.values(
          examSession.doubtsMap || {}
         ).filter((arr) => arr && arr.length > 0).length;
         const totalBlanksCount =
          examSession.questions.length - totalAnswered;

         return (
          <>
           <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
            <div>
             <span className="text-xs font-extrabold text-[#D97757] block">
              {examSession.title}
             </span>
             <span className="text-[11px] text-stone-500">
              Pregunta <b>{examSession.currentIdx + 1}</b> de{' '}
              {examSession.questions.length} ·{' '}
              <b className="text-emerald-700">
               ✔ Respondidas: {totalAnswered}
              </b>{' '}
              ·{' '}
              <b className="text-amber-700">
               ⚖️ Dudas entre 2: {totalDoubtsCount}
              </b>{' '}
              · <b>⬜ En blanco: {totalBlanksCount}</b>
             </span>
            </div>
            <div className="flex items-center gap-2">
             <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800">
              ⏱ {Math.floor(examSession.timeLeft / 60)}:
              {String(examSession.timeLeft % 60).padStart(2, '0')}
             </span>
             <button
              onClick={pauseSimulatorForBlock3}
              className="px-2.5 py-1 rounded bg-amber-600 text-white text-[11px] font-bold cursor-pointer"
             >
              ⏸ Pausar para Bloque 3
             </button>
            </div>
           </div>

           <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2">
            <div className="flex flex-wrap justify-between items-center gap-2 text-[11px]">
             <span className="font-bold">
              🧭 Mapa de 2 Vueltas (Haz clic en cualquier número o
              filtra tus dudas para la 2.ª vuelta):
             </span>
             <button
              onClick={() =>
               setExamSession((prev) => ({
                ...prev,
                filterOnlyDoubts: !prev.filterOnlyDoubts,
               }))
              }
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
               examSession.filterOnlyDoubts
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-stone-900 border text-amber-800 dark:text-amber-300'
              }`}
             >
              {examSession.filterOnlyDoubts
               ? `🔎 Viendo solo Dudas (${totalDoubtsCount}) · Ver Todas`
               : `🔎 Filtrar solo mis Dudas entre 2 (${totalDoubtsCount})`}
             </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
             {examSession.questions.map((qItem, idx) => {
              const hasAns =
               examSession.answers[qItem.id] !== undefined;
              const hasDoubt =
               (examSession.doubtsMap?.[qItem.id] || []).length >
               0;
              if (examSession.filterOnlyDoubts && !hasDoubt)
               return null;

              return (
               <button
                key={qItem.id}
                onClick={() =>
                 setExamSession((prev) => ({
                  ...prev,
                  currentIdx: idx,
                 }))
                }
                className={`w-7 h-7 rounded-lg text-[10px] font-extrabold cursor-pointer flex items-center justify-center border transition ${
                 examSession.currentIdx === idx
                  ? 'ring-2 ring-[#D97757] '
                  : ''
                }${
                 hasDoubt
                  ? 'bg-amber-100 text-amber-900 border-amber-400'
                  : hasAns
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  : 'bg-white dark:bg-stone-900 text-stone-500'
                }`}
               >
                {idx + 1}
                {hasDoubt ? '⚖' : ''}
               </button>
              );
             })}
            </div>
           </div>

           <div className="space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
             <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-[#D97757]">
               Tema [{currentQ.topicId}] ·{' '}
               {currentQ.originType || 'Oficial'}
              </span>
              {examSession.currentIdx >=
               (activeConvocatoria === 'ayto'
                ? 120
                : activeConvocatoria === 'sermas'
                ? 100
                : 80) && (
               <span className="px-2 py-0.5 rounded-md bg-purple-700 text-white text-[10px] font-extrabold animate-pulse">
                🛡️ PREGUNTA OFICIAL DE RESERVA (MÁXIMA CONCENTRACIÓN)
               </span>
              )}
             </div>

             <div className="flex flex-wrap gap-2">
              <button
               onClick={() =>
                setExamSession((prev) => ({
                 ...prev,
                 selectingDoubtMode: !prev.selectingDoubtMode,
                }))
               }
               className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border transition ${
                examSession.selectingDoubtMode ||
                currentDoubtPair.length > 0
                 ? 'bg-amber-500 text-white border-amber-600'
                 : 'bg-amber-50 dark:bg-stone-800 text-amber-900 dark:text-amber-300 border-amber-300'
               }`}
              >
               ⚖️{' '}
               {currentDoubtPair.length === 2
                ? `Duda 50/50 (${currentDoubtPair
                  .map((i) => ['A', 'B', 'C', 'D'][i])
                  .join(' vs ')})`
                : 'Marcar Duda entre 2 Opciones'}
              </button>

              {currentDoubtPair.length > 0 && (
               <button
                onClick={() =>
                 setExamSession((prev) => ({
                  ...prev,
                  doubtsMap: {
                   ...prev.doubtsMap,
                   [currentQ.id]: [],
                  },
                  selectingDoubtMode: false,
                 }))
                }
                className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-[11px] font-bold cursor-pointer"
               >
                ✕ Quitar marca de duda
               </button>
              )}

              {currentAns !== undefined && (
               <button
                onClick={() =>
                 setExamSession((prev) => {
                  const nextAns = { ...prev.answers };
                  delete nextAns[currentQ.id];
                  return { ...prev, answers: nextAns };
                 })
                }
                className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-[11px] font-bold cursor-pointer"
               >
                ⬜ Dejar en Blanco
               </button>
              )}
              <button
               onClick={() => {
                const qIdToDelete = currentQ.id;
                setQuestionBank((prev) =>
                 prev.filter((item) => item.id !== qIdToDelete)
                );
                setExamSession((prev) => {
                 if (!prev) return null;
                 const remainingQs = prev.questions.filter(
                  (item) => item.id !== qIdToDelete
                 );
                 if (remainingQs.length === 0) return null;
                 return {
                  ...prev,
                  questions: remainingQs,
                  currentIdx: Math.min(
                   prev.currentIdx,
                   remainingQs.length - 1
                  ),
                 };
                });
                setStatusBanner(
                 '🗑️ Pregunta eliminada definitivamente del Banco y retirada de este simulacro.'
                );
                setTimeout(() => setStatusBanner(''), 3500);
               }}
               className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-700 hover:text-white text-rose-800 text-[11px] font-extrabold cursor-pointer"
               title="Si esta pregunta tiene errata o es de convocatoria, bórrala aquí mismo"
              >
               🗑️ Borrar del Banco
              </button>
             </div>
            </div>

            <p className="text-sm font-bold leading-relaxed">
             {currentQ.question}
            </p>

            {(examSession.selectingDoubtMode ||
             currentDoubtPair.length > 0) && (
             <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 text-[11px] flex flex-wrap justify-between items-center gap-2">
              <span>
               <b>⚖️ Selector de las 2 candidatas en duda:</b>{' '}
               Pulsa las 2 letras entre las que dudas para
               descartar el resto visualmente:
              </span>
              <div className="flex gap-1.5">
               {currentQ.options.map((_, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx];
                const isCandidate =
                 currentDoubtPair.includes(idx);
                return (
                 <button
                  key={letter}
                  onClick={() =>
                   toggleDoubtCandidateOption(
                    currentQ.id,
                    idx
                   )
                  }
                  className={`px-2.5 py-1 rounded-lg font-extrabold cursor-pointer border ${
                   isCandidate
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white dark:bg-stone-900 text-stone-600'
                  }`}
                 >
                  Candidata {letter}
                 </button>
                );
               })}
              </div>
             </div>
            )}

            <div className="space-y-2">
             {currentQ.options.map((opt, i) => {
              const isSelectedAnswer = currentAns === i;
              const isDoubtCandidate =
               currentDoubtPair.includes(i);
              const isDiscardedByDoubt =
               currentDoubtPair.length === 2 &&
               !isDoubtCandidate;

              return (
               <div key={i} className="flex items-center gap-2">
                <button
                 onClick={() =>
                  setExamSession((prev) => ({
                   ...prev,
                   answers: {
                    ...prev.answers,
                    [currentQ.id]: i,
                   },
                  }))
                 }
                 className={`flex-1 p-3.5 rounded-xl border text-left text-xs cursor-pointer transition flex justify-between items-center gap-2 ${
                  isSelectedAnswer
                   ? 'bg-[#D97757]/15 border-[#D97757] font-bold ring-1 ring-[#D97757]'
                   : isDoubtCandidate
                   ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-400 font-semibold'
                   : isDiscardedByDoubt
                   ? 'opacity-45 line-through bg-stone-100 dark:bg-stone-900'
                   : 'bg-[#FAF8F5] dark:bg-stone-800'
                 }`}
                >
                 <span>{opt}</span>
                 <div className="flex items-center gap-1.5 shrink-0">
                  {isDoubtCandidate && (
                   <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-extrabold">
                    ⚖️ En Duda (50%)
                   </span>
                  )}
                  {isSelectedAnswer && (
                   <span className="px-2 py-0.5 rounded bg-[#D97757] text-white text-[10px] font-extrabold">
                    ✔ Marcada
                   </span>
                  )}
                 </div>
                </button>
               </div>
              );
             })}
            </div>
           </div>

           <div className="flex justify-between items-center pt-3 border-t">
            <button
             disabled={examSession.currentIdx === 0}
             onClick={() =>
              setExamSession((p) => ({
               ...p,
               currentIdx: p.currentIdx - 1,
              }))
             }
             className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs font-bold cursor-pointer"
            >
             ← Anterior
            </button>

            <div className="flex gap-2">
             {totalDoubtsCount > 0 && (
              <button
               onClick={() => {
                const nextDoubtIdx =
                 examSession.questions.findIndex(
                  (qItem, idx) =>
                   idx !== examSession.currentIdx &&
                   (examSession.doubtsMap?.[qItem.id] || [])
                    .length > 0
                 );
                if (nextDoubtIdx !== -1) {
                 setExamSession((prev) => ({
                  ...prev,
                  currentIdx: nextDoubtIdx,
                 }));
                }
               }}
               className="px-3.5 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold cursor-pointer"
              >
               ⚖️ Saltar a Siguiente Duda ({totalDoubtsCount})
              </button>
             )}

             {examSession.currentIdx <
             examSession.questions.length - 1 ? (
              <button
               onClick={() =>
                setExamSession((p) => ({
                 ...p,
                 currentIdx: p.currentIdx + 1,
                }))
               }
               className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
               Siguiente →
              </button>
             ) : (
              <button
               onClick={finishSimulator}
               className="px-5 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
               ✔ Finalizar y Auditar Riesgo
              </button>
             )}
            </div>
           </div>
          </>
         );
        })()}
       </div>
      ) : (
       <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-5">
        <h3 className="text-lg font-bold text-center">
         Acta Oficial de Corrección y Auditoría de Gestión del Riesgo
        </h3>

        {examHistory[0] && (
         <p className="text-center text-xs">
          Calificación neta final:{' '}
          <b className="text-base text-[#D97757]">
           {examHistory[0].gradeOver10} / 10
          </b>{' '}
          (Aciertos: <b>{examHistory[0].hits}</b> · Errores:{' '}
          <b>{examHistory[0].errors}</b> · Blancos:{' '}
          <b>{examHistory[0].blanks}</b>)
         </p>
        )}

        {examSession.riskReport && (
         <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs space-y-2.5">
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-amber-200 pb-2">
           <span className="font-extrabold text-amber-950 dark:text-amber-200 uppercase">
            ⚖️ Balance Matemático de tus Preguntas Marcadas con
            "Duda entre 2" (Penalización{' '}
            {examSession.riskReport.penaltyLabel})
           </span>
           <span
            className={`px-2.5 py-1 rounded-lg font-extrabold ${
             Number(examSession.riskReport.netPointsFromDoubts) >=
             0
              ? 'bg-emerald-700 text-white'
              : 'bg-rose-700 text-white'
            }`}
           >
            Impacto Neto al Arriesgar:{' '}
            {Number(examSession.riskReport.netPointsFromDoubts) >= 0
             ? '+'
             : ''}
            {examSession.riskReport.netPointsFromDoubts} pregs netas
            (
            {Number(examSession.riskReport.gradeImpactOver10) >= 0
             ? '+'
             : ''}
            {examSession.riskReport.gradeImpactOver10} ptos sobre
            10)
           </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
           <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
            <span className="text-[10px] text-stone-500 block">
             Total Dudas entre 2
            </span>
            <b className="text-sm">
             {examSession.riskReport.doubtsTotal} marcadas
            </b>
           </div>
           <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
            <span className="text-[10px] text-stone-500 block">
             Arriesgadas y Acertadas
            </span>
            <b className="text-sm text-emerald-700">
             ✔ {examSession.riskReport.doubtsAnsweredHits} aciertos
            </b>
           </div>
           <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
            <span className="text-[10px] text-stone-500 block">
             Arriesgadas y Falladas
            </span>
            <b className="text-sm text-rose-700">
             ✘ {examSession.riskReport.doubtsAnsweredErrors} fallos
            </b>
           </div>
           <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
            <span className="text-[10px] text-stone-500 block">
             Precisión de tu Descarte
            </span>
            <b className="text-sm text-amber-800">
             En{' '}
             {examSession.riskReport.doubtsWhereCorrectWasInPair}/
             {examSession.riskReport.doubtsTotal} estaba la
             correcta en tu par
            </b>
           </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-200">
           <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
            <span className="text-[10px] text-stone-500 block">
             🧠 Índice de Fatiga Cognitiva (1.ª Mitad vs 2.ª Mitad)
            </span>
            <b
             className={
              examSession.riskReport.secondHalfErrors >
              examSession.riskReport.firstHalfErrors
               ? 'text-rose-700'
               : 'text-emerald-700'
             }
            >
             1.ª Mitad: {examSession.riskReport.firstHalfErrors} fallos · 2.ª Mitad: {examSession.riskReport.secondHalfErrors} fallos{' '}
             {examSession.riskReport.secondHalfErrors >
             examSession.riskReport.firstHalfErrors
              ? '(⚠️ Fatiga detectada en tramo final)'
              : '(✔ Concentración sostenida)'}
            </b>
           </div>
           <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
            <span className="text-[10px] text-stone-500 block">
             🛡️ Rendimiento en Preguntas de Reserva (&gt;{examSession.riskReport.ordCutoff})
            </span>
            <b className="text-purple-800 dark:text-purple-300">
             {examSession.riskReport.reserveTotal > 0
              ? `${examSession.riskReport.reserveHits} / ${examSession.riskReport.reserveTotal} acertadas en el tramo de reserva`
              : 'Test corto sin tramo de reserva'}
            </b>
           </div>
          </div>
         </div>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
         {examSession.questions.map((q) => {
          const userAns = examSession.answers[q.id];
          const doubtPair = examSession.doubtsMap?.[q.id] || [];
          const isOk = userAns === q.correctIndex;
          if (isOk && doubtPair.length === 0) return null;

          return (
           <div
            key={q.id}
            className={`p-3 rounded-xl border text-xs space-y-1.5 ${
             isOk
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200'
            }`}
           >
            <div className="flex justify-between items-center">
             <span className="font-extrabold">
              {isOk
               ? '✔ Acertada en Duda entre 2'
               : userAns === undefined
               ? '⬜ Dejada en Blanco'
               : '✘ Fallada'}
             </span>
             {doubtPair.length > 0 && (
              <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">
               ⚖️ Dudabas entre:{' '}
               {doubtPair
                .map((i) => ['A', 'B', 'C', 'D'][i])
                .join(' y ')}
              </span>
             )}
            </div>
            <p className="font-bold">{q.question}</p>
            <p className="text-emerald-800 dark:text-emerald-300 font-semibold">
             ✔ Correcta: {q.options[q.correctIndex]}
            </p>
            {!isOk && (
             <div className="flex items-center gap-2 pt-1">
              <span className="font-bold text-[11px]">
               Etiquetar causa raíz del fallo:
              </span>
              <select
               value={errorCausesLog[q.id] || ''}
               onChange={(e) =>
                setErrorCausesLog((prev) => ({
                 ...prev,
                 [q.id]: e.target.value,
                }))
               }
               className="p-1 rounded border text-[11px] bg-white dark:bg-stone-900 font-bold"
              >
               <option value="">-- Seleccionar causa --</option>
               {ERROR_ROOT_CAUSES.map((c) => (
                <option key={c} value={c}>
                 {c}
                </option>
               ))}
              </select>
             </div>
            )}
           </div>
          );
         })}
        </div>

        <button
         onClick={() => setExamSession(null)}
         className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
        >
         Volver al Panel de Simulacros
        </button>
       </div>
      )}
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 04 · AULA DE TEMAS 10/10, RE-AUDITORÍA, SIGLAS Y PDF       */}
    {/* ================================================================= */}
    {(activeModule === '04' || activeModule === '04B') && (
     <div className="mb-4 p-2 rounded-2xl bg-white dark:bg-stone-900 border shadow-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
       <button
        onClick={() => {
         setEj2SubTab('clean');
         setActiveModule('04B');
        }}
        className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
         activeModule === '04B' ||
         (activeModule === '04' && ej2SubTab === 'clean' && correctedEj2Topics.length > 0)
          ? 'bg-emerald-700 text-white shadow-xs'
          : 'bg-[#FAF8F5] dark:bg-stone-800 border text-stone-700 dark:text-stone-300'
        }`}
       >
        ✅ 1. Biblioteca Limpia para Estudiar ({correctedEj2Topics.length}/67 Temas Específicos)
       </button>
       <button
        onClick={() => {
         setEj2SubTab('workshop');
         setActiveModule('04');
        }}
        className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
         activeModule === '04' &&
         (ej2SubTab === 'workshop' || correctedEj2Topics.length === 0)
          ? 'bg-[#D97757] text-white shadow-xs'
          : 'bg-[#FAF8F5] dark:bg-stone-800 border text-stone-700 dark:text-stone-300'
        }`}
       >
        🛠️ 2. Taller Editor y Corrector 1-Clic ({essaysLibrary.length} borradores)
       </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
       <button
        onClick={launchTwoBallsBlindDraw}
        className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold cursor-pointer"
       >
        🎱 Sorteo Oficial 2 Bolas a Ciegas (90m)
       </button>
      </div>
     </div>
    )}
    {activeModule === '04' && (ej2SubTab === 'workshop' || correctedEj2Topics.length === 0) && (
     <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-3">
       <div>
        <span className="text-[11px] font-bold text-[#D97757] uppercase">
         04 · AUDITOR DE CALIDAD (70/15/10/5), VELOCIDAD MANUSCRITA
         (1.850 PAL), SIGLAS Y PDF MODULAR
        </span>
        <h2 className="text-lg font-bold">
         Aula de Temas Magistrales 10/10 ({essaysLibrary.length} temas
         guardados)
        </h2>
       </div>

       <div className="flex flex-wrap items-center gap-2">
        {activeEssayView && (
         <select
          value={activeEssayView.topicId || 'E1'}
          onChange={async (e) => {
           const newTopicId = e.target.value;
           const newAudit = auditDocumentTextValidity(
            activeEssayView.text,
            newTopicId
           );
           const updatedItem = {
            ...activeEssayView,
            topicId: newTopicId,
            audit: newAudit,
           };
           setActiveEssayView(updatedItem);
           setEssaysLibrary((prev) =>
            prev.map((it) =>
             it.id === updatedItem.id ? updatedItem : it
            )
           );
           setDocumentsLibrary((prev) =>
            prev.map((it) =>
             it.id === updatedItem.id ? updatedItem : it
            )
           );
           await saveToStore(STORE_ESSAYS, [updatedItem]);
           await saveToStore(STORE_DOCS, [updatedItem]);
           setCalcEj2(Number(newAudit.finalScore));
           setStatusBanner(
            `🏷️ Tema reasignado a [${newTopicId}] con nota ${newAudit.finalScore}/10.`
           );
           setTimeout(() => setStatusBanner(''), 4000);
          }}
          className="px-2.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold border cursor-pointer"
          title="Cambiar el epígrafe oficial asignado a este tema"
         >
          {activeCatalog
           .filter((t) => !t.id.startsWith('G'))
           .map((t) => (
            <option key={t.id} value={t.id}>
             [{t.id}] {t.title.slice(0, 42)}...
            </option>
           ))}
         </select>
        )}

        <button
         onClick={launchTwoBallsBlindDraw}
         className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold cursor-pointer"
         title="Extrae 2 bolas al azar del bombo y entrena el examen de desarrollo a ciegas"
        >
         🎱 Sorteo 2 Bolas (90m)
        </button>

        {activeEssayView && (
         <button
          onClick={() =>
           openTribunalPublicReader(
            `[${activeEssayView.topicId}] ${activeEssayView.name}`,
            activeEssayView.text
           )
          }
          className="px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
          title="Abrir teleprompter de lectura en voz alta ante el Tribunal (130 palabras/min)"
         >
          🎙️ Lectura ante Tribunal
         </button>
        )}

        <label className="px-3.5 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold cursor-pointer">
         📤 Subir Tema Específico PDF (2.º Ej.)
         <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => {
           processPdfUpload(e.target.files, true, null);
           e.target.value = '';
          }}
          className="hidden"
         />
        </label>

        <select
         onChange={async (e) => {
          const mode = e.target.value;
          if (!mode) return;
          e.target.value = '';

          const convEssays = essaysLibrary.filter((es) =>
           activeConvocatoria === 'sermas'
            ? es.topicId?.startsWith('S-')
            : activeConvocatoria === 'ayto'
            ? es.topicId?.startsWith('AY-')
            : !es.topicId?.startsWith('S-') &&
             !es.topicId?.startsWith('AY-')
          );
          let listToExport =
           convEssays.length > 0 ? convEssays : essaysLibrary;

          if (mode === 'official_83_bocm') {
           listToExport = activeCatalog.map((t) => {
            const existing = essaysLibrary.find(
             (e) => e.topicId === t.id
            );
            return (
             existing || {
              id: ` index-${t.id}`,
              topicId: t.id,
              name: t.title,
              text: buildMagistralTopicText(t, activeConvocatoria),
              audit: {
               finalScore: '10.00',
               ej1TestQualityScore: '10.00',
               coveragePct: 100,
               validityStatus: 'PROGRAMA OFICIAL BOCM N.º 100',
              },
             }
            );
           });
          } else if (mode === 'general') {
           listToExport = listToExport.filter(
            (es) =>
             findTopicAcrossAllCatalogs(es.topicId)?.subArea ===
             'general'
           );
          } else if (
           [
            'area1_ss',
            'area2_dep',
            'area3_inf',
            'area4_san_met',
           ].includes(mode)
          ) {
           listToExport = listToExport.filter(
            (es) =>
             findTopicAcrossAllCatalogs(es.topicId)?.subArea ===
             mode
           );
          }

          if (listToExport.length === 0) {
           setStatusBanner(
            '⚠️ Primero genera o sube al menos un tema de este bloque para exportar el Dossier PDF.'
           );
           return;
          }

          setStatusBanner(
           '⏳ Maquetando y descargando Dossier PDF optimizado...'
          );
          try {
           const { jsPDF } = await import(
            'https://esm.sh/jspdf@2.5.1'
           );
           const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
           const pageWidth = 174;
           let y = 20;

           pdf.setFont('times', 'bold');
           pdf.setFontSize(14);
           pdf.text(
            mode === 'skeletons'
             ? `CUADERNO DE ESQUELETOS Y LEYES 2026 - ${activeConvocatoria.toUpperCase()}`
             : `DOSSIER TEMATICO (${mode.toUpperCase()}) - ${activeConvocatoria.toUpperCase()}`,
            18,
            y
           );
           y += 10;

           listToExport.forEach((es, idx) => {
            if (idx > 0) {
             pdf.addPage();
             y = 20;
            }
            const topicRef = findTopicAcrossAllCatalogs(es.topicId);
            const epigraphs = topicRef
             ? extractSubEpigraphsFromTitle(topicRef.title)
             : [];

            pdf.setFont('times', 'bold');
            pdf.setFontSize(12);
            const titleLines = pdf.splitTextToSize(
             `[${es.topicId}] ${es.name.replace(/\.pdf$/i, '')}`,
             pageWidth
            );
            pdf.text(titleLines, 18, y);
            y += titleLines.length * 6 + 2;

            pdf.setFontSize(9);
            pdf.text(
             `Nota: ${
              es.audit?.finalScore || '10.00'
             }/10 | Test: ${
              es.audit?.ej1TestQualityScore || '10.00'
             }/10 | Cobertura: ${
              es.audit?.coveragePct || 100
             }% | ${es.audit?.validityStatus || 'VIGENTE 2026'}`,
             18,
             y
            );
            y += 7;

            pdf.setFont('times', 'normal');
            pdf.setFontSize(10.5);

            const contentToPrint =
             mode === 'skeletons'
              ? `ESQUELETO OFICIAL DE SUB-EPIGRAFES (ACTIVE RECALL 7 MIN):\n${epigraphs
                .map((ep, i) => `  ${i + 1}. ${ep}`)
                .join(
                 '\n'
                )}\n\nMATRIZ LEGAL Y CONCEPTOS CLAVE:\n${
                topicRef?.lawUpdate || ''
               }\n\nRESUMEN INICIAL:\n${(es.text || '').slice(
                0,
                1200
               )}...`
              : es.text || '';

            const bodyLines = pdf.splitTextToSize(
             contentToPrint,
             pageWidth
            );
            bodyLines.forEach((line) => {
             if (y > 276) {
              pdf.addPage();
              y = 20;
             }
             pdf.text(line, 18, y);
             y += 5;
            });
           });

           pdf.save(
            `Temario_${activeConvocatoria.toUpperCase()}_${mode}_2026.pdf`
           );
           setStatusBanner(
            `📚 PDF modular (${mode.toUpperCase()}) descargado con ${
             listToExport.length
            } temas.`
           );
          } catch (err) {
           console.error(err);
           setStatusBanner('⚠️ Error al generar el PDF modular.');
          }
          setTimeout(() => setStatusBanner(''), 5000);
         }}
         className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
        >
         <option value="">
          📚 Exportar Dossier PDF por Bloques...
         </option>
         <option value="official_83_bocm">
          🏛️ Guía Oficial Completa de los 83 Temas BOCM 2026 (Aunque no hayas subido PDF)
         </option>
         <option value="skeletons">
          🧠 Cuaderno de Esqueletos y Leyes de Temas Subidos (1 pág/tema · Fase 3)
         </option>
         <option value="general">
          🏛️ Tomo 1: Solo Bloque General (PDF Ligero)
         </option>
         <option value="area1_ss">
          📘 Tomo 2: Específico I (Sistema Público y Ley 12/2022)
         </option>
         <option value="area2_dep">
          📗 Tomo 3: Específico II (Dependencia, Discapacidad y
          Mayores)
         </option>
         <option value="area3_inf">
          📙 Tomo 4: Específico III (Infancia, Mujer e Inmigración)
         </option>
         <option value="area4_san_met">
          📕 Tomo 5: Específico IV (Sanidad SERMAS y Metodología TS)
         </option>
         <option value="all">
          📦 Libro Completo Unificado (Copia de Seguridad)
         </option>
        </select>
       </div>
      </div>

      {essaysLibrary.length > 0 && (
       <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
         <div className="flex flex-wrap gap-1.5">
          {essaysLibrary.map((es) => {
           const isSelected = activeEssayView?.id === es.id;
           const isCoherent = es.audit?.coherence
            ? es.audit.coherence.isCoherent
            : true;
           return (
            <div
             key={es.id}
             className={`inline-flex items-center rounded-lg text-xs font-bold border transition overflow-hidden ${
              isSelected
               ? 'bg-[#D97757] text-white border-[#D97757] shadow-xs'
               : !isCoherent
               ? 'bg-rose-50 text-rose-900 border-rose-400'
               : 'bg-[#FAF8F5] dark:bg-stone-800 border-stone-300 dark:border-stone-700'
             }`}
            >
             <button
              onClick={() => {
               const refreshedAudit = auditDocumentTextValidity(
                es.text,
                es.topicId
               );
               setActiveEssayView({
                ...es,
                audit: refreshedAudit,
               });
              }}
              className="px-3 py-1.5 cursor-pointer text-left"
             >
              {!isCoherent ? '⚠️ ' : ''}[{es.topicId}]{' '}
              {es.name.slice(0, 28)}... (
              {es.audit?.finalScore || '9.5'}/10)
             </button>
             <button
              onClick={(ev) => {
               ev.stopPropagation();
               deleteEssayById(es.id);
              }}
              title="Borrar este tema porque está mal o tienes otro mejor"
              className={`px-2 py-1.5 cursor-pointer font-extrabold border-l ${
               isSelected
                ? 'border-white/30 hover:bg-black/20 text-white'
                : 'border-stone-300 hover:bg-rose-600 hover:text-white text-rose-600'
              }`}
             >
              ✕
             </button>
            </div>
           );
          })}
         </div>

         <button
          onClick={clearAllSavedEssays}
          className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 text-[11px] font-bold cursor-pointer shrink-0"
         >
          🗑️ Borrar Todos ({essaysLibrary.length})
         </button>
        </div>

        {activeEssayView && (
         <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
          <div>
           <span className="text-[10px] font-extrabold uppercase text-[#D97757] block">
            📌 EPÍGRAFE OFICIAL EN DATAOPOSICIONES.JS ASIGNADO A ESTE DOCUMENTO:
           </span>
           <b className="text-stone-900 dark:text-white">
            [{activeEssayView.topicId}]{' '}
            {findTopicAcrossAllCatalogs(activeEssayView.topicId)
             ?.title || 'Tema no encontrado en catálogo'}
           </b>
          </div>
          <div className="flex flex-wrap gap-1.5 shrink-0">
           <label className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] cursor-pointer">
            🔄 Sustituir por Nuevo PDF
            <input
             type="file"
             accept=".pdf"
             multiple
             onChange={(e) => {
              processPdfUpload(
               e.target.files,
               true,
               findTopicAcrossAllCatalogs(activeEssayView.topicId)
              );
              e.target.value = '';
             }}
             className="hidden"
            />
           </label>
           <button
            onClick={() => deleteEssayById(activeEssayView.id)}
            className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] cursor-pointer"
           >
            🗑️ Borrar Tema
           </button>
          </div>
         </div>
        )}

        {activeEssayView?.audit?.coherence &&
         !activeEssayView.audit.coherence.isCoherent && (
          <div className="p-3.5 rounded-xl bg-rose-100 dark:bg-rose-950/70 border-2 border-rose-500 text-rose-950 dark:text-rose-100 text-xs space-y-2">
           <div className="font-extrabold">
            {activeEssayView.audit.coherence.alertMsg}
           </div>
           <div className="flex flex-wrap gap-2">
            {activeEssayView.audit.coherence.suggestedTopic && (
             <button
              onClick={async () => {
               const suggested =
                activeEssayView.audit.coherence.suggestedTopic;
               const reEnhanced =
                autoEnhanceStructureAndAnalysis(
                 activeEssayView.text,
                 suggested.id
                );
               const newAudit = auditDocumentTextValidity(
                reEnhanced,
                suggested.id
               );
               const updated = {
                ...activeEssayView,
                topicId: suggested.id,
                text: reEnhanced,
                audit: newAudit,
               };
               setActiveEssayView(updated);
               setEssaysLibrary((prev) =>
                prev.map((it) =>
                 it.id === updated.id ? updated : it
                )
               );
               setDocumentsLibrary((prev) =>
                prev.map((it) =>
                 it.id === updated.id ? updated : it
                )
               );
               await saveToStore(STORE_ESSAYS, [updated]);
               await saveToStore(STORE_DOCS, [updated]);
               setStatusBanner(
                `✅ Documento reubicado en su epígrafe correcto de dataOposiciones.js: [${suggested.id}] ${suggested.title}`
               );
               setTimeout(() => setStatusBanner(''), 5000);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer"
             >
              🔀 Reubicar automáticamente en [
              {activeEssayView.audit.coherence.suggestedTopic.id}]{' '}
              {activeEssayView.audit.coherence.suggestedTopic.title.slice(
               0,
               55
              )}
              ...
             </button>
            )}
            <button
             onClick={() => deleteEssayById(activeEssayView.id)}
             className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold cursor-pointer"
            >
             🗑️ Eliminar este PDF erróneo
            </button>
           </div>
          </div>
         )}
       </div>
      )}

      {activeEssayView && (
       <div className="space-y-4 pt-1">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 space-y-3 text-xs">
         <div className="flex flex-wrap justify-between items-center gap-2 border-b border-emerald-200 pb-2">
          <div>
           <span className="font-extrabold text-emerald-900 dark:text-emerald-200 uppercase block text-[10px]">
            🏛️{' '}
            {activeEssayView.audit?.convocatoriaLabel ||
             getConvocatoriaLabelByTopicId(
              activeEssayView.topicId
             )}
           </span>
           <span className="text-sm font-extrabold">
            Nota Global Desarrollo:{' '}
            {activeEssayView.audit?.finalScore} / 10 · Aptitud para
            Test (1.er Ej.):{' '}
            {activeEssayView.audit?.ej1TestQualityScore} / 10
           </span>
          </div>
          <div className="text-right">
           <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-extrabold text-[11px]">
            {activeEssayView.audit?.validityStatus}
           </span>
           {activeEssayView.audit?.lastAuditedAt && (
            <span className="block text-[10px] text-emerald-800 mt-1">
             Última revisión de calidad:{' '}
             {activeEssayView.audit.lastAuditedAt}
            </span>
           )}
          </div>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
           <span className="text-[10px] text-stone-500 block">
            1. Conocimientos (70%)
           </span>
           <b className="text-sm text-emerald-700">
            {activeEssayView.audit?.conocimientosScore || '6.80'} /
            7.00
           </b>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
           <span className="text-[10px] text-stone-500 block">
            2. Analítico (15%)
           </span>
           <b className="text-sm text-emerald-700">
            {activeEssayView.audit?.analiticoScore || '1.40'} / 1.50
           </b>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
           <span className="text-[10px] text-stone-500 block">
            3. Expresión/Siglas (10%)
           </span>
           <b className="text-sm text-emerald-700">
            {activeEssayView.audit?.expresionScore || '1.00'} / 1.00
            ({activeEssayView.audit?.wordCount} pal.)
           </b>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
           <span className="text-[10px] text-stone-500 block">
            4. Estructura (5%)
           </span>
           <b className="text-sm text-emerald-700">
            {activeEssayView.audit?.presentacionScore || '0.50'} /
            0.50
           </b>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border">
           <span className="text-[10px] text-stone-500 block">
            Epígrafes BOCM/BOAM
           </span>
           <b className="text-sm text-[#D97757]">
            {activeEssayView.audit?.coveragePct || 100}% cubiertos
           </b>
          </div>
         </div>

         <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
           <span className="text-[10px] font-bold uppercase text-stone-500 block">
            ✍️ Calibración de Limpieza, Estructura Numerada y
            Capacidad Analítica (Sin recortar contenido)
           </span>
           <span
            className={`text-xs font-extrabold ${
             activeEssayView.audit?.wordCount >= 1650 &&
             activeEssayView.audit?.wordCount <= 2200
              ? 'text-emerald-700'
              : 'text-amber-700'
            }`}
           >
            ⏱ Tiempo estimado a bolígrafo:{' '}
            {activeEssayView.audit?.handwrittenMinutes ||
             Math.round(
              (activeEssayView.audit?.wordCount || 0) / 23
             )}{' '}
            min netos ({activeEssayView.audit?.wordCount} palabras)
            · {activeEssayView.audit?.pacingStatus}
           </span>
          </div>

          <div className="flex flex-wrap gap-1.5 shrink-0">
           <button
            onClick={async () => {
             const adjustedText = adjustTextToHandwrittenTarget(
              activeEssayView.text
             );
             const newAudit = auditDocumentTextValidity(
              adjustedText,
              activeEssayView.topicId
             );
             const updatedItem = {
              ...activeEssayView,
              text: adjustedText,
              audit: newAudit,
             };
             setActiveEssayView(updatedItem);
             setEssaysLibrary((prev) =>
              prev.map((it) =>
               it.id === updatedItem.id ? updatedItem : it
              )
             );
             setDocumentsLibrary((prev) =>
              prev.map((it) =>
               it.id === updatedItem.id ? updatedItem : it
              )
             );
             await saveToStore(STORE_ESSAYS, [updatedItem]);
             await saveToStore(STORE_DOCS, [updatedItem]);
             setCalcEj2(Number(newAudit.finalScore));
             setStatusBanner(
              `🧹 Cabeceras de PDF y duplicados limpiados sin recortar frases (${newAudit.wordCount} palabras).`
             );
             setTimeout(() => setStatusBanner(''), 4000);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] cursor-pointer"
           >
            🧹 Limpiar Cabeceras PDF (Sin Recortar)
           </button>

           <button
            onClick={async () => {
             const enhancedText = autoEnhanceStructureAndAnalysis(
              activeEssayView.text,
              activeEssayView.topicId
             );
             const newAudit = auditDocumentTextValidity(
              enhancedText,
              activeEssayView.topicId
             );
             const updatedItem = {
              ...activeEssayView,
              text: enhancedText,
              audit: newAudit,
             };
             setActiveEssayView(updatedItem);
             setEssaysLibrary((prev) =>
              prev.map((it) =>
               it.id === updatedItem.id ? updatedItem : it
              )
             );
             setDocumentsLibrary((prev) =>
              prev.map((it) =>
               it.id === updatedItem.id ? updatedItem : it
              )
             );
             await saveToStore(STORE_ESSAYS, [updatedItem]);
             await saveToStore(STORE_DOCS, [updatedItem]);
             setCalcEj2(Number(newAudit.finalScore));
             setStatusBanner(
              `✨ Estructura y Capacidad Analítica optimizadas al 100%: Nota Global ${newAudit.finalScore}/10.`
             );
             setTimeout(() => setStatusBanner(''), 4500);
            }}
            className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] cursor-pointer"
           >
            ✨ Auto-Estructurar y Subir Analítico (10/10)
           </button>
          </div>
         </div>

         {activeEssayView.audit?.acronymAlerts?.length > 0 ? (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-950 dark:text-rose-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
           <div>
            <b className="block text-xs">
             🔤 Penalización detectada en Expresión Escrita (
             {activeEssayView.audit.acronymAlerts.length} siglas
             sin desplegar):
            </b>
            <span className="text-[11px]">
             {activeEssayView.audit.acronymAlerts.join(' · ')}
            </span>
           </div>
           <button
            onClick={async () => {
             const { updated, expandedCount } =
              autoExpandFirstMentionAcronyms(
               activeEssayView.text
              );
             const newAudit = auditDocumentTextValidity(
              updated,
              activeEssayView.topicId
             );
             const updatedItem = {
              ...activeEssayView,
              text: updated,
              audit: newAudit,
             };
             setActiveEssayView(updatedItem);
             setEssaysLibrary((prev) =>
              prev.map((it) =>
               it.id === updatedItem.id ? updatedItem : it
              )
             );
             setDocumentsLibrary((prev) =>
              prev.map((it) =>
               it.id === updatedItem.id ? updatedItem : it
              )
             );
             await saveToStore(STORE_ESSAYS, [updatedItem]);
             await saveToStore(STORE_DOCS, [updatedItem]);
             setCalcEj2(Number(newAudit.finalScore));
             setStatusBanner(
              `🔤 ${expandedCount} sigla(s) desplegadas automáticamente en su primera mención. Nota Expresión: ${newAudit.expresionScore}/1.00.`
             );
             setTimeout(() => setStatusBanner(''), 5000);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] cursor-pointer shrink-0"
           >
            🔤 Auto-Desplegar 1.ª Mención de Siglas
           </button>
          </div>
         ) : (
          <div className="p-2.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-950 dark:text-emerald-200 text-[11px] font-bold">
           ✔ Rigor formal de siglas verificado: Todas las
           abreviaturas utilizadas están correctamente desplegadas en
           su primera mención.
          </div>
         )}

         {activeEssayView.audit?.missingEpigraphs?.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
           <span>
            <b>
             ⚠️ Sub-epígrafes del programa oficial que puedes
             reforzar:
            </b>{' '}
            {activeEssayView.audit.missingEpigraphs.join(' · ')}
           </span>
           <button
            onClick={async () => {
             const extraBlocks =
              activeEssayView.audit.missingEpigraphs
               .map(
                (ep) =>
                 `\n\nDESARROLLO COMPLEMENTARIO DEL SUB-EPÍGRAFE OFICIAL: ${ep.toUpperCase()}\nConforme al marco normativo vigente en 2026 (${getConvocatoriaLabelByTopicId(
                  activeEssayView.topicId
                 )}), el abordaje técnico de "${ep}" exige la aplicación coordinada de la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid, la Ley 39/2015 del Procedimiento Administrativo Común de las Administraciones Públicas (en adelante, LPAC), los protocolos de valoración social estandarizados (Historia Social Única, Informe Social y Plan Individual de Atención Social, en adelante PIAS) y los indicadores de evaluación continua.`
               )
               .join('');
             const newText = activeEssayView.text + extraBlocks;
             const newAudit = auditDocumentTextValidity(
              newText,
              activeEssayView.topicId
             );
             const updatedItem = {
              ...activeEssayView,
              text: newText,
              audit: newAudit,
             };
             setActiveEssayView(updatedItem);
             setEssaysLibrary((prev) =>
              prev.map((it) =>
               it.id === updatedItem.id ? updatedItem : it
              )
             );
             setDocumentsLibrary((prev) =>
              prev.map((it) =>
               it.id === updatedItem.id ? updatedItem : it
              )
             );
             await saveToStore(STORE_ESSAYS, [updatedItem]);
             await saveToStore(STORE_DOCS, [updatedItem]);
             setCalcEj2(Number(newAudit.finalScore));
             setStatusBanner(
              '✅ Sub-epígrafes faltantes inyectados y calidad re-evaluada al 100%.'
             );
             setTimeout(() => setStatusBanner(''), 4000);
            }}
            className="px-3 py-1 rounded-lg bg-amber-800 text-white font-bold cursor-pointer shrink-0"
           >
            ➕ Completar Sub-epígrafes al 100%
           </button>
          </div>
         )}
        </div>

        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border">
         <button
          onClick={async () => {
           const step1 = adjustTextToHandwrittenTarget(
            activeEssayView.text
           );
           const step2 = autoEnhanceStructureAndAnalysis(
            step1,
            activeEssayView.topicId
           );
           const { updated: step3 } =
            autoExpandFirstMentionAcronyms(step2);
           const { updated: step4 } = autoFixObsoleteLawsInText(step3);
           const updatedAudit = auditDocumentTextValidity(
            step4,
            activeEssayView.topicId
           );
           const updatedItem = {
            ...activeEssayView,
            text: step4,
            isCorrectedEj2: true,
            correctedAt: new Date().toLocaleDateString('es-ES'),
            audit: updatedAudit,
           };
           setActiveEssayView(updatedItem);
           setSelectedCleanEj2Id(updatedItem.id);
           setEssaysLibrary((prev) =>
            prev.map((item) =>
             item.id === updatedItem.id ? updatedItem : item
            )
           );
           setDocumentsLibrary((prev) =>
            prev.map((item) =>
             item.id === updatedItem.id ? updatedItem : item
            )
           );
           await saveToStore(STORE_ESSAYS, [updatedItem]);
           await saveToStore(STORE_DOCS, [updatedItem]);
           setCalcEj2(Number(updatedAudit.finalScore));
           setStatusBanner(
            `⚡ Optimización 1-Clic completada en [${updatedItem.topicId}]: Cabeceras limpias, 5 Actos numerados, siglas desplegadas y Nota ${updatedAudit.finalScore}/10 archivada en Pestaña 04B.`
           );
           setTimeout(() => setStatusBanner(''), 5000);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold cursor-pointer shadow-xs"
         >
          ⚡ Optimizar Todo en 1 Clic (Limpiar + 5 Actos + Siglas + Guardar 10/10)
         </button>

         <button
          onClick={() => {
           setSelectedCleanEj2Id(activeEssayView.id);
           setActiveModule('04B');
          }}
          className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold cursor-pointer"
         >
          ✅ Ver en Archivo Limpio (04B)
         </button>

         <button
          onClick={async () => {
           const updatedAudit = auditDocumentTextValidity(
            activeEssayView.text,
            activeEssayView.topicId
           );
           const updatedItem = {
            ...activeEssayView,
            audit: updatedAudit,
           };
           setActiveEssayView(updatedItem);
           setEssaysLibrary((prev) =>
            prev.map((item) =>
             item.id === updatedItem.id ? updatedItem : item
            )
           );
           setDocumentsLibrary((prev) =>
            prev.map((item) =>
             item.id === updatedItem.id ? updatedItem : item
            )
           );
           await saveToStore(STORE_ESSAYS, [updatedItem]);
           await saveToStore(STORE_DOCS, [updatedItem]);

           setStatusBanner(
            '⏳ Generando y descargando archivo PDF modificado...'
           );
           try {
            const { jsPDF } = await import(
             'https://esm.sh/jspdf@2.5.1'
            );
            const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
            const pageWidth = 174;
            let y = 18;

            pdf.setFont('times', 'bold');
            pdf.setFontSize(10);
            pdf.text(
             updatedAudit.convocatoriaLabel.toUpperCase(),
             18,
             y
            );
            y += 6;

            pdf.setFontSize(13);
            const titleLines = pdf.splitTextToSize(
             `[${updatedItem.topicId}] ${updatedItem.name.replace(
              /\.pdf$/i,
              ''
             )}`,
             pageWidth
            );
            pdf.text(titleLines, 18, y);
            y += titleLines.length * 6 + 2;

            pdf.setFontSize(9.5);
            pdf.text(
             `Nota Rubrica Tribunal: ${updatedAudit.finalScore}/10 | Aptitud Test: ${updatedAudit.ej1TestQualityScore}/10 | Cobertura Epigrafe: ${updatedAudit.coveragePct}% | ${updatedAudit.wordCount} palabras`,
             18,
             y
            );
            y += 5;
            pdf.text(
             `Estado Normativo: ${updatedAudit.validityStatus}`,
             18,
             y
            );
            y += 8;

            pdf.setFont('times', 'normal');
            pdf.setFontSize(10.5);
            const lines = pdf.splitTextToSize(
             updatedItem.text || '',
             pageWidth
            );
            lines.forEach((line) => {
             if (y > 277) {
              pdf.addPage();
              y = 20;
             }
             pdf.text(line, 18, y);
             y += 5;
            });

            const cleanFileName = `Tema_${updatedItem.topicId}_Auditado_2026.pdf`;
            pdf.save(cleanFileName);
            setStatusBanner(
             `📄 ¡Archivo "${cleanFileName}" guardado y descargado con su nueva nota (${updatedAudit.finalScore}/10)!`
            );
           } catch (e) {
            console.error('Error generando PDF directo:', e);
            setStatusBanner(
             '⚠️ Error al descargar el PDF directo.'
            );
           }
           setTimeout(() => setStatusBanner(''), 5000);
          }}
          className="px-4 py-2 rounded-xl bg-[#D97757] hover:bg-[#c26446] text-white text-xs font-bold cursor-pointer"
         >
          ⬇ Guardar y Descargar PDF Individual (.PDF)
         </button>

         <button
          onClick={async () => {
           const newQs = generateMutatedQuestionsFromText(
            activeEssayView.text,
            activeEssayView.topicId,
            12
           );
           setQuestionBank((prev) => [...newQs, ...prev]);
           setStatusBanner(
            `🧬 Se han regenerado 12 preguntas de test en [${activeEssayView.topicId}] a partir de tus últimas modificaciones.`
           );
           setTimeout(() => setStatusBanner(''), 4000);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold cursor-pointer"
         >
          🧬 Extraer +12 Preguntas de este Texto Modificado
         </button>
        </div>

        {activeEssayView.audit?.warnings?.length > 0 && (
         <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs space-y-2">
          <div className="font-bold text-rose-900">
           🚨 Alertas detectadas:{' '}
           {activeEssayView.audit.warnings.join(' | ')}
          </div>
          <button
           onClick={async () => {
            const { updated, countFixed } =
             autoFixObsoleteLawsInText(activeEssayView.text);
            const newAudit = auditDocumentTextValidity(
             updated,
             activeEssayView.topicId
            );
            const updatedEssay = {
             ...activeEssayView,
             text: updated,
             audit: newAudit,
            };
            setActiveEssayView(updatedEssay);
            setEssaysLibrary((prev) =>
             prev.map((item) =>
              item.id === updatedEssay.id ? updatedEssay : item
             )
            );
            setDocumentsLibrary((prev) =>
             prev.map((item) =>
              item.id === updatedEssay.id ? updatedEssay : item
             )
            );
            await saveToStore(STORE_ESSAYS, [updatedEssay]);
            await saveToStore(STORE_DOCS, [updatedEssay]);
            setCalcEj2(Number(newAudit.finalScore));
            setStatusBanner(
             `🛠️ ${countFixed} leyes derogadas corregidas y calidad re-evaluada a ${newAudit.finalScore}/10.`
            );
            setTimeout(() => setStatusBanner(''), 4000);
           }}
           className="px-4 py-1.5 rounded-lg bg-rose-700 text-white font-bold cursor-pointer"
          >
           🛠️ Auto-Corregir Normativa Derogada y Re-evaluar Nota
          </button>
         </div>
        )}

        {(() => {
         const topicObj =
          findTopicAcrossAllCatalogs(activeEssayView.topicId) || {
           id: activeEssayView.topicId,
           title: activeEssayView.name,
           lawUpdate: '',
          };
         const currentStory =
          storiesLibrary.find(
           (s) => s.topicId === activeEssayView.topicId
          ) ||
          buildNarrativeStoryForTopic(
           topicObj,
           activeEssayView.text
          );

         return (
          <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 space-y-2.5 text-xs">
           <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
             <span className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-300 block">
              🧠 MEMORIA NARRATIVA Y LÓGICA CAUSA-EFECTO (NO VA AL PDF DE EXAMEN · SOLO PARA TU RECUERDO)
             </span>
             <h4 className="text-sm font-extrabold text-amber-950 dark:text-amber-100">
              {currentStory.title}
             </h4>
            </div>
            <button
             onClick={() =>
              setShowStoryInModule04(!showStoryInModule04)
             }
             className="px-3 py-1 rounded-lg bg-amber-700 text-white font-bold text-[11px] cursor-pointer"
            >
             {showStoryInModule04
              ? '🔽 Ocultar Historia Lógica'
              : '📖 Ver Historia / Cuento de este Tema'}
            </button>
           </div>

           {showStoryInModule04 && (
            <div className="space-y-2 pt-2 border-t border-amber-200 dark:border-amber-800">
             <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 font-bold text-[11px] text-[#D97757]">
              🔗 Hilo Lógico de Epígrafes:{' '}
              <span className="text-stone-700 dark:text-stone-200 font-normal">
               {currentStory.epigraphOrder}
              </span>
             </div>
             <div className="whitespace-pre-line leading-relaxed text-stone-800 dark:text-stone-200 font-serif text-xs bg-white/80 dark:bg-stone-900/80 p-3.5 rounded-xl border">
              {currentStory.storyText}
             </div>
             <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-950 dark:text-emerald-200 text-[11px]">
              <b>💡 Regla / Truco Rápido de Tribunal:</b>{' '}
              {currentStory.logicHook}
             </div>
            </div>
           )}
          </div>
         );
        })()}

        <ZeroLagBufferedTextarea
         rows={18}
         showPacingBar={true}
         value={activeEssayView.text}
         onCommit={async (newText) => {
          const newAudit = auditDocumentTextValidity(
           newText,
           activeEssayView.topicId
          );
          const updatedEssay = {
           ...activeEssayView,
           text: newText,
           audit: newAudit,
          };
          setActiveEssayView(updatedEssay);
          setEssaysLibrary((prev) =>
           prev.map((item) =>
            item.id === updatedEssay.id ? updatedEssay : item
           )
          );
          setDocumentsLibrary((prev) =>
           prev.map((item) =>
            item.id === updatedEssay.id ? updatedEssay : item
           )
          );
          await saveToStore(STORE_ESSAYS, [updatedEssay]);
          await saveToStore(STORE_DOCS, [updatedEssay]);
         }}
         className="w-full p-4 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800 font-serif leading-relaxed"
        />
       </div>
      )}
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 04B · TEMARIO DEFINITIVO EJERCICIO 2 (CORREGIDO Y LISTO)   */}
    {/* ================================================================= */}
    {(activeModule === '04B' || (activeModule === '04' && ej2SubTab === 'clean' && correctedEj2Topics.length > 0)) && (
     <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-5 shadow-xs">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-4">
       <div>
        <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">
         04B · ARCHIVO OFICIAL CONSOLIDADO · EXCLUSIVO TEMARIO ESPECÍFICO (E1 A E67 · DESARROLLO 90 MIN)
        </span>
        <h2 className="text-lg font-bold mt-0.5">
         Temario del Ejercicio 2 Ya Corregido y Listo para Examen (
         {correctedEj2Topics.length} de 67 Temas Específicos)
        </h2>
        <p className="text-xs text-stone-500">
         Aquí se guardan en orden numérico estricto (E1, E2, E3...) tus
         temas de desarrollo tras limpiar cabeceras y auditar su nota
         10/10. Nunca se mezclan con el Bloque General y puedes borrar
         cualquiera con <b>✕</b> o ensayar con el{' '}
         <b>🎙️ Temporizador de Lectura</b>.
        </p>
       </div>

       <div className="flex flex-wrap gap-2">
        <button
         onClick={() => {
          setEj2SubTab('workshop');
          setActiveModule('04');
         }}
         className="px-3.5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-xs font-bold cursor-pointer"
        >
         🛠️ Ir al Taller / Corrector (04)
        </button>
        <label className="px-3.5 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold cursor-pointer">
         📤 Subir Nuevo Tema Ej. 2
         <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => {
           processPdfUpload(e.target.files, true, null);
           e.target.value = '';
          }}
          className="hidden"
         />
        </label>
        {correctedEj2Topics.length > 0 && (
         <button
          onClick={clearAllSavedEssays}
          className="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-700 hover:text-white text-rose-900 border border-rose-300 text-xs font-bold cursor-pointer"
         >
          🗑️ Borrar Todos ({correctedEj2Topics.length})
         </button>
        )}
       </div>
      </div>

      {correctedEj2Topics.length === 0 ? (
       <div className="p-8 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 border text-center space-y-2">
        <p className="text-sm font-bold">
         Aún no tienes temas guardados en tu archivo definitivo del
         Ejercicio 2.
        </p>
        <p className="text-xs text-stone-500">
         Sube tu PDF de Narración arriba o edítalo en la pestaña 04
         (Taller) para que quede archivado aquí automáticamente.
        </p>
       </div>
      ) : (
       <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
         {correctedEj2Topics.map((es) => {
          const currentActive =
           correctedEj2Topics.find(
            (x) => x.id === selectedCleanEj2Id
           ) || correctedEj2Topics[0];
          const isSelected = currentActive?.id === es.id;
          return (
           <div
            key={es.id}
            className={`inline-flex items-center rounded-xl text-xs font-extrabold border overflow-hidden transition ${
             isSelected
              ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
              : 'bg-[#FAF8F5] dark:bg-stone-800 border-stone-300 dark:border-stone-700'
            }`}
           >
            <button
             onClick={() => setSelectedCleanEj2Id(es.id)}
             className="px-3 py-2 cursor-pointer flex items-center gap-1.5"
            >
             <span>✅ [{es.topicId}]</span>
             <span>{es.audit?.finalScore || '10.00'}/10</span>
             <span className="text-[10px] opacity-80">
              ({es.audit?.wordCount} pal)
             </span>
            </button>
            <button
             onClick={(ev) => {
              ev.stopPropagation();
              deleteEssayById(es.id);
             }}
             title="Borrar este tema corregido"
             className={`px-2.5 py-2 cursor-pointer font-extrabold border-l ${
              isSelected
               ? 'border-white/30 hover:bg-black/20 text-white'
               : 'border-stone-300 hover:bg-rose-600 hover:text-white text-rose-600'
             }`}
            >
             ✕
            </button>
           </div>
          );
         })}
        </div>

        {(() => {
         const cleanActive =
          correctedEj2Topics.find(
           (x) => x.id === selectedCleanEj2Id
          ) || correctedEj2Topics[0];
         if (!cleanActive) return null;
         const officialTopic = findTopicAcrossAllCatalogs(
          cleanActive.topicId
         );

         return (
          <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 border-2 border-emerald-500/40 space-y-4">
           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
            <div>
             <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
              ✅ TEMA ESPECÍFICO CORREGIDO Y VERIFICADO · [
              {cleanActive.topicId}]
             </span>
             <h3 className="text-sm font-extrabold mt-1.5">
              {officialTopic?.title || cleanActive.name}
             </h3>
             <p className="text-[11px] text-stone-500 mt-0.5">
              Extensión limpia:{' '}
              <b>{cleanActive.audit?.wordCount} palabras</b> (~
              {cleanActive.audit?.handwrittenMinutes} min a mano ·
              ~{Math.max(1, Math.round((cleanActive.audit?.wordCount || 0) / 130))} min leído en voz alta) ·
              Nota Tribunal:{' '}
              <b className="text-emerald-700">
               {cleanActive.audit?.finalScore} / 10
              </b>{' '}
              · Analítico:{' '}
              <b>{cleanActive.audit?.analiticoScore}/1.50</b>
             </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
             <button
              onClick={() =>
               openTribunalPublicReader(
                `[${cleanActive.topicId}] ${
                 officialTopic?.title || cleanActive.name
                }`,
                cleanActive.text
               )
              }
              className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
             >
              🎙️ Temporizador de Lectura al Tribunal
             </button>
             <button
              onClick={() => {
               setActiveEssayView(cleanActive);
               setEj2SubTab('workshop');
               setActiveModule('04');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
             >
              ✏️ Editar en Taller (04)
             </button>
             <button
              onClick={() => deleteEssayById(cleanActive.id)}
              className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
             >
              🗑️ Borrar Tema
             </button>
            </div>
           </div>

           {(() => {
            const detectedHeadings = (
             cleanActive.text.match(
              /^\s*(?:\d+\.|ACTO\s+[IVX]+:)\s+[^\n]{5,130}/gm
             ) || []
            ).map((h) => h.trim());
            return (
             detectedHeadings.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 space-y-1.5 text-xs">
               <span className="text-[10px] font-extrabold text-emerald-900 dark:text-emerald-300 uppercase block">
                🧭 ESQUELETO DE ESTRUCTURA (LOS {detectedHeadings.length} BLOQUES / ACTOS DE TU EXAMEN DE 90 MIN)
               </span>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {detectedHeadings.map((hd, idx) => (
                 <div
                  key={idx}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-emerald-200 font-bold text-[11px] text-slate-800 dark:text-stone-200"
                 >
                  {hd}
                 </div>
                ))}
               </div>
              </div>
             )
            );
           })()}

           <StrategicHighlighterViewer text={cleanActive.text} />
          </div>
         );
        })()}
       </div>
      )}
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 05 · BANCO DE 10 SUPUESTOS PRÁCTICOS OFICIALES RESUELTOS   */}
    {/* ================================================================= */}
    {activeModule === '05' && (
     <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-5">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-3">
       <div>
        <span className="text-[11px] font-bold text-[#D97757] uppercase">
         05 · ENTRENADOR ESTRICTO DEL 3.er EJERCICIO (10 CASOS
         OFICIALES RESUELTOS · CAM / SERMAS / AYTO)
        </span>
        <h2 className="text-lg font-bold">
         Banco de 10 Supuestos Prácticos con Resolución 10/10,
         Auditoría en 5 Dimensiones y Control de Siglas
        </h2>
       </div>
       <div className="flex flex-wrap gap-2">
        <button
         onClick={async () => {
          setStatusBanner(
           '⏳ Maquetando Dossier PDF con los 10 Supuestos Prácticos Oficiales Resueltos...'
          );
          try {
           const { jsPDF } = await import(
            'https://esm.sh/jspdf@2.5.1'
           );
           const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
           const pageWidth = 174;
           let y = 20;

           pdf.setFont('times', 'bold');
           pdf.setFontSize(14);
           pdf.text(
            'DOSSIER OFICIAL: 10 SUPUESTOS PRACTICOS RESUELTOS 10/10 (2026)',
            18,
            y
           );
           y += 10;

           OFFICIAL_10_PRACTICAL_CASES.forEach((c, idx) => {
            if (idx > 0) {
             pdf.addPage();
             y = 20;
            }
            pdf.setFont('times', 'bold');
            pdf.setFontSize(12);
            const tLines = pdf.splitTextToSize(c.badge, pageWidth);
            pdf.text(tLines, 18, y);
            y += tLines.length * 6 + 3;

            pdf.setFont('times', 'normal');
            pdf.setFontSize(10.5);
            const fullCaseTxt = buildCaseResolutionText(c);
            const bLines = pdf.splitTextToSize(
             fullCaseTxt,
             pageWidth
            );
            bLines.forEach((line) => {
             if (y > 276) {
              pdf.addPage();
              y = 20;
             }
             pdf.text(line, 18, y);
             y += 5;
            });
           });

           pdf.save(
            'Dossier_10_Supuestos_Practicos_Resueltos_2026.pdf'
           );
           setStatusBanner(
            '📚 ¡Dossier con los 10 Supuestos Prácticos Oficiales descargado en PDF!'
           );
          } catch (e) {
           console.error(e);
          }
          setTimeout(() => setStatusBanner(''), 5000);
         }}
         className="px-3.5 py-1.5 rounded-xl bg-[#D97757] text-white text-xs font-bold cursor-pointer"
         >
          📚 Descargar los 10 Supuestos en 1 PDF
         </button>
         <button
          onClick={exportMasterCheatSheet6PagesPDF}
          className="px-2.5 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold cursor-pointer"
          title="Descargar en PDF de 6 páginas todas las tablas comparativas de plazos, silencios, prescripciones, baremos, escalas y autores"
         >
          📊 PDF 6 Págs Plazos
         </button>
        <button
         onClick={exportFullMasterBackup}
         className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold cursor-pointer"
        >
         🛡️ Descargar Backup 100%
        </button>
        <label className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer">
         📂 Restaurar Backup
         <input
          type="file"
          accept=".json"
          onChange={(e) => {
           restoreFullMasterBackup(e.target.files?.[0]);
           e.target.value = '';
          }}
          className="hidden"
         />
        </label>
       </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs max-h-[440px] overflow-y-auto pr-1">
       {[...customPracticalCases, ...OFFICIAL_10_PRACTICAL_CASES].map(
        (c) => {
         const isFromPdf = String(c.id).startsWith('pdf-case-');
         return (
          <div
           key={c.id}
           className={`p-3.5 rounded-xl border space-y-2 flex flex-col justify-between shadow-2xs ${
            isFromPdf
             ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400'
             : 'bg-[#FAF8F5] dark:bg-stone-800'
           }`}
          >
           <div>
            <div className="flex justify-between items-start gap-1">
             <span className="font-extrabold text-[#D97757] block">
              {c.badge}
             </span>
             {isFromPdf && (
              <button
               onClick={() =>
                setCustomPracticalCases((prev) =>
                 prev.filter((item) => item.id !== c.id)
                )
               }
               className="px-1.5 py-0.5 rounded bg-rose-100 hover:bg-rose-700 hover:text-white text-rose-800 font-bold text-[10px] cursor-pointer shrink-0"
               title="Borrar este supuesto extraído"
              >
               🗑️
              </button>
             )}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
             {c.enunciado}
            </p>
            {(!practicalBlindSim.isActive ||
             practicalBlindSim.activeCaseBadge !== c.badge) && (
             <p className="text-[10px] text-emerald-800 dark:text-emerald-300 mt-1.5">
              <b>Claves de Tribunal:</b> {c.claves}
             </p>
            )}
           </div>
           <div className="grid grid-cols-2 gap-1.5 mt-2">
            <button
             onClick={() => {
              const customModelResolution =
               c.fullResolutionText ||
               buildCaseResolutionText(c);
              setActiveCaseReferenceSolution(
               customModelResolution
              );
              setShowSideBySideCritique(false);
              setHumanCritiqueChecks({
               c1_diagnostico: false,
               c2_bioetica: false,
               c3_derechoSubjetivo: false,
               c4_redCompetencial: false,
               c5_indicadoresMedibles: false,
              });
              setPracticalBlindSim({
               isActive: true,
               secondsLeft: 5400,
               isRunning: true,
               activeCaseBadge: c.badge,
               activeEnunciado: c.enunciado,
              });
              setPracticalCaseText('');
              setPracticalRubricResult(null);
              setStatusBanner(
               `⏱️ Modo Examen en Frío (90m) activado para "${c.badge}". Al terminar podrás contrastar tu texto lado a lado con la solución 10/10.`
              );
             }}
             className="py-1.5 px-2 rounded-lg bg-[#D97757] hover:bg-[#c26446] text-white font-bold text-[10px] cursor-pointer"
            >
             ✍️ Resolver en Frío (90m)
            </button>
            <button
             onClick={() => {
              const customModelResolution =
               c.fullResolutionText ||
               buildCaseResolutionText(c);
              setActiveCaseReferenceSolution(
               customModelResolution
              );
              setPracticalBlindSim((prev) => ({
               ...prev,
               isActive: false,
               isRunning: false,
              }));
              setPracticalCaseText(customModelResolution);
              setStatusBanner(
               `📥 Cargada la Resolución Magistral 10/10 de "${c.badge}". Pulsa el botón verde de abajo para auditarla.`
              );
             }}
             className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] cursor-pointer"
            >
             📥 Ver Solución 10/10
            </button>
           </div>
          </div>
         );
        }
       )}
      </div>

      {practicalBlindSim.isActive && (
       <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 text-xs space-y-1.5">
        <div className="flex flex-wrap justify-between items-center gap-2">
         <span className="font-extrabold text-amber-950 dark:text-amber-200">
          🔒 SIMULACRO CIEGO 3.er EJERCICIO ACTIVO · {practicalBlindSim.activeCaseBadge}
         </span>
         <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-white dark:bg-stone-900 font-mono font-extrabold text-amber-900 dark:text-amber-200 border">
           ⏱ {Math.floor(practicalBlindSim.secondsLeft / 60)}:
           {String(practicalBlindSim.secondsLeft % 60).padStart(
            2,
            '0'
           )}
          </span>
          <button
           onClick={() =>
            setPracticalBlindSim((p) => ({
             ...p,
             isRunning: !p.isRunning,
            }))
           }
           className="px-2.5 py-1 rounded bg-amber-700 text-white font-bold cursor-pointer"
          >
           {practicalBlindSim.isRunning ? '⏸ Pausar' : '▶ Reanudar'}
          </button>
          <button
           onClick={() =>
            setPracticalBlindSim((p) => ({
             ...p,
             isActive: false,
             isRunning: false,
            }))
           }
           className="px-2 py-1 rounded bg-stone-200 dark:bg-stone-800 font-bold cursor-pointer"
          >
           ✕ Salir Modo Frío
          </button>
         </div>
        </div>
        <p className="text-stone-700 dark:text-stone-300 italic">
         «{practicalBlindSim.activeEnunciado}»
        </p>
       </div>
      )}

      {(() => {
       const lower = practicalCaseText.toLowerCase();
       const wCount = practicalCaseText.trim()
        ? practicalCaseText.trim().split(/\s+/).length
        : 0;
       const checks = [
        {
         label: '1. Encuadre y Demanda',
         ok: /acogida|demanda|método\s+científico|richmond|hamilton|deontol[oó]gico|16\.2/.test(
          lower
         ),
        },
        {
         label: '2. Técnicas y Escalas',
         ok: /historia\s+social|hsue|51\/2023|informe\s+social|69|genograma|ecomapa|gij[oó]n|zarit|barthel|bvd|val[oó]rame/.test(
          lower
         ),
        },
        {
         label: '3. Diagnóstico y Pronóstico',
         ok: /diagn[oó]stic[ao]|pron[oó]stico|riesgo|vulnerabilidad|convivencial|socioecon[oó]mic/.test(
          lower
         ),
        },
        {
         label: '4. Marco Legal 2026',
         ok: /constituci[oó]n|12\/2022|39\/2015|39\/2006|4\/2023|8\/2021|888\/2022|10\/2022/.test(
          lower
         ),
        },
        {
         label: '5. Obj. General y Específicos',
         ok: /objetivo\s+general|objetivos\s+espec[ií]ficos/.test(
          lower
         ),
        },
        {
         label: '6. PIAS/PIIS (10d) y Catálogo',
         ok: /10\s+d[ií]as|art[ií]culo\s+40|garantizada|condicionada|derecho\s+subjetivo/.test(
          lower
         ),
        },
        {
         label: `7. Red (${
          activeConvocatoria === 'ayto'
           ? 'Ayto: SAMUR/CAD/CAF'
           : activeConvocatoria === 'sermas'
           ? 'SERMAS: UTS/Horus/CSM'
           : 'CAM: ASP/ASE/AMAS/CAID'
         }) + Eval + RGPD`,
         ok:
          /evaluaci[oó]n|indicador/.test(lower) &&
          /protecci[oó]n\s+de\s+datos|3\/2018|rgpd|secreto\s+profesional/.test(
           lower
          ),
        },
       ];
       const doneCount = checks.filter((c) => c.ok).length;
       return (
        <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2 text-xs">
         <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="font-extrabold text-slate-700 dark:text-stone-200">
           🧭 CHECKLIST EN VIVO DE LOS 7 BLOQUES DEL TRIBUNAL ({doneCount}/7 cubiertos · {wCount} palabras)
          </span>
          <button
           onClick={() => {
            const skeleton7 = `1. ENCUADRE METODOLÓGICO, RECEPCIÓN DE LA DEMANDA Y PROFESIONAL DE REFERENCIA (ART. 16.2 LEY 12/2022)

2. RECOGIDA DE INFORMACIÓN, TÉCNICAS, HISTORIA SOCIAL ÚNICA (DECRETO 51/2023) Y ESCALAS VALIDADAS

3. DIAGNÓSTICO SOCIAL DIFERENCIAL POR ÁREAS Y PRONÓSTICO EVOLUTIVO

4. MARCO NORMATIVO VIGENTE APLICABLE AL SUPUESTO (ESTATAL, AUTONÓMICO CAM Y LOCAL)

5. FORMULACIÓN DE OBJETIVOS (OBJETIVO GENERAL Y OBJETIVOS ESPECÍFICOS OPERATIVOS)

6. DISEÑO DEL PLAN INDIVIDUAL (PIAS / PIIS EN 10 DÍAS HÁBILES, ART. 40), INFORME SOCIAL (ART. 69) Y PRESTACIONES GARANTIZADAS VS CONDICIONADAS

7. COORDINACIÓN EN RED INTERINSTITUCIONAL, EVALUACIÓN (3 Y 6 MESES), INDICADORES Y PROTECCIÓN DE DATOS (LO 3/2018 Y SECRETO PROFESIONAL)
`;
            setPracticalCaseText((prev) =>
             prev ? `${prev}

${skeleton7}` : skeleton7
            );
           }}
           className="px-2.5 py-1 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[11px] cursor-pointer"
          >
           ✨ Insertar Esqueleto de 7 Pasos Vacío
          </button>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {checks.map((ch, idx) => (
           <div
            key={idx}
            className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition ${
             ch.ok
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-400'
              : 'bg-white dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-700'
            }`}
           >
            {ch.ok ? '✅ ' : '⬜ '}
            {ch.label}
           </div>
          ))}
         </div>
        </div>
       );
      })()}

      <ZeroLagBufferedTextarea
       rows={14}
       showPacingBar={true}
       value={practicalCaseText}
       onCommit={(nextVal) => setPracticalCaseText(nextVal)}
       placeholder="Selecciona uno de los supuestos de arriba (en Modo Frío 90m o viendo su Solución 10/10) o pulsa «✨ Insertar Esqueleto de 7 Pasos Vacío» para empezar a redactar..."
       className="w-full p-4 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800 font-serif leading-relaxed"
      />

      <div className="flex flex-wrap gap-2">
       <button
        onClick={() => {
         const txt = practicalCaseText;
         const lower = txt.toLowerCase();
         const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;

         const forbiddenAbbrevs = [];
         FORBIDDEN_ACRONYMS_DICTIONARY.forEach((item) => {
          item.regex.lastIndex = 0;
          if (item.regex.test(txt) && !item.checkFull.test(txt)) {
           forbiddenAbbrevs.push(
            `Sigla "${item.acronym}" sin desplegar antes "${item.expansion}"`
           );
          }
         });

         const instrumentsMatches = (
          lower.match(
           /historia\s+social|ficha\s+social|informe\s+social|dictamen\s+pericial|pericial\s+social|genograma|ecomapa|gij[oó]n|zarit|barthel|baremo|pfeiffer|ethos|asi|audit|val[oó]rame|evaluaci[oó]n\s+individualizada/g
          ) || []
         ).length;
         const d1 = Math.min(2.0, (instrumentsMatches / 5) * 2.0);

         const lawsMatches = (
          lower.match(
           /12\/2022|51\/2023|54\/2015|888\/2022|4\/2023|5\/2005|1\/2023|8\/2021|39\/2015|15\/2001|19\/2021|1155\/2024|5\/2002|3\/2004|1\/2007|1\/2001|37\/2006|4\/2015|1109\/2015|6\/1985|1\/2025|335|347|23\/2023/g
          ) || []
         ).length;
         const d2 = Math.min(2.0, (lawsMatches / 5) * 2.0);

         const piasMatches = (
          lower.match(
           /plan\s+individual|pias|piis|plan\s+de\s+apoyo|garantizada|condicionada|derecho\s+subjetivo|urgencia|objetivo\s+general|objetivos\s+espec[ií]ficos|10\s+d[ií]as/g
          ) || []
         ).length;
         const d3 = Math.min(2.5, (piasMatches / 4) * 2.5);

         const netMatches = (
          lower.match(
           /atenci[oó]n\s+social\s+primaria|especializada|salud\s+mental|horus|hcis|uts|samur|madrid\s+salud|cad|caf|caef|pef|tarjeta\s+familias|fiscal|juzgado|tribunal\s+de\s+instancia|imlc|oavd|educativa|eoep|caid|crps|amapad|amas|cepi|cvo|crecovi|arrmi/g
          ) || []
         ).length;
         const d4 = Math.min(2.0, (netMatches / 4) * 2.0);

         const evalMatches = (
          lower.match(
           /indicador|evaluaci[oó]n|continua|intermedia|final|cronograma|protecci[oó]n\s+de\s+datos/g
          ) || []
         ).length;
         const d5 = Math.min(1.5, (evalMatches / 4) * 1.5);

         // Detector Anti-Espejismo Semántico (Detecta negaciones o mala praxis cerca de preceptos clave)
         const antiMirageAlerts = [];
         const malpracticePatterns = [
          {
           rgx: /\b(ignora|omite|prescinde|incumple|vulnera|descarta|evita)\b[^.]{0,65}\b(art[ií]culo\s+16\.2|art[ií]culo\s+40|art[ií]culo\s+69|ley\s+12\/2022|historia\s+social|informe\s+social|pias|piis|secreto\s+profesional|consentimiento)/i,
           msg: 'Mala praxis detectada: Se menciona un precepto o instrumento clave precedido de un verbo de omisión/vulneración («ignora/omite/prescinde»).',
          },
          {
           rgx: /\bsin\s+(?:abrir|elaborar|realizar|contar\s+con|emitir|respetar)\b[^.]{0,55}\b(historia\s+social|hsue|informe\s+social|pias|piis|valoraci[oó]n|diagn[oó]stico|consentimiento)/i,
           msg: 'Contradicción procedimental detectada: Se plantea derivar o intervenir «sin abrir/elaborar» instrumentos preceptivos (HSUe, Informe Social o PIAS).',
          },
         ];
         malpracticePatterns.forEach((mp) => {
          if (mp.rgx.test(txt)) antiMirageAlerts.push(mp.msg);
         });

         let rawTotal = d1 + d2 + d3 + d4 + d5;
         if (words < 250) rawTotal *= 0.65;
         if (forbiddenAbbrevs.length > 0)
          rawTotal -= forbiddenAbbrevs.length * 0.25;
         if (antiMirageAlerts.length > 0)
          rawTotal -= antiMirageAlerts.length * 4.0;

         const total = Math.max(0, Math.min(10, rawTotal)).toFixed(2);
         setCalcEj3(Number(total));
         setPracticalBlindSim((prev) => ({
          ...prev,
          isRunning: false,
         }));
         setPracticalRubricResult({
          d1: d1.toFixed(2),
          d2: d2.toFixed(2),
          d3: d3.toFixed(2),
          d4: d4.toFixed(2),
          d5: d5.toFixed(2),
          words,
          handwrittenMin: Math.round(words / 23),
          forbiddenAbbrevs,
          antiMirageAlerts,
          total,
         });
        }}
        className="px-5 py-2.5 rounded-xl bg-[#4A7C59] hover:bg-[#3d684a] text-white text-xs font-bold cursor-pointer"
       >
        ✔ Auditar Supuesto con Rigor Real de Tribunal (5 Dimensiones +
        Siglas)
       </button>

       <button
        onClick={() =>
         openTribunalPublicReader(
          'Lectura Pública del 3.er Ejercicio (Supuesto Práctico)',
          practicalCaseText
         )
        }
        className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
       >
        🎙️ Ensayar Lectura Pública ante Tribunal (130 pal/m)
       </button>

       <button
        onClick={() => {
         const { updated, expandedCount } =
          autoExpandFirstMentionAcronyms(practicalCaseText);
         setPracticalCaseText(updated);
         setStatusBanner(
          `🔤 Se han desplegado automáticamente ${expandedCount} sigla(s) en su primera mención dentro del supuesto práctico.`
         );
         setTimeout(() => setStatusBanner(''), 4000);
        }}
        className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
       >
        🔤 Auto-Desplegar Siglas en el Caso
       </button>

       <button
        onClick={async () => {
         if (!practicalCaseText.trim()) return;
         setStatusBanner('⏳ Descargando Supuesto Práctico en PDF...');
         try {
          const { jsPDF } = await import(
           'https://esm.sh/jspdf@2.5.1'
          );
          const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
          const pageWidth = 174;
          let y = 20;

          pdf.setFont('times', 'bold');
          pdf.setFontSize(13);
          pdf.text(
           '3.er EJERCICIO OFICIAL - SUPUESTO PRACTICO AUDITADO (2026)',
           18,
           y
          );
          y += 7;
          pdf.setFontSize(9.5);
          pdf.text(
           `Calificacion Rubrica 5 Dimensiones: ${
            practicalRubricResult?.total || calcEj3
           }/10 | Extension: ${
            practicalCaseText.trim().split(/\s+/).length
           } palabras`,
           18,
           y
          );
          y += 8;

          pdf.setFont('times', 'normal');
          pdf.setFontSize(10.5);
          const lines = pdf.splitTextToSize(
           practicalCaseText,
           pageWidth
          );
          lines.forEach((line) => {
           if (y > 276) {
            pdf.addPage();
            y = 20;
           }
           pdf.text(line, 18, y);
           y += 5;
          });
          pdf.save('Supuesto_Practico_Auditado_10de10_2026.pdf');
          setStatusBanner(
           '📄 ¡Supuesto Práctico descargado en PDF con éxito!'
          );
         } catch (e) {
          console.error(e);
         }
         setTimeout(() => setStatusBanner(''), 4000);
        }}
        className="px-4 py-2.5 rounded-xl bg-[#D97757] text-white text-xs font-bold cursor-pointer"
       >
        ⬇ Descargar este Supuesto en PDF
       </button>
      </div>

      {practicalRubricResult && (
       <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border text-xs space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
         <span className="text-sm font-extrabold text-[#D97757]">
          Nota Auditada del 3.er Ejercicio:{' '}
          {practicalRubricResult.total} / 10 puntos
         </span>
         <span className="font-bold text-stone-600 dark:text-stone-300">
          ✍️ Extensión: {practicalRubricResult.words} palabras (~
          {practicalRubricResult.handwrittenMin} min a mano)
         </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
         <div className="p-2 rounded border bg-white dark:bg-stone-900">
          <b>1. Instrumentos/Escalas:</b> {practicalRubricResult.d1} /
          2.00
         </div>
         <div className="p-2 rounded border bg-white dark:bg-stone-900">
          <b>2. Normativa 2026:</b> {practicalRubricResult.d2} / 2.00
         </div>
         <div className="p-2 rounded border bg-white dark:bg-stone-900">
          <b>3. Objetivos y PIAS:</b> {practicalRubricResult.d3} /
          2.50
         </div>
         <div className="p-2 rounded border bg-white dark:bg-stone-900">
          <b>4. Red Interinst.:</b> {practicalRubricResult.d4} / 2.00
         </div>
         <div className="p-2 rounded border bg-white dark:bg-stone-900">
          <b>5. Indicadores/Eval.:</b> {practicalRubricResult.d5} /
          1.50
         </div>
        </div>

        {practicalRubricResult.antiMirageAlerts?.length > 0 && (
         <div className="p-3.5 rounded-xl bg-rose-100 dark:bg-rose-950 border-2 border-rose-600 text-rose-950 dark:text-rose-100 font-extrabold space-y-1">
          <span className="block uppercase text-[11px]">
           🚨 ALERTA DE ESPEJISMO SEMÁNTICO / MALA PRAXIS DE TRIBUNAL (-4,00 PTOS):
          </span>
          <p className="text-xs font-semibold">
           {practicalRubricResult.antiMirageAlerts.join(' · ')}
          </p>
         </div>
        )}

        {practicalRubricResult.forbiddenAbbrevs?.length > 0 ? (
         <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 font-semibold">
          ⚠️ Penalización por Siglas sin Desplegar (Pulsa el botón
          rojo "Auto-Desplegar Siglas"):{' '}
          {practicalRubricResult.forbiddenAbbrevs.join(' | ')}
         </div>
        ) : (
         <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-bold">
          ✔ Cero abreviaturas prohibidas: Todas las siglas del caso
          práctico están correctamente desplegadas.
         </div>
        )}

        {/* FASE DE AUTOCORRECCIÓN CRÍTICA Y AUDITORÍA HUMANA (ANTI-SESGO DE IA) */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border-2 border-indigo-300 dark:border-indigo-700 space-y-3">
         <div className="flex flex-wrap justify-between items-center gap-2 border-b border-indigo-200 pb-2">
          <div>
           <span className="text-[10px] font-extrabold uppercase text-indigo-900 dark:text-indigo-200 block">
            ⚖️ FASE 2 OBLIGATORIA · AUTOCORRECCIÓN CRÍTICA Y AUDITORÍA HUMANA (ANTI-ESPEJISMO DE IA)
           </span>
           <p className="text-[11px] text-stone-600 dark:text-stone-300">
            El algoritmo valida que estén las leyes, escalas y plazos, pero el sentido clínico y ético lo validas tú (o tu compañera en rol <b>Revisora</b>):
           </p>
          </div>
          <button
           onClick={() => {
            if (!activeCaseReferenceSolution) {
             setActiveCaseReferenceSolution(
              buildCaseResolutionText(OFFICIAL_10_PRACTICAL_CASES[0])
             );
            }
            setShowSideBySideCritique(!showSideBySideCritique);
           }}
           className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs cursor-pointer"
          >
           {showSideBySideCritique
            ? '🔼 Ocultar Comparador Lado a Lado'
            : '🔍 Contrastar Lado a Lado con Solución 10/10'}
          </button>
         </div>

         {showSideBySideCritique && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
           <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border space-y-1">
            <span className="text-[10px] font-extrabold text-[#D97757] uppercase block">
             ✍️ TU RESOLUCIÓN REDACTADA:
            </span>
            <div className="text-[11px] font-serif whitespace-pre-line max-h-60 overflow-y-auto leading-relaxed">
             {practicalCaseText || 'Sin texto.'}
            </div>
           </div>
           <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-stone-900 border border-emerald-400 space-y-1">
            <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase block">
             🏆 SOLUCIÓN MAGISTRAL 10/10 DEL TRIBUNAL:
            </span>
            <div className="text-[11px] font-serif whitespace-pre-line max-h-60 overflow-y-auto leading-relaxed">
             {activeCaseReferenceSolution}
            </div>
           </div>
          </div>
         )}

         {(() => {
          const humanChecksList = [
           {
            key: 'c1_diagnostico',
            label:
             '1. Diagnóstico Diferencial Certero: ¿Distingue el problema raíz de los síntomas secundarios sin culpabilizar a la persona?',
           },
           {
            key: 'c2_bioetica',
            label:
             '2. Deliberación Bioética (Brody/Payton/Beauchamp): ¿Resuelve el dilema entre autonomía y protección sin caer en paternalismo?',
           },
           {
            key: 'c3_derechoSubjetivo',
            label:
             '3. Rigor en Catálogo: ¿Aplica las prestaciones garantizadas como derecho subjetivo exigible y no como ayuda graciable?',
           },
           {
            key: 'c4_redCompetencial',
            label:
             '4. Pertinencia Competencial: ¿Deriva a los dispositivos reales de la Administración examinada sin confundir red municipal y autonómica?',
           },
           {
            key: 'c5_indicadoresMedibles',
            label:
             '5. Evaluación Operativa: ¿Los indicadores a 3 y 6 meses miden impacto real en la calidad de vida y no solo trámites burocráticos?',
           },
          ];
          const checkedCount = Object.values(
           humanCritiqueChecks
          ).filter(Boolean).length;
          const humanScoreOver10 = checkedCount * 2;
          const consolidatedScore = (
           Number(practicalRubricResult.total) * 0.6 +
           humanScoreOver10 * 0.4
          ).toFixed(2);

          return (
           <div className="space-y-2">
            <div className="grid grid-cols-1 gap-1.5">
             {humanChecksList.map((item) => (
              <label
               key={item.key}
               className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                humanCritiqueChecks[item.key]
                 ? 'bg-emerald-100/90 dark:bg-emerald-950/50 border-emerald-400 font-bold text-emerald-950 dark:text-emerald-100'
                 : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700'
               }`}
              >
               <input
                type="checkbox"
                checked={!!humanCritiqueChecks[item.key]}
                onChange={(e) =>
                 setHumanCritiqueChecks((p) => ({
                  ...p,
                  [item.key]: e.target.checked,
                 }))
                }
               />
               <span>{item.label}</span>
              </label>
             ))}
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border flex flex-wrap justify-between items-center gap-2">
             <span>
              Nota Técnica Estructural (IA):{' '}
              <b>{practicalRubricResult.total}/10</b> · Nota Juicio
              Clínico Humano: <b>{humanScoreOver10}/10</b>
             </span>
             <span className="px-3 py-1 rounded-lg bg-indigo-700 text-white font-extrabold">
              🏅 Nota Real Consolidada (60% IA + 40% Criterio Humano):{' '}
              {consolidatedScore} / 10
             </span>
            </div>
           </div>
          );
         })()}
        </div>
       </div>
      )}
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 06 · LABORATORIO DOCUMENTAL PDF                            */}
    {/* ================================================================= */}
    {(activeModule === '06' || (activeModule === '02' && bankSubTab === 'pdfs')) && (
     <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-4">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3 border-b pb-4">
       <div>
        <span className="text-[11px] font-extrabold text-[#D97757] uppercase block">
         🔗 VINCULACIÓN DIRECTA 1:1 CON DATAOPOSICIONES.JS · CONVOCATORIA BOCM N.º 100 (2026)
        </span>
        <h2 className="text-lg font-bold">
         06 · Laboratorio Documental PDF Vinculado al Temario Oficial ({documentsLibrary.length} Archivos en{' '}
         {new Set(documentsLibrary.map((d) => d.topicId)).size} Temas de dataOposiciones.js)
        </h2>
        <p className="text-xs text-stone-500">
         Cada archivo PDF (📘 Tratado Extenso y ✍️ Narración 5 Actos) está anidado directamente dentro de su epígrafe oficial de <b>dataOposiciones.js</b> y alimenta Test, Desarrollo (04B), Prácticos (05) y Memoria (06).
        </p>
       </div>
       <div className="flex flex-wrap gap-2 shrink-0">
        {documentsLibrary.length > 0 && (
         <button
          onClick={async () => {
           await handleRealignAllLibraryToBocm2026();
           let syncedCount = 0;
           const newCases = [];
           let newQs = [];

           documentsLibrary.forEach((d) => {
            const tObj = findTopicAcrossAllCatalogs(d.topicId);
            if (tObj && d.text) {
             ensureStoryForTopic(tObj, d.text);
             const c = extractPracticalCaseFromExtensoPdf(d.text, tObj);
             if (c) newCases.push(c);
             const lit = extractLiteralTestQuestionsFromPdf(d.text, tObj.id);
             if (lit.length > 0) newQs = [...newQs, ...lit];
             syncedCount++;
            }
           });

           if (newCases.length > 0) {
            setCustomPracticalCases((prev) => {
             const ids = new Set(newCases.map((c) => c.topicId));
             return [...newCases, ...prev.filter((c) => !ids.has(c.topicId))];
            });
           }
           if (newQs.length > 0) {
            setQuestionBank((prev) => {
             const existingTexts = new Set(
              prev.map((q) => q.question.trim().toLowerCase())
             );
             const unique = newQs.filter(
              (q) =>
               !existingTexts.has(q.question.trim().toLowerCase()) &&
               !isDefectiveOrAdminQuestion(q)
             );
             return [...unique, ...prev];
            });
           }
           setStatusBanner(
            `🔗 ¡${syncedCount} PDFs sincronizados al 100% con dataOposiciones.js (Temario 01, Banco Test 02, Biblioteca 04B, Casos 05 y Memoria 06)!`
           );
           setTimeout(() => setStatusBanner(''), 5500);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-extrabold cursor-pointer shadow-xs"
          title="Realinea todos tus PDFs con dataOposiciones.js (BOCM 2026) y sincroniza sus preguntas, casos prácticos, glosarios y narraciones"
         >
          🔄 Sincronizar y Alinear {documentsLibrary.length} PDFs con dataOposiciones.js
         </button>
        )}
        <label className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer">
         📥 Subir PDF(s)
         <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => {
           processPdfUpload(e.target.files, false);
           e.target.value = '';
          }}
          className="hidden"
         />
        </label>
        {documentsLibrary.length > 0 && (
         <button
          onClick={async () => {
           for (const d of documentsLibrary) {
            await deleteFromStore(STORE_DOCS, d.id);
           }
           setDocumentsLibrary([]);
           setStatusBanner(
            '🗑️ Todos los archivos del Laboratorio PDF han sido eliminados.'
           );
           setTimeout(() => setStatusBanner(''), 4000);
          }}
          className="px-3.5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
         >
          🗑️ Borrar Todos ({documentsLibrary.length})
         </button>
        )}
       </div>
      </div>

      {/* BARRA DE CONTROL Y FILTROS VINCULADOS A DATAOPOSICIONES.JS */}
      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 border flex flex-wrap justify-between items-center gap-2 text-xs">
       <div className="flex flex-wrap gap-1.5">
        <button
         onClick={() => setPdfLabViewMode('only_with_pdfs')}
         className={`px-3 py-1.5 rounded-xl font-extrabold cursor-pointer transition ${
          pdfLabViewMode === 'only_with_pdfs'
           ? 'bg-[#D97757] text-white shadow-2xs'
           : 'bg-white dark:bg-stone-900 border text-stone-700 dark:text-stone-300'
         }`}
        >
         🗂️ Por Tema de dataOposiciones Con PDFs ({new Set(documentsLibrary.map((d) => d.topicId)).size} Temas)
        </button>
        <button
         onClick={() => setPdfLabViewMode('all_topics')}
         className={`px-3 py-1.5 rounded-xl font-extrabold cursor-pointer transition ${
          pdfLabViewMode === 'all_topics'
           ? 'bg-[#D97757] text-white shadow-2xs'
           : 'bg-white dark:bg-stone-900 border text-stone-700 dark:text-stone-300'
         }`}
        >
         🏛️ Matriz Completa dataOposiciones ({activeCatalog.length} Temas · Ver Huecos)
        </button>
        <button
         onClick={() => setPdfLabViewMode('flat_files')}
         className={`px-3 py-1.5 rounded-xl font-extrabold cursor-pointer transition ${
          pdfLabViewMode === 'flat_files'
           ? 'bg-slate-800 text-white shadow-2xs'
           : 'bg-white dark:bg-stone-900 border text-stone-700 dark:text-stone-300'
         }`}
        >
         📄 Lista Plana de Archivos ({documentsLibrary.length} PDFs)
        </button>
       </div>

       <div className="flex flex-wrap items-center gap-2">
        {activeConvocatoria === 'cam_a2' && pdfLabViewMode !== 'flat_files' && (
         <select
          value={pdfLabBlockFilter}
          onChange={(e) => setPdfLabBlockFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-xl border bg-white dark:bg-stone-900 font-bold text-xs cursor-pointer"
         >
          <option value="Todos">📋 Todos los Bloques BOCM</option>
          <option value="Especificos">✍️ Solo 67 Específicos (E1-E67)</option>
          <option value="Generales">🏛️ Solo 16 Generales (G1-G16)</option>
          <option value="Bloque Específico I">Bloque I (E1-E11)</option>
          <option value="Bloque Específico II">Bloque II (E12-E15)</option>
          <option value="Bloque Específico III">Bloque III (E16-E20)</option>
          <option value="Bloque Específico IV">Bloque IV (E21-E30)</option>
          <option value="Bloque Específico V">Bloque V (E31-E36)</option>
          <option value="Bloque Específico VI">Bloque VI (E37-E46)</option>
          <option value="Bloque Específico VII">Bloque VII (E47-E54)</option>
          <option value="Bloque Específico VIII">Bloque VIII (E55-E61)</option>
          <option value="Bloque Específico IX">Bloque IX (E62-E67 · Forense/OAVD)</option>
         </select>
        )}
        <input
         type="text"
         value={pdfLabSearch}
         onChange={(e) => setPdfLabSearch(e.target.value)}
         placeholder="Buscar tema de dataOposiciones o nombre de PDF..."
         className="px-3 py-1.5 rounded-xl border bg-white dark:bg-stone-900 text-xs min-w-[210px]"
        />
       </div>
      </div>

      {/* VISTA 1 Y 2: AGRUPADA DIRECTAMENTE POR EPÍGRAFE OFICIAL DE DATAOPOSICIONES.JS */}
      {pdfLabViewMode !== 'flat_files' ? (
       <div className="space-y-3">
        {activeCatalog
         .filter((t) => {
          const topicDocs = documentsLibrary.filter(
           (d) => d.topicId === t.id
          );
          if (pdfLabViewMode === 'only_with_pdfs' && topicDocs.length === 0) {
           return false;
          }
          if (pdfLabBlockFilter === 'Especificos' && t.id.startsWith('G')) {
           return false;
          }
          if (pdfLabBlockFilter === 'Generales' && !t.id.startsWith('G')) {
           return false;
          }
          if (
           pdfLabBlockFilter.startsWith('Bloque') &&
           t.block !== pdfLabBlockFilter
          ) {
           return false;
          }
          if (pdfLabSearch.trim()) {
           const q = pdfLabSearch.toLowerCase();
           const matchTopic =
            t.id.toLowerCase().includes(q) ||
            t.title.toLowerCase().includes(q) ||
            (t.lawUpdate || '').toLowerCase().includes(q);
           const matchDoc = topicDocs.some((d) =>
            d.name.toLowerCase().includes(q)
           );
           return matchTopic || matchDoc;
          }
          return true;
         })
         .map((t) => {
          const topicDocs = documentsLibrary.filter(
           (d) => d.topicId === t.id
          );
          const hasExtenso = topicDocs.some((d) =>
           /extenso|tratado/i.test(`${d.docRole || ''} ${d.name}`)
          );
          const hasNarracion = topicDocs.some((d) =>
           /narraci|5\s+actos/i.test(`${d.docRole || ''} ${d.name}`)
          );
          const topicQsCount = questionBank.filter(
           (q) => q.topicId === t.id
          ).length;

          return (
           <div
            key={t.id}
            className="p-4 rounded-2xl border bg-[#FAF8F5] dark:bg-stone-800/90 space-y-3 shadow-2xs"
           >
            <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-2.5 border-b border-stone-200 dark:border-stone-700 pb-3">
             <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
               <span className="px-2.5 py-0.5 rounded-lg bg-[#D97757] text-white font-extrabold text-xs">
                [{t.id}] · {t.block}
               </span>
               <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                 hasExtenso
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                }`}
               >
                {hasExtenso
                 ? '✔ 📘 Tratado Extenso Vinculado'
                 : '⚪ Sin PDF Extenso'}
               </span>
               <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                 hasNarracion
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                }`}
               >
                {hasNarracion
                 ? '✔ ✍️ Narración 5 Actos Vinculada'
                 : '⚪ Sin PDF Narración'}
               </span>
               <span className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border text-[10px] font-bold">
                ❓ {topicQsCount} pregs en Banco
               </span>
              </div>

              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug pt-0.5">
               {t.title}
              </h3>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
               <b>Matriz Legal dataOposiciones.js:</b> {t.lawUpdate}
              </p>
             </div>

             <div className="flex flex-wrap gap-1.5 shrink-0">
              <label className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold cursor-pointer">
               📤 Subir PDF a [{t.id}]
               <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => {
                 processPdfUpload(e.target.files, true, t);
                 e.target.value = '';
                }}
                className="hidden"
               />
              </label>
              <button
               onClick={() => launchStrategicSimulator(t.id)}
               className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold cursor-pointer"
              >
               🎯 Test [{t.id}]
              </button>
             </div>
            </div>

            {topicDocs.length > 0 ? (
             <div className="space-y-2">
              {topicDocs.map((doc) => (
               <div
                key={doc.id}
                className="p-3 rounded-xl bg-white dark:bg-stone-900 border flex flex-col lg:flex-row justify-between lg:items-center gap-2 text-xs"
               >
                <div className="space-y-1 flex-1">
                 <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-extrabold text-[10px] text-[#D97757] border">
                   {doc.docRole ||
                    (/narraci/i.test(doc.name)
                     ? '✍️ Narración 5 Actos (Ej. 2)'
                     : '📘 Tratado Extenso (Ej. 1)')}
                  </span>
                  <b className="text-slate-900 dark:text-white">
                   {doc.name}
                  </b>
                  <span className="text-stone-400">·</span>
                  <span>
                   Nota/Aptitud:{' '}
                   <b className="text-emerald-700">
                    {doc.audit?.ej1TestQualityScore || '10.00'}/10
                   </b>
                  </span>
                  <span className="text-stone-400">·</span>
                  <span
                   className={`font-extrabold ${
                    String(
                     doc.audit?.validityStatus || ''
                    ).includes('❌')
                     ? 'text-rose-700'
                     : 'text-emerald-700 dark:text-emerald-300'
                   }`}
                  >
                   {doc.audit?.validityStatus}
                  </span>
                 </div>

                 <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                  <span>Cambiar vinculación en dataOposiciones.js:</span>
                  <select
                   value={doc.topicId || t.id}
                   onChange={async (e) => {
                    const nextId = e.target.value;
                    const nextTopicObj =
                     findTopicAcrossAllCatalogs(nextId);
                    const nextAudit =
                     auditDocumentTextValidity(
                      doc.text || '',
                      nextTopicObj || nextId,
                      doc.name || ''
                     );
                    const updatedDoc = {
                     ...doc,
                     topicId: nextId,
                     audit: nextAudit,
                    };
                    setDocumentsLibrary((prev) =>
                     prev.map((d) =>
                      d.id === doc.id ? updatedDoc : d
                     )
                    );
                    setEssaysLibrary((prev) =>
                     prev.map((es) =>
                      es.id === doc.id ? updatedDoc : es
                     )
                    );
                    await saveToStore(STORE_DOCS, [updatedDoc]);
                    await saveToStore(STORE_ESSAYS, [
                     updatedDoc,
                    ]);
                    setStatusBanner(
                     `✅ "${doc.name}" reasignado en dataOposiciones.js a [${nextId}] ${nextTopicObj?.title.slice(0, 50)}...`
                    );
                    setTimeout(() => setStatusBanner(''), 4000);
                   }}
                   className="px-2 py-0.5 rounded border bg-[#FAF8F5] dark:bg-stone-800 font-bold text-[11px] cursor-pointer max-w-[380px] truncate"
                  >
                   {activeCatalog.map((catTopic) => (
                    <option
                     key={catTopic.id}
                     value={catTopic.id}
                    >
                     [{catTopic.id}] {catTopic.title.slice(0, 72)}
                    </option>
                   ))}
                  </select>
                 </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                 <button
                  onClick={async () => {
                   const existingEssay = essaysLibrary.find(
                    (es) =>
                     es.id === doc.id ||
                     es.topicId === doc.topicId
                   );
                   if (existingEssay) {
                    setActiveEssayView(existingEssay);
                    setSelectedCleanEj2Id(existingEssay.id);
                   } else {
                    const enhanced =
                     autoEnhanceStructureAndAnalysis(
                      doc.text || '',
                      doc.topicId
                     );
                    const newEs = {
                     ...doc,
                     text: enhanced,
                     isCorrectedEj2: true,
                     audit: auditDocumentTextValidity(
                      enhanced,
                      t,
                      doc.name
                     ),
                    };
                    await saveToStore(STORE_ESSAYS, [newEs]);
                    setEssaysLibrary((prev) => [
                     newEs,
                     ...prev,
                    ]);
                    setActiveEssayView(newEs);
                    setSelectedCleanEj2Id(newEs.id);
                   }
                   setEj2SubTab('clean');
                   setActiveModule('04B');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] cursor-pointer"
                  title="Abrir este documento en la Biblioteca Limpia de Desarrollo (04B)"
                 >
                  📖 Abrir en 04B
                 </button>

                 <button
                  onClick={() => {
                   const lit =
                    extractLiteralTestQuestionsFromPdf(
                     doc.text || '',
                     doc.topicId
                    );
                   const qs =
                    lit.length >= 5
                     ? lit
                     : generateMutatedQuestionsFromText(
                       doc.text || '',
                       doc.topicId,
                       15
                      );
                   setQuestionBank((prev) => {
                    const existingTexts = new Set(
                     prev.map((q) =>
                      q.question.trim().toLowerCase()
                     )
                    );
                    const unique = qs.filter(
                     (q) =>
                      !existingTexts.has(
                       q.question.trim().toLowerCase()
                      )
                    );
                    return [...unique, ...prev];
                   });
                   setStatusBanner(
                    `✨ ${qs.length} preguntas de [${doc.topicId}] sincronizadas con el Banco Común.`
                   );
                   setTimeout(() => setStatusBanner(''), 3500);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] cursor-pointer"
                 >
                  ✨ Extraer Preguntas
                 </button>

                 <button
                  onClick={() =>
                   deleteFromStore(STORE_DOCS, doc.id).then(
                    () =>
                     setDocumentsLibrary((prev) =>
                      prev.filter((d) => d.id !== doc.id)
                     )
                   )
                  }
                  className="px-2 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 font-bold cursor-pointer"
                  title="Eliminar este archivo PDF"
                 >
                  🗑️
                 </button>
                </div>
               </div>
              ))}
             </div>
            ) : (
             <div className="p-3 rounded-xl bg-white/60 dark:bg-stone-900/50 border border-dashed text-stone-400 text-xs flex justify-between items-center">
              <span>
               Aún no has subido el PDF Extenso ni la Narración para [{t.id}].
              </span>
              <button
               onClick={() => handleGenerateMagistralTopic(t)}
               className="px-2.5 py-1 rounded-lg bg-[#D97757] text-white font-bold text-[11px] cursor-pointer"
              >
               ✍️ Generar Plantilla Magistral 10/10
              </button>
             </div>
            )}
           </div>
          );
         })}
       </div>
      ) : (
       /* VISTA 3: LISTA PLANA DE ARCHIVOS */
       <div className="space-y-2.5">
        {documentsLibrary.map((doc) => {
         const assignedTopicObj = findTopicAcrossAllCatalogs(
          doc.topicId
         );
         return (
          <div
           key={doc.id}
           className="p-3.5 rounded-xl border text-xs flex flex-col lg:flex-row justify-between lg:items-center gap-2.5 bg-[#FAF8F5] dark:bg-stone-800"
          >
           <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
             <span className="px-2 py-0.5 rounded bg-[#D97757] text-white font-extrabold text-[11px]">
              [{doc.topicId}]
             </span>
             <b className="text-slate-900 dark:text-white">
              {doc.name}
             </b>
             <span className="text-stone-500">·</span>
             <span>
              Aptitud Test:{' '}
              <b>{doc.audit?.ej1TestQualityScore}/10</b>
             </span>
             <span className="text-stone-500">·</span>
             <span
              className={`font-extrabold ${
               String(
                doc.audit?.validityStatus || ''
               ).includes('❌')
                ? 'text-rose-700'
                : 'text-emerald-700 dark:text-emerald-300'
              }`}
             >
              {doc.audit?.validityStatus}
             </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600 dark:text-stone-300">
             <span>📌 Asociado en dataOposiciones.js a:</span>
             <select
              value={doc.topicId || 'E1'}
              onChange={async (e) => {
               const nextId = e.target.value;
               const nextTopicObj =
                findTopicAcrossAllCatalogs(nextId);
               const nextAudit = auditDocumentTextValidity(
                doc.text || '',
                nextTopicObj || nextId,
                doc.name || ''
               );
               const updatedDoc = {
                ...doc,
                topicId: nextId,
                audit: nextAudit,
               };
               setDocumentsLibrary((prev) =>
                prev.map((d) =>
                 d.id === doc.id ? updatedDoc : d
                )
               );
               setEssaysLibrary((prev) =>
                prev.map((es) =>
                 es.id === doc.id ? updatedDoc : es
                )
               );
               await saveToStore(STORE_DOCS, [updatedDoc]);
               await saveToStore(STORE_ESSAYS, [updatedDoc]);
               setStatusBanner(
                `✅ Archivo "${doc.name}" vinculado a [${nextId}] ${nextTopicObj?.title.slice(0, 55)}...`
               );
               setTimeout(() => setStatusBanner(''), 4000);
              }}
              className="px-2 py-0.5 rounded border bg-white dark:bg-stone-900 font-bold text-[11px] cursor-pointer max-w-full sm:max-w-[460px] truncate"
             >
              {activeCatalog.map((t) => (
               <option key={t.id} value={t.id}>
                [{t.id}] {t.title.slice(0, 75)}
               </option>
              ))}
             </select>
             {assignedTopicObj && (
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">
               ({doc.audit?.coherence?.matchScorePct ?? 100}%
               afinidad)
              </span>
             )}
            </div>
           </div>
           <div className="flex gap-2">
            <button
             onClick={() => {
              const qs = generateMutatedQuestionsFromText(
               doc.text,
               doc.topicId,
               15
              );
              setQuestionBank((prev) => [...qs, ...prev]);
              setStatusBanner(
               `✨ 15 preguntas de Mutación Jurídica extraídas de "${doc.name}".`
              );
              setTimeout(() => setStatusBanner(''), 3000);
             }}
             className="px-3 py-1 rounded bg-slate-800 text-white font-bold cursor-pointer"
            >
             ✨ +15 Preguntas Test
            </button>
            <button
             onClick={() =>
              deleteFromStore(STORE_DOCS, doc.id).then(() =>
               setDocumentsLibrary((prev) =>
                prev.filter((d) => d.id !== doc.id)
               )
              )
             }
             className="text-rose-600 font-bold cursor-pointer px-2"
            >
             🗑️
            </button>
           </div>
          </div>
         );
        })}
       </div>
      )}
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 07 · HISTORIAS LÓGICAS, CUENTOS DE CASO Y MNEMOTECNIA      */}
    {/* ================================================================= */}
    {(activeModule === '07' || activeModule === '08') && (
     <div className="mb-4 p-2 rounded-2xl bg-white dark:bg-stone-900 border shadow-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
       {[
        { id: 'all', label: '🗂️ 1. Vista Completa' },
        { id: 'retos', label: '⚡ 2. Solo Micro-Retos 15s' },
        { id: 'glosario', label: '📌 3. Solo Flashcards Glosario' },
        { id: 'cuentos', label: '📖 4. Solo Cuentos / 5 Actos' },
        {
         id: 'grupo',
         label: `👥 5. Grupo de Estudio y Perfiles (${peerReviewQueue.length})`,
        },
       ].map((tab) => {
        const isAct =
         (activeModule === '08' && tab.id === 'grupo') ||
         (activeModule === '07' && memoriaSubTab === tab.id);
        return (
         <button
          key={tab.id}
          onClick={() => {
           setMemoriaSubTab(tab.id);
           setActiveModule('07');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
           isAct
            ? 'bg-[#D97757] text-white shadow-xs'
            : 'bg-[#FAF8F5] dark:bg-stone-800 border text-stone-700 dark:text-stone-300'
          }`}
         >
          {tab.label}
         </button>
        );
       })}
      </div>
     </div>
    )}
    {activeModule === '07' && memoriaSubTab !== 'grupo' && (
     <div className="space-y-6">
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-4 shadow-xs">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-3">
        <div>
         <span className="text-[11px] font-bold text-[#D97757] uppercase">
          07 · SISTEMA DE MEMORIA EPISÓDICA · APRENDIZAJE POR CUENTOS Y LÓGICA SECUENCIAL CAUSA-EFECTO
         </span>
         <h2 className="text-lg font-bold">
          Biblioteca de Historias Lógicas ({storiesLibrary.length}{' '}
          temas convertidos en cuento)
         </h2>
        </div>

        <div className="flex flex-wrap gap-2">
         <input
          type="text"
          placeholder="Buscar por tema, ley o protagonista (ej. E52)..."
          value={storySearch}
          onChange={(e) => setStorySearch(e.target.value)}
          className="px-3 py-1.5 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800"
         />

         <button
          onClick={() => {
           const allGenerated = activeCatalog.map((t) => {
            const matchingDocs = documentsLibrary.filter(
             (d) => d.topicId === t.id
            );
            const existingEssay = essaysLibrary.find(
             (e) => e.topicId === t.id
            );
            const combinedSource =
             matchingDocs.map((d) => d.text || '').join('\n\n') ||
             (existingEssay ? existingEssay.text : '') ||
             t.lawUpdate;
            return buildNarrativeStoryForTopic(t, combinedSource);
           });
           setStoriesLibrary(allGenerated);
           setStatusBanner(
            `⚡ ¡Regenerados los Micro-Retos 15s, Flashcards de Glosario y Cuentos específicos para los ${allGenerated.length} temas oficiales!`
           );
           setTimeout(() => setStatusBanner(''), 5000);
          }}
          className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold cursor-pointer"
         >
          🔄 Regenerar Retos, Flashcards y Cuentos 2026 ({activeCatalog.length} Temas)
         </button>

         <button
          onClick={async () => {
           setStatusBanner(
            '⏳ Generando Libro PDF de Cuentos e Historias Lógicas...'
           );
           try {
            const { jsPDF } = await import(
             'https://esm.sh/jspdf@2.5.1'
            );
            const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
            const pageWidth = 174;
            let y = 20;

            pdf.setFont('times', 'bold');
            pdf.setFontSize(14);
            pdf.text(
             'LIBRO DE HISTORIAS LOGICAS Y CUENTOS DE OPOSICION (2026)',
             18,
             y
            );
            y += 9;

            storiesLibrary.forEach((st, idx) => {
             if (idx > 0) {
              pdf.addPage();
              y = 20;
             }
             pdf.setFont('times', 'bold');
             pdf.setFontSize(12);
             const headLines = pdf.splitTextToSize(
              st.title,
              pageWidth
             );
             pdf.text(headLines, 18, y);
             y += headLines.length * 6 + 2;

             pdf.setFontSize(9.5);
             const chainLines = pdf.splitTextToSize(
              `Cadena Legal: ${st.lawsChain}`,
              pageWidth
             );
             pdf.text(chainLines, 18, y);
             y += chainLines.length * 5 + 3;

             pdf.setFont('times', 'normal');
             pdf.setFontSize(10.5);
             const cleanStory = st.storyText.replace(
              /[^\x20-\x7EÁÉÍÓÚáéíóúÑñÜü¿¡\n.,:;()/-]/g,
              ''
             );
             const bodyLines = pdf.splitTextToSize(
              `${cleanStory}\n\nREGLA CLAVE: ${st.logicHook}`,
              pageWidth
             );
             bodyLines.forEach((line) => {
              if (y > 276) {
               pdf.addPage();
               y = 20;
              }
              pdf.text(line, 18, y);
              y += 5;
             });
            });

            pdf.save('Libro_Historias_Logicas_TS_2026.pdf');
            setStatusBanner(
             '📚 ¡Libro PDF de Historias Lógicas descargado con éxito!'
            );
           } catch (e) {
            console.error(e);
           }
           setTimeout(() => setStatusBanner(''), 4000);
          }}
          className="px-3.5 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold cursor-pointer"
         >
          ⬇ Descargar Libro de Cuentos (.PDF)
         </button>
        </div>
       </div>

       {(() => {
        let totalCards = 0,
         masteredCount = 0,
         reviewCount = 0;
        storiesLibrary.forEach((st) => {
         (st.microRetos || []).forEach((mr) => {
          totalCards++;
          if (flashcardMastery[mr.id] === 'mastered') masteredCount++;
          else if (flashcardMastery[mr.id] === 'review') reviewCount++;
         });
         (st.glosario || []).forEach((g) => {
          totalCards++;
          if (flashcardMastery[g.id] === 'mastered') masteredCount++;
          else if (flashcardMastery[g.id] === 'review') reviewCount++;
         });
        });
        const pendingCount = Math.max(
         0,
         totalCards - masteredCount - reviewCount
        );
        return (
         <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
           <span className="font-extrabold text-slate-700 dark:text-stone-200">
            📊 Progreso Global de Tarjetas (Retos 15s + Glosario):
           </span>
           <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
            ✅ Dominadas: {masteredCount}
           </span>
           <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold">
            🔁 Para Repasar: {reviewCount}
           </span>
           <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-bold">
            📌 Nuevas/Pendientes: {pendingCount}
           </span>
          </div>
          <button
           onClick={() =>
            setOnlyReviewFlashcards(!onlyReviewFlashcards)
           }
           className={`px-3 py-1 rounded-lg font-extrabold cursor-pointer transition ${
            onlyReviewFlashcards
             ? 'bg-rose-700 text-white'
             : 'bg-white dark:bg-stone-900 border text-rose-800 dark:text-rose-300'
           }`}
          >
           {onlyReviewFlashcards
            ? '🔎 Viendo solo Pendientes/Repaso · Ver Todas'
            : '🔁 Ocultar las ya Dominadas (Repaso Focalizado)'}
          </button>
         </div>
        );
       })()}

       <div className="grid grid-cols-1 gap-4">
        {storiesLibrary
         .filter(
          (s) =>
           !storySearch.trim() ||
           s.title.toLowerCase().includes(storySearch.toLowerCase()) ||
           s.storyText.toLowerCase().includes(storySearch.toLowerCase())
         )
         .map((st) => (
          <div
           key={st.id}
           className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-3 shadow-2xs"
          >
           <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-2">
            <span className="text-sm font-extrabold text-[#D97757]">
             {st.title}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
             <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-[11px]">
              🔗 Leyes: {st.lawsChain}
             </span>
             <button
              onClick={() =>
               openTribunalPublicReader(st.title, st.storyText)
              }
              className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] cursor-pointer"
              title="Abrir temporizador de lectura en voz alta para esta narración"
             >
              🎙️ Temporizador Lectura
             </button>
             <button
              onClick={() => {
               setStoriesLibrary((prev) =>
                prev.filter((item) => item.id !== st.id)
               );
               setStatusBanner(
                `🗑️ Historia de [${st.topicId}] eliminada.`
               );
               setTimeout(() => setStatusBanner(''), 3000);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-700 hover:text-white text-rose-800 font-extrabold text-[11px] cursor-pointer"
              title="Borrar esta historia"
             >
              🗑️ Borrar
             </button>
            </div>
           </div>

           {(memoriaSubTab === 'all' ||
            memoriaSubTab === 'cuentos') && (
            <>
             <div className="flex flex-wrap justify-between items-center gap-2 text-[11px] text-stone-600 dark:text-stone-300 font-semibold">
              <span>
               🧭 <b>Secuencia lógica del tema:</b>{' '}
               {st.epigraphOrder}
              </span>
              <button
               onClick={() =>
                setCollapsedStories((p) => ({
                 ...p,
                 [st.id]: !p[st.id],
                }))
               }
               className="px-2.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-[10px] cursor-pointer"
              >
               {collapsedStories[st.id]
                ? '🔽 Desplegar Cuento / 5 Actos'
                : '🔼 Plegar Texto Largo'}
              </button>
             </div>

             {!collapsedStories[st.id] && (
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border font-serif text-xs leading-relaxed whitespace-pre-line">
               {st.storyText}
              </div>
             )}

             <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-950 dark:text-emerald-200 text-[11px]">
              <b>💡 Acrónimo / Anclaje Mnemotécnico de Examen:</b>{' '}
              {st.logicHook}
             </div>
            </>
           )}

           {(memoriaSubTab === 'all' ||
            memoriaSubTab === 'retos') &&
            st.microRetos &&
            st.microRetos.length > 0 && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-300 space-y-2">
             <span className="text-[11px] font-extrabold text-indigo-900 dark:text-indigo-200 uppercase block">
              ⚡ MICRO-RETOS DE REPASO RÁPIDO EN 15 SEGUNDOS (FREE RECALL SIN OPCIONES · PULSA PARA REVELAR Y AUTO-EVALUAR)
             </span>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {st.microRetos
               .filter(
                (mr) =>
                 !onlyReviewFlashcards ||
                 flashcardMastery[mr.id] !== 'mastered'
               )
               .map((mr) => {
               const isRev = !!revealedRetos[mr.id];
               const mState = flashcardMastery[mr.id];
               return (
                <div
                 key={mr.id}
                 onClick={() =>
                  setRevealedRetos((prev) => ({
                   ...prev,
                   [mr.id]: !prev[mr.id],
                  }))
                 }
                 className={`p-2.5 rounded-xl bg-white dark:bg-stone-900 border cursor-pointer transition text-xs space-y-1.5 ${
                  mState === 'mastered'
                   ? 'border-emerald-500 ring-1 ring-emerald-400/50'
                   : mState === 'review'
                   ? 'border-rose-400 ring-1 ring-rose-400/50'
                   : 'border-indigo-200 hover:border-indigo-500'
                 }`}
                >
                 <div className="flex justify-between items-start gap-2">
                  <b className="text-indigo-950 dark:text-indigo-200">
                   ❓ Reto {mr.num}: {mr.question}
                  </b>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold shrink-0">
                   {mState === 'mastered'
                    ? '✅ Dominado'
                    : mState === 'review'
                    ? '🔁 Repasar'
                    : isRev
                    ? '🙈 Ocultar'
                    : '👁️ Ver'}
                  </span>
                 </div>
                 {isRev && (
                  <div className="pt-1.5 border-t border-indigo-100 space-y-2">
                   <p className="text-emerald-800 dark:text-emerald-300 font-semibold">
                    ✔ {mr.answer}
                   </p>
                   <div
                    className="flex gap-1.5"
                    onClick={(ev) => ev.stopPropagation()}
                   >
                    <button
                     onClick={() => {
                      touchTopicReviewDate(st.topicId);
                      setFlashcardMastery((p) => ({
                       ...p,
                       [mr.id]: 'mastered',
                      }));
                     }}
                     className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-700 hover:text-white text-emerald-900 font-bold text-[10px] cursor-pointer"
                    >
                     ✅ Me la sabía
                    </button>
                    <button
                     onClick={() =>
                      setFlashcardMastery((p) => ({
                       ...p,
                       [mr.id]: 'review',
                      }))
                     }
                     className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-700 hover:text-white text-rose-900 font-bold text-[10px] cursor-pointer"
                    >
                     🔁 Repasar mañana
                    </button>
                   </div>
                  </div>
                 )}
                </div>
               );
              })}
             </div>
            </div>
           )}

           {(memoriaSubTab === 'all' || memoriaSubTab === 'glosario') && st.glosario && st.glosario.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 space-y-2">
             <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200 uppercase block">
              🗂️ TARJETAS FLASH · GLOSARIO TÉCNICO-JURÍDICO EXACTO PARA EL TRIBUNAL (TOCA CADA CONCEPTO PARA GIRAR)
             </span>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {st.glosario
               .filter(
                (g) =>
                 !onlyReviewFlashcards ||
                 flashcardMastery[g.id] !== 'mastered'
               )
               .map((g) => {
               const isFlipped = !!flippedGlossary[g.id];
               const gState = flashcardMastery[g.id];
               return (
                <div
                 key={g.id}
                 onClick={() =>
                  setFlippedGlossary((prev) => ({
                   ...prev,
                   [g.id]: !prev[g.id],
                  }))
                 }
                 className={`p-3 rounded-xl border cursor-pointer transition text-xs flex flex-col justify-between ${
                  isFlipped
                   ? 'bg-emerald-900 text-white border-emerald-700 shadow-xs'
                   : gState === 'mastered'
                   ? 'bg-emerald-50 dark:bg-stone-900 border-emerald-500'
                   : gState === 'review'
                   ? 'bg-rose-50 dark:bg-stone-900 border-rose-400'
                   : 'bg-white dark:bg-stone-900 border-amber-300 hover:border-[#D97757]'
                 }`}
                >
                 <div className="flex justify-between items-center gap-1">
                  <span className="font-extrabold">
                   {gState === 'mastered'
                    ? '✅ '
                    : gState === 'review'
                    ? '🔁 '
                    : '📌 '}
                   {g.term}
                  </span>
                  <span className="text-[10px] opacity-75 shrink-0">
                   {isFlipped ? '↺ Definición' : '👆 Girar'}
                  </span>
                 </div>
                 {isFlipped && (
                  <div className="mt-1.5 pt-1.5 border-t border-white/20 space-y-2">
                   <p className="text-[11px] leading-relaxed">
                    {g.definition}
                   </p>
                   <div
                    className="flex gap-1.5 pt-1"
                    onClick={(ev) => ev.stopPropagation()}
                   >
                    <button
                     onClick={() => {
                      touchTopicReviewDate(st.topicId);
                      setFlashcardMastery((p) => ({
                       ...p,
                       [g.id]: 'mastered',
                      }));
                     }}
                     className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[10px] cursor-pointer border border-white/30"
                    >
                     ✅ Dominada
                    </button>
                    <button
                     onClick={() =>
                      setFlashcardMastery((p) => ({
                       ...p,
                       [g.id]: 'review',
                      }))
                     }
                     className="px-2 py-0.5 rounded bg-rose-700 hover:bg-rose-600 text-white font-bold text-[10px] cursor-pointer border border-white/30"
                    >
                     🔁 Repasar
                    </button>
                   </div>
                  </div>
                 )}
                </div>
               );
              })}
             </div>
            </div>
           )}
          </div>
         ))}
       </div>
      </div>
     </div>
    )}

    {/* ================================================================= */}
    {/* MÓDULO 08 · GRUPO DE ESTUDIO Y PERFILES AISLADOS                  */}
    {/* ================================================================= */}
    {(activeModule === '08' || (activeModule === '07' && memoriaSubTab === 'grupo')) && (
     <div className="space-y-6">
      <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-4">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-3">
        <div>
         <h2 className="text-lg font-bold">
          08 · Perfiles Aislados y Sincronización del Grupo de Estudio
         </h2>
         <p className="text-xs text-stone-500">
          Tus notas, fallos, cajas Leitner y progreso por tema son
          100% privados en tu perfil. El paquete JSON solo comparte y
          fusiona sin duplicados las preguntas del grupo.
         </p>
        </div>
        <div className="flex flex-wrap gap-2">
         <button
          onClick={exportGroupPackageJson}
          className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer"
         >
          ⬇ Exportar Paquete de Grupo (.json)
         </button>
         <label className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer">
          🤝 Sincronizar Paquete de Amiga
          <input
           type="file"
           accept=".json"
           onChange={(e) => {
            importGroupPackageJson(e.target.files?.[0]);
            e.target.value = '';
           }}
           className="hidden"
          />
         </label>
        </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(PROFILES).map((p) => (
         <div
          key={p.id}
          onClick={() => switchUserProfile(p.id)}
          className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
           activeProfile === p.id
            ? 'bg-[#D97757]/15 border-[#D97757]'
            : 'bg-[#FAF8F5] dark:bg-stone-800'
          }`}
         >
          <div className="flex justify-between items-center mb-2">
           <input
            type="text"
            value={customNames[p.id]}
            onClick={(ev) => ev.stopPropagation()}
            onChange={(ev) =>
             setCustomNames({
              ...customNames,
              [p.id]: ev.target.value,
             })
            }
            className="font-extrabold text-sm bg-white dark:bg-stone-900 border rounded px-2 py-0.5 w-36"
           />
           {activeProfile === p.id && (
            <span className="px-2 py-0.5 rounded bg-[#D97757] text-white text-[10px] font-bold">
             Sesión Activa
            </span>
           )}
          </div>
          <p className="text-[11px] font-bold text-[#D97757]">
           {p.role}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">{p.desc}</p>
         </div>
        ))}
       </div>

       {peerReviewQueue.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2 text-xs">
         <div className="flex justify-between items-center">
          <span className="font-bold text-amber-950">
           Bandeja de Revisión por Pares ({peerReviewQueue.length}{' '}
           propuestas pendientes)
          </span>
          <button
           onClick={() => {
            setQuestionBank((prev) => [
             ...peerReviewQueue,
             ...prev,
            ]);
            setPeerReviewQueue([]);
            setStatusBanner(
             '✔ Todas las propuestas de tus compañeras han sido validadas e incorporadas al Banco Común.'
            );
            setTimeout(() => setStatusBanner(''), 4000);
           }}
           className="px-3 py-1.5 rounded bg-emerald-700 text-white font-bold cursor-pointer"
          >
           ✔ Validar e Incorporar Todas al Banco Común
          </button>
         </div>
        </div>
       )}
      </div>
     </div>
    )}
   </main>
  </div>
 );
}
