import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

import { getDocumentStylesheets } from "@/lib/publicSiteStyles";

type CustomDocumentProps = DocumentProps & {
  stylesheetHrefs: string[];
};

export default class CustomDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const pathname = ctx.pathname ?? "";
    const stylesheetHrefs = getDocumentStylesheets(pathname);

    return { ...initialProps, stylesheetHrefs };
  }

  render() {
    const { stylesheetHrefs } = this.props;

    return (
      <Html lang="en">
        <Head>
          {stylesheetHrefs.map((href) => (
            <link key={href} rel="stylesheet" href={href} />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
