import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import iconMarketIntelligence from "@/assets/icon-market-intelligence.png";
import iconEcosystem from "@/assets/icon-ecosystem.png";
import iconAdvisory from "@/assets/icon-advisory.png";
import iconDiligence from "@/assets/icon-diligence.png";
import iconCampaigns from "@/assets/icon-campaigns.png";
import iconMedia from "@/assets/icon-media.png";

export const EmailPopup = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const solutions = [
    {
      icon: iconMarketIntelligence,
      title: "Market Intelligence",
      description: "Real-time data dashboards transforming complexity into clarity",
    },
    {
      icon: iconEcosystem,
      title: "Ecosystem Mapping",
      description: "Visualize relationships and collaboration patterns",
    },
    {
      icon: iconAdvisory,
      title: "Strategic Advisory",
      description: "Tailored strategies for market entry and growth",
    },
    {
      icon: iconDiligence,
      title: "Due Diligence",
      description: "Expert evaluation for confident investment decisions",
    },
    {
      icon: iconCampaigns,
      title: "Market Activation",
      description: "Transform strategy into visibility and engagement",
    },
    {
      icon: iconMedia,
      title: "News & Media",
      description: "Trusted voice amplifying quantum breakthroughs",
    },
  ];

  const copyToClipboard = async () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beyond the Headlines</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 3px solid #0aa1ab;">
        <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: bold; color: #1a3447;">Beyond the Headlines</h1>
        <p style="margin: 0; font-size: 16px; color: #64748b; line-height: 1.5;">You know us for quantum news. Now discover the intelligence platform powering the industry.</p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 30px 20px;">
        <p style="margin: 0 0 16px 0; font-size: 16px; color: #1a3447; line-height: 1.6;">Dear Quantum Insider Community,</p>
        
        <p style="margin: 0 0 16px 0; font-size: 16px; color: #1a3447; line-height: 1.6;">Every day, you rely on us for quantum technology news and industry developments. But there's a whole ecosystem of intelligence and solutions working behind the scenes.</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
          <tr>
            <td style="padding: 16px; background-color: #e0f2f4; border-left: 4px solid #0aa1ab; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1a3447;">We're the market intelligence backbone of the global quantum ecosystem.</p>
            </td>
          </tr>
        </table>

        <h2 style="margin: 30px 0 20px 0; font-size: 20px; font-weight: bold; color: #1a3447; text-align: center;">How We Empower Decision-Makers</h2>

        <!-- Solution 1 -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" valign="top" style="padding-right: 12px;">
                    <div style="width: 48px; height: 48px; background-color: #0aa1ab; border-radius: 8px;"></div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a3447;">Market Intelligence</p>
                    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Real-time data dashboards transforming complexity into clarity</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Solution 2 -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" valign="top" style="padding-right: 12px;">
                    <div style="width: 48px; height: 48px; background-color: #50c7cf; border-radius: 8px;"></div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a3447;">Ecosystem Mapping</p>
                    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Visualize relationships and collaboration patterns</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Solution 3 -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" valign="top" style="padding-right: 12px;">
                    <div style="width: 48px; height: 48px; background-color: #0aa1ab; border-radius: 8px;"></div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a3447;">Strategic Advisory</p>
                    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Tailored strategies for market entry and growth</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Solution 4 -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" valign="top" style="padding-right: 12px;">
                    <div style="width: 48px; height: 48px; background-color: #50c7cf; border-radius: 8px;"></div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a3447;">Due Diligence</p>
                    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Expert evaluation for confident investment decisions</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Solution 5 -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" valign="top" style="padding-right: 12px;">
                    <div style="width: 48px; height: 48px; background-color: #0aa1ab; border-radius: 8px;"></div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a3447;">Market Activation</p>
                    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Transform strategy into visibility and engagement</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Solution 6 -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
          <tr>
            <td style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" valign="top" style="padding-right: 12px;">
                    <div style="width: 48px; height: 48px; background-color: #50c7cf; border-radius: 8px;"></div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a3447;">News & Media</p>
                    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Trusted voice amplifying quantum breakthroughs</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
          <tr>
            <td style="padding: 20px; background-color: #f0f9fa; border-radius: 8px;">
              <p style="margin: 0; font-size: 16px; color: #1a3447; line-height: 1.6;">Whether you're an <strong>investor</strong> seeking validated opportunities, a <strong>corporate strategist</strong> navigating quantum adoption, or a <strong>government</strong> designing national initiatives—we provide the clarity, context, and confidence to move forward.</p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td style="padding: 30px 20px; text-align: center; background: linear-gradient(135deg, #e0f2f4 0%, #f0f9fa 100%); border: 2px solid #50c7cf; border-radius: 12px;">
              <div style="width: 48px; height: 48px; background-color: #e0f2f4; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 24px;">→</span>
              </div>
              <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: bold; color: #1a3447;">Let's Discuss Your Quantum Journey</h3>
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #64748b; line-height: 1.6;">Discover how our intelligence and bespoke solutions can help you navigate the quantum landscape with confidence.</p>
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 16px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Get in touch:</p>
                    <a href="mailto:laban@resonance.holdings" style="font-size: 18px; font-weight: 600; color: #0aa1ab; text-decoration: none;">laban@resonance.holdings</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; font-style: italic;">From intelligence to action, from strategy to influence</p>
              <p style="margin: 0; font-size: 16px; font-weight: 500; color: #1a3447;">The Quantum Insider Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      toast({
        title: "HTML Copied!",
        description: "Email HTML copied to clipboard. Paste it into Gmail's compose window.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="fixed bottom-8 right-8 shadow-lg hover:shadow-xl transition-all duration-300 z-40 animate-fade-in"
        >
          <Mail className="mr-2 h-5 w-5" />
          What We Do Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Newsletter Email Template
            </DialogTitle>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy HTML for Gmail
                </>
              )}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subject Line */}
          <div className="border-l-4 border-primary pl-4 bg-primary/5 p-4 rounded-r">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Subject Line</p>
            <p className="font-semibold text-foreground">Beyond the Headlines: Discover How TQI Powers Quantum Decision-Making</p>
          </div>

          {/* Email Content */}
          <div className="bg-gradient-to-br from-background via-accent/5 to-background border border-border rounded-xl p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3 pb-6 border-b border-border">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Beyond the Headlines
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                You know us for quantum news. Now discover the intelligence platform powering the industry.
              </p>
            </div>

            {/* Intro */}
            <div className="space-y-4 text-foreground">
              <p className="text-lg leading-relaxed">
                Dear Quantum Insider Community,
              </p>
              
              <p className="leading-relaxed">
                Every day, you rely on us for quantum technology news and industry developments. But there's a whole ecosystem of intelligence and solutions working behind the scenes.
              </p>

              <div className="bg-primary/10 border-l-4 border-primary p-5 rounded-r-lg">
                <p className="font-semibold text-lg text-foreground">
                  We're the market intelligence backbone of the global quantum ecosystem.
                </p>
              </div>
            </div>

            {/* Solutions Grid */}
            <div className="space-y-4">
              <h4 className="font-bold text-xl text-center text-foreground">
                How We Empower Decision-Makers
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solutions.map((solution, index) => (
                  <div
                    key={index}
                    className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-102"
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={solution.icon} 
                        alt={solution.title}
                        className="w-12 h-12 flex-shrink-0"
                      />
                      <div>
                        <h5 className="font-semibold text-foreground mb-1">
                          {solution.title}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Prop */}
            <div className="bg-accent/20 rounded-lg p-6 space-y-3">
              <p className="leading-relaxed text-foreground">
                Whether you're an <strong>investor</strong> seeking validated opportunities, a <strong>corporate strategist</strong> navigating quantum adoption, or a <strong>government</strong> designing national initiatives—we provide the clarity, context, and confidence to move forward.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 rounded-xl p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-bold text-xl text-foreground">
                Let's Discuss Your Quantum Journey
              </h4>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Discover how our intelligence and bespoke solutions can help you navigate the quantum landscape with confidence.
              </p>
              <div className="bg-background border border-border rounded-lg p-4 inline-block">
                <p className="text-sm text-muted-foreground mb-1">Get in touch:</p>
                <a 
                  href="mailto:laban@resonance.holdings" 
                  className="text-primary hover:underline font-semibold text-lg flex items-center gap-2 justify-center"
                >
                  <Mail className="h-5 w-5" />
                  laban@resonance.holdings
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-border space-y-2">
              <p className="text-sm text-muted-foreground italic">
                From intelligence to action, from strategy to influence
              </p>
              <p className="font-medium text-foreground">
                The Quantum Insider Team
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
