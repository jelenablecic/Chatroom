import { Chatroom } from "./chat.js";
import { ChatUI } from "./ui.js";

// DOM
let ul = document.querySelector("ul");
let btnSend = document.querySelector("#btnSend");
let inputSend = document.querySelector("#inputSend");
let btnUpdate = document.querySelector("#btnUpdate");
let inputUpdate = document.querySelector("#inputUpdate");
let updateUsername = document.querySelector("#updateUsername");
let btnRoom = document.querySelector(".allBtn");
let btnTrash = document.querySelector("ul");
let btnColor = document.querySelector("#btnColor");
let inputColor = document.querySelector("#colorPicker");
let btnSet = document.querySelector("#btnSet");
let inputF = document.querySelector("#f");
let inputS = document.querySelector("#s");
let allBtn = document.querySelectorAll(".allBtn button");
let section = document.querySelector("#sec");

// Instance klasa
let chatroom = new Chatroom("general", "anonymus");
let chatUI = new ChatUI(ul);

//Local Storage
export let username = localStorage.username;
if (username) {
  chatroom.username = username;
}

let room = localStorage.room;
if (room) {
  chatroom.room = room;
}

// Ispis na stranici iz db na stranci
chatroom.getChats((d) => {
  chatUI.templateLI(d);
});

btnSend.addEventListener("click", (e) => {
  e.preventDefault();

  let text_input = document.querySelector("#inputSend");
  let text = inputSend.value;
  if (text.trim() !== "") {
    chatroom
      .addChats(text)
      .then(() => {
        text_input.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
  }
});

//Update username
btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  let usernameV = inputUpdate.value;
  let trim = usernameV.trim();
  if (trim.length >= 2 && trim.length <= 10) {
    chatroom.updateUsername(inputUpdate.value);
    localStorage.setItem("username", inputUpdate.value);

    updateUsername.innerText = "Username updated";
    updateUsername.style.display = "block";
    setTimeout(() => {
      inputUpdate.value = "";
      updateUsername.style.display = "none";
      location.reload();
    }, 2000);
  } else {
    updateUsername.innerText =
      "Username is not valid! Must be between 2 and 10 characters.";
    updateUsername.style.display = "block";
    setTimeout(() => {
      updateUsername.style.display = "none";
      inputUpdate.value = "";
    }, 2000);
  }
});

// Promena sobe
btnRoom.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("room", e.target.id);
  if (e.target.tagName == "BUTTON") {
    //1. Na klik obrisati sve poruke
    chatUI.delete();
    //2. Promena sobe
    chatroom.updateRoom(e.target.id);
    //3. Prikaz chat
    location.reload();
    chatroom.getChats((d) => {
      chatUI.templateLI(d);
    });
  }
});

// Brisanje pojedinacne poruke
btnTrash.addEventListener("click", (e) => {
  e.preventDefault(e);

  if (e.target.tagName == "IMG") {
    if (chatroom.username == e.target.parentElement.childNodes[1].innerText) {
      if (confirm("Da li zelite trajno da obrisete poruku?")) {
        chatroom.chats.doc(e.target.parentElement.id).delete();
        e.target.parentElement.remove();
      }
    } else {
      e.target.parentElement.remove();
    }
  }
});

//Promena boje
section.style.backgroundColor = "white";
btnColor.addEventListener("click", (e) => {
  e.preventDefault();
  let colorValue = inputColor.value;
  localStorage.setItem("color", colorValue);
  section.style.backgroundColor = localStorage.color;
});

// Promena vremena

btnSet.addEventListener("click", (e) => {
  e.preventDefault();
  let second = new Date(inputS.value);
  let sSec = second.getTime() / 1000;
  let first = new Date(inputF.value);
  let fSec = first.getTime() / 1000;
  chatUI.delete();
  chatroom.getChats((d) => {
    let time = d.data().created_at;
    if (time.seconds > fSec && time.seconds < sSec) {
      chatUI.templateLI(d);
    }
  });
});

allBtn.forEach((button) => {
  button.classList.remove("thisRoom");
  if (button.id == localStorage.room) {
    button.classList.add("thisRoom");
  }
});
