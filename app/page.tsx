import { MainCard } from "@/components";
import PageFooter from "@/components/PageFooter";
import PageHeader from "@/components/PageHeader";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PageHeader />
      <MainCard />
      <PageFooter />
    </main>
  );
}
