export const lifePatterns =
{
    'Glider':
    [
        [0, 1],
        [1, 2],
        [2, 0], [2, 1], [2, 2],
    ],
    'Present':
    [
        [0, 1], [0, 2],
        [1, 0], [1, 3],
        [2, 0], [2, 3],
        [3, 0], [3, 1], [3, 2], [3, 3],
    ],
    'R-pentomino':
    [
        [0, 1], [0, 2],
        [1, 0], [1, 1],
        [2, 1],
    ],
    'Gosper Glider Gun':
    [
        [0, 24],
        [1, 22], [1, 24],
        [2, 12], [2, 13], [2, 20], [2, 21], [2, 34], [2, 35],
        [3, 11], [3, 15], [3, 20], [3, 21], [3, 34], [3, 35],
        [4, 0], [4, 1], [4, 10], [4, 16], [4, 20], [4, 21],
        [5, 0], [5, 1], [5, 10], [5, 14], [5, 16], [5, 17], [5, 22], [5, 24],
        [6, 10], [6, 16], [6, 24],
        [7, 11], [7, 15],
        [8, 12], [8, 13],
    ],
    'Light Weight Spaceship (LWSS)':
    [
        [0, 0], [0, 3],
        [1, 4],
        [2, 0], [2, 4],
        [3, 1], [3, 2], [3, 3], [3, 4],
    ],
    'Beacon':
    [
        [0, 0], [0, 1],
        [1, 0], [1, 1],
        [2, 2], [2, 3],
        [3, 2], [3, 3],
    ],
    'Toad':
    [
        [0, 1], [0, 2], [0, 3],
        [1, 0], [1, 1], [1, 2],
    ],
    'Pulsar':
    [
        [0, 2], [0, 3], [0, 4], [0, 8], [0, 9], [0, 10],
        [2, 0], [2, 5], [2, 7], [2, 12],
        [3, 0], [3, 5], [3, 7], [3, 12],
        [4, 0], [4, 5], [4, 7], [4, 12],
        [5, 2], [5, 3], [5, 4], [5, 8], [5, 9], [5, 10],
        [7, 2], [7, 3], [7, 4], [7, 8], [7, 9], [7, 10],
        [8, 0], [8, 5], [8, 7], [8, 12],
        [9, 0], [9, 5], [9, 7], [9, 12],
        [10, 0], [10, 5], [10, 7], [10, 12],
        [12, 2], [12, 3], [12, 4], [12, 8], [12, 9], [12, 10],
    ],
    'Pentadecathlon':
    [
        [0, 2], [0, 7],
        [1, 0], [1, 1], [1, 3], [1, 4], [1, 5], [1, 6], [1, 8], [1, 9],
        [2, 2], [2, 7],
    ],
    'Diehard':
    [
        [0, 6],
        [1, 0], [1, 1],
        [2, 1], [2, 5], [2, 6], [2, 7],
    ],
    'Acorn':
    [
        [0, 1],
        [1, 3],
        [2, 0], [2, 1], [2, 4], [2, 5], [2, 6],
    ],
}

// Rotates (row, col) offsets clockwise by 90 degrees per quarter turn
function rotateOffsets(pattern, quarterTurns)
{
    const turns = ((quarterTurns % 4) + 4) % 4
    if (turns === 0) return pattern

    return pattern.map(([rowOffset, colOffset]) =>
    {
        let r = rowOffset, c = colOffset
        for (let i = 0; i < turns; i++)
            [r, c] = [c, -r]

        return [r, c]
    })
}

export function getPatternCells(name, row, col, rows, cols, wrapEdges, quarterTurns = 0)
{
    const pattern = lifePatterns[name]
    if (!pattern) return []

    return rotateOffsets(pattern, quarterTurns).flatMap(([rowOffset, colOffset]) =>
    {
        let targetRow = row + rowOffset
        let targetCol = col + colOffset

        if (wrapEdges)
        {
            targetRow = (targetRow + rows) % rows
            targetCol = (targetCol + cols) % cols
        }
        else if (targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= cols)
        {
            return []
        }

        return [[targetRow, targetCol]]
    })
}

export function addPattern(current, name, row, col, rows, cols, wrapEdges, quarterTurns = 0)
{
    const cells = getPatternCells(name, row, col, rows, cols, wrapEdges, quarterTurns)

    cells.forEach(([targetRow, targetCol]) =>
    {
        current[targetRow * cols + targetCol] = 1
    })

    return cells
}
