function generateMockSubtasks(taskTitle) {
  const normalizedTitle = String(taskTitle || '').toLowerCase();

  if (normalizedTitle.includes('login')) {
    return [
      'Criar endpoint de autenticação',
      'Validar credenciais',
      'Gerar token JWT',
      'Criar middleware de autorização',
    ];
  }

  return [
    'Analisar requisito',
    'Implementar funcionalidade',
    'Testar solução',
    'Documentar',
  ];
}

async function generateSubtasks(taskTitle) {
  console.log('AI subtasks generated');

  try {
    return generateMockSubtasks(taskTitle);
  } catch (error) {
    console.error('AI service error:', error.message);
    throw error;
  }
}

module.exports = {
  generateSubtasks,
};
