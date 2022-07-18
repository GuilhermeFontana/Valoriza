export default function toPascaCase(str: string) {
    return str.split(" ")
        .map(palavra => 
            palavra[0].toUpperCase().concat(palavra.slice(1)))
        .join(" ");
}