import { NextRequest, NextResponse } from 'next/server';
import Post from '@/models/Posts'
import { revalidatePath } from "next/cache";

// GET handler to fetch posts with pagination
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const authorId = searchParams.get('author');

        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};
        if (authorId) {
            query.author = authorId;
        }

        // Fetch posts with author information
        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'name email')
            .lean();

        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST handler to create a new post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { content, author, authorId } = body;

        const post = await Post.create({ content, author, authorId });

        revalidatePath("/");

        return NextResponse.json({ post }, { status: 200 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
} 