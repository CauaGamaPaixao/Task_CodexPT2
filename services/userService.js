const USERS_API_URL = process.env.USERS_API_URL || 'https://jsonplaceholder.typicode.com/users';

async function getUsers() {
  console.log('External users API called');

  try {
    const response = await fetch(USERS_API_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Falha ao buscar usuários (${response.status}): ${body}`);
    }

    const users = await response.json();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    }));
  } catch (error) {
    console.error('User service error:', error.message);
    throw error;
  }
}

module.exports = {
  getUsers,
};
