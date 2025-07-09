import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model, width, height, seed, nologo, enhance, private: isPrivate, safe, transparent, image, referrer, temperature } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const token = process.env.POLLINATIONS_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    // Build query params
    const params = new URLSearchParams();
    if (model) params.append('model', model);
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    if (seed !== undefined && seed !== '') params.append('seed', seed);
    if (nologo !== undefined) params.append('nologo', nologo ? 'true' : 'false');
    if (enhance) params.append('enhance', 'true');
    if (isPrivate) params.append('private', 'true');
    if (safe) params.append('safe', 'true');
    if (transparent && model === 'gptimage') params.append('transparent', 'true');
    if (image) params.append('image', image);
    if (referrer) params.append('referrer', referrer);
    if (temperature !== undefined) params.append('temperature', temperature);

    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;

    const imageResponse = await fetch(pollinationsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'AI-ArtGen/1.0'
      }
    });

    if (!imageResponse.ok) {
      throw new Error(`Pollinations API error: ${imageResponse.status}`);
    }

    // Get the image URL from the response
    const imageUrl = imageResponse.url;

    return NextResponse.json({
      imageUrl,
      prompt,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}