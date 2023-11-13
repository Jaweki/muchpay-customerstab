"use client";
import { useEffect, useState } from "react";
import { FrontCard, BackCard } from ".";
import styles from "@/styles/MainCard.module.css";
import { ConfirmDataProps, FoodOrdered } from "@/utils/Interface";
import NavButton from "./NavButton";
import ConfirmPending from "./ConfirmPending";
import ConfirmationResult from "./ConfirmationResult";

const MainCard = () => {
  const [foodOrdered, setFoodOrdered] = useState<FoodOrdered[] | null>(null);
  const [cardSide, setCardSide] = useState("front");
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmData, setConfirmData] = useState<ConfirmDataProps | null>(null);

  useEffect(() => {
    const frontButton = document.getElementById(
      "navbutton-front"
    ) as HTMLButtonElement;
    frontButton.hidden = true;
  }, []);

  return (
    <div className={`${styles.card} relative z-0`}>
      <FrontCard foodOrdered={foodOrdered} setFoodOrdered={setFoodOrdered} />
      {cardSide === "front" && currentStep === 1 && (
        <NavButton
          additionalStyles={`bottom-5 right-10 bg-yellow-400 ${styles.frontButton}`}
          textContent="Next"
          cardSide={cardSide}
          setCardSide={setCardSide}
          nextStep={2}
          setCurrentStep={setCurrentStep}
        />
      )}
      {cardSide === "back" && currentStep === 2 && (
        <BackCard
          foodOrdered={foodOrdered}
          setCardSide={setCardSide}
          setCurrentStep={setCurrentStep}
          setConfirmData={setConfirmData}
        />
      )}
      {cardSide === "back" && currentStep === 2 && (
        <NavButton
          additionalStyles={`-bottom-2 -right-2 bg-yellow-400 ${styles.backButton}`}
          textContent="Cancel"
          cardSide={cardSide}
          setCardSide={setCardSide}
          nextStep={1}
          setCurrentStep={setCurrentStep}
        />
      )}
      {cardSide === "back" && currentStep === 2 && (
        <NavButton
          additionalStyles={`-bottom-2 left-0 bg-yellow-400 ${styles.backButton}`}
          textContent="Confirm"
          cardSide={cardSide}
          role="confirm"
          setCardSide={setCardSide}
          nextStep={3}
          setCurrentStep={setCurrentStep}
        />
      )}
      {cardSide === "front" && currentStep === 3 && <ConfirmPending />}
      {cardSide === "back" && currentStep === 4 && (
        <ConfirmationResult confirmData={confirmData} />
      )}
      {cardSide === "back" && currentStep === 4 && (
        <NavButton
          additionalStyles={`-bottom-2 left-0 bg-yellow-400 ${styles.backButton}`}
          textContent="Finish"
          cardSide={cardSide}
          role="OK"
          setCardSide={setCardSide}
          nextStep={1}
          setCurrentStep={setCurrentStep}
        />
      )}
    </div>
  );
};

export default MainCard;
