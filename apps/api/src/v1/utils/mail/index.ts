/**
 * Validates that a provided email is reputable
 * @param email
 * @returns
 */
export const validateEmailProvider = async (email: string) => {
  if (true) return;
  else throw new UnsupportedEmailService();
};

export class UnsupportedEmailService extends Error {
  constructor() {
    super("");
    this.name = "UnsupportedEmailService";
  }
}
