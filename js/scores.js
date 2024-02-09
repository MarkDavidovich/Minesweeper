'use strict'

function getHighScores(level) {
    const storedScores = localStorage.getItem(`highScores_${level}`)
    return storedScores ? JSON.parse(storedScores) : []
}

function updateHighScores(level, score, time) {
    const highScores = getHighScores(level)

    highScores.push({ score, time })
    highScores.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score
        }
        return a.time - b.time
    })

    const topScores = highScores.slice(0, 5)

    localStorage.setItem(`highScores_${level}`, JSON.stringify(topScores))
}

function displayHighScores(level) {
    const highScores = getHighScores(level)
    const elHighScores = document.querySelector('.high-scores')
    elHighScores.innerHTML = ''
    var difficulty = ''


    switch (level) {
        case 4:
            difficulty = 'easy'
            break
        case 8:
            difficulty = 'normal'
            break
        case 12:
            difficulty = 'hard'
            break
    }

    elHighScores.innerHTML = `<h5>High Scores - Difficulty: ${difficulty}</h5>`

    if (highScores.length === 0) {
        elHighScores.innerHTML += '<h6>No high scores yet...</h6>'
    } else {
        for (let i = 0; i < highScores.length; i++) {
            const currIdx = highScores[i]
            elHighScores.innerHTML += `<h6>${i + 1}. Cells shown: ${currIdx.score}, Time: ${currIdx.time} s</h6>`
        }
    }

}

function resetHighScores(level) {
    localStorage.removeItem(`highScores_${level}`)
    console.log(`High Scores for level ${level} have been reset.`)
}