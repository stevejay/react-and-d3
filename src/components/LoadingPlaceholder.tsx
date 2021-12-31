const circumference = 282.74;

export const LoadingPlaceholder = () => (
  <div
    role="progressbar"
    aria-valuetext="Loading page content"
    aria-busy={true}
    className="flex items-center justify-center w-full h-48"
  >
    <svg
      role="presentation"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 animate-spin"
    >
      <circle
        cx={50}
        cy={50}
        r={45}
        strokeWidth={8}
        fill="none"
        stroke="currentColor"
        className="text-slate-600"
      />
      <circle
        cx={50}
        cy={50}
        r={45}
        strokeWidth={8}
        fill="none"
        stroke="currentColor"
        className="text-slate-400"
        strokeDashoffset={0.25 * circumference}
        strokeDasharray={`${0.25 * circumference} ${circumference - 0.25 * circumference}`}
      />
    </svg>
  </div>
);
