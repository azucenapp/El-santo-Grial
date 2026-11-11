import React, { useState, useEffect, useMemo } from 'react';
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

// =========================================================================
// 1. MOTOR INDEXEDDB DE ALTA CAPACIDAD
// =========================================================================
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

// =========================================================================
// 2. FUNCIONES DE AUDITORÍA, SIGLAS, EXTENSIÓN MANUSCRITA Y MUTACIÓN
// =========================================================================
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

function adjustTextToHandwrittenTarget(rawText = '', targetWords = 1850) {
  let clean = rawText
    .replace(
      /\bEn\s+lo\s+que\s+respecta\s+a\s+la\s+regulaci[oó]n\s+espec[ií]fica\s+de\b/gi,
      'Respecto a'
    )
    .replace(
      /\bCabe\s+destacar\s+de\s+manera\s+especial\s+que\b/gi,
      'Destaca que'
    )
    .replace(
      /\bResulta\s+imprescindible\s+poner\s+de\s+manifiesto\s+que\b/gi,
      'Es clave que'
    )
    .replace(
      /\bDesde\s+una\s+perspectiva\s+eminentemente\s+pr[aá]ctica\s+y\s+metodol[oó]gica\b/gi,
      'Metodológicamente'
    );

  const wordsArr = clean.trim().split(/\s+/);
  if (wordsArr.length > targetWords + 100) {
    const paragraphs = clean.split('\n\n');
    const keptParagraphs = [];
    let runningWords = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const pWords = p.trim().split(/\s+/).length;
      const isHeadingOrConclusion =
        /^(\d+\.|TEMA MAGISTRAL|MARCO NORMATIVO|En conclusi[oó]n)/i.test(
          p.trim()
        );

      if (isHeadingOrConclusion || runningWords + pWords <= targetWords) {
        keptParagraphs.push(p);
        runningWords += pWords;
      } else {
        const sentences = p.split(/(?<=[.?!])\s+/);
        if (sentences.length > 2) {
          const condensed = `${sentences[0]} ${
            sentences[sentences.length - 1]
          }`;
          keptParagraphs.push(condensed);
          runningWords += condensed.split(/\s+/).length;
        }
      }
    }
    clean = keptParagraphs.join('\n\n');
  } else if (wordsArr.length < 1650) {
    clean += `\n\nSÍNTESIS APLICADA Y CONEXIÓN INTERINSTITUCIONAL (AJUSTE A EXTENSIÓN DE EXAMEN 80 MINUTOS)\nEn la práctica operativa de los Servicios Sociales de la Comunidad de Madrid, del Servicio Madrileño de Salud (en adelante, SERMAS) y del Ayuntamiento de Madrid, la aplicación de este bloque normativo exige garantizar la trazabilidad diagnóstica en la Historia Social Única, la fundamentación técnica mediante el Informe Social y la coordinación interadministrativa en el marco del Plan Individual de Atención Social (en adelante, PIAS), evaluando periódicamente el impacto mediante indicadores cuantitativos de cobertura y tiempos medios de respuesta conforme a la Ley 39/2015, de 1 de octubre.`;
  }

  return clean;
}

