type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

const iconPaths: Record<string, string[]> = {
  route: ["M4 18c4 0 4-12 8-12s4 12 8 12", "M4 6h.01", "M20 18h.01"],
  search: ["m21 21-4.35-4.35", "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"],
  luggage: ["M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M6 7h12v13H6Z", "M9 20v2", "M15 20v2"],
  directions_car: ["M5 13h14l-1.5-5h-11Z", "M7 17h.01", "M17 17h.01", "M6 13v6", "M18 13v6"],
  notifications: ["M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M10 21h4"],
  person: ["M20 21a8 8 0 0 0-16 0", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  close: ["M18 6 6 18", "m6 6 12 12"],
  admin_panel_settings: ["M12 3 5 6v5c0 4 3 8 7 10 4-2 7-6 7-10V6Z", "m9 12 2 2 4-5"],
  my_location: ["M12 2v3", "M12 19v3", "M2 12h3", "M19 12h3", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"],
  location_on: ["M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z", "M12 10.5h.01"],
  calendar_month: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"],
  arrow_forward: ["M5 12h14", "m13 5 7 7-7 7"],
  arrow_back: ["M19 12H5", "m11 5-7 7 7 7"],
  arrow_right_alt: ["M4 12h16", "m14 6 6 6-6 6"],
  schedule: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"],
  refresh: ["M21 12a9 9 0 0 1-15 6.7L3 16", "M3 21v-5h5", "M3 12a9 9 0 0 1 15-6.7L21 8", "M21 3v5h-5"],
  search_off: ["m21 21-4.35-4.35", "M11 19a8 8 0 0 1-6.2-13.1", "M13.5 3.4A8 8 0 0 1 19 11", "M3 3l18 18"],
  star: ["M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17l-5.9 3.1 1.2-6.5L2.5 8.9 9.1 8Z"],
  verified: ["M12 2l2.2 2 3-.2.8 2.9 2.4 1.8-1.2 2.8 1.2 2.8-2.4 1.8-.8 2.9-3-.2-2.2 2-2.2-2-3 .2-.8-2.9-2.4-1.8 1.2-2.8-1.2-2.8 2.4-1.8.8-2.9 3 .2Z", "m9 12 2 2 4-5"],
  chat: ["M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"],
  how_to_reg: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "m16 11 2 2 4-5"],
  smoke_free: ["M2 12h8", "M18 12h2", "M14 12h1", "M2 2l20 20"],
  pets: ["M8 8h.01", "M16 8h.01", "M7 14c2-3 8-3 10 0 1.5 2.2-.4 5-3 4l-2-1-2 1c-2.6 1-4.5-1.8-3-4Z"],
  music_note: ["M9 18V5l10-2v13", "M9 18a3 3 0 1 1-3-3", "M19 16a3 3 0 1 1-3-3"],
  ac_unit: ["M12 2v20", "M4.9 4.9l14.2 14.2", "M2 12h20", "M4.9 19.1 19.1 4.9"],
  book_online: ["M5 4h14v16H5Z", "M8 8h8", "M8 12h8", "M8 16h4"],
  explore: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "m15 9-2 6-4 2 2-6Z"],
  map: ["M9 18 3 21V6l6-3 6 3 6-3v15l-6 3Z", "M9 3v15", "M15 6v15"],
  airline_seat_recline_normal: ["M7 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M7 7v6h5l4 6", "M5 21h14"],
  block: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M5 5l14 14"],
  commute: ["M6 17h12", "M7 17l-2 4", "M17 17l2 4", "M5 11h14l-1-6H6Z"],
  bar_chart: ["M4 20V10", "M12 20V4", "M20 20v-7"],
  local_taxi: ["M5 13h14l-1.5-5h-11Z", "M7 8l1-3h8l1 3", "M7 17h.01", "M17 17h.01"],
  add: ["M12 5v14", "M5 12h14"],
  group: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  trending_up: ["m3 17 6-6 4 4 8-8", "M14 7h7v7"],
  show_chart: ["M3 17l5-5 4 4 8-10"],
  confirmation_number: ["M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4Z"],
  task_alt: ["M21 12a9 9 0 1 1-4-7.5", "m9 12 2 2 8-8"],
  circle: ["M12 12h.01"],
  api: ["M4 12h4", "M16 12h4", "M8 8l8 8", "M16 8l-8 8"],
  error: ["M12 9v4", "M12 17h.01", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"],
  email: ["M4 4h16v16H4Z", "m4 7 8 5 8-5"],
  lock: ["M6 10h12v10H6Z", "M8 10V7a4 4 0 0 1 8 0v3"],
  check_circle: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "m9 12 2 2 4-5"],
  info: ["M12 16v-4", "M12 8h.01", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"],
  eco: ["M4 14c8 0 12-6 16-12 0 12-4 18-14 18", "M4 14c4 0 7 2 8 6"],
  payments: ["M3 6h18v12H3Z", "M7 14h5"],
};

export function MaterialIcon({
  name,
  className = "",
  filled = false,
}: MaterialIconProps) {
  const paths = iconPaths[name] ?? iconPaths.route;

  return (
    <svg
      className={`inline-block h-[1em] w-[1em] shrink-0 ${className}`.trim()}
      viewBox="0 0 24 24"
      fill={filled && name === "star" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
