export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function getOtpExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000);
}
