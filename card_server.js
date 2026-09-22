const express = require('express');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Register Bengali Fonts
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-Bold.ttf'), 'HindSiliguri');
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-SemiBold.ttf'), 'HindSiliguriSemiBold');

function renderCard({ headline = 'আপনার পাসওয়ার্ড কি হ্যাক হয়েছে? এখনই চেক করুন!', category = '#সাইবার_নিরাপত্তা', subtitle = 'ক্লিক করে পুরো পোস্টটি পড়ুন এবং এখনই সতর্ক থাকুন!' }) {
  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Dark Cyber Gradient Background
  const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.4, 100, width * 0.5, height * 0.5, 750);
  bgGrad.addColorStop(0, '#0d1527');
  bgGrad.addColorStop(0.5, '#070a14');
  bgGrad.addColorStop(1, '#020408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Neon Ambient Glows
  const cyanGlow = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, 400);
  cyanGlow.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
  cyanGlow.addColorStop(1, 'rgba(0, 229, 255, 0)');
  ctx.fillStyle = cyanGlow;
  ctx.fillRect(0, 0, width, height);

  const purpleGlow = ctx.createRadialGradient(width * 0.2, height * 0.8, 0, width * 0.2, height * 0.8, 450);
  purpleGlow.addColorStop(0, 'rgba(157, 0, 255, 0.18)');
  purpleGlow.addColorStop(1, 'rgba(157, 0, 255, 0)');
  ctx.fillStyle = purpleGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Tech Grid Lines
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
  ctx.lineWidth = 1.5;
  for (let x = 60; x < width; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 60; y < height; y += 120) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 4. Central Glassmorphism Card
  const cardX = 70;
  const cardY = 160;
  const cardW = 940;
  const cardH = 800;
  const cardR = 36;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
  ctx.fillStyle = 'rgba(13, 22, 40, 0.78)';
  ctx.fill();

  // Glass Card Border Gradient (Cyan to Purple)
  const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  borderGrad.addColorStop(0, 'rgba(0, 229, 255, 0.6)');
  borderGrad.addColorStop(0.5, 'rgba(157, 0, 255, 0.3)');
  borderGrad.addColorStop(1, 'rgba(0, 229, 255, 0.4)');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // 5. Header Branding: Smart Tech Bangla
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX + 50, cardY + 50, 280, 56, 28);
  ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#00e5ff';
  ctx.font = 'bold 22px HindSiliguri';
  ctx.fillText('SMART TECH BANGLA', cardX + 70, cardY + 86);

  // Category Tag on right
  const catText = category.startsWith('#') ? category : `#${category}`;
  ctx.font = '600 24px HindSiliguri';
  const catW = ctx.measureText(catText).width;
  ctx.beginPath();
  ctx.roundRect(cardX + cardW - catW - 90, cardY + 50, catW + 40, 56, 28);
  ctx.fillStyle = 'rgba(157, 0, 255, 0.18)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(157, 0, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#d896ff';
  ctx.fillText(catText, cardX + cardW - catW - 70, cardY + 86);
  ctx.restore();

  // 6. Vector Glowing Cyber Shield & Lock in center
  ctx.save();
  const iconY = cardY + 230;
  ctx.beginPath();
  ctx.arc(width * 0.5, iconY, 65, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
  ctx.fill();
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 25;
  ctx.stroke();

  // Draw Shield Vector
  ctx.save();
  ctx.translate(width * 0.5, iconY);
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(26, -18);
  ctx.lineTo(22, 14);
  ctx.lineTo(0, 30);
  ctx.lineTo(-22, 14);
  ctx.lineTo(-26, -18);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
  ctx.fill();
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 15;
  ctx.stroke();

  // Draw Inner Keyhole / Lock Circle
  ctx.beginPath();
  ctx.arc(0, -4, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-3, -2);
  ctx.lineTo(3, -2);
  ctx.lineTo(5, 12);
  ctx.lineTo(-5, 12);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // 7. Bold Bengali Headline
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px HindSiliguri';
  ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
  ctx.shadowBlur = 18;

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], x, startY + (i * lineHeight));
    }
    return startY + (lines.length * lineHeight);
  }

  const headlineY = cardY + 410;
  wrapText(ctx, headline, width * 0.5, headlineY, 820, 75);
  ctx.restore();

  // 8. Subtitle
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#a0b3d6';
  ctx.font = '500 28px HindSiliguri';
  ctx.fillText(subtitle, width * 0.5, cardY + 620);
  ctx.restore();

  // 9. Card Footer
  ctx.save();
  const footerY = cardY + 710;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, footerY - 20);
  ctx.lineTo(cardX + cardW - 40, footerY - 20);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#00e5ff';
  ctx.font = 'bold 24px HindSiliguri';
  ctx.fillText('Like  •  Comment  •  Share', width * 0.5, footerY + 25);
  ctx.restore();

  // 10. Outer Page Footer
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = '600 20px HindSiliguri';
  ctx.fillText('facebook.com/SmartTechBangla  |  @smart_techbangla', width * 0.5, height - 45);
  ctx.restore();

  return canvas.toBuffer('image/jpeg');
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Tech Bangla Card Generator API is running!' });
});

// Dynamic Card Endpoint
app.get('/card', (req, res) => {
  try {
    const headline = req.query.title || 'আপনার পাসওয়ার্ড কি হ্যাক হয়েছে? এখনই চেক করুন!';
    const category = req.query.category || '#সাইবার_নিরাপত্তা';
    const subtitle = req.query.subtitle || 'ক্লিক করে পুরো পোস্টটি পড়ুন এবং এখনই সতর্ক থাকুন!';

    const imageBuffer = renderCard({ headline, category, subtitle });
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(imageBuffer);
  } catch (err) {
    console.error('Render error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Card Generator server running on port ${PORT}`);
});
