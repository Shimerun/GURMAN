import { FEATURES } from '../../config/business';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { getSeason } from '../../lib/seasons';

const PARTICLE_COUNT = 12;

/** One drawing per season (16×16), in the brand palette. @type {Record<import('../../lib/seasons').Season, import('react').ReactNode[]>} */
const SEASON_SHAPES = {
  winter: [
    <circle key="flake" cx="8" cy="8" r="3" className="fill-white" />,
    <path
      key="star"
      d="M8 1.5v13M2.4 4.75l11.2 6.5M2.4 11.25l11.2-6.5"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      className="stroke-white"
    />,
  ],
  spring: [
    <ellipse key="petal" cx="8" cy="8" rx="3.2" ry="5.5" className="fill-amber-50" />,
    <ellipse key="petal-warm" cx="8" cy="8" rx="3" ry="5" className="fill-amber-100" />,
  ],
  summer: [
    <path key="sparkle" d="M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6z" className="fill-amber-300" />,
    <circle key="glow" cx="8" cy="8" r="2.4" className="fill-amber-200" />,
  ],
  // The logo's leaf in autumn colours.
  autumn: [
    <path key="leaf-orange" d="M8 15c-4-4.4-4-10.6 0-14 4 3.4 4 9.6 0 14z" className="fill-amber-400" />,
    <path key="leaf-rust" d="M8 15c-4-4.4-4-10.6 0-14 4 3.4 4 9.6 0 14z" className="fill-amber-600" />,
    <path key="leaf-green" d="M8 15c-4-4.4-4-10.6 0-14 4 3.4 4 9.6 0 14z" className="fill-emerald-300" />,
  ],
};

/**
 * Decorative particles drifting over the home banner: snow in winter, petals in spring, sparkles
 * in summer, leaves in autumn. Each particle's lane, speed and delay come from index.css
 * (`.seasonal-particle:nth-child(n)`), so the markup stays free of inline styles.
 */
export default function SeasonalParticles() {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (!FEATURES.seasonalDecor || prefersReducedMotion) return null;

  const season = getSeason();
  const shapes = SEASON_SHAPES[season];

  return (
    <div data-season={season} className="seasonal-particles pointer-events-none absolute inset-0 -z-[5] overflow-hidden" aria-hidden="true">
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <span key={index} className="seasonal-particle">
          <svg viewBox="0 0 16 16" focusable="false">
            {shapes[index % shapes.length]}
          </svg>
        </span>
      ))}
    </div>
  );
}
