import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { Platform } from "react-native";
import onboardingState from '@/state/onboardingState';

const next = {
  en: "Next",
  ru: "Далее",
  sv: "Nästa",
  no: "Neste",
  fi: "Seuraava",
  de: "Nächste",
  fr: "Suivant",
  es: "Siguiente",
  ja: "次へ",
  cs: "Následující",
  bg: "Следващ",
  sk: "Nasledujúci",
  ko: "다음",
  tr: "Sonraki",
  ar: "التالي",
  pt: "Próximo",
  lt: "Kitas",
};

const calculate = {
  en: "Calculate",
  ru: "Рассчитать",
  sv: "Beräkna",
  no: "Beregn",
  fi: "Laske",
  de: "Berechnen",
  fr: "Calculer",
  es: "Calcular",
  ja: "計算",
  cs: "Vypočítat",
  bg: "Изчисляване",
  sk: "Vypočítať",
  ko: "계산",
  tr: "Hesapla",
  ar: "حساب",
  pt: "Calcular",
  lt: "Apskaičiuoti",
};

const chooseStyle = {
  en: "Choose Your Style",
  ru: "Выберите ваш стиль",
  sv: "Välj din stil",
  no: "Velg din stil",
  fi: "Valitse stilisi",
  de: "Wählen Sie Ihren Stil",
  fr: "Choisissez votre style",
  es: "Elige tu estilo",
  ja: "スタイルを選択",
  cs: "Vyberte svůj styl",
  bg: "Изберете вашия стил",
  sk: "Vyberte svoj styl",
  ko: "스타일 선택",
  tr: "Stilinizi seçin",
  ar: "اختر أسلوبك",
  pt: "Escolha seu estilo",
  lt: "Pasirinkite savo stili",
};

const regularCollar = {
  en: "Regular Collar",
  ru: "Круглый вырез",
  sv: "Rund halsringning",
  no: "Rund hals",
  fi: "Pyöreä pääntie",
  de: "Rundhalsausschnitt",
  fr: "Col rond",
  es: "Cuello redondo",
  ja: "ラウンドネック",
  cs: "Kulatý výstřih",
  bg: "Обло деколте",
  sk: "Okrúhly výstrih",
  ko: "라운드넥",
  tr: "Yuvarlak yaka",
  ar: "رقبة دائرية",
  pt: "Gola redonda",
  lt: "Apvali iškirptė",
};

const vNeck = {
  en: "V-Neck",
  ru: "V-образный вырез",
  sv: "V-ringad",
  no: "V-hals",
  fi: "V-pääntie",
  de: "V-Ausschnitt",
  fr: "Col en V",
  es: "Cuello en V",
  ja: "Vネック",
  cs: "Výstřih do V",
  bg: "V-образно деколте",
  sk: "V výstrih",
  ko: "브이넥",
  tr: "V yaka",
  ar: "رقبة على شكل V",
  pt: "Decote em V",
  lt: "V formos iškirptė",
};

const onboardingLanguage = {
  en: "Choose Your Language",
  ru: "Выберите язык",
  sv: "Välj ditt språk",
  no: "Velg ditt språk",
  fi: "Valitse kieli",
  de: "Wählen Sie Ihre Sprache",
  fr: "Choisissez votre langue",
  es: "Elige tu idioma",
  ja: "言語を選択",
  cs: "Vyberte svůj jazyk",
  bg: "Изберете вашия език",
  sk: "Vyberte svoj jazyk",
  ko: "언어 선택",
  tr: "Dilinizi seçin",
  ar: "اختر لغتك",
  pt: "Escolha seu idioma",
  lt: "Pasirinkite kalbą"
};

const settings = {
  en: "Settings",
  ru: "Настройки",
  sv: "Inställningar",
  no: "Innstillinger",
  fi: "Asetukset",
  de: "Einstellungen",
  fr: "Paramètres",
  es: "Ajustes",
  ja: "設定",
  cs: "Nastavení",
  bg: "Настройки",
  sk: "Nastavenia",
  ko: "설정",
  tr: "Ayarlar",
  ar: "الإعدادات",
  pt: "Configurações",
  lt: "Nustatymai",
};

const headCircumference = {
  en: "Head Circumference",
  ru: "Обхват головы",
  sv: "Huvudomkrets",
  no: "Hovedomkrets",
  fi: "Pääympärys",
  de: "Kopfumfang",
  fr: "Circonférence de la tête",
  es: "Circunferencia de la cabeza",
  ja: "頭周り",
  cs: "Obvod hlavy",
  bg: "Обиколка на главата",
  sk: "Obvod hlavy",
  ko: "머리 둘레",
  tr: "Baş çevresi",
  ar: "محيط الرأس",
  pt: "Circunferência da cabeça",
  lt: "Galvos apimtis",
};

