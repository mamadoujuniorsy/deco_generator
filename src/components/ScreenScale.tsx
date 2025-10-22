// SCREEN SCALE
const ScreenScale: React.FC<{
  children: React.ReactNode;
  className?: string;
  type?: string;
}> = ({ children, className, type }) => {
  const xml: React.ReactElement =
    type === "nav" ? (
      <nav className={"w-[114rem] max-w-[95%] mx-auto " + className}>
        {children}
      </nav>
    ) : (
      <section className={"w-[114rem] max-w-[95%] mx-auto " + className}>
        {children}
      </section>
    );
  return xml;
};

export default ScreenScale;
