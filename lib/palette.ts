export const COLOR_PALETTE = [
    "#404040",
    "#1E4518", 
    "#182B79",
    "#759E6F",
    "#9C562D",
    "#5B70C9",
    "#89764D",
    "#2A251C",
] as const;

export type PaletteColor = typeof COLOR_PALETTE[number];

export const getHoverColor = (baseColor: string): string => {
    const hoverMap: Record<string, string> = {
        "#404040": "#666666",
        "#1E4518": "#759E6F",
        "#182B79": "#4A5BC4",
        "#759E6F": "#9CB891",
        "#9C562D": "#C4804D",
        "#5B70C9": "#7B8DD4",
        "#89764D": "#9A8659",
        "#2A251C": "#3A332A"
    };
    return hoverMap[baseColor] || baseColor;
};
