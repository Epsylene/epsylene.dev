import fs from 'fs'
import path from 'path'
import { slugify } from '@/lib/utils'

const inputFile = process.argv[2]
const outputFile = process.argv[3] || 'words.mdx'

if (!inputFile) {
  console.error('❌ Please provide an input file')
  console.log('Usage: npx tsx scripts/transformWords.ts <input-file>')
  process.exit(1)
}

function toCamelCaseCssProp(prop: string): string {
  const vendorPrefixes = [
    { prefix: '-webkit-', replace: 'Webkit' },
    { prefix: '-moz-', replace: 'Moz' },
    { prefix: '-ms-', replace: 'ms' },
    { prefix: '-o-', replace: 'O' },
  ]

  for (const v of vendorPrefixes) {
    if (prop.startsWith(v.prefix)) {
      const rest = prop.slice(v.prefix.length)
      return v.replace + rest.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    }
  }

  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

function formatJsxStyleValue(value: string): string {
  const trimmed = value.trim()
  const isNumber = /^[+-]?\d*\.?\d+$/.test(trimmed)
  if (isNumber) return trimmed
  // Keep everything else as a string; escape single quotes/backslashes
  return `'${trimmed.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function toJsxStyleObject(styleText: string): string {
  const entries = styleText
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((decl) => {
      const colonIdx = decl.indexOf(':')
      if (colonIdx === -1) return null
      const name = decl.slice(0, colonIdx).trim()
      const value = decl.slice(colonIdx + 1).trim()
      const camel = toCamelCaseCssProp(name)
      const jsxValue = formatJsxStyleValue(value)
      return `${camel}: ${jsxValue}`
    })
    .filter((x): x is string => !!x)

  return `{{ ${entries.join(', ')} }}`
}

function convertInlineHtmlToJsx(input: string): string {
  let output = input

  // class -> className
  output = output.replace(/class=(['"])(.*?)\1/g, (_, q: string, v: string) => `className=${q}${v}${q}`)

  // style="..." -> style={{ ... }} with camelCased props
  output = output.replace(/style=(['"])(.*?)\1/g, (_, _q: string, styleStr: string) => `style=${toJsxStyleObject(styleStr)}`)

  return output
}

function getWordTitles(text: string): string[] {
  const titles: string[] = []
  const reDouble = /<Word\s+title="([^"]+)"/g
  const reSingle = /<Word\s+title='([^']+)'/g
  let m: RegExpExecArray | null
  while ((m = reDouble.exec(text))) titles.push(m[1].trim())
  while ((m = reSingle.exec(text))) titles.push(m[1].trim())
  return titles
}

function transformWords() {
  const filePath = path.join(process.cwd(), inputFile)
  const outputPath = path.join(process.cwd(), outputFile)
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${inputFile}`)
    process.exit(1)
  }
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const newTitles: string[] = []

  // Replace ### headers with <Word> components, wrapping every
  // ~120 characters in <WordLine>
  let transformed = content.replace(
    /### (.+?)\n([\s\S]*?)(?=\n### |$)/g,
    (_, title, definition) => {
      const t = title.trim()
      newTitles.push(t)
      return `<Word title="${t}">\n${definition.trim()}\n</Word>\n`
    }
  )

  // Replace [[#word]] with [word](#word) links
  transformed = transformed.replace(
    /\[\[#([^\]]+)\]\]/g,
    (_, word) => `[${word}](#${slugify(word)})`
  )

  // Convert inline HTML attributes to JSX: class -> className, style="..." -> style={{ ... }}
  transformed = convertInlineHtmlToJsx(transformed)
  
  // Compute and log which words were added compared to previous output
  const previousText = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf-8') : ''
  const previousTitles = previousText ? getWordTitles(previousText) : []
  const prevSet = new Set(previousTitles)
  const addedTitles = newTitles.filter((t) => !prevSet.has(t))

  // Log added words (with + prefix) before the final summary
  if (addedTitles.length > 0) {
    for (const t of addedTitles) console.log(`+ ${t}`)
  }

  const previousCount = previousTitles.length
  const newCount = newTitles.length
  const addedCount = Math.max(0, newCount - previousCount)

  fs.writeFileSync(outputPath, transformed, 'utf-8')
  console.log(`✅ Transformed ${inputFile} → ${outputFile} (${newCount} words; +${addedCount} added)`) 
}

transformWords()