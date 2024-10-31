"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const PageFooter = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  });
  return (
    <div className=" absolute bottom-0 border-t-2 border-t-gray-200 w-full h-[6%] flex flex-row items-center px-3 bg-lime-200 justify-between font-bold">
      <div className="">Munch Pay Food Service</div>
      <div className="">
        <Link href="https://jaweki-portfolio.vercel.app" target="_blank">
          &copy; Jaweki Dev Group {year}
        </Link>
      </div>
      <div className=" text-gray-500">
        <Link href="privacy-policy" target="_blank" className="underline">
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link href="terms-and-conditions" target="_blank" className="underline">
          Terms and conditions
        </Link>
      </div>
    </div>
  );
};

export default PageFooter;
