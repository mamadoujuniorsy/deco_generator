import MainChooseProjectPage from "@/components/ChooseProject/MainChooseProjectPage";
import PageNavbar from "@/components/WelcomePage/PageNavbar";

const chooseproject: React.FC = () => {
  const xml: React.ReactElement = (
    <>
      <PageNavbar />
      <MainChooseProjectPage />
    </>
  );
  return xml;
};

export default chooseproject;
