import { chromium } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const OUT_DIR = '/Volumes/DiskD/HACKATHONS/TWIN Nebius/devpost/images';
const BASE_URL = 'http://localhost:3000';

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
    try {
      localStorage.setItem('twinforge-theme', t);
    } catch (e) {}
  }, theme);
  await page.waitForTimeout(400); // allow transitions and theme styles to settle
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1500, height: 1000 },
    deviceScaleFactor: 2, // High resolution retina capture
  });
  const page = await context.newPage();

  console.log('📸 Starting Devpost Screenshot Capture with Balanced Dark & Light Mix (3:2 Ratio)...');

  // Reset factory state to clean baseline
  try {
    await fetch(`${BASE_URL}/api/factory/reset`, { method: 'POST' });
  } catch (e) {}

  // 1. Landing Page (Dark)
  console.log('Capturing 01-landing-page.png [DARK]...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await setTheme(page, 'dark');
  await page.screenshot({ path: path.join(OUT_DIR, '01-landing-page.png') });

  // 2. Command Center Dashboard (Light)
  console.log('Capturing 02-dashboard-overview.png [LIGHT]...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  await setTheme(page, 'light');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '02-dashboard-overview.png') });

  // 3. Digital Twin 3D Studio (Dark - 3D lighting pops best on dark canvas)
  console.log('Capturing 03-digital-twin-3d.png [DARK]...');
  await page.goto(`${BASE_URL}/twin`, { waitUntil: 'networkidle' });
  await setTheme(page, 'dark');
  const threeDTab = page.locator('button:has-text("3D"), [role="tab"]:has-text("3D")').first();
  if (await threeDTab.isVisible()) {
    await threeDTab.click();
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '03-digital-twin-3d.png') });

  // 4. Injected Crisis State (Light - high contrast red alert banner)
  console.log('Capturing 04-crisis-detection.png [LIGHT]...');
  try {
    await fetch(`${BASE_URL}/api/demo/crisis`, { method: 'POST' });
  } catch (e) {}
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  await setTheme(page, 'light');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '04-crisis-detection.png') });

  // 5. Multi-Agent Operations (Dark)
  console.log('Capturing 05-multi-agent-operations.png [DARK]...');
  await page.goto(`${BASE_URL}/agents`, { waitUntil: 'networkidle' });
  await setTheme(page, 'dark');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '05-multi-agent-operations.png') });

  // 6. Predictive Maintenance & Asset Diagnostics (Light)
  console.log('Capturing 06-predictive-maintenance.png [LIGHT]...');
  await page.goto(`${BASE_URL}/assets`, { waitUntil: 'networkidle' });
  await setTheme(page, 'light');
  const robRow = page.locator('text=A-ROB-03').first();
  if (await robRow.isVisible()) {
    await robRow.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '06-predictive-maintenance.png') });

  // 7. What-If Scenario Simulator (Light)
  console.log('Capturing 07-what-if-simulator.png [LIGHT]...');
  await page.goto(`${BASE_URL}/simulator`, { waitUntil: 'networkidle' });
  await setTheme(page, 'light');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '07-what-if-simulator.png') });

  // 8. Visual Quality & AOI Inspection (Dark - defect images and heatmaps)
  console.log('Capturing 08-visual-quality-aoi.png [DARK]...');
  await page.goto(`${BASE_URL}/quality`, { waitUntil: 'networkidle' });
  await setTheme(page, 'dark');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '08-visual-quality-aoi.png') });

  // 9. CCTV & Thermal Control Room (Dark - authentic security/monitoring grid)
  console.log('Capturing 09-cctv-control-room.png [DARK]...');
  await page.goto(`${BASE_URL}/control-room`, { waitUntil: 'networkidle' });
  await setTheme(page, 'dark');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '09-cctv-control-room.png') });

  // 10. Digital Twin Floor / Intralogistics View (Light)
  console.log('Capturing 10-intralogistics-fleet.png [LIGHT]...');
  await page.goto(`${BASE_URL}/twin`, { waitUntil: 'networkidle' });
  await setTheme(page, 'light');
  const floorTab = page.locator('button:has-text("Floor plan"), button:has-text("Isometric")').first();
  if (await floorTab.isVisible()) {
    await floorTab.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '10-intralogistics-fleet.png') });

  // 11. Approvals & Mitigation Gate (Light)
  console.log('Capturing 11-approvals-self-healing.png [LIGHT]...');
  await page.goto(`${BASE_URL}/approvals`, { waitUntil: 'networkidle' });
  await setTheme(page, 'light');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '11-approvals-self-healing.png') });

  // 12. Full Audit Trail (Dark)
  console.log('Capturing 12-audit-trail.png [DARK]...');
  await page.goto(`${BASE_URL}/audit`, { waitUntil: 'networkidle' });
  await setTheme(page, 'dark');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '12-audit-trail.png') });

  // 13. Generative Twin Builder (Light)
  console.log('Capturing 13-twin-builder.png [LIGHT]...');
  await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'networkidle' });
  await setTheme(page, 'light');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '13-twin-builder.png') });

  // 14. Sustainability & Waste Reduction (Light)
  console.log('Capturing 14-sustainability-energy.png [LIGHT]...');
  await page.goto(`${BASE_URL}/sustainability`, { waitUntil: 'networkidle' });
  await setTheme(page, 'light');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '14-sustainability-energy.png') });

  // 15. Nebius & NVIDIA Platform Integrations (Dark)
  console.log('Capturing 15-nebius-nvidia-integrations.png [DARK]...');
  await page.goto(`${BASE_URL}/integrations`, { waitUntil: 'networkidle' });
  await setTheme(page, 'dark');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT_DIR, '15-nebius-nvidia-integrations.png') });

  await browser.close();
  console.log('🎉 All 15 screenshots recaptured with a balanced Dark/Light mix in 3:2 ratio!');
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
