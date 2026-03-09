#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "fs"
import { join, resolve } from "path"
import { error, log } from "./lib/logger"
import { preprocess } from "."

const EXTENSION = ".fhtm"

let anyDocumentProcessed = false
function processFile(filePath: string) {
    if (!filePath.endsWith(EXTENSION)) return
    const outPath = filePath.slice(0, -EXTENSION.length) + ".html"
    const content = readFileSync(filePath, "utf-8")
    const result = preprocess(content, filePath)
    writeFileSync(outPath, result, "utf-8")
    log("Processed document", filePath, `to ${outPath}`)
    anyDocumentProcessed = true
}

function processDirectory(directory: string) {
    if (!existsSync(directory) || !statSync(directory).isDirectory()) {
        error("Directory not found", directory)
        return
    }

    for (const entry of readdirSync(directory)) {
        const fullPath = join(directory, entry)
        if (statSync(fullPath).isDirectory()) processDirectory(fullPath)
        else processFile(fullPath)
    }
}

const inputDirectoryArg = process.argv[2]
if (inputDirectoryArg === "--help" || inputDirectoryArg === "-h") {
    log("Usage: floorhtm [directory]", "If no directory is provided, your current one will be used.", `FloorHTM will process all ${EXTENSION} files in and under the directory.`)
    process.exit(0)
}

function main() {
    const inputDirectory = inputDirectoryArg ? resolve(inputDirectoryArg) : process.cwd()
    processDirectory(inputDirectory)
    if (!anyDocumentProcessed) error("No documents found", inputDirectory)
}

main()
