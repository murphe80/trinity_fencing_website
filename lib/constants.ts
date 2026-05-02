export const SITE_CONFIG = {
  name: 'Dublin University Fencing Club',
  shortName: 'DUFC',
  tagline: "Ireland's oldest university fencing club. Est. 1774.",
  email: 'dufencing@gmail.com',
  instagramUrl: 'https://www.instagram.com/trinityfencing/',
  instagramHandle: '@trinityfencing',
  fencingIrelandUrl: 'https://www.fencingireland.net',
  trinitySportUrl: 'https://www.tcd.ie/Sport/',
  clubforceUrl: 'https://trinityfencing.clubforce.com/products/membership',
  mckeevorShopUrl: 'https://www.mckeeversports.com/collections/trinity-fencing',
  // TODO: Replace with actual donation URL (PayPal.me or GoFundMe) before launch
  donationEmail: 'dufencing@gmail.com',
  wikipediaUrl: 'https://en.wikipedia.org/wiki/Dublin_University_Fencing_Club',
}

export const GOOGLE_CONFIG = {
  calendarId: process.env.GOOGLE_CALENDAR_ID ?? 'dufencing@gmail.com',
  sheetsId: process.env.GOOGLE_SHEETS_ID ?? '',
  galleryFolderId: process.env.DRIVE_GALLERY_FOLDER_ID ?? '',
  instagramFolderId: process.env.DRIVE_INSTAGRAM_FOLDER_ID ?? '',
}

export const CALENDAR_COLOR_TAG_MAP: Record<string, string> = {
  '11': 'Competition', // Tomato
  '9': 'Training',    // Blueberry
  '2': 'Social',      // Sage
  '5': 'Alumni',      // Banana
}
