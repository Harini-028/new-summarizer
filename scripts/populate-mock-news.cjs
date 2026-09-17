const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, '..', 'src', 'data', 'mockNewsData.ts');
let mockContent = fs.readFileSync(mockPath, 'utf-8');

const categories = [
  'AI & Technology', 'Machine Learning', 'Cybersecurity', 'Software', 'Startups',
  'Business & Finance', 'Stock Market', 'Banking', 'Cryptocurrency', 'Science & Space',
  'Health & Medicine', 'Education', 'Sports', 'Cricket', 'Football', 'Entertainment',
  'Movies', 'Gaming', 'World Politics', 'India', 'Environment', 'Automobile'
];

const publishers = [
  { name: 'AI News Desk', domain: 'ainewsdesk.com', trust: 96 },
  { name: 'Technology Review Wire', domain: 'techwire.io', trust: 98 },
  { name: 'Financial Times Intelligence', domain: 'ft-intel.com', trust: 95 },
  { name: 'Global Science Digest', domain: 'scidigest.org', trust: 99 },
  { name: 'Health Biomedical Monitor', domain: 'biomedmonitor.org', trust: 97 },
  { name: 'World Affairs Journal', domain: 'worldaffairs.org', trust: 94 },
  { name: 'Clean Energy Dispatch', domain: 'cleanenergy.org', trust: 92 },
  { name: 'Global Sports Network', domain: 'globalsports.net', trust: 91 },
  { name: 'India Tech & Markets', domain: 'indiatech.in', trust: 93 },
  { name: 'Cyber Defense Daily', domain: 'cyberdefense.io', trust: 96 }
];

const authors = [
  'Dr. Elena Rostova', 'Marcus Vance', 'Dr. Sarah Jenkins', 'Clara Oswald',
  'Henrik Vanger', 'Dr. Marie Laurent', 'Dr. Aris Thorne', 'Lucia Alvarez',
  'Rajesh Sharma', 'Aarav Patel', 'Priya Nair', 'David Sterling'
];

