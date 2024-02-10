'use strict'

var gHints
var gIsHintActive


var gIsMegaHintActive
var gFirstClick
var gSecondClick


function onHintClicked(elHintButton) {
    if (!gGame.isOn || gHints === 0) return

    gIsHintActive = !gIsHintActive
    if (gIsHintActive) {
        elHintButton.style.backgroundColor = 'gray'
    } else {
        elHintButton.style.backgroundColor = ''
    }
}

function hintReveal(elCell, i, j) {
    const previousBoard = cloneBoard(gBoard)
    var elHintButton = document.querySelector('.hint-button')

    revealNeighbors(gBoard, elCell, i, j)
    elHintButton.disabled = true
    gHintTimeout = setTimeout(() => {
        console.log("ONE SECOND HAS PASSED")
        gBoard = previousBoard
        renderBoard(gBoard)
        if (gHints) elHintButton.disabled = false
    }, ONE_SECOND)

    gHints--
    console.log('gHints', gHints)
    gIsHintActive = false

    elHintButton.style.backgroundColor = ''
    startTimer()
}


function onMegaHintClicked(elMegaHintButton) {
    if (!gGame.isOn) return

    gIsMegaHintActive = !gIsMegaHintActive

    console.log(gIsMegaHintActive)
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
        console.log('invalid rectangle!')
        handleMegaHintError() 
        return
    }

    gSecondClick.element.classList.add('mega-hint-cell')
    elMegaHintButton.disabled = true
   

    gMegaHintTimeout = setTimeout(() => {
        console.log("TWO SECONDS HAVE PASSED")
        gBoard = previousBoard
        renderBoard(gBoard)
    }, TWO_SECONDS)

    gIsMegaHintActive = false
    elMegaHintButton.style.backgroundColor = ''
    startTimer()
}

function handleMegaHintError() {
    console.log('ERROR')
    gSecondClick.element.classList.add('mega-hint-error')
    gHintErrorTimeout = setTimeout(() => {
        gSecondClick.element.classList.remove('mega-hint-error')
        gSecondClick = null
    }, 500)
    console.log('gSecondClick', gSecondClick)
}


function isInvalidRectangle(cell1, cell2) {
    return (
        (cell1.i === cell2.i && cell1.j === cell2.j) || 
        (cell1.i === cell2.j && cell1.j === cell2.i) 
        
    )
}
