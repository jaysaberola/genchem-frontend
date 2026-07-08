type Props = {
  title?: string;
  kind?: "page" | "article";
};

export default function PrivateContentNotice({ title, kind = "page" }: Props) {
  const label = kind === "article" ? "news article" : "page";

  return (
    <div className="container py-5">
      <div className="mx-auto text-center py-5" style={{ maxWidth: "560px" }}>
        <span className="badge bg-secondary mb-3">Private</span>
        <h1 className="h4 text-dark mb-3">This {label} is not public</h1>
        <p className="text-muted mb-0">
          {title ? (
            <>
              <strong>{title}</strong> is set to private visibility and is only available in the admin.
            </>
          ) : (
            <>This content is set to private visibility and is only available in the admin.</>
          )}
        </p>
      </div>
    </div>
  );
}
