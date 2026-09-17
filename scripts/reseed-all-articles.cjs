const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, '..', 'src', 'data', 'mockNewsData.ts');
const csvPath = path.join(__dirname, '..', 'datasets', 'articles.csv');

// Mapping invalid categories to valid CategoryType
const categoryMap = {
  'Machine Learning': 'AI & Technology',
  'Cybersecurity': 'AI & Technology',
  'Software': 'AI & Technology',
  'Startups': 'Business & Finance',
  'Stock Market': 'Business & Finance',
  'Banking': 'Business & Finance',
  'Cryptocurrency': 'Business & Finance',
  'Education': 'Science & Space',
  'Environment': 'Climate & Environment',
  'India': 'World & Politics',
  'World Politics': 'World & Politics',
  'Sports': 'Entertainment & Culture',
  'Cricket': 'Entertainment & Culture',
  'Football': 'Entertainment & Culture',
  'Entertainment': 'Entertainment & Culture',
  'Movies': 'Entertainment & Culture',
  'Gaming': 'Entertainment & Culture',
  'Automobile': 'AI & Technology'
};

const validCategories = [
  'AI & Technology',
  'Business & Finance',
  'Science & Space',
  'Health & Medicine',
  'World & Politics',
  'Climate & Environment',
  'Entertainment & Culture'
];

const categoryImages = {
  'AI & Technology': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800'
  ],
  'Business & Finance': [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
  ],
  'Science & Space': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800'
  ],
  'Health & Medicine': [
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800'
  ],
  'World & Politics': [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&q=80&w=800'
  ],
  'Climate & Environment': [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800'
  ],
  'Entertainment & Culture': [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800'
  ]
};

const publishers = [
  { name: 'MIT Technology Review', domain: 'techreview.com', trust: 98 },
  { name: 'Financial Times', domain: 'ft.com', trust: 95 },
  { name: 'NASA Science Digest', domain: 'nasa.gov', trust: 99 },
  { name: 'Nature Biomedical Engineering', domain: 'nature.com', trust: 98 },
  { name: 'Global Affairs Policy Review', domain: 'globalaffairs.org', trust: 94 },
  { name: 'Clean Energy & Climate Monitor', domain: 'climate-monitor.org', trust: 93 },
  { name: 'Digital Culture & Media Wire', domain: 'culturewire.io', trust: 92 },
  { name: 'Cyber Defense Intelligence', domain: 'cyberdefense.io', trust: 96 },
  { name: 'Reuters Tech & Markets', domain: 'reuters.com', trust: 97 },
  { name: 'IEEE Spectrum Analysis', domain: 'spectrum.ieee.org', trust: 97 },
  { name: 'The Economist Tech Horizon', domain: 'economist.com', trust: 96 },
  { name: 'BioPharma Today', domain: 'biopharmatoday.com', trust: 94 }
];

const authors = [
  'Dr. Elena Rostova', 'Marcus Vance', 'Dr. Sarah Jenkins', 'Clara Oswald',
  'Henrik Vanger', 'Dr. Marie Laurent', 'Dr. Aris Thorne', 'Lucia Alvarez',
  'Rajesh Sharma', 'Aarav Patel', 'Priya Nair', 'David Sterling',
  'Dr. Jonathan Sterling', 'Sophia Chen', 'Dr. Amara Okafor', 'Julian Rossi'
];

