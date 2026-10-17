import test from "node:test";
import assert from "node:assert/strict";
import {
  SUNIZE_CHECKOUT_LINKS,
  ALLOWED_DONATION_AMOUNTS,
  isAllowedDonationAmount,
  getSunizeCheckoutUrl,
} from "../src/lib/sunize";

test("SUNIZE_CHECKOUT_LINKS contains the exact 6 mandatory checkout URLs", () => {
  assert.equal(SUNIZE_CHECKOUT_LINKS[10], "https://pay.sunize.com.br/MufVaQNw");
  assert.equal(SUNIZE_CHECKOUT_LINKS[15], "https://pay.sunize.com.br/AuRhHnlv");
  assert.equal(SUNIZE_CHECKOUT_LINKS[20], "https://pay.sunize.com.br/hJPAUZxB");
  assert.equal(SUNIZE_CHECKOUT_LINKS[25], "https://pay.sunize.com.br/XcMJbIbn");
  assert.equal(SUNIZE_CHECKOUT_LINKS[30], "https://pay.sunize.com.br/tKfbPoXJ");
  assert.equal(SUNIZE_CHECKOUT_LINKS[50], "https://pay.sunize.com.br/OagBIjIM");
});

test("ALLOWED_DONATION_AMOUNTS strictly contains only [10, 15, 20, 25, 30, 50]", () => {
  assert.deepEqual([...ALLOWED_DONATION_AMOUNTS], [10, 15, 20, 25, 30, 50]);
  assert.equal(ALLOWED_DONATION_AMOUNTS.length, 6);
});

test("Each donation value has a unique Sunize checkout URL (no duplicate links)", () => {
  const urls = Object.values(SUNIZE_CHECKOUT_LINKS);
  const uniqueUrls = new Set(urls);
  assert.equal(urls.length, 6);
  assert.equal(uniqueUrls.size, 6);
});

test("All Sunize checkout links use secure HTTPS protocol on pay.sunize.com.br", () => {
  for (const [amount, url] of Object.entries(SUNIZE_CHECKOUT_LINKS)) {
    assert.match(url, /^https:\/\/pay\.sunize\.com\.br\/[A-Za-z0-9_-]+$/, `URL for R$ ${amount} must be valid HTTPS Sunize URL`);
  }
});

test("isAllowedDonationAmount accurately distinguishes valid and invalid values", () => {
  assert.equal(isAllowedDonationAmount(10), true);
  assert.equal(isAllowedDonationAmount(15), true);
  assert.equal(isAllowedDonationAmount(20), true);
  assert.equal(isAllowedDonationAmount(25), true);
  assert.equal(isAllowedDonationAmount(30), true);
  assert.equal(isAllowedDonationAmount(50), true);

  // Valores não permitidos
  assert.equal(isAllowedDonationAmount(0), false);
  assert.equal(isAllowedDonationAmount(5), false);
  assert.equal(isAllowedDonationAmount(40), false);
  assert.equal(isAllowedDonationAmount(100), false);
  assert.equal(isAllowedDonationAmount(-10), false);
  assert.equal(isAllowedDonationAmount(NaN), false);
});

test("getSunizeCheckoutUrl returns correct URL for valid amounts and null for invalid amounts", () => {
  assert.equal(getSunizeCheckoutUrl(10), "https://pay.sunize.com.br/MufVaQNw");
  assert.equal(getSunizeCheckoutUrl(20), "https://pay.sunize.com.br/hJPAUZxB");
  assert.equal(getSunizeCheckoutUrl(50), "https://pay.sunize.com.br/OagBIjIM");

  assert.equal(getSunizeCheckoutUrl(99), null);
  assert.equal(getSunizeCheckoutUrl(1), null);
});
