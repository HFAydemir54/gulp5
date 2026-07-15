export const GTM_ID = "GTM-PPQLDS5C";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type GtmItem = {
  item_id: string;
  item_name: string;
};

export function profileToGtmItem(profile: {
  id: string;
  firstName: string;
}): GtmItem {
  return {
    item_id: profile.id,
    item_name: profile.firstName,
  };
}

export function pushToDataLayer(event: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}
