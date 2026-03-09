import type { ServerScope } from "./types"
import { existsSync, readFileSync } from "fs"
import { resolve, dirname } from "path"
import { JSDOM } from "jsdom"
import { error } from "./lib/logger"

export function executeServerScripts(dom: JSDOM): ServerScope {
    const document = dom.window.document
    const scriptElements = document.querySelectorAll("script[type=server]")
    const scope: ServerScope = {}
    for (const element of scriptElements) {
        const code = element.textContent
        element.remove()

        if (!code) continue
        try {
            new Function("client", code)(scope)
        } catch (err) {
            error("Failed to execute server script", err instanceof Error ? err.stack || err.message : String(err))
        }
    }

    return scope
}

export function importComponents(dom: JSDOM, importerPath: string, scope: ServerScope): void {
    const document = dom.window.document
    const componentElements = document.querySelectorAll("component[src]")
    for (const element of componentElements) {
        let name = element.getAttribute("src")?.trim()
        if (!name) continue

        const importerDirectory = dirname(importerPath)
        const candidates = [
            resolve(importerDirectory, `${name}.html`),
            resolve(importerDirectory, `${name}.fhtm`),
        ]

        let content: string | null = null
        for (const path of candidates) {
            if (existsSync(path)) {
                content = preprocess(readFileSync(path, "utf-8"), path, scope)
                break
            }
        }

        if (content === null) {
            error("Failed to import component", name, "File not found")
            element.remove()
            continue
        }

        const template = document.createElement("template")
        template.innerHTML = content
        element.replaceWith(template.content)
    }
}

export function replacePlaceholders(content: string, scope: ServerScope): string {
    return content.replace(/{{%\s*(\w+)\s*%}}/g, (_, key) => {
        const value = scope[key]
        return value !== undefined ? String(value) : `{{%${key}%}}`
    })
}

export function preprocess(content: string, filePath: string, scope?: ServerScope): string {
    const dom = new JSDOM(content)
    const actualScope = scope ?? executeServerScripts(dom)
    importComponents(dom, filePath, actualScope)
    return replacePlaceholders(dom.serialize(), actualScope)
}
