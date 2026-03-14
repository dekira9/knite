{/*прибавки в углу резинки V*/}
export const calculateVNeckIncreases01 = (NRrezV: number,  SpribVcorn: number,RowPribRV1: number,RowPribRVz: number) => {
 const MRz= Array.from({ length: RowPribRVz }, (_, rz) => rz + 1);
 const MR1= Array.from({ length: RowPribRV1 }, (_, ra) => ra + 1);
 const MRN= Array.from({ length: NRrezV }, (_, rn) => rn + 1);
const KVz = (NRrezV) / RowPribRV1;
const PozS1=MR1.map(ra => Math.floor(KVz * ra));
const PozZ= MRN.filter(rn => !PozS1.includes(rn));

const increases01=Array.from({ length: NRrezV }, (_, index) => {
{ /*if (index === 0) {
   return 0; // No increase on the first row
 } else */}
   if (PozZ.includes(index + 1)) {
    return 0;
  } else if (PozS1.includes(index + 1)) {
    return 1;
  } else {
    return null; // или любое другое значение по умолчанию
  }
});
   const resultStringV01 = increases01.join(', ');
  return { 
    PozS1, 
    RowPribRV1, 
    RowPribRVz, 
    increases01, 
    resultStringV01 
  };
};
export const calculateVNeckIncreases12 = (
  NRrezV: number,
  RowPribRV1: number,
  RowPribRV2: number
  
) => {
  console.log('calculateVNeckIncreases12 params:', { NRrezV, RowPribRV1, RowPribRV2 });
  if (RowPribRV1 <= 0) {
    throw new Error("RowPribRV1 должен быть больше нуля6, а он равен " + RowPribRV1);
  }
  const MR2 = Array.from({ length: RowPribRV2 }, (_, rb) => rb + 1);
  const MR1 = Array.from({ length: RowPribRV1 }, (_, ra) => ra + 1);
  const MRN = Array.from({ length: NRrezV }, (_, rn) => rn + 1);
  
  const KVb = (NRrezV) / RowPribRV1;
  const PozS1 = MR1.map(ra => Math.floor(KVb * ra));
  const pozS1Set = new Set(PozS1);
  const PozS2 = MRN.filter(rb => !pozS1Set.has(rb));
  const pozS2Set = new Set(PozS2);
  
  const increases12 = Array.from({ length: NRrezV }, (_, index) => {
    const position = index + 1;
    {/*if (index === 0) {
     return 0; // No increase on the first row
    } else */}
    if (pozS2Set.has(position)) {
      return 2;
    } else if (pozS1Set.has(position)) {
      return 1;
    } else {
      return 0; // Значение по умолчанию, если индекс не принадлежит ни одному из множеств
    }
  });
  
  const resultStringV12 = increases12.join(', ');
  console.log('PozS1',PozS1)
  console.log('PozS2',PozS2)
  console.log('распред 12',increases12)

  
  return { 
    MR2,
    MR1,
    PozS1,
    RowPribRV1,
    RowPribRV2,
    increases12,
    resultStringV12
  };
};

export const calculateVNeckIncreases11 = (NRrezV: number, PribRV1: number, SpribVcorn: number) => {
  console.log('calculateVNeckIncreases11 params:', { NRrezV, PribRV1, SpribVcorn });
  
  if (SpribVcorn !== NRrezV) {
    console.warn('SpribVcorn should equal NRrezV');
  }
  
  {/* Создаем массив длиной NRrezV, где в каждом ряду по одной прибавке*/}
  const increases11 = new Array(NRrezV).fill(1);
  console.log('increases11 array:', increases11);
  
  const resultStringV11 = increases11.join(', ');
  console.log('resultStringV11:', resultStringV11);
  
  return {
    increases11,
    resultStringV11
  };
};

export const calculateVNeckIncreases22 = (NRrezV: number, PribRV2: number,SpribVcorn: number) => {
   
 
  const MR2 = Array.from({ length: PribRV2 }, (_, ra) => ra + 1);
  const MRN = Array.from({ length: NRrezV }, (_, rn) => rn + 1);
  
  const KVb = (NRrezV) / PribRV2;
  const PozS1 = MR2.map(ra => Math.floor(KVb * ra));
  const pozS1Set = new Set(PozS1);
  const PozS2 = MRN.filter(rb => !pozS1Set.has(rb));
  const pozS2Set = new Set(PozS2);
  
  const increases22 = Array.from({ length: NRrezV }, (_, index) => {
    const position = index + 1;
   
    if (pozS2Set.has(position)) {
      return 2;
    } else if (pozS1Set.has(position)) {
      return 2;
    } else {
      return 0; // Значение по умолчанию, если индекс не принадлежит ни одному из множеств
    }
  });
  
  const resultStringV22 = increases22.join(', ');
 
  
  
  return { 
    MR2,
    PozS1,
    PribRV2,
    increases22,
    resultStringV22 
  };
};

