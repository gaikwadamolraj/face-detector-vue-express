const ACCESS_LEVEL = {
  ADMIN: 1,
  NON_ADMIN: 2,
};

const users = [
  {
    id: 1,
    email: 'admin@admin.com',
    access_level: ACCESS_LEVEL.ADMIN,
    password: '$2b$10$YSaAjiURqwxTNYSgaRHcYOkxZ0n2WCixyLuilTZK00MQ6Ty8ivB7m',
  },
];

export const isAdmin = (user) =>
  ACCESS_LEVEL.ADMIN === parseInt(user.access_level);

export const getUserByEmail = (email) =>
  users.find((user) => user.email === email);

export const saveUser = (user) => {
  user.id = users.length + 1;
  user.access_level =
    ACCESS_LEVEL.ADMIN === parseInt(user.access_level) ? ACCESS_LEVEL.ADMIN : 2;
  users.push(user);
};
