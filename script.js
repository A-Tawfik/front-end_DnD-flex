
var boxes
var currencies
var dragEl

fetch('http://api.fixer.io/latest')
.then(function(response){
  response.json().then(function(data){
    data.rates[data.base] = 1;
    currencies = Object.keys(data.rates);
    makeBoxes(data)
  });
})


function makeBoxes(data) {
  container = document.getElementsByClassName('container')[0]
  boxes = currencies.map(function(currency, index) {
    var newEl = document.createElement("div")
    var elementText = document.createTextNode(currency + ": " + data.rates[currency])

    newEl.appendChild(elementText)

    newEl.classList.add("box")


    newEl.setAttribute("draggable", "true")

    newEl.addEventListener('dragstart', handleDragStart, false);
    newEl.addEventListener('dragover', handleDragOver, false);
    newEl.addEventListener('dragend', handleDragEnd, false);

    container.appendChild(newEl)

    if (currency === data.base) {
      newEl.classList.add('base')
      newEl.style.order = 0
    }
    else {
      newEl.style.order = index + 1
    }

    return newEl
  })
}




function handleDragStart(e) {
  dragEl = e.target
  dragEl.style.opacity = '.6';
  var currentOrder = window.getComputedStyle(e.target).order
  // debugger;
    console.log("start:" + currentOrder)
}

function handleDragEnd(e) {
  dragEl.style.opacity = "1";
}

function handleDragOver(e) {
  overOrder = window.getComputedStyle(e.target).order
  draggingOrder = window.getComputedStyle(dragEl).order
  if (dragEl == e.target){return false;}

  if (overOrder > draggingOrder){
    e.target.style.order -= 1
  }
  else if (overOrder <= draggingOrder) {

    e.target.style.order = parseInt(overOrder) + 1
  }

  dragEl.style.order = overOrder;


  console.log("drag over: " + overOrder )
  console.log("drag el: " + draggingOrder)
}
