/**
 * Simple pathfinder that generates candidate multi-hop routes from a token list.
 * This is a lightweight implementation: it enumerates routes up to maxHops by
 * combining tokens. For production you'd want to build a token graph based on
 * existing pairs on each DEX and run Dijkstra/A* with a cost function.
 */

export function generateCandidateRoutes(tokens: string[], maxHops = 3) {
  const routes: string[][] = []
  // single-hop
  for (let i = 0; i < tokens.length; i++) {
    for (let j = 0; j < tokens.length; j++) {
      if (i === j) continue
      routes.push([tokens[i], tokens[j]])
    }
  }

  if (maxHops >= 2) {
    // two-hop routes: A -> X -> B
    for (let a = 0; a < tokens.length; a++) {
      for (let b = 0; b < tokens.length; b++) {
        if (a === b) continue
        for (let c = 0; c < tokens.length; c++) {
          if (c === a || c === b) continue
          routes.push([tokens[a], tokens[c], tokens[b]])
        }
      }
    }
  }

  if (maxHops >= 3) {
    // three-hop routes: A -> X -> Y -> B (limited due to combinatorial explosion)
    for (let a = 0; a < tokens.length; a++) {
      for (let b = 0; b < tokens.length; b++) {
        if (a === b) continue
        for (let c = 0; c < tokens.length; c++) {
          if (c === a || c === b) continue
          for (let d = 0; d < tokens.length; d++) {
            if (d === a || d === b || d === c) continue
            routes.push([tokens[a], tokens[c], tokens[d], tokens[b]])
          }
        }
      }
    }
  }

  return routes
}

export default generateCandidateRoutes
