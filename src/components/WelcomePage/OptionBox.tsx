import React from "react";

const OptionBox: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const xml: React.ReactElement = (
    <article
      className={
        "flex-[1_0_0] rounded-[0.8rem] border border-[#444444] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] flex justify-center items-center " +
        className
      }
    >
      {children}
    </article>
  );
  return xml;
};

export default OptionBox;
