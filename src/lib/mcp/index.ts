import { defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import listShopProductsTool from "./tools/list-shop-products";
import listShopCategoriesTool from "./tools/list-shop-categories";

export default defineMcp({
  name: "lovanet-mcp",
  title: "Lovanet MCP",
  version: "0.1.0",
  instructions:
    "Tools exposing the public Lovanet catalog. Use `echo` to test connectivity, `list_shop_categories` to discover categories, and `list_shop_products` to browse products (optionally filtered by category).",
  tools: [echoTool, listShopCategoriesTool, listShopProductsTool],
});