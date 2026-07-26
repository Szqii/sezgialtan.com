/**
 * Sets `data-theme` before first paint so the page never flashes the wrong
 * palette. Has to be an inline script in <head> — anything React renders is
 * already too late.
 */

/*
 * Light-first: the site is designed light, so a returning visitor's explicit
 * choice is honoured but everyone else gets light regardless of their OS
 * setting. Dark is opt-in via the toggle, not something the system picks.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    document.documentElement.setAttribute(
      'data-theme',
      stored === 'dark' ? 'dark' : 'light'
    );
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
