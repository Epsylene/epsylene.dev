import fs from 'fs'
import path from 'path'

const inputFile = process.argv[2]

if (!inputFile) {
  console.error('❌ Please provide an input file')
  console.log('Usage: npx tsx scripts/transformWords.ts <input-file>')
  process.exit(1)
}

const outputFile = 'words.mdx'

function transformWords() {
  const filePath = path.join(process.cwd(), inputFile)
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${inputFile}`)
    process.exit(1)
  }
  
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Replace ### headers with <Word> components
  const transformed = content.replace(
    /### (.+?)\n([\s\S]*?)(?=\n### |$)/g,
    (_, title, definition) => {
      return `<Word title="${title.trim()}">\n${definition.trim()}\n</Word>\n`
    }
  )
  
  fs.writeFileSync(path.join(process.cwd(), outputFile), transformed, 'utf-8')
  console.log(`✅ Transformed ${inputFile} → ${outputFile}`)
}

transformWords()