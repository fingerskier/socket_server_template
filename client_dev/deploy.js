import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.join(__dirname, 'dist')
const destDir = path.join(__dirname, '..', 'private')

fs.copy(srcDir, destDir, { overwrite: true })
  .then(() => {
    console.log('Deployment complete')
  })
  .catch(err => {
    console.error('Deployment failed:', err)
  })
