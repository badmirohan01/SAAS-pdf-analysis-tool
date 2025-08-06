export const PDF_PROCESSING = {
  MAX_LENGTH: 10000,
  WORKER_SRC: "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.54/build/pdf.worker.min.mjs",
};

export const RATE_LIMIT = {
  REQUESTS_PER_MINUTE: 5,
  CACHE_MAX_SIZE: 1000,
  CACHE_TTL_MS: 60*1000,
}