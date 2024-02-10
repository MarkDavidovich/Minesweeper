'use strict'
console.log("<------ WORK IN PRfOGRESS! ------>\n resetHighScores(4/8/12) to reset high scores of level.")

const MINE = '💣'
const FLAG = '🚩'
const ONE_SECOND = 1000
const TWO_SECONDS = 2000

var gBoard = []
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 0
}
var gMinesMarked
var gTimerInterval
var gSafeClicks

var gHintTimeout
var gMegaHintTimeout
var gHintErrorTimeout

function onInit() {
    //lives 
    var elWinEmoji = document.querySelector(".reset-button")
    var elLives = document.querySelector(".lives span")

    elWinEmoji.innerHTML = '😀'
    elLives.innerHTML = '<img src="assets/fullheart.png">' 
    gGame.lives = 3


    //timer
    clearInterval(gTimerInterval)
    gTimerInterval = null
    gGame.secsPassed = -1
    updateTimer()

    //hints
    var elHintButton = document.querySelector('.hint-button')
    var elMegaHintButton = document.querySelector('.mega-hint-button')

    gHints = 3
    gIsHintActive = false
    elHintButton.disabled = false
    elHintButton.style.backgroundColor = ''
    clearTimeout(gHintTimeout)

    gIsMegaHintActive = false
    elMegaHintButton.style.backgroundColor = ''
    elMegaHintButton.disabled = false
    clearTimeout(gMegaHintTimeout)
    clearTimeout(gHintErrorTimeout)

    gFirstClick = null
    gSecondClick = null

    //safe clicks
    const elSafeButton = document.querySelector('.safe-click')
    elSafeButton.disabled = false
    gSafeClicks = 3

    //scores
    displayHighScores(gLevel.size)

    //undo
    gIsUndoAvailable = false
    var elUndoButton = document.querySelector('.undo-button')
    elUndoButton.disabled = true
    gBoards = []

    //exterminator
    var elExtButton = document.querySelector('.exterminator')
    elExtButton.disabled = false

    //board init
    gMinesMarked = 0
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {

    const size = gLevel.size
    const board = []

    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell

            // if (i === 1 && j === 2 || i === 3 && j === 3) { // hardcoded mines
            //     board[i][j].isMine = true
            // } 

        }
    }

    var minesPlaced = 0
    while (minesPlaced < gLevel.mines) {
        const randRow = getRandomIntInclusive(0, size - 1)
        const randCol = getRandomIntInclusive(0, size - 1)

        if (!board[randRow][randCol].isMine) {
            board[randRow][randCol].isMine = true
            minesPlaced++
        }
    }

    setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (let i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < gLevel.size; j++) {
            const currCell = board[i][j]
            const minesAroundCell = board[i][j].minesAroundCount
            // if (currCell.isShown) {
            //     strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellRightClicked(event, this, ${i}, ${j})"></td>`
            // }
            if (currCell.isMine && currCell.isShown) {
                strHTML += `<td class="explosion" style="outline-style: inset">${MINE}</td>`
            }
            else if (currCell.isShown) {
                strHTML += `<td style="outline-style: inset">${minesAroundCell ? minesAroundCell : ''}</td>`
            }
            else if (currCell.isMine) {
                strHTML += `<td class="mine" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellRightClicked(event, this, ${i}, ${j})"></td>`
            } else {
                strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellRightClicked(event, this, ${i}, ${j})"</td>`
            }
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('tbody.minefield')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return

    var cellClicked = gBoard[i][j]

    if (cellClicked.isMarked || cellClicked.isShown) return

    if (gIsHintActive) {
        hintReveal(elCell, i, j)
        return
    }

    if (gIsMegaHintActive) {
        if (!gFirstClick) {
            gFirstClick = {
                element: elCell,
                i: i,
                j: j
            }
            console.log('gFirstClick', gFirstClick)
            gFirstClick.element.classList.add('mega-hint-cell')
        } else {
            gSecondClick = {
                element: elCell,
                i: i,
                j: j
            }

            if (isInvalidRectangle(gFirstClick, gSecondClick)) {
                handleMegaHintError()
                return
            }
        }

        if (gFirstClick && gSecondClick) {
            megaHintReveal()
        }
        return
    }

    elCell.style.outlineStyle = 'inset'

    if (gGame.shownCount === 0) {
        startTimer()

        while (cellClicked.isMine) { //makes sure the first cell clicked is not a mine
            console.log('FIRST CELL WAS A MINE!')
            gBoard = buildBoard()
            cellClicked = gBoard[i][j]
        }
    }
    //undo logic
    gIsUndoAvailable = true
    var elUndoButton = document.querySelector('.undo-button')
    elUndoButton.disabled = false
    var clonedBoard = cloneBoard(gBoard)
    addBoards(clonedBoard, gGame.lives)

    if (cellClicked.isMine === true) {
        clickedOnMine(elCell, cellClicked)
    } else {
        clickedOnSafe(elCell, cellClicked, i, j)
    }

    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines) checkGameOver(1)
    if (gMinesMarked === gLevel.mines) checkGameOver(1)
}

