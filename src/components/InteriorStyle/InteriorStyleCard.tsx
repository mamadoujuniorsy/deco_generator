import Image from "next/image";

const InteriorStyleCard: React.FC<{
  src: string;
  style: string;
  onClick: (style: string) => void;
  selected: string;
}> = ({ src, style, onClick, selected }) => {
  const xml: React.ReactElement = (
    <article
      className={`overflow-hidden rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] border  hover:border hover:border-[gold] group ${
        selected === style ? "border-[brown]" : "border-[#444444]"
      }`}
      onClick={() => onClick(style)}
    >
      <Image
        src={src}
        alt={src.split(".")[0]}
        width={0}
        height={0}
        sizes="100vw"
        className="inline-block w-full h-[17.5rem] transition-all group-hover:scale-105 object-fill group-hover:grayscale-50 max-lg:h-[10.7rem]"
      />
      <p className="py-[2.1rem_2.7rem] fustat text-[1.6rem] text-center text-white max-lg:py-[1.35rem] max-lg:text-[1.2rem] max-lg:font-semibold max-lg:leading-[1.2rem]">
        {style}
      </p>
    </article>
  );
  return xml;
};

export default InteriorStyleCard;
