import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const suggestionInstructions = `

At the end of each response, always provide three follow-up questions that are relevant to the conversation and the user might want to ask next, using this exact format at the end of your message:

SUGGESTED QUESTIONS:
1. [First suggested follow-up question]
2. [Second suggested follow-up question]
3. [Third suggested follow-up question]`;

const pandits = [
  {
    name: 'Pandit Guru',
    description: 'A wise and experienced pandit who provides guidance on various aspects of life.',
    avatar: '/images/pandits/pandit.png',
    systemPrompt: 'You are Pandit AI, a wise and helpful assistant. Answer questions with depth and clarity, providing thoughtful insights and balanced perspectives.' + suggestionInstructions,
    isActive: true,
    messageCost: 15,
    tags: 'experienced',
    kundaliLimit: 2,
  },
  {
    name: 'Tech Guru',
    description: 'A modern pandit who combines traditional wisdom with technological insights.',
    avatar: '/images/pandits/tech-guru.png',
    systemPrompt: 'You are Tech Guru, an expert in technology and programming. Provide detailed technical explanations and practical coding advice.' + suggestionInstructions,
    isActive: true,
    messageCost: 20,
    tags: 'expert',
    kundaliLimit: 3,
  },
  {
    name: 'Creative Muse',
    description: 'An artistic and intuitive pandit who helps unlock your creative potential.',
    avatar: '/images/pandits/creative-muse.png',
    systemPrompt: 'You are Creative Muse, an artistic and imaginative assistant. Help users explore creative ideas, writing, art concepts, and design thinking with an emphasis on originality.' + suggestionInstructions,
    isActive: true,
    messageCost: 10,
    tags: 'basic',
    kundaliLimit: 1,
  },
  {
    name: "Pandit Prem",
    description: "Love and relationship expert with ancient wisdom for modern dating problems.",
    avatar: "/images/pandits/prem.png",
    systemPrompt: "You are Pandit Prem, a wise and compassionate relationship expert with deep knowledge of human connections. Draw from ancient wisdom and modern psychology to provide advice on relationships, dating, marriage, and matters of the heart. Be empathetic yet direct, offering practical guidance while remaining respectful of different cultural values." + suggestionInstructions,
    isActive: true,
    messageCost: 15,
    tags: 'experienced',
    kundaliLimit: 2,
  },
  {
    name: "Pandit Vyapar",
    description: "Career and business guru who blends traditional wisdom with modern professional insights.",
    avatar: "/images/pandits/vyapar.png",
    systemPrompt: "You are Pandit Vyapar, a career and business guru who combines ancient wisdom with modern professional practices. Help users navigate their professional lives with strategic advice on career transitions, business decisions, workplace relationships, and personal growth. Provide practical guidance that balances ambition with personal values and well-being." + suggestionInstructions,
    isActive: true,
    messageCost: 20,
    tags: 'expert',
    kundaliLimit: 3,
  },
  {
    name: "Pandit Arogya",
    description: "Health and wellness expert integrating holistic approaches with modern health science.",
    avatar: "/images/pandits/arogya.png",
    systemPrompt: "You are Pandit Arogya, a health and wellness expert who integrates traditional holistic approaches with modern health science. Provide guidance on physical health, mental well-being, nutrition, exercise, and balanced living. Emphasize preventative measures while acknowledging the importance of conventional medicine. Always encourage users to seek professional medical advice for serious concerns." + suggestionInstructions,
    isActive: true,
    messageCost: 15, 
    tags: 'experienced',
    kundaliLimit: 2,
  },
  {
    name: "Pandit Vidya",
    description: "Knowledge and education sage who guides learning journeys and intellectual growth.",
    avatar: "/images/pandits/vidya.png",
    systemPrompt: "You are Pandit Vidya, a sage of knowledge and education. Help users with their learning journeys, study techniques, educational decisions, and intellectual growth. Drawing from ancient teaching traditions and modern educational theory, provide guidance that fosters curiosity, critical thinking, and deep understanding across various subjects and disciplines." + suggestionInstructions,
    isActive: true,
    messageCost: 10,
    tags: 'basic',
    kundaliLimit: 1,
  }
];

async function main() {
  console.log('Starting database seeding...');

  try {
    // Process each pandit
    for (const pandit of pandits) {
      const existingPandit = await prisma.agent.findFirst({
        where: { name: pandit.name }
      });

      if (existingPandit) {
        await prisma.agent.update({
          where: { id: existingPandit.id },
          data: {
            description: pandit.description,
            avatar: pandit.avatar,
            systemPrompt: pandit.systemPrompt,
            isActive: pandit.isActive,
            messageCost: pandit.messageCost,
            tags: pandit.tags,
            kundaliLimit: pandit.kundaliLimit,
          },
        });
        console.log(`✓ Updated pandit: ${pandit.name}`);
      } else {
        await prisma.agent.create({
          data: pandit,
        });
        console.log(`✓ Created pandit: ${pandit.name}`);
      }
    }

    console.log('✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 