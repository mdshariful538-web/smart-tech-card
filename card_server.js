const express = require('express');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Register Bengali Fonts
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-Bold.ttf'), 'HindSiliguri');
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-SemiBold.ttf'), 'HindSiliguriSemiBold');

// -------------------------------------------------------------
// HELPER: Vector Canvas Icons (Zero missing font glyph boxes!)
// -------------------------------------------------------------

function drawArrow(ctx, x, y, length = 18, color = '#38BDF8') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - length / 2, y);
  ctx.lineTo(x + length / 2, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + length / 2 - 5, y - 5);
  ctx.lineTo(x + length / 2, y);
  ctx.lineTo(x + length / 2 - 5, y + 5);
  ctx.stroke();
  ctx.restore();
}

function drawBulb(ctx, x, y, size = 20, color = '#FACC15') {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color + '33';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(0, -size * 0.2, size * 0.45, Math.PI * 0.75, Math.PI * 2.25);
  ctx.lineTo(size * 0.2, size * 0.25);
  ctx.lineTo(-size * 0.2, size * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-size * 0.15, size * 0.35);
  ctx.lineTo(size * 0.15, size * 0.35);
  ctx.moveTo(-size * 0.1, size * 0.45);
  ctx.lineTo(size * 0.1, size * 0.45);
  ctx.stroke();
  ctx.restore();
}

function drawCyberLogo(ctx, x, y, radius = 46) {
  ctx.save();
  ctx.translate(x, y);

  // Outer Glow Circle
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  // Dashed Cyber Ring
  ctx.beginPath();
  ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner Core
  ctx.beginPath();
  ctx.arc(0, 0, radius - 14, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  // STB Monogram
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 22px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('STB', 0, -5);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 10px HindSiliguri';
  ctx.fillText('OFFICIAL', 0, 14);

  ctx.restore();
}

// -------------------------------------------------------------
// MASTER INFOGRAPHIC RENDERER (Karvion Labs Quality Benchmark)
// -------------------------------------------------------------
function renderInfographicCard({ title, subtitle, columns, bottomTags, takeaway }) {
  const width = 1440;
  const height = 1440;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Cyber Dark Tech Studio Background
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#060A13');
  bg.addColorStop(0.5, '#0A1224');
  bg.addColorStop(1, '#03070E');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Top Radial Ambient Glow
  const glow = ctx.createRadialGradient(width * 0.5, 120, 50, width * 0.5, 120, 650);
  glow.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(width * 0.5, 120, 650, 0, Math.PI * 2);
  ctx.fill();

  // Subtle Cyber Grid Accents
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 80; x < width; x += 120) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 80; y < height; y += 120) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // 2. Header Branding (Left: Smart Tech Bangla verified pill)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(80, 50, 360, 56, 28);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Verified Badge
  ctx.beginPath();
  ctx.arc(114, 78, 13, 0, Math.PI * 2);
  ctx.fillStyle = '#0EA5E9';
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(109, 78); ctx.lineTo(112, 82); ctx.lineTo(119, 74);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Smart Tech Bangla', 140, 80);
  ctx.restore();

  // Top Right: Karvion-style Cyber Ring Logo
  drawCyberLogo(ctx, width - 120, 78, 44);

  // 3. Massive Glowing Bengali Headline (Auto-scaled so it never touches screen edges)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let titleFontSize = 62;
  ctx.font = `bold ${titleFontSize}px HindSiliguri`;
  while (ctx.measureText(title).width > (width - 240) && titleFontSize > 36) {
    titleFontSize -= 2;
    ctx.font = `bold ${titleFontSize}px HindSiliguri`;
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 18;
  ctx.fillText(title, width * 0.5, 175);

  // Subtitle / Catchphrase Bar
  ctx.beginPath();
  ctx.roundRect(width * 0.5 - 300, 225, 600, 48, 24);
  ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 24px HindSiliguri';
  ctx.shadowBlur = 0;
  ctx.fillText(subtitle, width * 0.5, 249);
  ctx.restore();

  // 4. Columns / Feature Cards (4 Equal Columns)
  const colCount = columns.length;
  const colGap = 20;
  const marginX = 80;
  const totalAvailableW = width - (marginX * 2) - (colGap * (colCount - 1));
  const colW = totalAvailableW / colCount;
  const cardY = 300;
  const cardH = 680;

  columns.forEach((col, i) => {
    const cardX = marginX + i * (colW + colGap);

    ctx.save();
    // Card Background Box
    ctx.shadowColor = col.color + '45';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, colW, cardH, 24);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = col.color + '70';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Card Top Badge
    ctx.beginPath();
    ctx.roundRect(cardX + 24, cardY + 24, colW - 48, 70, 16);
    ctx.fillStyle = col.color;
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px HindSiliguri';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(col.badge, cardX + colW / 2, cardY + 59);

    // Card Tool / Feature Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 25px HindSiliguri';
    ctx.fillText(col.name, cardX + colW / 2, cardY + 125);

    // Role / Category Pill
    ctx.beginPath();
    ctx.roundRect(cardX + 20, cardY + 155, colW - 40, 36, 18);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    ctx.fillStyle = col.color;
    ctx.font = 'bold 18px HindSiliguri';
    ctx.fillText(col.role, cardX + colW / 2, cardY + 173);

    // Subtle Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 25, cardY + 210);
    ctx.lineTo(cardX + colW - 25, cardY + 210);
    ctx.stroke();

    // Bullet Points
    const bulletStartY = cardY + 245;
    const bulletGap = 85;

    col.points.forEach((pt, pIdx) => {
      const py = bulletStartY + pIdx * bulletGap;

      // Bullet Point Icon Box
      ctx.beginPath();
      ctx.arc(cardX + 38, py + 12, 12, 0, Math.PI * 2);
      ctx.fillStyle = col.color + '25';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cardX + 38, py + 12, 5, 0, Math.PI * 2);
      ctx.fillStyle = col.color;
      ctx.fill();

      // Title & Description
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px HindSiliguri';
      ctx.fillText(pt.bold, cardX + 60, py + 5);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 17px HindSiliguri';
      ctx.fillText(pt.desc, cardX + 60, py + 27);
    });

    ctx.restore();
  });

  // 5. Bottom Quick Selection Guide
  const guideY = 1010;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(marginX, guideY, width - marginX * 2, 100, 20);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Guide Title
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 20px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('à¦à¦• à¦¨à¦œà¦°à§‡ à¦¸à¦ à¦¿à¦• à¦ªà¦›à¦¨à§à¦¦', width * 0.5, guideY + 26);

  // Guide Tags with clean Canvas Vector Arrows
  const tagCount = bottomTags.length;
  const tagW = (width - marginX * 2 - 40) / tagCount;
  bottomTags.forEach((t, idx) => {
    const tx = marginX + 20 + idx * tagW + tagW / 2;
    const yCenter = guideY + 65;

    ctx.save();
    ctx.font = 'bold 18px HindSiliguri';
    ctx.textBaseline = 'middle';

    const needWidth = ctx.measureText(t.need).width;
    const useWidth = ctx.measureText(t.use).width;
    const arrowSpace = 28;
    const totalW = needWidth + arrowSpace + useWidth;
    const startX = tx - totalW / 2;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(t.need, startX, yCenter);

    // Draw Vector Arrow
    drawArrow(ctx, startX + needWidth + 14, yCenter, 14, '#38BDF8');

    ctx.fillStyle = '#38BDF8';
    ctx.fillText(t.use, startX + needWidth + arrowSpace, yCenter);
    ctx.restore();
  });
  ctx.restore();

  // 6. Universal Takeaway Banner with Vector Lightbulb
  const takeY = 1140;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(marginX + 60, takeY, width - (marginX + 60) * 2, 76, 38);
  ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Measure with exact font first to avoid overlap
  ctx.font = 'bold 24px HindSiliguri';
  ctx.textBaseline = 'middle';
  const textW = ctx.measureText(takeaway).width;
  const bulbSpace = 36;
  const totalTakeawayW = bulbSpace + textW;
  const startX = width * 0.5 - totalTakeawayW / 2;

  // Draw Lightbulb
  drawBulb(ctx, startX + 10, takeY + 38, 22, '#FACC15');

  // Draw Takeaway Text
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E0F2FE';
  ctx.fillText(takeaway, startX + bulbSpace, takeY + 38);
  ctx.restore();

  // 7. Minimalist Luxury Footer
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(140, 1310);
  ctx.lineTo(width - 140, 1310);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#64748B';
  ctx.font = '500 24px HindSiliguri';
  ctx.fillText('facebook.com/SmartTechBangla   â€¢   @smart_techbangla', width * 0.5, 1360);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 1.0 });
}

