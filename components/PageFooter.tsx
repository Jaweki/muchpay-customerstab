import Link from "next/link";

const PageFooter = () => {
  return (
    <div className=" absolute bottom-0 border-t-2 border-t-gray-200 w-full h-[6%] flex flex-row items-center px-3 bg-lime-200 justify-between font-bold">
      <div className="">Munch Pay Food Service</div>
      <div className="">
        <Link href="https://portfolio.jaweki.com" target="_blank">
          &copy; Jaweki Dev Group {new Date().getFullYear()}
        </Link>
      </div>
      <div className=" text-gray-500">
        <Link href="privacy-policy" target="_blank" className="underline">
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link href="terms-and-condition" target="_blank" className="underline">
          Terms and conditions
        </Link>
      </div>
    </div>
  );
};

export default PageFooter;
