import { Platform } from "react-native"

const Color = {
    text: "#000",
    background: "white",
    backgroundFields: "rgb(238, 238, 243)",
    tint: "#EC5C5B", //"rgb(52, 133, 202)",
    tintInactive: "#999",
    separator: "rgba(225, 225, 225, 255)",
    subtle: "#999",
    tintNavbar: "#fff",
    white: "rgb(255, 255, 255)",
    red: "rgb(255, 59, 48)",
    orange: "rgb(255, 149, 0)",
    yellow: "rgb(255, 204, 0)",
    green: "rgb(76, 217, 100)",
    teal: "rgb(90, 200, 250)",
    blue: "rgb(0, 122, 255)",
    purple: "rgb(88, 86, 214)",
    pink: "rgb(255, 45, 85)",
}

const Dims = {
    horzPadding: 14,
    navbarHeight: 64
}

const TextSize = {
    tiny: Platform.OS === "ios" ? 14 : 12,
    small: Platform.OS === "ios" ? 16 : 14,
    normal: Platform.OS === "ios" ? 18 : 16,
    large: Platform.OS === "ios" ? 22 : 20,
}

export { Color, Dims, TextSize }