function pad(v: number, digits: number = 2): string {
    const s = new Array(digits).fill('').map(_ => 0)
    return (s.join('') + v).substr(-digits)
}

export function GetDate(): string {
    const d = new Date()
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const date = d.getDate()
    return [y, pad(m, 2), pad(date, 2)].join('')
}
