import { Social } from '@/lib/contactInfo';
import Link from 'next/link';
import Image from 'next/image';

export default function Socials({socials}: {socials: Social[]}) {
    return (
        <div className="text-muted-foreground flex flex-col gap-2">
            <p>Building modern web applications with React, Next.js & Tailwind CSS</p>
            <p>
                Frontend-focused developer with a strong foundation in React development. Passionate about creating intuitive
                user interfaces and exploring full-stack technologies to build modern web applications.
            </p>

            <div className="flex gap-2 mt-2">
                {socials.map((social) => (
                    <Link key={social.application} href={social.link} target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center gap-2 bg-[#24292e] text-white px-3 py-1.5 rounded-md w-fit hover:bg-[#24292e]/90 transition-all shadow-md shadow-primary/10 hover:scale-105 duration-150">
                            <Image src={social.iconPath} alt={social.application} width={20} height={20} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