// -------------------------------------------------------------
// VIRAL INFOGRAPHIC CHEAT SHEETS (Karvion Labs Quality)
// -------------------------------------------------------------
const INFOGRAPHIC_TOPICS = {
  // 1. AI Tools
  ai_tools: {
    title: 'à¦•à§‹à¦¨ à¦•à¦¾à¦œà§‡à¦° à¦œà¦¨à§à¦¯ à¦•à§‹à¦¨ à¦à¦†à¦‡ (AI) à¦Ÿà§à¦² à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¬à§‡à¦¨?',
    subtitle: 'à¦¶à¦¿à¦–à§à¦¨ â€¢ à¦¬à§‡à¦›à§‡ à¦¨à¦¿à¦¨ â€¢ à¦¸à¦®à§Ÿ à¦¬à¦¾à¦à¦šà¦¾à¦¨',
    columns: [
      {
        badge: 'ChatGPT',
        name: 'à¦²à§‡à¦–à¦¾ à¦“ à¦°à¦¿à¦¸à¦¾à¦°à§à¦š',
        role: 'OpenAI',
        color: '#10A37F',
        points: [
          { bold: 'à¦‡à¦®à§‡à¦‡à¦² à¦“ à¦®à§‡à¦¸à§‡à¦œ', desc: 'à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦®à§‡à¦‡à¦² à¦¦à§à¦°à§à¦¤ à¦²à¦¿à¦–à§à¦¨' },
          { bold: 'à¦•à¦¨à¦Ÿà§‡à¦¨à§à¦Ÿ à¦†à¦‡à¦¡à¦¿à§Ÿà¦¾', desc: 'à¦¸à§‹à¦¶à§à¦¯à¦¾à¦² à¦®à¦¿à¦¡à¦¿à§Ÿà¦¾ à¦ªà§‹à¦¸à§à¦Ÿ à¦“ à¦ªà§à¦²à§à¦¯à¦¾à¦¨' },
          { bold: 'à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¬à§à¦¯à¦¾à¦–à§à¦¯à¦¾', desc: 'à¦•à¦ à¦¿à¦¨ à¦¬à¦¿à¦·à§Ÿ à¦¸à¦¹à¦œ à¦•à¦°à§‡ à¦¬à§‹à¦à¦¾' },
          { bold: 'à¦­à¦¾à¦·à¦¾ à¦…à¦¨à§à¦¬à¦¾à¦¦', desc: 'à¦¨à¦¿à¦–à§à¦à¦¤ à¦“ à¦ªà§à¦°à¦¾à¦žà§à¦œà¦² à¦…à¦¨à§à¦¬à¦¾à¦¦' }
        ]
      },
      {
        badge: 'Claude',
        name: 'à¦•à§‹à¦¡à¦¿à¦‚ à¦“ à¦¬à¦¿à¦¶à§à¦²à§‡à¦·à¦£',
        role: 'Anthropic',
        color: '#D97706',
        points: [
          { bold: 'à¦¬à§œ à¦«à¦¾à¦‡à¦² à¦…à§à¦¯à¦¾à¦¨à¦¾à¦²à¦¾à¦‡à¦¸à¦¿à¦¸', desc: 'à¦¶à¦¤ à¦ªà¦¾à¦¤à¦¾à¦° à¦ªà¦¿à¦¡à¦¿à¦à¦« à¦¸à¦¾à¦°à¦¾à¦‚à¦¶' },
          { bold: 'à¦œà¦Ÿà¦¿à¦² à¦•à§‹à¦¡ à¦¡à¦¿à¦¬à¦¾à¦—', desc: 'à¦à¦°à¦° à¦–à§à¦à¦œà§‡ à¦¨à¦¿à¦–à§à¦à¦¤ à¦¸à¦®à¦¾à¦§à¦¾à¦¨' },
          { bold: 'à¦²à¦œà¦¿à¦•à§à¦¯à¦¾à¦² à¦²à§‡à¦–à¦¾', desc: 'à¦—à¦¬à§‡à¦·à¦£à¦¾à¦®à§‚à¦²à¦• à¦“ à¦—à¦­à§€à¦° à¦²à§‡à¦–à¦¾' },
          { bold: 'à¦¡à§‡à¦Ÿà¦¾ à¦ªà§à¦°à¦¸à§‡à¦¸à¦¿à¦‚', desc: 'à¦¤à¦¥à§à¦¯ à¦¥à§‡à¦•à§‡ à¦šà¦¾à¦°à§à¦Ÿ à¦“ à¦¸à¦¾à¦®à¦¾à¦°à¦¿' }
        ]
      },
      {
        badge: 'Midjourney',
        name: 'à¦›à¦¬à¦¿ à¦¤à§ˆà¦°à¦¿',
        role: 'AI Image Generator',
        color: '#2563EB',
        points: [
          { bold: 'à¦¸à¦¿à¦¨à§‡à¦®à¦¾à¦Ÿà¦¿à¦• à¦†à¦°à§à¦Ÿ', desc: 'à§ªK à¦¬à¦¾à¦¸à§à¦¤à¦¬à¦§à¦°à§à¦®à§€ à¦›à¦¬à¦¿ à¦¤à§ˆà¦°à¦¿' },
          { bold: 'à¦²à§‹à¦—à§‹ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨', desc: 'à¦¬à§à¦°à§à¦¯à¦¾à¦¨à§à¦¡à§‡à¦° à¦†à¦§à§à¦¨à¦¿à¦• à¦•à¦¨à¦¸à§‡à¦ªà§à¦Ÿ' },
          { bold: 'à¦ªà§‹à¦¸à§à¦Ÿà¦¾à¦° à¦“ à¦¬à§à¦¯à¦¾à¦¨à¦¾à¦°', desc: 'à¦¬à¦¿à¦œà§à¦žà¦¾à¦ªà¦¨à§‡à¦° à¦†à¦•à¦°à§à¦·à¦£à§€à§Ÿ à¦›à¦¬à¦¿' },
          { bold: 'à¦ªà§à¦°à§‹à¦¡à¦¾à¦•à§à¦Ÿ à¦®à¦¡à§‡à¦²', desc: 'à¦¨à¦¤à§à¦¨ à¦—à§à¦¯à¦¾à¦œà§‡à¦Ÿà§‡à¦° à¦¥à§à¦°à¦¿à¦¡à¦¿ à¦²à§à¦•' }
        ]
      },
      {
        badge: 'Canva AI',
        name: 'à¦¸à§‹à¦¶à§à¦¯à¦¾à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨',
        role: 'Magic Studio',
        color: '#06B6D4',
        points: [
          { bold: 'à¦¦à§à¦°à§à¦¤ à¦¸à§‹à¦¶à§à¦¯à¦¾à¦² à¦ªà§‹à¦¸à§à¦Ÿ', desc: 'à¦°à§‡à¦¡à¦¿à¦®à§‡à¦¡ à¦Ÿà§‡à¦®à¦ªà§à¦²à§‡à¦Ÿà§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨' },
          { bold: 'à¦¬à§à¦¯à¦¾à¦•à¦—à§à¦°à¦¾à¦‰à¦¨à§à¦¡ à¦°à¦¿à¦®à§à¦­', desc: 'à¦®à¦¾à¦¤à§à¦° à§§ à¦•à§à¦²à¦¿à¦•à§‡ à¦…à¦¬à¦œà§‡à¦•à§à¦Ÿ à¦•à¦¾à¦Ÿà¦¾' },
          { bold: 'à¦®à§à¦¯à¦¾à¦œà¦¿à¦• à¦‡à¦°à§‡à¦œà¦¾à¦°', desc: 'à¦›à¦¬à¦¿ à¦¥à§‡à¦•à§‡ à¦…à¦¬à¦¾à¦žà§à¦›à¦¿à¦¤ à¦…à¦‚à¦¶ à¦®à§‹à¦›à¦¾' },
          { bold: 'à¦­à¦¿à¦¡à¦¿à¦“ à¦“ à¦°à¦¿à¦²à¦¸', desc: 'à¦¸à¦¹à¦œà§‡ à¦à¦¡à¦¿à¦Ÿà¦¿à¦‚ à¦“ à¦¸à¦¾à¦‰à¦¨à§à¦¡ à¦…à§à¦¯à¦¾à¦¡' }
        ]
      }
    ],
    bottomTags: [
      { need: 'à¦•à¦¨à¦Ÿà§‡à¦¨à§à¦Ÿ', use: 'ChatGPT' },
      { need: 'à¦•à§‹à¦¡à¦¿à¦‚', use: 'Claude' },
      { need: 'à¦›à¦¬à¦¿ à¦¤à§ˆà¦°à¦¿', use: 'Midjourney' },
      { need: 'à¦¸à§‹à¦¶à§à¦¯à¦¾à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨', use: 'Canva' }
    ],
    takeaway: 'à¦à¦•à¦Ÿà¦¿ à¦Ÿà§à¦² à¦¸à¦¬ à¦•à¦¾à¦œà§‡à¦° à¦œà¦¨à§à¦¯ à¦¨à§Ÿ â€” à¦ªà§à¦°à¦œà§‡à¦•à§à¦Ÿ à¦“ à¦ªà§à¦°à§Ÿà§‹à¦œà¦¨ à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ à¦Ÿà§à¦² à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨ à¦•à¦°à§à¦¨à¥¤'
  },

  // 2. Secret Dialer Codes
  secret_codes: {
    title: 'à¦¸à§à¦®à¦¾à¦°à§à¦Ÿà¦«à§‹à¦¨à§‡à¦° à¦œà¦°à§à¦°à¦¿ à§ªà¦Ÿà¦¿ à¦¸à¦¿à¦•à§à¦°à§‡à¦Ÿ à¦•à§‹à¦¡: à¦•à§‹à¦¨ à¦•à§‹à¦¡ à¦•à§‹à¦¨ à¦•à¦¾à¦œà§‡?',
    subtitle: 'à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§à¦¨ â€¢ à¦¡à¦¾à§Ÿà¦¾à¦² à¦•à¦°à§à¦¨ â€¢ à¦¨à¦¿à¦°à¦¾à¦ªà¦¦ à¦¥à¦¾à¦•à§à¦¨',
    columns: [
      {
        badge: '*#21#',
        name: 'à¦•à¦² à¦«à¦°à§‹à§Ÿà¦¾à¦°à§à¦¡à¦¿à¦‚',
        role: 'Spying Detection',
        color: '#0EA5E9',
        points: [
          { bold: 'à¦•à¦² à¦¹à§à¦¯à¦¾à¦•à¦¿à¦‚ à¦šà§‡à¦•', desc: 'à¦•à¦² à¦—à§‹à¦ªà¦¨à§‡ à¦…à¦¨à§à¦¯ à¦•à§‹à¦¥à¦¾à¦“ à¦¯à¦¾à¦šà§à¦›à§‡?' },
          { bold: 'à¦à¦¸à¦à¦®à¦à¦¸ à¦¡à¦¾à¦‡à¦­à¦¾à¦°à§à¦Ÿ', desc: 'à¦®à§‡à¦¸à§‡à¦œ à¦«à¦°à¦“à§Ÿà¦¾à¦°à§à¦¡ à¦šà§‡à¦• à¦•à¦°à§à¦¨' },
          { bold: 'à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§à¦°à§à¦¯à¦¾à¦•à¦¿à¦‚', desc: 'à¦‡à¦¨à§à¦Ÿà¦¾à¦°à¦¨à§‡à¦Ÿ à¦Ÿà§à¦°à¦¾à¦«à¦¿à¦• à¦¡à¦¾à¦‡à¦­à¦¾à¦°à§à¦Ÿ' },
          { bold: 'à¦¤à¦¾à¦¤à§à¦•à§à¦·à¦£à¦¿à¦• à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¾à¦¸', desc: 'à¦¸à§à¦•à§à¦°à¦¿à¦¨à§‡ à¦°à¦¿à¦ªà§‹à¦°à§à¦Ÿ à¦¦à§‡à¦–à§à¦¨' }
        ]
      },
      {
        badge: '##002#',
        name: 'à¦¸à¦¬ à¦«à¦°à§‹à§Ÿà¦¾à¦°à§à¦¡ à¦¬à¦¾à¦¤à¦¿à¦²',
        role: 'Master Reset',
        color: '#EF4444',
        points: [
          { bold: 'à§§ à¦•à§à¦²à¦¿à¦•à§‡ à¦¬à¦¨à§à¦§', desc: 'à¦¸à¦•à¦² à¦¡à¦¾à¦‡à¦­à¦¾à¦°à§à¦Ÿ à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦¬à¦¾à¦¤à¦¿à¦²' },
          { bold: 'à¦¹à§à¦¯à¦¾à¦•à¦¿à¦‚ à¦¥à§‡à¦•à§‡ à¦®à§à¦•à§à¦¤à¦¿', desc: 'à¦…à¦ªà¦°à¦¿à¦šà¦¿à¦¤ à¦«à¦°à§‹à§Ÿà¦¾à¦°à§à¦¡à¦¿à¦‚ à¦¬à¦¿à¦šà§à¦›à¦¿à¦¨à§à¦¨' },
          { bold: 'à¦­à§Ÿà§‡à¦¸ à¦“ à¦¡à§‡à¦Ÿà¦¾ à¦¸à§à¦°à¦•à§à¦·à¦¾', desc: 'à¦•à¦² à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£ à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦°à¦¾à¦–à§à¦¨' },
          { bold: 'à¦¸à¦¬ à¦¸à¦¿à¦®à§‡ à¦•à¦¾à¦œ à¦•à¦°à§‡', desc: 'à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦…à¦ªà¦¾à¦°à§‡à¦Ÿà¦°à§‡ à¦•à¦¾à¦°à§à¦¯à¦•à¦°' }
        ]
      },
      {
        badge: '*#06#',
        name: 'IMEI à¦¨à¦¾à¦®à§à¦¬à¦¾à¦° à¦šà§‡à¦•',
        role: 'Phone Identity',
        color: '#F59E0B',
        points: [
          { bold: 'à¦†à¦¸à¦² à¦ªà¦°à¦¿à¦šà§Ÿ', desc: 'à¦«à§‹à¦¨à§‡à¦° à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² à§§à§« à¦¡à¦¿à¦œà¦¿à¦Ÿ à¦•à§‹à¦¡' },
          { bold: 'à¦šà§à¦°à¦¿ à¦¹à¦²à§‡ à¦‰à¦¦à§à¦§à¦¾à¦°', desc: 'à¦œà¦¿à¦¡à¦¿ à¦“ à¦Ÿà§à¦°à§à¦¯à¦¾à¦•à¦¿à¦‚à§Ÿà§‡ à¦•à¦¾à¦œà§‡ à¦²à¦¾à¦—à§‡' },
          { bold: 'à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦«à§‹à¦¨ à¦¯à¦¾à¦šà¦¾à¦‡', desc: 'à¦¬à¦¿à¦Ÿà¦¿à¦†à¦°à¦¸à¦¿ à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦¸à§‡ à¦šà§‡à¦•' },
          { bold: 'à¦¨à¦•à¦² à¦«à§‹à¦¨ à¦¶à¦¨à¦¾à¦•à§à¦¤', desc: 'à¦¬à¦•à§à¦¸à§‡à¦° à¦¨à¦¾à¦®à§à¦¬à¦¾à¦°à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦®à§‡à¦²à¦¾à¦¨' }
        ]
      },
      {
        badge: '*#*#4636#*#*',
        name: 'à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦“ à¦¨à§‡à¦Ÿà¦“à§Ÿà¦¾à¦°à§à¦•',
        role: 'Testing Menu',
        color: '#10B981',
        points: [
          { bold: 'à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¹à§‡à¦²à¦¥', desc: 'à¦šà¦¾à¦°à§à¦œà§‡à¦° à¦¤à¦¾à¦ªà¦®à¦¾à¦¤à§à¦°à¦¾ à¦“ à¦¸à§à¦¥à¦¾à§Ÿà¦¿à¦¤à§à¦¬' },
          { bold: 'à¦²à¦¾à¦‡à¦­ à¦¸à¦¿à¦—à¦¨à§à¦¯à¦¾à¦²', desc: 'à¦¨à§‡à¦Ÿà¦“à§Ÿà¦¾à¦°à§à¦•à§‡à¦° à¦†à¦¸à¦² à¦¶à¦•à§à¦¤à¦¿ à¦¯à¦¾à¦šà¦¾à¦‡' },
          { bold: 'à¦…à§à¦¯à¦¾à¦ª à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à§‡à¦° à¦¹à¦¿à¦¸à§‡à¦¬', desc: 'à¦•à§‹à¦¨ à¦…à§à¦¯à¦¾à¦ª à¦•à¦¤à¦•à§à¦·à¦£ à¦šà¦²à§‡à¦›à§‡' },
          { bold: 'à¦“à§Ÿà¦¾à¦‡à¦«à¦¾à¦‡ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸', desc: 'à¦°à¦¾à¦‰à¦Ÿà¦¾à¦°à§‡à¦° à¦¸à§à¦ªà¦¿à¦¡ à¦“ à¦ªà¦¿à¦‚ à¦Ÿà§‡à¦¸à§à¦Ÿ' }
        ]
      }
    ],
    bottomTags: [
      { need: 'à¦•à¦² à¦šà§‡à¦•', use: '*#21#' },
      { need: 'à¦¸à¦¬ à¦¬à¦¨à§à¦§', use: '##002#' },
      { need: 'IMEI à¦¯à¦¾à¦šà¦¾à¦‡', use: '*#06#' },
      { need: 'à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¹à§‡à¦²à¦¥', use: '*#*#4636#*#*' }
    ],
    takeaway: 'à¦¸à¦¨à§à¦¦à§‡à¦¹ à¦¹à¦²à§‡ à¦à¦–à¦¨à¦‡ à¦•à§‹à¦¡à¦—à§à¦²à§‹ à¦¡à¦¾à§Ÿà¦¾à¦² à¦•à¦°à§‡ à¦†à¦ªà¦¨à¦¾à¦° à¦«à§‹à¦¨à§‡à¦° à¦¨à¦¿à¦°à¦¾à¦ªà¦¤à§à¦¤à¦¾ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à§à¦¨à¥¤'
  },

  // 3. Scam Defense
  scam_defense: {
    title: 'à¦…à¦¨à¦²à¦¾à¦‡à¦¨ à¦ªà§à¦°à¦¤à¦¾à¦°à¦£à¦¾ à¦šà§‡à¦¨à¦¾à¦° à¦‰à¦ªà¦¾à§Ÿ: à¦•à§‹à¦¨ à¦«à¦¾à¦à¦¦ à¦•à§€à¦­à¦¾à¦¬à§‡ à¦•à¦¾à¦œ à¦•à¦°à§‡?',
    subtitle: 'à¦¸à¦šà§‡à¦¤à¦¨ à¦¹à§‹à¦¨ â€¢ à¦«à¦¾à¦à¦¦ à¦šà¦¿à¦¨à§à¦¨ â€¢ à¦Ÿà¦¾à¦•à¦¾ à¦¬à¦¾à¦à¦šà¦¾à¦¨',
    columns: [
      {
        badge: 'OTP Scam',
        name: 'à¦­à§à§Ÿà¦¾ à¦¬à¦¿à¦•à¦¾à¦¶/à¦¬à§à¦¯à¦¾à¦‚à¦• à¦•à¦²',
        role: 'à¦¬à¦¿à¦•à¦¾à¦¶ à¦“ à¦¨à¦—à¦¦ à¦«à¦¾à¦à¦¦',
        color: '#E11D48',
        points: [
          { bold: 'à¦­à§à§Ÿà¦¾ à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨', desc: 'à¦…à¦«à¦¿à¦¸à§‡à¦° à¦ªà¦°à¦¿à¦šà§Ÿà§‡ à¦“à¦Ÿà¦¿à¦ªà¦¿ à¦¦à¦¾à¦¬à¦¿' },
          { bold: 'à¦²à¦Ÿà¦¾à¦°à¦¿ à¦“ à¦¬à§‹à¦¨à¦¾à¦¸à§‡à¦° à¦²à§‹à¦­', desc: 'à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦¬à§à¦²à¦• à¦¹à¦“à§Ÿà¦¾à¦° à¦­à§Ÿ' },
          { bold: 'à¦Ÿà¦¾à¦•à¦¾ à¦‰à¦§à¦¾à¦“ à¦®à§à¦¹à§‚à¦°à§à¦¤à§‡à¦‡', desc: 'à¦“à¦Ÿà¦¿à¦ªà¦¿ à¦¦à¦¿à¦²à§‡ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦¶à§‡à¦·' },
          { bold: 'à¦¸à¦®à¦¾à¦§à¦¾à¦¨', desc: 'à¦“à¦Ÿà¦¿à¦ªà¦¿ à¦¬à¦¾ à¦ªà¦¿à¦¨ à¦•à¦¾à¦‰à¦•à§‡ à¦¬à¦²à¦¬à§‡à¦¨ à¦¨à¦¾' }
        ]
      },
      {
        badge: 'Job Scam',
        name: 'à¦…à¦¨à¦²à¦¾à¦‡à¦¨ à¦•à¦¾à¦œà§‡à¦° à¦«à¦¾à¦à¦¦',
        role: 'à¦Ÿà§‡à¦²à¦¿à¦—à§à¦°à¦¾à¦® à¦ªà§à¦°à¦¤à¦¾à¦°à¦£à¦¾',
        color: '#8B5CF6',
        points: [
          { bold: 'à¦¸à¦¹à¦œ à¦†à§Ÿà§‡à¦° à¦Ÿà§‹à¦ª', desc: 'à¦²à¦¾à¦‡à¦• à¦¬à¦¾ à¦°à¦¿à¦­à¦¿à¦‰ à¦¦à¦¿à§Ÿà§‡ à¦‡à¦¨à¦•à¦¾à¦®' },
          { bold: 'à¦¶à§à¦°à§à¦¤à§‡ à¦¸à¦¾à¦®à¦¾à¦¨à§à¦¯ à¦²à¦¾à¦­', desc: 'à¦¬à¦¿à¦¶à§à¦¬à¦¾à¦¸ à¦…à¦°à§à¦œà¦¨à§‡à¦° à¦ªà¦° à¦«à¦¾à¦à¦¦' },
          { bold: 'à¦®à§‹à¦Ÿà¦¾ à¦…à¦™à§à¦•à§‡à¦° à¦¬à¦¿à¦¨à¦¿à§Ÿà§‹à¦—', desc: 'à¦Ÿà¦¾à¦•à¦¾ à¦œà¦®à¦¾ à¦¦à¦¿à¦¤à§‡ à¦¬à¦²à§‡ à¦—à¦¾à§Ÿà§‡à¦¬' },
          { bold: 'à¦¸à¦®à¦¾à¦§à¦¾à¦¨', desc: 'à¦†à¦—à§‡ à¦Ÿà¦¾à¦•à¦¾ à¦šà¦¾à¦‡à¦²à§‡ à¦•à¦¾à¦œ à¦à§œà¦¿à§Ÿà§‡ à¦šà¦²à§à¦¨' }
        ]
      },
      {
        badge: 'Phishing',
        name: 'à¦­à§à§Ÿà¦¾ à¦²à¦¿à¦‚à¦• à¦“ à¦—à¦¿à¦«à¦Ÿ',
        role: 'à¦«à§‡à¦¸à¦¬à§à¦• à¦“ à¦®à§‡à¦¸à§‡à¦žà§à¦œà¦¾à¦°',
        color: '#F97316',
        points: [
          { bold: 'à¦«à§à¦°à¦¿ à¦°à¦¿à¦šà¦¾à¦°à§à¦œà§‡à¦° à¦…à¦«à¦¾à¦°', desc: 'à§¨à§« à¦œà¦¿à¦¬à¦¿ à¦«à§à¦°à¦¿ à¦‡à¦¨à§à¦Ÿà¦¾à¦°à¦¨à§‡à¦Ÿà§‡à¦° à¦«à¦¾à¦à¦¦' },
          { bold: 'à¦†à¦‡à¦¡à¦¿ à¦•à§à¦²à§‹à¦¨ à¦“ à¦¹à§à¦¯à¦¾à¦•à¦¿à¦‚', desc: 'à¦²à¦¿à¦‚à¦•à§‡ à¦¢à§à¦•à¦²à§‡à¦‡ à¦ªà¦¾à¦¸à¦“à§Ÿà¦¾à¦°à§à¦¡ à¦šà§à¦°à¦¿' },
          { bold: 'à¦¬à¦¨à§à¦§à§ à¦¸à§‡à¦œà§‡ à¦²à¦¿à¦‚à¦• à¦ªà¦¾à¦ à¦¾à¦¨à§‹', desc: 'à¦¹à§à¦¯à¦¾à¦•à¦¡ à¦†à¦‡à¦¡à¦¿ à¦¥à§‡à¦•à§‡ à¦®à§‡à¦¸à§‡à¦œ' },
          { bold: 'à¦¸à¦®à¦¾à¦§à¦¾à¦¨', desc: 'à¦…à¦šà§‡à¦¨à¦¾ à¦•à§‹à¦¨à§‹ à¦²à¦¿à¦‚à¦•à§‡ à¦•à§à¦²à¦¿à¦• à¦¨à§Ÿ' }
        ]
      },
      {
        badge: 'Deepfake',
        name: 'à¦à¦†à¦‡ à¦­à§Ÿà§‡à¦¸ à¦•à§à¦²à§‹à¦¨à¦¿à¦‚',
        role: 'à¦¡à¦¿à¦œà¦¿à¦Ÿà¦¾à¦² à¦ªà§à¦°à¦¤à¦¾à¦°à¦£à¦¾',
        color: '#06B6D4',
        points: [
          { bold: 'à¦•à¦£à§à¦  à¦¨à¦•à¦² à¦•à¦°à§‡ à¦•à¦²', desc: 'à¦ªà¦°à¦¿à¦šà¦¿à¦¤ à¦®à¦¾à¦¨à§à¦·à§‡à¦° à¦—à¦²à¦¾à§Ÿ à¦®à§‡à¦¸à§‡à¦œ' },
          { bold: 'à¦¦à§à¦°à§à¦˜à¦Ÿà¦¨à¦¾à¦° à¦­à§à§Ÿà¦¾ à¦–à¦¬à¦°', desc: 'à¦œà¦°à§à¦°à¦¿ à¦Ÿà¦¾à¦•à¦¾à¦° à¦œà¦¨à§à¦¯ à¦šà¦¾à¦ª' },
          { bold: 'à¦†à¦¤à¦™à§à¦• à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡ à¦ªà§à¦°à¦¤à¦¾à¦°à¦£à¦¾', desc: 'à¦¦à§à¦°à§à¦¤ à¦Ÿà¦¾à¦•à¦¾ à¦ªà¦¾à¦ à¦¾à¦¨à§‹à¦° à¦¹à§à¦®à¦•à¦¿' },
          { bold: 'à¦¸à¦®à¦¾à¦§à¦¾à¦¨', desc: 'à¦…à¦¨à§à¦¯ à¦¨à¦¾à¦®à§à¦¬à¦¾à¦°à§‡ à¦•à¦² à¦•à¦°à§‡ à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§à¦¨' }
        ]
      }
    ],
    bottomTags: [
      { need: 'à¦­à§à§Ÿà¦¾ à¦“à¦Ÿà¦¿à¦ªà¦¿', use: 'à¦•à¦–à¦¨à§‹à¦‡ à¦¦à§‡à¦¬à§‡à¦¨ à¦¨à¦¾' },
      { need: 'à¦…à¦¨à¦²à¦¾à¦‡à¦¨ à¦œà¦¬', use: 'à¦†à¦—à§‡ à¦Ÿà¦¾à¦•à¦¾ à¦¦à§‡à¦¬à§‡à¦¨ à¦¨à¦¾' },
      { need: 'à¦…à¦šà§‡à¦¨à¦¾ à¦²à¦¿à¦‚à¦•', use: 'à¦•à§à¦²à¦¿à¦• à¦•à¦°à¦¬à§‡à¦¨ à¦¨à¦¾' },
      { need: 'à¦­à§Ÿà§‡à¦¸ à¦•à¦²', use: 'à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§à¦¨' }
    ],
    takeaway: 'à¦•à§‹à¦¨à§‹ à¦¬à§à¦¯à¦¾à¦‚à¦• à¦¬à¦¾ à¦ªà§à¦°à¦¤à¦¿à¦·à§à¦ à¦¾à¦¨ à¦•à¦–à¦¨à§‹à¦‡ à¦†à¦ªà¦¨à¦¾à¦° à¦—à§‹à¦ªà¦¨ à¦ªà¦¿à¦¨ à¦¬à¦¾ à¦“à¦Ÿà¦¿à¦ªà¦¿ à¦œà¦¾à¦¨à¦¤à§‡ à¦šà¦¾à§Ÿ à¦¨à¦¾à¥¤'
  },

  // 4. PC Shortcuts
  pc_shortcuts: {
    title: 'à¦ªà¦¿à¦¸à¦¿ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦¦à§‡à¦° à¦œà¦¨à§à¦¯ à§ªà¦Ÿà¦¿ à¦¸à§à¦ªà¦¾à¦° à¦¦à¦°à¦•à¦¾à¦°à¦¿ à¦¶à¦°à§à¦Ÿà¦•à¦¾à¦Ÿ!',
    subtitle: 'à¦•à¦¿à¦¬à§‹à¦°à§à¦¡ à¦Ÿà§à¦°à¦¿à¦•à¦¸ â€¢ à¦•à¦¾à¦œà§‡à¦° à¦—à¦¤à¦¿ à¦¬à¦¾à§œà¦¾à¦¨',
    columns: [
      {
        badge: 'Win + V',
        name: 'à¦•à§à¦²à¦¿à¦ªà¦¬à§‹à¦°à§à¦¡ à¦¹à¦¿à¦¸à§à¦Ÿà§à¦°à¦¿',
        role: 'à¦¸à§à¦®à¦¾à¦°à§à¦Ÿ à¦•à¦ªà¦¿ à¦ªà§‡à¦¸à§à¦Ÿ',
        color: '#3B82F6',
        points: [
          { bold: 'à¦†à¦—à§‡à¦° à¦¸à¦¬ à¦•à¦ªà¦¿ à¦¸à¦‚à¦°à¦•à§à¦·à¦£', desc: 'à¦à¦•à¦¸à¦¾à¦¥à§‡ à¦…à¦¨à§‡à¦• à¦Ÿà§‡à¦•à§à¦¸à¦Ÿ à¦•à¦ªà¦¿' },
          { bold: 'à¦¸à§à¦•à§à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦¹à¦¿à¦¸à§à¦Ÿà§à¦°à¦¿', desc: 'à¦†à¦—à§‡à¦° à¦›à¦¬à¦¿à¦—à§à¦²à§‹ à¦†à¦¬à¦¾à¦° à¦ªà¦¾à¦¨' },
          { bold: 'à¦¬à¦¾à¦°à¦¬à¦¾à¦° à¦Ÿà¦¾à¦‡à¦ª à¦¨à§Ÿ', desc: 'à¦à¦• à¦•à§à¦²à¦¿à¦•à§‡ à¦ªà§‡à¦¸à§à¦Ÿ à¦•à¦°à§à¦¨' },
          { bold: 'à¦•à¦¾à¦œ à¦¦à§à¦°à§à¦¤ à¦¶à§‡à¦·', desc: 'à¦…à¦«à¦¿à¦¸ à¦“ à¦¸à§à¦Ÿà§à¦¡à§‡à¦¨à§à¦Ÿà¦¦à§‡à¦° à¦œà¦¨à§à¦¯ à¦¬à§‡à¦¸à§à¦Ÿ' }
        ]
      },
      {
        badge: 'Win+Shift+S',
        name: 'à¦¸à§à¦®à¦¾à¦°à§à¦Ÿ à¦¸à§à¦•à§à¦°à¦¿à¦¨à¦¶à¦Ÿ',
        role: 'à¦¸à§à¦¨à¦¿à¦ªà¦¿à¦‚ à¦Ÿà§à¦² à¦¶à¦°à§à¦Ÿà¦•à¦¾à¦Ÿ',
        color: '#10B981',
        points: [
          { bold: 'à¦¨à¦¿à¦°à§à¦¦à¦¿à¦·à§à¦Ÿ à¦…à¦‚à¦¶ à¦•à§à¦°à¦ª', desc: 'à¦¸à§à¦•à§à¦°à¦¿à¦¨à§‡à¦° à¦¯à¦¤à¦Ÿà§à¦•à§ à¦¦à¦°à¦•à¦¾à¦° à¦•à¦¾à¦Ÿà§à¦¨' },
          { bold: 'à¦…à¦Ÿà§‹ à¦•à§à¦²à¦¿à¦ªà¦¬à§‹à¦°à§à¦¡à§‡ à¦•à¦ªà¦¿', desc: 'à¦•à§‹à¦¨à§‹ à¦…à§à¦¯à¦¾à¦ª à¦–à§‹à¦²à¦¾à¦° à¦¦à¦°à¦•à¦¾à¦° à¦¨à§‡à¦‡' },
          { bold: 'à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦ªà§‡à¦¸à§à¦Ÿ', desc: 'à¦®à§‡à¦¸à§‡à¦žà§à¦œà¦¾à¦° à¦¬à¦¾ à¦«à¦¾à¦‡à¦²à§‡ à¦ªà¦¾à¦ à¦¾à¦¨' },
          { bold: 'à¦¨à¦¿à¦–à§à¦à¦¤ à¦•à§‹à§Ÿà¦¾à¦²à¦¿à¦Ÿà¦¿', desc: 'à¦¹à¦¾à¦‡ à¦°à§‡à¦œà§‹à¦²à¦¿à¦‰à¦¶à¦¨ à¦•à§à¦¯à¦¾à¦ªà¦šà¦¾à¦°' }
        ]
      },
      {
        badge: 'Ctrl+Shift+Esc',
        name: 'à¦Ÿà¦¾à¦¸à§à¦• à¦®à§à¦¯à¦¾à¦¨à§‡à¦œà¦¾à¦°',
        role: 'à¦¹à§à¦¯à¦¾à¦‚ à¦ªà¦¿à¦¸à¦¿ à¦«à¦¿à¦•à§à¦¸',
        color: '#EF4444',
        points: [
          { bold: 'à¦ªà¦¿à¦¸à¦¿ à¦¹à§à¦¯à¦¾à¦‚ à¦¹à¦²à§‡ à¦¸à¦®à¦¾à¦§à¦¾à¦¨', desc: 'à¦†à¦Ÿà¦•à§‡ à¦¥à¦¾à¦•à¦¾ à¦¸à¦«à¦Ÿà¦“à§Ÿà§à¦¯à¦¾à¦° à¦¬à¦¨à§à¦§' },
          { bold: 'à¦°â€à§à¦¯à¦¾à¦® à¦“ à¦¸à¦¿à¦ªà¦¿à¦‡à¦‰ à¦²à§‹à¦¡', desc: 'à¦•à§‹à¦¨ à¦…à§à¦¯à¦¾à¦ªà§‡ à¦¸à§à¦²à§‹ à¦¹à¦šà§à¦›à§‡ à¦¦à§‡à¦–à§à¦¨' },
          { bold: 'à¦¸à§à¦Ÿà¦¾à¦°à§à¦Ÿà¦†à¦ª à¦…à§à¦¯à¦¾à¦ª à¦…à¦«', desc: 'à¦ªà¦¿à¦¸à¦¿ à¦¦à§à¦°à§à¦¤ à¦…à¦¨ à¦•à¦°à¦¾à¦° à¦‰à¦ªà¦¾à§Ÿ' },
          { bold: 'à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦“à¦ªà§‡à¦¨', desc: 'à¦•à§‹à¦¨à§‹ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§à¦¤ à¦•à§à¦²à¦¿à¦• à¦›à¦¾à§œà¦¾' }
        ]
      },
      {
        badge: 'Win + . (à¦¡à¦Ÿ)',
        name: 'à¦‡à¦®à§‹à¦œà¦¿ à¦“ à¦¸à¦¿à¦®à§à¦¬à¦²',
        role: 'à¦Ÿà¦¾à¦‡à¦ªà¦¿à¦‚ à¦¬à§à¦¸à§à¦Ÿà¦¾à¦°',
        color: '#8B5CF6',
        points: [
          { bold: 'à¦¸à¦¬ à¦‡à¦®à§‹à¦œà¦¿ à¦à¦• à¦•à§à¦²à¦¿à¦•à§‡', desc: 'à¦¸à§‹à¦¶à§à¦¯à¦¾à¦² à¦ªà§‹à¦¸à§à¦Ÿà§‡ à¦‡à¦®à§‹à¦œà¦¿ à¦¦à¦¿à¦¨' },
          { bold: 'à¦¸à§à¦ªà§‡à¦¶à¦¾à¦² à¦¸à¦¿à¦®à§à¦¬à¦²', desc: 'à¦¡à¦¿à¦—à§à¦°à¦¿, à¦…à§à¦¯à¦¾à¦°à§‹ à¦“ à¦¸à§à¦ªà§‡à¦¶à¦¾à¦² à¦¸à¦¾à¦‡à¦¨' },
          { bold: 'à¦œà¦¿à¦†à¦‡à¦à¦« à¦ªà§à¦¯à¦¾à¦¨à§‡à¦²', desc: 'à¦šà§à¦¯à¦¾à¦Ÿà¦¿à¦‚à§Ÿà§‡ à¦¦à§à¦°à§à¦¤ à¦°à¦¿à¦…à§à¦¯à¦¾à¦•à¦¶à¦¨' },
          { bold: 'à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦…à§à¦¯à¦¾à¦ªà§‡ à¦¸à¦šà¦²', desc: 'à¦¬à§à¦°à¦¾à¦‰à¦œà¦¾à¦° à¦¬à¦¾ à¦“à§Ÿà¦¾à¦°à§à¦¡à§‡ à¦•à¦¾à¦œ à¦•à¦°à§‡' }
        ]
      }
    ],
    bottomTags: [
      { need: 'à¦•à§à¦²à¦¿à¦ªà¦¬à§‹à¦°à§à¦¡', use: 'Win + V' },
      { need: 'à¦¸à§à¦•à§à¦°à¦¿à¦¨à¦¶à¦Ÿ', use: 'Win + Shift + S' },
      { need: 'à¦¹à§à¦¯à¦¾à¦‚ à¦«à¦¿à¦•à§à¦¸', use: 'Ctrl + Shift + Esc' },
      { need: 'à¦‡à¦®à§‹à¦œà¦¿', use: 'Win + .' }
    ],
    takeaway: 'à¦¶à¦°à§à¦Ÿà¦•à¦¾à¦Ÿ à¦•à¦¿à¦¬à§‹à¦°à§à¦¡ à¦•à¦®à¦¾à¦¨à§à¦¡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦²à§‡ à¦ªà§à¦°à¦¤à¦¿à¦¦à¦¿à¦¨ à¦•à¦¾à¦œà§‡à¦° à¦—à¦¤à¦¿ à¦¦à§à¦¬à¦¿à¦—à§à¦£ à¦¹à§Ÿà§‡ à¦¯à¦¾à§Ÿà¥¤'
  },

  // 5. Social & Messaging Privacy (Covers WhatsApp, Facebook Chat Lock)
  social_privacy: {
    title: 'à¦¸à§‹à¦¶à§à¦¯à¦¾à¦² à¦®à¦¿à¦¡à¦¿à§Ÿà¦¾à§Ÿ à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦¨à¦¿à¦°à¦¾à¦ªà¦¤à§à¦¤à¦¾: à§ªà¦Ÿà¦¿ à¦œà¦°à§à¦°à¦¿ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸!',
    subtitle: 'à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§à¦¨ â€¢ à¦…à¦¨ à¦•à¦°à§à¦¨ â€¢ à¦šà§à¦¯à¦¾à¦Ÿ à¦¨à¦¿à¦°à¦¾à¦ªà¦¦ à¦°à¦¾à¦–à§à¦¨',
    columns: [
      {
        badge: 'Chat Lock',
        name: 'à¦¹à§‹à§Ÿà¦¾à¦Ÿà¦¸à¦…à§à¦¯à¦¾à¦ª à¦šà§à¦¯à¦¾à¦Ÿ à¦²à¦•',
        role: 'à¦«à¦¿à¦™à§à¦—à¦¾à¦°à¦ªà§à¦°à¦¿à¦¨à§à¦Ÿ à¦ªà§à¦°à¦Ÿà§‡à¦•à¦¶à¦¨',
        color: '#22C55E',
        points: [
          { bold: 'à¦«à¦¿à¦™à§à¦—à¦¾à¦°à¦ªà§à¦°à¦¿à¦¨à§à¦Ÿ à¦›à¦¾à§œà¦¾ à¦²à¦• à¦–à§à¦²à¦¬à§‡ à¦¨à¦¾', desc: 'à¦…à¦¨à§à¦¯ à¦•à§‡à¦‰ à¦«à§‹à¦¨ à¦¨à¦¿à¦²à§‡à¦“ à¦¨à¦¿à¦°à¦¾à¦ªà¦¦' },
          { bold: 'à¦—à§‹à¦ªà¦¨ à¦šà§à¦¯à¦¾à¦Ÿ à¦«à§‹à¦²à§à¦¡à¦¾à¦°', desc: 'à¦¹à§‹à¦® à¦¸à§à¦•à§à¦°à¦¿à¦¨ à¦¥à§‡à¦•à§‡ à¦¹à¦¾à¦‡à¦¡ à¦¥à¦¾à¦•à§‡' },
          { bold: 'à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦ªà§à¦°à¦¿à¦­à¦¿à¦‰ à¦…à¦«', desc: 'à¦®à§‡à¦¸à§‡à¦œà§‡à¦° à¦¨à¦¾à¦® à¦¬à¦¾ à¦Ÿà§‡à¦•à§à¦¸à¦Ÿ à¦²à§à¦•à¦¾à¦¨à§‹' },
          { bold: 'à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦¤à¦¥à§à¦¯ à¦¸à§à¦°à¦•à§à¦·à¦¿à¦¤', desc: 'à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦šà§à¦¯à¦¾à¦Ÿà§‡ à¦•à¦¾à¦°à§à¦¯à¦•à¦°' }
        ]
      },
      {
        badge: 'Profile Lock',
        name: 'à¦«à§‡à¦¸à¦¬à§à¦• à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦—à¦¾à¦°à§à¦¡',
        role: 'à¦†à¦‡à¦¡à¦¿ à¦•à§à¦²à§‹à¦¨à¦¿à¦‚ à¦°à§‹à¦§',
        color: '#1877F2',
        points: [
          { bold: 'à¦›à¦¬à¦¿ à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦¬à¦¨à§à¦§', desc: 'à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦ªà¦¿à¦•à¦šà¦¾à¦° à¦•à§‡à¦‰ à¦¨à¦¿à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡ à¦¨à¦¾' },
          { bold: 'à¦¸à§à¦•à§à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦ªà§à¦°à¦Ÿà§‡à¦•à¦¶à¦¨', desc: 'à¦†à¦‡à¦¡à¦¿ à¦¥à§‡à¦•à§‡ à¦¸à§à¦•à§à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦¬à§à¦²à¦•' },
          { bold: 'à¦…à¦šà§‡à¦¨à¦¾ à¦«à§à¦°à§‡à¦¨à§à¦¡ à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦°', desc: 'à¦…à¦ªà¦°à¦¿à¦šà¦¿à¦¤ à¦®à¦¾à¦¨à§à¦· à¦¦à§‡à¦–à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡ à¦¨à¦¾' },
          { bold: 'à¦­à§à§Ÿà¦¾ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦°à§‹à¦§', desc: 'à¦†à¦ªà¦¨à¦¾à¦° à¦›à¦¬à¦¿ à¦¦à¦¿à§Ÿà§‡ à¦­à§à§Ÿà¦¾ à¦†à¦‡à¦¡à¦¿ à¦¬à¦¨à§à¦§' }
        ]
      },
      {
        badge: '2-Factor',
        name: 'à¦Ÿà§-à¦«à§à¦¯à¦¾à¦•à§à¦Ÿà¦° à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨',
        role: 'à¦¹à§à¦¯à¦¾à¦•à¦¿à¦‚ à¦ªà§à¦°à¦¤à¦¿à¦°à§‹à¦§',
        color: '#F59E0B',
        points: [
          { bold: 'à¦ªà¦¾à¦¸à¦“à§Ÿà¦¾à¦°à§à¦¡ à¦ªà§‡à¦²à§‡à¦“ à¦²à¦—à¦‡à¦¨ à¦…à¦¸à¦®à§à¦­à¦¬', desc: 'à¦“à¦Ÿà¦¿à¦ªà¦¿ à¦•à§‹à¦¡ à¦›à¦¾à§œà¦¾ à¦¨à§‹ à¦à¦¨à§à¦Ÿà§à¦°à¦¿' },
          { bold: 'à¦¨à¦¤à§à¦¨ à¦¡à¦¿à¦­à¦¾à¦‡à¦¸à§‡ à¦…à§à¦¯à¦¾à¦²à¦¾à¦°à§à¦Ÿ', desc: 'à¦•à§‡à¦‰ à¦¢à§‹à¦•à¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à¦°à¦²à§‡à¦‡ à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨' },
          { bold: 'à¦¸à¦¿à¦® à¦¸à§‹à§Ÿà¦¾à¦ªà¦¿à¦‚ à¦¥à§‡à¦•à§‡ à¦°à¦•à§à¦·à¦¾', desc: 'à¦…à¦¥à§‡à¦¨à¦Ÿà¦¿à¦•à§‡à¦Ÿà¦° à¦…à§à¦¯à¦¾à¦ª à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨' },
          { bold: 'à¦¸à¦¬ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿà§‡ à¦œà¦°à§à¦°à¦¿', desc: 'à¦«à§‡à¦¸à¦¬à§à¦• à¦“ à¦œà¦¿à¦®à§‡à¦‡à¦²à§‡ à¦à¦–à¦¨à¦‡ à¦…à¦¨ à¦°à¦¾à¦–à§à¦¨' }
        ]
      },
      {
        badge: 'Silence Call',
        name: 'à¦…à¦šà§‡à¦¨à¦¾ à¦•à¦² à¦¸à¦¾à¦‡à¦²à§‡à¦¨à§à¦¸',
        role: 'à¦¸à§à¦ªà§à¦¯à¦¾à¦® à¦“ à¦¸à§à¦•à§à¦¯à¦¾à¦® à¦°à§‹à¦§',
        color: '#06B6D4',
        points: [
          { bold: 'à¦…à¦šà§‡à¦¨à¦¾ à¦¨à¦¾à¦®à§à¦¬à¦¾à¦° à¦°à¦¿à¦‚ à¦¹à¦¬à§‡ à¦¨à¦¾', desc: 'à¦¹à§‹à§Ÿà¦¾à¦Ÿà¦¸à¦…à§à¦¯à¦¾à¦ªà§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦®à¦¿à¦‰à¦Ÿ à¦¥à¦¾à¦•à¦¬à§‡' },
          { bold: 'à¦¸à§à¦ªà§à¦¯à¦¾à¦® à¦“ à¦ªà§à¦°à¦¤à¦¾à¦°à¦£à¦¾ à¦¥à§‡à¦•à§‡ à¦®à§à¦•à§à¦¤à¦¿', desc: 'à¦†à¦¨à§à¦¤à¦°à§à¦œà¦¾à¦¤à¦¿à¦• à¦­à§à§Ÿà¦¾ à¦•à¦² à¦¬à¦¨à§à¦§' },
          { bold: 'à¦•à¦² à¦²à¦— à¦¹à¦¿à¦¸à§à¦Ÿà§à¦°à¦¿à¦¤à§‡ à¦¦à§‡à¦–à¦¤à§‡ à¦ªà¦¾à¦¬à§‡à¦¨', desc: 'à¦œà¦°à§à¦°à¦¿ à¦¹à¦²à§‡ à¦ªà¦°à§‡ à¦•à¦²à¦¬à§à¦¯à¦¾à¦• à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨' },
          { bold: 'à¦¸à¦¾à¦‡à¦¬à¦¾à¦° à¦Ÿà§à¦°à§à¦¯à¦¾à¦•à¦¿à¦‚ à¦¬à¦¨à§à¦§', desc: 'à¦†à¦‡à¦ªà¦¿ à¦…à§à¦¯à¦¾à¦¡à§à¦°à§‡à¦¸ à¦—à§‹à¦ªà¦¨ à¦°à¦¾à¦–à§‡' }
        ]
      }
    ],
    bottomTags: [
      { need: 'à¦—à§‹à¦ªà¦¨ à¦šà§à¦¯à¦¾à¦Ÿ', use: 'à¦šà§à¦¯à¦¾à¦Ÿ à¦²à¦•' },
      { need: 'à¦›à¦¬à¦¿ à¦¸à§à¦°à¦•à§à¦·à¦¾', use: 'à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦—à¦¾à¦°à§à¦¡' },
      { need: 'à¦¹à§à¦¯à¦¾à¦• à¦°à§‹à¦§', use: '2-Factor à¦…à¦¨' },
      { need: 'à¦¸à§à¦ªà§à¦¯à¦¾à¦® à¦•à¦²', use: 'à¦¸à¦¾à¦‡à¦²à§‡à¦¨à§à¦¸ à¦•à¦²' }
    ],
    takeaway: 'à¦¸à§‹à¦¶à§à¦¯à¦¾à¦² à¦®à¦¿à¦¡à¦¿à§Ÿà¦¾ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦¸à§à¦°à¦•à§à¦·à¦¿à¦¤ à¦°à¦¾à¦–à¦¤à§‡ à¦à¦‡ à§ªà¦Ÿà¦¿ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦†à¦œà¦‡ à¦…à¦¨ à¦•à¦°à§‡ à¦¨à¦¿à¦¨à¥¤'
  },

  // 6. Smartphone Battery Health Care
  battery_care: {
    title: 'à¦«à§‹à¦¨à§‡à¦° à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¦à§€à¦°à§à¦˜à¦¸à§à¦¥à¦¾à¦¯à¦¼à§€ à¦•à¦°à¦¾à¦° à§ªà¦Ÿà¦¿ à¦—à§‹à¦²à§à¦¡à§‡à¦¨ à¦°à§à¦²!',
    subtitle: 'à¦¨à¦¿à§Ÿà¦® à¦œà¦¾à¦¨à§à¦¨ â€¢ à¦šà¦¾à¦°à§à¦œ à¦¦à¦¿à¦¨ â€¢ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿à¦° à¦†à§Ÿà§ à¦¬à¦¾à§œà¦¾à¦¨',
    columns: [
      {
        badge: '20-80% Rule',
        name: 'à¦¸à¦ à¦¿à¦• à¦šà¦¾à¦°à§à¦œà¦¿à¦‚ à¦°à§à¦²',
        role: 'à¦²à¦¿à¦¥à¦¿à§Ÿà¦¾à¦® à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦•à§‡à§Ÿà¦¾à¦°',
        color: '#10B981',
        points: [
          { bold: 'à§¨à§¦% à¦à¦° à¦¨à¦¿à¦šà§‡ à¦¨à¦¾à¦®à¦¾à¦¬à§‡à¦¨ à¦¨à¦¾', desc: 'à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿à¦° à¦“à¦ªà¦° à¦…à¦¤à¦¿à¦°à¦¿à¦•à§à¦¤ à¦šà¦¾à¦ª à¦ªà§œà§‡' },
          { bold: 'à§®à§¦-à§®à§«% à¦¹à¦²à§‡ à¦šà¦¾à¦°à§à¦œà¦¾à¦° à¦–à§à¦²à§à¦¨', desc: 'à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿à¦° à¦¸à¦¾à¦‡à¦•à§‡à¦² à¦²à¦¾à¦‡à¦« à¦¦à§à¦¬à¦¿à¦—à§à¦£ à¦¹à§Ÿ' },
          { bold: 'à¦¸à¦¾à¦°à¦¾à¦°à¦¾à¦¤ à¦šà¦¾à¦°à§à¦œà§‡ à¦¨à§Ÿ', desc: 'à¦“à¦­à¦¾à¦°à¦¹à¦¿à¦Ÿà¦¿à¦‚ à¦“ à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦«à§‹à¦²à¦¾ à¦°à§‹à¦§' },
          { bold: 'à¦¸à§à¦¬à¦¾à¦­à¦¾à¦¬à¦¿à¦• à¦¤à¦¾à¦ªà¦®à¦¾à¦¤à§à¦°à¦¾à§Ÿ à¦šà¦¾à¦°à§à¦œ', desc: 'à¦°à§‹à¦¦à§‡ à¦¬à¦¾ à¦¬à¦¾à¦²à¦¿à¦¶à§‡à¦° à¦¨à¦¿à¦šà§‡ à¦¨à§Ÿ' }
        ]
      },
      {
        badge: 'Background',
        name: 'à¦¬à§à¦¯à¦¾à¦•à¦—à§à¦°à¦¾à¦‰à¦¨à§à¦¡ à¦…à§à¦¯à¦¾à¦ªà¦¸',
        role: 'à¦šà¦¾à¦°à§à¦œ à¦¡à§à¦°à§‡à¦¨ à¦ªà§à¦°à¦¤à¦¿à¦°à§‹à¦§',
        color: '#3B82F6',
        points: [
          { bold: 'à¦…à¦¬à§à¦¯à¦¬à¦¹à§ƒà¦¤ à¦¬à§à¦¯à¦¾à¦•à¦—à§à¦°à¦¾à¦‰à¦¨à§à¦¡ à¦…à¦«', desc: 'à¦«à§‡à¦¸à¦¬à§à¦•/à¦‡à¦¨à¦¸à§à¦Ÿà¦¾ à¦¬à§à¦¯à¦¾à¦•à¦—à§à¦°à¦¾à¦‰à¦¨à§à¦¡ à¦®à¦¿à¦‰à¦Ÿ' },
          { bold: 'à¦œà¦¿à¦ªà¦¿à¦à¦¸ à¦“ à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦¨à¦¿à§Ÿà¦¨à§à¦¤à§à¦°à¦£', desc: 'à¦ªà§à¦°à§Ÿà§‹à¦œà¦¨ à¦›à¦¾à§œà¦¾ à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦…à¦« à¦°à¦¾à¦–à§à¦¨' },
          { bold: 'à¦…à¦Ÿà§‹ à¦¸à¦¿à¦™à§à¦• à¦¬à¦¨à§à¦§ à¦•à¦°à§à¦¨', desc: 'à¦•à§à¦²à¦¾à¦‰à¦¡ à¦¸à¦¿à¦™à§à¦• à¦®à§à¦¯à¦¾à¦¨à§à§Ÿà¦¾à¦²à¦¿ à¦•à¦°à§à¦¨' },
          { bold: 'à¦ªà§à¦°à¦¸à§‡à¦¸à¦° à¦ à¦¾à¦¨à§à¦¡à¦¾ à¦°à¦¾à¦–à§‡', desc: 'à¦«à§‹à¦¨ à¦¸à§à¦²à§‹ à¦¹à¦“à§Ÿà¦¾ à¦¥à§‡à¦•à§‡ à¦°à¦•à§à¦·à¦¾' }
        ]
      },
      {
        badge: 'Dark Mode',
        name: 'à¦¡à¦¾à¦°à§à¦• à¦®à§‹à¦¡ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°',
        role: 'à¦¡à¦¿à¦¸à¦ªà§à¦²à§‡ à¦ªà¦¾à¦“à§Ÿà¦¾à¦° à¦¸à§‡à¦­à¦¿à¦‚',
        color: '#8B5CF6',
        points: [
          { bold: 'AMOLED à¦¸à§à¦•à§à¦°à¦¿à¦¨à§‡ à¦¬à¦¿à¦¦à§à¦¯à§à§Ž à¦¸à¦¾à¦¶à§à¦°à§Ÿ', desc: 'à¦•à¦¾à¦²à§‹ à¦ªà¦¿à¦•à§à¦¸à§‡à¦²à§‡ à¦¶à§‚à¦¨à§à¦¯ à¦¬à¦¿à¦¦à§à¦¯à§à§Ž à¦–à¦°à¦š' },
          { bold: 'à§©à§¦% à¦ªà¦°à§à¦¯à¦¨à§à¦¤ à¦šà¦¾à¦°à§à¦œ à¦¸à¦¾à¦¶à§à¦°à§Ÿ', desc: 'à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦¬à§à¦¯à¦¾à¦•à¦†à¦ª à¦‰à¦²à§à¦²à§‡à¦–à¦¯à§‹à¦—à§à¦¯ à¦¬à¦¾à§œà§‡' },
          { bold: 'à¦šà§‹à¦–à§‡à¦° à¦“à¦ªà¦° à¦šà¦¾à¦ª à¦•à¦®à¦¾à§Ÿ', desc: 'à¦°à¦¾à¦¤à§‡à¦° à¦¬à§‡à¦²à¦¾ à¦šà§‹à¦–à§‡à¦° à¦•à§à¦²à¦¾à¦¨à§à¦¤à¦¿ à¦¹à§à¦°à¦¾à¦¸' },
          { bold: 'à¦¸à¦¬ à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦®à§‡ à¦…à¦¨ à¦°à¦¾à¦–à§à¦¨', desc: 'à¦¸à¦¿à¦¸à§à¦Ÿà§‡à¦® à¦“ à¦¬à§à¦°à¦¾à¦‰à¦œà¦¾à¦°à§‡ à¦¡à¦¾à¦°à§à¦• à¦¥à¦¿à¦®' }
        ]
      },
      {
        badge: 'Adapter',
        name: 'à¦…à¦°à¦¿à¦œà¦¿à¦¨à¦¾à¦² à¦šà¦¾à¦°à§à¦œà¦¾à¦°',
        role: 'à¦­à§‹à¦²à§à¦Ÿà§‡à¦œ à¦ªà§à¦°à¦Ÿà§‡à¦•à¦¶à¦¨',
        color: '#F43F5E',
        points: [
          { bold: 'à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦šà¦¾à¦°à§à¦œà¦¾à¦° à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦°', desc: 'à¦¸à¦ à¦¿à¦• à¦“à§Ÿà¦¾à¦Ÿ à¦“ à¦­à§‹à¦²à§à¦Ÿà§‡à¦œ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤' },
          { bold: 'à¦²à§‹à¦•à¦¾à¦² à¦¸à¦¸à§à¦¤à¦¾ à¦•à§à¦¯à¦¾à¦¬à¦² à¦¨à§Ÿ', desc: 'à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿à¦° à¦¸à§‡à¦² à¦¨à¦·à§à¦Ÿ à¦¹à¦“à§Ÿà¦¾ à¦¥à§‡à¦•à§‡ à¦°à¦•à§à¦·à¦¾' },
          { bold: 'à¦šà¦¾à¦°à§à¦œ à¦¦à§‡à¦“à§Ÿà¦¾à¦° à¦¸à¦®à§Ÿ à¦—à§‡à¦®à¦¿à¦‚ à¦¨à§Ÿ', desc: 'à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§à¦¤ à¦—à¦°à¦® à¦¹à§Ÿà§‡ à¦•à§à¦·à¦¤à¦¿à¦—à§à¦°à¦¸à§à¦¤' },
          { bold: 'à¦¶à¦°à§à¦Ÿ à¦¸à¦¾à¦°à§à¦•à¦¿à¦Ÿ à¦à§à¦à¦•à¦¿ à¦¶à§‚à¦¨à§à¦¯', desc: 'à¦¨à¦¿à¦°à¦¾à¦ªà¦¦ à¦ªà¦¾à¦“à§Ÿà¦¾à¦° à¦Ÿà§à¦°à¦¾à¦¨à§à¦¸à¦«à¦¾à¦°' }
        ]
      }
    ],
    bottomTags: [
      { need: 'à¦šà¦¾à¦°à§à¦œà¦¿à¦‚ à¦°à§à¦²', use: 'à§¨à§¦-à§®à§¦% à¦¨à¦¿à§Ÿà¦®' },
      { need: 'à¦…à§à¦¯à¦¾à¦ªà¦¸ à¦¨à¦¿à§Ÿà¦¨à§à¦¤à§à¦°à¦£', use: 'à¦¬à§à¦¯à¦¾à¦•à¦—à§à¦°à¦¾à¦‰à¦¨à§à¦¡ à¦…à¦«' },
      { need: 'à¦¡à¦¿à¦¸à¦ªà§à¦²à§‡ à¦®à§‹à¦¡', use: 'à¦¡à¦¾à¦°à§à¦• à¦®à§‹à¦¡' },
      { need: 'à¦…à§à¦¯à¦¾à¦¡à¦¾à¦ªà§à¦Ÿà¦¾à¦°', use: 'à¦…à¦°à¦¿à¦œà¦¿à¦¨à¦¾à¦² à¦šà¦¾à¦°à§à¦œà¦¾à¦°' }
    ],
    takeaway: 'à¦¸à¦ à¦¿à¦• à¦¨à¦¿à§Ÿà¦®à§‡ à¦šà¦¾à¦°à§à¦œ à¦¦à¦¿à¦²à§‡ à¦«à§‹à¦¨à§‡à¦° à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿ à§©-à§ª à¦¬à¦›à¦° à¦¨à¦¤à§à¦¨à§‡à¦° à¦®à¦¤à§‹ à¦¸à¦¾à¦°à§à¦­à¦¿à¦¸ à¦¦à§‡à¦¬à§‡à¥¤'
  }
};

