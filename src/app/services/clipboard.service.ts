export class ClipboardService {
  static copyToClipboard(toCopy: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = toCopy;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
  }
}
