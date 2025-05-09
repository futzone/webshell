import command from '../config.json' assert {type: 'json'};
import { HELP } from "./commands/help";
import { BANNER } from "./commands/banner";
import { ABOUT } from "./commands/about"
import { DEFAULT } from "./commands/default";
import { PROJECTS } from "./commands/projects";
import { createWhoami } from "./commands/whoami";

//mutWriteLines gets deleted and reassigned
let mutWriteLines = document.getElementById("write-lines");
let historyIdx = 0
let tempInput = ""
let userInput : string;
let isSudo = false;
let isPasswordInput = false;
let passwordCounter = 0;
let bareMode = false;

//WRITELINESCOPY is used to during the "clear" command
const WRITELINESCOPY = mutWriteLines;
const TERMINAL = document.getElementById("terminal");
const USERINPUT = document.getElementById("user-input") as HTMLInputElement;
const INPUT_HIDDEN = document.getElementById("input-hidden");
const PASSWORD = document.getElementById("password-input");
const PASSWORD_INPUT = document.getElementById("password-field") as HTMLInputElement;
const PRE_HOST = document.getElementById("pre-host");
const PRE_USER = document.getElementById("pre-user");
const HOST = document.getElementById("host");
const USER = document.getElementById("user");
const PROMPT = document.getElementById("prompt");
const COMMANDS = ["help", "about", "projects", "whoami", "repo", "banner", "clear"];
const HISTORY : string[] = [];
const SUDO_PASSWORD = command.password;
const REPO_LINK = command.repoLink;

const scrollToBottom = () => {
  const MAIN = document.getElementById("main");
  if(!MAIN) return

  MAIN.scrollTop = MAIN.scrollHeight;
}

function userInputHandler(e : KeyboardEvent) {
  const key = e.key;

  switch(key) {
    case "Enter":
      e.preventDefault();
      if (!isPasswordInput) {
        enterKey();
      } else {
        passwordHandler();
      }

      scrollToBottom();
      break;
    case "Escape":
      USERINPUT.value = "";
      break;
    case "ArrowUp":
      arrowKeys(key);
      e.preventDefault();
      break;
    case "ArrowDown":
      arrowKeys(key);
      break;
    case "Tab":
      tabKey();
      e.preventDefault();
      break;
  }
}

function enterKey() {
  if (!mutWriteLines || !PROMPT) return
  const resetInput = "";
  let newUserInput;
  userInput = USERINPUT.value;

  if (bareMode) {
    newUserInput = userInput;
  } else {
    newUserInput = `<span class='output'>${userInput}</span>`;
  }

  HISTORY.push(userInput);
  historyIdx = HISTORY.length

  //if clear then early return
  if (userInput === 'clear') {
    commandHandler(userInput.toLowerCase().trim());
    USERINPUT.value = resetInput;
    userInput = resetInput;
    return
  }

  const div = document.createElement("div");
  div.innerHTML = `<span id="prompt">${PROMPT.innerHTML}</span> ${newUserInput}`;

  if (mutWriteLines.parentNode) {
    mutWriteLines.parentNode.insertBefore(div, mutWriteLines);
  }

  /*
  if input is empty or a collection of spaces, 
  just insert a prompt before #write-lines
  */
  if (userInput.trim().length !== 0) {
      commandHandler(userInput.toLowerCase().trim());
    }
  
  USERINPUT.value = resetInput;
  userInput = resetInput; 
}

function tabKey() {
  let currInput = USERINPUT.value;

  for (const ele of COMMANDS) {
    if(ele.startsWith(currInput)) {
      USERINPUT.value = ele;
      return
    }
  }
}

