import Footer from '@/components/footer/Footer.component';
import Journey from '@/components/journey/Journey.component';
import Technologies from '@/components/tech/Technologies.component';
import Image from 'next/image';
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-background text-foreground">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        {/*hero Section */}
        <div className="flex justify-between items-start w-full gap-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Magnus <span className="text-primary">Pladsen</span>
            </h1>
            <h2 className="text-2xl mb-4">Full-stack developer</h2>
            <div className="text-muted-foreground flex flex-col gap-2">
              <p>Building modern web applications with React, Next.js & Tailwind CSS</p>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="/avatar.png"
              alt="Magnus Pladsen"
              width={140}
              height={140}
              className="rounded-full aspect-square w-[140px] h-[140px] object-cover"
            />
          </div>
        </div>

        <Journey />

        <Technologies />
      </main>

      <Footer />
    </div>
  );
}
