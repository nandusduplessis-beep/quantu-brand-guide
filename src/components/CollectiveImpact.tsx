const CollectiveImpact = () => {
  return (
    <section id="collective-impact" className="bg-gradient-to-br from-accent to-accent/70 text-card rounded-2xl p-8 md:p-12 text-center mb-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Collective Impact</h2>
      <p className="text-lg text-card-foreground max-w-3xl mx-auto mb-8">
        Together, these six solutions form the complete expression of The Quantum Insider brand, empowering confident decisions that move the quantum industry forward.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        <div className="bg-foreground p-6 rounded-xl flex-1 max-w-xs">
          <h4 className="text-xl font-semibold mb-2 text-background">Intelligence</h4>
          <p className="text-accent">Reveals Opportunity</p>
        </div>
        <div className="bg-foreground p-6 rounded-xl flex-1 max-w-xs">
          <h4 className="text-xl font-semibold mb-2 text-background">Insight</h4>
          <p className="text-accent">Shapes Strategy</p>
        </div>
        <div className="bg-foreground p-6 rounded-xl flex-1 max-w-xs">
          <h4 className="text-xl font-semibold mb-2 text-background">Influence</h4>
          <p className="text-accent">Drives Action</p>
        </div>
      </div>
    </section>
  );
};

export default CollectiveImpact;
