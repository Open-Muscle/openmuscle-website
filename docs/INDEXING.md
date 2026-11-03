# Indexing checklist

Steps to get openmuscle.org, the dataset and the paper found by search engines, AI crawlers and researchers. Items 1 to 3 are one-time setup; the rest follow as things get published.

The code side is done: sitemap (`/sitemap-index.xml`), `robots.txt`, `llms.txt`, `llms-full.txt`, canonical and social tags, and JSON-LD on every page (the `Dataset` and `ScholarlyArticle` nodes are on `/research/`).

## Before merging to main

- [ ] Put the paper PDF at `public/papers/openmuscle-fmg-dataset-v0.2.pdf`. Until that file exists the page shows "coming soon" for the PDF and leaves it out of the JSON-LD; once it exists the link appears on the next build, no edit needed.
- [ ] After the deploy, open https://openmuscle.org/robots.txt, https://openmuscle.org/sitemap-index.xml, https://openmuscle.org/llms.txt and https://openmuscle.org/research/ (view source, search for `application/ld+json`).

## 1. Google Search Console

- [ ] Add the property at https://search.google.com/search-console (choose "Domain", `openmuscle.org`). Verification is a DNS TXT record: add the `google-site-verification=...` value as an extra value in the existing `@` TXT record set in the Azure DNS zone, and leave the SPF and Microsoft 365 values untouched. If you would rather not touch DNS, add a "URL prefix" property for `https://openmuscle.org/` and verify by dropping Google's HTML file into `public/`.
- [ ] Submit the sitemap at https://search.google.com/search-console/sitemaps with the value `sitemap-index.xml`.
- [ ] Request indexing for `https://openmuscle.org/` and `https://openmuscle.org/research/` with the URL inspection box at the top of Search Console.

## 2. Bing and IndexNow

- [ ] At https://www.bing.com/webmasters choose "Import from Google Search Console" (no second DNS step).
- [ ] IndexNow (Bing, Yandex and others): generate a key at https://www.bing.com/indexnow, save it as `public/<key>.txt` containing only the key, deploy, then ping with `curl "https://api.indexnow.org/indexnow?url=https://openmuscle.org/research/&key=<key>"`. Repeat for any page that changes.

## 3. Google Dataset Search

- [ ] There is no submission form. It reads the `Dataset` JSON-LD on https://openmuscle.org/research/. Test it at https://search.google.com/test/rich-results and https://validator.schema.org/ (paste the URL), fix any errors, then wait; first appearance can take days to weeks. Check by searching "OpenMuscle" at https://datasetsearch.research.google.com/.
- [ ] Requirements are listed at https://developers.google.com/search/docs/appearance/structured-data/dataset (name, description of 50+ characters, license, creator, distribution; all present).

## 4. ORCID

- [ ] At https://orcid.org/my-orcid add three works (Works, then Add, then Add manually): the website https://openmuscle.org (type Website), the dataset https://github.com/Open-Muscle/OpenMuscle-Dataset (type Data set), and the paper (type Preprint, link https://openmuscle.org/research/ until a DOI exists).

## 5. After the DOIs exist

- [ ] Mint DOIs (for example with Zenodo's GitHub integration at https://zenodo.org/account/settings/github/ for the dataset repo, and a Zenodo upload for the PDF).
- [ ] Fill `src/data/research.json`: `datasetDoi`, `paperDoi`, and `datasetHf` once the Hugging Face copy is live. Each `TODO` flips to a real link and the BibTeX swaps `note = {DOI pending}` for `doi = {...}` on the next build.
- [ ] Update the two hand-written files that cannot read the JSON: `public/llms.txt` and `public/llms-full.txt` (the "DOI pending" lines and the BibTeX block), and add the new links to the ORCID works.

## Optional

- [ ] The social preview image is `public/images/backgrounds/hero-render.png`, set as `DEFAULT_IMAGE` in `src/layouts/BaseLayout.astro`. A purpose-made 1200 x 630 card would crop better; swap the constant when you have one.
