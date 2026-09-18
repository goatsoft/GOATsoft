/**
 * Shared open/close state for the site's modal dialogs (privacy, contact), so a
 * footer link and the dialog components can talk without prop drilling. Module-level
 * refs make it a singleton. @see ADR 0002
 */
const privacyOpen = ref(false)
const contactOpen = ref(false)

export function useDialogs() {
  return {
    privacyOpen,
    contactOpen,
    openPrivacy: () => { privacyOpen.value = true },
    openContact: () => { contactOpen.value = true },
  }
}
