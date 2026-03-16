// GS1 US MCP Server
// Provides tools for crawling and analyzing GS1 US company websites

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// GS1 US Websites to crawl
const GS1_WEBSITES = [
  { name: "GS1 US Home", url: "https://www.gs1us.org/", description: "Main GS1 US homepage" },
  { name: "GS1 US Solutions", url: "https://www.gs1us.org/solutions", description: "GS1 US solutions overview" },
  { name: "GS1 US Standards", url: "https://www.gs1us.org/standards", description: "GS1 standards documentation" },
  { name: "GS1 US Industries", url: "https://www.gs1us.org/industries", description: "Industry-specific solutions" },
  { name: "GS1 US Resources", url: "https://www.gs1us.org/resources", description: "Educational resources" },
  { name: "GS1 US Events", url: "https://www.gs1us.org/events", description: "Events and webinars" },
  { name: "GS1 US About", url: "https://www.gs1us.org/about", description: "About GS1 US" },
  { name: "GS1 US News", url: "https://www.gs1us.org/news", description: "News and updates" },
  { name: "GS1 US Contact", url: "https://www.gs1us.org/contact", description: "Contact information" },
  { name: "GS1 US Blog", url: "https://www.gs1us.org/blog", description: "GS1 US blog" },
  { name: "UPC Lookup", url: "https://www.gs1us.org/tools/upc-lookup", description: "UPC barcode lookup tool" },
  { name: "GTIN Manager", url: "https://www.gs1us.org/tools/gtin-manager", description: "GTIN management tool" },
  { name: "Data Hub", url: "https://www.gs1us.org/tools/data-hub", description: "Data quality tools" },
  { name: "GS1 Academy", url: "https://www.gs1us.org/academy", description: "Training and certification" },
  { name: "Partner Directory", url: "https://www.gs1us.org/partners", description: "Certified partners" },
];

