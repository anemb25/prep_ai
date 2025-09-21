// WHY: pdf-parse ships no TypeScript types; this makes TS accept the import.
declare module "pdf-parse" {
  const pdfParse: (dataBuffer: Buffer | ArrayBuffer) => Promise<{ text: string }>;
  export default pdfParse;
}