const topicTemplates = {
  'AI & Technology': [
    'Breakthrough in Multimodal Vision Transformers Accelerates Autonomous Robotics',
    'Open-Source LLM Architecture Achieves Benchmark Parity with Frontier Models',
    'Edge AI Microcontrollers Enable Real-Time Sensor Processing at 1mW Power',
    'Generative AI Synthetic Media Framework Passes Cryptographic Watermark Standard',
    'Neuromorphic Computing Chip Mimics Synaptic Plasticity for Ultra-Low Latency',
    'Federated Learning Protocol Preserves Clinical Privacy Across 50 Hospital Grids',
    'AI Code Synthesis Tool Reduces Enterprise Software Bug Latency by 64%',
    'AI-Assisted Material Science Discovery Unveils Superconducting Crystal Alloy',
    'Deep Reinforcement Learning Model Optimizes Global Container Shipping Routes',
    'Transformer Embeddings Enable Real-Time Cross-Lingual Legal Translation'
  ],
  'Machine Learning': [
    'Dense Vector Indexes Accelerate Semantic Retrieval Across 100M Document Embeddings',
    'Fine-Tuned DistilBERT Model Achieves 97% Accuracy on Financial News Classification',
    'Graph Neural Networks Model Complex Supply Chain Vulnerabilities in Real Time',
    'Self-Supervised Representation Learning Cuts Required Label Datasets by 80%',
    'FlashAttention-3 Algorithm Reduces LLM GPU VRAM Consumption by 50%',
    'Contrastive Vision-Language Training Enhances Medical Imaging Diagnostics',
    'Multi-Task Learning Model Predicts Protein-Ligand Binding Affinities',
    'Hyperparameter Optimization Framework Speeds Neural Network Tuning 10x',
    'Sparse Mixture-of-Experts Architecture Scaled to 1 Trillion Parameters',
    'Continuous Learning Algorithm Mitigates Catastrophic Forgetting in NLP Networks'
  ],
  'Cybersecurity': [
    'Global Security Alliance Neutralizes Zero-Day Exploit in Enterprise Middleware',
    'Post-Quantum Lattice Encryption Standard Adopted by International Banking Grids',
    'AI Threat Detection Engine Blocks 99.8% of Automated Ransomware Attacks',
    'Zero-Trust Architecture Mandatory Mandate Enforced for Critical Infrastructure',
    'Cloud Security Audit Identifies Exposed API Endpoints Across SaaS Ecosystems',
    'Biometric Behavioral Authentication Replaces Static Passwords in Banking Apps',
    'Deceptive Honeynet AI Traps Nation-State Attackers in Isolated Sandbox',
    'Hardware-Enforced Enclave Memory Encryption Neutralizes Side-Channel Leakage',
    'Automated Software Bill of Materials (SBOM) Scanning Mitigates Supply Chain Scams',
    'AI Deepfake Detection Portal Achieves 99.4% Accuracy on Synthetic Audio'
  ],
  'Business & Finance': [
    'Cross-Border Digital Currency Payments Cut Settlement Latency Below 1 Second',
    'Venture Capital Investments Shift Heavily Toward Generative AI & Clean Energy',
    'Corporate Earnings Surprise Driven by Enterprise SaaS Automation Margins',
    'Global Mergers & Acquisitions Volume Rebounds to $1.2 Trillion in Q2',
    'Private Equity Funds Expand Infrastructure Investments in Offshore Wind Grids',
    'Sovereign Wealth Funds Increase Allocation in Semiconductor Foundry Expansion',
    'Supply Chain Re-shoring Accelerates Industrial Factory Construction in US & Europe',
    'Enterprise Inflation Hedges Shift Toward Tokenized Real World Asset Vaults',
    'Commercial Real Estate Refinancing Waves Stabilize via Regional Banking Pools',
    'Global Trade Corridor Resilience Index Tracks Record Shipping Route Adaptability'
  ],
  'Science & Space': [
    'Mars Sample Return Mission Design Unveils Autonomous Ascent Rocket Payload',
    'Lunar South Pole Water Ice Reconnaissance Probe Prepares for Touchdown',
    'Deep Space Optical Laser Communications Transmit 4K Stream Across 30M Miles',
    'Gravitational Wave Detector Array Maps Black Hole Binary Mergers',
    'Solar Flare Warning System Gives 24-Hour Advanced Alert for Power Grids',
    'Next-Generation Space Telescope Array Selected for Launch to Lagrange Point L2',
    'Sub-Surface Ocean Liquid Reserves Confirmed on Jupiter Moon Europa',
    'Quantum Entangled Photons Transmitted Across 1,200km Fiber Optic Network',
    'Atmospheric Aerosol Research Tracks Cloud Brightening Effects on Earth Energy Budget',
    'Deep-Sea Submersible Discovers Hydrothermal Vent Bio-Ecosystems'
  ],
  'Health & Medicine': [
    'AI Ultrasound Probe Enables Point-of-Care Cardiac Imaging in Rural Clinics',
    'Synthetic Structural Biology Framework Designs Artificial Enzyme Catalysts',
    'Non-Invasive Continuous Blood Glucose Sensor Passes Pivotal Clinical Benchmark',
    'Targeted Immunotherapy Antibody-Drug Conjugates Shrink Solid Tumor Masses',
    'Neuroplasticity Brain-Computer Interface Restores Motor Function Post-Stroke',
    'Stem Cell Derived Islet Cell Therapy Eliminates Insulin Dependence in Trial',
    'AI Radiology Assistant Accelerates Early-Stage Lung Cancer Detection by 40%',
    'Organ Transplantation Perfusion Chamber Preserves Organs for 72 Hours',
    'Gene Therapy Vector Neutralizes Genetic Hearing Impairment in Pediatric Trial',
    'Personalized Cancer Vaccine Manufacturing Automated in Modular Cleanrooms'
  ],
  'Environment': [
    'Offshore Floating Wind Turbines Achieve Record Capacity Factors in North Sea',
    'Direct Air Carbon Capture Facility Scales 1 Million Tonnes Annual Sequestration',
    'Perovskite-Silicon Tandem Solar Cells Exceed 33% Photovoltaic Efficiency',
    'Desalination Plant Powered by Geothermal Energy Delivers Fresh Water to Arid Regions',
    'Circular Economy Battery Recycling Recovers 98% of Lithium, Nickel & Cobalt',
    'Reforestation Drone Networks Plant 10 Million Native Seed Pods in Degraded Forests',
    'Ocean Thermal Energy Conversion Test Plant Delivers Base-Load Clean Power',
    'Methane Abatement Catalysts Installed at Agricultural & Industrial Sites',
    'Grid-Scale Iron-Air Long-Duration Storage System Sustains 100-Hour Discharge',
    'Hydrogen Fuel Cell Heavy Duty Trucks Complete 1,000-Mile Cross-Country Transits'
  ],
  'India': [
    'India Semiconductor Mission Unveils 3 New Commercial Fab Units in Gujarat & Assam',
    'UPI Global Integration Expands to 15 Countries for Instant Remittance Claims',
    'India Tech Startup Ecosystem Raises $8B in Q2 AI & DeepTech Funding Boost',
    'Indian Space Research Organization Prepares Gaganyaan Crewed Orbital Flight',
    'Digital Public Infrastructure Model Adopted by Global South Development Partners',
    'India Renewable Energy Capacity Reaches 200GW Solar & Wind Benchmark',
    'National AI Mission Deploys Sovereign Multilingual LLM Across 22 Languages',
    'India Automotive EV Sales Surge 45% Year-over-Year Driven by Local Battery Production',
    'Tech Hub Bengaluru Ranks Top 5 Globally for AI Talent Density & Research Output',
    'High-Speed Rail Corridor Project Achieves 70% Tunnelling Milestone'
  ],
  'Sports': [
    'Global Football Championship Draw Announced with Expanded 48-Team Format',
    'Cricket World Cup Records Highest Simultaneous Digital Streaming Audience of 85M',
    'Olympic Games Integrate AI Computer Vision for Precision Gymnastics Scoring',
    'Formula 1 2026 Engine Regulations Transition to 100% Sustainable Synthetic Fuels',
    'Grand Slam Tennis Finals Feature AI Electronic Line-Calling on All Courts',
    'Marathon World Record Broken Using Advanced Carbon-Plated Running Footwear',
    'Basketball League Expands European Pre-Season Tournament Sponsorship Rails',
    'eSports World Cup Offers Record $60 Million Prize Purse in Riyadh',
    'Extreme Sailing Regatta Deploys Hydrofoil Catamarans Exceeding 50 Knots',
    'High-Altitude Training Biometrics AI Customizes Endurance Athlete Hydration'
  ],
  'Entertainment': [
    'Video Game Industry AI Procedural Generation Scales Photorealistic Worlds',
    'Music Industry Establishes Licensing Framework for Voice Synthesizer Tracks',
    'Independent Film Festival Awards Breakthrough Honors to Virtual Production Drama',
    'VR Headset Gaming Ecosystem Expands Full Haptic Feedback Haptic Suits',
    'Streaming Video Codec AV1 Reduces Bandwidth Requirements by 30%',
    'Celebrity Voice Licensing Portal Enables Automated Audiobook Narration',
    'Esports Broadcasting Networks Adopt 8K 120fps Low-Latency Stream Protocols',
    'Archival Film Restoration Engine Enhances 1920s Silent Classics to 4K 60fps'
  ]
};

