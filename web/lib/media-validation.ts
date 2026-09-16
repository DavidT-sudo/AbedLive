import sharp from "sharp";

/** Formats we'll actually store and serve. Keeps out HEIC/TIFF/BMP/raw
 * camera formats that browsers can't render directly, and anything sharp
 * can't decode (corrupt or mislabeled files). */
const ACCEPTED_FORMATS = ["jpeg", "png", "webp", "gif"] as const;
type AcceptedFormat = (typeof ACCEPTED_FORMATS)[number];

export const ACCEPTED_IMAGE_FORMATS_LABEL = "JPG, PNG, WebP, or GIF";
export const ACCEPTED_IMAGE_ACCEPT_ATTR =
  "image/jpeg,image/png,image/webp,image/gif";
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export class MediaValidationError extends Error {}

/**
 * Sniffs the real image bytes (never trusts the browser-supplied MIME type
 * or file extension) so a mislabeled or corrupt upload — e.g. an iPhone
 * HEIC saved with a .jpg extension — is rejected with a clear reason
 * instead of being stored and silently failing to render on the site.
 */
export async function validateImage(
  buffer: Buffer,
  fileName: string
): Promise<{ contentType: string; width: number | null; height: number | null }> {
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new MediaValidationError(
      `"${fileName}" is too large (${(buffer.byteLength / 1024 / 1024).toFixed(1)}MB). Max size is ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`
    );
  }

  let format: string | undefined;
  let width: number | undefined;
  let height: number | undefined;
  try {
    const meta = await sharp(buffer).metadata();
    format = meta.format;
    width = meta.width;
    height = meta.height;
  } catch {
    throw new MediaValidationError(
      `"${fileName}" couldn't be read as an image — it may be corrupted or an unsupported format. Accepted formats: ${ACCEPTED_IMAGE_FORMATS_LABEL}.`
    );
  }

  if (!format || !ACCEPTED_FORMATS.includes(format as AcceptedFormat)) {
    throw new MediaValidationError(
      `"${fileName}" is a${format ? ` .${format}` : "n unrecognized"} file, which browsers can't reliably display. Accepted formats: ${ACCEPTED_IMAGE_FORMATS_LABEL}.`
    );
  }

  return {
    contentType: `image/${format}`,
    width: width ?? null,
    height: height ?? null,
  };
}
