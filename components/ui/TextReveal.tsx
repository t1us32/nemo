export default function TextReveal({
  text,
  as: Tag = "p",
  className = "",
  wordSplit = false,
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  wordSplit?: boolean;
}) {
  if (!wordSplit) {
    return (
      <Tag data-reveal="body" className={className}>
        {text}
      </Tag>
    );
  }

  const words = text.split(" ");
  return (
    <Tag data-reveal="headline" className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top mr-[0.28em]">
          <span data-reveal-word className="inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
