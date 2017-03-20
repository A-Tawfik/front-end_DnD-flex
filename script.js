var boxes
var currencies
var dragEl

fetchDefaultData();

function fetchDefaultData() {
  fetch('https://api.fixer.io/latest')
  .then(function(response){
    response.json().then((data)=>{
      data.rates[data.base] = 1;
      currencies = Object.keys(data.rates);
      makeBoxes(data);
      updateContainer();
    });
  });
}

function updateData(base) {
  fetch(`https://api.fixer.io/latest?base=${base}&symbols=${currencies.join()}`)
  .then(function(response){
    response.json().then((data)=>{
      data.rates[data.base] = 1;
      currencies = Object.keys(data.rates);
      makeBoxes(data);
      updateContainer();
    });
  });
}

function makeBoxes(data) {
    boxes = currencies.map((currency, index)=> {
    let newEl = document.createElement("div");
    let header = document.createElement("div")
    let content = document.createElement("span")
    let closeBtn = document.createElement("span")

    closeBtn.classList.add("close")
    closeBtn.appendChild(document.createTextNode("X"))
    closeBtn.addEventListener('click', handleClose);
    header.appendChild(document.createTextNode(currency));
    header.appendChild(closeBtn);
    content.appendChild(document.createTextNode(data.rates[currency]))
    header.classList.add("header");
    content.classList.add("rate");

    newEl.appendChild(header);
    newEl.appendChild(content);
    newEl.classList.add("box");
    newEl.setAttribute("data-currency", currency);
    newEl.setAttribute("data-rate", data.rates[currency])
    newEl.setAttribute("draggable", "true");
    newEl.addEventListener('dragstart', handleDragStart, false);
    newEl.addEventListener('dragenter', handleDragEnter, false);
    newEl.addEventListener('dragleave', handleDragLeave, false);
    newEl.addEventListener('dragover', handleDragOver, false);
    newEl.addEventListener('dragend', handleDragEnd, false);

    if (currency === data.base) {
      newEl.classList.add('base')
      newEl.style.order = 0
    }
    else {
      newEl.style.order = index + 1
    }

    return newEl
  })
  return boxes
}

function updateContainer() {
  let container = document.getElementsByClassName('container')[0]
  container.innerHTML = '';
  for (var i = 0; i < boxes.length; i++) {
    container.appendChild(boxes[i])
  }
}

function handleSortClick(e){
  boxes.sort((a,b)=>{
    if (a.getAttribute(e.target.name) -  b.getAttribute(e.target.name)) {
      return a.getAttribute(e.target.name) - b.getAttribute(e.target.name)
    }
    else {
      let codeA = a.getAttribute(e.target.name)
      let codeB = b.getAttribute(e.target.name)
      if (codeA < codeB) {return -1}
      if (codeA > codeB) {return 1}
      return 0
    }
  })

  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].classList.contains("base")) {
      boxes[i].style.order = 0
    }
    else {
      boxes[i].style.order = i+1
    }
  }
}

function handleDragStart(e) {
  dragEl = e.target
  dragEl.style.opacity = '.6';
  let currentOrder = window.getComputedStyle(e.target).order
    console.log("start:" + currentOrder)
}

function handleDragEnd(e) {
  dragEl.style.opacity = "1";
  if (dragEl.style.order == 0) {
    updateData(e.target.getAttribute("data-currency"))
  }
}

function handleDragOver(e) {
  e.preventDefault();
  overOrder = window.getComputedStyle(e.target).order
  draggingOrder = window.getComputedStyle(dragEl).order

  if (!e.target.classList.contains("box")) {return false;}
  if (dragEl == e.target){return false;}
  if (overOrder > draggingOrder){
    boxes.map((box)=>{
      if (box.style.order >= draggingOrder && box.style.order <= overOrder ) {
        box.style.order = parseInt(box.style.order) - 1
      }
    });
  }
  else if (overOrder <= draggingOrder) {
    boxes.map((box)=>{
      if (box.style.order <= draggingOrder && box.style.order >= overOrder ) {
        box.style.order = parseInt(box.style.order) + 1
      }
    });
  }
  dragEl.style.order = overOrder;
}

function handleDragEnter(e){
  if (e.target.style.order === "0") {
    e.target.classList.remove("base")
  }
  if (dragEl.style.order === "0") {
    dragEl.classList.add("base")
  } else {
    dragEl.classList.remove("base")
  }
}

function handleDragLeave(e){
  if (e.target.style.order == "0") {
    e.target.classList.add("base")
  }
  if (dragEl.style.order === "0") {
    dragEl.classList.add("base")
  } else {
    dragEl.classList.remove("base")
  }
}

function handleClose(e) {
  let parentBox = e.target.closest('.box')
  let code = parentBox.getAttribute("data-currency")
  parentBox.remove()
  currencies.splice(currencies.indexOf(code), 1)
}