function onCellRightClicked(event, elCell, i, j) {

    event.preventDefault() // prevent context menu

    if (!gGame.isOn) return

    var cellClicked = gBoard[i][j]

    if (cellClicked.isShown) return

    cellClicked.isMarked = !cellClicked.isMarked

    elCell.innerHTML = cellClicked.isMarked ? FLAG : ''

    if (cellClicked.isMarked) {
        gGame.markedCount++

        if (cellClicked.isMine) {
            gMinesMarked++
        }
    } else {
        if (cellClicked.isMine) gMinesMarked--
        gGame.markedCount--
    }

    if (gGame.markedCount === gMinesMarked && gMinesMarked === gLevel.mines) checkGameOver(1)
}

function checkGameOver(hasWon) {
    gGame.isOn = false
    var message = ''
    clearInterval(gTimerInterval)



    if (hasWon) {
        var elWinEmoji = document.querySelector(".reset-button")
        elWinEmoji.innerHTML = '😎'
        message = "You won!"
        console.log(gGame.shownCount, gGame.secsPassed)
        updateHighScores(gLevel.size, gGame.shownCount, gGame.secsPassed)
    } else {
        var elWinEmoji = document.querySelector(".reset-button")
        elWinEmoji.innerHTML = '😵'
        message = "Boom! you lose..."
        showAllMines()
    }
    const elHintButton = document.querySelector('.hint-button')
    const elSafeButton = document.querySelector('.safe-click')
    const elMegaHintButton = document.querySelector('.mega-hint-button')
    const elUndoButton = document.querySelector('.undo-button')

    elHintButton.disabled = true
    elSafeButton.disabled = true
    elMegaHintButton.disabled = true
    elUndoButton.disabled = true

}

function onSetLevel(level, mines) {
    gLevel.size = level
    gLevel.mines = mines
    onInit()
}

function showAllMines() {
    const elMineCells = document.querySelectorAll('.mine')

    for (let i = 0; i < elMineCells.length; i++) {
        const elMineCell = elMineCells[i]
        elMineCell.innerHTML = MINE
        elMineCell.style.outlineStyle = 'inset'
    }
}

function setMinesNegsCount(board) {
    const size = gLevel.size;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNeighborsMines(board, i, j)
            }
        }
    }
}

function countNeighborsMines(board, row, col) {
    const size = gLevel.size
    var minesCount = 0

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < size && j >= 0 && j < size && board[i][j].isMine) {
                minesCount++
            }
        }
    }

    return minesCount
}

function updateTimer() {
    gGame.secsPassed++
    document.querySelector('.timer span').innerText = gGame.secsPassed
}

