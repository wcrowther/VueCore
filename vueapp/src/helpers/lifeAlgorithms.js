// Pluggable algorithm signature: (current, next, rows, cols, wrapEdges, rule) => void


export function conwaysRule(alive, neighbors) 
{
    return neighbors === 3 || (alive && neighbors === 2)
}

// B36/S23
export function highLifeRule(alive, neighbors) 
{
    return neighbors === 3 || neighbors === 6 || (alive && neighbors === 2)
}

// B1357/S1357
export function replicatorRule(alive, neighbors) 
{
    return neighbors === 1 || neighbors === 3 || neighbors === 5 || neighbors === 7
}

// B2/S
export function seedsRule(alive, neighbors) 
{
    return !alive && neighbors === 2
}

// B368/S245
export function morleyRule(alive, neighbors) 
{
    return neighbors === 3 || neighbors === 6 || neighbors === 8 || (alive && (neighbors === 2 || neighbors === 4 || neighbors === 5))
}

// B3678/S34678
export function dayAndNightRule(alive, neighbors) 
{
    return neighbors === 3 || neighbors === 6 || neighbors === 7 || neighbors === 8
        || (alive && (neighbors === 4 || neighbors === 5))
}

// B3/S12345
export function mazeRule(alive, neighbors) 
{
    return neighbors === 3 || (alive && neighbors >= 1 && neighbors <= 5)
}

// B35678/S5678
export function diamoebaRule(alive, neighbors) 
{
    return neighbors === 3 || neighbors >= 5 || (alive && neighbors >= 5)
}

// B357/S1358
export function amoebaRule(alive, neighbors) 
{
    return neighbors === 3 || neighbors === 5 || neighbors === 7
        || (alive && (neighbors === 1 || neighbors === 3 || neighbors === 5 || neighbors === 8))
}

// B3678/S235678
export function stainsRule(alive, neighbors) 
{
    return neighbors === 3 || neighbors === 6 || neighbors === 7 || neighbors === 8
        || (alive && (neighbors === 2 || neighbors === 3 || neighbors === 5 || neighbors === 6 || neighbors === 7 || neighbors === 8))
}

export function runAlgorithm(current, next, rows, cols, wrapEdges, rule) 
{
    for (let r = 0; r < rows; r++) 
    {
        for (let c = 0; c < cols; c++)
        {
            let n = 0
            for (let dr = -1; dr <= 1; dr++) 
            {
                for (let dc = -1; dc <= 1; dc++)
                {
                    if (dr === 0 && dc === 0) continue
                    let nr, nc
                    if (wrapEdges) 
                    {
                        nr = (r + dr + rows) % rows
                        nc = (c + dc + cols) % cols
                    } else {
                        nr = r + dr
                        nc = c + dc
                        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols)
                            continue
                    }
                    n += current[nr * cols + nc]
                }
            }
            const idx = r * cols + c
            next[idx] = rule(current[idx], n) ? 1 : 0
        }
    }
}

// export function conwayAlgorithm(current, next, rows, cols, wrapEdges) 
// {
//     for (let r = 0; r < rows; r++) 
//     {
//         for (let c = 0; c < cols; c++) 
//         {
//             let n = 0
//             for (let dr = -1; dr <= 1; dr++) 
//             {
//                 for (let dc = -1; dc <= 1; dc++) 
//                 {
//                     if (dr === 0 && dc === 0) continue
//                     let nr, nc
//                     if (wrapEdges) 
//                     {
//                         nr = (r + dr + rows) % rows
//                         nc = (c + dc + cols) % cols
//                     } else {
//                         nr = r + dr
//                         nc = c + dc
//                         if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
//                     }
//                     n += current[nr * cols + nc]
//                 }
//             }
//             const idx = r * cols + c
//             next[idx] = n === 3 || (n === 2 && current[idx]) ? 1 : 0
//         }
//     }
// }
