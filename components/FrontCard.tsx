"use client";

import styles from "@/styles/MainCard.module.css";
import { FoodMenu } from "@/utils/Interface";
import { getFoodMenu } from "@/utils";
import FrontCardButton from "./FrontCardButton";
import { useEffect, useState } from "react";

const FrontCard = ({
  setFoodOrdered,
}: {
  setFoodOrdered: (prop: FoodMenu[] | null) => void;
}) => {
  const [foodMenu, setFoodMenu] = useState<FoodMenu[] | null>(null);

  useEffect(() => {
    async function setMenu() {
      getFoodMenu()
        .then((menuData) => setFoodMenu(menuData))
        .catch((error) => console.log(error));
    }

    setMenu();
  }, []);

  return (
    <div className={`${styles.frontCard} container`}>
      <div className="basis-1/4 flex flex-col">
        <h1
          className="text-4xl font-serif font-extrabold"
          style={{ fontFamily: `Times New Roman` }}
        >
          Today&apos;s Menu
        </h1>

        <div className="m-2 border border-solid border-black h-16 w-24 bg-blue-950"></div>
        <div className="m-2 border border-solid border-black h-16 w-24 bg-blue-950"></div>
        <FrontCardButton foodMenu={foodMenu} setFoodOrdered={setFoodOrdered} />
      </div>

      <div id="foodMenu" className="basis-3/4 flex flex-col">
        <div className="flex flex-col p-2 h-full items-center overflow-y-visible overflow-x-hidden gap-2">
          {foodMenu?.map((food) => (
            <div
              className="flex flex-row rounded h-8 w-[95%] p-1 items-center container hover:scale-105"
              key={`${food.id}-${food.name}`}
            >
              <span className="basis-2/4 font-bold text-xl">{food.name}</span>
              <div className="flex justify-between grow">
                <span>Ksh. {food.price}</span>
                <span>VAT: {food.vat}</span>
                <input
                  type="checkbox"
                  id={food.name}
                  className="hover:cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
        <span>{foodMenu?.length} Meals Avaliable On Menu</span>
      </div>
    </div>
  );
};

export default FrontCard;
