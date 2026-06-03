export default function Label({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        color: "var(--text-3)",
        marginBottom: 16,
        letterSpacing: "0.04em",
      }}
    >
      <span style={{ color: "var(--accent)" }}>//</span> {text}
    </div>
  );
}
