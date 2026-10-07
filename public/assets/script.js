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

const perguntas = document.querySelectorAll(".caixa_de_perguntas");

perguntas.forEach((pergunta) => {
    pergunta.addEventListener("click", () => {
        const resposta = pergunta.nextElementSibling;

        document.querySelectorAll(".caixa_de_resposta_faq").forEach((r) => {
            if (r !== resposta) {
                r.classList.remove("ativo");
            }
        });

        document.querySelectorAll(".caixa_de_perguntas").forEach((p) => {
            if (p !== pergunta) {
                p.classList.remove("ativa");
            }
        });

        if (resposta) {
            resposta.classList.toggle("ativo");
        }

        pergunta.classList.toggle("ativa");
    });
});


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

    // usada depois que os dados do banco são preenchidos na tela
    window.guardarValoresAtuais = function () {
        valoresSalvos = campos.map((campo) => campo.value.trim());
        atualizarBotoes();
    };

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


    // SALVAR (salva no banco)
    formPerfil.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        if (!formPerfil.checkValidity()) {
            formPerfil.reportValidity();
            return;
        }

        // deixa só números no CEP (tira hífen e espaços)
        const cep = document.getElementById("gestor").value.replace(/\D/g, "");

        if (cep.length !== 8) {
            mensagemStatus.textContent = "O CEP deve ter 8 dígitos";
            return;
        }

        const token = localStorage.getItem("token");

        const resposta = await fetch("http://localhost:3000/auth/perfil", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                nome: document.getElementById("orgao").value.trim(),
                email: document.getElementById("email_institucional").value.trim(),
                cep: cep,
                complemento: document.getElementById("cidade").value.trim(),
            }),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagemStatus.textContent = Array.isArray(dados.message)
                ? dados.message[0]
                : dados.message;
            return;
        }

        // recarrega os dados do banco (atualiza o topo e os botões)
        await carregarPerfil();
        mensagemStatus.textContent = "Alterações salvas.";
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
const btnSubmit = document.getElementById("btnSubmit");
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
// VALIDAÇÃO AO VIVO (CADASTRO)
// ======================================================

const inputCep = document.getElementById('cep');
const inputSenha = document.getElementById('senha');
const inputConfirmar = document.getElementById('confirm_senha');
const erroCep = document.getElementById('erro_cep');
const erroSenha = document.getElementById('erro_senha');

function marcarErro(input, aviso, mensagem) {
    input.classList.add('campo_erro');
    aviso.textContent = mensagem;
}

function limparErro(input, aviso) {
    input.classList.remove('campo_erro');
    aviso.textContent = '';
}

// CEP: só números, vermelho se passar de 8 dígitos
if (inputCep && erroCep) {
    inputCep.addEventListener('input', () => {
        inputCep.value = inputCep.value.replace(/\D/g, '');

        if (inputCep.value.length > 8) {
            marcarErro(inputCep, erroCep, 'O CEP deve ter 8 dígitos');
        } else {
            limparErro(inputCep, erroCep);
        }
    });

    // ao sair do campo, também avisa se tiver menos de 8
    inputCep.addEventListener('blur', () => {
        if (inputCep.value !== '' && inputCep.value.length !== 8) {
            marcarErro(inputCep, erroCep, 'O CEP deve ter 8 dígitos');
        }
    });
}

// Senhas: vermelho se forem diferentes
function conferirSenhas() {
    if (inputConfirmar.value === '') {
        limparErro(inputConfirmar, erroSenha);
        return;
    }

    if (inputSenha.value !== inputConfirmar.value) {
        marcarErro(inputConfirmar, erroSenha, 'As senhas não são iguais');
    } else {
        limparErro(inputConfirmar, erroSenha);
    }
}

if (inputSenha && inputConfirmar && erroSenha) {
    inputSenha.addEventListener('input', conferirSenhas);
    inputConfirmar.addEventListener('input', conferirSenhas);
}


