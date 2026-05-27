#!/usr/bin/env node

import fs from "fs"
import path from "path"
import readline from "readline"
import { execSync } from "child_process"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question("Enter project name: ", (projectName) => {
  if (!projectName.trim()) {
    console.log("Project name cannot be empty.")
    rl.close()
    process.exit(1)
  }

  const projectPath = path.join(process.cwd(), projectName)

  if (fs.existsSync(projectPath)) {
    console.log(`Folder "${projectName}" already exists.`)
    rl.close()
    process.exit(1)
  }

  console.log(`\nCreating project: ${projectName}`)

  fs.mkdirSync(projectPath)

  process.chdir(projectPath)

  console.log("Initializing npm project...")

  execSync("npm init -y", { stdio: "inherit" })

  console.log("Installing dependencies...")

  execSync(
    "npm install express zod bcrypt cors helmet express-session pg connect-pg-simple",
    { stdio: "inherit" }
  )

  execSync(
    "npm install -D typescript tsx @types/node @types/express @types/bcrypt @types/cors @types/express-session",
    { stdio: "inherit" }
  )

  console.log("Creating folders...")

  fs.mkdirSync("src", { recursive: true })

  console.log("Creating starter index.ts...")

  fs.writeFileSync(
    "src/index.ts",
    `const username: string = "abhiram"

console.log(username)
`
  )

  console.log("Generating tsconfig.json...")

  const tsconfig = {
    compilerOptions: {
      target: "ES2020",

      module: "NodeNext",
      moduleResolution: "NodeNext",

      rootDir: "./src",
      outDir: "./dist",

      strict: true,

      esModuleInterop: true,

      sourceMap: true,

      noUnusedLocals: true,
      noUnusedParameters: true,

      skipLibCheck: true,
          "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    },

    include: ["src"],

    exclude: ["node_modules"]
  }

  fs.writeFileSync(
    "tsconfig.json",
    JSON.stringify(tsconfig, null, 2)
  )

  console.log("Updating package.json...")

  const packageJson = JSON.parse(
    fs.readFileSync("package.json", "utf-8")
  )

  packageJson.type = "module"
  packageJson.author = "Abhiram"

  packageJson.scripts = {
    dev: "tsx watch src/index.ts",
    build: "tsc",
    start: "node dist/index.js"
  }

  fs.writeFileSync(
    "package.json",
    JSON.stringify(packageJson, null, 2)
  )

  console.log("Creating .gitignore...")

  fs.writeFileSync(
    ".gitignore",
    `node_modules
dist
.env
`
  )

  console.log("\nSetup complete.\n")

  console.log("Next steps:")
  console.log(`cd ${projectName}`)
  console.log("npm run dev")

  rl.close()
})
