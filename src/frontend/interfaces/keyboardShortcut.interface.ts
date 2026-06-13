export interface UseKeyboardShortcutArgs {
  key: string;
  onKeyPressed: () => void;
  disabled?: boolean;
}