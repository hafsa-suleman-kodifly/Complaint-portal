// Centralized Ant Design theme — blue, minimal, modern SaaS look.
export const PRIMARY = "#1677ff"
export const PRIMARY_DARK = "#0a3d8f"
export const INK = "#0f274d"

export const theme = {
  cssVar: true,
  token: {
    colorPrimary: PRIMARY,
    colorInfo: PRIMARY,
    colorLink: PRIMARY,
    borderRadius: 12,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    colorBgLayout: "#f4f7fc",
    colorTextHeading: INK,
    fontSize: 14,
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      bodyBg: "#f4f7fc",
      footerBg: "transparent",
    },
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: "0 6px 24px rgba(15, 39, 77, 0.06)",
    },
    Button: {
      controlHeight: 38,
      borderRadius: 10,
      fontWeight: 600,
    },
    Menu: {
      itemBorderRadius: 10,
      horizontalItemSelectedColor: PRIMARY,
    },
    Table: {
      headerBg: "#f0f5ff",
      headerColor: INK,
      rowHoverBg: "#f5f9ff",
      borderColor: "#eef2f8",
    },
    Statistic: {
      titleFontSize: 13,
    },
    Tag: {
      borderRadiusSM: 8,
    },
  },
}

