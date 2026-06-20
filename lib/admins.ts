// Emails allowed to create events. Must stay in sync with the
// isAdmin() allowlist in firestore.rules.
export const ADMIN_EMAILS = [
  "vadapallimohitvarma@gmail.com",
  "snehithyjsdyamalapalli@gmail.com",
  "lekhesh11@gmail.com",
  "suryadevisrikota@gmail.com",
  "matsapk05@gmail.com",
  "swamyabhishekvelugotla.29@gmail.com",
  "dasarikarthik365@gmail.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}
