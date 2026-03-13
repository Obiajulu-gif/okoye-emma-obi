import type {
  AwardDoc,
  ProjectDoc,
  SiteContentDoc,
  SkillDoc,
} from "@/types/portfolio";

const nowIso = () => new Date().toISOString();

export const stellarContributionProjects = [
  { name: "ArenaX", url: "https://github.com/Arenax-gaming/ArenaX" },
  { name: "TrustUp-API", url: "https://github.com/TrustUp-app/TrustUp-API" },
  { name: "mindBlock_app", url: "https://github.com/MindBlockLabs/mindBlock_app" },
  { name: "Commitlabs-Contracts", url: "https://github.com/Commitlabs-Org/Commitlabs-Contracts" },
  { name: "bridgelet-sdk", url: "https://github.com/bridgelet-org/bridgelet-sdk" },
  { name: "pacto-p2p", url: "https://github.com/PACTO-LAT/pacto-p2p" },
  { name: "NexaFx-backend", url: "https://github.com/Nexacore-Org/NexaFx-backend" },
  { name: "chenpilot", url: "https://github.com/gear5labs/chenpilot" },
  { name: "predictify-contracts", url: "https://github.com/Predictify-org/predictify-contracts" },
  { name: "PetChain-Contracts", url: "https://github.com/DogStark/PetChain-Contracts" },
  { name: "chioma", url: "https://github.com/chioma-housing-protocol-I/chioma" },
  { name: "quest-service", url: "https://github.com/MindFlowInteractive/quest-service" },
  { name: "QiuckEx", url: "https://github.com/Pulsefy/QiuckEx" },
  { name: "esustellar", url: "https://github.com/BlockHaven-Labs/esustellar" },
  { name: "quicklendx-protocol", url: "https://github.com/QuickLendX/quicklendx-protocol" },
  { name: "Remitwise-Contracts", url: "https://github.com/Remitwise-Org/Remitwise-Contracts" },
  { name: "facilpay-api", url: "https://github.com/Facil-Pay/facilpay-api" },
  { name: "soroscope", url: "https://github.com/SoroLabs/soroscope" },
  { name: "Soter", url: "https://github.com/Pulsefy/Soter" },
  { name: "grainlify", url: "https://github.com/Jagadeeshftw/grainlify" },
  { name: "teachLink_mobile", url: "https://github.com/rinafcode/teachLink_mobile" },
  { name: "StrellerMinds-Backend", url: "https://github.com/StarkMindsHQ/StrellerMinds-Backend" },
  { name: "hintents", url: "https://github.com/dotandev/hintents" },
  { name: "tip-tune", url: "https://github.com/OlufunbiIK/tip-tune" },
  { name: "Soroban-Registry", url: "https://github.com/ALIPHATICHYD/Soroban-Registry" },
  { name: "nftopia-stellar", url: "https://github.com/NFTopia-Foundation/nftopia-stellar" },
  { name: "Callora-Backend", url: "https://github.com/CalloraOrg/Callora-Backend" },
  { name: "Teye-Contracts", url: "https://github.com/Stellar-Teye/Teye-Contracts" },
  { name: "petad-stellar", url: "https://github.com/amina69/petad-stellar" },
  { name: "Commitlabs-Frontend", url: "https://github.com/Commitlabs-Org/Commitlabs-Frontend" },
  { name: "Uzima-Backend", url: "https://github.com/Stellar-Uzima/Uzima-Backend" },
  { name: "Credence-Backend", url: "https://github.com/CredenceOrg/Credence-Backend" },
  { name: "Uzima-Contracts", url: "https://github.com/Stellar-Uzima/Uzima-Contracts" },
  { name: "soroban-debugger", url: "https://github.com/Timi16/soroban-debugger" },
  { name: "Harvest-Finance", url: "https://github.com/code-flexing/Harvest-Finance" },
  { name: "bridgelet-core", url: "https://github.com/bridgelet-org/bridgelet-core" },
  { name: "stellar-address-kit", url: "https://github.com/Stellar-Address-Kit/stellar-address-kit" },
  { name: "OrbitPay", url: "https://github.com/xqcxx/OrbitPay" },
  { name: "contracts", url: "https://github.com/Grant-Stream/contracts" },
  { name: "stellarspend-contracts", url: "https://github.com/stellarspend/stellarspend-contracts" },
  { name: "flowfi", url: "https://github.com/LabsCrypt/flowfi" },
  { name: "vestroll", url: "https://github.com/SafeVault/vestroll" },
  { name: "Revora-Backend", url: "https://github.com/RevoraOrg/Revora-Backend" },
  { name: "zendvo", url: "https://github.com/zendvolabs/zendvo" },
] satisfies ReadonlyArray<{ name: string; url: string }>;

