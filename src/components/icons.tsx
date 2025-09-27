import type { SVGProps } from 'react';

export function CivicSolveLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="1em"
        height="1em"
        {...props}
    >
        <g fill="currentColor" transform="translate(50 50)">
            <g transform="rotate(0)">
                <path d="M 0 -45 C 15 -45, 15 -10, 0 -10 C -15 -10, -15 -45, 0 -45" fill="#66BB6A" />
            </g>
            <g transform="rotate(60)">
                <path d="M 0 -45 C 15 -45, 15 -10, 0 -10 C -15 -10, -15 -45, 0 -45" fill="#81C784" />
            </g>
            <g transform="rotate(120)">
                <path d="M 0 -45 C 15 -45, 15 -10, 0 -10 C -15 -10, -15 -45, 0 -45" fill="#A5D6A7" />
            </g>
            <g transform="rotate(180)">
                <path d="M 0 -45 C 15 -45, 15 -10, 0 -10 C -15 -10, -15 -45, 0 -45" fill="#66BB6A" />
            </g>
            <g transform="rotate(240)">
                <path d="M 0 -45 C 15 -45, 15 -10, 0 -10 C -15 -10, -15 -45, 0 -45" fill="#81C784" />
            </g>
            <g transform="rotate(300)">
                <path d="M 0 -45 C 15 -45, 15 -10, 0 -10 C -15 -10, -15 -45, 0 -45" fill="#A5D6A7" />
            </g>
        </g>
    </svg>
  );
}
