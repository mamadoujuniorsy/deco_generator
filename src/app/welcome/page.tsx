import MainWelcomePage from "@/components/WelcomePage/MainWelcomePage";
import PageNavbar from "@/components/WelcomePage/PageNavbar";

const welcome: React.FC = () => {
  const xml: React.ReactElement = (
    <>
      <PageNavbar />
      <MainWelcomePage />
    </>
  );
  return xml;
};

export default welcome;
