// ======================================================
// FAQ
// ======================================================

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
// ENVIO DO FORMULÁRIO
// ======================================================

if (form && checkbox) {

    form.addEventListener("submit", (e) => {

        if (!checkbox.checked) {

            e.preventDefault();

            alert("Você precisa aceitar os termos!");

            return;
        }

        e.preventDefault();

        window.location.href = "index.html";
    });
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