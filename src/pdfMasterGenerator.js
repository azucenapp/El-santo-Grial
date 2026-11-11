// ARCHIVO: src/pdfMasterGenerator.js
export async function generateMaster6PagesPDF(setStatusBanner) {
  if (setStatusBanner) {
    setStatusBanner(
      '⏳ Maquetando y descargando el Cuadro Maestro Ejecutivo de 6 páginas en PDF...'
    );
  }
  try {
    const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = 178;
    const leftMargin = 16;

    const pagesData = [
      {
        pageTitle:
          'PAGINA 1/6 · PLAZOS ADMINISTRATIVOS, SILENCIO Y CONTRATOS (BLOQUE GENERAL)',
        subtitle:
          'Sintesis comparativa: Ley 39/2015 (LPAC), Ley 40/2015 (LRJSP), LCSP 9/2017, RGPD y Ley 41/2002',
        sections: [
          {
            heading:
              '1. COMPUTO DE PLAZOS, NOTIFICACIONES Y TRAMITACION (LEY 39/2015 LPAC)',
            rows: [
              '• Plazos por horas (Art. 30.1): Son habiles por defecto. No pueden superar 24 horas.',
              '• Plazos por dias (Art. 30.2): Son habiles por defecto (excluidos sabados, domingos y festivos).',
              '• Rechazo de notificacion electronica (Art. 43.2): A los 10 DIAS NATURALES desde puesta a disposicion.',
              '• Plazo general supletorio para resolver (Art. 21.3): 3 meses (maximo 6 meses salvo Ley o norma UE).',
              '• Subsanacion de solicitud (Art. 68.1): 10 dias habiles. Evacuacion de informes (Art. 80): 10 dias habiles.',
              '• Tramitacion simplificada (Art. 96): Resolucion en 30 dias habiles.',
            ],
          },
          {
            heading:
              '2. RECURSOS ADMINISTRATIVOS, REVISION DE OFICIO Y RESPONSABILIDAD (LPAC / LRJSP)',
            rows: [
              '• Recurso de Alzada (Arts. 121-122): Interposicion 1 mes (expreso). Resolucion: 3 meses.',
              '• Recurso Potestativo de Reposicion (Arts. 123-124): Interposicion 1 mes (expreso). Resolucion: 1 mes.',
              '• Revision de oficio actos nulos (Art. 106): Sin prescripcion. Caduca a los 6 meses si se inicio de oficio.',
              '• Declaracion de lesividad anulables (Art. 107): Limite 4 años desde el acto. Caduca a los 6 meses.',
              '• Responsabilidad Patrimonial (Art. 67 LPAC): Prescribe al 1 año. Resolucion: 6 meses (silencio negativo).',
              '• Convenios administrativos (Art. 49.h LRJSP): Duracion max. 4 años, prorrogables hasta otros 4 años.',
            ],
          },
          {
            heading:
              '3. CONTRATOS (LEY 9/2017 LCSP), TRANSPARENCIA CAM (LEY 10/2019), RGPD Y LEY 41/2002',
            rows: [
              '• Contrato Menor (Art. 118 LCSP): < 40.000 EUR (obras) y < 15.000 EUR (servicios/suministros). Max. 1 año sin prorroga.',
              '• Abierto Supersimplificado (Art. 159.6 LCSP): < 80.000 EUR (obras) y < 60.000 EUR (servicios). Sin garantia definitiva.',
              '• Transparencia CAM (Ley 10/2019 Art. 42): Resolucion en 20 DIAS HABILES (+20). Silencio NEGATIVO.',
              '• Proteccion de Datos (LO 3/2018 y RGPD): Consentimiento menor 14 años. Derechos: 1 mes. Brecha AEPD: 72 horas.',
              '• Autonomia del Paciente (Ley 41/2002): Mayoria de edad sanitaria 16 años. Conservacion historia: min. 5 años.',
            ],
          },
        ],
      },
      {
        pageTitle:
          'PAGINA 2/6 · PRESCRIPCIONES, PERMISOS Y PERSONAL (CONTRASTE CAM / SERMAS / AYTO)',
        subtitle:
          'Blindaje contra cruces entre TREBEP (RDL 5/2015), Estatuto Marco SERMAS (Ley 55/2003) y Ley 12/2022',
        sections: [
          {
            heading:
              '1. TABLA DE CONTRASTE DE PRESCRIPCION DE FALTAS, INFRACCIONES Y SANCIONES',
            rows: [
              '• TREBEP (Art. 97 · CAM y Ayto): Faltas -> Muy graves: 3 AÑOS | Graves: 2 años | Leves: 6 meses.',
              '• TREBEP (Art. 97 · Sanciones): Muy graves: 3 años | Graves: 2 años | Leves: 1 AÑO.',
              '• ESTATUTO MARCO SERMAS (Art. 72 Ley 55/2003): Faltas y Sanciones -> Muy graves: 4 AÑOS | Graves: 2 años | Leves: 6 meses.',
              '• LEY 12/2022 SERVICIOS SOCIALES CAM (Titulo VIII): Infracciones -> Muy graves: 4 AÑOS | Graves: 3 AÑOS | Leves: 1 AÑO.',
            ],
          },
          {
            heading:
              '2. TEMPORALIDAD E INTERINIDAD (ART. 10 TREBEP Y ART. 9 LEY 55/2003)',
            rows: [
              '• Plaza vacante y Programas temporales: Maximo 3 años.',
              '• Exceso o acumulacion de tareas (TREBEP y SERMAS): Maximo 9 MESES dentro de un periodo de 18 MESES.',
            ],
          },
          {
            heading:
              '3. PERMISOS ACTUALIZADOS (ARTS. 48 Y 49 TREBEP TRAS RDL 5/2023) Y EXCEDENCIAS',
            rows: [
              '• Enfermedad grave / hospitalizacion (Art. 48.a): 5 DIAS HABILES (1.er grado/conviviente) y 4 DIAS HABILES (2.º grado).',
              '• Fallecimiento (Art. 48.a): 3 o 5 dias habiles en 1.er grado; 2 o 4 dias habiles en 2.º grado.',
              '• Nuevo Permiso Parental (Art. 49.g): Hasta 8 SEMANAS hasta que el menor cumpla 8 AÑOS.',
              '• Excedencia voluntaria interes particular: Exige 5 años previos y minimo 2 años de permanencia.',
            ],
          },
        ],
      },
      {
        pageTitle:
          'PAGINA 3/6 · PLAZOS Y REQUISITOS EN SERVICIOS SOCIALES Y EXTRANJERIA (2026)',
        subtitle:
          'Ley 12/2022, Decreto 54/2015, RD 888/2022, IMV/RMI, Ley 4/2023, Ley 8/2021, Art. 763 LEC y RD 1155/2024',
        sections: [
          {
            heading:
              '1. DEPENDENCIA (DECRETO 54/2015), DISCAPACIDAD (RD 888/2022) E INGRESOS MINIMOS (IMV / RMI)',
            rows: [
              '• Dependencia CAM (Decreto 54/2015): Resolucion (Grado + PIA) en 6 MESES. Silencio NEGATIVO. Residencia: 5 años (2 inmediatos).',
              '• Revision de grado en Dependencia y en Discapacidad: Minimo 2 AÑOS (salvo agravamiento/cambio sustancial).',
              '• Discapacidad (RD 888/2022): Resolucion ordinaria 6 MESES (Silencio NEGATIVO). Urgencia: 3 MESES.',
              '• Ingreso Minimo Vital (Ley 19/2021): Resolucion 6 MESES (Silencio NEGATIVO). Edad >= 23 años (18 con menores/extutelados).',
              '• RMI CAM (Ley 15/2001): Subsidiaria al IMV. Residencia CAM: 1 año previo; 25-65 años.',
            ],
          },
          {
            heading:
              '2. INFANCIA (LEY 4/2023), CAPACIDAD JURIDICA (LEY 8/2021 / LEY 1/2023 AMAPAD) Y ART. 763 LEC',
            rows: [
              '• Riesgo vs Desamparo (Ley 4/2023): Riesgo = Entidad Local; Desamparo = CAM (Comision de Tutela del Menor).',
              '• Acogimiento familiar: Urgencia (< 6 años, max. 6 meses), Temporal (max. 2 años) y Permanente. Guarda voluntaria: max. 2 años.',
              '• Curatela (Ley 8/2021): Asistencial por regla general. Revision judicial: maximo cada 3 AÑOS (excepcional 6).',
              '• Internamiento involuntario urgente (Art. 763 LEC): Comunicar al Juez en 24 HORAS; ratificacion en 72 HORAS.',
            ],
          },
          {
            heading:
              '3. NUEVO REGLAMENTO DE EXTRANJERIA (REAL DECRETO 1155/2024)',
            rows: [
              '• 5 Arraigos: 2.ª oportunidad, Sociolaboral (>=20h/sem), Social, Socioformativo (trabajo <=30h/sem) y Familiar.',
              '• Permanencia previa: 2 AÑOS (salvo Familiar: 0 años y dura 5 años). Asilo en tramite NO computa.',
            ],
          },
        ],
      },
      {
        pageTitle:
          'PAGINA 4/6 · BAREMOS OFICIALES, ESCALAS CLINICO-SOCIALES E INDICADORES',
        subtitle:
          'Puntos de corte exactos para Test (1.er Ejercicio) y Supuesto Practico (3.er Ejercicio)',
        sections: [
          {
            heading:
              '1. BAREMOS DE DEPENDENCIA (RD 174/2011) Y DISCAPACIDAD (RD 888/2022)',
            rows: [
              '• BVD Dependencia: 0-24 Sin grado | 25-49 Grado I | 50-74 Grado II | 75-100 Grado III. EVE: 0 a 3 años.',
              '• 4 Baremos RD 888/2022: BDGP, BLA, BRP (WHO-DAS) y BFCA (Social: suma hasta +24 ptos si inicial >= 15%).',
              '• 5 Clases RD 888/2022: Clase 0 (0-4%), Clase 1 (5-24%), Clase 2 (25-49%, legal desde 33%), Clase 3 (50-95%), Clase 4 (96-100%).',
            ],
          },
          {
            heading:
              '2. ESCALAS SOCIOFAMILIARES Y VALORACION GERIATRICA INTEGRAL',
            rows: [
              '• Escala de Gijon (5 areas, 5-25 ptos): 5-9 Normal | 10-14 RIESGO SOCIAL | >= 15 PROBLEMA SOCIAL.',
              '• Escala de Zarit (Sobrecarga cuidador, 22 items, 22-110): 22-46 Sin sobrecarga | 47-55 Leve | >= 56 INTENSA.',
              '• Barthel (ABVD, 0-100) | Lawton y Brody (AIVD, 0-8) | Pfeiffer (Cognitivo, 10 items contando ERRORES).',
              '• AROPE 2030: < 60% mediana ingresos | Carencia en >= 7 de 13 items | Empleo < 20% potencial (18-64 años).',
            ],
          },
        ],
      },
      {
        pageTitle:
          'PAGINA 5/6 · MAPA DE AUTORES, MODELOS, INSTRUMENTOS Y ETICA APLICADA',
        subtitle:
          'Referencias doctrinales clave para el Test y la introduccion de los Temas (M04) y Casos (M05)',
        sections: [
          {
            heading: '1. MODELOS DE INTERVENCION, PLANIFICACION E INSTRUMENTOS',
            rows: [
              '• Mary Richmond ("Social Diagnosis", 1917) | Gordon Hamilton ("persona-en-situacion", 1940) | Hollis (6 tecnicas).',
              '• Escuela Funcional (Otto Rank -> Robinson y Taft) | Resolucion de Problemas (Perlman, 1957: las 4 P).',
              '• Centrado en la Tarea (Reid y Epstein, 1972: max. 3 problemas diana, 6-12 sesiones) | Crisis (Caplan, Rapoport, Golan: 4-6 sem).',
              '• Ecologico (Bronfenbrenner: Micro, Meso, Exo, Macro; Germain y Gitterman: Life Model) | Comunitario (Rothman, 1968: 3 modelos).',
              '• Calidad (Donabedian: Estructura, Proceso, Resultado) | Necesidades (Bradshaw: Normativa, Sentida, Expresada, Comparativa).',
              '• Genograma (McGoldrick y Gerson: min. 3 generaciones) vs Ecomapa (Ann Hartman: relaciones con entorno).',
            ],
          },
          {
            heading: '2. CODIGO DEONTOLOGICO (2012), BIOETICA Y BURNOUT',
            rows: [
              '• Codigo Deontologico TS (2012): Dignidad, Libertad e Igualdad. Secreto profesional perpetuo (excepciones Art. 53).',
              '• Bioetica (Diego Gracia): Nivel 1 Minimos (No maleficencia y Justicia) prevalece sobre Nivel 2 Maximos (Autonomia y Beneficencia).',
              '• Burnout (Maslach y Jackson, 1981): Alto cansancio emocional + Alta despersonalizacion + BAJA realizacion personal.',
            ],
          },
        ],
      },
      {
        pageTitle:
          'PAGINA 6/6 · REGLAS DE EXAMEN DE LAS 3 OPOSICIONES Y MAPA DE RECURSOS MADRID',
        subtitle:
          'Parametros oficiales de examen (CAM, SERMAS y Ayuntamiento) y diferenciacion de redes',
        sections: [
          {
            heading: '1. PARAMETROS OFICIALES DE EXAMEN Y PENALIZACION (2026)',
            rows: [
              '• CAM (83 Temas · 380 Plazas): Test 80+5 en 85m (-1/3) | 2.º Ej: 1 tema entre 2 bolas (90m) | 3.er Ej: Supuesto (90m, 1.ª prioridad desempate).',
              '• SERMAS (50 Temas · 173 Plazas): Test unico 100+10 en 120m (-0,25, 50 ptos) + Concurso RMER (50 ptos: Exp. 35 + Form. 15).',
              '• AYUNTAMIENTO DE MADRID (90 Temas): Test 120+9 en 129m con 3 OPCIONES (A,B,C) y penalizacion -1/3 | 2.º Ej: 70%/15%/10%/5%.',
            ],
          },
          {
            heading: '2. MAPA DE DISPOSITIVOS Y AGENCIAS ESPECIALIZADAS MADRID',
            rows: [
              '• Ayuntamiento de Madrid: CAF (preventivo/mediacion) vs CAI (riesgo/maltrato infantil) | SAMUR Social (UMES, Equipos Calle, UEB) | SAVG 24h.',
              '• Comunidad de Madrid: AMAS (Mayores/Discapacidad), AMAPAD (Ley 1/2023 apoyos adultos), ARRMI (Ley 3/2004 menores infractores), EASC/CRPS/CRL y CAID.',
            ],
          },
        ],
      },
    ];

    pagesData.forEach((pData, pageIdx) => {
      if (pageIdx > 0) pdf.addPage();
      let y = 14;

      pdf.setFillColor(217, 119, 87);
      pdf.rect(leftMargin, y, pageWidth, 12, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text(pData.pageTitle, leftMargin + 3, y + 5.2);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(pData.subtitle, leftMargin + 3, y + 10);
      y += 16;

      pData.sections.forEach((sec) => {
        pdf.setFillColor(245, 242, 235);
        pdf.rect(leftMargin, y, pageWidth, 6, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.8);
        pdf.setTextColor(154, 52, 18);
        pdf.text(sec.heading, leftMargin + 2, y + 4.2);
        y += 8.5;

        pdf.setFont('times', 'normal');
        pdf.setFontSize(8.8);
        pdf.setTextColor(28, 25, 23);

        sec.rows.forEach((rowTxt) => {
          const wrapped = pdf.splitTextToSize(rowTxt, pageWidth - 3);
          wrapped.forEach((line) => {
            if (y > 281) return;
            pdf.text(line, leftMargin + 1.5, y);
            y += 4.1;
          });
          y += 0.7;
        });
        y += 2;
      });

      pdf.setDrawColor(214, 211, 209);
      pdf.line(leftMargin, 285, leftMargin + pageWidth, 285);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(120, 113, 108);
      pdf.text(
        `CUADRO MAESTRO EJECUTIVO DE REPASO (CAM · SERMAS · AYUNTAMIENTO DE MADRID 2026) — PAGINA ${
          pageIdx + 1
        } DE 6`,
        leftMargin,
        289.5
      );
    });

    pdf.save('Cuadro_Maestro_Plazos_Escalas_Autores_6Paginas_2026.pdf');
    if (setStatusBanner) {
      setStatusBanner(
        '📊 ¡Cuadro Maestro Ejecutivo de 6 páginas descargado en PDF!'
      );
      setTimeout(() => setStatusBanner(''), 5000);
    }
  } catch (e) {
    console.error('Error generando Cuadro Maestro PDF:', e);
    if (setStatusBanner) {
      setStatusBanner('⚠️ Error al generar el PDF del Cuadro Maestro.');
      setTimeout(() => setStatusBanner(''), 5000);
    }
  }
}
