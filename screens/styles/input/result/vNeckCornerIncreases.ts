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
  RowPribRV2: number,
  SpribVcorn: number
  
) => {
  if (RowPribRV1 <= 0) {
    console.warn("RowPribRV1 равен " + RowPribRV1 + ", возвращаем пустой результат");
    const increases12 = Array.from({ length: NRrezV }, () => 2);
    const resultStringV12 = increases12.join(', ');
    return { increases12, resultStringV12, PozS1: [], PozS2: [], RowPribRV1, RowPribRV2 };
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

export const calculateVNeckIncreases23 = (
  NRrezV: number,
  RowPribRV2: number,
  RowPribRV3: number
) => {
  if (RowPribRV2 <= 0) {
    console.warn("RowPribRV2 равен " + RowPribRV2 + ", возвращаем пустой результат");
    const increases23 = Array.from({ length: NRrezV }, () => 3);
    const resultStringV23 = increases23.join(', ');
    return { increases23, resultStringV23, PozS2: [], PozS3: [], RowPribRV2, RowPribRV3 };
  }
  const MR3 = Array.from({ length: RowPribRV3 }, (_, rb) => rb + 1);
  const MR2 = Array.from({ length: RowPribRV2 }, (_, ra) => ra + 1);
  const MRN = Array.from({ length: NRrezV }, (_, rn) => rn + 1);
  
  const KVb = (NRrezV) / RowPribRV2;
  const PozS2 = MR2.map(ra => Math.floor(KVb * ra));
  const pozS2Set = new Set(PozS2);
  const PozS3 = MRN.filter(rn => !pozS2Set.has(rn));
  const pozS3Set = new Set(PozS3);
  
  const increases23 = Array.from({ length: NRrezV }, (_, index) => {
    const position = index + 1;
    if (pozS3Set.has(position)) {
      return 3;
    } else if (pozS2Set.has(position)) {
      return 2;
    } else {
      return 0;
    }
  });
  
  const resultStringV23 = increases23.join(', ');

  return { 
    MR3,
    MR2,
    PozS2,
    PozS3,
    RowPribRV2,
    RowPribRV3,
    increases23,
    resultStringV23
  };
};


export const calculateVNeckIncreases11 = (NRrezV: number, PribRV1: number, SpribVcorn: number) => {
  
  if (SpribVcorn !== NRrezV) {
    console.warn('SpribVcorn should equal NRrezV');
  }
  
  {/* Создаем массив длиной NRrezV, где в каждом ряду по одной прибавке*/}
  const increases11 = new Array(NRrezV).fill(1);
  
  const resultStringV11 = increases11.join(', ');
  
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

{/*расчет рядов с прибавками для 1x2, 1x4 по линиям реглана*/}
