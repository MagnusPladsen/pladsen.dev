import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Journey() {
  const journeyItems = [
    {
      title: 'Work',
      description: (
        <>
          Thrilled to be working as a full stack developer at{' '}
          <span className="group-hover:text-primary transition-colors">
            Abaris Consulting AS
          </span>
          .
        </>
      ),
      link: 'https://abaris.no',
    },
    {
      title: 'School',
      description: (
        <>
          2 year frontend development course at{' '}
          <span className="group-hover:text-primary transition-colors">
            Noroff
          </span>
          . Graduated in 2024 with an A on the last exam.
        </>
      ),
      link: 'https://noroff.no',
    },
  ];
  return (
    <section className="w-full mt-12">
      <h3 className="text-muted-foreground mb-4 uppercase text-sm">Journey</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {journeyItems.map((item) => (
          <Link href={item.link} key={item.title} target="_blank">
            <div className="p-6 bg-card rounded-lg hover:bg-card/80 transition-all hover:cursor-pointer shadow-md shadow-primary/10 hover:scale-105 duration-150 group">
              <div className="flex items-center gap-2 mb-2 justify-between">
                <h4 className="font-semibold">{item.title}</h4>
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
