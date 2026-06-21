let abaEntrar = document.getElementById("abaEntrar");
let abaCadastrar = document.getElementById("abaCadastrar");
let formLogin = document.getElementById("formLogin");
let formCadastro = document.getElementById("formCadastro");
let btnCadastrar = document.getElementById("btnCadastrar");
let btnVoltar = document.getElementById("btnVoltar");
let btnEsqueciSenha = document.getElementById("btnEsqueciSenha");
let formRecuperarSenha = document.getElementById("formRecuperarSenha");
let btnVoltarLogin = document.getElementById("btnVoltarLogin");

btnEsqueciSenha.onclick = function(){
    formLogin.style.display = "none";
    formCadastro.style.display = "none";
    formRecuperarSenha.style.display = "block";

}

btnVoltarLogin.onclick = function(){
    formRecuperarSenha.style.display = "none";
    formCadastro.style.display = "none";
    formLogin.style.display = "block";
}

btnVoltar.onclick = function(){

}

btnCadastrar.onclick = function(){

    formLogin.style.display = "none";
    formRecuperarSenha.style.display = "none";
    formCadastro.style.display = "block";

    abaCadastrar.classList.add("aba-ativa");
    abaCadastrar.classList.remove("aba-inativa");
    abaEntrar.classList.add("aba-inativa");
    abaEntrar.classList.remove("aba-ativa");
}

abaCadastrar.onclick = function () {

    formLogin.style.display = "none";
    formCadastro.style.display = "block";
    formRecuperarSenha.style.display = "none";

    abaCadastrar.classList.add("aba-ativa");
    abaCadastrar.classList.remove("aba-inativa");
    abaEntrar.classList.add("aba-inativa");
    abaEntrar.classList.remove("aba-ativa");

}

abaEntrar.onclick = function () {

    formCadastro.style.display = "none";
    formLogin.style.display = "block";
    formRecuperarSenha.style.display = "none";

    abaEntrar.classList.add("aba-ativa");
    abaEntrar.classList.remove("aba-inativa");
    abaCadastrar.classList.add("aba-inativa");
    abaCadastrar.classList.remove("aba-ativa");

}