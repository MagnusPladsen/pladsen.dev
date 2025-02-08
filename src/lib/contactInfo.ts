interface ContactInfo {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  work: string;
  role: string;
  socials: Social[];
}

interface Social {
  link: string;
  application: string;
  iconPath: string;
}

const contactInfo: ContactInfo = {
  fullName: 'Magnus Pladsen',
  firstName: 'Magnus',
  lastName: 'Pladsen',
  email: 'magnus_pladsen@hotmail.com',
  phone: '+4794812442',
  location: 'Lillehammer, Norway',
  website: 'https://pladsen.dev',
  work: 'Abaris Consulting AS',
  role: 'Full-stack developer',
  socials: [
    { link: 'https://github.com/MagnusPladsen', application: 'github', iconPath: '/icons/github.svg' },
    {
      link: 'https://www.linkedin.com/in/magnus-pladsen-1a2738226',
      application: 'linkedin',
      iconPath: '/icons/linkedin.svg',
    },
    { link: 'https://discord.com/users/252493393303830528', application: 'discord', iconPath: '/icons/discord.svg' },
  ],
};

export default contactInfo;
export type { ContactInfo, Social };
