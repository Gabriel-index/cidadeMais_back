
// ======================================================
// MENU MOBILE
// ======================================================

const menuIcon = document.querySelector(
    ".header_mobile_index .material-symbols-outlined"
);

const menu = document.querySelector(".menu");

if (menuIcon && menu) {
    menuIcon.addEventListener("click", () => {
        menu.classList.toggle("ativo");
    });
}


// ======================================================
// ESCOLHA DO TIPO DE CONTA
// ======================================================

const btnCidadao = document.getElementById("btn_cidadao");
const btnPrefeitura = document.getElementById("btn_prefeitura");

const camposCidadao = document.getElementById("campos_cidadao");
const camposPrefeitura = document.getElementById("campos_prefeitura");

function alternarTipoConta(tipo) {
    const ehCidadao = tipo === "cidadao";

    if (btnCidadao) {
        btnCidadao.classList.toggle("ativo", ehCidadao);
    }

    if (btnPrefeitura) {
        btnPrefeitura.classList.toggle("ativo", !ehCidadao);
    }

    if (camposCidadao) {
        camposCidadao.style.display = ehCidadao ? "block" : "none";
    }

    if (camposPrefeitura) {
        camposPrefeitura.style.display = ehCidadao ? "none" : "block";
    }

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const bairro = document.getElementById("bairro");

    if (name) {
        name.required = ehCidadao;
    }

    if (email) {
        email.required = ehCidadao;
    }

    if (bairro) {
        bairro.required = ehCidadao;
    }
}

if (btnCidadao) {
    btnCidadao.addEventListener("click", () => {
        alternarTipoConta("cidadao");
    });
}

if (btnPrefeitura) {
    btnPrefeitura.addEventListener("click", () => {
        alternarTipoConta("prefeitura");
    });
}


// ======================================================
// FORMULÁRIO DE PERFIL
// ======================================================

const formPerfil = document.getElementById("form_perfil");

if (formPerfil) {

    const campos = [
        ...formPerfil.querySelectorAll("input:not([readonly])")
    ];

    const btnSalvar = document.getElementById("btnSalvarPerfil");
    const btnDescartar = document.getElementById("btnDescartarPerfil");
    const mensagemStatus = document.getElementById("status_form_perfil");

    let valoresSalvos = campos.map((campo) => campo.value);

    function atualizarBotoes() {

        const houveMudanca = campos.some((campo, i) => {
            return campo.value.trim() !== valoresSalvos[i];
        });

        if (btnSalvar) {
            btnSalvar.disabled = !houveMudanca;
        }

        if (btnDescartar) {
            btnDescartar.disabled = !houveMudanca;
        }
    }

    campos.forEach((campo) => {

        campo.addEventListener("input", () => {

            if (mensagemStatus) {
                mensagemStatus.textContent = "";
            }

            atualizarBotoes();
        });

    });


    // DESCARTAR
    if (btnDescartar) {

        btnDescartar.addEventListener("click", () => {

            campos.forEach((campo, i) => {
                campo.value = valoresSalvos[i];
            });

            if (mensagemStatus) {
                mensagemStatus.textContent = "";
            }

            atualizarBotoes();
        });

    }


    // SALVAR
    formPerfil.addEventListener("submit", (evento) => {

        evento.preventDefault();

        if (!formPerfil.checkValidity()) {
            formPerfil.reportValidity();
            return;
        }

        valoresSalvos = campos.map((campo) => {
            return campo.value.trim();
        });

        atualizarBotoes();

        if (mensagemStatus) {
            mensagemStatus.textContent = "Alterações salvas.";
        }
    });


    atualizarBotoes();
}


// ======================================================
// MODAL DE TERMOS
// ======================================================

const modal = document.getElementById("modalTermos");
const abrir = document.getElementById("abrirModal");
const fechar = document.getElementById("fecharModal");
const btnAceito = document.getElementById("btnAceito");
const checkbox = document.getElementById("checkboxTermos");
const form = document.querySelector(".form_cadastrar");


// ABRIR MODAL
if (abrir && modal) {

    abrir.addEventListener("click", (e) => {

        e.preventDefault();

        modal.style.display = "block";
    });
}


// FECHAR MODAL
if (fechar && modal) {

    fechar.addEventListener("click", () => {

        modal.style.display = "none";
    });
}


// CLICAR FORA
if (modal) {

    window.addEventListener("click", (e) => {

        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}


// ======================================================
// ACEITAR TERMOS
// ======================================================

function verificarCheckbox() {

    if (btnSubmit && checkbox) {
        btnSubmit.disabled = !checkbox.checked;
    }
}


if (btnAceito && checkbox && modal) {

    btnAceito.addEventListener("click", () => {

        checkbox.checked = true;

        localStorage.setItem("termosAceitos", "true");

        modal.style.display = "none";

        verificarCheckbox();
    });
}


if (checkbox) {

    checkbox.addEventListener("change", verificarCheckbox);
}



// ======================================================
// CARREGAMENTO
// ======================================================

window.addEventListener("load", () => {

    if (checkbox) {

        if (localStorage.getItem("termosAceitos")) {
            checkbox.checked = true;
        }

        verificarCheckbox();
    }
});

// ======================================================
// CADASTRO
// ======================================================

const formCadastro = document.querySelector('.form_cadastrar');

if (formCadastro) {
  formCadastro.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    if (!checkbox.checked) {
      alert('Você precisa aceitar os termos!');
      return;
    }

    if (btnPrefeitura.classList.contains('ativo')) {
      alert('Cadastro de prefeitura ainda não está pronto');
      return;
    }

    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cep = document.getElementById('cep').value;
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirm_senha').value;

    if (senha !== confirmar) {
      alert('As senhas não são iguais');
      return;
    }

    if (senha.length<6) {
        alert('A senha deve conter mais de seis caracteres');
        return;
    }

    if (cep.length !== 8){
        alert('O CEP deve conter 8 dígitos');
        return;
    }

    const resposta = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, cep, senha }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert('Cadastro feito!');
      window.location.href = 'login.html';
    } else {
      alert(dados.message);
    }
  });
}

const formLogin = document.querySelector('#form_login');

formLogin.addEventListener('submit', async (event) => {

    event.preventDefault();

    const email = document.querySelector('#email_login').value;
    const senha = document.querySelector('#senha_login').value;

    try {

        const resposta = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.message);
            return;
        }

        // Login correto
        window.location.href = 'perfil_cidadao.html';

    } catch (erro) {

        console.error(erro);
        alert('Erro ao conectar com o servidor.');

    }
});