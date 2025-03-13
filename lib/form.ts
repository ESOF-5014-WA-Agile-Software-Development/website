import FormData from 'form-data'

/** 转换为每3位加逗号 */
export function currencyString(num: string | number, digits = 2, prefix = '') {
    if (!num) return ''

    let n = 0
    if (typeof num === 'string') {
        n = parseFloat(num)
    } else {
        n = num
    }

    const str = n.toFixed(digits)
    const reg = /(?=(\B)(\d{3})+$)/g
    const m = str.split('.')
    m[0] = m[0].replace(reg, ',')
    return prefix + m.join('.')
}

export function ToFormData(obj: Record<string, any>): FormData {
    const formdata = new FormData()
    Object.keys(obj).forEach(key => {
        formdata.append(key, obj[key])
    })
    return formdata
}
