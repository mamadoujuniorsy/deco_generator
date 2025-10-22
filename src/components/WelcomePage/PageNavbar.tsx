import Link from "next/link";
import Image from "next/image";
import ScreenScale from "../ScreenScale";

const PageNavbar: React.FC<{ className?: string }> = ({ className = "" }) => {
  const xml: React.ReactElement = (
    <header
      className={
        "bg-[linear-gradient(90deg,_#2F2F2F_0%,_#444444_100%)] max-lg:bg-[#242426] " +
        className
      }
    >
      <ScreenScale
        className="!w-[127.2rem] flex justify-between items-center max-lg:justify-center max-lg:items-center max-lg:max-w-full max-lg:bg-[#242426]"
        type="nav"
      >
        {/* IMAGE */}
        <div className="relative my-[1.5rem] max-lg:w-full max-lg:m-0 max-lg:py-[1rem]">
          <Image
            src="/logo-white.png"
            alt=""
            width={210}
            height={40}
            className="block max-lg:w-[83.60945273631842%] max-lg:mx-auto max-lg:h-[6.4rem] max-lg:max-w-[33.611rem]"
            priority
          />
          <Link
            href="/"
            className="absolute top-0 left-0 w-full h-full max-lg:block max-lg:w-[83.60945273631842%] max-lg:left-[50%] max-lg:translate-x-[-50%]"
          ></Link>
        </div>

        {/* LINKS */}
        <ul className="flex max-lg:hidden">
          <li className="relative mr-[6.91rem] max-lg:text-center max-lg:m-0">
            <Image
              src="/home.png"
              alt="home"
              width={19.55}
              height={22}
              className=""
            />
            <Link
              href="/"
              className="absolute z-[1] w-full h-full top-0 left-0"
            ></Link>
          </li>
          <li className="relative mr-[6.426rem] max-lg:m-0">
            <Image
              src="/tag.png"
              alt="tag"
              width={22.71}
              height={23}
              className=""
            />
            <Link
              href="/"
              className="absolute z-[1] w-full h-full top-0 left-0"
            ></Link>
          </li>
          <li className="relative mr-[6.99rem] max-lg:m-0">
            <Image
              src="/cart.png"
              alt="cart"
              width={23.79}
              height={23}
              className=""
            />
            <Link
              href="/"
              className="absolute z-[1] w-full h-full top-0 left-0"
            ></Link>
          </li>
          <li className="relative">
            <Image
              src="/user-dark.png"
              alt="user"
              width={24.69}
              height={25}
              className=""
            />
            <Link
              href="/"
              className="absolute z-[1] w-full h-full top-0 left-0"
            ></Link>
          </li>
        </ul>

        {/* LINKS FOR MOBILE */}
        <div className="max-lg:block hidden bl max-lg:fixed max-lg:bottom-0 max-lg:left-0 w-full max-lg:bg-blend-overlay max-lg:backdrop-blur-[2.5rem]">
          <ul className="flex mx-auto w-[74.06467661691542%] max-lg:justify-between max-lg:h-[8rem] max-lg:items-center ">
            <li className="relative mr-[6.91rem] max-lg:text-center max-lg:m-0">
              <Image
                src="/home.png"
                alt="home"
                width={19.55}
                height={22}
                className="max-lg:w-[1.98rem] block"
              />
              <Link
                href="/"
                className="absolute z-[1] w-full h-full top-0 left-0"
              ></Link>
            </li>
            <li className="relative mr-[6.426rem] max-lg:m-0">
              <Image
                src="/tag.png"
                alt="tag"
                width={22.71}
                height={23}
                className="max-lg:w-[2.3rem] block"
              />
              <Link
                href="/"
                className="absolute z-[1] w-full h-full top-0 left-0"
              ></Link>
            </li>
            <li className="relative mr-[6.99rem] max-lg:m-0">
              <Image
                src="/cart.png"
                alt="cart"
                width={23.79}
                height={23}
                className="max-lg:w-[2.41rem] block"
              />
              <Link
                href="/"
                className="absolute z-[1] w-full h-full top-0 left-0"
              ></Link>
            </li>
            <li className="relative">
              <Image
                src="/user-dark.png"
                alt="user"
                width={24.69}
                height={25}
                className="max-lg:w-[2.5rem] block"
              />
              <Link
                href="/"
                className="absolute z-[1] w-full h-full top-0 left-0"
              ></Link>
            </li>
          </ul>
        </div>
      </ScreenScale>
    </header>
  );
  return xml;
};

export default PageNavbar;
