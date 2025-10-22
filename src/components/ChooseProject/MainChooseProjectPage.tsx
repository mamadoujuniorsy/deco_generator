import Link from "next/link";
import ScreenScale from "../ScreenScale";
import MainPageWrapper from "../WelcomePage/MainPageWrapper";
import OptionBox from "../WelcomePage/OptionBox";

const MainChooseProjectPage: React.FC = () => {
  const xml: React.ReactElement = (
    <MainPageWrapper head="Choisissez un type de projet">
      <ScreenScale className="!w-[69.3rem] flex gap-[2.5rem] h-[33.4rem] max-lg:flex-col max-lg:h-[17.5rem] max-lg:gap-[1.5rem]">
        <Link
          href={
            "/choose-interior-style?type=RESIDENTIAL&name=Projet Résidentiel"
          }
          passHref
          className="w-full flex-[1_0_0] flex justify-center items-center"
        >
          <OptionBox className="cursor-pointer h-full">
            <span className="fustat font-bold text-[1.8rem] text-white text-center">
              Résidentiel
            </span>
          </OptionBox>
        </Link>
        <Link
          href={"/choose-interior-style?type=OFFICE&name=Projet Bureau"}
          passHref
          className="w-full flex-[1_0_0] flex justify-center items-center"
        >
          <OptionBox className="cursor-pointer h-full">
            <span className="fustat font-bold text-[1.8rem] text-white text-center">
              Bureaux
            </span>
          </OptionBox>
        </Link>
      </ScreenScale>
    </MainPageWrapper>
  );
  return xml;
};

export default MainChooseProjectPage;
