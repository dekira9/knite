{
    /*расчет рядов с прибавками для 1x2, 1x4*/
}
export const calculateIncreaseRows1x2_1x4 = (
    NHFront: number,
    Sfx: number,
    PR_1x4_f: number,
    PR_1x2_f: number
  ) => {
    const KB = Sfx / PR_1x4_f;
    const B = Array.from({ length: PR_1x4_f }, (_, b) => b + 1);
    const PozB = B.map((b) => Math.floor(KB * b));
  
    const A = Array.from({ length: PR_1x2_f }, (_, a) => a + 1);
    {
      /* Создаем массив RowB для рядов с прибавками из PozB*/
    }
    const RowB = PozB.map((b, bIndex) => {
      const adjustedIndex = bIndex + 1; // Индексы начинаются с 1
      const row = (b - 1) * 2 + 1 + (adjustedIndex - 1) * 2;
  
      return row;
    });
    const RowN = Array.from({ length: NHFront }, (_, i) => i + 1);
  
    {
      /* Удаляем элементы RowB и три следующих за каждым из них из RowN*/
    }
    RowB.forEach((b) => {
      for (let i = 0; i < 4; i++) {
        // Удаляем b и три следующих за ним
        const index = RowN.indexOf(b + i);
        if (index !== -1) {
          RowN.splice(index, 1);
        }
      }
    });
  
    {
      /* Создаем массив RowA из нечетных чисел RowN*/
    }
    const RowA = RowN.filter((n) => n % 2 !== 0);
  
    {
      /* Объединяем RowA и RowB в RowPrib1x2_1x4*/
    }
    const RowPrib1x2_1x4 = [...RowA, ...RowB].sort((a, b) => a - b);
  
    {
      /* Преобразуем RowPrib1x2_1x4 в строку*/
    }
    const resultString24 = RowPrib1x2_1x4.join(', ');
  
    return { PozB, RowB, RowN, RowA, RowPrib1x2_1x4, resultString24 };
  };

{
/*расчет рядов с прибавками для 1x2, 1x3*/
}
export const calculateIncreaseRows1x2_1x3 = (
  NHFront: number,
  Sfx: number,
  prib_1x3_f: number,
  prib_1x2_f: number
) => {
  const KD = Sfx / prib_1x3_f;
  const D = Array.from({ length: prib_1x3_f }, (_, d) => d + 1);
  const PozD = D.map((d) => Math.floor(KD * d));

  const A2 = Array.from({ length: prib_1x2_f }, (_, a) => a + 1);
  {
    /* Создаем массив RowD для рядов с прибавками из PozD*/
  }
  const RowD = PozD.map((d, dIndex) => {
    const adjustedIndex = dIndex + 1; // Индексы начинаются с 1
    const row = (d - 1) * 2 + 1 + (adjustedIndex - 1);

    return row;
  });
  const RowN23 = Array.from({ length: NHFront }, (_, i) => i + 1);

  {
    /* Удаляем элементы RowD и два следующих за каждым из них из RowN23*/
  }
  RowD.forEach((d) => {
    for (let i = 0; i < 3; i++) {
      // Удаляем d и две следующих за ним
      const index = RowN23.indexOf(d + i);
      if (index !== -1) {
        RowN23.splice(index, 1);
      }
    }
  });
  {
    /* Разбиваем RowN23 на пары и берем первые элементы каждой пары*/
  }
  const RowA23 = RowN23.filter((_, index) => (index + 1) % 2 !== 0);

  const RowPrib1x2_1x3 = [...RowA23, ...RowD].sort((a, b) => a - b);

  const resultString23 = RowPrib1x2_1x3.join(', ');

  return { PozD, RowD, RowN23, RowA23, RowPrib1x2_1x3, resultString23 };
};

