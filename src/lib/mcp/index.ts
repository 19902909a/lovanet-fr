import { defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import listShopProductsTool from "./tools/list-shop-products";
import listShopCategoriesTool from "./tools/list-shop-categories";
import searchShopProductsTool from "./tools/search-shop-products";

export default defineMcp({
  name: "lovanet-mcp",
  title: "Lovanet MCP",
  version: "0.1.0",
  instructions:
    "Tools exposing the public Lovanet catalog. Use `echo` to test connectivity, `list_shop_categories` to discover categories, `list_shop_products` to browse products, and `search_shop_products` to search by keyword, price, source, type, stock, and category.",
  tools: [echoTool, listShopCategoriesTool, listShopProductsTool, searchShopProductsTool],
});