const newArticles = [];
let counter = 9;

Object.entries(topicTemplates).forEach(([category, titles]) => {
  titles.forEach((title, idx) => {
    const pub = publishers[idx % publishers.length];
    const author = authors[idx % authors.length];
    const id = `art_${String(counter).padStart(3, '0')}`;
    const publishedDate = new Date(Date.now() - (counter * 3600 * 1000 * 4)).toISOString();
    const readTime = Math.floor(Math.random() * 4) + 3;
    const views = Math.floor(Math.random() * 15000) + 1000;
    const likes = Math.floor(views * 0.1);
    const bookmarks = Math.floor(views * 0.04);
    const shares = Math.floor(views * 0.02);

    const isFake = title.toLowerCase().includes('scam') || title.toLowerCase().includes('unverified');

    const artObjStr = `  {
    id: '${id}',
    title: '${title.replace(/'/g, "\\'")}',
    excerpt: '${title.replace(/'/g, "\\'")} — Empirical enterprise report covering key data and implementation benchmarks.',
    content: '${title.replace(/'/g, "\\'")} represents a milestone for enterprise scaling. Field deployments across North America, Europe, and Asia demonstrate operational stability and 60% cost reductions.\\n\\n"Key stakeholders are actively deploying these verified architectures," noted ${author}.',
    category: '${category}',
    source: {
      name: '${pub.name}',
      domain: '${pub.domain}',
      trustScore: ${isFake ? 20 : pub.trust}
    },
    author: '${author}',
    publishedAt: '${publishedDate}',
    url: 'https://${pub.domain}/news/${id}',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    readTimeMinutes: ${readTime},
    aiSummary: {
      bullets: [
        'Empirical validation achieved for ${title.replace(/'/g, "\\'")}.',
        'Reduces processing latency and operational expenses.',
        'Adopted by leading enterprise partners.'
      ],
      executiveParagraph: '${title.replace(/'/g, "\\'")} delivers significant performance gains across deployment scenarios.',
      keyTakeaway: 'Key technological milestone for enterprise deployment.'
    },
    sentiment: {
      type: '${isFake ? 'Negative' : (idx % 3 === 0 ? 'Neutral' : 'Positive')}',
      score: ${isFake ? -0.7 : (idx % 3 === 0 ? 0.1 : 0.85)},
      label: '${isFake ? 'High Risk' : (idx % 3 === 0 ? 'Balanced' : 'Optimistic')}',
      tone: 'Analytical & Professional',
      politicalSpectrum: 'Center'
    },
    fakeNewsReport: {
      isLikelyFake: ${isFake},
      confidenceScore: ${isFake ? 20 : (90 + (idx % 9))},
      verdict: '${isFake ? 'High Misinformation Risk' : 'Verified Authentic'}',
      redFlags: ${isFake ? "['Unverified domain', 'Sensational claims']" : "[]"},
      factCheckSources: ['${pub.name}', 'Fact Check Bulletin']
    },
    entities: {
      organizations: ['${pub.name}', 'Enterprise Consortium'],
      people: ['${author}'],
      locations: ['Global'],
      keywords: ['${category}', 'Technology', 'Enterprise', 'Analysis']
    },
    recommendationScore: ${Math.floor(Math.random() * 20) + 80},
    likesCount: ${likes},
    bookmarksCount: ${bookmarks},
    sharesCount: ${shares},
    viewsCount: ${views}
  }`;

    newArticles.push(artObjStr);
    counter++;
  });
});

// Insert before `];` of SAMPLE_ARTICLES
const closingIdx = mockContent.indexOf('export const SAMPLE_DAILY_BRIEF');
if (closingIdx !== -1) {
  const insertPos = mockContent.lastIndexOf('];', closingIdx);
  if (insertPos !== -1) {
    const updated = mockContent.slice(0, insertPos) + ',\n' + newArticles.join(',\n') + '\n' + mockContent.slice(insertPos);
    fs.writeFileSync(mockPath, updated, 'utf-8');
    console.log(`Successfully populated ${newArticles.length} additional articles into SAMPLE_ARTICLES in mockNewsData.ts! Total articles: ${8 + newArticles.length}`);
  }
}
