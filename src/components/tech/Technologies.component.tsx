import techData from './tech.data';
import Image from 'next/image';

export default function Technologies() {
  return (
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
                    <Image src={tech.icon} alt={tech.name} width={20} height={20} className="object-contain" />
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
  );
}
