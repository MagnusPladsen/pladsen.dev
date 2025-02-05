import Image from 'next/image';


export default function Header() {
    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-start w-full gap-8">
                <div>
                    <h1 className="text-6xl font-bold mb-2">
                        Magnus <span className="text-primary">Pladsen</span>
                    </h1>
                    <h2 className="text-2xl mb-4">Full-stack developer</h2>

                </div>
                <div className="hidden md:block">
                    <Image
                        src="/avatar.png"
                        alt="Magnus Pladsen"
                        width={200}
                        height={200}
                        className="rounded-full aspect-square w-[140px] h-[140px] object-cover"
                    />
                </div>
            </div>
            <div className="text-muted-foreground flex flex-col gap-2">
                <p>Building modern web applications with React, Next.js & Tailwind CSS</p>
                <p>Frontend-focused developer with a strong foundation in React development. Passionate about creating intuitive user interfaces and exploring full-stack technologies to build modern web applications.</p>
            </div>
        </div>
    )
}
