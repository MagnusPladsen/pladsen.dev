import Image from 'next/image';
import { ContactInfo } from '@/lib/contactInfo';
import Socials from './Socials.component';

const getContactInfo = async (): Promise<ContactInfo> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/contactInfo`, {
        cache: 'no-store',
    });
    const data = await res.json();
    return data;
};

export default async function Header() {
    const contactInfo = await getContactInfo();

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-start w-full gap-8">
                <div>
                    <h1 className="text-6xl font-bold mb-2">
                        {contactInfo.firstName} <span className="text-primary">{contactInfo.lastName}</span>
                    </h1>
                    <h2 className="text-2xl mb-4">{contactInfo.role}</h2>
                </div>
                <div className="hidden md:block -mb-8">
                    <Image
                        src="/avatar.png"
                        alt={contactInfo.fullName}
                        width={200}
                        height={200}
                        className="rounded-full aspect-square w-[140px] h-[140px] object-cover "
                    />
                </div>
            </div>
            <Socials socials={contactInfo.socials} />
        </div>
    );
}
