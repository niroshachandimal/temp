import { useEffect, useState } from 'react';
import canadaFlag from '../../assets/icon/canada.png'; // Add other flag images similarly

interface Country {
  code: string;
  label: string;
  flag: string;
}

interface PhoneInputProps {
  name: string;
  value: string;
  isInvalid?: boolean;
  errorMessage?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const countries: Country[] = [
  { code: '+1', label: 'Canada', flag: canadaFlag },
];

const PhoneInput = ({
  name,
  value,
  isInvalid,
  errorMessage,
  onChange,
}: PhoneInputProps) => {
  const [selectedCode, setSelectedCode] = useState(countries[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Extract number without country code on mount/update
  useEffect(() => {
    const matched = countries.find((c) => value.startsWith(c.code));
    if (matched) {
      setSelectedCode(matched);
      const trimmed = value.replace(`${matched.code} `, '');
      setInputValue(trimmed);
    } else {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    const formattedPhoneNumber = `${selectedCode.code} ${inputValue}`;
    if (inputValue.trim() === '') {
      return;
    }
    onChange({
      target: { name, value: formattedPhoneNumber },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [selectedCode, inputValue]);

  return (
    <div>
      <div className="flex items-center mb-1">
        <p className="text-xs">Phone Number</p>
        <small className="ml-1 text-red-500">*</small>
      </div>

      <div className="relative flex items-center border-2 shadow-sm border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-black">
        {/* Country code dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-white rounded-l-md focus:outline-none"
          >
            <span>{selectedCode.code}</span>
            <img
              src={selectedCode.flag}
              alt={selectedCode.label}
              className="w-5 h-4"
            />
            <svg
              className="w-3 h-3 ml-1 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showDropdown && (
            <ul className="absolute z-50 mt-1 bg-white border rounded shadow-sm text-sm w-32 max-h-40 overflow-y-auto">
              {countries.map((country) => (
                <li
                  key={country.code}
                  onClick={() => {
                    setSelectedCode(country);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={country.flag}
                    alt={country.label}
                    className="w-5 h-4"
                  />
                  <span>{country.code}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Phone input */}
        <input
          type="tel"
          name={name}
          className="flex-1 py-2 px-2 text-sm border-l border-gray-300 outline-none rounded-r-md"
          placeholder="Enter phone number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      {isInvalid && errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
      <small className="text-xs text-gray-500">
        Only Canadian phone numbers are accepted.
      </small>
    </div>
  );
};

export default PhoneInput;
