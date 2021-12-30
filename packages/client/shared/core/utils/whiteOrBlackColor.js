import hexToRgb from "./hexToRGB"

/**
 * Actually Github copilot gave me this function.
 * 
 * @param {String} backgroundHexColor - Hex color of the background.
 * 
 * @returns {'black' | 'white' | null} - Hex color of the text to use, should be white, black or if null
 * use the default value you got.
 */
export default function whiteOrBlackColor(backgroundHexColor) {
    if (typeof backgroundHexColor === "string") { 
        const rgbColor = hexToRgb(backgroundHexColor)
        if (rgbColor !== null) {
            const { r, g, b } = rgbColor
            const yiq = (r * 299 + g * 587 + b * 114) / 1000
            return yiq >= 128 ? "black" : "white"
        } 
    }
    return null
}