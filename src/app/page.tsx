import Footer from '@/components/footer/Footer.component';
import Header from '@/components/header/Header.component';
import Journey from '@/components/journey/Journey.component';
import Technologies from '@/components/tech/Technologies.component';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        <Header />
        <Journey />
        <Technologies />
      </main>

      <Footer />
    </div>
  );
}
