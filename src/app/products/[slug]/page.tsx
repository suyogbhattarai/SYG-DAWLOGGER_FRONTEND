import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

interface Props {
    params: { slug: string };
}

// Next.js dynamic metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = params;

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/products/${slug}/`, { next: { revalidate: 3600 } });
        const product = await response.json();

        if (!product || product.detail === 'Not found.') {
            return {
                title: 'Item Not Found | Dawlogger',
            };
        }

        return {
            title: product.name,
            description: product.meta_description || product.description?.substring(0, 160) || "",
            keywords: product.meta_keywords || "music production, dawlogger",
            openGraph: {
                title: product.name,
                description: product.meta_description || product.description?.substring(0, 160) || "",
                images: product.primary_image ? [product.primary_image] : [],
            },
        };
    } catch (error) {
        return {
            title: 'Items | Dawlogger',
        };
    }
}

async function getProduct(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/products/${slug}/`, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    return response.json();
}

export default async function ProductPage({ params }: Props) {
    return (
        <>
            <ProductDetailClient />
        </>
    );
}