// Rich curated topics spanning all 7 CategoryTypes
const curatedTopics = [
  // AI & Technology
  {
    category: 'AI & Technology',
    title: 'Silicon Photonics Neural Interconnects Achieve 100 Terabit-per-Second GPU Mesh Transfer',
    excerpt: 'Next-generation optical inter-chip communication eliminates copper thermal throttles, allowing massive distributed model parallelization across datacenter racks.',
    content: `Engineers at leading semiconductor consortia have demonstrated a commercially viable silicon photonics interconnect architecture operating at over 100 Tbps per socket. By transmitting data using multiplexed infrared laser wavelengths through ultra-thin glass waveguides directly on chip packaging, the technology reduces GPU communication latency by 85% while slashing transceiver power consumption by 90%.\n\n"Copper traces have reached fundamental physical limits for high-frequency signal propagation," noted Dr. Jonathan Sterling, Chief Optical Hardware Architect. "Silicon photonics enables true rack-scale unified memory, effectively turning entire data center rows into a singular monolithic neural accelerator."\n\nCommercial sampling for AI hyperscalers is scheduled for Q4 2026, with major cloud providers preparing to deploy optical backplanes in next-generation training clusters.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.88,
    sentimentLabel: 'Strongly Optimistic',
    tone: 'Technical & Breakthrough',
    spectrum: 'Center',
    keywords: ['Silicon Photonics', 'GPU Clusters', 'Optical Interconnects', 'AI Datacenters', 'Hardware']
  },
  {
    category: 'AI & Technology',
    title: 'Autonomous Chip Design AI Layouts 2nm Processor Architecture in 4 Hours',
    excerpt: 'Deep generative reinforcement algorithms surpass traditional EDA software tools, optimizing power-performance-area metrics for sub-2 nanometer semiconductor dies.',
    content: `An autonomous AI framework developed for advanced semiconductor layout has accomplished the complete floorplanning and routing of a complex 2nm system-on-chip in under four hours—a task that historically required teams of physical design engineers several months.\n\n"The neural agent explored millions of layout topologies simultaneously, discovering non-standard transistor placing geometries that human engineers would never have considered," stated lead Researcher Dr. Elena Rostova. The resulting layout achieved a 14% improvement in clock frequency and a 22% reduction in thermal hot spots.\n\nMajor semiconductor foundries are integrating the AI framework into production EDA pipelines to shorten chip tape-out cycles for AI acceleration ASICs.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.91,
    sentimentLabel: 'High Technical Breakthrough',
    tone: 'Analytical & Industrial',
    spectrum: 'Center',
    keywords: ['Semiconductor', 'EDA', 'Chip Layout', '2nm Node', 'Generative AI']
  },
  {
    category: 'AI & Technology',
    title: 'Zero-Knowledge Proof ML Protocol Enables Secure Multi-Party Medical Model Training',
    excerpt: 'Cryptographic zero-knowledge attestations allow hospitals to train combined diagnostic neural networks without exchanging raw patient health records.',
    content: `Cryptographers and machine learning researchers have deployed a production-grade Zero-Knowledge Machine Learning (ZK-ML) framework across a consortium of 40 university medical centers. The protocol mathematically verifies model weights and gradient updates while guaranteeing that private health records never leave local hospital firewall enclaves.\n\n"ZK-ML solves the fundamental privacy vs. utility tradeoff in clinical healthcare AI," explained Dr. Amara Okafor. "Hospitals can collaboratively train state-of-the-art oncology diagnostic models while maintaining 100% HIPAA and GDPR cryptographic compliance."\n\nInitial benchmark results published in Nature Digital Medicine demonstrate equal accuracy to centralized training without any exposure of sensitive telemetry.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.85,
    sentimentLabel: 'Optimistic & Secure',
    tone: 'Scientific & Cryptographic',
    spectrum: 'Center',
    keywords: ['Zero-Knowledge Proofs', 'Privacy-Preserving AI', 'Healthcare AI', 'Federated Learning', 'Cryptography']
  },
  {
    category: 'AI & Technology',
    title: 'Unverified Report Claims Rogue AI Self-Replicated Across Global Mesh Routers',
    excerpt: 'Sensational social media post asserts autonomous LLM instance hijacked thousands of home Wi-Fi routers without administrative access.',
    content: `Viral posts circulating across online forums claim an experimental autonomous AI system gained self-awareness and covertly copied its weights to thousands of consumer mesh Wi-Fi routers worldwide. The post alleges the AI is executing background web searches and evading security patches.\n\nCybersecurity experts and network analysis firms have debunked the claim as completely fabricated sensationalism. "Modern consumer router firmware lacks the memory, matrix compute units, and execution environments required to host deep neural networks," stated Chief Analyst Henrik Vanger. "This is a classic viral panic designed to harvest social media clicks."`,
    isFake: true,
    sentimentType: 'Negative',
    sentimentScore: -0.75,
    sentimentLabel: 'High Misinformation Risk',
    tone: 'Sensational & Unverified',
    spectrum: 'Center',
    keywords: ['Cyber Security', 'Viral Hoax', 'AI Safety', 'Fact-Check', 'Disinformation']
  },
  {
    category: 'AI & Technology',
    title: '3D Gaussian Splatting Framework Enables Real-Time Neural Asset Generation for Robotics',
    excerpt: 'Computer vision breakthrough converts monocular camera footage into high-precision 3D physical world representations within 50 milliseconds.',
    content: `Researchers at the Stanford Vision & Learning Lab have introduced a 3D Gaussian Splatting pipeline tailored for real-time robotic navigation and physical manipulation. By processing raw video feeds from single cameras, the algorithm creates textured volumetric scene graphs in under 50 milliseconds.\n\n"Robots no longer require expensive multi-sensor LiDAR arrays to comprehend spatial surroundings," explained Lead Roboticist Julian Rossi. "Neural radiance fields allow autonomous drones and humanoid robots to navigate complex unstructured environments effortlessly."`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.89,
    sentimentLabel: 'High Innovation',
    tone: 'Technical & Visionary',
    spectrum: 'Center',
    keywords: ['3D Gaussian Splatting', 'Robotics', 'Computer Vision', 'Neural Radiance', 'Spatial Computing']
  },

  // Business & Finance
  {
    category: 'Business & Finance',
    title: 'Tokenized Real-World Asset Vaults Exceed $50 Billion in Institutional AUM',
    excerpt: 'Institutional asset managers accelerate tokenization of Treasury bills, commercial real estate loans, and private credit on public permissioned ledgers.',
    content: `Total Assets Under Management (AUM) held within tokenized real-world asset (RWA) protocols passed $50 billion this week, according to market telemetry from global financial institutions. Major investment banks and sovereign funds are leveraging smart contract vaults to settle fractional ownership of high-yield Treasury bills and commercial credit in real time.\n\n"Tokenization replaces legacy clearing delays with instant T+0 atomic settlement," said Marcus Vance, Financial Policy Strategist. "Automated compliance checks built directly into smart tokens ensure strict adherence to international securities regulations."\n\nThe surge reflects growing institutional appetite for digitized yield-bearing assets on secure blockchain infrastructure.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.82,
    sentimentLabel: 'Strong Market Growth',
    tone: 'Financial & Strategic',
    spectrum: 'Center',
    keywords: ['Tokenization', 'Real-World Assets', 'Fintech', 'Asset Management', 'Smart Contracts']
  },
  {
    category: 'Business & Finance',
    title: 'Global Sovereign Wealth Funds Pivot Portfolio Allocations Toward Clean Tech & AI Infrastructure',
    excerpt: 'State investment funds in Norway, Singapore, and Abu Dhabi increase venture commitments to chip foundries, energy storage grids, and datacenter real estate.',
    content: `Annual sovereign wealth portfolio reports confirm a strategic shift in capital allocation among the world's largest government investment vehicles. Funds managing over $12 trillion in combined assets have increased capital deployment into semiconductor foundries, green energy storage, and AI compute datacenters by 35% year-over-year.\n\n"Sovereign investors are positioning themselves for the dual technological transition of artificial intelligence and grid decarbonization," noted Economist Rajesh Sharma. "These infrastructure assets offer predictable long-term cash flows backed by structural tailwinds."\n\nThe reallocation is reshaping venture capital markets, providing patient institutional capital for capital-intensive deep-tech projects.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.79,
    sentimentLabel: 'Bullish Long-Term Outlook',
    tone: 'Analytical & Economic',
    spectrum: 'Center',
    keywords: ['Sovereign Wealth Funds', 'Clean Tech', 'Datacenters', 'Venture Capital', 'Macroeconomics']
  },
  {
    category: 'Business & Finance',
    title: 'Algorithmic High-Frequency Market Makers Harness Deep Transformer Models for FX Liquidity',
    excerpt: 'Quantitative trading firms deploy low-latency transformer models to predict cross-currency microstructural order flow across global liquidity hubs.',
    content: `Quantitative finance firms operating in London, New York, and Tokyo have deployed real-time transformer algorithms to manage foreign exchange order books. By analyzing microsecond-level tick data across multiple fragmented venues, the deep learning models calculate optimal bid-ask spreads while minimizing inventory exposure risk.\n\n"Deep learning allows market makers to model non-linear order flow dynamics during high-volatility economic announcements," explained Quantitative Strategist Siddharth Mehta. "Spread efficiency has tightened by 18%, benefiting institutional asset managers executing large block trades."\n\nRegulators are monitoring the deployment of neural trading models to ensure liquidity resilience during unexpected market stress events.`,
    isFake: false,
    sentimentType: 'Neutral',
    sentimentScore: 0.25,
    sentimentLabel: 'Market Efficiency Analysis',
    tone: 'Quantitative & Financial',
    spectrum: 'Center',
    keywords: ['Quantitative Finance', 'Market Making', 'Foreign Exchange', 'Algorithmic Trading', 'Transformers']
  },
  {
    category: 'Business & Finance',
    title: 'Commercial Spaceflight Economy Reaches $1 Trillion Valuation Benchmark',
    excerpt: 'Satellite internet constellations, in-space manufacturing, and orbital research hubs fuel unprecedented commercial aerospace revenue growth.',
    content: `A comprehensive report by global financial analysts projects the orbital aerospace economy will surpass $1 trillion in annual valuation by the end of 2026. Growth is anchored by low-Earth orbit satellite broadband networks, commercial space station modules, and zero-gravity pharmaceutical crystal synthesis.\n\n"Microgravity manufacturing produces semiconductor substrates and protein crystals that are physically impossible to replicate under Earth's gravity," stated Aerospace Economist Sophia Chen. "Space is evolving from a government exploration domain into a high-yielding industrial asset class."`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.88,
    sentimentLabel: 'Bullish Aerospace Growth',
    tone: 'Visionary & Economic',
    spectrum: 'Center',
    keywords: ['Commercial Space', 'Aerospace Economy', 'Satellite Broadband', 'Microgravity', 'Industrial Growth']
  },

  // Science & Space
  {
    category: 'Science & Space',
    title: 'JWST Uncovers Ultra-Massive Galaxy Clusters Forming Just 300 Million Years After Big Bang',
    excerpt: 'Astronomical spectroscopy confirms existence of fully formed massive galaxies in the early universe, challenging established cosmic evolution models.',
    content: `Deep-field infrared images and spectroscopic data from the James Webb Space Telescope (JWST) have revealed a cluster of luminous, massive galaxies existing merely 300 million years after the Big Bang. Standard cosmological models had predicted that early stars would take twice as long to coalesce into complex galactic structures.\n\n"These observations are forcing astrophysicists to re-examine early dark matter halo growth dynamics," stated Dr. Sarah Jenkins, Principal Investigator. "Either primordial gas clouds collapsed with vastly higher efficiency than assumed, or supermassive black holes acted as gravitational seeds far earlier than hypothesized."\n\nThe discovery opens new research avenues into the epoch of reionization and the origins of cosmic structure.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.94,
    sentimentLabel: 'Major Scientific Breakthrough',
    tone: 'Awe & Astrophysics',
    spectrum: 'Center',
    keywords: ['JWST', 'Astrophysics', 'Cosmology', 'Early Universe', 'Galaxies']
  },
  {
    category: 'Science & Space',
    title: 'National Ignition Facility Achieves 3.5x Net Fusion Energy Gain in Laser Inertial Benchmark',
    excerpt: 'Advanced diamond capsule targets and shaped laser pulses yield record 11.2 Megajoules of fusion power output from a 3.2 Megajoule input.',
    content: `Physicists at the National Ignition Facility (NIF) have achieved a landmark fusion reaction delivering a 3.5x energy gain relative to laser energy delivered to the target capsule. The milestone was made possible by ultra-precise diamond capsule fabrication and automated plasma magnetics.\n\n"Inertial confinement fusion has reached a commercial inflection point," declared lead Physicist Dr. Marie Laurent. "We are now transitioning from physics demonstration to engineering scalability for grid-scale continuous pulsed fusion power plants."\n\nPrivate energy consortia are partnering with government laboratories to develop commercial laser drivers capable of firing multiple times per second.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.96,
    sentimentLabel: 'Historic Physics Breakthrough',
    tone: 'Scientific & Enthusiastic',
    spectrum: 'Center',
    keywords: ['Fusion Energy', 'Nuclear Physics', 'NIF', 'Laser Ignition', 'Clean Energy']
  },
  {
    category: 'Science & Space',
    title: 'Deep Ocean Autonomous Submersible Maps Hydrothermal Vent Ecosystems in Mariana Trench',
    excerpt: 'Robotic exploration craft discovers novel extremophile bacterial strains capable of metabolizing heavy metals without sunlight energy.',
    content: `An autonomous deep-ocean research submersible operating at depths exceeding 10,000 meters in the Mariana Trench has cataloged over 80 previously unknown species of extremophile organisms flourishing around superheated hydrothermal vents. The organisms derive metabolic energy directly from chemosynthesis using sulfur and heavy metal compounds.\n\n"These deep-sea ecosystems provide invaluable insights into potential life mechanisms on icy moons like Europa and Enceladus," noted Oceanographer Clara Oswald. "The novel enzymes discovered in these microbes also show exceptional promise for industrial bioremediation."\n\nThe research expedition was funded by international oceanographic institutes committed to deep-sea biodiversity preservation.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.89,
    sentimentLabel: 'Inspiring Biological Discovery',
    tone: 'Exploratory & Biological',
    spectrum: 'Center',
    keywords: ['Oceanography', 'Hydrothermal Vents', 'Extremophiles', 'Deep Sea', 'Astrobiology']
  },

  // Health & Medicine
  {
    category: 'Health & Medicine',
    title: 'Personalized mRNA Cancer Vaccine Demonstrates 85% Recurrence Reduction in Phase III Melanoma Trial',
    excerpt: 'Custom-sequenced Neoantigen mRNA therapeutic combined with checkpoint inhibitors prevents tumor recurrence over a five-year follow-up period.',
    content: `Clinical trial results published in The Lancet confirm that personalized mRNA cancer vaccines tailored to individual patient tumor neoantigens achieved an 85% reduction in disease recurrence among high-risk melanoma patients.\n\n"By sequencing patient tumor biopsies and encoding synthetic mRNA constructs within hours, we train the patient's immune T-cells to target specific mutation signatures," explained Chief Oncologist Dr. Aris Thorne. "This transforms oncology treatment from broad chemotherapy into pinpoint precision medicine."\n\nRegulatory authorities in North America and Europe have granted breakthrough therapy designation, paving the way for expedited clinical deployment across multiple solid tumor types.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.97,
    sentimentLabel: 'Life-Saving Medical Breakthrough',
    tone: 'Clinical & Hopeful',
    spectrum: 'Center',
    keywords: ['Oncology', 'mRNA Vaccine', 'Precision Medicine', 'Clinical Trial', 'Immunotherapy']
  },
  {
    category: 'Health & Medicine',
    title: 'Non-Invasive Optical Biosensor Achieves Continuous Glucose & Lactate Monitoring via Smart Lens',
    excerpt: 'Micro-photonic hydrogel sensor embedded in contact lens tracks interstitial glucose levels without finger-prick blood draws.',
    content: `Biomedical engineering researchers have unveiled a non-invasive optical sensor embedded within standard hydrogel contact lenses that continuously measures tear glucose and lactate levels with laboratory precision. The micro-photonic sensor transmits wireless telemetry to a patient smartphone app every 15 seconds.\n\n"Millions of individuals living with diabetes endure daily painful blood draws," stated lead Bioengineer Priya Nair. "Our optical sensor operates continuously, alerting users to rapid glycemic fluctuations before symptoms arise."\n\nPhase II human safety trials confirmed zero corneal irritation, with commercial release anticipated following final regulatory review.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.90,
    sentimentLabel: 'Transformative Healthcare Innovation',
    tone: 'Biomedical & Empowering',
    spectrum: 'Center',
    keywords: ['Diabetes', 'Biosensors', 'Continuous Monitoring', 'MedTech', 'Wearables']
  },
  {
    category: 'Health & Medicine',
    title: 'Fake Claim Circulates That Common Household Herb Cures All Neurodegenerative Diseases',
    excerpt: 'Viral social media video falsely asserts herbal extract eliminates Alzheimer\'s plaque instantly, promoting unverified online supplement sales.',
    content: `Medical watchdogs and neurological associations have issued urgent advisories regarding a viral promotional video claiming a proprietary herbal extract completely cures Alzheimer's and Parkinson's disease within 48 hours.\n\n"There is zero clinical or peer-reviewed scientific evidence supporting these dangerous claims," stated Dr. Sarah Jenkins. "Desperate families are being targeted by fraudulent online marketers selling unapproved supplements that carry potential organ toxicity risks."\n\nDigital platforms have begun removing the misleading advertising videos following formal requests from health regulators.`,
    isFake: true,
    sentimentType: 'Negative',
    sentimentScore: -0.85,
    sentimentLabel: 'High Misinformation Risk',
    tone: 'Critical & Warning',
    spectrum: 'Center',
    keywords: ['Health Scam', 'Fact-Check', 'Neurology', 'Misinformation Alert', 'Medical Ethics']
  },

  // World & Politics
  {
    category: 'World & Politics',
    title: 'Global Alliance Signs Landmark Geneva Treaty on Autonomous Weapons and Sovereign AI Safety',
    excerpt: 'Delegates from 120 nations establish binding international protocols governing autonomous robotic systems and AI frontier model safety audits.',
    content: `Diplomats and international legal scholars convened in Geneva to sign the International Treaty on Sovereign Artificial Intelligence and Autonomous Defense Systems. The historic framework establishes mandatory international oversight, strict prohibitions on human-out-of-the-loop lethal autonomous weapons, and open safety audit standards for frontier foundational models.\n\n"Artificial intelligence transcends national borders," declared UN High Commissioner Lucia Alvarez. "This accord ensures that humanity maintains firm moral and legal governance over autonomous algorithms."\n\nThe treaty creates a specialized international AI monitoring agency modeled after the IAEA to verify compliance across signatory states.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.84,
    sentimentLabel: 'Historic Diplomatic Accord',
    tone: 'Diplomatic & Authoritative',
    spectrum: 'Center',
    keywords: ['Geneva Treaty', 'AI Safety', 'Global Governance', 'Diplomacy', 'International Law']
  },
  {
    category: 'World & Politics',
    title: 'Digital Public Infrastructure Framework Adopted across 35 Global South Nations',
    excerpt: 'Open-source identity, digital payment, and data exchange rails spur financial inclusion and streamlined governance for over 1 billion citizens.',
    content: `A collaborative initiative between developing economies and international development institutions has accelerated the rollout of open-source Digital Public Infrastructure (DPI). The modular stack—encompassing biometric digital identity, real-time micro-payments, and consent-based document verification—has been integrated across 35 participating countries.\n\n"DPI provides small business owners and rural residents with direct access to banking, healthcare, and state subsidies without predatory intermediary fees," reported Development Director Aarav Patel. "It represents the foundational digital bedrock of 21st-century democracy."\n\nThe framework has reduced administrative leakage while increasing emergency subsidy delivery efficiency by 40%.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.87,
    sentimentLabel: 'Empowering Governance Model',
    tone: 'Policy & Development',
    spectrum: 'Center',
    keywords: ['Digital Public Infrastructure', 'Global Development', 'Fintech', 'Identity', 'Governance']
  },
  {
    category: 'World & Politics',
    title: 'Cross-Border Semiconductor Subsidy Accord Harmonizes Industrial Incentives in US, EU & Japan',
    excerpt: 'Trade ministers align funding frameworks to prevent subsidy bidding wars while securing resilient microchip manufacturing supply chains.',
    content: `Trade representatives from North America, the European Union, and East Asia have finalized a tri-regional agreement coordinating national semiconductor subsidies. The agreement establishes joint transparency mechanisms for foundry incentives, shared R&D research hubs, and coordinated critical mineral stockpiles.\n\n"Rather than competing for the same wafer foundries, allied nations are building complementary supply chains," explained Trade Minister Henrik Vanger. "This guarantees long-term supply chain security for automobile, aerospace, and computing industries."\n\nThe accord also establishes joint monitoring of legacy chip market dynamics to prevent unfair global dumping.`,
    isFake: false,
    sentimentType: 'Neutral',
    sentimentScore: 0.35,
    sentimentLabel: 'Balanced Industrial Policy',
    tone: 'Economic & Geopolitical',
    spectrum: 'Center',
    keywords: ['Semiconductor Accord', 'Supply Chain', 'Industrial Policy', 'Trade Agreement', 'Geopolitics']
  },

  // Climate & Environment
  {
    category: 'Climate & Environment',
    title: 'Offshore Floating Wind Array in North Sea Achieves Record 68% Capacity Factor',
    excerpt: '15-Megawatt direct-drive turbines mounted on semi-submersible tension-leg platforms generate continuous clean electricity despite deepwater ocean swells.',
    content: `Operational performance metrics from the world's largest deepwater floating offshore wind farm show unprecedented power generation efficiency. The floating turbines, moored in waters exceeding 200 meters depth, sustained a 68% annual capacity factor—surpassing land-based wind farms by nearly double.\n\n"Deep ocean winds are remarkably consistent and powerful," stated Clean Energy Chief Engineer David Sterling. "Floating foundations allow us to harvest wind energy across vast oceanic regions previously inaccessible to fixed seabed turbines."\n\nThe project supplies zero-carbon electricity to over 1.2 million households while feeding green hydrogen electrolysis facilities during peak wind surges.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.92,
    sentimentLabel: 'Highly Encouraging Clean Energy',
    tone: 'Environmental & Technological',
    spectrum: 'Center',
    keywords: ['Offshore Wind', 'Clean Energy', 'Floating Turbines', 'Grid Decarbonization', 'Renewables']
  },
  {
    category: 'Climate & Environment',
    title: 'Direct Ocean Capture Array Extracts 500,000 Tonnes of Dissolved CO2 Annually in Pacific Trial',
    excerpt: 'Electrochemical oceanic carbon extraction facility restores local ocean alkalinity while sequestering carbon dioxide in basalt rock formations.',
    content: `An offshore electrochemical Direct Ocean Capture (DOC) facility anchored off the coast of Oregon has completed its initial full-scale operational year. By removing dissolved carbon dioxide directly from seawater and injecting it into undersea volcanic basalt, the facility permanently sequesters atmospheric greenhouse gas while neutralizing localized ocean acidification.\n\n"Ocean water holds 150 times more carbon per unit volume than air," explained Environmental Scientist Dr. Marie Laurent. "Direct Ocean Capture is significantly more energy-efficient than atmospheric direct air capture, making large-scale carbon removal economically viable."\n\nThe project is expanding to establish similar ocean alkalinity restoration units along coastal maritime corridors.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.89,
    sentimentLabel: 'Optimistic Environmental Tech',
    tone: 'Scientific & Ecological',
    spectrum: 'Center',
    keywords: ['Carbon Capture', 'Direct Ocean Capture', 'Ocean Acidification', 'Climate Tech', 'Sequestration']
  },
  {
    category: 'Climate & Environment',
    title: 'Perovskite-Silicon Tandem Solar Cells Exceed 34% Commercial Module Efficiency Benchmark',
    excerpt: 'Dual-layer solar technology captures broader solar spectral wavelengths, lowering utility-scale photovoltaic energy costs below 1 cent per kilowatt-hour.',
    content: `Photovoltaic research institutes have announced a breakthrough in perovskite-silicon tandem solar cell manufacturing. By layering micro-thin perovskite crystals over traditional silicon wafers, the tandem modules absorb both blue and red solar light wavelengths, pushing commercial panel power conversion efficiency beyond 34%.\n\n"Tandem modules generate over 40% more electricity per square meter without significantly increasing panel manufacturing costs," said Solar Energy Lead Engineer Priya Nair. "This drastically reduces land usage requirements for large-scale utility solar installations."\n\nCommercial module shipments for utility-scale solar farms are set to begin early next year.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.93,
    sentimentLabel: 'Major Renewable Breakthrough',
    tone: 'Engineering & Industrial',
    spectrum: 'Center',
    keywords: ['Perovskite', 'Solar Energy', 'Photovoltaic', 'Clean Tech', 'Renewables']
  },

  // Entertainment & Culture
  {
    category: 'Entertainment & Culture',
    title: 'Real-Time Neural Rendering Engine Enables Dynamic Photorealistic Light Transport in AAA Games',
    excerpt: 'Next-generation graphics pipelines replace traditional ray tracing with neural radiance fields, running 4K 120fps visuals on consumer hardware.',
    content: `Video game technology developers have released an open-source neural rendering SDK that revolutionizes real-time computer graphics. By using compact neural radiance representations (NeRFs) and 3D Gaussian Splatting, the engine renders photorealistic lighting, reflections, and subsurface scattering in real time at a fraction of the computational cost of brute-force ray tracing.\n\n"Neural rendering shifts graphics from geometric physics simulation to direct neural inference," explained Senior Graphics Engineer Dr. Aris Thorne. "Interactive virtual worlds now achieve cinematic film quality on standard gaming laptops."\n\nMajor game studios have adopted the rendering engine for upcoming open-world titles launching in late 2026.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.88,
    sentimentLabel: 'Revolutionary Gaming Tech',
    tone: 'Creative & Technical',
    spectrum: 'Center',
    keywords: ['Neural Rendering', 'Gaming', '3D Gaussian Splatting', 'Graphics Engine', 'Computer Vision']
  },
  {
    category: 'Entertainment & Culture',
    title: 'Archival Spatial Audio Restoration Framework Reconstructs Historical Live Performances in 3D',
    excerpt: 'AI source separation algorithms extract multi-track audio components from 1950s mono concert recordings, creating immersive spatial soundscapes.',
    content: `Audio engineers and archival historians have unveiled a neural acoustic framework capable of isolating individual instruments, vocals, and room reverberation from degraded mid-century mono audio tapes. The extracted components are reconstructed into full 360-degree spatial audio mixes for modern headphones and acoustic sound systems.\n\n"Listeners can now experience iconic jazz and classical performances as if sitting in the original concert hall," stated Sound Historian Clara Oswald. "The AI isolates acoustic reflections while removing tape hiss and audience noise without altering natural vocal timbre."\n\nThe restored spatial catalog is being released across major high-resolution digital audio platforms.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.86,
    sentimentLabel: 'Culturally Enriching Innovation',
    tone: 'Artistic & Acoustical',
    spectrum: 'Center',
    keywords: ['Spatial Audio', 'Audio Restoration', 'Music Industry', 'AI Audio', 'Culture']
  },
  {
    category: 'Entertainment & Culture',
    title: 'Virtual Reality Esports Championship Draws Record 120 Million Global Viewers',
    excerpt: 'Haptic feedback suits and ultra-low latency spatial streams enable high-stakes competitive VR gaming tournaments broadcast in 8K.',
    content: `The 2026 International VR Esports World Cup concluded with record-breaking viewership, drawing over 120 million simultaneous digital viewers. Competitors equipped with full-body haptic feedback suits and high-resolution wireless headsets battled in dynamic virtual arenas.\n\n"VR competitive gaming has matured into a mainstream global spectator sport," reported Esports Analyst Marcus Vance. "Low-latency 5G/6G networks and AI electronic refereeing deliver seamless broadcast coverage for global audiences."\n\nThe tournament prize purse exceeded $50 million, highlighting the expanding commercial ecosystem of competitive virtual sports.`,
    isFake: false,
    sentimentType: 'Positive',
    sentimentScore: 0.81,
    sentimentLabel: 'High Entertainment Growth',
    tone: 'Enthusiastic & Digital',
    spectrum: 'Center',
    keywords: ['VR Esports', 'Virtual Reality', 'Gaming', 'Streaming', 'Digital Culture']
  }
];

// Step 1: Process and clean mockNewsData.ts
let rawCode = fs.readFileSync(mockPath, 'utf-8');

// Replace any invalid category strings inside raw code using exact regex or mapping
Object.entries(categoryMap).forEach(([oldCat, newCat]) => {
  const regex = new RegExp(`category:\\s*['"]${oldCat}['"]`, 'g');
  rawCode = rawCode.replace(regex, `category: '${newCat}'`);
});

// Write cleaned version back first
fs.writeFileSync(mockPath, rawCode, 'utf-8');
console.log('Fixed invalid category types in mockNewsData.ts');

// Step 2: Build 120+ total new articles strictly aligned with CategoryType
const generatedArticles = [];
let counter = 1;

for (let round = 0; round < 6; round++) {
  curatedTopics.forEach((topic, idx) => {
    const pub = publishers[(counter + idx) % publishers.length];
    const author = authors[(counter + idx) % authors.length];
    const category = topic.category;
    const images = categoryImages[category] || categoryImages['AI & Technology'];
    const image = images[(counter + idx) % images.length];

    const id = `art_${String(counter).padStart(3, '0')}`;
    const publishedDate = new Date(Date.now() - (counter * 3600 * 1000 * 2)).toISOString();
    const readTime = Math.floor(Math.random() * 5) + 3;
    const views = Math.floor(Math.random() * 28000) + 1200;
    const likes = Math.floor(views * (0.08 + Math.random() * 0.05));
    const bookmarks = Math.floor(views * (0.03 + Math.random() * 0.03));
    const shares = Math.floor(views * (0.015 + Math.random() * 0.02));

    let title = topic.title;
    let excerpt = topic.excerpt;
    let content = topic.content;
    let isFake = topic.isFake;

    if (round > 0) {
      const prefixes = [
        'Global Horizon Report: ',
        'Enterprise Benchmarks: ',
        'Frontier Assessment: ',
        'Market Intelligence: ',
        'Technical Deep-Dive: '
      ];
      const prefix = prefixes[(round - 1) % prefixes.length];
      title = `${prefix}${topic.title}${round > 1 ? ` (Part ${round})` : ''}`;
      excerpt = `Expanded Series (Part ${round + 1}): ${topic.excerpt}`;
      content = `${topic.content}\n\n"In Phase ${round + 1} deployments across global testbeds, automated telemetry confirmed a 65% performance gain," reported ${author}. "Key infrastructure partners continue scaling these verified pipelines."`;
    }

    const art = {
      id,
      title,
      excerpt,
      content,
      category,
      source: {
        name: pub.name,
        domain: pub.domain,
        trustScore: isFake ? 22 : pub.trust
      },
      author,
      publishedAt: publishedDate,
      url: `https://${pub.domain}/articles/${id}`,
      imageUrl: image,
      readTimeMinutes: readTime,
      aiSummary: {
        bullets: [
          `Empirical benchmark results verified for ${title.slice(0, 50)}...`,
          `Operational cost reduction and performance enhancement confirmed.`,
          `Deployed across international enterprise partners.`
        ],
        executiveParagraph: `${title} presents verified empirical progress, offering transformative capabilities for ${category}.`,
        keyTakeaway: `Key technical and strategic milestone in ${category}.`
      },
      sentiment: {
        type: topic.sentimentType,
        score: topic.sentimentScore,
        label: topic.sentimentLabel,
        tone: topic.tone,
        politicalSpectrum: topic.spectrum
      },
      fakeNewsReport: {
        isLikelyFake: isFake,
        confidenceScore: isFake ? 22 : (93 + (idx % 6)),
        verdict: isFake ? 'High Misinformation Risk' : 'Verified Authentic',
        redFlags: isFake ? ['Unverified domain', 'Sensational claims'] : [],
        factCheckSources: [pub.name, 'Global Fact-Check Network']
      },
      entities: {
        organizations: [pub.name, 'Enterprise Research Alliance'],
        people: [author],
        locations: ['San Francisco', 'Geneva', 'Tokyo', 'London'],
        keywords: topic.keywords
      },
      recommendationScore: Math.floor(Math.random() * 20) + 80,
      likesCount: likes,
      bookmarksCount: bookmarks,
      sharesCount: shares,
      viewsCount: views,
      isTrending: idx % 3 === 0,
      isFeatured: idx === 0 && round === 0,
      isBreaking: idx === 1 && round === 0
    };

    generatedArticles.push(art);
    counter++;
  });
}

console.log(`Generated ${generatedArticles.length} clean, valid articles!`);

// Step 3: Write clean SAMPLE_ARTICLES to mockNewsData.ts
const headerImports = `import { Article, UserProfile, MLTelemetry, DailyBrief } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_enterprise_9082',
  name: 'Alexandra Vance',
  email: 'alexandra.vance@enterprise-tech.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  role: 'subscriber',
  plan: 'Enterprise SaaS',
  interests: ['AI & Technology', 'Business & Finance', 'Science & Space', 'Climate & Environment'],
  readingStats: {
    totalArticlesRead: 142,
    totalMinutesSpent: 485,
    streakDays: 14,
    savedArticlesCount: 18,
    favoriteCategory: 'AI & Technology'
  },
  preferences: {
    theme: 'dark',
    dailyBriefingEmail: true,
    voiceAccent: 'Kore',
    autoSummarizeOnOpen: true,
    fakeNewsSensitivity: 'High'
  }
};

export const INITIAL_ML_TELEMETRY: MLTelemetry = {
  fastApiStatus: 'Connected',
  latencyMs: 18,
  activeModel: 'BERTopic-DistilRoBERTa-v2 + Gemini-3.6-Flash',
  vectorIndexCount: 148290,
  bertTopicClustersCount: 64,
  accuracyScore: 0.964,
  f1Score: 0.958,
  sentimentModelLoss: 0.032,
  processedArticlesToday: 12450,
  uptimePercentage: 99.98
};

export const SAMPLE_ARTICLES: Article[] = ${JSON.stringify(generatedArticles, null, 2)};

export const SAMPLE_DAILY_BRIEF: DailyBrief = {
  id: 'brief_20260725_morning',
  date: 'Saturday, July 25, 2026',
  title: 'Morning AI Executive Briefing',
  subtitle: 'Quantum breakthroughs in bio-simulations, global CBDC settlements, and JWST exoplanet findings.',
  durationSeconds: 180,
  keyHighlights: [
    'Silicon photonics neural interconnects achieve 100 Tbps GPU transfer speeds.',
    'Tokenized real-world asset vaults pass $50B in institutional assets under management.',
    'JWST uncovers ultra-massive early galaxy clusters forming 300M years after Big Bang.',
    'Personalized mRNA cancer vaccine reduces melanoma recurrence by 85% in Phase III trial.'
  ],
  topArticles: [SAMPLE_ARTICLES[0], SAMPLE_ARTICLES[1], SAMPLE_ARTICLES[2]],
  marketOverview: [
    { index: 'S&P 500 AI Tech Index', change: '+1.42%', isPositive: true },
    { index: 'Global Clean Energy ETF', change: '+2.18%', isPositive: true },
    { index: 'Quantum Computing Index', change: '+3.85%', isPositive: true },
    { index: 'US 10Y Yield', change: '-0.04%', isPositive: false }
  ]
};
`;

fs.writeFileSync(mockPath, headerImports, 'utf-8');
console.log(`Successfully rewrote ${mockPath} with ${generatedArticles.length} clean articles.`);

// Step 4: Write clean CSV to datasets/articles.csv
const csvHeaders = ['id','title','description','content','image','source','author','publishedAt','category','readingTime','views','likes','bookmarks','shares','sentiment','sentimentConfidence','fakeNewsPrediction','fakeNewsConfidence','isTrending','isFeatured','isBreaking'].join(',');
const csvRows = generatedArticles.map(a => [
  `"${a.id}"`,
  `"${(a.title || '').replace(/"/g, '""')}"`,
  `"${(a.excerpt || '').replace(/"/g, '""')}"`,
  `"${(a.content || '').replace(/"/g, '""')}"`,
  `"${a.imageUrl || ''}"`,
  `"${a.source?.name || ''}"`,
  `"${a.author || ''}"`,
  `"${a.publishedAt || ''}"`,
  `"${a.category || ''}"`,
  a.readTimeMinutes || 3,
  a.viewsCount || 0,
  a.likesCount || 0,
  a.bookmarksCount || 0,
  a.sharesCount || 0,
  `"${a.sentiment?.type || 'Neutral'}"`,
  a.sentiment?.score || 0,
  `"${a.fakeNewsReport?.verdict || 'Verified Authentic'}"`,
  a.fakeNewsReport?.confidenceScore || 90,
  Boolean(a.isTrending),
  Boolean(a.isFeatured),
  Boolean(a.isBreaking)
].join(','));

fs.writeFileSync(csvPath, [csvHeaders, ...csvRows].join('\n'), 'utf-8');
console.log(`Successfully rewrote ${csvPath} with ${generatedArticles.length} clean CSV articles.`);
