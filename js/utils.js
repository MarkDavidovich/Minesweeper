'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

// function countNeighbors(mat, rowIdx, colIdx) {
//     var neighbors = 0
//     for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= mat.length) continue
//         for (let j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j >= mat[0].length) continue
//             if (i === rowIdx && j === colIdx) continue
//             const cell = mat[i][j]
//             if (cell.isMine) neighbors++ // adjusted for current project
//         }
//     }
//     return neighbors
// }

function countNeighbors(mat, rowIdx, colIdx) {
    var neighbors = 0
    const numRows = mat.length
    const numCols = mat[0].length

    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= numRows) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= numCols) continue
            if (i === rowIdx && j === colIdx) continue

            const cell = mat[i][j];
            if (cell.isMine) {
                neighbors++
            }
        }
    }

    return neighbors
}