export const stellarContributionProjectNames = stellarContributionProjects.map((project) => project.name);

export const stellarContributionRepoUrls = Object.fromEntries(
  stellarContributionProjects.map((project) => [project.name, project.url]),
) as Record<string, string>;

export const defaultSiteContent: SiteContentDoc = {
  singletonKey: "main",
  hero: {
    eyebrow: "Full-stack and blockchain engineer",
    name: "Okoye Emmanuel Obiajulu",
    roles: [
      "Software Developer",
      "MERN Developer",
      "Blockchain Developer",
      "DevOps Engineer",
    ],
    description:
      "Crafting exceptional digital experiences with modern web technologies. Specialized in building scalable full-stack applications.",
    primaryCtaLabel: "Hire Me",
    primaryCtaUrl: "https://wa.me/2349069406647",
    secondaryCtaLabel: "Resume",
    secondaryCtaUrl: "/resume.pdf",
    heroImageFallback: "/images/emmanuel.png",
  },
  about: {
    label: "About",
    title: "Engineering products with a studio-level blend of performance, UX, and delivery discipline.",
    summary:
      "Software developer focused on resilient full-stack systems, developer tooling, and Stellar ecosystem products.",
    body:
      "I work across Next.js, TypeScript, Node.js, Python, MongoDB, and smart-contract-oriented workflows. My recent work spans fintech, on-chain products, and developer tooling, with attention to performance, accessibility, and maintainable delivery.",
  },
  socials: {
    github: "https://github.com/Obiajulu-gif",
    linkedin: "https://www.linkedin.com/in/emmanuel-okoye-79a387200/",
    x: "https://x.com/okoye_emma_obi",
    email: "mailto:okoyeemmanuelobiajulu@gmail.com",
    website: "https://okoye-emma-obi.vercel.app",
  },
  contact: {
    label: "Contact",
    title: "Let’s build a fast, polished, and resilient product together.",
    intro:
      "Available for product engineering, frontend architecture, and blockchain-integrated full-stack delivery.",
    email: "okoyeemmanuelobiajulu@gmail.com",
    phone: "+2349069406647",
    location: "Anambra, Nigeria",
  },
  stellarSection: {
    label: "Stellar / Soroban OSS",
    title: "Stellar / Soroban Open Source",
    intro:
      "I actively contribute to Stellar blockchain projects and Soroban tooling.",
    contribution:
      "Contributed to 60+ Stellar ecosystem projects spanning contracts, SDKs, APIs, and developer experience utilities.",
    accent: "60+ ecosystem contributions across contracts, APIs, SDKs, and developer tooling.",
    projectNames: stellarContributionProjectNames,
  },
  presentation: {
    brandName: "Okoye Emmanuel",
    navigation: [
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "stellar", label: "Stellar OSS" },
      { id: "projects", label: "Projects" },
      { id: "credibility", label: "GitHub" },
      { id: "experience", label: "Experience" },
      { id: "awards", label: "Awards" },
      { id: "contact", label: "Contact" },
    ],
    skills: {
      label: "Skills",
      title: "Core stack I use to ship reliable products.",
      accent:
        "Visual stack rails for the languages, frameworks, data systems, DevOps tools, and blockchain workflows I use most.",
    },
    projects: {
      label: "Projects",
      title: "Project work with polished visuals and production constraints.",
      accent:
        "Hover cards for micro-interaction polish. Scroll sequencing emphasizes each row naturally.",
    },
    credibility: {
      label: "Credibility",
      title: "GitHub credibility that clients can evaluate quickly.",
    },
    experience: {
      label: "Experience",
      title: "Experience timeline",
    },
    education: {
      label: "Resume",
      title: "Education",
    },
    awards: {
      label: "Awards",
      title: "Awards & recognition",
    },
  },
  experience: [
    {
      company: "Chuzol Global Service",
      role: "Software Engineer",
      period: "2025 - Present",
      location: "Remote",
      highlights: [
        "Built and maintained production APIs and full-stack dashboards for internal operations and customer workflows.",
        "Improved delivery consistency by introducing stronger code review and deployment checks.",
        "Collaborated across product and engineering to ship features with measurable user impact.",
      ],
    },
    {
      company: "Netwiver Technologies",
      role: "Frontend Developer",
      period: "2024 - Present",
      location: "Remote",
      highlights: [
        "Developed custom web applications with React and Next.js.",
        "Implemented secure backend integrations and REST APIs.",
        "Delivered responsive and scalable UI systems with Tailwind CSS.",
      ],
    },
    {
      company: "ChainMove",
      role: "MERN Stack Developer",
      period: "2024 - Present",
      location: "Remote",
      highlights: [
        "Contributed to an Uber-like transportation platform powered by blockchain workflows.",
        "Designed and maintained RESTful APIs and authentication flows.",
        "Implemented real-time features for dispatch and rider tracking.",
      ],
    },
    {
      company: "Divine Mercy Computer",
      role: "Manager",
      period: "2017 - 2019",
      location: "Adazi-Nnukwu, Anambra",
      highlights: [
        "Managed day-to-day operations and customer services.",
        "Coordinated typing, printing, and document handling services.",
      ],
    },
  ],
  education: [
    {
      school: "University of Nigeria, Nsukka",
      degree: "B.Sc. Pure and Industrial Chemistry",
      period: "2019 - 2024",
      details: "Faculty Best Programmer of the Year (2024)",
    },
    {
      school: "ALX Africa",
      degree: "Software Engineering Program",
      period: "2023 - 2024",
      details: "Hands-on full-stack engineering training",
    },
    {
      school: "Harvard University",
      degree: "Aspire Leadership Program",
      period: "2024",
      details: "Leadership and impact-focused coursework",
    },
  ],
  resumeHighlights: {
    selectedProjects: [
      "Vault Quest",
      "Prompt Hub",
      "Freelance DAO",
      "ChainMove",
      "Swift",
      "Suibuy",
    ],
    awards: [
      "Best Programmer of the Year (2024)",
      "Winner - Plogging Nigeria Competition",
      "Winner of BlockchainUNN hackathon 4.0 (2025)",
    ],
    coreSkills: [
      "TypeScript",
      "Next.js",
      "Node.js",
      "MongoDB",
      "Soroban",
      "Rust",
    ],
    resumeUrl: "/resume.pdf",
  },
  updatedAt: nowIso(),
};

