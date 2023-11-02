"use client";
import { useState } from "react";
import { FrontCard, BackCard } from ".";
import styles from "@/styles/MainCard.module.css";
import { FoodMenu } from "@/utils/Interface";

const MainCard = () => {
  const [foodOrdered, setFoodOrdered] = useState<FoodMenu[] | null>(null);

  return (
    <div className={`${styles.card} `}>
      <FrontCard setFoodOrdered={setFoodOrdered} />
      <BackCard foodOrdered={foodOrdered} />
    </div>
  );
};

export default MainCard;
