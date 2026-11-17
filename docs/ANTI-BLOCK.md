# Responsible automation guidance

This project narrows the original anti-block concept to reliable, polite automation where you have permission. It is intended for testing websites you own or are explicitly permitted to assess, preferably staging or an endpoint provided by the site owner.

## Appropriate uses

- Use documented APIs and follow their terms.
- Use Playwright Chromium for normal rendering, forms, and session testing within an authorized scope.
- Identify the client honestly with stable, descriptive metadata.
- Keep cookies only in a local ignored profile for an authorized test account.
- Use conservative delays, bounded retries, and exponential backoff.
- Use only proxies that you own or are explicitly authorized to use and have configured.

## Do not implement or use for

- CAPTCHA solving or bypass.
- Fingerprint spoofing to impersonate users.
- Header, cookie, or TLS tricks to defeat bot detection.
- Proxy scraping, residential proxy abuse, or IP-ban evasion.
- Credential stuffing, private-data scraping, or bypassing authentication.

## Operational checklist

1. Confirm written authorization and scope.
2. Prefer staging or a supplied test endpoint.
3. Set a low request rate and clear stop condition.
4. Log outcomes without sensitive payloads; remove secrets from logs and history.
5. Stop on 401, 403, repeated 429, or an explicit opt-out.
6. Stop immediately when the owner asks.

The HTML version is [responsible-use.html](../responsible-use.html). The static site is documented in [README.md](../README.md) and [DEPLOYMENT.md](../DEPLOYMENT.md).
