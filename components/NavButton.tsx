import styles from "@/styles/MainCard.module.css";

const NavButton = ({
  additionalStyles,
  textContent,
  cardSide,
  role,
  setCardSide,
  nextStep,
  setCurrentStep,
}: {
  additionalStyles: string;
  textContent: string;
  cardSide: string;
  role?: string;
  setCardSide: (param: string) => void;
  nextStep: number;
  setCurrentStep: (param: number) => void;
}) => {
  const handleCardNext = () => {
    const frontCardDiv = document.querySelector(`.${styles.card}`);
    frontCardDiv?.classList.toggle(`${styles.rotateFront}`);
    const side = cardSide === "front" ? "back" : "front";
    setCardSide(side);
    setCurrentStep(nextStep);
  };

  return (
    <button
      type="button"
      id={`navbutton-${cardSide}${role ? "-" + role : ""}`}
      onClick={handleCardNext}
      className={`rounded-lg w-[120px] h-[40px] hover:bg-slate-500 absolute font-extrabold tracking-wider text-[23px] ${additionalStyles}
      `}
    >
      {textContent}
    </button>
  );
};

export default NavButton;
