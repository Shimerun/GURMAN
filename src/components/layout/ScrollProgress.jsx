/**
 * Reading progress on long pages: an orange swoosh across the top that grows with the scroll.
 * Pure CSS (`animation-timeline: scroll()`); browsers without it simply don't show the bar.
 */
export default function ScrollProgress() {
  return <div aria-hidden="true" className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[45] hidden h-1" />;
}
