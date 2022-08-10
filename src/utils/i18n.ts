export function getLocale() {
  return window.navigator.language.replace(/\-/g, '_');
}