export const calculateVNeckIncreases23 = (NRrezV: number, PribRV2: number, SpribVcorn: number) => {
  console.log('calculateVNeckIncreases23 params:', { NRrezV, PribRV2, SpribVcorn });

  if (PribRV2 <= 0) {
    throw new Error('PribRV2 должен быть больше нуля для типа 2/3');
  }

  const MR2 = Array.from({ length: PribRV2 }, (_, ra) => ra + 1);
  const MRN = Array.from({ length: NRrezV }, (_, rn) => rn + 1);

  // Равномерно распределяем ряды с 2 прибавками по всей высоте резинки
  const KVb = NRrezV / PribRV2;
  const PozS2 = MR2.map(ra => Math.floor(KVb * ra)); // ряды с 2 прибавками
  const pozS2Set = new Set(PozS2);

  // Остальные ряды (в пределах NRrezV) будут с 3 прибавками
  const PozS3 = MRN.filter(rn => !pozS2Set.has(rn));
  const pozS3Set = new Set(PozS3);

  const increases23 = Array.from({ length: NRrezV }, (_, index) => {
    const position = index + 1;

    if (pozS2Set.has(position)) {
      return 2;
    } else if (pozS3Set.has(position)) {
      return 3;
    } else {
      return 0;
    }
  });

  const resultStringV23 = increases23.join(', ');

  return {
    MR2,
    PozS2,
    PozS3,
    PribRV2,
    increases23,
    resultStringV23
  };
};

{/*расчет рядов с прибавками для 1x2, 1x4 по линиям реглана*/}
export const calculateIncreaseRows1x2_1x4V = (
  NHFrontV: number,
  SfxV: number,
  PR_1x4_fV: number,
  PR_1x2_fV: number
) => {
  const KBv = SfxV / PR_1x4_fV;
  const Bv = Array.from({ length: PR_1x4_fV }, (_, b) => b + 1);
  const PozBv = Bv.map(b => Math.floor(KBv * b));
  
  const Av = Array.from({ length: PR_1x2_fV }, (_, a) => a + 1);
   {/* Создаем массив RowB для рядов с прибавками из PozB*/}
   const RowBv = PozBv.map((b, bIndex) => {
    const adjustedIndex = bIndex + 1; // Индексы начинаются с 1
    const row = (b - 1) * 2 + 1 + (adjustedIndex - 1) * 2;
    
    return row;
  });
  const RowNv = Array.from({ length: NHFrontV }, (_, i) => i + 1);

  {/* Удаляем элементы RowB и три следующих за каждым из них из RowN*/}
  RowBv.forEach(b => {
    for (let i = 0; i < 4; i++) { // Удаляем b и три следующих за ним
      const index = RowNv.indexOf(b + i);
      if (index !== -1) {
        RowNv.splice(index, 1);
      }
    }
  });

  {/* Создаем массив RowA из нечетных чисел RowN*/}
  const RowAv = RowNv.filter(n => n % 2 !== 0);

  {/* Объединяем RowA и RowB в RowPrib1x2_1x4*/}
  const RowPrib1x2_1x4V = [...RowAv, ...RowBv].sort((a, b) => a - b);

  {/* Преобразуем RowPrib1x2_1x4 в строку*/}
  const resultString24V = RowPrib1x2_1x4V.join(', ');

  return { PozBv, RowBv, RowNv, RowAv, RowPrib1x2_1x4V, resultString24V };
};



{/*расчет рядов с прибавками для 1x2, 1x3*/}
export const calculateIncreaseRows1x2_1x3V = (NHFrontV: number, SfxV: number, prib_1x3_fV: number, prib_1x2_fV: number) => {
  const KDv = SfxV / prib_1x3_fV;
  const Dv = Array.from({ length: prib_1x3_fV }, (_, d) => d + 1);
  const PozDv = Dv.map(d => Math.floor(KDv * d));
  
  const A2v = Array.from({ length: prib_1x2_fV }, (_, a) => a + 1);
   {/* Создаем массив RowD для рядов с прибавками из PozD*/}
   const RowDv = PozDv.map((d, dIndex) => {
    const adjustedIndex = dIndex + 1; // Индексы начинаются с 1
    const row = (d - 1) * 2 + 1 + (adjustedIndex - 1);
    
    return row;
  });
  const RowN23v = Array.from({ length: NHFrontV }, (_, i) => i + 1);

  {/* Удаляем элементы RowD и два следующих за каждым из них из RowN23*/}
  RowDv.forEach(d => {
    for (let i = 0; i < 3; i++) { // Удаляем d и две следующих за ним
      const index = RowN23v.indexOf(d + i);
      if (index !== -1) {
        RowN23v.splice(index, 1);
      }
    }
  });
  {/* Разбиваем RowN23 на пары и берем первые элементы каждой пары*/}
  const RowA23v = RowN23v.filter((_, index) => (index + 1) % 2 !== 0);

  const RowPrib1x2_1x3V = [...RowA23v, ...RowDv].sort((a, b) => a - b);

  const resultString23V = RowPrib1x2_1x3V.join(', ');

  return { PozDv, RowDv, RowN23v, RowA23v, RowPrib1x2_1x3V, resultString23V };
};

