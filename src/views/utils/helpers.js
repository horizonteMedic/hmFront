import { addYears, format } from "date-fns";

export function fixEncodingModern(str) {
    const bytes = new Uint8Array([...str].map((c) => c.charCodeAt(0)));
    return new TextDecoder("utf-8").decode(bytes);
}
export function getToday() {
    return format(new Date(), "yyyy-MM-dd");
}
export function getTodayPlusOneYear() {
    return format(addYears(new Date(), 1), "yyyy-MM-dd");
}
export function getSign(data, name) { //HUELLA // FIRMAP // SELLOFIRMA
    return data.digitalizacion?.find(
        item => item.nombreDigitalizacion === name
    )?.url ?? ""
}
