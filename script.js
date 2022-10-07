// PubSub Principle
let mediator = {
    events: {

    },

    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },

    off: function (eventName, fn) {
        if ( this.events[eventName] ) {
            for ( let i = 0; i < this.events[eventName].length; i++ ) {
                if ( this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break; 
                }
            }
        }
    },

    emit: function(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach((fn) => {
                fn(data);
            })
        }
    }

};


let board = (function() {

    let boardContainer = document.querySelector(".board");
    let boardRows;
    let size = 16;
    let boardWidth = 320;
    let mode = "black";

    // Init board
    initBoard();

    // Bind event
    mediator.on("modeChange", changeMode);
    mediator.on("clearBoard", resetBoard);
    mediator.on("sizeChange", changeSize);

    function resetBoard() {    
        removeBoard();
        initBoard();
    }

    function removeBoard() {
        for ( let row of Array.from(boardRows)) {
            row.remove();
        }
    }

    function changeSize(sizeValue) {
        size = sizeValue;
    }

    function changeMode(modeName) {
        mode = modeName;
    }

    function hoverCell(event) {
        if ( mode == "black") {
            event.target.style.backgroundColor = "black";
        } else {
            let randomColor = Math.floor(Math.random()*16777215).toString(16);
            event.target.style.backgroundColor = "#" + randomColor;
        }
    }
    
    function initBoard() {
    
        let cellWidth = boardWidth / size; 
    
        for ( let i = 0; i < size; i++ ) {
        
            let row = document.createElement("div");
            row.classList.add("board__row");
        
            for ( let j = 0; j < size; j++ ) {
                let column = document.createElement("div");
                column.classList.add("board__row__column");
    
                column.style.width = cellWidth + "px";
                column.style.height = cellWidth - 2 + "px";
        
                column.addEventListener("mouseover", hoverCell);
        
                row.appendChild(column);
            } 
        
            boardContainer.appendChild(row);
        }

        boardRows = boardContainer.querySelectorAll(".board__row");
    }
})();


let options = (function() {
    let clearButton = document.querySelector(".buttons__clear");
    let choice = document.querySelector(".buttons__options");
    let inputSize;
    
    clearButton.addEventListener('click', changeBoard)
    
    choice.addEventListener("change", changeMode)

    function changeMode(event) {
        mediator.emit("modeChange", event.target.value);
    }
    
    function changeBoard(event) {

        do {
            inputSize = Number(prompt("Create board with size:", "16"));
            if ( inputSize > 100 ) {
                alert("Board size cannot be greater than 100.");
            }
            if ( isNaN(inputSize) ) {
                alert("Invalid board size.");
            }
        } while (isNaN(inputSize) || inputSize > 100);

        mediator.emit("sizeChange", inputSize);
        mediator.emit("clearBoard");
    }
})();









