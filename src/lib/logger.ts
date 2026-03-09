import { styleText } from "util"

export function log(line1: string, ...lines: string[]) {
    if (lines.length > 0) console.log(`${line1}\n  ${lines.join("\n  ")}`)
    else console.log(line1)
}

export function error(line1: string, ...lines: string[]) {
    if (lines.length > 0) console.error(styleText(["red"], `${line1}\n  ${lines.join("\n  ")}`))
    else console.error(styleText(["red"], line1))
}