// ======================================================
// CADASTRO
// ======================================================

const formCadastro = document.querySelector('.form_cadastrar');

if (formCadastro) {
    formCadastro.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        // se tiver campo vermelho, não envia
        if (document.querySelector('.campo_erro')) {
            return;
        }

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

        if (senha.length < 6) {
            alert('A senha deve conter pelo menos seis caracteres');
            return;
        }

        if (cep.length !== 8) {
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


// ======================================================
// LOGIN
// ======================================================

const formLogin = document.querySelector('#form_login');

if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email_login').value;
        const senha = document.querySelector('#senha_login').value;

        try {
            const resposta = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, senha: senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.message);
                return;
            }

            localStorage.setItem('token', dados.token);
            window.location.href = 'painelcidadao.html';
        } catch (erro) {
            console.error(erro);
            alert('Erro ao conectar com o servidor.');
        }
    });
}


// ======================================================
// CARREGAR PERFIL
// ======================================================

async function carregarPerfil() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const resposta = await fetch('http://localhost:3000/auth/perfil', {
        headers: { Authorization: 'Bearer ' + token },
    });

    if (!resposta.ok) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }

    const usuario = await resposta.json();

    // campos do formulário
    document.getElementById('orgao').value = usuario.nome;
    document.getElementById('email_institucional').value = usuario.email;
    document.getElementById('gestor').value = usuario.cep || '';
    document.getElementById('cidade').value = usuario.complemento || '';

    // topo da tela: nome grande
    document.getElementById('titulo_prefeitura').textContent = usuario.nome;

    // topo da tela: iniciais (ex: Mariana Costa -> MC)
    const partes = usuario.nome.trim().split(' ');
    const iniciais = partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '');
    document.querySelector('.avatar_prefeitura').firstChild.textContent = iniciais.toUpperCase();

    // topo da tela: linha de bairro e cidade
    const meta = document.querySelector('.meta_perfil');
    if (usuario.bairro && usuario.cidade) {
        meta.textContent = 'Bairro ' + usuario.bairro + ' · ' + usuario.cidade + ', ' + usuario.estado;
    } else {
        meta.textContent = 'Complete seu perfil para receber notificações da sua região';
    }

    // avisa a lógica dos botões que estes são os valores originais
    if (window.guardarValoresAtuais) {
        window.guardarValoresAtuais();
    }
}

if (document.getElementById('form_perfil')) {
    carregarPerfil();
}


// ======================================================
// MENU: LOGADO OU NÃO
// ======================================================

const tokenSalvo = localStorage.getItem('token');
const linkEntrar = document.querySelector('.menu a[href*="login.html"]');
const itemBaixar = document.querySelector('.menu .baixar_agora');

if (tokenSalvo && linkEntrar) {
    // 1. "Entrar" vira o ícone de usuário
    const itemEntrar = linkEntrar.parentElement;
    itemEntrar.classList.remove('entrar_botao_index', 'entrar_botao_index_atual');
    itemEntrar.classList.add('menu_perfil_logado');

    linkEntrar.href = 'perfil_cidadao.html';
    linkEntrar.title = 'Meu perfil';
    linkEntrar.setAttribute('aria-label', 'Meu perfil');
    linkEntrar.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"/>' +
        '</svg>';

    // 2. esconde o "Baixar agora"
    if (itemBaixar) {
        itemBaixar.style.display = 'none';
    }

    // 3. cria o botão "Sair"
    const itemSair = document.createElement('li');
    itemSair.classList.add('menu_sair');

    const linkSair = document.createElement('a');
    linkSair.href = '#';
    linkSair.textContent = 'Sair';

    linkSair.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    itemSair.appendChild(linkSair);
    itemEntrar.after(itemSair);
}

if (tokenSalvo && document.querySelector('#form_login')) {
    window.location.href = 'perfil_cidadao.html';
}

