export async function getFoodMenu() {
  const response = await fetch("/api/food_menu");

  const foodMenu = await response.json();
  console.log("at food menu fetch function:...");
  return foodMenu;
}
