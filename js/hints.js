'use strict'

var gHints
var gIsHintActive


var gIsMegaHintActive
var gFirstClick
var gSecondClick


function onHintClicked() {
    if (!gGame.isOn || gHints === 0) return

    gIsHintActive = !gIsHintActive

    var elHintImage = document.querySelector('.hint-image')
    if (gIsHintActive) {
        elHintImage.classList.add('hint-glow')
    } else {
        elHintImage.classList.remove('hint-glow')
    }
}

function hintReveal(elCell, i, j) {
    const previousBoard = cloneBoard(gBoard)
    var elHintImage = document.querySelector('.hint-image')
    elHintImage.classList.remove('hint-glow')
    revealNeighbors(gBoard, elCell, i, j)
    elHintImage.disabled = true
    gHintTimeout = setTimeout(() => {
        gBoard = previousBoard
        renderBoard(gBoard)
        if (gHints) elHintImage.disabled = false
    }, ONE_SECOND)

    gHints--
    hintButtonUpdate()

    gIsHintActive = false

    elHintImage.style.backgroundColor = ''
    startTimer()
}


function onMegaHintClicked(elMegaHintButton) {
    if (!gGame.isOn) return

    gIsMegaHintActive = !gIsMegaHintActive

    if (gIsMegaHintActive) {
        elMegaHintButton.style.backgroundColor = 'gray'
    } else {
        elMegaHintButton.style.backgroundColor = ''
    }

    if (!gIsMegaHintActive) {
        if (gFirstClick) {
            gFirstClick.element.classList.remove('mega-hint-cell')
            gFirstClick = null
        }
        if (gSecondClick) {
            gSecondClick.element.classList.remove('mega-hint-cell')
            gSecondClick = null
        }
    }
}

function megaHintReveal() {
    var validFlag = false
    const previousBoard = cloneBoard(gBoard)
    var elMegaHintButton = document.querySelector('.mega-hint-button')

    var startI = gFirstClick.i
    var startJ = gFirstClick.j

    var endI = gSecondClick.i
    var endJ = gSecondClick.j

    for (let i = startI; i <= endI; i++) {
        for (let j = startJ; j <= endJ; j++) {
            const currCell = gBoard[i][j]
            const currElement = document.querySelector(`.minefield tr:nth-child(${i + 1}) td:nth-child(${j + 1})`)
            currElement.style.outlineStyle = 'inset'
            currCell.isShown = true
            
            currElement.innerHTML = currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ''
            if (currCell.isMine) currElement.innerHTML = MINE
            validFlag = true
        }
    }

    if (!validFlag) {
        handleMegaHintError() 
        return
    }

    gSecondClick.element.classList.add('mega-hint-cell')
    elMegaHintButton.disabled = true
   

    gMegaHintTimeout = setTimeout(() => {
        gBoard = previousBoard
        renderBoard(gBoard)
    }, TWO_SECONDS)

    gIsMegaHintActive = false
    elMegaHintButton.style.backgroundColor = ''
    startTimer()
}

function handleMegaHintError() {
    gSecondClick.element.classList.add('mega-hint-error')
    if(!gHintErrorTimeout) clearTimeout(gHintErrorTimeout)
    gHintErrorTimeout = setTimeout(() => {
        gSecondClick.element.classList.remove('mega-hint-error')
        gSecondClick = null
    }, 300)
    

}


function isInvalidRectangle(cell1, cell2) {
    return (
        (cell1.i === cell2.i && cell1.j === cell2.j) || 
        (cell1.i === cell2.j && cell1.j === cell2.i) 
        
    )
}

function hintButtonUpdate() {
    var elHints = document.querySelector('.hint-image')
    if (gHints === 3) elHints.src = 'assets/lightbulb/lightbulbfull.png'
    else if (gHints === 2) elHints.src = 'assets/lightbulb/lightbulbalmostfull.png'
    else if (gHints === 1) elHints.src = 'assets/lightbulb/lightbulbalmostempty.png'
    else if (gHints === 0)  elHints.src = 'assets/lightbulb/lightbulbempty.png' 
}