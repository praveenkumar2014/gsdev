import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Shield, Users, Cpu, Globe, HeadphonesIcon as Support, Infinity } from "lucide-react"

export function PricingPage({ darkMode }: { darkMode: boolean }) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals and small projects",
      features: [
        "Basic AI agents (Code, Testing)",
        "5 projects",
        "100 AI messages/month",
        "Community support",
        "Basic Git integration",
        "Local Ollama support",
        "1 workspace",
        "Standard models"
      ],
      limitations: [
        "Limited to basic agents",
        "No team collaboration",
        "No priority support",
        "Standard response times"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For professional developers and small teams",
      features: [
        "All AI agents (12+ agents)",
        "Unlimited projects",
        "Unlimited AI messages",
        "Priority email support",
        "Advanced Git integration",
        "Cloud & local AI support",
        "Unlimited workspaces",
        "Premium models (Claude, GPT-4)",
        "API access",
        "Custom agent creation",
        "Team collaboration (up to 5)",
        "Advanced analytics"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "For large teams and organizations",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "SSO & SAML integration",
        "Dedicated account manager",
        "24/7 phone support",
        "SLA guarantee (99.9%)",
        "Custom AI model training",
        "On-premise deployment",
        "Advanced security features",
        "Audit logs & compliance",
        "Custom integrations",
        "White-label options"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-green-500/20 text-green-500 border-green-500/30">
            Pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full ${plan.popular ? "border-blue-500 border-2" : ""} ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-2 text-gray-500 dark:text-gray-500">
                        <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-center">•</span>
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
              <CardDescription>Detailed breakdown of features across plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-4">Feature</th>
                      <th className="text-center p-4">Free</th>
                      <th className="text-center p-4">Pro</th>
                      <th className="text-center p-4">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-4">AI Agents</td>
                      <td className="text-center p-4">2 Basic</td>
                      <td className="text-center p-4">12+ All</td>
                      <td className="text-center p-4">12+ All + Custom</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-4">Projects</td>
                      <td className="text-center p-4">5</td>
                      <td className="text-center p-4"><Infinity className="w-5 h-5 mx-auto" /></td>
                      <td className="text-center p-4"><Infinity className="w-5 h-5 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-4">AI Messages</td>
                      <td className="text-center p-4">100/month</td>
                      <td className="text-center p-4"><Infinity className="w-5 h-5 mx-auto" /></td>
                      <td className="text-center p-4"><Infinity className="w-5 h-5 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-4">Team Members</td>
                      <td className="text-center p-4">1</td>
                      <td className="text-center p-4">5</td>
                      <td className="text-center p-4"><Infinity className="w-5 h-5 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-4">Support</td>
                      <td className="text-center p-4">Community</td>
                      <td className="text-center p-4">Priority Email</td>
                      <td className="text-center p-4">24/7 Phone</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-4">API Access</td>
                      <td className="text-center p-4"><span className="text-red-500">✗</span></td>
                      <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="p-4">SSO/SAML</td>
                      <td className="text-center p-4"><span className="text-red-500">✗</span></td>
                      <td className="text-center p-4"><span className="text-red-500">✗</span></td>
                      <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              <CardHeader>
                <CardTitle className="text-lg">Can I switch plans?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
            <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We accept all major credit cards, PayPal, and UPI for Indian customers.
                </p>
              </CardContent>
            </Card>
            <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes, all paid plans include a 14-day free trial with full access to features.
                </p>
              </CardContent>
            </Card>
            <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              <CardHeader>
                <CardTitle className="text-lg">Can I use my own API keys?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes, you can bring your own API keys for Claude, OpenAI, and other providers.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className={`max-w-4xl mx-auto ${darkMode ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30" : "bg-gradient-to-r from-green-100 to-blue-100 border-green-200"}`}>
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Not Sure Which Plan to Choose?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start with our free plan and upgrade when you're ready. No credit card required.
              </p>
              <Button size="lg" className="mr-4">
                Start Free
              </Button>
              <Button size="lg" variant="outline">
                Talk to Sales
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
