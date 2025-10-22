/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { useState } from "react";

const InputField: React.FC<{
  id: string;
  label?: string;
  className?: string;
  placeholder: string;
  type: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}> = ({ id, label, className, type, placeholder, value, onChange }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectValue, setSelectValue] = useState("");
  const [file, setFile] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const inputBaseClasses = `w-full px-6 py-4 lg:py-5 text-lg lg:text-xl
    bg-white/10 border border-white/20 rounded-xl text-white 
    placeholder:text-white/50 backdrop-blur-sm
    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 
    focus:border-yellow-400/50 focus:bg-white/15
    transition-all duration-300
    hover:bg-white/15 hover:border-white/30`;

  const xml = (
    <div className={`group ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-white text-lg lg:text-xl font-medium mb-3 
                     transition-all duration-300
                     ${
                       isFocused
                         ? "text-yellow-400"
                         : "group-hover:text-gray-200"
                     }
                     bg-gradient-to-r from-white to-gray-200 bg-clip-text`}
        >
          {label}
        </label>
      )}

      {/* INPUT */}
      {type !== "select" && type !== "textarea" && type !== "file" && (
        <input
          className={inputBaseClasses}
          type={type}
          value={type === "file" ? file : value || ""}
          placeholder={placeholder}
          id={id}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}

      {/* SELECT */}
      {type === "select" && (
        <div
          tabIndex={1}
          className={`relative ${inputBaseClasses.replace("px-6", "px-0")}
                     ${
                       isFocused
                         ? "ring-2 ring-yellow-400/50 border-yellow-400/50 bg-white/15"
                         : ""
                     }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <select
            className="w-full h-full px-6 text-lg lg:text-xl text-white bg-transparent outline-0
                       cursor-pointer"
            value={value || ""}
            onChange={onChange}
            id={id}
            onFocus={(e) => {
              e.target.parentElement?.focus();
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
          >
            <option value="" disabled className="bg-gray-800 text-white">
              {placeholder}
            </option>
            {/* Add your options here */}
          </select>
          {(!value || value === "") && (
            <span
              className="absolute text-lg lg:text-xl text-white/50 left-6 top-1/2 
                           transform -translate-y-1/2 pointer-events-none"
            >
              {placeholder}
            </span>
          )}
        </div>
      )}

      {/* TEXTAREA */}
      {type === "textarea" && (
        <textarea
          className={`${inputBaseClasses} min-h-[12rem] py-4 lg:py-5 resize-vertical`}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange as (e: any) => void}
          id={id}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}

      {/* FILE */}
      {type === "file" && (
        <div
          className={`${inputBaseClasses} flex items-center justify-between cursor-pointer
                        hover:bg-white/20`}
        >
          <label htmlFor={id} className="flex-grow cursor-pointer">
            <span
              className={`text-lg lg:text-xl ${
                file ? "text-white" : "text-white/50"
              }`}
            >
              {file ? file : placeholder}
            </span>
          </label>
          <div
            className="flex-shrink-0 p-2 bg-white/10 rounded-lg ml-4 
                         group-hover:bg-white/20 transition-colors duration-200"
          >
            <Image
              src="/upload.png"
              alt="upload"
              width={20}
              height={20}
              className="opacity-80 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
          <input
            type={type}
            className="hidden"
            id={id}
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                const fileName = files[0].name;
                setFile(fileName);
                // Also call the parent onChange if provided
                if (onChange) {
                  onChange(e);
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
  return xml;
};

export default InputField;
