const strongPassword = new RegExp(
  "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
);
const mediumPassword = new RegExp(
  "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
);

export function strengthChecker(PasswordParameter) {
  if (strongPassword.test(PasswordParameter)) {
    return "_STRONG";
  } else if (mediumPassword.test(PasswordParameter)) {
    return "_MEDIUM";
  } else {
    return "_WEAK";
  }
}