const defaultSkillsInput: Array<Omit<SkillDoc, "_id" | "updatedAt">> = [
  { name: "TypeScript", category: "Languages", order: 1 },
  { name: "JavaScript", category: "Languages", order: 2 },
  { name: "Python", category: "Languages", order: 3 },
  { name: "Rust", category: "Languages", order: 4 },
  { name: "Solidity", category: "Languages", order: 5 },
  { name: "Next.js", category: "Frontend", order: 6 },
  { name: "React", category: "Frontend", order: 7 },
  { name: "Tailwind CSS", category: "Frontend", order: 8 },
  { name: "Node.js", category: "Backend", order: 9 },
  { name: "Express.js", category: "Backend", order: 10 },
  { name: "Flask", category: "Backend", order: 11 },
  { name: "MongoDB", category: "Data", order: 12 },
  { name: "PostgreSQL", category: "Data", order: 13 },
  { name: "Redis", category: "Data", order: 14 },
  { name: "GSAP", category: "Frontend", order: 15 },
  { name: "GitHub Actions", category: "DevOps", order: 16 },
  { name: "Docker", category: "DevOps", order: 17 },
  { name: "Linux", category: "DevOps", order: 18 },
  { name: "Soroban", category: "Blockchain", order: 19 },
  { name: "Stellar SDK", category: "Blockchain", order: 20 },
];

export const defaultSkills: SkillDoc[] = defaultSkillsInput.map((item) => ({
  ...item,
  updatedAt: nowIso(),
}));

