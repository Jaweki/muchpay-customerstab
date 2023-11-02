"use client";
import styles from "@/styles/MainCard.module.css";
import { FoodMenu } from "@/utils/Interface";
import {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import mpesaLogo from "@/public/Mpesa Logo.png";

interface BackCardProps {
  foodOrdered: FoodMenu[] | null;
}

const BackCard = ({ foodOrdered }: BackCardProps) => {
  const [order, setOrder] = useState<FoodMenu[] | null>(null);
  const [input, setInput] = useState({ contact: "", regNo: "" });
  const [totalBill, setTotalBill] = useState(0);
  const [totalVat, setTotalVat] = useState(0);

  useEffect(() => {
    console.log(foodOrdered);
    setOrder(foodOrdered);

    let bill: number = 0;
    let vat: number = 0;
    foodOrdered?.forEach(
      (foodObj) => ((bill += foodObj.price), (vat += foodObj.vat))
    );

    setTotalBill(bill);
    setTotalVat(vat);
  }, [foodOrdered]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name == "contact" && isNaN(+value)) {
      return;
    }
    setInput({ ...input, [name]: value });
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
          {order?.map((food, index) => (
            <div
              key={food.id}
              className="flex flex-row justify-between container"
            >
              <span className="basis-2/3">
                {index + 1}. {food.name}
              </span>
              <span className="grow">
                Ksh. {food.price} <span>(VAT: {food.vat})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className=" basis-1/2 p-3 flex flex-col gap-12 rounded-tl-3xl rounded-br-3xl ">
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
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col gap-5"
        >
          <label className="flex flex-row justify-between">
            <span>Phone Number: </span>
            <input
              type="text"
              name="contact"
              className="rounded-lg h-[29px] shadow-xl outline outline-yellow-200"
              value={input.contact}
              onChange={handleInputChange}
            />
          </label>
          <label className="flex flex-row justify-between">
            <span className="">Reg No: </span>
            <input
              type="text"
              name="regNo"
              className="rounded-md h-[29px] shadow-xl outline outline-yellow-200"
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
