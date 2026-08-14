export function restoreSelection(savedSelection: Range | null) {
  const selection = window.getSelection();
  if (savedSelection && selection) {
    selection.removeAllRanges();
    selection.addRange(savedSelection);
  }
}
