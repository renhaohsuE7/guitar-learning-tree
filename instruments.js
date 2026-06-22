// Single source of truth for the instruments shown on the landing page
// and in each instrument page's nav bar. Add a new instrument here +
// one data-<id>.js + one <id>.html to extend the site.
const INSTRUMENTS = [
  { id: 'guitar', label: '電吉他', emoji: '🎸', page: 'guitar.html' },
  { id: 'drum',   label: '鼓',     emoji: '🥁', page: 'drum.html'   },
  { id: 'bass',   label: '貝斯',   emoji: '🎵', page: 'bass.html'   },
];
