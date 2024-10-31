"use client";

import styles from "@/styles/MainCard.module.css";
import { FoodMenu, FoodOrdered } from "@/utils/Interface";
import { getFoodMenu } from "@/utils";
import { useEffect, useState } from "react";
import QtySelection from "./QtySelection";

const LoadingSpinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-solid border-black border-b-transparent border-r-transparent animate-spin rounded-full" />
    </div>
  );
};

const ErrorMessage = () => {
  return (
    <div className="w-full h-full flex flex-col text-center items-center justify-center">
      <span className="text-xl">Something went wrong!</span>
      <span>
        Try again in a moment. If the trouble persists, inform the Manager
        in-charge.
      </span>
    </div>
  );
};

const FrontCard = ({
  foodOrdered,
  setFoodOrdered,
}: {
  foodOrdered: FoodOrdered[] | null;
  setFoodOrdered: (prop: FoodOrdered[] | null) => void;
}) => {
  const [foodMenu, setFoodMenu] = useState<FoodMenu[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function setMenu() {
      getFoodMenu()
        .then((menuData) => {
          setFoodMenu(menuData);
          setIsLoading(false);
          setIsError(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setIsError(true);
        });
    }

    setMenu();
  }, []);

  useEffect(() => {
    const frontButton = document.getElementById(
      "navbutton-front"
    ) as HTMLButtonElement;
    frontButton.hidden = true;
  }, []);

  function toggleNavButton(param: boolean) {
    const frontButton = document.getElementById(
      "navbutton-front"
    ) as HTMLButtonElement;
    frontButton && (frontButton.hidden = param);
  }
  return (
    <div className={`${styles.frontCard} container`}>
      <div className="basis-1/4 flex flex-col">
        <h1
          className="text-4xl font-serif font-extrabold"
          style={{ fontFamily: `Times New Roman` }}
        >
          Today&apos;s Menu
        </h1>

        <div className="m-2 border border-solid border-black h-[40%] w-24 bg-blue-950"></div>
        <div className="m-2 border border-solid border-black h-[40%] w-24 bg-blue-950"></div>
      </div>

      <div id="foodMenu" className="basis-3/4 flex flex-col">
        <div className="flex flex-col p-2 h-full items-center overflow-y-visible overflow-x-hidden gap-2">
          {isLoading && !isError && <LoadingSpinner />}
          {!isLoading && isError && <ErrorMessage />}
          {!isLoading && !isError && (
            <>
              {!foodMenu || foodMenu?.length < 0 ? (
                <div className="h-full w-3/4 italic font-bold text-center text-[20px] flex flex-col justify-center items-center font-serif">
                  Empty Menu. Contact the Manager to poluate it.
                </div>
              ) : (
                foodMenu?.map((food) => (
                  <div
                    className="flex flex-row rounded h-8 w-[95%] p-1 items-center container hover:scale-105"
                    key={`${food.id}-${food.name}`}
                  >
                    <span className="basis-2/4 font-bold text-xl">
                      {food.name}
                    </span>
                    <div className="flex justify-between grow flex-row items-center gap-1">
                      <QtySelection foodId={`${food.id}`} price={food.price} />
                      <span className="flex flex-row">
                        Ksh. <span id={`price-${food.id}`}>{food.price}</span>
                      </span>

                      <input
                        type="checkbox"
                        id={`checkbox-${food.id}`}
                        className="hover:cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            toggleNavButton(false);
                            const qtyElement = document.getElementById(
                              `selection-${food.id}`
                            ) as HTMLSelectElement;
                            const newOrder: FoodOrdered = {
                              qty: +qtyElement.value,
                              foodName: food.name,
                              price: food.price * +qtyElement.value,
                            };
                            foodOrdered
                              ? setFoodOrdered([...foodOrdered, newOrder])
                              : setFoodOrdered([newOrder]);
                          } else if (!e.target.checked) {
                            const remainingOrder = foodOrdered?.filter(
                              (order) => order.foodName !== food.name
                            );
                            if (remainingOrder && remainingOrder?.length > 0) {
                              setFoodOrdered(remainingOrder);
                            } else {
                              setFoodOrdered(null);
                              toggleNavButton(true);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
        <span>{foodMenu?.length ?? 0} Meals Avaliable On Menu</span>
      </div>
    </div>
  );
};

export default FrontCard;