const neckCircumference = {
  en: "Neck Circumference",
  ru: "Обхват шеи",
  sv: "Halsomkrets",
  no: "Halsomkrets",
  fi: "Kaulanympärys",
  de: "Halsumfang",
  fr: "Circonférence du cou",
  es: "Circunferencia del cuello",
  ja: "首周り",
  cs: "Obvod krku",
  bg: "Обиколка на врата",
  sk: "Obvod krku",
  ko: "목 둘레",
  tr: "Boyun çevresi",
  ar: "محيط العنق",
  pt: "Circunferência do pescoço",
  lt: "Kaklo apimtis",
};

const chestCircumference = {
  en: "Chest Circumference",
  ru: "Обхват груди",
  sv: "Bröstomkrets",
  no: "Brystomkrets",
  fi: "Rinnan ympärys",
  de: "Brustumfang",
  fr: "Tour de poitrine",
  es: "Circunferencia del pecho",
  ja: "胸囲",
  cs: "Obvod hrudníku",
  bg: "Обиколка на гърдите",
  sk: "Obvod hrudníka",
  ko: "가슴 둘레",
  tr: "Göğüs çevresi",
  ar: "محيط الصدر",
  pt: "Circunferência do peito",
  lt: "Krūtinės apimtis",
};

const rowDensityCM = {
  en: "Row Density (rows in 10 cm)",
  ru: "Плотность вязания (ряды в 10 см)",
  sv: "Masktäthet (maskor i 10 cm)",
  no: "Masketetthet (masker i 10 cm)",
  fi: "Tiheys (silmukat 10 cm)",
  de: "Maschendichte (Maschen in 10 cm)",
  fr: "Densité de mailles (mailles en 10 cm)",
  es: "Densidad de puntos (puntos en 10 cm)",
  ja: "密度 (10 cmあたりの行数)",
  cs: "Hustota (řady v 10 cm)",
  bg: "Плътност на плетене (редове в 10 см)",
  sk: "Hustota (riadky v 10 cm)",
  ko: "밀도 (10 cm당 행 수)",
  tr: "Sıra Yoğunluğu (10 cm'de sıralar)",
  ar: "كثافة الصفوف (صفوف في 10 سم)",
  pt: "Densidade de pontos (pontos em 10 cm)",
  lt: "Tankis (eilutės 10 cm)",
};

const rowDensityIN = {
  en: "Row Density (rows in 4 in)",
  ru: "Плотность вязания (ряды в 4 дюймах)",
  sv: "Masktäthet (rader i 4 tum)",
  no: "Masketetthet (rader i 4 tommer)",
  fi: "Tiheys (rivit 4 tuumaa)",
  de: "Reihendichte (Reihen in 4 Zoll)",
  fr: "Densité de rangs (rangs en 4 pouces)",
  es: "Densidad de filas (filas en 4 pulgadas)",
  ja: "密度 (4インチあたりの行数)",
  cs: "Hustota řad (řady ve 4 palcích)",
  bg: "Плътност на редовете (редове в 4 инча)",
  sk: "Hustota riadkov (riadky v 4 palcoch)",
  ko: "행 밀도 (4인치당 행 수)",
  tr: "Sıra Yoğunluğu (4 inçteki sıralar)",
  ar: "كثافة الصفوف (صفوف في 4 بوصات)",
  pt: "Densidade de fileiras (fileiras em 4 polegadas)",
  lt: "Eilučių tankis (eilutės 4 coliuose)",
};

const stitchDensityCM = {
  en: "Stitch Density (stitches in 10 cm)",
  ru: "Плотность вязания (петли в 10 см)",
  sv: "Masktäthet (maskor i 10 cm)",
  no: "Masketetthet (masker i 10 cm)",
  fi: "Silmätiheys (silmukat 10 cm)",
  de: "Maschendichte (Maschen in 10 cm)",
  fr: "Densité de mailles (mailles en 10 cm)",
  es: "Densidad de puntadas (puntadas en 10 cm)",
  ja: "ステッチ密度 (10 cmあたりのステッチ数)",
  cs: "Hustota stehů (stehy v 10 cm)",
  bg: "Плътност на шевовете (шевове в 10 см)",
  sk: "Hustota stehov (stehy v 10 cm)",
  ko: "스티치 밀도 (10 cm당 스티치 수)",
  tr: "Dikiş Yoğunluğu (10 cm'de dikişler)",
  ar: "كثافة الغرز (غرز في 10 سم)",
  pt: "Densidade de pontos (pontos em 10 cm)",
  lt: "Siūlių tankis (siūlės 10 cm)",
};

const stitchDensityIN = {
  en: "Stitch Density (stitches in 4 in)",
  ru: "Плотность вязания (петли в 4 дюймах)",
  sv: "Masktäthet (maskor i 4 tum)",
  no: "Masketetthet (masker i 4 tommer)",
  fi: "Silmätiheys (silmukat 4 tuumaa)",
  de: "Maschendichte (Maschen in 4 Zoll)",
  fr: "Densité de mailles (mailles en 4 pouces)",
  es: "Densidad de puntadas (puntadas en 4 pulgadas)",
  ja: "ステッチ密度 (4インチあたりのステッチ数)",
  cs: "Hustota stehů (stehy ve 4 palcích)",
  bg: "Плътност на шевовете (шевове в 4 инча)",
  sk: "Hustota stehov (stehy v 4 palcoch)",
  ko: "스티치 밀도 (4인치당 스티치 수)",
  tr: "Dikiş Yoğunluğu (4 inçte dikişler)",
  ar: "كثافة الغرز (غرز في 4 بوصات)",
  pt: "Densidade de pontos (pontos em 4 polegadas)",
  lt: "Siūlių tankis (siūlės 4 coliuose)",
};

