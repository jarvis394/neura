import { spawn } from 'child_process'

export const pythonProcess = spawn('python', ['backend/main.py'])
pythonProcess.stdout.on('data', (data) => console.log(`backend: ${data}`))
pythonProcess.stderr.on('data', (data) => console.error(`error (backend): ${data}`))
pythonProcess.on('close', (code) => {
  console.error('Python backend process exited with code', code, '\nExiting.')
  process.exit(code)
})
