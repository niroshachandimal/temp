import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { TbWorld } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';

const Language = () => {
  const [language, setLanguage] = useState('English');
  const languages = [
    'English',
    // 'Spanish',
    'French',
    // 'German',
    // 'Chinese'
  ];
  const { i18n } = useTranslation(); // Get translation function and i18n instance

  // Map of full language names to language codes
  const languageMap: { [key: string]: string } = {
    English: 'en',
    // Spanish: 'es',
    French: 'fr',
    // German: 'de',
    // Chinese: 'zh',
  };

  const handleChangeLanguage = (lang: string) => {
    const langCode = languageMap[lang]; // Get the language code for the selected language
    i18n.changeLanguage(langCode); // Update the language in i18n
    setLanguage(lang); // Update the language state
    localStorage.setItem('selectedLanguage', langCode); // Store selected language in localStorage
  };

    useEffect(() => {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        // Find the full language name based on the language code from localStorage
        const fullLanguage = Object.keys(languageMap).find(key => languageMap[key] === savedLanguage);
        setLanguage(fullLanguage || 'English');
        i18n.changeLanguage(savedLanguage); // Change language based on saved value
      }
    }, [i18n]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
            <TbWorld className="text-sm" />
            <span>{language}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-label="Static Actions">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleChangeLanguage(lang)}
            >
              {lang}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Language;
