export default function HamburgerMenu() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      className="bg-white text-[#212121] rounded-full p-2 transition-colors duration-300 hover:bg-gray-200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3,12H21M9,18H21M3,6H15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