const measurementSystem = {
  en: "Measurement System",
  ru: "Система измерения",
  sv: "Måttsystem",
  no: "Måttsystem",
  fi: "Mittayksikköjärjestelmä",
  de: "Maßsystem",
  fr: "Système de mesure",
  es: "Sistema de medida",
  ja: "測定システム",
  cs: "Měřicí systém",
  bg: "Система за измерване",
  sk: "Merná sústava",
  ko: "측정 시스템",
  tr: "Ölçü sistem",
  ar: "نظام القياس",
  pt: "Sistema de medida",
  lt: "Matavimo sistema",
};

const language = {
  en: "Language",
  ru: "Язык",
  sv: "Språk",
  no: "Språk",
  fi: "Kieli",
  de: "Sprache",
  fr: "Langue",
  es: "Idioma",
  ja: "言語",
  cs: "Jazyk",
  bg: "Език",
  sk: "Jazyk",
  ko: "언어",
  tr: "Dil",
  ar: "لغة",
  pt: "Idioma",
  lt: "Kalba",
};

const imperial = {
  en: "Imperial",
  ru: "Имперская",
  sv: "Imperial",
  no: "Imperial",
  fi: "Imperial",
  de: "Imperial",
  fr: "Impérial",
  es: "Imperial",
  ja: "ヤード・ポンド法",
  cs: "Imperiální",
  bg: "Имперска",
  sk: "Imperiálna",
  ko: "영국식",
  tr: "İngiliz",
  ar: "إمبراطوري",
  pt: "Imperial",
  lt: "Imperialinė",
};

const metric = {
  en: "Metric",
  ru: "Метрическая",
  sv: "Metrisk",
  no: "Metrisk",
  fi: "Metrinen",
  de: "Metrisch",
  fr: "Métrique",
  es: "Métrico",
  ja: "メートル法",
  cs: "Metrický",
  bg: "Метрична",
  sk: "Metrický",
  ko: "메터법",
  tr: "Metrik",
  ar: "متري",
  pt: "Métrico",
  lt: "Metrinis",
};

const startKnitting = {
  en: "Start Knitting",
  ru: "Начать вязание",
  sv: "Börja sticka",
  no: "Start sticka",
  fi: "Aloita neulominen",
  de: "Anfangen zu nähen",
  fr: "Commencer à tricoter",
  es: "Comenzar a tejer",
  ja: "編み始める",
  cs: "Začít pletení",
  bg: "Започни вязане",
  sk: "Začať pletať",
  ko: "뜨기 시작하기",
  tr: "Başlamak",
  ar: "ابدأ التريك",
  pt: "Começar a tricotar",
  lt: "Pradėti plėstis",
};

const newStyle = {
  en: "New Style",
  ru: "Новый фасон",
  sv: "Ny stil",
  no: "Ny stil",
  fi: "Uusi tyyli",
  de: "Neuer Stil",
  fr: "Nouveau style",
  es: "Nuevo estilo",
  ja: "新しいスタイル",
  cs: "Nový styl",
  bg: "Нов стил",
  sk: "Nový štýl",
  ko: "새로운 스타일",
  tr: "Yeni stil",
  ar: "نمط جديد",
  pt: "Novo estilo",
  lt: "Naujas stilius",
};

// Create translations object with all supported languages
const mergedTranslations = Object.keys(onboardingLanguage).reduce((acc, key) => {
  return {
    ...acc,
    [key]: {
      onboardingLanguage: onboardingLanguage[key],
      measurementSystem: measurementSystem[key],
      language: language[key],
      imperial: imperial[key],
      metric: metric[key],
      settings: settings[key],
      headCircumference: headCircumference[key],
      neckCircumference: neckCircumference[key],
      chestCircumference: chestCircumference[key],
      rowDensityCM: rowDensityCM[key],
      rowDensityIN: rowDensityIN[key],
      stitchDensityCM: stitchDensityCM[key],
      stitchDensityIN: stitchDensityIN[key],
      next: next[key],
      calculate: calculate[key],
      chooseStyle: chooseStyle[key],
      vNeck: vNeck[key],
      regularCollar: regularCollar[key],
      startKnitting: startKnitting[key],
      newStyle: newStyle[key],
      // Add other translations here as needed
    }
  };
}, {});

const i18n = new I18n(mergedTranslations);

export function updateLocale(locale: string) {
  i18n.locale = locale;
}

i18n.locale = onboardingState.language || Localization.locale;

export default i18n;
