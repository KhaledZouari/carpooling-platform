import { describe, expect, it } from "vitest";

import { getRoleTheme } from "./roleTheme";

describe("getRoleTheme", () => {
  it.each([
    ["public", "Public space"],
    ["voyageur", "Voyageur"],
    ["conducteur", "Conducteur"],
    ["admin", "Admin"],
  ] as const)("maps the %s role to its theme", (role, expectedLabel) => {
    expect(getRoleTheme(role).label).toBe(expectedLabel);
  });
});
