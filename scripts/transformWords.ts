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

function transformWords() {
  const filePath = path.join(process.cwd(), inputFile)
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${inputFile}`)
    process.exit(1)
  }
  
  const content = fs.readFileSync(filePath, 'utf-8')

  // Replace ### headers with <Word> components, wrapping every
  // ~120 characters in <WordLine>
  let transformed = content.replace(
    /### (.+?)\n([\s\S]*?)(?=\n### |$)/g,
    (_, title, definition) => {
      console.log(title.trim())
      return `<Word title="${title.trim()}">\n${definition.trim()}\n</Word>\n`
    }
  )

  // Replace [[#word]] with [word](#word) links
  transformed = transformed.replace(
    /\[\[#([^\]]+)\]\]/g,
    (_, word) => `[${word}](#${slugify(word)})`
  )
  
  fs.writeFileSync(path.join(process.cwd(), outputFile), transformed, 'utf-8')
  console.log(`✅ Transformed ${inputFile} → ${outputFile}`)
}

transformWords()