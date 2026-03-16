import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent } from '../../lib/analyzer';
import { parseHTML } from '../../lib/parsers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return NextResponse.json({ error: 'URL must use http or https protocol' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the page
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StopSlop/1.0; Content Grader)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.status} ${response.statusText}` }, { status: 400 });
    }

    const html = await response.text();
    const parsed = parseHTML(html);

    if (!parsed.text || parsed.text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from the URL' }, { status: 400 });
    }

    const result = analyzeContent(parsed);

    return NextResponse.json({
      result,
      source: 'url',
      url: parsedUrl.toString(),
      documentText: parsed.text,
      paragraphs: parsed.paragraphs,
      headings: parsed.headings,
    });
  } catch (err) {
    console.error('Analyze URL error:', err);
    return NextResponse.json({ error: 'Failed to analyze URL' }, { status: 500 });
  }
}
