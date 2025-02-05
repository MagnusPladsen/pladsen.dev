interface Tech {
  name: string;
  icon?: string;
  bgColor?: string;
  link: string;
}

interface TechGroup {
  name: string;
  techs: Tech[];
}

export type { Tech, TechGroup };
