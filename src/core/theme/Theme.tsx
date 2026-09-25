export const PrimaryTheme = {
    primary20 : "#8FCAFA",
    primary40: "#2798F5",
    primary60 : "#0B8BF4"
}
export function getColors(isDark : boolean){
  const colors = {
    background: isDark ? "#0D1117" : "#F8FAFC",
    surface: isDark ? "#161B22" : "#FFFFFF",
    text: isDark ? "#F0F6FC" : "#111827",
    secondaryText: isDark ? "#8B949E" : "#6B7280",
    border: isDark ? "#30363D" : "#D1D5DB",
    inputBackground: isDark ? "#0D1117" : "#F9FAFB",
  };
  return colors;

}
