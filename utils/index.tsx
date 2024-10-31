export async function getFoodMenu() {
  try {
    const response = await fetch("/api/food_menu");

    const foodMenu = await response.json();
    console.log(foodMenu);
    return foodMenu;
  } catch (error) {
    throw error;
  }
}