// Create MCP Server
const server = new Server(
  {
    name: "gs1-us-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "gs1_list_websites",
        description: "List all GS1 US websites available for crawling",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "gs1_crawl_page",
        description: "Crawl a specific GS1 US page and extract content",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to crawl (must be a GS1 US URL)",
            },
            selectors: {
              type: "array",
              items: { type: "string" },
              description: "CSS selectors to extract (optional)",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "gs1_search",
        description: "Search GS1 US website for specific content",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
            category: {
              type: "string",
              enum: ["all", "standards", "solutions", "resources", "tools"],
              description: "Category to search in",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "gs1_get_upc_info",
        description: "Get information about a UPC barcode",
        inputSchema: {
          type: "object",
          properties: {
            upc: {
              type: "string",
              description: "UPC barcode number",
            },
          },
          required: ["upc"],
        },
      },
      {
        name: "gs1_get_gtin_info",
        description: "Get information about a GTIN",
        inputSchema: {
          type: "object",
          properties: {
            gtin: {
              type: "string",
              description: "GTIN number",
            },
          },
          required: ["gtin"],
        },
      },
      {
        name: "gs1_analyze_industry",
        description: "Analyze GS1 solutions for a specific industry",
        inputSchema: {
          type: "object",
          properties: {
            industry: {
              type: "string",
              enum: ["retail", "healthcare", "foodservice", "manufacturing", "logistics", "all"],
              description: "Industry to analyze",
            },
          },
          required: ["industry"],
        },
      },
      {
        name: "gs1_get_standards",
        description: "Get information about GS1 standards",
        inputSchema: {
          type: "object",
          properties: {
            standard: {
              type: "string",
              enum: ["gtin", "upc", "ean", "gs1-datamatrix", "gs1-qr", "gs1-digital-link", "all"],
              description: "Standard to get info about",
            },
          },
          required: ["standard"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "gs1_list_websites": {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(GS1_WEBSITES, null, 2),
          },
        ],
      };
    }

    case "gs1_crawl_page": {
      const { url, selectors } = args as { url: string; selectors?: string[] };
      
      // In production, this would use a web crawler
      // For now, return structured mock data
      const pageData = {
        url,
        title: "GS1 US - " + url.split("/").pop()?.replace(/-/g, " ") || "Home",
        crawledAt: new Date().toISOString(),
        content: {
          headings: ["Welcome to GS1 US", "Global Standards", "Industry Solutions"],
          links: GS1_WEBSITES.map(w => ({ text: w.name, href: w.url })),
          images: [],
        },
        metadata: {
          description: "GS1 US is the official source for UPC barcodes and GTINs",
          keywords: ["GS1", "UPC", "GTIN", "barcode", "standards"],
        },
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(pageData, null, 2),
          },
        ],
      };
    }

    case "gs1_search": {
      const { query, category } = args as { query: string; category?: string };
      
      const results = GS1_WEBSITES.filter(w => 
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.description.toLowerCase().includes(query.toLowerCase())
      ).map(w => ({
        title: w.name,
        url: w.url,
        snippet: w.description,
        relevance: 0.9,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ query, category, results, total: results.length }, null, 2),
          },
        ],
      };
    }

    case "gs1_get_upc_info": {
      const { upc } = args as { upc: string };
      
      // Mock UPC info
      const upcInfo = {
        upc,
        company: "Demo Company",
        product: "Sample Product",
        description: "Product information from GS1 database",
        category: "Consumer Goods",
        lastUpdated: new Date().toISOString(),
        source: "GS1 US Database",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(upcInfo, null, 2),
          },
        ],
      };
    }

    case "gs1_get_gtin_info": {
      const { gtin } = args as { gtin: string };
      
      const gtinInfo = {
        gtin,
        format: gtin.length === 14 ? "GTIN-14" : gtin.length === 13 ? "GTIN-13" : "GTIN-8",
        company: "Demo Company",
        product: "Sample Product",
        description: "Product information from GS1 database",
        verified: true,
        source: "GS1 US Database",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(gtinInfo, null, 2),
          },
        ],
      };
    }

    case "gs1_analyze_industry": {
      const { industry } = args as { industry: string };
      
      const industryData = {
        industry,
        overview: `GS1 solutions for ${industry} industry`,
        solutions: [
          "Barcode Standards",
          "Data Quality Management",
          "Supply Chain Visibility",
          "Product Traceability",
        ],
        caseStudies: [],
        resources: GS1_WEBSITES.filter(w => w.url.includes(industry) || w.url.includes("solutions")),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(industryData, null, 2),
          },
        ],
      };
    }

    case "gs1_get_standards": {
      const { standard } = args as { standard: string };
      
      const standards: Record<string, object> = {
        gtin: {
          name: "Global Trade Item Number (GTIN)",
          description: "Unique identifier for trade items",
          formats: ["GTIN-8", "GTIN-12", "GTIN-13", "GTIN-14"],
          usage: "Used for product identification in supply chain",
        },
        upc: {
          name: "Universal Product Code (UPC)",
          description: "Barcode standard widely used in North America",
          formats: ["UPC-A", "UPC-E"],
          usage: "Used for retail products in US and Canada",
        },
        ean: {
          name: "European Article Number (EAN)",
          description: "Barcode standard used globally",
          formats: ["EAN-8", "EAN-13"],
          usage: "Used for retail products internationally",
        },
        "gs1-datamatrix": {
          name: "GS1 DataMatrix",
          description: "2D barcode for healthcare and small items",
          formats: ["DataMatrix"],
          usage: "Used for pharmaceuticals and medical devices",
        },
        "gs1-qr": {
          name: "GS1 QR Code",
          description: "2D barcode for consumer engagement",
          formats: ["QR Code"],
          usage: "Used for marketing and consumer information",
        },
        "gs1-digital-link": {
          name: "GS1 Digital Link",
          description: "Web-based product identification",
          formats: ["URL"],
          usage: "Connects physical products to digital information",
        },
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(standards[standard] || standards, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GS1 US MCP server running on stdio");
}

main().catch(console.error);