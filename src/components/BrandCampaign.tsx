import { useState } from "react";
import iconThink from "@/assets/icon-think.png";
import iconFeel from "@/assets/icon-feel.png";
import iconDo from "@/assets/icon-do.png";

interface CampaignMonth {
  id: number;
  month: string;
  theme: string;
  focus: string;
  outcome: string;
}

const campaignData: CampaignMonth[] = [
  {
    id: 0,
    month: "Month 1",
    theme: "From Information to Intelligence",
    focus: "Establish TQI's authority as the intelligence engine of quantum. Highlight Quantum Market Intelligence & Competitive Monitoring and News & Media Platforms.",
    outcome: "Audiences understand TQI as a data-driven intelligence platform."
  },
  {
    id: 1,
    month: "Month 2",
    theme: "From Intelligence to Action",
    focus: "Demonstrate how insight drives strategy and ecosystem growth. Showcase Strategic Advisory & Market Entry Playbooks and Ecosystem & Stakeholder Mapping.",
    outcome: "Audiences see TQI as a partner for strategic execution."
  },
  {
    id: 2,
    month: "Month 3",
    theme: "From Strategy to Influence",
    focus: "Prove TQI's role in market acceleration and adoption. Feature Technical & Commercial Due Diligence and Strategic Campaigns & Market Activation.",
    outcome: "Audiences view TQI as an indispensable catalyst for progress."
  }
];

const BrandCampaign = () => {
  const [activeMonth, setActiveMonth] = useState(0);

  return (
    <section id="campaign" className="mb-20 pt-16 -mt-16 scroll-mt-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          3-Month Brand & Demand Campaign
        </h2>
        <p className="text-md text-muted-foreground max-w-3xl mx-auto">
          This campaign repositions TQI as the market intelligence backbone of the quantum ecosystem, moving perception from a "news platform" to a trusted, intelligence-driven partner.
        </p>
      </div>

      <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
        <div className="mb-8">
          <h3 className="font-bold text-xl mb-4 text-center text-accent">Desired Audience Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-accent/10 p-4 rounded-lg">
              <img src={iconThink} alt="Think" className="w-16 h-16 mx-auto mb-3" />
              <h4 className="font-bold text-lg mb-2 text-foreground">Think</h4>
              <p className="text-muted-foreground text-sm">
                TQI is more than a blog — it's a market intelligence platform powered by real-time data and industry expertise.
              </p>
            </div>
            <div className="bg-accent/10 p-4 rounded-lg">
              <img src={iconFeel} alt="Feel" className="w-16 h-16 mx-auto mb-3" />
              <h4 className="font-bold text-lg mb-2 text-foreground">Feel</h4>
              <p className="text-muted-foreground text-sm">
                TQI is a key enabler of the quantum industry's growth — analytical, credible, and forward-thinking.
              </p>
            </div>
            <div className="bg-accent/10 p-4 rounded-lg">
              <img src={iconDo} alt="Do" className="w-16 h-16 mx-auto mb-3" />
              <h4 className="font-bold text-lg mb-2 text-foreground">Do</h4>
              <p className="text-muted-foreground text-sm">
                Engage TQI first whenever quantum technology becomes relevant to my company, investment, or policy goals.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="border-b border-border mb-6">
            <nav className="-mb-px flex justify-center space-x-4 md:space-x-8">
              {campaignData.map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => setActiveMonth(campaign.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                    activeMonth === campaign.id
                      ? "text-accent border-accent"
                      : "text-muted-foreground border-transparent hover:text-accent hover:border-accent"
                  }`}
                >
                  {campaign.month}
                </button>
              ))}
            </nav>
          </div>
          <div className="text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-secondary mb-3">
              {campaignData[activeMonth].theme}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-6">
              <div className="bg-accent/10 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-accent">Focus</h4>
                <p className="text-muted-foreground">{campaignData[activeMonth].focus}</p>
              </div>
              <div className="bg-accent/10 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2 text-secondary">Primary Outcome</h4>
                <p className="text-muted-foreground">{campaignData[activeMonth].outcome}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCampaign;
