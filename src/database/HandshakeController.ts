/** A single inventory line item (one of the 2,000 expected records). */
export interface InventoryLine {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  category: string;
}

/** Metadata for one of the 250 asset PDF files. */
export interface AssetPdf {
  id: string;
  title: string;
  filePath: string;
  sizeBytes: number;
}

/** One of the 250 layout theme configurations. */
export interface LayoutTheme {
  id: string;
  name: string;
  primaryColor: string;
  fontFamily: string;
  logoUrl: string;
}

/** Aggregated bulk-data payload that the controller maps to an e-commerce endpoint. */
export interface BulkDataPayload {
  inventoryLines: InventoryLine[];
  assetPdfs: AssetPdf[];
  layoutThemes: LayoutTheme[];
}

/** Target e-commerce endpoint descriptor. */
export interface EcommerceEndpointConfig {
  baseUrl: string;
  apiKey: string;
  catalogPath: string;
  assetPath: string;
  themePath: string;
}

/**
 * HandshakeController
 *
 * Optimized for bulk-data streams.  Accepts the combined payload of
 * up to 2,000 inventory lines, 250 asset PDFs, and 250 layout themes,
 * validates sizing constraints, and maps every record to the correct
 * sub-path of a target e-commerce endpoint configuration — entirely
 * within the local machine, without touching any external cloud layer.
 */
export class HandshakeController {
  static readonly MAX_INVENTORY_LINES = 2_000;
  static readonly MAX_ASSET_PDFS = 250;
  static readonly MAX_LAYOUT_THEMES = 250;

  constructor(private readonly endpoint: EcommerceEndpointConfig) {}

  /**
   * Validate that the payload respects the bulk-stream limits.
   * Throws a descriptive error when a limit is exceeded.
   */
  private validatePayload(payload: BulkDataPayload): void {
    if (payload.inventoryLines.length > HandshakeController.MAX_INVENTORY_LINES) {
      throw new Error(
        `Inventory lines exceed maximum (${HandshakeController.MAX_INVENTORY_LINES}): received ${payload.inventoryLines.length}`
      );
    }
    if (payload.assetPdfs.length > HandshakeController.MAX_ASSET_PDFS) {
      throw new Error(
        `Asset PDFs exceed maximum (${HandshakeController.MAX_ASSET_PDFS}): received ${payload.assetPdfs.length}`
      );
    }
    if (payload.layoutThemes.length > HandshakeController.MAX_LAYOUT_THEMES) {
      throw new Error(
        `Layout themes exceed maximum (${HandshakeController.MAX_LAYOUT_THEMES}): received ${payload.layoutThemes.length}`
      );
    }
  }

  /**
   * Map the bulk-data payload to a structured set of endpoint-relative URLs
   * that a downstream sync process would submit to the e-commerce platform.
   */
  mapToEndpoint(payload: BulkDataPayload): MappedEndpointRoutes {
    this.validatePayload(payload);

    const { baseUrl, catalogPath, assetPath, themePath } = this.endpoint;

    return {
      inventoryTargetUrl: `${baseUrl}${catalogPath}/inventory`,
      assetTargetUrl: `${baseUrl}${assetPath}/pdfs`,
      themeTargetUrl: `${baseUrl}${themePath}/layouts`,
      recordCounts: {
        inventory: payload.inventoryLines.length,
        assets: payload.assetPdfs.length,
        themes: payload.layoutThemes.length,
      },
    };
  }
}

/** Result produced by {@link HandshakeController.mapToEndpoint}. */
export interface MappedEndpointRoutes {
  inventoryTargetUrl: string;
  assetTargetUrl: string;
  themeTargetUrl: string;
  recordCounts: {
    inventory: number;
    assets: number;
    themes: number;
  };
}
