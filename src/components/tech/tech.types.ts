interface Tech {
  name: string;
  icon?: string;
  bgColor?: string;
}

interface TechGroup {
  name: string;
  techs: Tech[];
}

export type { Tech, TechGroup };
