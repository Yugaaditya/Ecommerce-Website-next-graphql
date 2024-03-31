export default function ThemeReducer(theme, action) {
    return (theme === "Light") ? "Dark" : "Light"
}