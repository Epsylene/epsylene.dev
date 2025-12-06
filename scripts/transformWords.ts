import fs from 'fs'
import path from 'path'

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
  let groupCounter = 0

  // Replace ### headers with <Word> components, wrapping every
  // ~120 characters in <WordLine>
  let transformed = '<WordLine>\n' + content.replace(
    /### (.+?)\n([\s\S]*?)(?=\n### |$)/g,
    (_, title, definition) => {
      let component = `<Word title="${title.trim()}">\n${definition.trim()}\n</Word>\n`
      
      groupCounter += title.trim().length
      if (groupCounter / 120 > 1) {
        groupCounter = 0
        component = `</WordLine>\n\n<WordLine>\n${component}`
      }

      console.log(title.trim(), groupCounter)
      return component
    }
  ) + '</WordLine>'

  // Replace [[#word]] with [word](#word) links
  transformed = transformed.replace(
    /\[\[#([^\]]+)\]\]/g,
    (_, word) => `[${word}](#${word})`
  )
  
  fs.writeFileSync(path.join(process.cwd(), outputFile), transformed, 'utf-8')
  console.log(`✅ Transformed ${inputFile} → ${outputFile}`)
}

transformWords()