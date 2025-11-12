import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "es" | "fr" | "de" | "pt" | "zh";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    compare: "Compare",
    
    // Index page
    analyzeForests: "Analyze Forest Data",
    location: "Location",
    enterLocation: "Enter a location to analyze",
    startYear: "Start Year",
    endYear: "End Year",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    searchingLocation: "Searching location...",
    
    // Results
    results: "Results",
    deforestationTrends: "Deforestation Trends",
    climateData: "Climate Data",
    statistics: "Statistics",
    exportPDF: "Export PDF",
    share: "Share",
    
    // Messages
    locationRequired: "Location Required",
    enterLocationToAnalyze: "Please enter a location to analyze",
    invalidDateRange: "Invalid Date Range",
    startYearBeforeEnd: "Start year must be before end year",
    analysisComplete: "Analysis Complete",
    analysisCompleteMessage: "Successfully analyzed {location} from {startYear} to {endYear}",
    
    // Common
    year: "Year",
    hectares: "Hectares",
    temperature: "Temperature",
    precipitation: "Precipitation",
    loading: "Loading...",
    language: "Language",
  },
  es: {
    home: "Inicio",
    about: "Acerca de",
    compare: "Comparar",
    
    analyzeForests: "Analizar Datos Forestales",
    location: "Ubicación",
    enterLocation: "Ingrese una ubicación para analizar",
    startYear: "Año de Inicio",
    endYear: "Año Final",
    analyze: "Analizar",
    analyzing: "Analizando...",
    searchingLocation: "Buscando ubicación...",
    
    results: "Resultados",
    deforestationTrends: "Tendencias de Deforestación",
    climateData: "Datos Climáticos",
    statistics: "Estadísticas",
    exportPDF: "Exportar PDF",
    share: "Compartir",
    
    locationRequired: "Ubicación Requerida",
    enterLocationToAnalyze: "Por favor, ingrese una ubicación para analizar",
    invalidDateRange: "Rango de Fechas Inválido",
    startYearBeforeEnd: "El año de inicio debe ser anterior al año final",
    analysisComplete: "Análisis Completo",
    analysisCompleteMessage: "Se analizó correctamente {location} de {startYear} a {endYear}",
    
    year: "Año",
    hectares: "Hectáreas",
    temperature: "Temperatura",
    precipitation: "Precipitación",
    loading: "Cargando...",
    language: "Idioma",
  },
  fr: {
    home: "Accueil",
    about: "À Propos",
    compare: "Comparer",
    
    analyzeForests: "Analyser les Données Forestières",
    location: "Localisation",
    enterLocation: "Entrez un emplacement à analyser",
    startYear: "Année de Début",
    endYear: "Année de Fin",
    analyze: "Analyser",
    analyzing: "Analyse en cours...",
    searchingLocation: "Recherche de localisation...",
    
    results: "Résultats",
    deforestationTrends: "Tendances de la Déforestation",
    climateData: "Données Climatiques",
    statistics: "Statistiques",
    exportPDF: "Exporter en PDF",
    share: "Partager",
    
    locationRequired: "Localisation Requise",
    enterLocationToAnalyze: "Veuillez entrer une localisation à analyser",
    invalidDateRange: "Plage de Dates Invalide",
    startYearBeforeEnd: "L'année de début doit être antérieure à l'année de fin",
    analysisComplete: "Analyse Terminée",
    analysisCompleteMessage: "Analyse réussie de {location} de {startYear} à {endYear}",
    
    year: "Année",
    hectares: "Hectares",
    temperature: "Température",
    precipitation: "Précipitations",
    loading: "Chargement...",
    language: "Langue",
  },
  de: {
    home: "Startseite",
    about: "Über Uns",
    compare: "Vergleichen",
    
    analyzeForests: "Walddaten Analysieren",
    location: "Standort",
    enterLocation: "Geben Sie einen Standort zur Analyse ein",
    startYear: "Startjahr",
    endYear: "Endjahr",
    analyze: "Analysieren",
    analyzing: "Analysieren läuft...",
    searchingLocation: "Standort wird gesucht...",
    
    results: "Ergebnisse",
    deforestationTrends: "Entwaldungstrends",
    climateData: "Klimadaten",
    statistics: "Statistiken",
    exportPDF: "Als PDF exportieren",
    share: "Teilen",
    
    locationRequired: "Standort Erforderlich",
    enterLocationToAnalyze: "Bitte geben Sie einen Standort zur Analyse ein",
    invalidDateRange: "Ungültige Datumsbereich",
    startYearBeforeEnd: "Das Startjahr muss vor dem Endjahr liegen",
    analysisComplete: "Analyse Abgeschlossen",
    analysisCompleteMessage: "Erfolgreich analysiert {location} von {startYear} bis {endYear}",
    
    year: "Jahr",
    hectares: "Hektar",
    temperature: "Temperatur",
    precipitation: "Niederschlag",
    loading: "Wird geladen...",
    language: "Sprache",
  },
  pt: {
    home: "Início",
    about: "Sobre",
    compare: "Comparar",
    
    analyzeForests: "Analisar Dados Florestais",
    location: "Localização",
    enterLocation: "Digite uma localização para analisar",
    startYear: "Ano Inicial",
    endYear: "Ano Final",
    analyze: "Analisar",
    analyzing: "Analisando...",
    searchingLocation: "Procurando localização...",
    
    results: "Resultados",
    deforestationTrends: "Tendências de Desmatamento",
    climateData: "Dados Climáticos",
    statistics: "Estatísticas",
    exportPDF: "Exportar PDF",
    share: "Compartilhar",
    
    locationRequired: "Localização Obrigatória",
    enterLocationToAnalyze: "Por favor, digite uma localização para analisar",
    invalidDateRange: "Intervalo de Datas Inválido",
    startYearBeforeEnd: "O ano inicial deve ser anterior ao ano final",
    analysisComplete: "Análise Completa",
    analysisCompleteMessage: "Análise bem-sucedida de {location} de {startYear} a {endYear}",
    
    year: "Ano",
    hectares: "Hectares",
    temperature: "Temperatura",
    precipitation: "Precipitação",
    loading: "Carregando...",
    language: "Idioma",
  },
  zh: {
    home: "主页",
    about: "关于",
    compare: "比较",
    
    analyzeForests: "分析森林数据",
    location: "位置",
    enterLocation: "输入要分析的位置",
    startYear: "开始年份",
    endYear: "结束年份",
    analyze: "分析",
    analyzing: "分析中...",
    searchingLocation: "正在搜索位置...",
    
    results: "结果",
    deforestationTrends: "森林砍伐趋势",
    climateData: "气候数据",
    statistics: "统计数据",
    exportPDF: "导出PDF",
    share: "分享",
    
    locationRequired: "需要位置",
    enterLocationToAnalyze: "请输入要分析的位置",
    invalidDateRange: "无效的日期范围",
    startYearBeforeEnd: "开始年份必须早于结束年份",
    analysisComplete: "分析完成",
    analysisCompleteMessage: "成功分析 {location} 从 {startYear} 到 {endYear}",
    
    year: "年份",
    hectares: "公顷",
    temperature: "温度",
    precipitation: "降水量",
    loading: "加载中...",
    language: "语言",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("ecolens-language");
    return (saved as Language) || "en";
  });

  const t = (key: string, replacements?: Record<string, string>): string => {
    let value = translations[language]?.[key] || translations.en[key] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, replacement]) => {
        value = value.replace(`{${placeholder}}`, replacement);
      });
    }
    
    return value;
  };

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("ecolens-language", newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
