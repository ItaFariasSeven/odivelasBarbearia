let abaEntrar = document.getElementById("abaEntrar");
let abaCadastrar = document.getElementById("abaCadastrar");

let formLogin = document.getElementById("formLogin");
let formCadastro = document.getElementById("formCadastro");

let btnCadastrar = document.getElementById("btnCadastrar");

btnCadastrar.onclick = function () {
  formLogin.style.display = "none";
  formCadastro.style.display = "block";

  abaCadastrar.classList.add("aba-ativa");
  abaCadastrar.classList.remove("aba-inativa");

  abaEntrar.classList.add("aba-inativa");
  abaEntrar.classList.remove("aba-ativa");
};

abaCadastrar.onclick = function () {
  formLogin.style.display = "none";
  formCadastro.style.display = "block";

  abaCadastrar.classList.add("aba-ativa");
  abaCadastrar.classList.remove("aba-inativa");

  abaEntrar.classList.add("aba-inativa");
  abaEntrar.classList.remove("aba-ativa");
};

abaEntrar.onclick = function () {
  formCadastro.style.display = "none";
  formLogin.style.display = "block";

  abaEntrar.classList.add("aba-ativa");
  abaEntrar.classList.remove("aba-inativa");

  abaCadastrar.classList.add("aba-inativa");
  abaCadastrar.classList.remove("aba-ativa");
};