{/* конец расчета рядов с прибавками для 1x2, 1x3*/}

{/*расчет рядов с прибавками для 1x2, 1x1*/}
export const calculateIncreaseRows1x2_1x1V = (
  NHFrontV: number,
  SfxV: number,
  prib_1x1_fV: number,
  prib_1x2_fV: number
) => {
  const KCv = SfxV / prib_1x1_fV;
  const Cv = Array.from({ length: prib_1x1_fV }, (_, c) => c + 1);
  const PozCv = Cv.map(c => Math.floor(KCv * c));
  
  const A21v = Array.from({ length: prib_1x2_fV }, (_, a) => a + 1);
   {/* Создаем массив RowC для рядов с прибавками из PozC*/}
   const RowCv = PozCv.map((c, cIndex) => {
    const adjustedIndex = cIndex + 1; // Индексы начинаются с 1
    const row = (c - 1) * 2 + 1 - (adjustedIndex - 1);
    
    return row;
  });
  const RowN21v = Array.from({ length: NHFrontV }, (_, i) => i + 1);

  {/* Удаляем элементы RowC  из RowN*/}
  RowCv.forEach(c => {
    const index = RowN21v.indexOf(c);
    if (index !== -1) {
      RowN21v.splice(index, 1);
    }
  });
  {/* Разбиваем RowN на пары и берем первые элементы каждой пары*/}
  const RowA21v = RowN21v.filter((_, index) => (index + 1) % 2 !== 0);
  {/* Объединяем RowA21 и RowC в RowPrib1x2_1x1 и сортируем */}
  const RowPrib1x2_1x1V = [...RowA21v, ...RowCv].sort((a, b) => a - b);
  {/* Отладочный вывод для проверки содержимого RowPrib1x2_1x1*/}

  {/* Преобразуем RowPrib1x2_1x1 в строку */}
  const resultString21V = RowPrib1x2_1x1V.join(', ');

  return { PozCv, RowCv, RowN21v, RowA21v, RowPrib1x2_1x1V, resultString21V };
};

{/* конец расчета рядов с прибавками для 1x2, 1x1*/}

{/*расчет рядов с прибавками для 1x4, 1x3*/}

export const calculateIncreaseRows1x4_1x3V = (
  NHFrontV: number,
  SfxV: number,
  PRib_1x4_fV: number,
  PRib_1x3_fV: number
) => {
  {/* Вычисляем количество прибавок для 1x4 и 1x3*/}

  {/* Создаем массивы для прибавок*/}

  const KMv = SfxV / PRib_1x3_fV;
  const Mv = Array.from({ length: PRib_1x3_fV }, (_, m) => m + 1);
  const PozMv = Mv.map(m => Math.floor(KMv * m));
  
  const A34v = Array.from({ length: PRib_1x4_fV }, (_, a) => a + 1);
   {/* Создаем массив RowM для рядов с прибавками из PozM*/}
   const RowMv = PozMv.map((m, mIndex) => {
    const adjustedIndex = mIndex + 1; // Индексы начинаются с 1
    const row = (m - 1) * 4 + 1 - (adjustedIndex - 1);
    
    return row;
  });

  const RowN43v = Array.from({ length: NHFrontV }, (_, i) => i + 1);

  {/* Удаляем элементы RowM и два следующих за каждым из них из RowN43*/}
  RowMv.forEach(m => {
    for (let i = 0; i < 3; i++) { // Удаляем m и два следующих за ним
      const index = RowN43v.indexOf(m + i);
      if (index !== -1) {
        RowN43v.splice(index, 1);
      }
    }
  });

  {/* Разбиваем RowN43 на четверки и берем первые элементы каждой четверки*/}
  const RowA43v = [];
  for (let i = 0; i < RowN43v.length; i += 4) {
    RowA43v.push(RowN43v[i]);
  }

  const RowPRib1x4_1x3V = [...RowA43v, ...RowMv].sort((a, b) => a - b);

  const resultString43V = RowPRib1x4_1x3V.join(', ');

  return { PozMv, RowMv, RowN43v, RowA43v, RowPRib1x4_1x3V, resultString43V };
};


{/* конец расчета рядов с прибавками для 1x4, 1x3*/}

export const determineIncreaseType = (NHFrontV: number, SfxV: number): string => {
  if (SfxV === NHFrontV) {
    return '1x1'; // Прибавка 1 петля в каждом ряду
  } else if (SfxV === Math.floor(NHFrontV/2)) {
    return '1x2'; // Прибавка 1 петля каждые 2 ряда
  } else if (SfxV === Math.floor(NHFrontV/3)) {
    return '1x3'; // Прибавка 1 петля каждые 3 ряда
  } else if (SfxV === Math.floor(NHFrontV/4)) {
    return '1x4'; // Прибавка 1 петля каждые 4 ряда
  } else {
    return 'custom'; // Другой тип прибавок
  }
};
