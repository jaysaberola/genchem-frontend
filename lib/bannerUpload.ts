export const BANNER_MAX_BYTES = 20 * 1024 * 1024;

export function formatBannerMaxSize(): string {
  return "20MB";
}

export function validateBannerFile(file: File): string | null {
  if (file.size > BANNER_MAX_BYTES) {
    return `"${file.name}" is too large. Maximum banner image size is ${formatBannerMaxSize()}.`;
  }
  return null;
}

export function filterValidBannerFiles(files: File[]): {
  accepted: File[];
  errors: string[];
} {
  const accepted: File[] = [];
  const errors: string[] = [];

  files.forEach((file) => {
    const error = validateBannerFile(file);
    if (error) errors.push(error);
    else accepted.push(file);
  });

  return { accepted, errors };
}
