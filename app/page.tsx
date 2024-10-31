import { MainCard } from "@/components";
import PageFooter from "@/components/PageFooter";
import PageHeader from "@/components/PageHeader";

export default async function Home() {
  return (
    <>
      <main className=" hidden lg:flex min-h-screen flex-col items-center justify-between p-24">
        <PageHeader />
        <MainCard />
        <PageFooter />
      </main>
      <main className="lg:hidden w-full h-screen flex flex-col items-center justify-center">
        <h1 className="font-bold text-4xl">MunchPay</h1>
        <span className="text-xl">Upgrade required!</span>
        <span>This service is only available on desktop POS.</span>
      </main>
    </>
  );
}
