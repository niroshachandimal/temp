import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import i18n from "../../i18n";
import { useState } from "react";

const languages = {
  en: { label: "EN", icon: "/langIcon/en-lang.png" },
  fr: { label: "FR", icon: "/langIcon/fr-lang.png" },
};

const LanguageSelect = () => {
  const storedLang = localStorage.getItem("lang") || "en";
  const [selectedLanguage, setSelectedLanguage] = useState<
    keyof typeof languages
  >(storedLang as keyof typeof languages);

  const changeLanguage = (lang: keyof typeof languages) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          // startContent={
          //   <img
          //     src={languages[selectedLanguage].icon}
          //     alt={languages[selectedLanguage].label}
          //     className="w-5 h-5"
          //   />
          // }
        >
          {languages[selectedLanguage].label}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Language Selection">
        {Object.entries(languages).map(([key, { label }]) => (
          <DropdownItem
            key={key}
            // startContent={<img src={icon} alt={label} className="w-5 h-5" />}
            onPress={() => changeLanguage(key as keyof typeof languages)}
          >
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSelect;
