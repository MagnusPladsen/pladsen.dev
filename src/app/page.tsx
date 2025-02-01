import Image from 'next/image';
import techData from '../components/tech/tech.data';
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
            <p className="text-muted-foreground">Building modern web applications with React, Next.js & Tailwind CSS</p>
          </div>
          <div className="">
            <Image
              src="/profilepicture.jpg"
              alt="Magnus Pladsen"
              width={140}
              height={140}
              className="rounded-full aspect-square w-[140px] h-[140px] object-cover"
            />
          </div>
        </div>

        {/* Pages Section */}
        <section className="w-full mt-12">
          <h3 className="text-muted-foreground mb-4 uppercase text-sm">Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Blog', 'Portfolio', 'Spotify playlist', "Let's talk"].map((item) => (
              <div key={item} className="p-6 bg-card rounded-lg hover:bg-muted transition-colors">
                <h4 className="font-semibold mb-2">{item}</h4>
                <p className="text-muted-foreground text-sm">Description goes here</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies Section */}
        <section className="w-full mt-12">
          <h3 className="text-muted-foreground mb-4 uppercase text-sm">Technologies</h3>
          {techData.map((techGroup) => (
            <div key={techGroup.name} className="mb-8 last:mb-0">
              <h4 className="font-semibold mb-4">{techGroup.name}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {techGroup.techs.map((tech) => (
                  <div key={tech.name} className="p-4 bg-card rounded-lg flex items-center gap-3">
                    {tech.icon ? (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${tech.bgColor}30` }}
                      >
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          width={20}
                          height={20}
                          className='object-contain'
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-primary rounded-lg"></div>
                    )}
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-muted-foreground">
        <a href="#" className="hover:text-primary">
          GitHub
        </a>
        <a href="#" className="hover:text-primary">
          LinkedIn
        </a>
        <a href="#" className="hover:text-primary">
          Twitter
        </a>
      </footer>
    </div>
  );
}