// -------------------------------------------------------------
// INTELLIGENT TOPIC SELECTOR
// -------------------------------------------------------------
function resolveInfographicTopic(rawQuery) {
  if (!rawQuery) return INFOGRAPHIC_TOPICS.secret_codes;

  const text = (rawQuery.topic || rawQuery.title || '').toLowerCase();

  // 1. Direct Topic Matching
  if (text.includes('whatsapp') || text.includes('à¦¹à§‹à¦¯à¦¼à¦¾à¦Ÿà¦¸à¦…à§à¦¯à¦¾à¦ª') || text.includes('facebook') || text.includes('à¦«à§‡à¦¸à¦¬à§à¦•') || text.includes('à¦šà§à¦¯à¦¾à¦Ÿ') || text.includes('à¦²à¦•') || text.includes('à¦®à§‡à¦¸à§‡à¦žà§à¦œà¦¾à¦°') || text.includes('social')) {
    return INFOGRAPHIC_TOPICS.social_privacy;
  }
  if (text.includes('battery') || text.includes('à¦¬à§à¦¯à¦¾à¦Ÿà¦¾à¦°à¦¿') || text.includes('à¦šà¦¾à¦°à§à¦œ') || text.includes('charge')) {
    return INFOGRAPHIC_TOPICS.battery_care;
  }
  if (text.includes('ai') || text.includes('à¦à¦†à¦‡') || text.includes('chatgpt') || text.includes('à¦Ÿà§à¦²')) {
    return INFOGRAPHIC_TOPICS.ai_tools;
  }
  if (text.includes('dial') || text.includes('code') || text.includes('à¦•à§‹à¦¡') || text.includes('*#') || text.includes('à¦•à¦²') || text.includes('à¦¡à¦¾à¦¯à¦¼à¦¾à¦²') || text.includes('à¦¡à¦¾à§Ÿà¦¾à¦²')) {
    return INFOGRAPHIC_TOPICS.secret_codes;
  }
  if (text.includes('scam') || text.includes('à¦¸à§à¦•à§à¦¯à¦¾à¦®') || text.includes('à¦ªà§à¦°à¦¤à¦¾à¦°à¦£à¦¾') || text.includes('à¦¬à¦¿à¦•à¦¾à¦¶') || text.includes('à¦¨à¦—à¦¦') || text.includes('à¦“à¦Ÿà¦¿à¦ªà¦¿') || text.includes('otp')) {
    return INFOGRAPHIC_TOPICS.scam_defense;
  }
  if (text.includes('pc') || text.includes('à¦ªà¦¿à¦¸à¦¿') || text.includes('à¦•à¦®à§à¦ªà¦¿à¦‰à¦Ÿà¦¾à¦°') || text.includes('à¦‰à¦‡à¦¨à§à¦¡à§‹à¦œ') || text.includes('à¦¶à¦°à§à¦Ÿà¦•à¦¾à¦Ÿ') || text.includes('shortcut')) {
    return INFOGRAPHIC_TOPICS.pc_shortcuts;
  }

  // If slot parameter is passed
  if (rawQuery.slot === '1') return INFOGRAPHIC_TOPICS.secret_codes;
  if (rawQuery.slot === '2') return INFOGRAPHIC_TOPICS.scam_defense;
  if (rawQuery.slot === '3') return INFOGRAPHIC_TOPICS.ai_tools;
  if (rawQuery.slot === '4') return INFOGRAPHIC_TOPICS.pc_shortcuts;
  if (rawQuery.slot === '5') return INFOGRAPHIC_TOPICS.social_privacy;
  if (rawQuery.slot === '6') return INFOGRAPHIC_TOPICS.battery_care;

  // Default fallback rotates based on current minute so even repeated generic calls look distinct
  const keys = Object.keys(INFOGRAPHIC_TOPICS);
  const rotIdx = new Date().getMinutes() % keys.length;
  return INFOGRAPHIC_TOPICS[keys[rotIdx]];
}

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Smart Tech Bangla Karvion-Style Infographic Engine is running!',
    available_topics: Object.keys(INFOGRAPHIC_TOPICS)
  });
});

