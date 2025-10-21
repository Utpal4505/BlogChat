import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const USER_COUNT = 100;
const POST_COUNT = 200;
const TAG_COUNT = 20;

async function main() {
  console.log("🌱 Starting seed...");

  // 1️⃣ Create unique tags and fetch them with IDs
  const tagNames = Array.from(new Set(Array.from({ length: TAG_COUNT }, () => faker.word.noun().toLowerCase())));
  await prisma.tag.createMany({
    data: tagNames.map((name) => ({ name })),
    skipDuplicates: true,
  });
  const tags = await prisma.tag.findMany();
  console.log(`✅ Created ${tags.length} tags`);

  // 2️⃣ Create users
  const usersData = [];
  for (let i = 0; i < USER_COUNT; i++) {
    const passwordHash = await bcrypt.hash("password123", 10);
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.username(),
      password: passwordHash,
      avatar: faker.image.url({ width: 200, height: 200 }),
      bio: faker.person.bio(),
      isVerified: faker.datatype.boolean(),
      registration_status: faker.helpers.arrayElement(["PENDING", "COMPLETED"]),
      visibility: faker.helpers.arrayElement(["PUBLIC", "PRIVATE"]),
      role: i === 0 ? "ADMIN" : "USER",
    });
  }
  await prisma.user.createMany({ data: usersData, skipDuplicates: true });
  const users = await prisma.user.findMany();
  console.log(`✅ Created ${users.length} users`);

  // 3️⃣ Create follows
  const followSet = new Set();
  while (followSet.size < USER_COUNT * 2) {
    const follower = faker.helpers.arrayElement(users);
    const followee = faker.helpers.arrayElement(users);
    if (follower.id !== followee.id) followSet.add(`${follower.id}-${followee.id}`);
  }
  const followData = Array.from(followSet).map((f) => {
    const [followerId, followeeId] = f.split("-").map(Number);
    return { followerId, followeeId };
  });
  await prisma.follow.createMany({ data: followData, skipDuplicates: true });
  console.log(`✅ Created ${followData.length} follows`);

  // 4️⃣ Create posts
  const posts = [];
  for (let i = 0; i < POST_COUNT; i++) {
    const author = faker.helpers.arrayElement(users);
    const post = await prisma.post.create({
      data: {
        authorId: author.id,
        title: faker.lorem.sentence({ min: 4, max: 10 }),
        slug: faker.helpers.slugify(faker.lorem.words({ min: 3, max: 5 })),
        content: faker.lorem.paragraphs({ min: 2, max: 5 }),
        coverImage: faker.image.url({ width: 800, height: 600, category: "nature" }),
        visibility: faker.helpers.arrayElement(["PUBLIC", "PRIVATE"]),
        status: faker.helpers.arrayElement(["PUBLISHED", "DRAFT"]),
        publishedAt: faker.date.recent({ days: 90 }),
        postTags: {
          create: faker.helpers
            .arrayElements(tags, { min: 1, max: 3 })
            .map((tag) => ({ tagId: tag.id })),
        },
      },
    });
    posts.push(post);
  }
  console.log(`✅ Created ${posts.length} posts`);

  // 5️⃣ Create comments
  const comments = [];
  for (let i = 0; i < POST_COUNT * 3; i++) {
    const post = faker.helpers.arrayElement(posts);
    const author = faker.helpers.arrayElement(users);
    comments.push({
      postId: post.id,
      authorId: author.id,
      content: faker.lorem.sentence({ min: 6, max: 15 }),
    });
  }
  await prisma.comment.createMany({ data: comments });
  console.log(`✅ Created ${comments.length} comments`);

  // 6️⃣ Create post likes
  const postLikesSet = new Set();
  while (postLikesSet.size < POST_COUNT * 5) {
    const post = faker.helpers.arrayElement(posts);
    const user = faker.helpers.arrayElement(users);
    postLikesSet.add(`${post.id}-${user.id}`);
  }
  const postLikes = Array.from(postLikesSet).map((f) => {
    const [postId, userId] = f.split("-").map(Number);
    return { postId, userId };
  });
  await prisma.postLike.createMany({ data: postLikes, skipDuplicates: true });
  console.log(`✅ Created ${postLikes.length} post likes`);

  // 7️⃣ Create notifications
  const notifications = [];
  for (let i = 0; i < 300; i++) {
    const recipient = faker.helpers.arrayElement(users);
    const actor = faker.helpers.arrayElement(users);
    notifications.push({
      recipientId: recipient.id,
      actorId: actor.id,
      type: faker.helpers.arrayElement(["LIKE", "COMMENT", "FOLLOW"]),
      referenceType: faker.helpers.arrayElement(["POST", "COMMENT"]),
      referenceId: faker.number.int({ min: 1, max: POST_COUNT }),
      isRead: faker.datatype.boolean(),
    });
  }
  await prisma.notification.createMany({ data: notifications });
  console.log(`✅ Created ${notifications.length} notifications`);

  // 8️⃣ Create feedbacks
  const feedbacks = [];
  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(users);
    feedbacks.push({
      userId: user.id,
      experienceMood: faker.helpers.arrayElement(["happy", "neutral", "sad"]),
      liked: faker.lorem.words(5),
      issues: faker.lorem.sentence(),
      page: faker.internet.url(),
      improvement: faker.lorem.sentence(),
      hasBug: faker.datatype.boolean(),
      bugDescription: faker.lorem.sentence(),
      recommendScore: faker.number.int({ min: 1, max: 10 }),
      metadata: { device: faker.internet.userAgent() },
    });
  }
  await prisma.feedback.createMany({ data: feedbacks });
  console.log(`✅ Created ${feedbacks.length} feedbacks`);

  console.log("🌍 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
