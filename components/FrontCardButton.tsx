import { useCallback, useEffect, useState } from "react";
import { FoodMenu } from "@/utils/Interface";
import styles from "@/styles/MainCard.module.css";

interface FrontCardButtonProps {
  foodMenu: FoodMenu[] | null;
  setFoodOrdered: (prop: FoodMenu[] | null) => void;
}

const FrontCardButton = ({
  foodMenu,
  setFoodOrdered,
}: FrontCardButtonProps) => {
  const [menu, setFoodMenu] = useState<FoodMenu[] | null>(null);
  const [foodSelected, setFoodSelected] = useState<string[]>([]);

  useEffect(() => {
    setFoodMenu(foodMenu);
  }, [foodMenu]);

  const handleFoodSelect = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLInputElement;

      if (target.type === "checkbox") {
        const foodSelect: string = target.id;

        if (target.checked) {
          console.log(foodSelect, " has been added");
          setFoodSelected([...foodSelected, foodSelect]);
        } else {
          console.log(foodSelect, " has been removed");
          const newFoodSelect: string[] = foodSelected.filter((food) => {
            return food != foodSelect;
          });
          console.log("remaining foods: ", newFoodSelect);
          setFoodSelected(newFoodSelect);
        }
      }
    },
    [foodSelected]
  );

  const handlePlaceOrder = () => {
    const selectedFoodObj =
      menu?.filter((foodObj): boolean => {
        if (foodSelected.includes(foodObj.name)) {
          return true;
        }
        return false;
      }) ?? null;

    setFoodOrdered(selectedFoodObj); // If you want to set the selected food objects

    const frontCardDiv = document.querySelector(`.${styles.card}`);
    console.log(frontCardDiv);
    frontCardDiv?.classList.toggle(`${styles.rotateFront}`);
  };

  useEffect(() => {
    const foodMenuDiv = document.getElementById("foodMenu");

    foodMenuDiv?.addEventListener("click", handleFoodSelect);

    return () => {
      foodMenuDiv?.removeEventListener("click", handleFoodSelect);
    };
  }, [foodSelected, handleFoodSelect]);

  return (
    <button
      type="button"
      onClick={handlePlaceOrder}
      className="bg-white rounded-lg w-[120px] h-[40px] border-blue-600 hover:bg-slate-500"
    >
      Next
    </button>
  );
};

export default FrontCardButton;
