import styles from "@/styles/MainCard.module.css";
import { ConfirmDataProps } from "@/utils/Interface";
import { useEffect, useState } from "react";
import Image from "next/image";

const ConfirmationResult = ({
  confirmData,
}: {
  confirmData: ConfirmDataProps | null;
}) => {
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
    <div className={`${styles.backCard} container`}>
      {confirmData?.mpesa_refNo && confirmData.receipt_no ? (
        <div className="w-full flex flex-col items-center gap-16">
          <span className=" text-[40px] font-extrabold text-black">
            Confirmed
          </span>
          <div className="flex flex-row w-full justify-between px-10 items-center gap-3">
            <p className="flex flex-col font-bold">
              <span className="">
                Mpesa reference No.:{" "}
                <span className=" italic md:text-[28px] max-md:text-[15px]">
                  {confirmData?.mpesa_refNo}
                </span>{" "}
              </span>
              <span className="">
                Order receipt No.:{" "}
                <span className=" italic md:text-[28px] max-md:text-[15px] font-extrabold">
                  {confirmData?.receipt_no}
                </span>{" "}
              </span>
            </p>
            <Image
              src={"/check-mark.svg"}
              alt="Confirmed tick icon"
              width={150}
              height={150}
            />
          </div>
          <div className=" w-full text-lime-400 font-serif font-semibold text-[28px] text-center absolute bottom-4 ">
            {confirmData?.message}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center relative gap-10">
          <span className=" text-[25px] font-extrabold text-black">
            Failed!
          </span>
          <Image
            src={"/error-icon.png"}
            alt="Confirmed tick icon"
            width={60}
            height={60}
          />
          <div className=" w-full text-lime-400 font-serif font-semibold text-[18px] text-center absolute bottom-4">
            {confirmData?.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationResult;
