// Rehype plugin for the HTML copy of the technical report (src/pages/research/paper.md).
// It changes only the markup, never the text:
//   1. Tables are wrapped in a focusable, horizontally scrollable container so
//      wide tables scroll inside the page instead of widening it on a phone.
//   2. An image that sits alone in a paragraph becomes a <figure> whose
//      <figcaption> repeats the image's alt text (the report writes its figure
//      captions there). PNG files in public/ also get width and height
//      attributes so the page does not jump while images load.
//   3. The report's three header lines (Author, Report, Artifacts) are written on
//      consecutive lines with no blank line between them. Markdown joins those
//      into one paragraph, so a line break is inserted before each label. The
//      PDF renderer in OpenMuscle-Software applies the same rule.
import fs from 'node:fs';
import path from 'node:path';

const HEADER_LABEL = /^(Author|Report|Artifacts):/;

const isElement = (node, tagName) =>
  node && node.type === 'element' && (tagName === undefined || node.tagName === tagName);

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

function pngSize(src) {
  if (typeof src !== 'string' || !src.startsWith('/') || !src.endsWith('.png')) return null;
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', src));
    if (buf.length < 24 || buf.toString('latin1', 1, 4) !== 'PNG') return null;
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

function wrapTable(table) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['table-scroll'],
      role: 'region',
      ariaLabel: 'Table, scrolls sideways on narrow screens',
      tabIndex: 0,
    },
    children: [table],
  };
}

function asFigure(paragraph) {
  const meaningful = paragraph.children.filter(
    (child) => !(child.type === 'text' && child.value.trim() === '')
  );
  if (meaningful.length !== 1 || !isElement(meaningful[0], 'img')) return paragraph;

  const img = meaningful[0];
  const size = pngSize(img.properties?.src);
  img.properties = {
    ...img.properties,
    loading: 'lazy',
    decoding: 'async',
    ...(size && size),
  };
  const caption = String(img.properties.alt ?? '').trim();
  return {
    type: 'element',
    tagName: 'figure',
    properties: {},
    children: [
      img,
      ...(caption
        ? [{ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: caption }] }]
        : []),
    ],
  };
}

function transform(node) {
  if (!Array.isArray(node.children)) return;
  const out = [];
  node.children.forEach((child, i) => {
    transform(child);

    const next = node.children[i + 1];
    if (
      child.type === 'text' &&
      child.value.endsWith('\n') &&
      isElement(next, 'strong') &&
      HEADER_LABEL.test(textOf(next))
    ) {
      out.push({ ...child, value: child.value.slice(0, -1) });
      out.push({ type: 'element', tagName: 'br', properties: {}, children: [] });
      return;
    }

    if (isElement(child, 'table')) out.push(wrapTable(child));
    else if (isElement(child, 'p')) out.push(asFigure(child));
    else out.push(child);
  });
  node.children = out;
}

export default function rehypePaper() {
  return (tree) => transform(tree);
}