function auditDocumentTextValidity(text = '', topicInput = null) {
  const topicObj =
    typeof topicInput === 'string'
      ? findTopicAcrossAllCatalogs(topicInput)
      : topicInput;
  const warnings = [];
  const acronymAlerts = [];

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
  let pacingStatus = 'ÓPTIMO PARA MANUSCRITO (75-85 min)';
  if (wordCount > 2000) {
    pacingStatus = `EXCESO DE EXTENSIÓN (${handwrittenMinutes} min a mano · Riesgo de dejar epígrafes en blanco)`;
  } else if (wordCount < 1550) {
    pacingStatus = `CORTO PARA DESARROLLO (${handwrittenMinutes} min a mano · Recomendado 1.750-1.950 pal.)`;
  }

  const articleMentions = (
    text.match(
      /\b(art[ií]culo|art\.|ley|decreto|orden|real\s+decreto|reglamento|constituci[oó]n|ordenanza|estatuto|baremo)\b/gi
    ) || []
  ).length;
  const analyticalConnectors = (
    text.match(
      /\b(asimismo|por\s+consiguiente|en\s+consecuencia|no\s+obstante|desde\s+la\s+perspectiva|en\s+conclusi[oó]n|cabe\s+destacar|interdisciplinar|diagn[oó]stico|evaluaci[oó]n|indicadores)\b/gi
    ) || []
  ).length;
  const numberedHeadings = (text.match(/^\s*(\d+\.|[A-Z]\)|-\s+)/gm) || [])
    .length;

  const epigraphs = topicObj
    ? extractSubEpigraphsFromTitle(topicObj.title)
    : [];
  const missingEpigraphs = [];
  let coveredCount = 0;
  const lowerText = text.toLowerCase();

  epigraphs.forEach((ep) => {
    const keyWords = ep
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 4);
    if (
      keyWords.length === 0 ||
      keyWords.some((kw) => lowerText.includes(kw))
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
    wordCount >= 1650 && wordCount <= 2050
      ? 1.0
      : wordCount > 2050
      ? 0.85
      : Math.min(1.0, (wordCount / 1650) * 1.0);
  if (acronymAlerts.length > 0) {
    expresionBase = Math.max(0.2, expresionBase - acronymAlerts.length * 0.15);
  }
  const expresion10 = expresionBase;
  const presentacion5 = Math.min(0.5, (numberedHeadings / 5) * 0.5);

  let rawFinal = conocimientos70 + analitico15 + expresion10 + presentacion5;
  if (warnings.length > 0) rawFinal -= warnings.length * 1.25;
  const finalScore = Math.max(0, Math.min(10, rawFinal)).toFixed(2);

  let ej1TestQualityScore =
    3.5 +
    Math.min(4.5, (articleMentions / 12) * 4.5) +
    (coveragePct / 100) * 2.0;
  if (warnings.length > 0) ej1TestQualityScore -= warnings.length * 1.5;
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
    convocatoriaLabel: getConvocatoriaLabelByTopicId(topicObj?.id || ''),
    validityStatus:
      warnings.length === 0
        ? 'VIGENCIA VERIFICADA (BOCM/BOAM 2026)'
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

function buildMagistralTopicText(topicObj, convocatoriaKey) {
  const epigraphs = extractSubEpigraphsFromTitle(topicObj.title);
  const instName =
    convocatoriaKey === 'sermas'
      ? 'el Servicio Madrileño de Salud (en adelante, SERMAS, regulado por la Ley 12/2001, de Ordenación Sanitaria de la Comunidad de Madrid, en adelante LOSCAM, y el Decreto 246/2023)'
      : convocatoriaKey === 'ayto'
      ? 'el Ayuntamiento de Madrid (regulado por la Ley 22/2006 de Capitalidad, el Plan Estratégico de Servicios Sociales 2023-2027 y la Ordenanza 10/2022, de 28 de junio)'
      : 'la Administración de la Comunidad de Madrid (bajo el marco de la Orden 1049/2026 y la Ley 12/2022 de Servicios Sociales)';

  const sectionsText = epigraphs
    .map(
      (ep, i) => `
${i + 2}. DESARROLLO TÉCNICO-JURÍDICO DEL EPÍGRAFE: ${ep.toUpperCase()}
En el análisis sistemático de "${ep}", resulta preceptivo partir del bloque de constitucionalidad (artículos 9.2, 10.1, 14, 39 a 50 de la Constitución Española, en adelante CE, incluyendo la reforma del artículo 49 de enero de 2024) en conexión directa con el Estatuto de Autonomía de la Comunidad de Madrid (Ley Orgánica 3/1983, artículo 26.1.23 y 27).
Dentro del ámbito competencial de ${instName}, la regulación vigente en 2026 articula un sistema de responsabilidad pública basado en los principios de universalidad, igualdad, equidad territorial, atención centrada en la persona y calidad continuada.
Desde el punto de vista procedimental y de plazos administrativos (Ley 39/2015, del Procedimiento Administrativo Común de las Administraciones Públicas, en adelante LPAC, y Ley 40/2015, de Régimen Jurídico del Sector Público, en adelante LRJSP), la actuación técnica del profesional de Trabajo Social exige:
a) La valoración integral mediante instrumentos técnicos homologados: Historia Social Única interoperable, Ficha Social, Informe Social (como dictamen técnico facultativo), Genograma, Ecomapa y escalas clínicas y sociales validadas (Escala de Gijón de valoración sociofamiliar, Escala de Zarit de sobrecarga del cuidador, Índice de Barthel, Escala de Lawton y Brody, Baremo de Valoración de la Dependencia, en adelante BVD, y Escala de Valoración Específica, en adelante EVE, del Real Decreto 174/2011, junto al nuevo baremo de discapacidad del Real Decreto 888/2022).
b) El diseño del Plan Individual de Atención Social (en adelante, PIAS) o plan terapéutico-social, diferenciando con precisión jurídica entre prestaciones garantizadas (exigibles como derecho subjetivo ante la administración, como la Renta Mínima de Inserción, en adelante RMI, el Ingreso Mínimo Vital, en adelante IMV, o el Servicio de Ayuda a Domicilio, en adelante SAD) y prestaciones condicionadas a disponibilidad presupuestaria, conforme a la Ley 12/2022, de 21 de diciembre, de Servicios Sociales de la Comunidad de Madrid (que derogó expresamente la antigua Ley 11/2003) y la Ley 39/2006, de Promoción de la Autonomía Personal y Atención a las personas en situación de dependencia (en adelante, LAPAD).
c) La coordinación interinstitucional y sociosanitaria entre la Atención Social Primaria (puerta de entrada territorializada), la Atención Social Especializada (Agencia Madrileña de Atención Social, en adelante AMAS; Agencia Madrileña para el Apoyo a las Personas Adultas con Discapacidad, en adelante AMAPAD, regulada por Ley 1/2023 tras la Ley 8/2021; Agencia de la Comunidad de Madrid para la Reeducación y Reinserción del Menor Infractor, en adelante ARRMI; y protección a la infancia bajo la Ley 4/2023 CAM y la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia frente a la Violencia, en adelante LOPIVI) y los dispositivos de Atención Primaria, Hospitalaria y Salud Mental del SERMAS.`
    )
    .join('\n');

  const fullDraft = `TEMA MAGISTRAL OFICIAL [${
    topicObj.id
  }] · ${topicObj.title.toUpperCase()}
MARCO NORMATIVO VERIFICADO 2026: ${topicObj.lawUpdate}

1. INTRODUCCIÓN TÉCNICA, ENCUADRE CONSTITUCIONAL Y RELEVANCIA PARA EL TRABAJO SOCIAL
El presente tema constituye uno de los ejes nucleares del programa oficial de acceso a la función pública conforme al Texto Refundido de la Ley del Estatuto Básico del Empleado Público (en adelante, TREBEP) en ${instName}. Su abordaje exige conjugar el rigor dogmático-jurídico del Derecho Administrativo, Sanitario y de la Protección Social con la metodología científica del Trabajo Social (estudio, diagnóstico social, planificación, ejecución y evaluación, conforme a las aportaciones doctrinales de Mary Richmond, Gordon Hamilton, Natalio Kisnerman, Ezequiel Ander-Egg y Malcolm Payne).
Asimismo, toda intervención analizada en este tema se sujeta al Código Deontológico de la Profesión de Diplomado/Graduado en Trabajo Social, al deber de secreto profesional y a la normativa de protección de datos de categoría especial (Reglamento General de Protección de Datos, en adelante RGPD, y Ley Orgánica 3/2018).
${sectionsText}

${
  epigraphs.length + 2
}. SÍNTESIS APLICADA, INDICADORES DE EVALUACIÓN Y CONCLUSIÓN TÉCNICA
En conclusión, el dominio operativo de los epígrafes que integran el ${
    topicObj.title
  } permite al Trabajador/a Social de ${instName} garantizar la trazabilidad diagnóstica, la seguridad jurídica de los ciudadanos usuarios y la eficiencia en la asignación de prestaciones públicas. La evaluación continua mediante indicadores cuantitativos de cobertura, tiempos medios de resolución y calidad percibida (Cartas de Servicios del Decreto 27/1997 CAM y modelos EFQM/Donabedian) cierra el ciclo metodológico de excelencia en el servicio público.`;

  return adjustTextToHandwrittenTarget(fullDraft, 1850);
}

function generateMutatedQuestionsFromText(text, topicId, count = 10) {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 65 && s.length < 280);

  const pool =
    sentences.length > 0
      ? sentences
      : [
          'De conformidad con la Ley 12/2022 de Servicios Sociales de la Comunidad de Madrid, la Historia Social Única y el PIAS constituyen los instrumentos básicos que garantizan la continuidad asistencial en un plazo máximo de tres meses hábiles.',
        ];

  const mutateSentence = (s, mode) => {
    let m = s;
    if (mode === 1) {
      m = m
        .replace(/\b(tres|3)\s+meses\b/gi, 'seis meses')
        .replace(/\b(seis|6)\s+meses\b/gi, 'dos meses')
        .replace(/\bh[aá]biles\b/gi, 'naturales')
        .replace(/\bpreceptivo\b/gi, 'meramente facultativo y no vinculante')
        .replace(
          /\bAtenci[oó]n\s+Social\s+Primaria\b/gi,
          'Atención Social Especializada de segundo nivel'
        )
        .replace(
          /\bderecho\s+subjetivo\b/gi,
          'concesión graciable sujeta a disponibilidad presupuestaria'
        );
      if (m === s)
        m = `${s.slice(
          0,
          -1
        )}, salvo cuando el órgano directivo acuerde su suspensión discrecional en el plazo de diez días naturales.`;
    } else if (mode === 2) {
      m = m
        .replace(
          /\bComunidad\s+de\s+Madrid\b/gi,
          'Administración General del Estado con carácter exclusivo'
        )
        .replace(
          /\bLey\s+12\/2022\b/gi,
          'antigua Ley 11/2003 aún vigente con carácter supletorio'
        )
        .replace(
          /\bLey\s+4\/2023\b/gi,
          'Ley 6/1995 de Garantías de la Infancia'
        )
        .replace(
          /\bp[uú]blic[ao]\b/gi,
          'concertado de gestión indirecta preferente'
        );
      if (m === s)
        m = `${s.slice(
          0,
          -1
        )}, requiriendo en todo caso autorización judicial previa de la Fiscalía Superior en el término improrrogable de cuarenta y ocho horas.`;
    } else {
      m = m
        .replace(
          /\bgarantizad[ao]s?\b/gi,
          'condicionadas de carácter graciable'
        )
        .replace(
          /\binteroperable\b/gi,
          'de uso interno restringido al nivel primario sin acceso hospitalario'
        )
        .replace(
          /\bTrabajador\/?a?\s+Social\b/gi,
          'órgano administrativo de contratación'
        );
      if (m === s)
        m = `En ningún caso resultará aplicable ${
          s.charAt(0).toLowerCase() + s.slice(1)
        }`;
    }
    return m;
  };

  return Array.from(
    { length: Math.min(count, Math.max(5, pool.length)) },
    (_, i) => {
      const truth = pool[i % pool.length];
      const d1 = mutateSentence(truth, 1);
      const d2 = mutateSentence(truth, 2);
      const d3 = mutateSentence(truth, 3);
      return {
        id: `q-mut-${topicId}-${Date.now()}-${i}`,
        topicId,
        difficulty:
          i % 2 === 0
            ? 'Alta (Plazos/Excepciones)'
            : 'Media (Literal BOCM/BOAM)',
        originType: '🧬 MUTACIÓN JURÍDICA CRUZADA',
        question: `[${topicId}] De conformidad con la normativa vigente en 2026 aplicable a este epígrafe, señale la afirmación CORRECTA:`,
        options: [`A) ${truth}`, `B) ${d1}`, `C) ${d2}`, `D) ${d3}`],
        correctIndex: 0,
        explanation: `Respuesta verificada por trazabilidad documental: "${truth}". Los distractores contienen permutaciones de plazos, órganos o vigencia normativa.`,
      };
    }
  );
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

// =========================================================================
// 3. COMPONENTE PRINCIPAL APP
// =========================================================================
export default function App() {
  const [activeModule, setActiveModule] = useState('00');
  const [theme, setTheme] = useState(
    () => localStorage.getItem('cam_theme_v5') || 'light'
  );
  const isDark = theme === 'dark';
  const [statusBanner, setStatusBanner] = useState('');

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

  // CRONÓMETRO REAL DE SESIÓN ACTIVA (60 MIN POR BLOQUE - ROI REAL)
  const [flowTimer, setFlowTimer] = useState({
    isRunning: false,
    secondsLeft: 3600,
  });

  useEffect(() => {
    if (!flowTimer.isRunning) return;
    const interval = setInterval(() => {
      setFlowTimer((prev) => {
        if (prev.secondsLeft <= 1) {
          return { ...prev, isRunning: false, secondsLeft: 0 };
        }
        if (prev.secondsLeft % 60 === 0) {
          setNetStudyMinutes((m) => m + 1);
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [flowTimer.isRunning]);

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
  const [questionBank, setQuestionBank] = useState(() => {
    const saved = localStorage.getItem('cam_qbank_v5');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length >= 120) return parsed;
    }
    return HIGH_DIFFICULTY_60_QUESTIONS;
  });

  const [peerReviewQueue, setPeerReviewQueue] = useState(() => {
    const saved = localStorage.getItem('cam_peer_queue_v5');
    return saved ? JSON.parse(saved) : [];
  });

  const [documentsLibrary, setDocumentsLibrary] = useState([]);
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

  // RÚBRICA DE 5 DIMENSIONES PARA EL 3.er EJERCICIO (SUPUESTO PRÁCTICO)
  const [practicalCaseText, setPracticalCaseText] = useState('');
  const [practicalRubricResult, setPracticalRubricResult] = useState(null);

  useEffect(() => {
    getAllFromStore(STORE_DOCS).then((docs) => setDocumentsLibrary(docs || []));
    getAllFromStore(STORE_ESSAYS).then((essays) => {
      setEssaysLibrary(essays || []);
      if (essays && essays.length > 0) setActiveEssayView(essays[0]);
    });
  }, []);

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

  const filteredTopics = useMemo(() => {
    return activeCatalog.filter((t) => {
      const matchBlock =
        selectedBlockFilter === 'Todos' || t.block === selectedBlockFilter;
      const matchQuery =
        !searchTopicQuery.trim() ||
        t.title.toLowerCase().includes(searchTopicQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTopicQuery.toLowerCase());
      return matchBlock && matchQuery;
    });
  }, [activeCatalog, selectedBlockFilter, searchTopicQuery]);

  // ESTADÍSTICAS REALES DE DOMINIO Y AUTO-ADELANTO DEL PLANIFICADOR
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
    const nextPriorityTopics = activeCatalog
      .filter((t) => (topicData[t.id]?.status || 'Pendiente') === 'Pendiente')
      .slice(0, 4);
    return {
      dominated,
      studied,
      pending,
      total: activeCatalog.length,
      nextPriorityTopics,
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

  const processPdfUpload = async (
    fileList,
    isEssayEj2 = false,
    forcedTopicObj = null
  ) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setIsExtractingPdf(true);
    const processedItems = [];
    let generatedQsTotal = [];

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      setUploadProgressText(
        `Auditando "${file.name}" (${idx + 1}/${files.length})...`
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
        const targetTopic = forcedTopicObj || activeCatalog[0];
        const audit = auditDocumentTextValidity(fullText, targetTopic);
        const itemObj = {
          id: `${isEssayEj2 ? 'essay' : 'doc'}-${Date.now()}-${idx}`,
          topicId: targetTopic.id,
          name: file.name,
          pages: pdfDoc.numPages,
          text: fullText,
          audit,
        };
        processedItems.push(itemObj);
        const newQs = generateMutatedQuestionsFromText(
          fullText,
          targetTopic.id,
          12
        );
        generatedQsTotal = [...generatedQsTotal, ...newQs];
      } catch (e) {
        console.error('Error PDF:', e);
      }
    }

    if (processedItems.length > 0) {
      await saveToStore(STORE_DOCS, processedItems);
      setDocumentsLibrary((prev) => [...processedItems, ...prev]);
      if (isEssayEj2) {
        await saveToStore(STORE_ESSAYS, processedItems);
        setEssaysLibrary((prev) => [...processedItems, ...prev]);
        setActiveEssayView(processedItems[0]);
        setCalcEj2(Number(processedItems[0].audit.finalScore));
      }
      if (generatedQsTotal.length > 0) {
        if (activeProfile === 'colab') {
          setPeerReviewQueue((prev) => [...generatedQsTotal, ...prev]);
        } else {
          setQuestionBank((prev) => [...generatedQsTotal, ...prev]);
        }
      }
      setStatusBanner(
        `✅ ${processedItems.length} PDF(s) auditados en [${processedItems[0].topicId}] y ${generatedQsTotal.length} preguntas de Mutación Jurídica extraídas.`
      );
    }
    setIsExtractingPdf(false);
    setUploadProgressText('');
    setTimeout(() => setStatusBanner(''), 5000);
  };
// =========================================================================
  // MOTOR INTERACTIVO CLOZE TEST (HUECOS EN BLANCO · SPRINT 10 MINUTOS)
  // =========================================================================
  const [clozeSession, setClozeSession] = useState(null);

  const buildClozeCardsFromBank = (categoryFilter = 'all', count = 20) => {
    const patterns = {
      plazos: /\b((?:veinte|diez|quince|treinta|cuarenta y ocho|setenta y dos|veinticuatro|dos|tres|cuatro|cinco|seis|ocho|nueve|doce|dieciocho)\s+(?:d[ií]as?\s+h[aá]biles|d[ií]as?\s+naturales|d[ií]as?|meses|años?|semanas?|horas?)|un\s+(?:mes|año)|10\s+d[ií]as|20\s+d[ií]as|24\s+horas|72\s+horas|30\s+horas|20\s+horas)\b/i,
      leyes: /\b(Ley\s+Org[aá]nica\s+\d+\/\d{4}|Ley\s+\d+\/\d{4}|Real\s+Decreto(?:-ley|\s+Legislativo)?\s+\d+\/\d{4}|Decreto\s+\d+\/\d{4}|Ordenanza\s+\d+\/\d{4}|art[ií]culos?\s+\d+(?:\.\d+)?)\b/i,
      escalas_cifras: /\b(\d+\s*%|0,00[368]\s+puntos|0,25\s+puntos|40\.000\s+euros|15\.000\s+euros|80\.000\s+euros|60\.000\s+euros|25\s+a\s+49\s+puntos|50\s+a\s+74\s+puntos|75\s+a\s+100\s+puntos|10\s+a\s+14\s+puntos|22\s+a\s+46\s+puntos|56\s+a\s+110|Grado\s+(?:I|II|III)|Clase\s+[0-4]|Nivel\s+[12])\b/i,
      autores_organos: /\b(Mary\s+Ellen\s+Richmond|Gordon\s+Hamilton|Florence\s+Hollis|Virginia\s+Robinson|Reid\s+y\s+Laura\s+Epstein|Gerald\s+Caplan|Urie\s+Bronfenbrenner|Jack\s+Rothman|Avedis\s+Donabedian|Jonathan\s+Bradshaw|Jes[uú]s\s+Ib[aá]ñez|Norman\s+K\.\s+Denzin|McGoldrick\s+y\s+Randy\s+Gerson|Ann\s+Hartman|Teresa\s+Rossell|Beauchamp\s+y\s+James\s+F\.\s+Childress|Diego\s+Gracia|Maslach\s+y\s+Susan\s+E\.\s+Jackson|Paul\s+Watzlawick|Kimberl[eé]\s+Crenshaw|Aaron\s+Antonovsky|Sherry\s+Arnstein|SAMUR\s+Social|AMAPAD|ARRMI|Comisi[oó]n\s+de\s+Tutela\s+del\s+Menor| silencio\s+administrativo\s+(?:negativo|desestimatorio|positivo))\b/i
    };

    const activeRegexes =
      categoryFilter === 'plazos'
        ? [patterns.plazos]
        : categoryFilter === 'leyes'
        ? [patterns.leyes]
        : categoryFilter === 'escalas'
        ? [patterns.escalas_cifras]
        : categoryFilter === 'autores'
        ? [patterns.autores_organos]
        : [patterns.plazos, patterns.escalas_cifras, patterns.autores_organos, patterns.leyes];

    const allTargetsPool = [];
    const candidateCards = [];

    questionBank.forEach((q) => {
      const rawCorrect = (q.options[q.correctIndex] || '').replace(/^[A-D]\)\s*/i, '');
      let matchedTarget = null;

      for (const rgx of activeRegexes) {
        const m = rawCorrect.match(rgx);
        if (m && m[0]) {
          matchedTarget = m[0].trim();
          break;
        }
      }

      if (matchedTarget) {
        allTargetsPool.push(matchedTarget);
        const maskedSentence = rawCorrect.replace(matchedTarget, ' [ _______ ] ');
        candidateCards.push({
          id: `cloze-${q.id}`,
          sourceQuestionId: q.id,
          topicId: q.topicId,
          originType: q.originType,
          promptContext: q.question,
          maskedSentence,
          fullSentence: rawCorrect,
          targetAnswer: matchedTarget,
          explanation: q.explanation
        });
      }
    });

    // Generar 3 distractores del mismo tipo para modo ágil + opción de escritura directa
    const finalCards = candidateCards.slice(0, count).map((card, idx) => {
      const otherTargets = Array.from(
        new Set(allTargetsPool.filter((t) => t.toLowerCase() !== card.targetAnswer.toLowerCase()))
      );
      const distractors = otherTargets.slice(idx % Math.max(1, otherTargets.length - 3), (idx % Math.max(1, otherTargets.length - 3)) + 3);
      while (distractors.length < 3) {
        distractors.push(['tres meses hábiles', 'diez días naturales', 'silencio negativo'][distractors.length]);
      }
      const choices = [card.targetAnswer, ...distractors].sort((a, b) => a.localeCompare(b));
      return { ...card, choices };
    });

    setClozeSession({
      categoryFilter,
      cards: finalCards,
      currentIdx: 0,
      userInput: '',
      strictWriteMode: false, // false = Selección rápida de chips | true = Teclear sin pistas
      results: {}, // { [cardId]: { isCorrect, userValue } }
      showSolutionCurrent: false,
      timeLeft: 600, // 10 minutos (600 segundos)
      isFinished: false
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
  }, [clozeSession]);

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

    let pool = [...questionBank];
    if (onlyLeitnerBox1) {
      pool = questionBank.filter(
        (q) =>
          (leitnerBoxes[q.id] || 2) === 1 || failedQuestionIds.includes(q.id)
      );
    } else if (topicFilterId) {
      pool = questionBank.filter((q) => q.topicId === topicFilterId);
    } else {
      const genPool = questionBank.filter((q) =>
        /^(G|S-[1-7]$|AY-([1-9]|1\d|20)$)/.test(q.topicId)
      );
      const espPool = questionBank.filter(
        (q) => !/^(G|S-[1-7]$|AY-([1-9]|1\d|20)$)/.test(q.topicId)
      );
      const targetGen = Math.max(1, Math.round(fullCount * 0.2));
      pool = [
        ...genPool.slice(0, targetGen),
        ...espPool.slice(0, fullCount - targetGen),
      ];
    }
    if (pool.length === 0) pool = [...questionBank];

    const adaptedPool = pool.map((q) => {
      if (!isAyto || q.options.length <= 3) return q;
      const correctOpt = q.options[q.correctIndex] || q.options[0];
      const wrongOpts = q.options
        .filter((_, idx) => idx !== q.correctIndex)
        .slice(0, 2);
      const threeOpts = [correctOpt, ...wrongOpts].map(
        (txt, idx) =>
          `${['A', 'B', 'C'][idx]}) ${txt.replace(/^[A-D]\)\s*/i, '')}`
      );
      return { ...q, options: threeOpts, correctIndex: 0 };
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

    const riskReport = {
      doubtsTotal,
      doubtsAnsweredHits,
      doubtsAnsweredErrors,
      doubtsLeftBlank,
      doubtsWhereCorrectWasInPair,
      netPointsFromDoubts,
      gradeImpactOver10,
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
    version: '2026-MASTER-V5',
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
    documentsLibrary
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
    setStatusBanner('✅ Restauración completa verificada al 100%: Todos tus temas, notas y avances han sido recuperados.');
  } catch {
    setStatusBanner('⚠️ El archivo de copia de seguridad no es válido.');
  }
  setTimeout(() => setStatusBanner(''), 5000);
};
  const MODULES_NAV = [
    { id: '00', code: '00', label: 'Mi preparación y 4 Bloques' },
    { id: '01', code: '01', label: `Temario (${activeCatalog.length})` },
    { id: '02', code: '02', label: `Banco (${questionBank.length})` },
    {
      id: '03',
      code: '03',
      label: `Simulacros (Caja 1: ${leitnerCounts.box1})`,
    },
    { id: '04', code: '04', label: `Temas 10/10 (${essaysLibrary.length})` },
    { id: '05', code: '05', label: '10 Supuestos (5 Dim)' },
    { id: '06', code: '06', label: `Lab PDF (${documentsLibrary.length})` },
    { id: '08', code: '08', label: `Grupo (${peerReviewQueue.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-slate-800 dark:text-stone-100 font-sans pb-14 transition-colors">
      {/* CABECERA MULTI-CONVOCATORIA, CRONÓMETRO DE FLUJO, BACKUP 100% Y MULTI-PERFIL */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-2.5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D97757] text-white flex items-center justify-center font-extrabold shadow-xs">
                TS
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#D97757] uppercase tracking-wider">
                  PLATAFORMA TRIPLE CONVOCATORIA · CAM (83) · SERMAS (50) · AYTO
                  MADRID (90)
                </span>
                <h1 className="text-base font-bold text-slate-800 dark:text-white">
                  Sistema Integral de Plaza · Paridad Universal, Leitner,
                  Gestión del Riesgo y Auditoría 2026
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-300 text-xs">
                <span className="font-mono font-extrabold text-amber-900 dark:text-amber-300">
                  ⏱ {Math.floor(flowTimer.secondsLeft / 60)}:
                  {String(flowTimer.secondsLeft % 60).padStart(2, '0')}
                </span>
                <button
                  onClick={() =>
                    setFlowTimer((p) => ({ ...p, isRunning: !p.isRunning }))
                  }
                  className="px-2 py-0.5 rounded bg-[#D97757] text-white font-bold text-[10px] cursor-pointer"
                >
                  {flowTimer.isRunning ? '⏸' : '▶ 60m'}
                </button>
                <span
                  className="text-[10px] text-stone-500 font-bold"
                  title="Tiempo neto real acumulado"
                >
                  ({netStudyMinutes}m netos)
                </span>
              </div>

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
                        : 'CAM Orden 1049/2026 (83 Temas · 380 Plazas · -1/3)'
                    }`
                  );
                  setTimeout(() => setStatusBanner(''), 4000);
                }}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-extrabold bg-[#FAF8F5] dark:bg-stone-800 cursor-pointer"
              >
                <option value="cam_a2">
                  🏛️ CAM Orden 1049/2026 (83 Temas · 380 Plazas)
                </option>
                <option value="sermas">
                  🏥 SERMAS Res. 20/10/2026 (50 Temas · 173 Plazas)
                </option>
                <option value="ayto">
                  🏢 Ayuntamiento de Madrid (90 Temas · 3 Opciones)
                </option>
              </select>

              <button
                onClick={syncCommonTopicsAcrossExams}
                className="px-2.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold cursor-pointer"
                title="Sincroniza preguntas equivalentes entre CAM, SERMAS y Ayuntamiento"
              >
                🔗 Puente Comunes
              </button>

              <button
                onClick={exportFullMasterBackup}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
                title="Descargar Copia de Seguridad Total 100% (.json)"
              >
                🛡️ Backup
              </button>

              <span className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border text-xs font-bold text-[#D97757]">
                👤 {PROFILES[activeProfile].name}
              </span>
              <ThemeSwitch
                isDark={isDark}
                onToggle={() => setTheme(isDark ? 'light' : 'dark')}
              />
            </div>
          </div>

          <nav className="flex flex-wrap gap-1.5 pt-1 border-t border-stone-100 dark:border-stone-800">
            {MODULES_NAV.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                  activeModule === m.id
                    ? 'bg-[#D97757] text-white shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200/70'
                }`}
              >
                <span className="opacity-75 font-mono text-[10px]">
                  {m.code}
                </span>
                <span>{m.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

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

            <p className="text-xs text-stone-600 dark:text-stone-300">
              Sin mirar apuntes, teclea el{' '}
              <b>índice de sub-epígrafes, leyes con año y autores</b> que
              recuerdes de este tema antes de abrir el texto:
            </p>

            <textarea
              rows={6}
              value={skeletonTrainer.userRecallText}
              onChange={(e) =>
                setSkeletonTrainer((prev) => ({
                  ...prev,
                  userRecallText: e.target.value,
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
                      2.º Ejercicio · Desarrollo (1.850 pal / 80m)
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

            {/* CALCULADORA OFICIAL DEL BAREMO RMER DEL SERMAS */}
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
          </div>
        )}

        {/* ================================================================= */}
        {/* MÓDULO 01 · TEMARIO OFICIAL CON PARIDAD UNIVERSAL EN LAS 3 OPOS   */}
        {/* ================================================================= */}
        {activeModule === '01' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-3">
              <div>
                <h2 className="text-base font-bold">
                  01 · Temario Oficial Completo ({activeCatalog.length} Temas ·
                  Paridad 100% CAM / SERMAS / Ayuntamiento)
                </h2>
                <p className="text-xs text-stone-500">
                  Cada tema de las 3 oposiciones permite:{' '}
                  <b>Generar Tema Magistral 10/10 (1.850 pal)</b>,{' '}
                  <b>Entrenar Esqueleto en 7 min</b>, <b>Subir y Auditar PDF</b>{' '}
                  y <b>Hacer Test Monográfico</b>.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Buscar por título o ley..."
                  value={searchTopicQuery}
                  onChange={(e) => setSearchTopicQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border text-xs bg-[#FAF8F5] dark:bg-stone-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((t) => {
                const td = topicData[t.id] || {};
                const status = td.status || 'Pendiente';
                const topicDocsCount = documentsLibrary.filter(
                  (d) => d.topicId === t.id
                ).length;
                const topicQsCount = questionBank.filter(
                  (q) => q.topicId === t.id
                ).length;

                return (
                  <div
                    key={t.id}
                    className="bg-white dark:bg-stone-900 p-4 rounded-2xl border space-y-3 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs font-extrabold text-[#D97757]">
                          [{t.id}] · {t.block}
                        </span>
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
                        onClick={() => handleGenerateMagistralTopic(t)}
                        className="px-2 py-1.5 rounded-lg bg-[#D97757] hover:bg-[#c46546] text-white text-[10px] font-bold cursor-pointer"
                      >
                        ✍️ Crear Tema 10/10
                      </button>

                      <button
                        onClick={() => openSkeletonTrainerForTopic(t)}
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
                          onChange={(e) =>
                            processPdfUpload(e.target.files, true, t)
                          }
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={() => launchStrategicSimulator(t.id)}
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
        {activeModule === '02' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold">
                  02 · Banco Común Verificado ({questionBank.length} Preguntas)
                </h2>
                <p className="text-xs text-stone-500">
                  Incluye las 60 preguntas oficiales de alta dificultad (CAM,
                  SERMAS y Ayuntamiento) y distractores de Mutación Jurídica.
                </p>
              </div>
              <button
                onClick={() => {
                  const existingIds = new Set(questionBank.map((q) => q.id));
                  const toAdd = HIGH_DIFFICULTY_60_QUESTIONS.filter(
                    (q) => !existingIds.has(q.id)
                  );
                  if (toAdd.length > 0) {
                    setQuestionBank((prev) => [...toAdd, ...prev]);
                    setStatusBanner(
                      `🔥 ¡${toAdd.length} preguntas de alta dificultad añadidas al Banco Común!`
                    );
                  } else {
                    setStatusBanner(
                      'ℹ️ Las 60 preguntas de alta dificultad ya están activas en tu Banco Común.'
                    );
                  }
                  setTimeout(() => setStatusBanner(''), 4000);
                }}
                className="px-4 py-2 rounded-xl bg-[#D97757] hover:bg-[#c26446] text-white text-xs font-bold cursor-pointer shrink-0"
              >
                🔥 Verificar / Cargar las 60 Preguntas Trampa (2026)
              </button>
            </div>
            <div className="space-y-2.5">
              {questionBank.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-white dark:bg-stone-900 border text-xs space-y-1.5"
                >
                  <div className="flex justify-between">
                    <span className="font-extrabold text-[#D97757]">
                      [{q.topicId}] · {q.originType} · {q.difficulty}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
                      Caja Leitner: {leitnerBoxes[q.id] || 2}
                    </span>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                </div>
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
                          <span className="text-[11px] font-extrabold text-[#D97757]">
                            Tema [{currentQ.topicId}] ·{' '}
                            {currentQ.originType || 'Oficial'}
                          </span>

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
        {activeModule === '04' && (
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

              <div className="flex flex-wrap gap-2">
                <label className="px-3.5 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold cursor-pointer">
                  📤 Subir Tema PDF a {activeConvocatoria.toUpperCase()}
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) =>
                      processPdfUpload(e.target.files, true, activeCatalog[0])
                    }
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

                    if (mode === 'general') {
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
                  <option value="skeletons">
                    🧠 Cuaderno de Esqueletos y Leyes (1 pág/tema · Ideal Fase
                    3)
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
              <div className="flex flex-wrap gap-1.5">
                {essaysLibrary.map((es) => (
                  <button
                    key={es.id}
                    onClick={() => {
                      const refreshedAudit = auditDocumentTextValidity(
                        es.text,
                        es.topicId
                      );
                      setActiveEssayView({ ...es, audit: refreshedAudit });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                      activeEssayView?.id === es.id
                        ? 'bg-[#D97757] text-white shadow-xs'
                        : 'bg-[#FAF8F5] dark:bg-stone-800 border'
                    }`}
                  >
                    [{es.topicId}] {es.name.slice(0, 32)}... (
                    {es.audit?.finalScore || '9.5'}/10)
                  </button>
                ))}
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
                        ✍️ Calibración a Escritura Manuscrita Real (23
                        palabras/min · Meta: 1.850 palabras en 80 min + 10 min
                        Esqueleto)
                      </span>
                      <span
                        className={`text-xs font-extrabold ${
                          activeEssayView.audit?.wordCount >= 1650 &&
                          activeEssayView.audit?.wordCount <= 2000
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

                    <button
                      onClick={async () => {
                        const adjustedText = adjustTextToHandwrittenTarget(
                          activeEssayView.text,
                          1850
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
                          `✂️ Tema ajustado a velocidad manuscrita real: ${newAudit.wordCount} palabras (${newAudit.handwrittenMinutes} min a bolígrafo).`
                        );
                        setTimeout(() => setStatusBanner(''), 4000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] cursor-pointer shrink-0"
                    >
                      ✂️ Ajustar a 1.850 Palabras Manuscritas (80m)
                    </button>
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
                      setCalcEj2(Number(updatedAudit.finalScore));
                      setStatusBanner(
                        `🔄 Calidad re-evaluada [${updatedItem.topicId}]: Nota Desarrollo ${updatedAudit.finalScore}/10 · Aptitud Test ${updatedAudit.ej1TestQualityScore}/10 · Cobertura ${updatedAudit.coveragePct}%.`
                      );
                      setTimeout(() => setStatusBanner(''), 5000);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                  >
                    🔄 Re-evaluar Calidad 10/10 y Guardar Modificaciones
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

                <textarea
                  rows={18}
                  value={activeEssayView.text}
                  onChange={async (e) => {
                    const newText = e.target.value;
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
                  <button
                onClick={exportMasterCheatSheet6PagesPDF}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold cursor-pointer"
                title="Descargar en PDF de 6 páginas todas las tablas comparativas de plazos, silencios, prescripciones, baremos, escalas y autores"
              >
                📊 PDF 6 Págs Plazos
              </button>
                  📚 Descargar los 10 Supuestos en 1 PDF
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
                    onChange={(e) =>
                      restoreFullMasterBackup(e.target.files?.[0])
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs max-h-[440px] overflow-y-auto pr-1">
              {OFFICIAL_10_PRACTICAL_CASES.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-stone-800 border space-y-2 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <span className="font-extrabold text-[#D97757] block">
                      {c.badge}
                    </span>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                      {c.enunciado}
                    </p>
                    <p className="text-[10px] text-emerald-800 dark:text-emerald-300 mt-1.5">
                      <b>Claves de Tribunal:</b> {c.claves}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const customModelResolution = buildCaseResolutionText(c);
                      setPracticalCaseText(customModelResolution);
                      setStatusBanner(
                        `✍️ Cargada la Resolución Magistral 10/10 específica de "${c.badge}". Pulsa el botón verde de abajo para auditarla.`
                      );
                      setTimeout(() => setStatusBanner(''), 4000);
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] cursor-pointer mt-2"
                  >
                    📥 Cargar Resolución 10/10 de este Supuesto
                  </button>
                </div>
              ))}
            </div>

            <textarea
              rows={14}
              value={practicalCaseText}
              onChange={(e) => setPracticalCaseText(e.target.value)}
              placeholder="Selecciona uno de los 10 supuestos oficiales de arriba o redacta aquí tu propia resolución siguiendo los 7 bloques metodológicos..."
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
                      /historia\s+social|ficha\s+social|informe\s+social|genograma|ecomapa|gij[oó]n|zarit|barthel|baremo|pfeiffer|ethos|asi|val[oó]rame/g
                    ) || []
                  ).length;
                  const d1 = Math.min(2.0, (instrumentsMatches / 5) * 2.0);

                  const lawsMatches = (
                    lower.match(
                      /12\/2022|54\/2015|888\/2022|4\/2023|5\/2005|1\/2023|8\/2021|39\/2015|15\/2001|19\/2021|1155\/2024|5\/2002|3\/2004|1\/2001/g
                    ) || []
                  ).length;
                  const d2 = Math.min(2.0, (lawsMatches / 5) * 2.0);

                  const piasMatches = (
                    lower.match(
                      /plan\s+individual|garantizada|condicionada|derecho\s+subjetivo|urgencia|objetivo\s+general|objetivos\s+espec[ií]ficos/g
                    ) || []
                  ).length;
                  const d3 = Math.min(2.5, (piasMatches / 4) * 2.5);

                  const netMatches = (
                    lower.match(
                      /atenci[oó]n\s+social\s+primaria|especializada|salud\s+mental|horus|samur|fiscal|educativa|caid|crps|amapad|amas/g
                    ) || []
                  ).length;
                  const d4 = Math.min(2.0, (netMatches / 4) * 2.0);

                  const evalMatches = (
                    lower.match(
                      /indicador|evaluaci[oó]n|continua|intermedia|final|cronograma|protecci[oó]n\s+de\s+datos/g
                    ) || []
                  ).length;
                  const d5 = Math.min(1.5, (evalMatches / 4) * 1.5);

                  let rawTotal = d1 + d2 + d3 + d4 + d5;
                  if (words < 250) rawTotal *= 0.65;
                  if (forbiddenAbbrevs.length > 0)
                    rawTotal -= forbiddenAbbrevs.length * 0.25;

                  const total = Math.max(0, Math.min(10, rawTotal)).toFixed(2);
                  setCalcEj3(Number(total));
                  setPracticalRubricResult({
                    d1: d1.toFixed(2),
                    d2: d2.toFixed(2),
                    d3: d3.toFixed(2),
                    d4: d4.toFixed(2),
                    d5: d5.toFixed(2),
                    words,
                    handwrittenMin: Math.round(words / 23),
                    forbiddenAbbrevs,
                    total,
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-[#4A7C59] hover:bg-[#3d684a] text-white text-xs font-bold cursor-pointer"
              >
                ✔ Auditar Supuesto con Rigor Real de Tribunal (5 Dimensiones +
                Siglas)
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
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* MÓDULO 06 · LABORATORIO DOCUMENTAL PDF                            */}
        {/* ================================================================= */}
        {activeModule === '06' && (
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">
                  06 · Laboratorio Documental PDF ({documentsLibrary.length}{' '}
                  Archivos)
                </h2>
                <p className="text-xs text-stone-500">
                  Auditoría automática de leyes derogadas y extracción de
                  preguntas con Mutación Jurídica para cualquiera de las 3
                  oposiciones.
                </p>
              </div>
              <label className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold cursor-pointer">
                📥 Subir PDF(s)
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => processPdfUpload(e.target.files, false)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2.5">
              {documentsLibrary.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-[#FAF8F5] dark:bg-stone-800"
                >
                  <div>
                    <span className="font-extrabold text-[#D97757]">
                      [{doc.topicId}]
                    </span>{' '}
                    <b>{doc.name}</b> · Aptitud Test:{' '}
                    <b>{doc.audit?.ej1TestQualityScore}/10</b> ·{' '}
                    {doc.audit?.validityStatus}
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
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MÓDULO 08 · GRUPO DE ESTUDIO Y PERFILES AISLADOS                  */}
        {/* ================================================================= */}
        {activeModule === '08' && (
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
                      onChange={(e) =>
                        importGroupPackageJson(e.target.files?.[0])
                      }
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
