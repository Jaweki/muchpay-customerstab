"use client";
import styles from "@/styles/MainCard.module.css";
import { ConfirmDataProps, FoodOrdered } from "@/utils/Interface";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import mpesaLogo from "@/public/Mpesa Logo.png";
import axios from "axios";

interface BackCardProps {
  foodOrdered: FoodOrdered[] | null;
  setCardSide: (param: string) => void;
  setCurrentStep: (param: number) => void;
  setConfirmData: (param: ConfirmDataProps) => void;
}

const BackCard = ({
  foodOrdered,
  setCardSide,
  setCurrentStep,
  setConfirmData,
}: BackCardProps) => {
  const [order, setOrder] = useState<FoodOrdered[] | null>(null);
  const [input, setInput] = useState({ contact: "", regNo: "" });
  const [totalBill, setTotalBill] = useState(0);
  const [totalVat, setTotalVat] = useState(0);
  const [confirmButton, setConfirmButton] = useState<HTMLButtonElement | null>(
    null
  );

  useEffect(() => {
    setOrder(foodOrdered);

    let bill: number = 0;
    foodOrdered?.forEach((foodObj) => (bill += foodObj.price));

    setTotalBill(bill);
    setTotalVat(0);
    const btnConfirm = document.getElementById(
      "navbutton-back-confirm"
    ) as HTMLButtonElement;
    btnConfirm && (btnConfirm.hidden = true);
    setConfirmButton(btnConfirm);
  }, [foodOrdered]);

  const sendOrderToBackend = useCallback(async () => {
    try {
      const url = "/api/lipa";
      const payload = {
        order,
        customer: input,
      };
      const response = await axios.post(url, payload);

      const data = response.data;

      console.log("Lipa na mpesa response: ", data);
      if (response.status === 201) {
        setConfirmData({
          receipt_no: data.success.receipt_no,
          mpesa_refNo: data.success.mpesa_refNo,
          message: data.success.message,
        });
        setCardSide("back");
        setCurrentStep(4);

        const frontCardDiv = document.querySelector(`.${styles.card}`);
        frontCardDiv?.classList.toggle(`${styles.rotateFront}`);
      } else if (response.status === 400) {
        setConfirmData({
          message: data.fail_message,
        });
        setCardSide("back");
        setCurrentStep(4);

        const frontCardDiv = document.querySelector(`.${styles.card}`);
        frontCardDiv?.classList.toggle(`${styles.rotateFront}`);
      } else if (response.status === 500) {
        setConfirmData({
          message: data.fail_message,
        });
        setCardSide("back");
        setCurrentStep(4);

        const frontCardDiv = document.querySelector(`.${styles.card}`);
        frontCardDiv?.classList.toggle(`${styles.rotateFront}`);
      }
    } catch (error) {
      alert("System not Connected to internet!");
      window.location.assign("/");
    }
  }, [input, order, setCardSide, setConfirmData, setCurrentStep]);

  const handleSubmitNewOrder = useCallback(
    (event: MouseEvent) => {
      sendOrderToBackend();
    },
    [sendOrderToBackend]
  );

  useEffect(() => {
    confirmButton?.addEventListener("click", handleSubmitNewOrder);

    return () => {
      confirmButton?.removeEventListener("click", handleSubmitNewOrder);
    };
  }, [confirmButton, handleSubmitNewOrder]);

  const validateContact = (contact: string) => {
    if (contact.startsWith("+254")) {
      if (contact.substring(4).length === 9) {
        return true;
      } else {
        return false;
      }
    } else if (contact.startsWith("254")) {
      if (contact.substring(3).length === 9) {
        return true;
      } else {
        return false;
      }
    } else if (contact.startsWith("07") || contact.startsWith("01")) {
      if (contact.substring(2).length === 8) {
        return true;
      } else {
        return false;
      }
    }
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "contact" && isNaN(+value) && value !== "+") {
      return;
    }

    if (name === "contact") {
      setInput({ ...input, [name]: value });

      const showConfirmButton = validateContact(value);

      if (showConfirmButton) {
        confirmButton && (confirmButton.hidden = false);
      } else {
        confirmButton && (confirmButton.hidden = true);
      }
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  return (
    <div
      className={`${styles.backCard} container grid grid-cols-2 p-4 gap-4 border border-solid `}
    >
      <div className=" basis-1/2 flex flex-col border border-solid rounded-3xl">
        <span className="font-extrabold text-[40px] text-center underline underline-offset-4">
          Order Details
        </span>

        <div className="flex flex-col gap-2 overflow-x-hidden my-3 px-5 justify-center w-full h-full">
          {order?.map((food) => (
            <div
              key={food.foodName}
              className="flex flex-row justify-between container"
            >
              <span className="flex flex-row gap-3">
                <span>{food.qty}x</span>
                <span>{food.foodName}</span>
              </span>
              <span className="flex flex-row">Ksh. {food.price}</span>
            </div>
          ))}
        </div>
      </div>
      <div className=" basis-1/2 p-3 flex flex-col justify-between rounded-tl-3xl rounded-br-3xl ">
        <div className="flex flex-col items-center">
          <span className="text-[20px] italic">
            Total Amount: Ksh. {totalBill + totalVat}
          </span>
          <span className="w-full font-extrabold text-[30px] text-center">
            Lipa Na Mpesa
          </span>
          <Image
            className="mt-2"
            src={mpesaLogo}
            alt="Lipa na mpesa Logo"
            width={100}
            height={40}
          />
          <span>560671</span>
          <span>VAT per food ordered: 16%</span>
        </div>

        <form className="w-full h-full flex flex-col gap-5">
          <label className="flex flex-row justify-between">
            <span>Phone Number: </span>
            <input
              type="text"
              name="contact"
              autoComplete="off"
              className="rounded-lg h-[29px] w-[60%] shadow-xl outline outline-yellow-200 p-1 font-extrabold tracking-wider"
              value={input.contact}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-row justify-between">
            <span className="">Reg No: </span>
            <input
              type="text"
              name="regNo"
              autoComplete="off"
              className="rounded-md h-[29px] w-[60%] shadow-xl outline outline-yellow-200 p-1 font-extrabold tracking-wider"
              value={input.regNo}
              onChange={handleInputChange}
            />
          </label>
          <span>
            Registration number allows students to subsidise tax from food bill.
            Offer stands for STUDENTS ONLY!
          </span>
        </form>
      </div>
    </div>
  );
};

export default BackCard;
