import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import LimitingFactorExplorer from "@/components/lesson-components/LimitingFactorExplorer";
import OsmosisExplorer from "@/components/lesson-components/OsmosisExplorer";

// Registry of interactive lesson components that body_md can embed via
//   <div data-lesson-component="name"></div>
const LESSON_COMPONENTS = {
  'limiting-factor-explorer': LimitingFactorExplorer,
  'osmosis-explorer': OsmosisExplorer,
};

const serif = '"Fraunces", Georgia, serif';
const mono = '"IBM Plex Mono", monospace';

// Rich, editorial markdown rendering for lesson bodies.
// Conventions used inside body_md:
//   # h1        → topic-level heading
//   ## h2       → section heading
//   ### h3      → sub-section
//   > text      → key-fact callout (left pink bar, italic emphasis)
//   ![alt](url "caption")  → image with caption
//   - / 1.      → list
//   **bold**, *italic*, [link](url)
//   ```         → code block (rare in biology — used for chemistry equations)
//   tables (GFM)
export default function LessonBody({ children }) {
  if (!children) return null;
  return (
    <div className="lesson-body" style={{ fontFamily: serif, fontSize: "1.05rem", lineHeight: 1.75 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl mt-10 mb-5"
              style={{ fontFamily: serif, fontWeight: 500, lineHeight: 1.1 }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl mt-10 mb-3 pb-2 border-b border-stone-900/15"
              style={{ fontFamily: serif, fontWeight: 500 }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg mt-7 mb-2 uppercase opacity-80"
              style={{ fontFamily: mono, letterSpacing: "0.18em", fontWeight: 600 }}>{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4">{children}</p>,
          div: ({ node, children, ...props }) => {
            const name = props['data-lesson-component'];
            if (name && LESSON_COMPONENTS[name]) {
              const Comp = LESSON_COMPONENTS[name];
              return <Comp />;
            }
            return <div {...props}>{children}</div>;
          },
          ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
          em: ({ children }) => <em style={{ color: "#c2185b" }}>{children}</em>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer"
              className="underline decoration-dotted hover:opacity-80"
              style={{ color: "#c2185b" }}>{children}</a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 pl-5 py-1 italic"
              style={{
                borderLeft: "3px solid #ec407a",
                backgroundColor: "rgba(236,64,122,0.05)",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                paddingRight: "1rem",
              }}>{children}</blockquote>
          ),
          img: ({ src, alt, title }) => (
            <figure className="my-6">
              <img src={src} alt={alt}
                className="w-full max-h-[28rem] object-contain"
                style={{ border: "1px solid rgba(26,31,46,0.15)", backgroundColor: "rgba(26,31,46,0.03)" }} />
              {(title || alt) && (
                <figcaption className="mt-2 text-[11px] uppercase opacity-65"
                  style={{ fontFamily: mono, letterSpacing: "0.18em" }}>
                  {title || alt}
                </figcaption>
              )}
            </figure>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="text-left py-2 px-3 text-[10px] uppercase"
              style={{ fontFamily: mono, letterSpacing: "0.22em",
                borderBottom: "2px solid rgba(26,31,46,0.5)", fontWeight: 600 }}>{children}</th>
          ),
          td: ({ children }) => (
            <td className="py-2 px-3"
              style={{ borderBottom: "1px solid rgba(26,31,46,0.12)" }}>{children}</td>
          ),
          code: ({ inline, children }) => inline ? (
            <code className="px-1.5 py-0.5 text-[0.9em]"
              style={{ fontFamily: mono, backgroundColor: "rgba(26,31,46,0.08)" }}>{children}</code>
          ) : (
            <pre className="my-4 p-4 overflow-x-auto text-sm"
              style={{ fontFamily: mono, backgroundColor: "#1a1f2e", color: "#e8e4d8" }}>
              <code>{children}</code>
            </pre>
          ),
          hr: () => <hr className="my-8" style={{ borderColor: "rgba(26,31,46,0.15)" }} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
