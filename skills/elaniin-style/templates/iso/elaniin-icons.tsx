import { forwardRef } from "react";
import {
  createLucideIcon,
  type IconNode,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/*
  The three official Elaniin icons (DESIGN.md section 7, Icons): the icons of the Elaniin solutions and of the AI detail. The
  path data is the one of public/assets/icons/elaniin-*.svg (24px grid, 1.5px stroke in the system, round caps and joins);
  the color of the files is replaced by currentColor. They are built with createLucideIcon, so they have the same
  interface as a Lucide icon (size, strokeWidth, className, x, y, width, height...) and IconBox and IsoPill take them as they are.

  FIT: the files use the whole 24 cell (Lucide leaves 2 of margin), so at the same size they looked about 10% bigger than every
  other icon. Each shape is drawn at 90% around the center of the cell (live area 2.2 to 21.8) and the stroke is divided by the same
  factor, so the line keeps the weight of the system (1.5 in the 24 grid) and the icon matches the Lucide ones.
*/
const FIT = 0.9;
const SHIFT = (24 * (1 - FIT)) / 2;

function official(name: string, node: IconNode): LucideIcon {
  const Base = createLucideIcon(
    name,
    node.map(([tag, attrs]) => [
      tag,
      { ...attrs, transform: `translate(${SHIFT} ${SHIFT}) scale(${FIT})` },
    ]),
  );
  const Icon = forwardRef<SVGSVGElement, LucideProps>(
    ({ strokeWidth = 1.5, ...props }, ref) => (
      <Base ref={ref} strokeWidth={Number(strokeWidth) / FIT} {...props} />
    ),
  );
  Icon.displayName = name;
  return Icon;
}
const softwareDevelopment: IconNode = [
  [
    "path",
    {
      d: "M11.45565,20.43749H2.74597c-.90191,0-1.63306-.73112-1.63306-1.63306V4.65122c0-.90191.73115-1.63306,1.63306-1.63306h18.50805c.90194,0,1.63306.73115,1.63306,1.63306v8.1013",
      key: "k1",
    },
  ],
  [
    "path",
    {
      d: "M1.11291,4.65122c0-.90191.73115-1.63306,1.63306-1.63306h18.50805c.90194,0,1.63306.73115,1.63306,1.63306v4.89919H1.11291v-4.89919Z",
      key: "k2",
    },
  ],
  [
    "path",
    { d: "M17.44354,16.62701l-2.17742,2.17742,2.17742,2.17742", key: "k3" },
  ],
  [
    "path",
    { d: "M20.70967,16.62701l2.17742,2.17742-2.17742,2.17742", key: "k4" },
  ],
  [
    "circle",
    {
      cx: "4.37904",
      cy: "6.28428",
      r: "1.08871",
      fill: "currentColor",
      stroke: "none",
      key: "k5",
    },
  ],
  [
    "circle",
    {
      cx: "7.64516",
      cy: "6.28428",
      r: "1.08871",
      fill: "currentColor",
      stroke: "none",
      key: "k6",
    },
  ],
];

const ai: IconNode = [
  [
    "path",
    {
      d: "M22.05207,6.61549c.11928-.63552.78663-.99076,1.06599-1.54763.3386-.61124-.20197-1.30246-.79918-1.48163-.53031-.17595-1.14858-.10411-1.6439-.38782-.82549-.42769-1.96398-2.06035-3.14283-1.5593-.61947.3517-.40187,1.16133-.50372,1.75181-.08313.75068-.851,1.17083-1.31618,1.63272-.29529.28627-.45413.74932-.27283,1.14037.21626.47694.77672.78047,1.28493.81026.57101.02465,1.19599.09605,1.71245.37413,1.03315.51011,1.59878,1.6886,2.77097,1.77957,1.15536.05338.72515-1.58531.84232-2.50213l.00198-.01034Z",
      key: "k1",
    },
  ],
  [
    "path",
    {
      d: "M14.75014,17.20484c.24914-1.32745,1.64308-2.06947,2.22659-3.23262.70726-1.27673-.42187-2.72053-1.6693-3.09478-1.10768-.36751-2.39911-.21746-3.43371-.81007-1.72425-.89335-4.10229-4.30359-6.56462-3.25701-1.29393.73461-.8394,2.42574-1.05215,3.65911-.17364,1.568-1.77753,2.44558-2.74919,3.41037-.61679.59795-.94858,1.56515-.56988,2.38195.45171.99622,1.62238,1.63021,2.68392,1.69244,1.1927.05149,2.49814.20063,3.57691.78147,2.15801,1.0655,3.33947,3.52708,5.78789,3.7171,2.41327.1115,1.51466-3.31133,1.75941-5.22635l.00413-.02161Z",
      key: "k2",
    },
  ],
];

const cloud: IconNode = [
  [
    "path",
    {
      d: "M5.94772,17.50207c-1.83403,0-4.95187-.82531-4.95187-4.12655,0-3.85145,3.85145-4.67676,4.95187-4.67676.55021-1.92573,1.65062-4.95187,6.05228-4.95187,3.85145,0,5.50207,2.20083,6.05228,4.12655,0,0,4.95187.55021,4.95187,5.22697,0,3.30124-2.75104,4.40166-4.95187,4.40166h-7.15269",
      key: "k1",
    },
  ],
  [
    "path",
    { d: "M13.65062,14.75104l-2.75104,2.75104,2.75104,2.75104", key: "k2" },
  ],
];

export const SoftwareDevelopmentIcon = official(
  "elaniin-software-development",
  softwareDevelopment,
);
export const AiIcon = official("elaniin-ai", ai);
export const CloudIcon = official("elaniin-cloud", cloud);
