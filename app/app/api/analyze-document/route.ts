import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent } from '../../lib/analyzer';
import { parseText, parseHTML } from '../../lib/parsers';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buffer);

    let parsed;
    if (ext === 'html' || ext === 'htm') {
      parsed = parseHTML(text);
    } else {
      // .txt, .md, and fallback
      parsed = parseText(text, fileName);
    }

    if (!parsed.text || parsed.text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from the file' }, { status: 400 });
    }

    const result = analyzeContent(parsed);

    return NextResponse.json({
      result,
      source: 'document',
      fileName,
      documentText: parsed.text,
      paragraphs: parsed.paragraphs,
      headings: parsed.headings,
    });
  } catch (err) {
    console.error('Analyze document error:', err);
    return NextResponse.json({ error: 'Failed to analyze document' }, { status: 500 });
  }
}