const legacyProjectSeed = [
  {
    name: "Reapvest",
    description:
      "Reapvest is a wealth-building platform that allows individuals to save and invest in agro and non-agro opportunities.",
    heroImageUrl: "/projects/reapvest.png",
    homepage: "https://reapvest.com/",
    githubUrl: "https://github.com/Obiajulu-gif/reapvest",
  },
  {
    name: "ChainMove",
    description:
      "A decentralized, blockchain-powered transportation platform that enhances transparency, efficiency, and security in mobility services.",
    heroImageUrl: "/projects/chainmove.png",
    homepage: "https://chain-move.vercel.app/",
    githubUrl: "https://github.com/Obiajulu-gif/chain_move/",
  },
  {
    name: "Suibuy",
    description:
      "Web3-powered direct-to-consumer marketplace, savings and loaning for local businesses and vendors.",
    heroImageUrl: "/projects/suibuy.png",
    homepage: "https://suibuy.vercel.app/",
    githubUrl: "https://github.com/Obiajulu-gif/suibuy/",
  },
  {
    name: "SmartFin",
    description:
      "AI-powered financial management platform for streamlined tracking and decision support.",
    heroImageUrl: "/projects/smartfin.png",
    homepage: "https://smartfin-pi.vercel.app/",
    githubUrl: "https://github.com/Obiajulu-gif/smartfin",
  },
  {
    name: "Swift",
    description:
      "Marketing platform focused on digital product distribution using SUI blockchain speed.",
    heroImageUrl: "/projects/swift.png",
    homepage: "https://swift-ebon.vercel.app/",
    githubUrl: "https://github.com/Obiajulu-gif/swift",
  },
  {
    name: "Zeus Scholarly",
    description:
      "Scholarship support platform with AI-assisted recommendation workflows.",
    heroImageUrl: "/projects/zeus-scholarly.png",
    homepage: "https://zeus-scholarly.vercel.app/",
    githubUrl: "https://github.com/Obiajulu-gif/Zeus-Scholarly",
  },
  {
    name: "Cresa",
    description: "Student management dashboard for dues and academic administration.",
    heroImageUrl: "/projects/cresa.png",
    homepage: "https://cresa-eight.vercel.app/admin/dashboard/student",
    githubUrl: "https://github.com/Obiajulu-gif/cresa",
  },
  {
    name: "Governator",
    description:
      "Decentralized governance app designed for transparent electoral processes.",
    heroImageUrl: "/projects/governator.png",
    homepage: "https://governator.vercel.app/",
    githubUrl: "https://github.com/soomtochukwu/Governator/",
  },
  {
    name: "Easybuy",
    description: "User-friendly e-commerce platform built to simplify online shopping.",
    heroImageUrl: "/projects/easybuy.png",
    homepage: "https://easybuy-rho.vercel.app/",
    githubUrl: "https://github.com/Obiajulu-gif/easybuy",
  },
  {
    name: "Camsole",
    description: "Ed-tech product for digital learning and management workflows.",
    heroImageUrl: "/projects/camsole.png",
    homepage: "https://camsole-chi.vercel.app/",
    githubUrl: "https://github.com/Obiajulu-gif/camsole",
  },
];

export const defaultProjects: ProjectDoc[] = legacyProjectSeed.map((project, index) => ({
  ...project,
  order: index + 1,
  featured: true,
  tags: [],
  languages: [],
  needsRepo: false,
  needsImage: false,
  updatedAt: nowIso(),
}));

export const defaultAwards: AwardDoc[] = [
  {
    title: "Best Programmer of the Year",
    orgOrEvent: "Faculty of Physical Science, University of Nigeria, Nsukka",
    year: 2024,
    placement: "Winner",
    order: 1,
    updatedAt: nowIso(),
  },
  {
    title: "BlockchainUNN Hackathon 3.0",
    orgOrEvent: "BlockchainUNN",
    year: 2024,
    placement: "Second Place",
    order: 2,
    updatedAt: nowIso(),
  },
  {
    title: "SUI on Campus Hackathon",
    orgOrEvent: "SUI on Campus",
    year: 2024,
    placement: "Second Place",
    order: 3,
    updatedAt: nowIso(),
  },
  {
    title: "Nextbridge Africa Hackathon",
    orgOrEvent: "Nextbridge Africa",
    year: 2024,
    placement: "Second Place",
    order: 4,
    updatedAt: nowIso(),
  },
  {
    title: "Rabble Ideathon",
    orgOrEvent: "Rabble",
    year: 2024,
    placement: "Winner",
    order: 5,
    updatedAt: nowIso(),
  },
  {
    title: "Plogging Nigeria Climate Festival Hackathon",
    orgOrEvent: "Plogging Nigeria Climate Festival",
    year: 2025,
    placement: "Winner",
    order: 6,
    updatedAt: nowIso(),
  },
  {
    title: "Enugu Pop City Hackathon",
    orgOrEvent: "Enugu Pop City",
    year: 2025,
    placement: "Winner",
    order: 7,
    updatedAt: nowIso(),
  },
  {
    title: "Anambra Web3 Hackathon",
    orgOrEvent: "Anambra Web3",
    year: 2025,
    placement: "Second Place",
    order: 8,
    updatedAt: nowIso(),
  },
  {
    title: "BlockchainUNN Hackathon 4.0",
    orgOrEvent: "BlockchainUNN",
    year: 2025,
    placement: "Winner",
    order: 9,
    updatedAt: nowIso(),
  },
  {
    title: "Plogging Nigeria Competition",
    orgOrEvent: "Plogging Nigeria",
    year: 2025,
    placement: "Winner",
    order: 10,
    updatedAt: nowIso(),
  },
];
