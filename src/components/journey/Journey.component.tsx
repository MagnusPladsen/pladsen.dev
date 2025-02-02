export default function Journey() {
  const journeyItems = [
    {
      title: 'Work',
      description: 'Currently working as a full stack developer at Abaris Consulting AS.',
    },
    {
      title: 'School',
      description: '2 year frontend development course at Noroff. Graduated in 2024 with an A on the last exam.',
    },
  ];
  return (
    <section className="w-full mt-12">
      <h3 className="text-muted-foreground mb-4 uppercase text-sm">Journey</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {journeyItems.map((item) => (
          <div key={item.title} className="p-6 bg-card rounded-lg hover:bg-muted transition-colors">
            <h4 className="font-semibold mb-2">{item.title}</h4>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