function arrowKeys(e : string) {
  switch(e){
    case "ArrowDown":      
      if (historyIdx !== HISTORY.length) {
          historyIdx += 1;
          USERINPUT.value = HISTORY[historyIdx];
          if (historyIdx === HISTORY.length) USERINPUT.value = tempInput;  
      }      
      break;
    case "ArrowUp":
      if (historyIdx === HISTORY.length) tempInput = USERINPUT.value;
      if (historyIdx !== 0) {
        historyIdx -= 1;
        USERINPUT.value = HISTORY[historyIdx];
      }
      break;
  }
}

function commandHandler(input : string) {
  if(input.startsWith("rm -rf") && input.trim() !== "rm -rf") {
    if (isSudo) {
      if(input === "rm -rf src" && !bareMode) {
        bareMode = true;

        setTimeout(() => {
          if(!TERMINAL || !WRITELINESCOPY) return
          TERMINAL.innerHTML = "";
          TERMINAL.appendChild(WRITELINESCOPY);
          mutWriteLines = WRITELINESCOPY;
        });

        easterEggStyles();
        setTimeout(() => {
          writeLines(["Bu yaxshi g‘oya deb o‘yladingizmi?", "<br>"]);
        }, 200)

        setTimeout(() => {
          writeLines(["Endi hammasi barbod bo‘ldi.", "<br>"]);
        }, 1200)

        } else if (input === "rm -rf src" && bareMode) {
          writeLines(["src papkasi allaqachon yo‘q.", "<br>"])
        } else {
          if(bareMode) {
            writeLines(["Yana nimani o‘chirmoqchisiz?", "<br>"])
          } else {
            writeLines(["<br>", "Katalog topilmadi.", "Mavjud kataloglarni ko‘rish uchun <span class='command'>'ls'</span> buyrug‘ini kiriting.", "<br>"]);
          }
        } 
      } else {
        writeLines(["Ruxsat berilmagan.", "<br>"]);
    }
    return
  }

  switch(input) {
    case 'clear':
      setTimeout(() => {
        if(!TERMINAL || !WRITELINESCOPY) return
        TERMINAL.innerHTML = "";
        TERMINAL.appendChild(WRITELINESCOPY);
        mutWriteLines = WRITELINESCOPY;
      })
      break;
    case 'banner':
      if(bareMode) {
        writeLines(["WebShell v1.0.1", "<br>"])
        break;
      }
      writeLines(BANNER);
      break;
    case 'help':
      if(bareMode) {
        writeLines(["Balki brauzeringizni qayta yuklasangiz, tuzalar.", "<br>"])
        break;
      }
      writeLines(HELP);
      break;
    case 'whoami':      
      if(bareMode) {
        writeLines([`${command.username}`, "<br>"])
        break;
      }
      writeLines(createWhoami());
      break;
    case 'about':
      if(bareMode) {
        writeLines(["Bu yerda hech narsa yo‘q.", "<br>"])
        break;
      }
      writeLines(ABOUT);
      break;
    case 'projects':
      if(bareMode) {
        writeLines(["Boshqa loyihalarni ham buzishingizni istamayman.", "<br>"])
        break;
      }
      writeLines(PROJECTS);
      break;
    case 'repo':
      writeLines(["Github sahifasiga yo‘naltirilmoqda...", "<br>"]);
      setTimeout(() => {
        window.open(REPO_LINK, '_blank');
      }, 500);
      break;
    case 'linkedin':
      // Qo‘shilishi kerak
      break;
    case 'github':
      // Qo‘shilishi kerak
      break;
    case 'email':
      // Qo‘shilishi kerak
      break;
    case 'rm -rf':
      if (bareMode) {
        writeLines(["Yana urinmang.", "<br>"])
        break;
      }

      if (isSudo) {
        writeLines(["Foydalanish: <span class='command'>'rm -rf &lt;papka&gt;'</span>", "<br>"]);
      } else {
        writeLines(["Ruxsat berilmagan.", "<br>"])
      }
        break;
    case 'sudo':
      if(bareMode) {
        writeLines(["Yo‘q.", "<br>"])
        break;
      }
      if(!PASSWORD) return
      isPasswordInput = true;
      USERINPUT.disabled = true;

      if(INPUT_HIDDEN) INPUT_HIDDEN.style.display = "none";
      PASSWORD.style.display = "block";
      setTimeout(() => {
        PASSWORD_INPUT.focus();
      }, 100);

      break;
    case 'ls':
      if(bareMode) {
        writeLines(["", "<br>"])
        break;
      }

      if (isSudo) {
        writeLines(["src", "<br>"]);
      } else {
        writeLines(["Ruxsat berilmagan.", "<br>"]);
      }
      break;
    default:
      if(bareMode) {
        writeLines(["'help' buyrug‘ini kiriting", "<br>"])
        break;
      }

      writeLines(DEFAULT);
      break;
  }  
}

