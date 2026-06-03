const STORAGE_KEY = "quickblog:mock-db";

const demoUsers = [
  {
    id: "user-admin",
    username: "Admin",
    email: "admin@quickblog.test",
    password: "admin123",
    role: "admin",
  },
  {
    id: "user-writer",
    username: "Writer",
    email: "writer@quickblog.test",
    password: "writer123",
    role: "user",
  },
];

const demoPosts = [
  {
    id: "post-1",
    title: "Building a calm writing habit",
    content:
      "<p>A good blog starts with a small repeatable rhythm. Pick one idea, write a rough version, and come back tomorrow with fresh eyes.</p>",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    tags: ["Writing", "Productivity", "Blog"],
    author: { id: "user-writer", username: "Writer" },
    userId: "user-writer",
    createdAt: "2026-05-20T09:00:00.000Z",
  },
  {
    id: "post-2",
    title: "How QuickBlog handles simple publishing",
    content:
      "<p>QuickBlog keeps the publishing flow focused: upload an image, write the article, add tags, and publish when the shape feels right.</p>",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Vite", "Frontend"],
    author: { id: "user-admin", username: "Admin" },
    userId: "user-admin",
    createdAt: "2026-05-22T11:30:00.000Z",
  },
];

function readDb() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  const db = { users: demoUsers, posts: demoPosts };
  writeDb(db);
  return db;
}

function writeDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function currentUser() {
  const value = localStorage.getItem("user");
  return value ? JSON.parse(value) : null;
}

function withoutPassword(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

function makeToken(user) {
  return `mock-token-${user.id}`;
}

function delay(data) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 200);
  });
}

export const mockAuthApi = {
  async login(payload) {
    const db = readDb();
    const user = db.users.find((item) => item.email === payload.email && item.password === payload.password);
    if (!user) throw new Error("Invalid email or password");
    const safeUser = withoutPassword(user);
    return delay({ accessToken: makeToken(user), user: safeUser });
  },

  async register(payload) {
    const db = readDb();
    if (db.users.some((user) => user.email === payload.email)) {
      throw new Error("Email already exists");
    }
    const user = {
      id: `user-${crypto.randomUUID()}`,
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role: "user",
    };
    db.users.push(user);
    writeDb(db);
    const safeUser = withoutPassword(user);
    return delay({ accessToken: makeToken(user), user: safeUser });
  },

  async me() {
    return delay(currentUser());
  },
};

export const mockPostsApi = {
  async getAll(params) {
    const db = readDb();
    const posts = params?.userId ? db.posts.filter((post) => post.userId === params.userId) : db.posts;
    return delay(posts);
  },

  async getById(id) {
    const db = readDb();
    return delay(db.posts.find((post) => post.id === id) || null);
  },

  async create(payload) {
    const db = readDb();
    const user = currentUser();
    const post = {
      ...payload,
      id: `post-${crypto.randomUUID()}`,
      author: user ? { id: user.id || user._id, username: user.username } : undefined,
      userId: user?.id || user?._id,
      createdAt: new Date().toISOString(),
    };
    db.posts.unshift(post);
    writeDb(db);
    return delay(post);
  },

  async delete(id) {
    const db = readDb();
    db.posts = db.posts.filter((post) => post.id !== id && post._id !== id);
    writeDb(db);
    return delay({ success: true });
  },
};

export const mockUsersApi = {
  async getAll() {
    const db = readDb();
    return delay(db.users.map(withoutPassword));
  },

  async delete(id) {
    const db = readDb();
    db.users = db.users.filter((user) => user.id !== id && user._id !== id);
    db.posts = db.posts.filter((post) => post.userId !== id);
    writeDb(db);
    return delay({ success: true });
  },

  async changeRole(id, role) {
    const db = readDb();
    db.users = db.users.map((user) => (user.id === id || user._id === id ? { ...user, role } : user));
    writeDb(db);
    return delay({ success: true });
  },
};