// Primary Endpoint for Make.com / Browsers
app.get(['/card', '/card.jpg', '/image.jpg', '/infographic'], (req, res) => {
  try {
    const topicData = resolveInfographicTopic(req.query);

    // If query provides custom title or subtitle, allow overriding
    const dataToRender = {
      title: req.query.custom_title || topicData.title,
      subtitle: req.query.custom_subtitle || topicData.subtitle,
      columns: topicData.columns,
      bottomTags: topicData.bottomTags,
      takeaway: req.query.custom_takeaway || topicData.takeaway
    };

    const imageBuffer = renderInfographicCard(dataToRender);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=3600',
      'Accept-Ranges': 'bytes'
    });
    res.send(imageBuffer);
  } catch (err) {
    console.error('Infographic render error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Dynamic Custom Infographic via POST (for future expansion)
app.post('/infographic', (req, res) => {
  try {
    const { title, subtitle, columns, bottomTags, takeaway } = req.body;
    if (!title || !columns || !columns.length) {
      return res.status(400).json({ error: 'Missing required fields: title, columns' });
    }
    const imageBuffer = renderInfographicCard({
      title,
      subtitle: subtitle || 'à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£ à¦—à¦¾à¦‡à¦¡à¦²à¦¾à¦‡à¦¨',
      columns,
      bottomTags: bottomTags || [],
      takeaway: takeaway || 'à¦ªà§à¦°à§Ÿà§‹à¦œà¦¨ à¦…à¦¨à§à¦¯à¦¾à§Ÿà§€ à¦¸à¦ à¦¿à¦• à¦Ÿà§à¦² à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨ à¦•à¦°à§à¦¨à¥¤'
    });
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'no-cache'
    });
    res.send(imageBuffer);
  } catch (err) {
    console.error('Custom Infographic render error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ðŸš€ Smart Tech Bangla Karvion-Style Infographic Server running on port ${PORT}`);
});
