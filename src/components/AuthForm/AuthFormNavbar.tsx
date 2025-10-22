import Image from "next/image";
import Link from "next/link";

const AuthFormNavbar: React.FC<{ path?: string; className?: string }> = ({
  path = "/",
  className = "",
}) => {
  const xml: React.ReactElement = (
    <header
      className={
        "bg-black/70 shadow-[0rem_.4rem_.4rem_rgba(0,0,0,0.25)] backdrop-blur-[0.2rem] " +
        className
      }
    >
      <nav className="w-[129.3rem] max-w-[95%] flex justify-between items-center mx-auto">
        <div className="relative">
          <Image
            src="/logo-white.png"
            alt=""
            width={175}
            height={33}
            className="my-[1.3rem] inline-block"
          />
          <Link
            href={path}
            className="absolute top-0 left-0 w-full h-full"
          ></Link>
        </div>
        {/* LINK */}
        <Link
          href="/"
          className="border border-[#FFC500] rounded-[0.8rem] px-[3.75rem] py-[1.2rem] font-[Inter] text-[1.6rem] leading-[1] text-[#F5F5F5]"
        >
          Plus de fonctionnalités
        </Link>
      </nav>
    </header>
  );

  return xml;
};

export default AuthFormNavbar;
