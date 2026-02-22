import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useSidebar } from '../context/SidebarContext';
import CodeBlock from '../components/shared/CodeBlock';
import Callout from '../components/shared/Callout';
import DataTable from '../components/shared/DataTable';
import SectionHeader from '../components/shared/SectionHeader';
import MermaidViewer from '../components/diagrams/MermaidViewer';

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const c = {
  bg: '#0a0e17',
  surface: '#111827',
  surface2: '#1a2332',
  surface3: '#1f2b3d',
  border: '#2a3a52',
  text: '#e2e8f0',
  text2: '#94a3b8',
  text3: '#64748b',
  accent: '#3b82f6',
  accent2: '#10b981',
  accent3: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  cyan: '#06b6d4',
} as const;

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

/* ------------------------------------------------------------------ */
/*  TOC data                                                           */
/* ------------------------------------------------------------------ */
const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'rendering-pipeline', label: 'Rendering Pipeline' },
  { id: 'route-definition', label: 'Route & Page Entry' },
  { id: 'static-props', label: 'Static Props (SSG)' },
  { id: 'contentful-fetch', label: 'Contentful Data Fetch' },
  { id: 'graphql-query', label: 'GraphQL Query' },
  { id: 'data-guard', label: 'CmsDataGuard' },
  { id: 'page-component', label: 'OwnershipPage Component' },
  { id: 'section-rendering', label: 'Section Components' },
  { id: 'hero-section', label: 'HeroSection Deep Dive' },
  { id: 'list-icon-section', label: 'ListIconSection' },
  { id: 'content-list-section', label: 'ContentListSection' },
  { id: 'cards-section', label: 'CardsSection' },
  { id: 'type-guards', label: 'Type Guards & Filters' },
  { id: 'data-conversion', label: 'Data Conversion Utils' },
  { id: 'image-handling', label: 'Responsive Images' },
  { id: 'contentful-model', label: 'Contentful Content Model' },
  { id: 'environment-config', label: 'Environment Config' },
  { id: 'file-map', label: 'Complete File Map' },
];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const heroSection: CSSProperties = {
  position: 'relative',
  textAlign: 'center',
  padding: '5rem 0 4rem',
  overflow: 'hidden',
};

const heroGradientBg: CSSProperties = {
  position: 'absolute',
  top: '-40%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '160%',
  height: '200%',
  background:
    'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
};

const heroContent: CSSProperties = {
  position: 'relative',
  zIndex: 1,
};

const heroTitle: CSSProperties = {
  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
  fontWeight: 800,
  lineHeight: 1.1,
  margin: '0 0 1.5rem',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroSubtitle: CSSProperties = {
  fontSize: '1.1rem',
  color: c.text2,
  maxWidth: 700,
  margin: '0 auto',
  lineHeight: 1.8,
};

const sectionSpacing: CSSProperties = {
  marginTop: '5rem',
};

const para: CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.8,
  color: c.text2,
  marginBottom: '1.25rem',
};

const subHeading: CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 700,
  color: c.text,
  marginTop: '2.5rem',
  marginBottom: '1rem',
};

const spacer: CSSProperties = { marginTop: '2rem' };

const cardGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
};

const infoCard: CSSProperties = {
  backgroundColor: c.surface,
  border: `1px solid ${c.border}`,
  borderRadius: 12,
  padding: '1.5rem',
};

const infoCardTitle: CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: c.text,
  marginBottom: '0.5rem',
};

const infoCardText: CSSProperties = {
  fontSize: '0.85rem',
  color: c.text2,
  lineHeight: 1.7,
};

const filePathStyle: CSSProperties = {
  fontSize: '0.78rem',
  fontFamily: "'JetBrains Mono', monospace",
  color: c.cyan,
  backgroundColor: c.surface2,
  padding: '3px 8px',
  borderRadius: 4,
  display: 'inline-block',
  marginBottom: '0.75rem',
};

/* ------------------------------------------------------------------ */
/*  Step-by-step rendering flow component                              */
/* ------------------------------------------------------------------ */
function RenderingStep({ number, title, file, color, children }: {
  number: number;
  title: string;
  file: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div {...fadeUp} style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 48, flexShrink: 0 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: `${color}20`, border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800,
          color, flexShrink: 0,
        }}>
          {number}
        </div>
        <div style={{ width: 2, flex: 1, minHeight: 20, background: `${color}30` }} />
      </div>
      <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: c.text, marginBottom: '0.25rem' }}>{title}</div>
        <div style={filePathStyle}>{file}</div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mermaid diagrams                                                   */
/* ------------------------------------------------------------------ */
const mermaidRenderingPipeline = `sequenceDiagram
    participant Browser
    participant Next as Next.js SSG
    participant GSP as getStaticProps
    participant Fetch as fetchCmsData
    participant CF as Contentful GraphQL
    participant Guard as CmsDataGuard
    participant Page as OwnershipPage
    participant Sections as Section Components

    Note over Browser,Next: Build Time
    Next->>GSP: getOwnershipPageStaticProps()
    GSP->>GSP: getBasicCMSPageStaticProps()
    GSP->>Fetch: fetchCmsData(query, variables)
    Fetch->>CF: POST /content/v1/spaces/SPACE/environments/ENV
    Note over Fetch,CF: Authorization Bearer deliveryToken
    CF-->>Fetch: landingPageCollection items array
    Fetch-->>GSP: LandingPageQuery data
    GSP->>GSP: getCollectionData(data, landingPageCollection)
    GSP-->>Next: props with pageData, seo, layoutData

    Note over Browser,Sections: Runtime (Client)
    Browser->>Next: GET /ownership
    Next->>Guard: CmsDataGuard validates pageData
    alt Data is valid
        Guard->>Page: OwnershipPage with pageData
        Page->>Page: Destructure section collections
        Page->>Sections: HeroSection
        Page->>Sections: ListIconSection
        Page->>Sections: ContentListSection
        Page->>Sections: CardsSection
    else Data is null
        Guard->>Browser: Redirect to /404
    end`;

