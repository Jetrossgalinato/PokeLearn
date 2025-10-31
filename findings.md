# PokeLearn VAPT - Technical Findings

### FINDING #1: UNMANAGED MYSQL DATABASE SERVICE
**Severity:** Critical (9.8)
**Description:** An unmanaged MySQL database service was found running on port 3306. This service is not used by the PokeLearn application and appears to be a leftover or misconfiguration.
**Impact:** This exposed service provides a massive, high-value attack surface. An attacker can perform brute-force attacks, exploit known MySQL vulnerabilities, or potentially gain full control of the database.
**Tools:** `Nmap`
**Recommendation:** The MySQL service should be immediately stopped and disabled. (`sudo systemctl stop mysql && sudo systemctl disable mysql`)

---

### FINDING #2: CREDENTIALS TRANSMITTED IN URL
**Severity:** High (8.1)
**Description:** The application's login form on `/login` uses an HTTP GET request to transmit credentials, sending the user's password in the URL.
**Impact:** This is a critical information disclosure. Passwords will be stored in plain text in browser history, server logs, and proxy logs.
**Tools:** `Browser Dev Tools (Network Tab)`
**Recommendation:** The login form MUST be re-architected to use an HTTP POST request, sending the credentials in the body of the request, not the URL.

---

### FINDING #3: EXPOSED POSTGRESQL DATABASE
**Severity:** High (7.5)
**Description:** The host's PostgreSQL database service (port 5432) is accessible from the network. This is the application's primary database.
**Impact:** Exposing a database port directly to the network provides attackers with a direct target for brute-force and credential-stuffing attacks.
**Tools:** `Nmap`
**Recommendation:** Configure a host-based firewall (e.g., `ufw`) to block all incoming connections to port 5432 except for those from `localhost` (127.0.0.1).

---

### FINDING #4: MISSING CONTENT SECURITY POLICY (CSP)
**Severity:** Medium (6.1)
**Description:** The application does not send a Content Security Policy (CSP) header.
**Impact:** Without a CSP, the application is more vulnerable to XSS. If an attacker injects a script, the browser has no instructions to block it, potentially leading to session hijacking.
**Tools:** `OWASP ZAP`
**Recommendation:** Implement a strict Content Security Policy (CSP) header in the `next.config.js` file to whitelist trusted sources for scripts, styles, and images (e.g., `'self'` and `pokeapi.co`).

---

### FINDING #5: MISSING ANTI-CLICKJACKING HEADER
**Severity:** Medium (4.3)
**Description:** The application is missing an `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` header.
**Impact:** This allows the application to be vulnerable to Clickjacking. An attacker can load the site in a transparent `<iframe>` over their own malicious site to trick a logged-in user.
**Tools:** `OWASP ZAP`
**Recommendation:** Add the `X-Frame-Options: SAMEORIGIN` header to all responses, which can be done in the `next.config.js` file.

---

### FINDING #6: UNNECESSARY WEB SERVER (APACHE)
**Severity:** Medium (5.3)
**Description:** An unused Apache web server (httpd) is running on port 80. The application is served by Next.js on port 3000, making this redundant.
**Impact:** This service increases the host's attack surface. An attacker can target the Apache server with its own set of vulnerabilities.
**Tools:** `Nmap`
**Recommendation:** The Apache service should be stopped and disabled. (`sudo systemctl stop apache2 && sudo systemctl disable apache2`)

---

### FINDING #7: UNNECESSARY PRINTER SERVICE (CUPS)
**Severity:** Low (3.1)
**Description:** The Common Unix Printing System (CUPS) is running on port 631. This service is for managing printers, not serving web apps.
**Impact:** While the immediate risk is low, any unnecessary service is a potential liability and poor security hygiene.
**Tools:** `Nmap`
**Recommendation:** The CUPS service should be stopped and disabled. (`sudo systemctl stop cups && sudo systemctl disable cups`)