import { Typography } from "antd"

const { Title, Paragraph } = Typography

// Reusable gradient hero band used at the top of public pages.
export default function PageHero({ eyebrow, title, subtitle, icon }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#0a3d8f 0%,#1677ff 100%)",
        color: "#fff",
        padding: "56px 24px 96px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {eyebrow && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            {icon}
            {eyebrow}
          </div>
        )}
        <Title level={1} style={{ color: "#fff", margin: 0, fontSize: "clamp(28px,4vw,42px)" }}>
          {title}
        </Title>
        {subtitle && (
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 16,
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            {subtitle}
          </Paragraph>
        )}
      </div>
    </div>
  )
}
