export const SAVE_DESTINATIONS = ['club', 'personal', 'both'] as const
export type SaveDestination = (typeof SAVE_DESTINATIONS)[number]
export const destinationLabels: Record<SaveDestination, string> = {
  club: 'the club folders',
  personal: 'your personal Drive',
  both: 'your personal Drive and the club folders',
}
