export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "TimeSpot",
        "description": "Track time across multiple time zones with TimeSpot. A beautiful world clock app featuring real-time updates, weather information, and support for cities worldwide.",
        "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Real-time world clock",
            "Multiple time zone support",
            "Weather information",
            "12/24 hour format toggle",
            "Responsive design"
        ]
    };

    return (
        <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}