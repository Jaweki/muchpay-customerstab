import styles from "@/styles/MainCard.module.css";
import { useEffect, useState } from "react";

const ConfirmPending = () => {
  const [animationCount, setAnimationCount] = useState(0);

  useEffect(() => {
    const frontCardSide = document.querySelector(
      `.${styles.frontCard}`
    ) as HTMLDivElement;
    frontCardSide.innerHTML = "";
    const intervalId = setInterval(() => {
      setAnimationCount((prevCount) => (prevCount > 2 ? 0 : prevCount + 1));
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const animationDots = ".".repeat(animationCount);

  return (
    <div
      className={`${styles.frontCard} container flex flex-col items-center justify-around`}
    >
      <p className=" text-[20px] text-center font-serif">
        Finally. All that&apos;s left for you, is to enter your{" "}
        <span className={`font-bold text-[25px]`}>M-Pesa PIN</span>. Your
        convenience is our priority! 😊
      </p>
      <span
        className={`${styles.animatePending} font-semibold text-green-800 text-[18px] w-[40%]`}
      >
        Confirmation Pending{animationDots}
      </span>
    </div>
  );
};

export default ConfirmPending;