{
    /*расчет рядов с прибавками для 1x2, 1x1*/
}
export const calculateIncreaseRows1x2_1x1 = (
    NHFront: number,
    Sfx: number,
    prib_1x1_f: number,
    prib_1x2_f: number
) => {
    const KC = Sfx / prib_1x1_f;
    const C = Array.from({ length: prib_1x1_f }, (_, c) => c + 1);
    const PozC = C.map((c) => Math.floor(KC * c));

    const A21 = Array.from({ length: prib_1x2_f }, (_, a) => a + 1);
    {
        /* Создаем массив RowC для рядов с прибавками из PozC*/
    }
    const RowC = PozC.map((c, cIndex) => {
        const adjustedIndex = cIndex + 1; // Индексы начинаются с 1
        const row = (c - 1) * 2 + 1 - (adjustedIndex - 1);

        return row;
    });
    const RowN21 = Array.from({ length: NHFront }, (_, i) => i + 1);

    {
        /* Удаляем элементы RowC  из RowN*/
    }
    RowC.forEach((c) => {
        const index = RowN21.indexOf(c);
        if (index !== -1) {
        RowN21.splice(index, 1);
        }
    });
    {
        /* Разбиваем RowN на пары и берем первые элементы каждой пары*/
    }
    const RowA21 = RowN21.filter((_, index) => (index + 1) % 2 !== 0);
    {
        /* Объединяем RowA21 и RowC в RowPrib1x2_1x1 и сортируем */
    }
    const RowPrib1x2_1x1 = [...RowA21, ...RowC].sort((a, b) => a - b);
    {
        /* Отладочный вывод для проверки содержимого RowPrib1x2_1x1*/
    }

    {
        /* Преобразуем RowPrib1x2_1x1 в строку */
    }
    const resultString21 = RowPrib1x2_1x1.join(', ');

    return { PozC, RowC, RowN21, RowA21, RowPrib1x2_1x1, resultString21 };
};

{
    /*расчет рядов с прибавками для 1x4, 1x3*/
}

  export const calculateIncreaseRows1x4_1x3 = (
    NHFront: number,
    Sfx: number,
    PRib_1x4_f: number,
    PRib_1x3_f: number
  ) => {
    {
      /* Вычисляем количество прибавок для 1x4 и 1x3*/
    }
  
    {
      /* Создаем массивы для прибавок*/
    }
  
    const KM = Sfx / PRib_1x3_f;
    const M = Array.from({ length: PRib_1x3_f }, (_, m) => m + 1);
    const PozM = M.map((m) => Math.floor(KM * m));
  
    const A34 = Array.from({ length: PRib_1x4_f }, (_, a) => a + 1);
    {
      /* Создаем массив RowM для рядов с прибавками из PozM*/
    }
    const RowM = PozM.map((m, mIndex) => {
      const adjustedIndex = mIndex + 1; // Индексы начинаются с 1
      const row = (m - 1) * 4 + 1 - (adjustedIndex - 1);
  
      return row;
    });
  
    const RowN43 = Array.from({ length: NHFront }, (_, i) => i + 1);
  
    {
      /* Удаляем элементы RowM и два следующих за каждым из них из RowN43*/
    }
    RowM.forEach((m) => {
      for (let i = 0; i < 3; i++) {
        // Удаляем m и два следующих за ним
        const index = RowN43.indexOf(m + i);
        if (index !== -1) {
          RowN43.splice(index, 1);
        }
      }
    });
  
    {
      /* Разбиваем RowN43 на четверки и берем первые элементы каждой четверки*/
    }
    const RowA43 = [];
    for (let i = 0; i < RowN43.length; i += 4) {
      RowA43.push(RowN43[i]);
    }
  
    const RowPRib1x4_1x3 = [...RowA43, ...RowM].sort((a, b) => a - b);
  
    const resultString43 = RowPRib1x4_1x3.join(', ');
  
    return { PozM, RowM, RowN43, RowA43, RowPRib1x4_1x3, resultString43 };
  };
  
  {
    /* конец расчета рядов с прибавками для 1x4, 1x3*/
  }

  export const determineIncreaseType = (NHFront: number, Sfx: number): string => {
    if (Sfx === NHFront) {
      return '1x1'; // Прибавка 1 петля в каждом ряду
    } else if (Sfx === Math.floor(NHFront/2)) {
      return '1x2'; // Прибавка 1 петля каждые 2 ряда
    } else if (Sfx === Math.floor(NHFront/3)) {
      return '1x3'; // Прибавка 1 петля каждые 3 ряда
    } else if (Sfx === Math.floor(NHFront/4)) {
      return '1x4'; // Прибавка 1 петля каждые 4 ряда
    } else {
      return 'custom'; // Другой тип прибавок
    }
  };{/*прибавки в углу резинки V*/}
