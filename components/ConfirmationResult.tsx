import styles from "@/styles/MainCard.module.css";
import { useEffect, useState } from "react";

const ConfirmationResult = () => {
  const [okButton, setOkButton] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    const btnOK = document.getElementById(
      "navbutton-back-OK"
    ) as HTMLButtonElement;

    setOkButton(btnOK);

    const handleOKBtnClick = (event: MouseEvent) => {
      window.location.assign("/");
    };
    okButton?.addEventListener("click", handleOKBtnClick);

    return () => {
      okButton?.removeEventListener("click", handleOKBtnClick);
    };
  }, [okButton]);
  return (
    <div className={`${styles.backCard} container`}>ConfirmationResult</div>
  );
};

export default ConfirmationResult;
