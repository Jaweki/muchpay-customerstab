import { useCallback, useEffect, useState } from "react";

const QtySelection = ({ foodId, price }: { foodId: string; price: number }) => {
  const [more, setMore] = useState<number | null>(null);
  const [priceSpanElement, setPriceSpanElement] =
    useState<HTMLSpanElement | null>(null);

  const handleSelectionChange = useCallback(
    (event: Event) => {
      const { value } = event.target as HTMLSelectElement;

      if (+value && priceSpanElement) {
        priceSpanElement.textContent = `${price * parseInt(value)}`;
      } else if (priceSpanElement && value == "more") {
        setMore(5);
        priceSpanElement.textContent = `${price * 5}`;
      }
      const checkbox = document.getElementById(
        `checkbox-${foodId}`
      ) as HTMLInputElement;
      if (checkbox.checked) {
        checkbox.click();
        setTimeout(() => {
          checkbox.click();
        }, 100);
      }
    },
    [foodId, price, priceSpanElement]
  );

  useEffect(() => {
    const selectElement = document.getElementById(`selection-${foodId}`);
    selectElement?.addEventListener("change", handleSelectionChange);

    const spanElement = document.getElementById(
      `price-${foodId}`
    ) as HTMLSpanElement;

    setPriceSpanElement(spanElement);
    return () => {
      selectElement?.removeEventListener("change", handleSelectionChange);
    };
  }, [foodId, handleSelectionChange]);

  return (
    <div className=" flex flex-row gap-2">
      <span>Qty: </span>
      {more === null ? (
        <select
          name={`selection-${foodId}`}
          id={`selection-${foodId}`}
          className="rounded-lg outline-none p-1"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="more">more+</option>
        </select>
      ) : (
        <input
          type="number"
          id={`selection-${foodId}`}
          className="w-[68px] rounded-lg p-1"
          value={more}
          onChange={(e) => {
            const qty = +e.target.value;
            if (qty > 0 && qty <= 15 && priceSpanElement) {
              setMore(qty);
              priceSpanElement.textContent = `${price * qty}`;
              const checkbox = document.getElementById(
                `checkbox-${foodId}`
              ) as HTMLInputElement;
              if (checkbox.checked) {
                checkbox.click();
                setTimeout(() => {
                  checkbox.click();
                }, 100);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default QtySelection;
