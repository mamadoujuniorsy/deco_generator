import Image from "next/image";

const AuthSubmitButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  img?: string;
  disabled?: boolean;
}> = ({ children, className = "", img, disabled = false }) => {
  const baseClasses = `
    relative overflow-hidden
    block w-full px-8 py-4 lg:py-5 gap-3
    bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
    hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700
    border-2 border-yellow-400/50 hover:border-yellow-300
    rounded-xl font-['Inter'] text-lg lg:text-xl font-semibold leading-none 
    text-gray-900 shadow-lg
    transform transition-all duration-300 
    hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,197,0,0.4)]
    active:scale-[0.98] active:shadow-[0_0_15px_rgba(255,197,0,0.6)]
    focus:outline-none focus:ring-4 focus:ring-yellow-400/30
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:transform-none disabled:shadow-lg
    disabled:hover:scale-100 disabled:hover:shadow-lg
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    >
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-transparent to-yellow-300/20 
                      transform translate-x-[-100%] group-hover:translate-x-[100%] 
                      transition-transform duration-1000 ease-out"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {children}
        {img && (
          <Image
            src={img}
            alt={img.split(".")[0]}
            width={24}
            height={24}
            className="opacity-80"
          />
        )}
      </div>

      {/* Subtle inner shadow for depth */}
      <div
        className="absolute inset-0 rounded-xl shadow-inner 
                      shadow-black/10 pointer-events-none"
      />
    </button>
  );
};

export default AuthSubmitButton;