function writeLines(message : string[]) {
  message.forEach((item, idx) => {
    displayText(item, idx);
  });
}

function displayText(item : string, idx : number) {
  setTimeout(() => {
    if(!mutWriteLines) return
    const p = document.createElement("p");
    p.innerHTML = item;
    mutWriteLines.parentNode!.insertBefore(p, mutWriteLines);
    scrollToBottom();
  }, 40 * idx);
}

function revertPasswordChanges() {
    if (!INPUT_HIDDEN || !PASSWORD) return
    PASSWORD_INPUT.value = "";
    USERINPUT.disabled = false;
    INPUT_HIDDEN.style.display = "block";
    PASSWORD.style.display = "none";
    isPasswordInput = false;

    setTimeout(() => {
      USERINPUT.focus();
    }, 200)
}

function passwordHandler() {
  if (passwordCounter === 2) {
    if (!INPUT_HIDDEN || !mutWriteLines || !PASSWORD) return
    writeLines(["<br>", "INCORRECT PASSWORD.", "PERMISSION NOT GRANTED.", "<br>"])
    revertPasswordChanges();
    passwordCounter = 0;
    return
  }

  if (PASSWORD_INPUT.value === SUDO_PASSWORD) {
    if (!mutWriteLines || !mutWriteLines.parentNode) return
    writeLines(["<br>", "PERMISSION GRANTED.", "Try <span class='command'>'rm -rf'</span>", "<br>"])
    revertPasswordChanges();
    isSudo = true;
    return
  } else {
    PASSWORD_INPUT.value = "";
    passwordCounter++;
  }
}

function easterEggStyles() {   
  const bars = document.getElementById("bars");
  const body = document.body;
  const main = document.getElementById("main");
  const span = document.getElementsByTagName("span");

  if (!bars) return
  bars.innerHTML = "";
  bars.remove()

  if (main) main.style.border = "none";

  body.style.backgroundColor = "black";
  body.style.fontFamily = "VT323, monospace";
  body.style.fontSize = "20px";
  body.style.color = "white";

  for (let i = 0; i < span.length; i++) {
    span[i].style.color = "white";
  }

  USERINPUT.style.backgroundColor = "black";
  USERINPUT.style.color = "white";
  USERINPUT.style.fontFamily = "VT323, monospace";
  USERINPUT.style.fontSize = "20px";
  if (PROMPT) PROMPT.style.color = "white";

}

const initEventListeners = () => {
  if(HOST) {
    HOST.innerText= command.hostname;
  }

  if(USER) {
    USER.innerText = command.username;
  }

  if(PRE_HOST) {
    PRE_HOST.innerText= command.hostname;
  }

  if(PRE_USER) {
    PRE_USER.innerText = command.username;
  } 

    window.addEventListener('load', () => {
    writeLines(BANNER);
  });
  
  USERINPUT.addEventListener('keypress', userInputHandler);
  USERINPUT.addEventListener('keydown', userInputHandler);
  PASSWORD_INPUT.addEventListener('keypress', userInputHandler);

  window.addEventListener('click', () => {
    USERINPUT.focus();
  });

  console.log(`%cPassword: ${command.password}`, "color: red; font-size: 20px;");
}

initEventListeners();
