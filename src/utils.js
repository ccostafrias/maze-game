export function classesConstructor(obj) {
    let arr = []
    for (const p in obj) {
        if (obj[p]) arr.push(p)
    }

    return arr.join(" ")
}