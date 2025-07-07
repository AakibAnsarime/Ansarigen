import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

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

    // Generate image using Pollinations AI
    const imageResponse = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}`, {
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