# Security Policy

## 🛡️ Overview

This project, **Click the Circle Game**, is a static web application with a local Express.js server for testing and development. While it is not intended for production/public hosting, security and user safety are still taken seriously. This document details all relevant security practices, reporting guidelines, and recommendations for contributors and users.

---

## Table of Contents

- [Threat Model & Scope](#threat-model--scope)
- [General Security Practices](#general-security-practices)
- [Web Application Security](#web-application-security)
- [Node.js/Express Server Security](#nodejsexpress-server-security)
- [Dependencies](#dependencies)
- [Vulnerability Reporting](#vulnerability-reporting)
- [Contact Information](#contact-information)

---

## Threat Model & Scope

- **Intended Use:** Local, personal, or trusted network environments. Not for public/production deployment.
- **Data Storage:** No user data, credentials, or sensitive information is collected or transmitted. Only localStorage is used for theme/settings/high scores.
- **Attack Surface:** The only attack surface is the static site and local Express server (no APIs, no database, no authentication).

---

## General Security Practices

1. **Do not expose this app to the public internet** unless you have performed a full security audit and understand the risks involved.
2. **Never store or process sensitive data** (passwords, personal info, payment details) in or through this app.
3. **Host ONLY via trusted networks** (localhost, home networks, or behind a firewall).
4. **Keep your Node.js and npm versions up to date.** Regularly update all dependencies.
5. **Do not modify the code to add backend logic** (e.g., authentication, file upload, databases) without strict security review.

---

## Web Application Security

- **XSS (Cross-Site Scripting):**
  - All user-facing content is locally generated; no input fields are present that would allow XSS.
  - Do not modify the source to allow arbitrary user input without implementing input validation and output encoding.
- **CSRF (Cross-Site Request Forgery):**
  - Not applicable, as the app is fully static and has no state-changing HTTP endpoints.
- **Clickjacking:**
  - If you ever deploy this publicly, set `X-Frame-Options: DENY` in Express to prevent clickjacking.
- **Content Security Policy (CSP):**
  - Add a strict CSP header if deploying online to prevent injected scripts or third-party resources from running.

#### Recommendations if deployed publicly:
```js
// Express.js example
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com;");
  next();
});
```

---

## Node.js/Express Server Security

- **Static File Serving ONLY:**
  - The server only serves files from the `public/` directory. There are no dynamic routes, APIs, or file uploads.
  - All paths are resolved via `path.join(__dirname, 'public')` to prevent directory traversal.
- **No Authentication:** Do not add user authentication or sessions without a thorough security review.
- **No External APIs:** Do not add backend API endpoints or connect to databases in this codebase.
- **Port Exposure:** Only run the server on trusted networks and never expose port 3000 to the public internet without additional security controls (e.g., firewall, reverse proxy).

---

## Dependencies

- **Express:** Only the latest stable version should be used. Regularly run `npm audit` and `npm update`.
- **No other dependencies** are included by default.

---

## Vulnerability Reporting

If you discover a security vulnerability, bug exploit, or have concerns about any code in this project, **please contact the maintainer immediately**:

- **Email:** [nathanielmohamed86@gmail.com](mailto:nathanielmohamed86@gmail.com)
- **Phone/WhatsApp:** +5978764192
- **Instagram:** [@NathanXppX](https://instagram.com/NathanXppX)

**Please include:**
- A clear description of the issue.
- Steps to reproduce (if applicable).
- Any relevant logs or code snippets.

All reports will be reviewed as soon as possible.  
If you are not comfortable reaching out directly, you may also open a [GitHub security advisory](https://github.com/nathaniel123x3rd/game1/security/advisories) (if the repo is public).

---

## Security FAQ

**Q: Can someone hack my computer via this game?**  
A: No, unless you modify the code to add backend logic or expose the server to the public internet. All logic runs on your machine, and no external connections are made.

**Q: Does this game collect data?**  
A: No. Only browser localStorage is used for settings and scores. Nothing leaves your device.

**Q: How do I make it safer if I want to show it to friends?**  
A: Host via localhost or a local network, never on the public internet. Do not add new dependencies without review.

---

## Final Notes

- **Use at your own risk.** The maintainer is not responsible for any misuse, data loss, or security incidents resulting from running or modifying this code.
- **Always ask if unsure!** If you have questions or concerns, use the contact information above.

---