import { chromium } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const OUT_DIR = '/Volumes/DiskD/HACKATHONS/TWIN Nebius/devpost/images';
const BASE_URL = 'http://localhost:3000';

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  // Viewport exactly in 3:2 ratio (1500 x 1000)
  const context = await browser.newContext({
    viewport: { width: 1500, height: 1000 },
    deviceScaleFactor: 2, // High resolution retina capture
  });
  const page = await context.newPage();

  console.log('📸 Starting Devpost Screenshot Capture (3:2 Ratio)...');

  // Reset factory state to clean baseline
  try {
    await fetch(`${BASE_URL}/api/factory/reset`, { method: 'POST' });
  } catch (e) {
    console.warn('Reset warning:', e.message);
  }

  // 1. Landing Page
  console.log('Capturing 01-landing-page.png...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '01-landing-page.png') });

  // 2. Command Center Dashboard
  console.log('Capturing 02-dashboard-overview.png...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '02-dashboard-overview.png') });

  // 3. Digital Twin 3D Studio
  console.log('Capturing 03-digital-twin-3d.png...');
  await page.goto(`${BASE_URL}/twin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Click 3D tab if available
  const threeDTab = page.locator('button:has-text("3D"), [role="tab"]:has-text("3D")').first();
  if (await threeDTab.isVisible()) {
    await threeDTab.click();
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '03-digital-twin-3d.png') });

  // 4. Injected Crisis State
  console.log('Capturing 04-crisis-detection.png...');
  try {
    await fetch(`${BASE_URL}/api/demo/crisis`, { method: 'POST' });
  } catch (e) {}
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '04-crisis-detection.png') });

  // 5. Multi-Agent Operations
  console.log('Capturing 05-multi-agent-operations.png...');
  await page.goto(`${BASE_URL}/agents`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '05-multi-agent-operations.png') });

  // 6. Predictive Maintenance & Asset Diagnostics
  console.log('Capturing 06-predictive-maintenance.png...');
  await page.goto(`${BASE_URL}/assets`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Click on A-ROB-03 if visible to show deep telemetry modal
  const robRow = page.locator('text=A-ROB-03').first();
  if (await robRow.isVisible()) {
    await robRow.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '06-predictive-maintenance.png') });

  // 7. What-If Scenario Simulator
  console.log('Capturing 07-what-if-simulator.png...');
  await page.goto(`${BASE_URL}/simulator`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '07-what-if-simulator.png') });

  // 8. Visual Quality & AOI Inspection
  console.log('Capturing 08-visual-quality-aoi.png...');
  await page.goto(`${BASE_URL}/quality`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '08-visual-quality-aoi.png') });

  // 9. CCTV & Thermal Control Room
  console.log('Capturing 09-cctv-control-room.png...');
  await page.goto(`${BASE_URL}/control-room`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '09-cctv-control-room.png') });

  // 10. Digital Twin Floor / Intralogistics View
  console.log('Capturing 10-intralogistics-fleet.png...');
  await page.goto(`${BASE_URL}/twin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const floorTab = page.locator('button:has-text("Floor plan"), button:has-text("Isometric")').first();
  if (await floorTab.isVisible()) {
    await floorTab.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(OUT_DIR, '10-intralogistics-fleet.png') });

  // 11. Approvals & Mitigation Gate
  console.log('Capturing 11-approvals-self-healing.png...');
  await page.goto(`${BASE_URL}/approvals`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '11-approvals-self-healing.png') });

  // 12. Full Audit Trail
  console.log('Capturing 12-audit-trail.png...');
  await page.goto(`${BASE_URL}/audit`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '12-audit-trail.png') });

  // 13. Generative Twin Builder
  console.log('Capturing 13-twin-builder.png...');
  await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '13-twin-builder.png') });

  // 14. Sustainability & Waste Reduction
  console.log('Capturing 14-sustainability-energy.png...');
  await page.goto(`${BASE_URL}/sustainability`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '14-sustainability-energy.png') });

  // 15. Nebius & NVIDIA Platform Integrations
  console.log('Capturing 15-nebius-nvidia-integrations.png...');
  await page.goto(`${BASE_URL}/integrations`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '15-nebius-nvidia-integrations.png') });

  await browser.close();
  console.log('🎉 All 15 screenshots successfully captured in 3:2 ratio!');
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