const mermaidContentfulModel = `graph TB
    subgraph Contentful["Contentful CMS"]
        LP["LandingPage<br/><b>'My Driveway Landing Page'</b>"]
    end

    subgraph Hero["heroSectionCollection (limit: 7)"]
        H_IMG["CustomImage<br/>(hero image)"]
        H_TITLE["ShortText<br/>(internalName: 'title')"]
        H_SUB["ShortText<br/>(internalName: 'subtitle')"]
        H_DESC["ShortText<br/>(internalName: 'description')"]
        H_CTA1["Cta<br/>(variant: 'primary')"]
        H_CTA2["Cta<br/>(variant: 'tertiary')"]
    end

    subgraph ListIcon["listIconSectionCollection (limit: 8)"]
        LI_TITLE["ShortText (title)"]
        LI_DESC["ShortText (description)"]
        LI_IMG["CustomImage"]
        LI_ITEMS["ListItemIconHeadingAndDescription<br/>(heading, description, icon)"]
        LI_CTA["Cta"]
    end

    subgraph ContentList["contentListSectionCollection (limit: 7)"]
        CL_TITLE["ShortText (title)"]
        CL_IMG["CustomImage"]
        CL_LIST["ContentList<br/>itemsCollection"]
        CL_CTA["Cta"]
    end

    subgraph Cards["cardsSectionCollection (limit: 4)"]
        CS_TITLE["ShortText (title)"]
        CS_DESC["ShortText (description)"]
        CS_CARDS["ImageCard<br/>(cardTitle, cardImagesCollection, cardCta)"]
    end

    LP --> Hero
    LP --> ListIcon
    LP --> ContentList
    LP --> Cards

    style LP fill:#6e40c9,stroke:#bc8cff,color:#fff
    style H_IMG fill:#1f6feb,stroke:#58a6ff,color:#fff
    style H_TITLE fill:#238636,stroke:#3fb950,color:#fff
    style H_SUB fill:#238636,stroke:#3fb950,color:#fff
    style H_DESC fill:#238636,stroke:#3fb950,color:#fff
    style H_CTA1 fill:#d29922,stroke:#e3b341,color:#000
    style H_CTA2 fill:#d29922,stroke:#e3b341,color:#000`;

const mermaidComponentTree = `graph TD
    INDEX["pages/ownership/index.tsx<br/><b>Route Entry</b>"]
    GUARD["CmsDataGuard<br/>Validates CMS data"]
    PAGE["OwnershipPage.tsx<br/>Destructures collections"]
    HERO["HeroSection<br/>Title, subtitle, image, CTAs"]
    LIST["ListIconSection<br/>Benefits with icons"]
    CONTENT["ContentListSection<br/>Feature list with image"]
    CARDS["CardsSection<br/>Image card grid"]

    INDEX --> GUARD
    GUARD --> PAGE
    PAGE --> HERO
    PAGE --> LIST
    PAGE --> CONTENT
    PAGE --> CARDS

    subgraph SharedComponents["Shared CMS Components"]
        IMG["CmsCustomImageComponent<br/>(WebpImage)"]
        TEXT["CmsShortTextComponent<br/>(Typography)"]
        CTA["CmsCtaComponent<br/>(Button + Auth)"]
        WRAP["PageSection<br/>(Layout wrapper)"]
    end

    HERO --> IMG
    HERO --> TEXT
    HERO --> CTA
    HERO --> WRAP
    LIST --> IMG
    LIST --> TEXT
    LIST --> CTA
    CARDS --> TEXT

    style INDEX fill:#6e40c9,stroke:#bc8cff,color:#fff
    style GUARD fill:#da3633,stroke:#f85149,color:#fff
    style PAGE fill:#1f6feb,stroke:#58a6ff,color:#fff
    style HERO fill:#238636,stroke:#3fb950,color:#fff
    style LIST fill:#238636,stroke:#3fb950,color:#fff
    style CONTENT fill:#238636,stroke:#3fb950,color:#fff
    style CARDS fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidDataFlow = `flowchart LR
    subgraph Contentful["Contentful CMS (GraphQL)"]
        ENTRY["LandingPage Entry<br/>'My Driveway Landing Page'"]
    end

    subgraph SSG["Next.js Build (getStaticProps)"]
        FETCH["fetchCmsData()"]
        EXTRACT["getCollectionData()<br/>items[0]"]
    end

    subgraph Transform["Data Transformation"]
        FBT["filterByType()"]
        GUARDS["Type Guards<br/>isShortText, isCta, isCustomImage"]
        CONVERT["Convert Utils<br/>getCta, getCustomImage, getShortText"]
    end

    subgraph Render["React Components"]
        SECTION["Section Component<br/>(HeroSection, etc.)"]
        CMS["CMS Sub-Components<br/>(ShortText, CustomImage, Cta)"]
    end

    ENTRY -->|"GraphQL POST"| FETCH
    FETCH -->|"json.data"| EXTRACT
    EXTRACT -->|"pageData prop"| FBT
    FBT -->|"items array"| GUARDS
    GUARDS -->|"typed arrays"| CONVERT
    CONVERT -->|"clean props"| SECTION
    SECTION -->|"render"| CMS

    style ENTRY fill:#6e40c9,stroke:#bc8cff,color:#fff
    style FETCH fill:#1f6feb,stroke:#58a6ff,color:#fff
    style SECTION fill:#238636,stroke:#3fb950,color:#fff`;

