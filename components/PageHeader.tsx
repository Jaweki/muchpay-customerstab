"use client";
import Image from "next/image";

const PageHeader = () => {
  return (
    <div className=" absolute top-0 h-[19%] bg-lime-600 w-full flex flex-row items-center px-8 justify-between ">
      <div className=" flex flex-row items-center">
        <span className=" font-extrabold text-[30px]">MUNCH PAY </span>{" "}
        <cite className="">
          : &lsquo;&lsquo;Satisfy your cravings with our delicious
          food&rsquo;&rsquo;
        </cite>
      </div>
      <div className=" flex flex-row items-center gap-2">
        <Image
          src={"/managers-profile-avatar.png"}
          alt="Managers profile avatar"
          width={100}
          height={100}
          className=" rounded-full"
          loading="lazy"
        />
        <span className="text-[20px] font-semibold">Managers Name</span>
      </div>
    </div>
  );
};

export default PageHeader;
