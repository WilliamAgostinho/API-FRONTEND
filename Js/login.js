function toggleScreen() {
  const loginBox = document.querySelector('.painel-login');
  const registerBox = document.querySelector('.painel-registro');

  if (loginBox.classList.contains('visivel')) {
    loginBox.classList.remove('visivel');
    setTimeout(() => registerBox.classList.add('visivel'), 500);
  } else {
    registerBox.classList.remove('visivel');
    setTimeout(() => loginBox.classList.add('visivel'), 500);
  }
}

document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const senha = e.target.senha.value;

  try {
    const response = await fetch('https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com/Autenticacao/autenticar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', email);

      const expiry = new Date(Date.now() + 60 * 60 * 1000);
      localStorage.setItem('tokenExpiry', expiry.toISOString());

      window.location.href = `welcome.html?token=${data.token}`;
    } else {
      alert(data.message || 'Erro no login.');
    }
  } catch (error) {
    alert('Erro na comunicação com a API.');
  }
});

document.getElementById('form-registro').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const senha = e.target.senha.value;
  const confirmarSenha = e.target.confirmarSenha.value;

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  try {
    const response = await fetch('https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com/Autenticacao/registar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha, senhaConfirmada: confirmarSenha }),
    });

    if (response.ok) {
      const text = await response.text();
      if (!text) {
        alert('Cadastro bem-sucedido! Redirecionando...');
        window.location.href = 'welcome.html';
        return;
      }

      try {
        const data = JSON.parse(text);
        alert(data.message || 'Cadastro realizado com sucesso!');
        window.location.href = 'welcome.html';
      } catch {
        alert('Cadastro bem-sucedido! Redirecionando...');
        window.location.href = 'welcome.html';
      }
    } else {
      const errorText = await response.text();
      alert(errorText || 'Erro no cadastro.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro na comunicação com a API.');
  }
});
