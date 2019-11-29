export class ClipboardService {
  static copyToClipboard(toCopy: string): void {
    const create_copy = (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', toCopy);
      e.preventDefault();
    };
    document.addEventListener('copy', create_copy);
    document.execCommand('copy');
    document.removeEventListener('copy', create_copy);
  }
}
