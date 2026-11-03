// ---------------------------------------------------------------------------
// The one schema.org ScholarlyArticle node for the technical report.
//
// Two pages describe the report: /research/ (the hub) and /research/paper/
// (the HTML copy). Both build their node here so the report has a single @id
// and a single set of fields, and the two pages cannot drift apart.
// The canonical @id lives on the HTML copy: https://openmuscle.org/research/paper/#article
// ---------------------------------------------------------------------------
import research from './research.json';

const isSet = (v: unknown): v is string =>
  typeof v === 'string' && v.trim() !== '' && v.trim() !== 'TODO';
const doiUrl = (v: string) => (v.startsWith('http') ? v : `https://doi.org/${v}`);

export const reportKeywords = ['force myography', 'wearable', 'prosthetics', 'hand pose', 'ESP32'];

const REPORT_PATH = '/research/paper/';
const DATASET_PATH = '/research/';

export const reportNodeId = (site: URL) => `${new URL(REPORT_PATH, site).href}#article`;
export const datasetNodeId = (site: URL) => `${new URL(DATASET_PATH, site).href}#dataset`;

type ReportNodeOptions = {
  site: URL;
  /** True once the PDF exists in public/ (or research.paperPdf is an absolute URL). */
  pdfLive: boolean;
  /** From the paper.md frontmatter, for example "v0.2". */
  reportVersion: string;
  /** From the paper.md frontmatter, ISO date. */
  reportDate: string;
};

export function buildReportNode({ site, pdfLive, reportVersion, reportDate }: ReportNodeOptions) {
  const origin = site.origin;
  const c = research.citation;
  const orcid = isSet(research.orcid) ? research.orcid : null;
  const paperDoi = isSet(research.paperDoi) ? research.paperDoi : null;
  const reportUrl = new URL(REPORT_PATH, site).href;
  const pdfUrl = pdfLive ? new URL(research.paperPdf, site).href : null;

  return {
    '@type': 'ScholarlyArticle',
    '@id': reportNodeId(site),
    headline: c.title,
    name: `${c.title} (technical report ${reportVersion})`,
    description:
      'Pairs low-cost 60-cell forearm force-myography bracelets with consumer VR hand tracking as an automatic labeler, releases a two-wearer dataset, and reports baselines under a four-rung generalization ladder from random split to across wearers.',
    url: reportUrl,
    mainEntityOfPage: reportUrl,
    inLanguage: 'en',
    keywords: reportKeywords,
    version: reportVersion.replace(/^v/, ''),
    datePublished: reportDate,
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      ...(orcid && { '@id': orcid, sameAs: orcid }),
      name: `${c.authorGiven} ${c.authorFamily}`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'OpenMuscle',
      url: `${origin}/`,
    },
    about: { '@id': datasetNodeId(site) },
    ...(pdfUrl && {
      encoding: {
        '@type': 'MediaObject',
        contentUrl: pdfUrl,
        encodingFormat: 'application/pdf',
      },
    }),
    ...(paperDoi && { identifier: doiUrl(paperDoi), sameAs: doiUrl(paperDoi) }),
  };
}
