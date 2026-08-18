export const lifePatterns =
{
    'Glider':
    [
        [0, 1],
        [1, 2],
        [2, 0], [2, 1], [2, 2],
    ],
    'Lightweight Spaceship':
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
}

export function getPatternCells(name, row, col, rows, cols, wrapEdges)
{
    const pattern = lifePatterns[name]
    if (!pattern) return []

    return pattern.flatMap(([rowOffset, colOffset]) =>
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

export function addPattern(current, name, row, col, rows, cols, wrapEdges)
{
    const cells = getPatternCells(name, row, col, rows, cols, wrapEdges)

    cells.forEach(([targetRow, targetCol]) =>
    {
        current[targetRow * cols + targetCol] = 1
    })

    return cells
}
