export function mapMimeToFileType(
  mime: string,
): "pdf" | "png" | "jpg" | "doc" | "docx" | null {
  const map: Record<string, "pdf" | "png" | "jpg" | "doc" | "docx"> = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
  };

  return map[mime] ?? null;
}
