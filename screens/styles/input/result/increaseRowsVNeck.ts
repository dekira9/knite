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


{/* конец расчета рядов с прибавками для 1x4, 1x3 (V)*/}
