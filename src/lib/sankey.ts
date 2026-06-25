export type SankeyRect = { x: number; y: number; w: number; h: number }
export type SankeyRibbon = { side: 'left' | 'right'; index: number; path: string }
export type SankeyLayout = {
  width: number
  height: number
  left: SankeyRect[]
  right: SankeyRect[]
  center: SankeyRect
  ribbons: SankeyRibbon[]
}

const WIDTH = 560
const NODE_W = 14
const CENTER_W = 18
const NODE_H = 44
const GAP = 16
const PAD_Y = 12
const LEFT_X = 20
const CENTER_X = 271
const RIGHT_X = WIDTH - LEFT_X - NODE_W // 526

function stack(count: number, height: number): SankeyRect[] {
  if (count === 0) return []
  const blockH = count * NODE_H + (count - 1) * GAP
  const top = (height - blockH) / 2
  return Array.from({ length: count }, (_, i) => ({
    x: 0, y: top + i * (NODE_H + GAP), w: NODE_W, h: NODE_H,
  }))
}

// A filled cubic-bezier ribbon from a vertical segment at x0 (y0t..y0b) to a
// vertical segment at x1 (y1t..y1b). Control points sit halfway between.
function ribbon(x0: number, y0t: number, y0b: number, x1: number, y1t: number, y1b: number): string {
  const mx = (x0 + x1) / 2
  return [
    `M${x0} ${y0t}`,
    `C${mx} ${y0t}, ${mx} ${y1t}, ${x1} ${y1t}`,
    `L${x1} ${y1b}`,
    `C${mx} ${y1b}, ${mx} ${y0b}, ${x0} ${y0b}`,
    'Z',
  ].join(' ')
}

// Pure geometry for the unweighted product Sankey. Side nodes are equal-height
// rects stacked and vertically centered; the center node spans the full height.
export function sankeyLayout(leftCount: number, rightCount: number): SankeyLayout {
  const rows = Math.max(leftCount, rightCount, 1)
  const height = rows * NODE_H + (rows - 1) * GAP + PAD_Y * 2

  const left = stack(leftCount, height).map(r => ({ ...r, x: LEFT_X }))
  const right = stack(rightCount, height).map(r => ({ ...r, x: RIGHT_X }))
  const center: SankeyRect = { x: CENTER_X, y: PAD_Y, w: CENTER_W, h: height - PAD_Y * 2 }

  const ribbons: SankeyRibbon[] = []
  const half = NODE_H / 2
  const cInLeft = center.x
  const cOutRight = center.x + center.w

  left.forEach((n, i) => {
    const cy = center.y + (center.h * (i + 0.5)) / Math.max(leftCount, 1)
    ribbons.push({
      side: 'left', index: i,
      path: ribbon(n.x + n.w, n.y, n.y + n.h, cInLeft, cy - half, cy + half),
    })
  })
  right.forEach((n, i) => {
    const cy = center.y + (center.h * (i + 0.5)) / Math.max(rightCount, 1)
    ribbons.push({
      side: 'right', index: i,
      path: ribbon(cOutRight, cy - half, cy + half, n.x, n.y, n.y + n.h),
    })
  })

  return { width: WIDTH, height, left, right, center, ribbons }
}
