/**
 * SEO metadata and schema utilities.
 * These are plain JS objects suitable for use in Server Components.
 */

export function generateLocalBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Dawlogger",
        "image": "https://dawlogger.com/logo.png",
        "description": "Unified creative workflow for music producers. Intelligent version control and collaboration platform.",
        "url": "https://dawlogger.com"
    };
}

export function generateProductSchema(product: any) {
    if (!product) return null;
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.primary_image,
        "description": product.description,
        "sku": product.id?.toString() || "N/A",
        "brand": {
            "@type": "Brand",
            "name": "Dawlogger"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://dawlogger.com/products/${product.slug}`,
            "priceCurrency": "USD",
            "price": product.base_price,
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.average_rating || "5",
            "reviewCount": product.review_count || "1"
        }
    };
}
