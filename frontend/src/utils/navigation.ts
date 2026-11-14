import { COMMAND_NAV, NAV_ITEMS } from "@/constants/navigation";
import type { NavItemConfig, StreamChannel, TacticalNavTab } from "@/types";

export function sidebarNavItems(viewMode: StreamChannel): NavItemConfig[] {
  return NAV_ITEMS.map(item => (item.id === "airspace" ? { ...item, ...COMMAND_NAV[viewMode] } : item));
}

/** `/cameras` opens the camera wall over the command page, so the command entry stays highlighted. */
export function isNavItemActive(itemId: TacticalNavTab, activeTab: TacticalNavTab): boolean {
  return itemId === activeTab || (itemId === "airspace" && activeTab === "cameras");
}
