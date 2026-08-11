import { callBackend, BackendError } from "@/lib/backend";
import { SlotPicker, type AvailableDay } from "./SlotPicker";

/**
 * Fetches availability on the server and hands it to the picker.
 *
 * Going straight to the scheduler here skips the browser's round trip through
 * /api/slots entirely, so the page arrives with real slots already rendered.
 * The client only calls that route afterwards, for retry and conflict refresh.
 */
export async function SlotsLoader() {
  let days: AvailableDay[] | null = null;
  let error: string | null = null;

  // Only the fetch is guarded — building JSX inside a try/catch would be
  // pointless, since render errors surface later and escape the handler.
  try {
    days = await callBackend<AvailableDay[]>("scheduler", "/slots");
  } catch (caught) {
    error =
      caught instanceof BackendError
        ? caught.message
        : "Could not load availability.";
  }

  return <SlotPicker initialDays={days} initialError={error} />;
}