const mermaidAuthFlow = `flowchart TD
    CLICK["User clicks CTA button"] --> AUTH{"isAuthenticated?"}
    AUTH -->|Yes| NAVIGATE["router.push url<br/>Navigate to destination"]
    AUTH -->|No| SIGNUP["signUp with appState:<br/>returnTo = url<br/>signUpPlay = Play.Dealership"]
    SIGNUP --> AUTH0["Auth0 Sign Up Modal"]
    AUTH0 --> REDIRECT["After auth: redirect to<br/>original CTA destination URL"]

    style CLICK fill:#1f6feb,stroke:#58a6ff,color:#fff
    style AUTH fill:#d29922,stroke:#e3b341,color:#000
    style NAVIGATE fill:#238636,stroke:#3fb950,color:#fff
    style SIGNUP fill:#6e40c9,stroke:#bc8cff,color:#fff`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function OwnershipLandingPage() {
  const { setSidebar, clearSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('Ownership Landing', tocItems);
    return () => clearSidebar();
  }, [setSidebar, clearSidebar]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section style={heroSection}>
        <div style={heroGradientBg} />
        <motion.div style={heroContent} {...fadeUp}>
          <h1 style={heroTitle}>/ownership Landing Page</h1>
          <p style={heroSubtitle}>
            How the Ownership landing page renders content from Contentful CMS -- step by step,
            from Next.js route to final React component
          </p>
        </motion.div>
      </section>

      {/* ============ OVERVIEW ============ */}
      <section id="overview" style={sectionSpacing}>
        <SectionHeader label="Introduction" title="Overview" description="How does the /ownership page pull content from Contentful and render it?" />
        <motion.div {...fadeUp}>
          <p style={para}>
            The <code>/ownership</code> page (also known as "My Driveway Landing Page") is a server-side generated (SSG) page built with
            <strong> Next.js</strong> that fetches its entire content from <strong>Contentful CMS</strong> via GraphQL at build time. The page
            is composed of 4 section components, each mapping to a Contentful collection field on the <code>LandingPage</code> content type.
          </p>
          <div style={cardGrid}>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent2 }}>Framework</div>
              <div style={infoCardText}>Next.js with <code>getStaticProps</code> (SSG). Page is pre-rendered at build time and revalidated on a timer via ISR.</div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent }}>CMS</div>
              <div style={infoCardText}>Contentful GraphQL API. Content type: <code>LandingPage</code>. Entry title: <code>"My Driveway Landing Page"</code>.</div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.accent3 }}>Sections</div>
              <div style={infoCardText}>4 sections: HeroSection, ListIconSection, ContentListSection, CardsSection. Each maps to a Contentful collection field.</div>
            </div>
            <div style={infoCard}>
              <div style={{ ...infoCardTitle, color: c.orange }}>Auth Integration</div>
              <div style={infoCardText}>CTAs are auth-aware. If user is not logged in, clicking a CTA triggers Auth0 sign-up flow before navigating.</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ RENDERING PIPELINE ============ */}
      <section id="rendering-pipeline" style={sectionSpacing}>
        <SectionHeader label="Architecture" title="Full Rendering Pipeline" description="The complete journey from Contentful CMS to rendered React components" />
        <motion.div {...fadeUp}>
          <MermaidViewer title="Rendering Pipeline Sequence" tabs={[{ label: 'Full Pipeline', source: mermaidRenderingPipeline }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Component Tree" tabs={[{ label: 'Component Tree', source: mermaidComponentTree }]} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <MermaidViewer title="Data Transformation Flow" tabs={[{ label: 'Data Flow', source: mermaidDataFlow }]} />
        </motion.div>
      </section>

      {/* ============ STEP 1: ROUTE DEFINITION ============ */}
      <section id="route-definition" style={sectionSpacing}>
        <SectionHeader label="Step 1" title="Route & Page Entry Point" description="The Next.js page file that defines the /ownership route" />

        <RenderingStep number={1} title="Next.js Page Route" file="UI/src/pages/ownership/index.tsx" color={c.accent3}>
          <p style={para}>
            This is the entry point. Next.js automatically creates the <code>/ownership</code> route from this file path.
            It exports <code>getStaticProps</code> for SSG and the default component that renders the page.
          </p>
          <CodeBlock language="tsx" code={`import { LandingPageFragment } from "global-components/CmsComponents/LandingPage/landingPageQuery.contentful.generated";
import { PreviewDataProps } from "models/previewDataProps";
import OwnershipPage from "ownership/pages/OwnershipPage";
import { getOwnershipPageStaticProps } from "ownership/pages/pageProps/getOwnershipPageStaticProps";
import CmsDataGuard from "util/cmsData/CmsDataGuard";

// TypeScript type for the page props
export type OwnershipPageProps = {
  pageData: LandingPageFragment | null;  // The Contentful data (or null on error)
  preview?: boolean;                      // Whether in preview mode
};

// This is called at BUILD TIME by Next.js
export const getStaticProps = getOwnershipPageStaticProps;

// The React component that renders the page
const Ownership: NextPageWithLayout<OwnershipPageProps & PreviewDataProps & OpenGraphProps> =
  ({ pageData, preview, env }) => {
    return (
      <>
        <PreviewBanner visible={preview} previewEnv={env} />
        <CmsDataGuard data={pageData}>
          {(data) => <OwnershipPage pageData={data} />}
        </CmsDataGuard>
      </>
    );
  };

export default Ownership;`} />
          <Callout type="info" title="Key Pattern: Render Props with CmsDataGuard">
            <code>CmsDataGuard</code> uses a <strong>render props pattern</strong>. It validates <code>pageData</code>,
            and only calls the child function <code>{`(data) => <OwnershipPage />`}</code> if data is valid.
            If data is null, it redirects to <code>/404</code>.
          </Callout>
        </RenderingStep>
      </section>

      {/* ============ STEP 2: STATIC PROPS ============ */}
      <section id="static-props" style={sectionSpacing}>
        <SectionHeader label="Step 2" title="Static Props Generation (SSG)" description="How Next.js fetches Contentful data at build time" />

        <RenderingStep number={2} title="Ownership-Specific Static Props" file="UI/src/ownership/pages/pageProps/getOwnershipPageStaticProps.tsx" color={c.accent}>
          <p style={para}>
            This file configures <em>what</em> to fetch from Contentful. It uses a factory function
            <code> getBasicCMSPageStaticProps</code> with three key parameters: the GraphQL query, the collection key,
            and the Contentful entry title to search for.
          </p>
          <CodeBlock language="tsx" code={`import {
  LandingPageData,
  LandingPageQuery,
  landingPageQuery,
} from "global-components/CmsComponents/LandingPage/PageSections";
import { getBasicCMSPageStaticProps } from "util/cmsData/getBasicCMSPageStaticProps";

const PAGE_TITLE = "My Driveway Landing Page";  // <-- Exact title in Contentful

export const getOwnershipPageStaticProps = getBasicCMSPageStaticProps<
  LandingPageQuery,    // The full GraphQL response type
  LandingPageData,     // The extracted page data type
  OwnershipPageProps   // The page component props type
>({
  query: landingPageQuery,                  // The GraphQL query string
  collectionKey: "landingPageCollection",   // Key to extract from response
  variables: {
    landingPageTitle: PAGE_TITLE,           // Variable passed to GraphQL query
  },
});`} />
        </RenderingStep>

        <RenderingStep number={3} title="Generic CMS Page Static Props Factory" file="UI/src/util/cmsData/getBasicCMSPageStaticProps.ts" color={c.accent2}>
          <p style={para}>
            This is the <strong>generic factory function</strong> used by all CMS landing pages (Ownership, Dealership, DFC).
            It orchestrates: fetching layout data, calling Contentful, extracting the first item from the collection,
            and building the final props object with SEO metadata.
          </p>
          <CodeBlock language="tsx" code={`export const getBasicCMSPageStaticProps = <TQuery, TPageData, TPageProps>({
  query,
  collectionKey,
  variables = {},
}: BasicCMSPageStaticPropsOptions) => {
  return async (ctx: GetStaticPropsContext): Promise<CMSPageStaticPropsResult<TPageProps>> => {
    // 1. Fetch shared layout data (header, footer, nav)
    const layoutData = await getLayoutStaticProps();

    let collectionData: (TPageData & SeoData) | null;

    try {
      // 2. Fetch CMS data from Contentful GraphQL API
      const queryData = await fetchCmsData<TQuery>({
        query,
        preview: !!ctx.preview,
        env: ctx.previewData?.env,
        variables: { ...variables },
      });

      // 3. Extract the first item from the collection
      //    queryData?.landingPageCollection?.items[0]
      collectionData = getCollectionData(queryData, collectionKey);
    } catch (error) {
      collectionData = null;  // CmsDataGuard will handle gracefully
    }

    // 4. Return props for the page component
    return {
      revalidate,  // ISR revalidation interval
      props: {
        layoutData,
        pageData: collectionData,
        seo: {
          title: collectionData?.seo?.title || "",
          description: collectionData?.seo?.description || "",
        },
        openGraph: { ... },
        preview: !!ctx.preview,
        env: ctx.previewData?.env || "",
      },
    };
  };
};`} />
          <Callout type="warning" title="getCollectionData extracts items[0]">
            The <code>getCollectionData</code> helper accesses <code>{'queryData[collectionKey]?.items?.[0]'}</code>.
            This means it always takes the <strong>first item</strong> from the Contentful collection. The GraphQL query
            uses <code>limit: 1</code> with a <code>where</code> filter on the landing page title.
          </Callout>
        </RenderingStep>
      </section>

      {/* ============ STEP 3: CONTENTFUL FETCH ============ */}
      <section id="contentful-fetch" style={sectionSpacing}>
        <SectionHeader label="Step 3" title="Contentful Data Fetch" description="The HTTP call to Contentful's GraphQL API" />

        <RenderingStep number={4} title="fetchCmsData - The HTTP Layer" file="UI/src/util/cmsData/fetchCmsData.ts" color={c.orange}>
          <p style={para}>
            This function makes the actual HTTP POST request to Contentful's GraphQL endpoint.
            It handles preview vs delivery tokens, error handling, and JSON parsing.
          </p>
          <CodeBlock language="tsx" code={`export const fetchCmsData = async <T>({
  query,
  variables,
  preview,
  env,
}: FetchCmsData): Promise<null | T> => {
  try {
    // Build the Contentful GraphQL URL
    const cmsApiBase =
      \`\${Config.contentfulGraphQLBase}\${Config.contentfulSpace}\` +
      \`/environments/\${env ? env : Config.contentfulEnvironment}\`;

    // POST the GraphQL query
    const response = await fetch(cmsApiBase, {
      method: "POST",
      headers: new Headers({
        Authorization: \`Bearer \${
          preview
            ? Config.contentfulPreviewToken   // Draft content
            : Config.contentfulDeliveryToken  // Published content only
        }\`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        query,
        variables: { ...variables, preview },
      }),
    });

    if (!response.ok) {
      console.error(\`Contentful API error: \${response.status}\`);
      return null;
    }

    const json = await response.json();
    if (json.errors) {
      console.error("Contentful GraphQL errors:", json.errors);
      return null;
    }

    return json.data;  // Return the data portion of the GraphQL response
  } catch (error) {
    console.error("Contentful fetch error:", error);
    return null;
  }
};`} />
          <DataTable
            headers={['Config Key', 'Example Value', 'Purpose']}
            rows={[
              ['contentfulGraphQLBase', 'https://graphql.contentful.com/content/v1/spaces/', 'Contentful GraphQL base URL'],
              ['contentfulSpace', '02gclfesbluk', 'Contentful space ID'],
              ['contentfulEnvironment', 'dev | uat | master', 'Contentful environment (maps to git branches)'],
              ['contentfulDeliveryToken', 'Bearer token', 'Read-only access to published content'],
              ['contentfulPreviewToken', 'Bearer token', 'Access to draft + published content'],
            ]}
          />
        </RenderingStep>
      </section>

      {/* ============ STEP 4: GRAPHQL QUERY ============ */}
      <section id="graphql-query" style={sectionSpacing}>
        <SectionHeader label="Step 4" title="The GraphQL Query" description="The exact query sent to Contentful to fetch the ownership page data" />
        <motion.div {...fadeUp}>
          <div style={filePathStyle}>UI/src/global-components/CmsComponents/LandingPage/landingPageQuery.contentful.ts</div>
          <p style={para}>
            This is the complete GraphQL query. It uses <strong>fragments</strong> to organize each section's data requirements.
            The main query fetches a <code>LandingPage</code> by title and spreads all section fragments.
          </p>
          <CodeBlock language="graphql" code={`# Main query - fetches the landing page by title
query LandingPage($landingPageTitle: String!) {
  landingPageCollection(
    limit: 1
    where: { landingPageTitle: $landingPageTitle }  # "My Driveway Landing Page"
  ) {
    items {
      ...LandingPage   # Spreads ALL section fragments below
    }
  }
}

# The LandingPage fragment combines all sections
fragment LandingPage on LandingPage {
  ...LandingPageSeoSection
  ...LandingPageHeroSection
  ...LandingPageListIconSection
  ...LandingPageContentListSection
  ...LandingPageContentListWCardSection
  ...LandingPageAccordionSection
  ...LandingPageCardsSection
  ...LandingPageFooterSection
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Hero Section Fragment</h3>
          <p style={para}>
            Each section fragment defines exactly what data to fetch from Contentful. The hero section fetches up to 7 items
            that can be <code>CustomImage</code>, <code>ShortText</code>, or <code>Cta</code> types. The <code>__typename</code>
            field is used for runtime type discrimination.
          </p>
          <CodeBlock language="graphql" code={`fragment LandingPageHeroSection on LandingPage {
  heroSectionCollection(limit: 7) {
    items {
      ... on CustomImage {      # Hero image
        __typename
        title
        image { description, url, width, height }
      }
      ... on ShortText {        # Title, subtitle, description
        __typename
        internalName            # "title", "subtitle", or "description"
        text                    # The actual text content
      }
      ... on Cta {              # Primary and secondary CTAs
        __typename
        variant                 # "primary", "secondary", or "tertiary"
        link { title, url }     # Button label and destination
      }
    }
  }
}`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Contentful Content Model</h3>
          <MermaidViewer title="LandingPage Content Model" tabs={[{ label: 'Content Model', source: mermaidContentfulModel }]} />
        </motion.div>
      </section>

      {/* ============ STEP 5: CMS DATA GUARD ============ */}
      <section id="data-guard" style={sectionSpacing}>
        <SectionHeader label="Step 5" title="CmsDataGuard" description="The safety net that validates CMS data before rendering" />

        <RenderingStep number={5} title="Data Validation Component" file="UI/src/util/cmsData/CmsDataGuard.tsx" color={c.red}>
          <p style={para}>
            CmsDataGuard is a <strong>render-props component</strong> that acts as a safety net. It validates the CMS data
            is non-null and non-empty before passing it to the child render function. If data is invalid, it either shows
            a fallback component or redirects to the error route.
          </p>
          <CodeBlock language="tsx" code={`export const CmsDataGuard = <T,>({
  children,    // Render function: (data: T) => ReactNode
  data,        // The CMS data to validate
  errorRoute = "/404",
  fallback,    // Optional fallback component
}: CmsDataGuardProps<T>) => {
  const router = useRouter();

  // Validation: non-null, is object, has keys
  const isValid = useMemo(
    () =>
      data != null &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      Object.keys(data).length > 0,
    [data],
  );

  // Redirect to 404 if no fallback provided
  useEffect(() => {
    if (!isValid && fallback == null) {
      router.push(errorRoute);
    }
  }, [isValid, fallback, router, errorRoute]);

  // Show fallback if provided
  if (!isValid && fallback != null) {
    return <>{fallback}</>;
  }

  if (!isValid) {
    return null;  // Will redirect via useEffect
  }

  // Data is valid -- render the children with typed data
  return <>{children(data as T)}</>;
};`} />
          <Callout type="info" title="Why CmsDataGuard?">
            Contentful API calls can fail (network errors, invalid tokens, missing entries). CmsDataGuard ensures
            the page never crashes from null/undefined CMS data. It provides <strong>graceful degradation</strong>
            by redirecting to 404 or showing a fallback UI.
          </Callout>
        </RenderingStep>
      </section>

      {/* ============ STEP 6: PAGE COMPONENT ============ */}
      <section id="page-component" style={sectionSpacing}>
        <SectionHeader label="Step 6" title="OwnershipPage Component" description="The page component that orchestrates all section renderings" />

        <RenderingStep number={6} title="Page Layout Orchestrator" file="UI/src/ownership/pages/OwnershipPage.tsx" color={c.accent}>
          <p style={para}>
            This is the <strong>composition layer</strong>. It receives the validated <code>pageData</code>,
            destructures the 4 section collections, and passes each to its corresponding section component
            along with page-specific image sizes and styles.
          </p>
          <CodeBlock language="tsx" code={`import {
  CardsSection,
  ContentListSection,
  HeroSection,
  ListIconSection,
} from "global-components/CmsComponents/LandingPage/PageSections";
import { ownerShipHeroImageSizes } from "./imageSizes/HeroSection.imageSizes";
import { benefitsImageSizes } from "./imageSizes/Benefits.imageSizes";
import { everythingYoyNeedimageSizes } from "./imageSizes/EverythingYouNeed.imageSizes";
import { learnMoneImageSizes } from "./imageSizes/LearnMore.imageSizes";
import useHeroStyles from "./styles/HeroSection.styles";

const OwnershipPage = ({ pageData }: PageProps) => {
  // Destructure the 4 section collections from Contentful data
  const {
    heroSectionCollection,          // Hero banner content
    listIconSectionCollection,      // Benefits section with icons
    contentListSectionCollection,   // Features checklist
    cardsSectionCollection,         // Learn more cards
  } = pageData || {};

  const { classes: heroSectionStyles } = useHeroStyles();

  return (
    <>
      {/* Section 1: Hero banner with title, subtitle, image, CTAs */}
      <HeroSection
        data={heroSectionCollection}
        imageSizes={ownerShipHeroImageSizes}
        classNames={heroSectionStyles}
      />
      {/* Section 2: Benefits with icons list */}
      <ListIconSection
        data={listIconSectionCollection}
        imageSizes={benefitsImageSizes}
      />
      {/* Section 3: Feature checklist with image */}
      <ContentListSection
        data={contentListSectionCollection}
        imageSizes={everythingYoyNeedimageSizes}
      />
      {/* Section 4: Learn more image cards */}
      <CardsSection
        data={cardsSectionCollection}
        imageSizes={learnMoneImageSizes}
      />
    </>
  );
};`} />
        </RenderingStep>
      </section>

      {/* ============ SECTION RENDERING ============ */}
      <section id="section-rendering" style={sectionSpacing}>
        <SectionHeader label="Step 7" title="Section Component Rendering" description="How each section component transforms Contentful data into React elements" />
        <motion.div {...fadeUp}>
          <p style={para}>
            Every section component follows the same pattern: <strong>receive collection data</strong> from Contentful,
            <strong> filter by type</strong> using type guards, <strong>convert</strong> to clean props using utility functions,
            and <strong>render</strong> with shared CMS components. Here's that pattern visualized:
          </p>
          <CodeBlock language="text" code={`Section Component Internal Flow:
=======================================

1. Receive: data = heroSectionCollection  (raw Contentful items array)
                    |
2. Filter:  items.filter(isCustomImage)  --> images[]
            items.filter(isShortText)    --> texts[]
            items.filter(isCta)          --> ctas[]
                    |
3. Extract: texts.find(name.includes("title"))     --> "Welcome to Ownership"
            texts.find(name.includes("subtitle"))   --> "Your car, your way"
            images[0]                                --> { url, width, height }
            ctas.find(variant === "primary")         --> { link: { title, url } }
                    |
4. Convert: getShortText(text)      --> "Welcome to Ownership"
            getCustomImage(image)   --> { url, alt, details: { width, height } }
            getCta(cta)             --> { variant, link: { title, url } }
                    |
5. Render:  <CmsShortTextComponent variant="h1">{title}</CmsShortTextComponent>
            <CmsCustomImageComponent image={heroImage} sizes={imageSizes} />
            <CmsCtaComponent data={primaryCta} onClick={handleClick} />`} />
        </motion.div>
      </section>

      {/* ============ HERO SECTION DEEP DIVE ============ */}
      <section id="hero-section" style={sectionSpacing}>
        <SectionHeader label="Deep Dive" title="HeroSection Component" description="The most complex section -- with auth-aware CTAs and responsive images" />

        <motion.div {...fadeUp}>
          <div style={filePathStyle}>UI/src/global-components/CmsComponents/LandingPage/PageSections/HeroSection/HeroSection.tsx</div>
          <p style={para}>
            The HeroSection is the most complex section component. It handles title/subtitle/description extraction,
            responsive hero images, and <strong>auth-aware CTA buttons</strong> that trigger Auth0 sign-up when the user is not logged in.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Data Extraction: heroSectionDataToProps</h3>
          <CodeBlock language="tsx" code={`export const heroSectionDataToProps = (
  heroSectionCollection: HeroSectionCollection,
): HeroSectionDataProps => {
  const items: HeroSectionItems = heroSectionCollection?.items || [];

  // 1. Filter items by __typename using type guards
  const images = filterByType<CustomImage>(items, isCustomImage);
  const ctas = filterByType<Cta>(items, isCta);
  const texts = filterByType<ShortText>(items, isShortText);

  // 2. Find specific items by internalName convention
  const heroCtaBtn = ctas.find(
    (cta) => cta?.variant === "primary" || cta?.variant === "secondary",
  );
  const tertiaryCta = ctas.find((cta) => cta?.variant === "tertiary");

  // 3. Convert to clean, typed props
  return {
    title: getShortText(
      texts.find((item) => item?.internalName?.toLowerCase().includes("title")),
    ),
    subtitle: getShortText(
      texts.find((item) => item?.internalName?.toLowerCase().includes("subtitle")),
    ),
    description: getShortText(
      texts.find((item) => item?.internalName?.toLowerCase().includes("description")),
    ),
    heroImage: getCustomImage(images.find((item) => item)),
    primaryCta: getCta(heroCtaBtn),
    secondaryCta: getCta(tertiaryCta),
  };
};`} />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>Auth-Aware CTA Flow</h3>
          <MermaidViewer title="CTA Authentication Flow" tabs={[{ label: 'Auth Flow', source: mermaidAuthFlow }]} />
          <div style={spacer}>
            <CodeBlock language="tsx" code={`// Inside HeroSection component
const { isAuthenticated, logIn, signUp } = useLoggedInUser();

const handleCtaClick = (url: string, callback?: Function) => {
  if (!isAuthenticated) {
    // User not logged in: trigger Auth0 sign-up
    callback?.({
      appState: {
        returnTo: url,                    // Redirect here after auth
        signUpPlay: Play.Dealership,      // Track sign-up source
      },
    });
  } else {
    // User is logged in: navigate directly
    router.push(url);
  }
};

// Primary CTA -> signUp, Secondary CTA -> logIn
const onPrimaryClick = (url: string) => handleCtaClick(url, signUp);
const onSecondaryClick = (url: string) => handleCtaClick(url, logIn);`} />
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>HeroSection JSX Rendering</h3>
          <CodeBlock language="tsx" code={`return (
  <PageSection classNames={{ ...classes, ...classNames }}>
    {/* Text content */}
    <Box className={classes.heroContent}>
      <Box className={classes.titleWrapper}>
        <CmsShortTextComponent variant="h1">{title}</CmsShortTextComponent>
        <CmsShortTextComponent variant="h1" className={classes.subTitle}>
          {subtitle}
        </CmsShortTextComponent>
      </Box>
      {description && (
        <CmsShortTextComponent variant="bodyLead">{description}</CmsShortTextComponent>
      )}
    </Box>

    {/* Primary CTA button */}
    <CmsCtaComponent
      data={primaryCta}
      borderless
      onClick={() => onPrimaryClick(primaryUrl)}
    />

    {/* Secondary CTA (optional: "or Log In") */}
    {secondaryCta && (
      <Box className={classes.tertiaryActionWrapper}>
        <CmsShortTextComponent variant="body">or</CmsShortTextComponent>
        <CmsCtaComponent
          data={secondaryCta}
          onDark={buttonOnDark}
          onClick={() => onSecondaryClick(secondaryUrl)}
        />
      </Box>
    )}

    {/* Hero image */}
    {heroImage && (
      <Box className={classes.imageContainer}>
        <CmsCustomImageComponent image={heroImage} sizes={imageSizes} />
        {gradientBackground && <Box className={classes.gradient} />}
      </Box>
    )}
  </PageSection>
);`} />
        </motion.div>
      </section>

      {/* ============ LIST ICON SECTION ============ */}
      <section id="list-icon-section" style={sectionSpacing}>
        <SectionHeader label="Section 2" title="ListIconSection" description="Benefits section with icon + heading + description list items" />
        <motion.div {...fadeUp}>
          <div style={filePathStyle}>UI/src/global-components/CmsComponents/LandingPage/PageSections/ListIconSection/ListIconSection.tsx</div>
          <p style={para}>
            Renders a section with a title, description, custom image, and a list of benefit items (each with an icon, heading, and description).
            Also has an auth-aware CTA button.
          </p>
          <CodeBlock language="tsx" code={`// Data extraction follows the same pattern
const { title, description, image, cta, listIcons } = useMemo(
  () => listIconSectionDataToProps(data),
  [data],
);

// Rendering
return (
  <PageSection>
    <Box className={classes.content}>
      <Box className={classes.titleWrapper}>
        <ShortTextCmsComponent variant="h2">{title}</ShortTextCmsComponent>
        <ShortTextCmsComponent variant="bodyLead">{description}</ShortTextCmsComponent>
      </Box>
      <CustomImageCmsComponent image={image} sizes={imageSizes} />
    </Box>
    {/* Renders each icon + heading + description item */}
    <ListIconHeadingAndDescription list={listIcons} titleVariant={titleVariant} />
    <CtaCmsComponent data={cta} onClick={handleCtaClick} />
  </PageSection>
);`} />
        </motion.div>
      </section>

      {/* ============ CONTENT LIST SECTION ============ */}
      <section id="content-list-section" style={sectionSpacing}>
        <SectionHeader label="Section 3" title="ContentListSection" description="Feature checklist with image and content items" />
        <motion.div {...fadeUp}>
          <div style={filePathStyle}>UI/src/global-components/CmsComponents/LandingPage/PageSections/ContentListSection/ContentListSection.tsx</div>
          <p style={para}>
            Renders a section with an optional eyebrow text, title, description, image, and a content list.
            The content list items can be plain text (<code>ShortText</code>) or text with links (<code>TextWithLink</code>).
          </p>
          <DataTable
            headers={['Content Type', 'Contentful Model', 'Renders As']}
            rows={[
              ['Plain text item', 'ShortText', 'Checkmark + text'],
              ['Text with link', 'TextWithLink', 'Prefix text + hyperlink + suffix text'],
              ['Image', 'CustomImage', 'Responsive WebP image'],
              ['CTA', 'Cta', 'Auth-aware button'],
            ]}
          />
        </motion.div>
      </section>

      {/* ============ CARDS SECTION ============ */}
      <section id="cards-section" style={sectionSpacing}>
        <SectionHeader label="Section 4" title="CardsSection" description="Learn more cards with images and click-through navigation" />
        <motion.div {...fadeUp}>
          <div style={filePathStyle}>UI/src/global-components/CmsComponents/LandingPage/PageSections/CardsSection/CardsSection.tsx</div>
          <CodeBlock language="tsx" code={`const CardsSection = ({ data, imageSizes, classNames, handleImageClick }: CardsSectionProps) => {
  const { title, description, imageCards } = useMemo(
    () => cardsSectionDataToProps(data),
    [data],
  );
  const router = useRouter();

  const handleCardClick = (imageCard: ImageCardFields) => {
    const url = imageCard.cta?.link?.url;
    if (url) {
      handleImageClick?.(imageCard.title, imageCard.cta?.link?.title || "");
      router.push(url);  // Navigate to card's destination
    }
  };

  return (
    <PageSection>
      <Box className={classes.titleWrapper}>
        <ShortTextCmsComponent variant="h3">{title}</ShortTextCmsComponent>
        <ShortTextCmsComponent variant="body">{description}</ShortTextCmsComponent>
      </Box>
      <Box className={classes.imagesWrapper}>
        {imageCards.map((imageCard, index) => (
          <ImageCardCmsComponent
            data={imageCard}
            sizes={imageSizes}
            key={index}
            onClick={() => handleCardClick(imageCard)}
          />
        ))}
      </Box>
    </PageSection>
  );
};`} />
        </motion.div>
      </section>

      {/* ============ TYPE GUARDS ============ */}
      <section id="type-guards" style={sectionSpacing}>
        <SectionHeader label="Utilities" title="Type Guards & Filters" description="How polymorphic Contentful items are filtered into typed arrays" />
        <motion.div {...fadeUp}>
          <p style={para}>
            Contentful collections contain <strong>mixed types</strong> (CustomImage, ShortText, Cta all in the same array).
            Type guards use the <code>__typename</code> field from GraphQL to discriminate between types at runtime.
          </p>
          <CodeBlock language="tsx" code={`// Generic filter utility
// UI/src/util/cmsData/sectionTypeFilter.ts
export const filterByType = <U>(
  items: unknown[],
  typeGuard: (item: unknown) => item is U,
): U[] => {
  return items.filter(typeGuard);
};

// Type guards use __typename from GraphQL
// UI/src/models/type-guards/generic-guards.ts
export const isShortText = (item: unknown): item is ShortText =>
  (item as any)?.__typename === "ShortText";

export const isCustomImage = (item: unknown): item is CustomImage =>
  (item as any)?.__typename === "CustomImage";

export const isCta = (item: unknown): item is Cta =>
  (item as any)?.__typename === "Cta";

export const isImageCard = (item: unknown): item is ImageCard =>
  (item as any)?.__typename === "ImageCard";

export const isListItemIconHeadingAndDescription = (item: unknown): item is ListItemIconHeadingAndDescription =>
  (item as any)?.__typename === "ListItemIconHeadingAndDescription";`} />
          <CodeBlock language="tsx" code={`// Usage in a section component:
const items = heroSectionCollection?.items || [];

// Filter the mixed array into typed arrays
const images = filterByType<CustomImage>(items, isCustomImage);
// images: CustomImage[] -- only CustomImage items

const texts = filterByType<ShortText>(items, isShortText);
// texts: ShortText[] -- only ShortText items

const ctas = filterByType<Cta>(items, isCta);
// ctas: Cta[] -- only Cta items`} />
        </motion.div>
      </section>

      {/* ============ DATA CONVERSION ============ */}
      <section id="data-conversion" style={sectionSpacing}>
        <SectionHeader label="Utilities" title="Data Conversion" description="How raw Contentful types are converted to component-friendly props" />
        <motion.div {...fadeUp}>
          <div style={filePathStyle}>UI/src/models/util/convert-content.ts</div>
          <p style={para}>
            After filtering, items are converted from raw Contentful types to clean application types.
            These utilities handle null safety and provide sensible defaults.
          </p>
          <CodeBlock language="tsx" code={`// Convert a Contentful ShortText to a plain string
// UI/src/models/util/getContent.ts
export const getShortText = (item?: ShortText | null): string => {
  return item?.text || "";
};

// Convert a Contentful CustomImage to application image type
// UI/src/models/util/convert-content.ts
export const getCustomImage = (item?: CustomImage | null): AssetFields => ({
  url: item?.image?.url || "",
  alt: item?.image?.description || item?.title || "",
  details: {
    width: item?.image?.width || 0,
    height: item?.image?.height || 0,
  },
});

// Convert a Contentful Cta to application CTA type
export const getCta = (item?: Cta | null): CTAFieldsGQL => ({
  variant: item?.variant || "primary",
  link: {
    title: item?.link?.title || "",
    url: item?.link?.url || "",
  },
});

// Convert a list of icon+heading+description items
export const getListItemsIconHeadingAndDescription = (
  items: ListItemIconHeadingAndDescription[],
): ListItemIconContent[] =>
  items.map((item) => ({
    heading: item?.heading || "",
    description: item?.description || "",
    icon: {
      url: item?.icon?.url || "",
      alt: item?.icon?.description || "",
    },
  }));`} />
        </motion.div>
      </section>

      {/* ============ IMAGE HANDLING ============ */}
      <section id="image-handling" style={sectionSpacing}>
        <SectionHeader label="Images" title="Responsive Image Handling" description="How images are served at the right size for each breakpoint" />
        <motion.div {...fadeUp}>
          <div style={filePathStyle}>UI/src/ownership/pages/imageSizes/HeroSection.imageSizes.ts</div>
          <p style={para}>
            Each section has its own image size configuration that defines the width and height at every breakpoint.
            The <code>CmsCustomImageComponent</code> uses these to generate responsive <code>srcset</code> attributes for optimized loading.
          </p>
          <CodeBlock language="tsx" code={`// Responsive image sizes for the ownership hero section
export const ownerShipHeroImageSizes: SizesByBPType = {
  xs:  { width: 273, height: 219 },
  sm:  { width: 353, height: 283 },
  md:  { width: 468, height: 375 },
  lg:  { width: 596, height: 478 },
  xl:  { width: 643, height: 516 },
  xxl: { width: 732, height: 587 },
};

// CmsCustomImageComponent wraps @lad/component-library's WebpImage
// UI/src/global-components/CmsComponents/CustomImage/CustomImage.tsx
const CmsCustomImageComponent = ({ image, sizes, className }) => (
  <WebpImage
    image={{
      alt: image.alt,
      url: image.url,
      details: image.details,
    }}
    sizes={sizes}        // Responsive breakpoint sizes
    className={className}
  />
);`} />
          <DataTable
            headers={['Breakpoint', 'Width', 'Height', 'Typical Device']}
            rows={[
              ['xs', '273px', '219px', 'Small phones'],
              ['sm', '353px', '283px', 'Large phones'],
              ['md', '468px', '375px', 'Tablets'],
              ['lg', '596px', '478px', 'Small laptops'],
              ['xl', '643px', '516px', 'Desktops'],
              ['xxl', '732px', '587px', 'Large screens'],
            ]}
          />
        </motion.div>
      </section>

      {/* ============ CONTENTFUL MODEL ============ */}
      <section id="contentful-model" style={sectionSpacing}>
        <SectionHeader label="CMS" title="Contentful Content Model" description="The LandingPage content type structure in Contentful" />
        <motion.div {...fadeUp}>
          <p style={para}>
            In Contentful, the <code>LandingPage</code> content type has multiple <strong>Reference (many)</strong> fields,
            each acting as a collection that can hold different content types. This polymorphic pattern is why we need
            type guards to discriminate between items.
          </p>
          <DataTable
            headers={['Field Name', 'Type', 'Allowed Content Types', 'Limit']}
            rows={[
              ['heroSectionCollection', 'Reference (many)', 'CustomImage, ShortText, Cta', '7'],
              ['listIconSectionCollection', 'Reference (many)', 'ShortText, CustomImage, ListItemIconHeadingAndDescription, Cta', '8'],
              ['contentListSectionCollection', 'Reference (many)', 'CustomImage, ShortText, ContentList, Cta', '7'],
              ['cardsSectionCollection', 'Reference (many)', 'ShortText, ImageCard', '4'],
              ['accordionSectionCollection', 'Reference (many)', 'ShortText, Accordion, Link', '5'],
              ['footerSectionCollection', 'Reference (many)', 'ShortText, Link, BusinessHours', '6'],
              ['seo', 'Reference (one)', 'Seo', '1'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <h3 style={subHeading}>ShortText Naming Convention</h3>
          <p style={para}>
            ShortText entries use the <code>internalName</code> field as a semantic key. The section components
            use string matching to find the right text for each position:
          </p>
          <DataTable
            headers={['internalName Contains', 'Constant', 'Used For']}
            rows={[
              ['"title"', 'CMS_TITLE_TYPE', 'Main section heading (h1, h2, h3)'],
              ['"subtitle"', 'CMS_SUBTITLE_TYPE', 'Secondary heading'],
              ['"description"', 'CMS_DESCRIPTION_TYPE', 'Body text below title'],
              ['"eyebrow"', 'CMS_EYEBROW_TYPE', 'Small label above title'],
            ]}
          />
          <CodeBlock language="tsx" code={`// How text extraction works:
// UI/src/global-components/CmsComponents/LandingPage/PageSections/constants.ts
export const CMS_TITLE_TYPE = "title";
export const CMS_SUBTITLE_TYPE = "subtitle";
export const CMS_DESCRIPTION_TYPE = "description";
export const CMS_EYEBROW_TYPE = "eyebrow";

// In a section's dataToProps function:
title: getShortText(
  texts.find((item) =>
    item?.internalName?.toLowerCase().includes(CMS_TITLE_TYPE)
  ),
),
// If internalName is "Ownership Hero Title" -> includes("title") = true`} />
        </motion.div>
      </section>

      {/* ============ ENVIRONMENT CONFIG ============ */}
      <section id="environment-config" style={sectionSpacing}>
        <SectionHeader label="Config" title="Environment Configuration" description="How Contentful connects across dev, UAT, and production" />
        <motion.div {...fadeUp}>
          <DataTable
            headers={['Environment', 'Contentful Env', 'Token Type', 'Content']}
            rows={[
              ['Local (dev)', 'dev', 'Preview Token', 'Draft + Published'],
              ['DEV cluster', 'dev', 'Delivery Token', 'Published only'],
              ['UAT cluster', 'uat', 'Delivery Token', 'Published only'],
              ['Production', 'master', 'Delivery Token', 'Published only'],
              ['Preview Mode', 'Any', 'Preview Token', 'Draft + Published'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <CodeBlock language="bash" code={`# .env configuration
NEXT_PUBLIC_CONTENTFUL_GRAPHQL_BASE="https://graphql.contentful.com/content/v1/spaces/"
NEXT_PUBLIC_CONTENTFUL_SPACE="02gclfesbluk"
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT="dev"     # "dev" | "uat" | "master"
NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN="..."  # Published content only
NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN="..."   # Draft + published content

# Full API URL constructed as:
# https://graphql.contentful.com/content/v1/spaces/02gclfesbluk/environments/dev`} />
        </motion.div>
      </section>

      {/* ============ FILE MAP ============ */}
      <section id="file-map" style={sectionSpacing}>
        <SectionHeader label="Reference" title="Complete File Map" description="Every file involved in rendering the /ownership page" />
        <motion.div {...fadeUp}>
          <DataTable
            headers={['File', 'Role', 'Key Export']}
            rows={[
              ['pages/ownership/index.tsx', 'Route entry + getStaticProps', 'Ownership, getStaticProps'],
              ['ownership/pages/OwnershipPage.tsx', 'Page composition layer', 'OwnershipPage'],
              ['ownership/pages/pageProps/getOwnershipPageStaticProps.tsx', 'SSG config', 'getOwnershipPageStaticProps'],
              ['util/cmsData/getBasicCMSPageStaticProps.ts', 'Generic SSG factory', 'getBasicCMSPageStaticProps'],
              ['util/cmsData/fetchCmsData.ts', 'HTTP fetch to Contentful', 'fetchCmsData'],
              ['util/cmsData/CmsDataGuard.tsx', 'Data validation guard', 'CmsDataGuard'],
              ['CmsComponents/LandingPage/landingPageQuery.contentful.ts', 'GraphQL query', 'landingPageQuery'],
              ['CmsComponents/LandingPage/landingPageQuery.contentful.generated.ts', 'Auto-generated types', 'LandingPageFragment'],
              ['PageSections/HeroSection/HeroSection.tsx', 'Hero section renderer', 'HeroSection'],
              ['PageSections/ListIconSection/ListIconSection.tsx', 'Benefits section renderer', 'ListIconSection'],
              ['PageSections/ContentListSection/ContentListSection.tsx', 'Feature list renderer', 'ContentListSection'],
              ['PageSections/CardsSection/CardsSection.tsx', 'Cards grid renderer', 'CardsSection'],
              ['PageSections/constants.ts', 'CMS naming constants', 'CMS_TITLE_TYPE, etc.'],
              ['PageSections/types.ts', 'Shared types', 'LandingPageData'],
              ['util/cmsData/sectionTypeFilter.ts', 'Type filter utility', 'filterByType'],
              ['models/type-guards/generic-guards.ts', 'Type guards', 'isShortText, isCta, isCustomImage'],
              ['models/util/convert-content.ts', 'Data converters', 'getCta, getCustomImage'],
              ['models/util/getContent.ts', 'Text extractor', 'getShortText'],
              ['CmsComponents/CustomImage/CustomImage.tsx', 'Image renderer', 'CmsCustomImageComponent'],
              ['CmsComponents/ShortText/', 'Text renderer', 'CmsShortTextComponent'],
              ['CmsComponents/Cta/', 'CTA button renderer', 'CmsCtaComponent'],
              ['CmsComponents/PageSectionWrapper/', 'Layout wrapper', 'PageSection'],
              ['ownership/pages/imageSizes/*.ts', 'Responsive image configs', 'ownerShipHeroImageSizes, etc.'],
              ['ownership/pages/styles/HeroSection.styles.tsx', 'Custom hero styles', 'useHeroStyles'],
            ]}
          />
        </motion.div>

        <motion.div {...fadeUp} style={spacer}>
          <Callout type="success" title="That's the full pipeline!">
            You now understand how the <code>/ownership</code> page goes from a Contentful entry to a fully rendered React page:
            <strong> Route</strong> {'->'} <strong>getStaticProps</strong> {'->'} <strong>fetchCmsData (GraphQL)</strong> {'->'} <strong>CmsDataGuard</strong> {'->'} <strong>OwnershipPage</strong> {'->'} <strong>Section Components</strong> {'->'} <strong>CMS Sub-Components</strong>.
            The same pattern is reused for Dealership and DFC landing pages.
          </Callout>
        </motion.div>
      </section>
    </>
  );
}
