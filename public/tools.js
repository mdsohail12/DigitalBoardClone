let toolsCont = document.querySelector(".tools-cont");

let optionsContent = document.querySelector(".options-cont");
let optionsFlag = true;

let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".erase-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");

let pencilFlag = false;
let eraserFlag = false;

optionsContent.addEventListener("click", (e) => {
  // true -->tools show, false-->tools hide

  optionsFlag = !optionsFlag;

  if (optionsFlag) openTools();
  else closeTools();
});

function openTools() {
  let iconElem = optionsContent.children[0];
  iconElem.classList.remove("fa-xmark");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "flex";
}
function closeTools() {
  let iconElem = optionsContent.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-xmark");
  toolsCont.style.display = "none";

  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  //  true -> show pencile tool false--> hide pencil tool
  pencilFlag = !pencilFlag;

  if (pencilFlag) pencilToolCont.style.display = "block";
  else pencilToolCont.style.display = "none";
});

eraser.addEventListener("click", (e) => {
  //  true -> show eraser tool false--> hide eraser tool
  eraserFlag = !eraserFlag;

  if (eraserFlag) eraserToolCont.style.display = "flex";
  else eraserToolCont.style.display = "none";
});

// yha pe upload ka code h
upload.addEventListener("click", (e) => {
  // open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  //  upload the image
  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyTemplateHtml=`
    <div class="header-cont">
                      <div class="minimize"></div>
                      <div class="remove"></div>
                  </div>
          
                  <div class="note-cont">
                  <img src="${url}"/>
                  </div>
    `;
    createSticky(stickyTemplateHtml);
  })
})

//  sticky ko nya se create ka code and drag and drop ka bhi
sticky.addEventListener("click", (e) => {
  let stickyTemplateHtml = `   
            <div class="header-cont">
                <div class="minimize"></div>
                <div class="remove"></div>
            </div>
    
            <div class="note-cont">
                <textarea spellcheck="false"></textarea>
            </div>`;
            createSticky(stickyTemplateHtml);
});

function createSticky(stickyTemplateHtml){
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHtml;
    document.body.appendChild(stickyCont);
    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove ");
    noteActions(minimize, remove, stickyCont);
  
    stickyCont.onmousedown = function (event) {
      dragAndDrops(stickyCont, event);
    };
    stickyCont.ondragstart = function () {
      return false;
    };
}


// yha function bna h  noteaction ka
function noteActions(minimize, remove, stickyCont) {
  // yha sticky notes ko remove kar diye ok
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  });
  // yha pe minimize ka code h
  minimize.addEventListener("click", (e) => {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") noteCont.style.display = "block";
    else noteCont.style.display = "none";
  });
}

// ayr yha pe notes ke drag and rrop ke function ka code h
function dragAndDrops(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
