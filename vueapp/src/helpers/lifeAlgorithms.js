// Pluggable algorithm signature: (current, next, rows, cols, wrapEdges) => void

export function conwayAlgorithm(current, next, rows, cols, wrapEdges) 
{
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let n = 0
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue
                    let nr, nc
                    if (wrapEdges) {
                        nr = (r + dr + rows) % rows
                        nc = (c + dc + cols) % cols
                    } else {
                        nr = r + dr
                        nc = c + dc
                        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
                    }
                    n += current[nr * cols + nc]
                }
            }
            const idx = r * cols + c
            next[idx] = n === 3 || (n === 2 && current[idx]) ? 1 : 0
        }
    }
}
