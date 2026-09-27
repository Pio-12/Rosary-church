import type { SVGProps } from "react";

export interface LatinCrossProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * LatinCross component
 *
 * Renders a canonical Latin cross (crux ordinaria) SVG vector with proportional arms:
 * - Upper vertical arm: ~4.75 units
 * - Left & right horizontal arms: ~6.25 units each
 * - Lower vertical stem: ~12.75 units
 * - Uniform beam width: 2.5 units
 *
 * Designed to inherit text color via `fill="currentColor"` and inherit sizing via
 * `width="1em"` / `height="1em"` (or an explicit `size` prop).
 * Sits cleanly within a standard 24x24 icon viewBox.
 */
export function LatinCross({
  size,
  className,
  style,
  ...props
}: LatinCrossProps) {
  const dimension = size ?? "1em";

  return (
    <svg
      viewBox="0 0 24 24"
      width={dimension}
      height={dimension}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <path d="M10.75 2h2.5v4.75h6.25v2.5h-6.25v12.75h-2.5V9.25H4.5v-2.5h6.25V2z" />
    </svg>
  );
}

export default LatinCross;
