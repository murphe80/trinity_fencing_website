import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { validatePoule, weaponLabel } from './tournament'

export async function poulePdf(value: unknown) {
  const poule = validatePoule(value)
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  const font = await doc.embedFont(
    await readFile(
      path.join(process.cwd(), 'public/fonts/NotoSans-Regular.ttf'),
    ),
    { subset: true },
  )
  const ink = rgb(0.12, 0.12, 0.12),
    red = rgb(0.68, 0.13, 0.18)
  const width = 842,
    height = 595,
    margin = 36,
    usable = width - margin * 2
  let page = doc.addPage([width, height]),
    y = height - margin
  const text = (
    value: string,
    x: number,
    top: number,
    size = 10,
    color = ink,
  ) => page.drawText(value, { x, y: top - size, size, font, color })
  function header() {
    text('DUFC | Poule results', margin, height - margin, 19, red)
    text(
      poule.date + ' | ' + weaponLabel[poule.weapon],
      margin,
      height - margin - 28,
    )
    y = height - margin - 56
  }
  function nextPage() {
    page = doc.addPage([width, height])
    header()
  }
  function wrap(value: string, maxWidth: number, size: number) {
    const lines: string[] = []
    let line = ''
    for (const char of value.replace(/\s+/g, ' ')) {
      if (line && font.widthOfTextAtSize(line + char, size) > maxWidth) {
        lines.push(line)
        line = ''
      }
      line += char
    }
    if (line) lines.push(line)
    return lines
  }
  header()
  text('Bouts', margin, y, 15, red)
  y -= 28
  const columnWidth = (usable - 24) / 2
  for (let i = 0; i < poule.bouts.length; i += 2) {
    const pair = poule.bouts.slice(i, i + 2).map((bout, offset) => ({
      lines: wrap(
        i +
          offset +
          1 +
          '. ' +
          poule.fencers[bout.a] +
          ' vs ' +
          poule.fencers[bout.b],
        columnWidth - 55,
        10,
      ),
      score: bout.scoreA + ' - ' + bout.scoreB,
    }))
    const rowHeight = Math.max(...pair.map((b) => b.lines.length)) * 14 + 12
    if (y - rowHeight < margin + 20) {
      nextPage()
      text('Bouts (continued)', margin, y, 15, red)
      y -= 28
    }
    pair.forEach((bout, column) => {
      const x = margin + column * (columnWidth + 24)
      bout.lines.forEach((line, index) => text(line, x, y - index * 14))
      text(bout.score, x + columnWidth - 42, y)
    })
    y -= rowHeight
  }
  const nameWidth = 205,
    cellWidth = (usable - nameWidth) / poule.fencers.length
  const names = poule.fencers.map((name, index) =>
    wrap(index + 1 + '. ' + name, nameWidth - 12, 9),
  )
  const heights = names.map((lines) => Math.max(19, lines.length * 12 + 6))
  y -= 18
  if (y - (heights.reduce((a, b) => a + b, 0) + 55) < margin + 20) nextPage()
  function gridHeader(continued = false) {
    text('Poule grid' + (continued ? ' (continued)' : ''), margin, y, 15, red)
    y -= 28
    cell(margin, nameWidth, 25, ['Fencer'], true)
    poule.fencers.forEach((_, index) =>
      cell(
        margin + nameWidth + index * cellWidth,
        cellWidth,
        25,
        [String(index + 1)],
        true,
      ),
    )
    y -= 25
  }
  function cell(
    x: number,
    w: number,
    h: number,
    lines: string[],
    shaded = false,
  ) {
    page.drawRectangle({
      x,
      y: y - h,
      width: w,
      height: h,
      borderWidth: 0.5,
      borderColor: rgb(0.6, 0.6, 0.6),
      color: shaded ? rgb(0.93, 0.93, 0.93) : rgb(1, 1, 1),
    })
    lines.forEach((line, index) => text(line, x + 5, y - 6 - index * 12, 9))
  }
  gridHeader()
  poule.fencers.forEach((_, index) => {
    const h = heights[index]
    if (y - h < margin + 20) {
      nextPage()
      gridHeader(true)
    }
    cell(margin, nameWidth, h, names[index])
    poule.fencers.forEach((_, opponent) => {
      const bout = poule.bouts.find(
        (b) =>
          (b.a === index && b.b === opponent) ||
          (b.b === index && b.a === opponent),
      )
      const score =
        index === opponent
          ? '×'
          : String(bout?.a === index ? bout.scoreA : bout?.scoreB)
      cell(
        margin + nameWidth + opponent * cellWidth,
        cellWidth,
        h,
        [score],
        index === opponent,
      )
    })
    y -= h
  })
  const pages = doc.getPages()
  pages.forEach((p, index) =>
    p.drawText(index + 1 + ' / ' + pages.length, {
      x: width - margin - 35,
      y: 20,
      size: 8,
      font,
      color: ink,
    }),
  )
  return Buffer.from(await doc.save())
}
