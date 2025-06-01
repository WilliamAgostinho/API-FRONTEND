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

    const responseText = await response.text();

    if (response.ok) {
      const data = JSON.parse(responseText);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', email);

      const expiry = new Date(Date.now() + 60 * 60 * 1000);
      localStorage.setItem('tokenExpiry', expiry.toISOString());

      window.location.href = `welcome.html?token=${data.token}`;
    } else {
      // tratamento de erro
      if (responseText.includes("Usuário ou senha incorretos")) {
        alert("Usuário ou senha incorretos");
      } else {
        alert(responseText || 'Erro ao tentar realizar login.');
      }
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

    const responseText = await response.text();

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        alert(data.message || 'Cadastro realizado com sucesso!');
      } catch {
        alert('Cadastro bem-sucedido!');
      }

      window.location.href = 'welcome.html';
    } else {
      try {
        const errorData = JSON.parse(responseText);
        if (response.status === 400 && errorData.errors?.Email?.length) {
          alert(errorData.errors.Email[0]);
        } else {
          alert(errorData.title || 'Erro no cadastro.');
        }
      } catch {
        if (responseText.includes("is already taken")) {
          alert("Este e-mail já está cadastrado.");
        } else {
          alert(responseText || 'Erro no cadastro.');
        }
      } 
    } 
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro na comunicação com a API.');
  }
});

