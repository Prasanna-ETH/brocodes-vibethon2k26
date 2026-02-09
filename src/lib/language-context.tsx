import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'en' | 'ta';

interface TranslationDict {
    [key: string]: {
        en: string;
        ta: string;
    };
}

const translations: TranslationDict = {
    // Common
    'nav.home': { en: 'Home', ta: 'முகப்பு' },
    'nav.report': { en: 'Report', ta: 'புகார் செய்' },
    'nav.track': { en: 'Track', ta: 'கண்காணி' },
    'nav.dashboard': { en: 'Dashboard', ta: 'தகவல் பலகை' },
    'nav.admin': { en: 'Admin', ta: 'நிர்வாகம்' },
    'nav.logout': { en: 'Logout', ta: 'வெளியேறு' },

    // Auth
    'auth.title': { en: 'Sign In', ta: 'உள்நுழைய' },
    'auth.subtitle': { en: 'Rescue with ResQ AI', ta: 'ResQ AI உடன் மீட்பு பணியில் சேரவும்' },
    'auth.email': { en: 'Email', ta: 'மின்னஞ்சல்' },
    'auth.password': { en: 'Password', ta: 'கடவுச்சொல்' },
    'auth.login': { en: 'Login', ta: 'உள்நுழை' },
    'auth.create_account': { en: 'Create Account', ta: 'கணக்கை உருவாக்கவும்' },
    'auth.welcome_back': { en: 'Welcome Back', ta: 'மீண்டும் வருக' },
    'auth.citizen_login': { en: 'Citizen Login', ta: 'குடிமகன் உள்நுழைவு' },
    'auth.responder_login': { en: 'Responder Login', ta: 'பதிலளிப்பவர் உள்நுழைவு' },
    'auth.demo.citizen': { en: 'Demo Citizen', ta: 'டெமோ குடிமகன்' },
    'auth.demo.admin': { en: 'Demo Admin', ta: 'டெமோ நிர்வாகி' },

    // Dashboard
    'dash.welcome': { en: 'Welcome back', ta: 'மீண்டும் வருக' },
    'dash.active_reports': { en: 'Active Reports', ta: 'செயலில் உள்ள புகார்கள்' },
    'dash.resolved': { en: 'Resolved', ta: 'தீர்க்கப்பட்டது' },
    'dash.community_alerts': { en: 'Community Alerts', ta: 'சமூக விழிப்பூட்டல்கள்' },
    'dash.report_emergency': { en: 'Report an Emergency', ta: 'அவசரகால புகாரை அளியுங்கள்' },
    'dash.report_desc': { en: 'AI will analyze and route to correct teams instantly.', ta: 'AI உடனடியாக பகுப்பாய்வு செய்து சரியான குழுக்களுக்கு அனுப்பும்.' },
    'dash.track_previous': { en: 'Track Previous Requests', ta: 'முந்தைய கோரிக்கைகளை கண்காணிக்கவும்' },
    'dash.track_desc': { en: 'View live status and responder locations on map.', ta: 'வரைபடத்தில் நேரடி நிலை மற்றும் பதிலளிப்பவர் இருப்பிடங்களைக் காண்க.' },
    'dash.your_reports': { en: 'Your Reports', ta: 'உங்கள் புகார்கள்' },
    'dash.search_placeholder': { en: 'Search reports...', ta: 'புகாரைத் தேடுங்கள்...' },
    'dash.stats.this_month': { en: 'This Month', ta: 'இந்த மாதம்' },
    'dash.stats.avg_response': { en: 'Avg Response', ta: 'சராசரி பதில் நேரம்' },

    // Landing
    'landing.title': { en: 'Report Emergencies in Seconds', ta: 'வினடிகளில் அவசரகால புகாரை அளியுங்கள்' },
    'landing.subtitle': { en: 'AI automatically alerts Police, Ambulance, and Fire teams with severity classification & proof verification.', ta: 'AI தானாகவே போலீஸ், ஆம்புலன்ஸ் மற்றும் தீயணைப்பு குழுக்களுக்கு தீவிர வகைப்பாடு மற்றும் ஆதார சரிபார்ப்புடன் எச்சரிக்கிறது.' },
    'landing.get_started': { en: 'Get Started', ta: 'தொடங்குங்கள்' },
    'landing.track_request': { en: 'Track Request', ta: 'கோரிக்கையை கண்காணி' },
    'landing.how_it_works': { en: 'How It Works', ta: 'இது எப்படி செயல்படுகிறது' },
    'landing.features': { en: 'Powerful Features', ta: 'சக்திவாய்ந்த அம்சங்கள்' },
    'landing.trusted': { en: 'Trusted by Emergency Services', ta: 'அவசரகால சேவைகளால் நம்பப்படுகிறது' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('resq-language');
        return (saved as Language) || 'en';
    });

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('resq-language', lang);
        document.documentElement.lang = lang;
    }, []);

    const t = useCallback((key: string) => {
        return translations[key]?.[language] || key;
    }, [language]);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
