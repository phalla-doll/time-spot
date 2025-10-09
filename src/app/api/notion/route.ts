import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// Expected environment variables:
// - NOTION_API_KEY: a Notion internal integration token
// - NOTION_DATABASE_ID: the database where submissions should be inserted

const notionApiKey = process.env.NOTION_API_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

if (!notionApiKey) {
    // eslint-disable-next-line no-console
    console.warn("NOTION_API_KEY is not set. /api/notion will return 500.");
}

if (!notionDatabaseId) {
    // eslint-disable-next-line no-console
    console.warn("NOTION_DATABASE_ID is not set. /api/notion will return 500.");
}

const notion = new Client({ auth: notionApiKey });

type CreateSubmissionBody = {
    name?: string;
    contact?: string;
};

export async function POST(request: Request) {
    if (!notionApiKey || !notionDatabaseId) {
        return NextResponse.json(
            { error: "Server is misconfigured: missing Notion env vars" },
            { status: 500 },
        );
    }

    let body: CreateSubmissionBody;
    try {
        body = (await request.json()) as CreateSubmissionBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = (body.name || "").trim();
    const contact = (body.contact || "").trim();

    if (!name || !contact) {
        return NextResponse.json(
            { error: "'name' and 'contact' are required" },
            { status: 400 },
        );
    }

    try {
        const created = await notion.pages.create({
            parent: { database_id: notionDatabaseId },
            properties: {
                // Adjust property names and types to match your Notion database schema
                name: {
                    rich_text: [
                        {
                            text: { content: name },
                        },
                    ],
                },
                contact: {
                    rich_text: [
                        {
                            text: { content: contact },
                        },
                    ],
                }
            },
        });

        return NextResponse.json(
            { id: created.id, url: (created as any).url },
            { status: 201 },
        );
    } catch (error) {
        // Capture detailed Notion error info for easier debugging locally
        const err = error as unknown as { status?: number; code?: string; message?: string; body?: unknown };
        // eslint-disable-next-line no-console
        console.error("Failed to create Notion page", {
            status: err?.status,
            code: err?.code,
            message: err?.message,
            body: err?.body,
        });

        const isProd = process.env.NODE_ENV === "production";
        const clientMessage = isProd
            ? { error: "Failed to create Notion page" }
            : {
                    error: "Failed to create Notion page",
                    details: {
                        status: err?.status,
                        code: err?.code,
                        message: err?.message,
                    },
                };

        return NextResponse.json(clientMessage, { status: 500 });
    }
}