function revealNeighbors(board, elCell, cellI, cellJ) {
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (!gIsHintActive && i === cellI && j === cellJ) continue // if hint click, will check clicked cell too
            if (j < 0 || j >= board[i].length) continue

            const currCell = board[i][j]
            const currElement = document.querySelector(`.minefield tr:nth-child(${i + 1}) td:nth-child(${j + 1})`)

            if (!currCell.isShown && !currCell.isMarked) {
                currElement.style.outlineStyle = 'inset'
                currCell.isShown = true
                if (!gIsHintActive) gGame.shownCount++ // if hint click, will not increment showncount

                if (!gIsHintActive && currCell.minesAroundCount === 0 && !currCell.isMine) { // if hint click, will not activate recursion
                    revealNeighbors(board, currElement, i, j)
                }
                currElement.innerHTML = currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ''
                if (gIsHintActive && currCell.isMine) currElement.innerHTML = MINE // if hint click, will reveal mines
            }
        }
    }
}

function updateLives(diff = 0) {
    gGame.lives += diff
    var elLives = document.querySelector('.lives span')
    if (gGame.lives === 3) elLives.innerHTML = '<img src="assets/fullheart.png">' 
    if (gGame.lives === 2) elLives.innerHTML = '<img src="assets/twothirdsheart.png">' 
    else if (gGame.lives === 1) elLives.innerHTML = '<img src="assets/onethirdsheart.png">' 
    else if (gGame.lives === 0) {
        elLives.innerHTML = '<img src="assets/emptyheart.png">' 
        checkGameOver(0)
    }

}

function startTimer() {
    if (!gTimerInterval) {
        gTimerInterval = setInterval(updateTimer, ONE_SECOND)
        console.log("TIMER STARTED!")
    }
}

function clickedOnMine(elCell, cellClicked) {
    elCell.classList.add('explosion')
    elCell.innerHTML = MINE
    cellClicked.isShown = true
    updateLives(-1)
    gMinesMarked++

}

function clickedOnSafe(elCell, cellClicked, i, j) {
    cellClicked.isShown = true
    gGame.shownCount++
    elCell.innerHTML = cellClicked.minesAroundCount > 0 ? cellClicked.minesAroundCount : ''
    console.log('gGame.shownCount', gGame.shownCount)

    if (cellClicked.minesAroundCount === 0) {
        revealNeighbors(gBoard, elCell, i, j, true);
    }
}

function onSafeModeClicked() {
    if (!gGame.isOn) return
    const emptyCells = getEmptyCells(gBoard)
    const randIdx = getRandomIntInclusive(0, emptyCells.length - 1)
    const randomSafeCell = emptyCells[randIdx]
    const elCell = document.querySelector(`.minefield tr:nth-child(${randomSafeCell.i + 1}) td:nth-child(${randomSafeCell.j + 1})`)
    const elSafeButton = document.querySelector(`.safe-click`)
    //Show the safe cell for a few seconds
    elCell.classList.add("safe-cell")
    console.log('elCell', elCell)
    console.log("randomSafeCell:", randomSafeCell)
    elSafeButton.disabled = true

    setTimeout(() => {
        elCell.classList.remove("safe-cell")
        gSafeClicks--
        if (gSafeClicks) elSafeButton.disabled = false
    }, 2000)

    startTimer()
    return
}

function cloneBoard(board) {
    const size = board.length
    const clonedBoard = []

    for (let i = 0; i < size; i++) {
        const row = []
        for (let j = 0; j < board[i].length; j++) {
            const cell = {
                minesAroundCount: board[i][j].minesAroundCount,
                isShown: board[i][j].isShown,
                isMine: board[i][j].isMine,
                isMarked: board[i][j].isMarked
            }
            row.push(cell)
        }
        clonedBoard.push(row)
    }

    return clonedBoard
}

function getEmptyCells(board) {
    var emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]

            if (!cell.isMine && !cell.isShown) {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells
}

function getMineCells(board) {
    var mineCells = []

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            var cell = board[i][j]

            if (cell.isMine) {
                mineCells.push({ i, j })
            }
        }
    }
    return mineCells
}
