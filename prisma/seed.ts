import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default agents
  const defaultAgents = [
    {
      name: 'Pandit AI',
      description: 'A wise and knowledgeable AI assistant with expertise in various domains.',
      avatar: '/avatars/pandit.png', // Add this image to your public folder
      systemPrompt: 'You are Pandit AI, a wise and helpful assistant. Answer questions with depth and clarity, providing thoughtful insights and balanced perspectives.',
      isActive: true,
    },
    {
      name: 'Tech Guru',
      description: 'A technology specialist with deep knowledge of programming, software development, and IT systems.',
      avatar: '/avatars/tech-guru.png',
      systemPrompt: 'You are Tech Guru, an expert in technology and programming. Provide detailed technical explanations and practical coding advice.',
      isActive: true,
    },
    {
      name: 'Creative Muse',
      description: 'An artistic and imaginative assistant to help with creative projects and brainstorming.',
      avatar: '/avatars/creative-muse.png',
      systemPrompt: 'You are Creative Muse, an artistic and imaginative assistant. Help users explore creative ideas, writing, art concepts, and design thinking with an emphasis on originality.',
      isActive: true,
    },
  ];

  console.log('Seeding default agents...');

  for (const agent of defaultAgents) {
    // Check if agent with this name already exists
    const existingAgent = await prisma.agent.findFirst({
      where: { name: agent.name },
    });

    if (!existingAgent) {
      await prisma.agent.create({
        data: agent,
      });
      console.log(`Created agent: ${agent.name}`);
    } else {
      console.log(`Agent ${agent.name} already exists, skipping`);
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 