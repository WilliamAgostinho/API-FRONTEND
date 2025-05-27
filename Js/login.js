function toggleScreen() {
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
  
    if (loginBox.classList.contains('active')) {
      loginBox.classList.remove('active');
      setTimeout(() => {
        registerBox.classList.add('active');
      }, 500);
    } else {
      registerBox.classList.remove('active');
      setTimeout(() => {
        loginBox.classList.add('active');
      }, 500);
    }
  }
  
  // Login - form dentro da login-box
  document.querySelector('.login-box form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const loginBox = document.querySelector('.login-box');
    const email = loginBox.querySelector('input[placeholder="E-mail"]').value;
    const senha = loginBox.querySelector('input[placeholder="Senha"]').value;
  
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
  
  // Cadastro - form dentro da register-box
  document.querySelector('.register-box form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const registerBox = document.querySelector('.register-box');
    const email = registerBox.querySelector('input[placeholder="E-mail"]').value;
    const senha = registerBox.querySelector('input[placeholder="Senha"]').value;
    const confirmarSenha = registerBox.querySelector('input[placeholder="Confirmar senha"]').value;
  
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
  