const express = require('express');
const { createCanvas, GlobalFonts, Path2D } = require('@napi-rs/canvas');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Register Bengali Fonts
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-Bold.ttf'), 'HindSiliguri');
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-SemiBold.ttf'), 'HindSiliguriSemiBold');

function hasBengali(text) {
  return /[\u0980-\u09FF]/.test(text);
}

// Split headline into 2 balanced lines
function splitHeadline(headline) {
  if (headline.includes('?') && headline.indexOf('?') < headline.length - 2) {
    const parts = headline.split('?');
    return { line1: parts[0].trim() + '?', line2: parts.slice(1).join('?').trim() };
  }
  if (headline.includes('!') && headline.indexOf('!') < headline.length - 2) {
    const parts = headline.split('!');
    return { line1: parts[0].trim() + '!', line2: parts.slice(1).join('!').trim() };
  }
  const words = headline.split(' ');
  if (words.length <= 4) {
    return { line1: headline, line2: '' };
  }
  const mid = Math.ceil(words.length / 2);
  return { line1: words.slice(0, mid).join(' '), line2: words.slice(mid).join(' ') };
}

// Extract dial code if present in headline (e.g. *#21#, ##002#, *#06#)
function extractCode(text) {
  const match = text.match(/([*#]+[\w\d]+[*#]+)/);
  return match ? match[1] : '*#21#';
}

// -------------------------------------------------------------
// TEMPLATE 1: SMARTPHONE DIALER CODE (For Secret Codes)
// -------------------------------------------------------------
function renderDialerCard({ code, headline }) {
  const width = 1440, height = 1440;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#0A0F1D');
  bg.addColorStop(0.5, '#070A14');
  bg.addColorStop(1, '#02040A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const aura = ctx.createRadialGradient(width * 0.5, 420, 50, width * 0.5, 420, 520);
  aura.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(width * 0.5, 420, 520, 0, Math.PI * 2);
  ctx.fill();

  // Header Brand
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(80, 70, 360, 68, 34);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(118, 104, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#0EA5E9';
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(112, 104); ctx.lineTo(116, 108); ctx.lineTo(124, 99);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Smart Tech Bangla', 148, 106);
  ctx.restore();

  // Tag
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width - 340, 70, 260, 68, 34);
  ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 24px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('গোপন সিক্রেট কোড', width - 210, 105);
  ctx.restore();

  // Smartphone Dialer Keypad Box
  const phoneW = 580, phoneH = 430;
  const phoneX = (width - phoneW) / 2;
  const phoneY = 210;

  ctx.save();
  ctx.shadowColor = 'rgba(14, 165, 233, 0.45)';
  ctx.shadowBlur = 45;
  ctx.shadowOffsetY = 15;

  ctx.beginPath();
  ctx.roundRect(phoneX, phoneY, phoneW, phoneH, 36);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dialer Display
  ctx.beginPath();
  ctx.roundRect(phoneX + 30, phoneY + 28, phoneW - 60, 110, 24);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Code
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 76px monospace';
  ctx.fillStyle = '#38BDF8';
  ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
  ctx.shadowBlur = 25;
  ctx.fillText(code || '*#21#', width * 0.5, phoneY + 83);
  ctx.shadowColor = 'transparent';

  // Numeric Keys
  const keys = ['1', '2', '3', '*', '0', '#'];
  const startKeyX = phoneX + 90, startKeyY = phoneY + 185;
  const gapX = 135, gapY = 105;

  keys.forEach((k, idx) => {
    const col = idx % 3, row = Math.floor(idx / 3);
    const kx = startKeyX + col * gapX;
    const ky = startKeyY + row * gapY;

    ctx.beginPath();
    ctx.arc(kx, ky, 38, 0, Math.PI * 2);
    ctx.fillStyle = (k === '*' || k === '#') ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = (k === '*' || k === '#') ? 'rgba(56, 189, 248, 0.55)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = (k === '*' || k === '#') ? '#38BDF8' : '#F8FAFC';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(k, kx, ky);
  });

  // Call Button
  const callBtnX = phoneX + phoneW - 85, callBtnY = phoneY + 238;
  ctx.beginPath();
  ctx.arc(callBtnX, callBtnY, 48, 0, Math.PI * 2);
  ctx.fillStyle = '#10B981';
  ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
  ctx.shadowBlur = 25;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Phone Call Symbol
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(callBtnX, callBtnY, 20, Math.PI * 0.2, Math.PI * 0.8, false);
  ctx.stroke();
  ctx.restore();

  // Headline
  const { line1, line2 } = splitHeadline(headline);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (line2) {
    ctx.font = 'bold 72px HindSiliguri';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fillText(line1, width * 0.5, 780);

    ctx.font = 'bold 78px HindSiliguri';
    ctx.fillStyle = '#FBBF24'; // Golden Yellow
    ctx.fillText(line2, width * 0.5, 885);
  } else {
    ctx.font = 'bold 78px HindSiliguri';
    ctx.fillStyle = '#FBBF24';
    ctx.fillText(line1, width * 0.5, 830);
  }
  ctx.restore();

  // Action Pill
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width * 0.5 - 380, 1040, 760, 84, 42);
  ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 32px HindSiliguri';
  ctx.fillText('ডায়াল করে ফলাফল দেখতে ক্যাপশনটি পড়ুন', width * 0.5, 1084);
  ctx.restore();

  // Footer
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
  ctx.font = '500 25px HindSiliguri';
  ctx.fillText('facebook.com/SmartTechBangla   •   @smart_techbangla', width * 0.5, 1360);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 1.0 });
}

// -------------------------------------------------------------
// TEMPLATE 2: SOCIAL MEDIA PRIVACY (WhatsApp/Facebook 3D Glossy)
// -------------------------------------------------------------
function renderSocialCard({ brand, headline }) {
  const width = 1440, height = 1440;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(0.6, '#F8FAFC');
  bg.addColorStop(1, '#F1F5F9');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const aura = ctx.createRadialGradient(width * 0.5, 460, 50, width * 0.5, 460, 480);
  aura.addColorStop(0, brand.glow);
  aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(width * 0.5, 460, 480, 0, Math.PI * 2);
  ctx.fill();

  // Brand Header
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(80, 70, 360, 68, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 16;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(118, 104, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#2563EB';
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(112, 104); ctx.lineTo(116, 108); ctx.lineTo(124, 99);
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 26px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Smart Tech Bangla', 148, 106);
  ctx.restore();

  // Tag
  ctx.save();
  const pillW = 280;
  ctx.beginPath();
  ctx.roundRect(width - pillW - 80, 70, pillW, 68, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 16;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width - pillW - 80 + 38, 104, 7, 0, Math.PI * 2);
  ctx.fillStyle = brand.color;
  ctx.fill();

  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 24px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(brand.tag, width - pillW - 80 + 58, 106);
  ctx.restore();

  // 3D Glass Sphere
  const x = width * 0.5, y = 460, radius = 175;
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
  ctx.shadowOffsetY = 24;
  ctx.shadowBlur = 48;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
  ctx.lineWidth = 3;
  ctx.stroke();

  const sphereR = radius * 0.82;
  ctx.beginPath();
  ctx.arc(x, y, sphereR, 0, Math.PI * 2);
  const bodyGrad = ctx.createRadialGradient(x - sphereR * 0.35, y - sphereR * 0.45, sphereR * 0.1, x, y, sphereR);
  bodyGrad.addColorStop(0, brand.lightColor);
  bodyGrad.addColorStop(0.65, brand.color);
  bodyGrad.addColorStop(1, brand.darkColor);
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Glass Shine
  ctx.beginPath();
  ctx.ellipse(x, y - sphereR * 0.42, sphereR * 0.72, sphereR * 0.38, 0, 0, Math.PI * 2);
  const glassShine = ctx.createLinearGradient(x, y - sphereR * 0.8, x, y - sphereR * 0.05);
  glassShine.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
  glassShine.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
  glassShine.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glassShine;
  ctx.fill();

  // Icon
  ctx.translate(x, y);
  if (brand.name === 'whatsapp') {
    const waPath = new Path2D('M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z');
    ctx.translate(-85, -85);
    ctx.scale(0.38, 0.38);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 12;
    ctx.fill(waPath);
  } else if (brand.name === 'facebook') {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 210px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('f', 24, 28);
  } else {
    // Shield
    ctx.beginPath();
    ctx.moveTo(0, -72); ctx.lineTo(60, -42); ctx.lineTo(50, 32); ctx.lineTo(0, 72); ctx.lineTo(-50, 32); ctx.lineTo(-60, -42);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }
  ctx.restore();

  // Headline
  const { line1, line2 } = splitHeadline(headline);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (line2) {
    ctx.font = 'bold 72px HindSiliguri';
    ctx.fillStyle = '#090D16';
    ctx.fillText(line1, width * 0.5, 810);

    ctx.font = 'bold 76px HindSiliguri';
    ctx.fillStyle = brand.color;
    ctx.fillText(line2, width * 0.5, 920);
  } else {
    ctx.font = 'bold 78px HindSiliguri';
    ctx.fillStyle = '#090D16';
    ctx.fillText(line1, width * 0.5, 865);
  }
  ctx.restore();

  // Action Pill
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width * 0.5 - 340, 1080, 680, 80, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 18;
  ctx.fill();

  ctx.strokeStyle = 'rgba(226, 232, 240, 0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 30px HindSiliguri';
  ctx.fillText('বিস্তারিত নিয়ম জানতে সম্পূর্ণ পোস্টটি পড়ুন', width * 0.5, 1122);
  ctx.restore();

  // Footer
  ctx.save();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(140, 1310);
  ctx.lineTo(width - 140, 1310);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 25px HindSiliguri';
  ctx.fillText('facebook.com/SmartTechBangla   •   @smart_techbangla', width * 0.5, 1360);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 1.0 });
}

// -------------------------------------------------------------
// TEMPLATE 3: CYBER SCAM & OTP ALERT (Crimson/Amber Warning)
// -------------------------------------------------------------
function renderScamCard({ headline }) {
  const width = 1440, height = 1440;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#150A0F');
  bg.addColorStop(0.5, '#0F060A');
  bg.addColorStop(1, '#050204');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const aura = ctx.createRadialGradient(width * 0.5, 450, 40, width * 0.5, 450, 520);
  aura.addColorStop(0, 'rgba(239, 68, 68, 0.28)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(width * 0.5, 450, 520, 0, Math.PI * 2);
  ctx.fill();

  // Header Brand
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(80, 70, 360, 68, 34);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(118, 104, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#EF4444';
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(112, 104); ctx.lineTo(116, 108); ctx.lineTo(124, 99);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Smart Tech Bangla', 148, 106);
  ctx.restore();

  // Tag
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width - 340, 70, 260, 68, 34);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F87171';
  ctx.font = 'bold 24px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('অনলাইন স্ক্যাম অ্যালার্ট', width - 210, 105);
  ctx.restore();

  // Warning Centerpiece
  const cx = width * 0.5, cy = 440;
  ctx.save();
  ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
  ctx.shadowBlur = 50;

  ctx.beginPath();
  ctx.arc(cx, cy, 175, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(30, 10, 18, 0.9)';
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - 85);
  ctx.lineTo(cx + 70, cy - 50);
  ctx.lineTo(cx + 60, cy + 35);
  ctx.lineTo(cx, cy + 85);
  ctx.lineTo(cx - 60, cy + 35);
  ctx.lineTo(cx - 70, cy - 50);
  ctx.closePath();
  ctx.fillStyle = '#EF4444';
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 90px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', cx, cy + 4);
  ctx.restore();

  // Headline
  const { line1, line2 } = splitHeadline(headline);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (line2) {
    ctx.font = 'bold 72px HindSiliguri';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(line1, width * 0.5, 780);

    ctx.font = 'bold 76px HindSiliguri';
    ctx.fillStyle = '#F87171';
    ctx.fillText(line2, width * 0.5, 885);
  } else {
    ctx.font = 'bold 78px HindSiliguri';
    ctx.fillStyle = '#F87171';
    ctx.fillText(line1, width * 0.5, 830);
  }
  ctx.restore();

  // Action Pill
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width * 0.5 - 380, 1040, 760, 84, 42);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FCA5A5';
  ctx.font = 'bold 32px HindSiliguri';
  ctx.fillText('জালিয়াতি থেকে বাঁচতে সম্পূর্ণ পোস্টটি পড়ুন', width * 0.5, 1084);
  ctx.restore();

  // Footer
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
  ctx.font = '500 25px HindSiliguri';
  ctx.fillText('facebook.com/SmartTechBangla   •   @smart_techbangla', width * 0.5, 1360);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 1.0 });
}

// -------------------------------------------------------------
// TEMPLATE 4: AI & COMPUTING HACKS (Futuristic Neon Violet/Cyan)
// -------------------------------------------------------------
function renderAiCard({ headline }) {
  const width = 1440, height = 1440;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#0D0B18');
  bg.addColorStop(0.5, '#080612');
  bg.addColorStop(1, '#030208');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const aura = ctx.createRadialGradient(width * 0.5, 450, 40, width * 0.5, 450, 520);
  aura.addColorStop(0, 'rgba(168, 85, 247, 0.28)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(width * 0.5, 450, 520, 0, Math.PI * 2);
  ctx.fill();

  // Header Brand
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(80, 70, 360, 68, 34);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(118, 104, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#A855F7';
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(112, 104); ctx.lineTo(116, 108); ctx.lineTo(124, 99);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Smart Tech Bangla', 148, 106);
  ctx.restore();

  // Tag
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width - 340, 70, 260, 68, 34);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#C084FC';
  ctx.font = 'bold 24px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('এআই ও কম্পিউটার হ্যাক', width - 210, 105);
  ctx.restore();

  // AI Processor Chip
  const cx = width * 0.5, cy = 440;
  ctx.save();
  ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
  ctx.shadowBlur = 45;

  ctx.beginPath();
  ctx.roundRect(cx - 100, cy - 100, 200, 200, 32);
  ctx.fillStyle = 'rgba(24, 14, 38, 0.95)';
  ctx.strokeStyle = '#A855F7';
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (let i = -50; i <= 50; i += 34) {
    ctx.moveTo(cx + i, cy - 100); ctx.lineTo(cx + i, cy - 120);
    ctx.moveTo(cx + i, cy + 100); ctx.lineTo(cx + i, cy + 120);
    ctx.moveTo(cx - 100, cy + i); ctx.lineTo(cx - 120, cy + i);
    ctx.moveTo(cx + 100, cy + i); ctx.lineTo(cx + 120, cy + i);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(cx - 60, cy - 60, 120, 120, 20);
  ctx.fillStyle = '#A855F7';
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 58px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AI', cx, cy);
  ctx.restore();

  // Headline
  const { line1, line2 } = splitHeadline(headline);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (line2) {
    ctx.font = 'bold 72px HindSiliguri';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(line1, width * 0.5, 780);

    ctx.font = 'bold 76px HindSiliguri';
    ctx.fillStyle = '#C084FC';
    ctx.fillText(line2, width * 0.5, 885);
  } else {
    ctx.font = 'bold 78px HindSiliguri';
    ctx.fillStyle = '#C084FC';
    ctx.fillText(line1, width * 0.5, 830);
  }
  ctx.restore();

  // Action Pill
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width * 0.5 - 380, 1040, 760, 84, 42);
  ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#E9D5FF';
  ctx.font = 'bold 32px HindSiliguri';
  ctx.fillText('সহজ ট্রিকটি জানতে সম্পূর্ণ পোস্টটি পড়ুন', width * 0.5, 1084);
  ctx.restore();

  // Footer
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
  ctx.font = '500 25px HindSiliguri';
  ctx.fillText('facebook.com/SmartTechBangla   •   @smart_techbangla', width * 0.5, 1360);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 1.0 });
}

// -------------------------------------------------------------
// MASTER ROUTER: Auto-detects or uses requested template
// -------------------------------------------------------------
function renderSmartCard({ headline, requestedTemplate, codeParam }) {
  const text = headline || 'স্মার্টফোনের জরুরি সাইবার সিকিউরিটি সেটিংস? আজই জেনে নিন!';
  const lower = text.toLowerCase();

  // 1. Explicit template request
  if (requestedTemplate === 'dialer') {
    return renderDialerCard({ code: codeParam || extractCode(text), headline: text });
  }
  if (requestedTemplate === 'scam') {
    return renderScamCard({ headline: text });
  }
  if (requestedTemplate === 'ai' || requestedTemplate === 'ai_pc') {
    return renderAiCard({ headline: text });
  }
  if (requestedTemplate === 'social') {
    const isWa = lower.includes('whatsapp') || lower.includes('হোয়াটসঅ্যাপ');
    const brand = isWa ? {
      name: 'whatsapp', tag: 'হোয়াটসঅ্যাপ টিপস', color: '#00A843', lightColor: '#25D366', darkColor: '#007A30', glow: 'rgba(0, 168, 67, 0.18)'
    } : {
      name: 'facebook', tag: 'ফেসবুক নিরাপত্তা', color: '#1877F2', lightColor: '#4294FF', darkColor: '#0C53B7', glow: 'rgba(24, 119, 242, 0.18)'
    };
    return renderSocialCard({ brand, headline: text });
  }

  // 2. Intelligent Auto-detection from Headline
  // A. Secret Codes (e.g. *#21#, ##002#, কোড, ডায়াল)
  if (text.includes('*') || text.includes('#') || lower.includes('কোড') || lower.includes('ডায়াল') || lower.includes('ডায়াল')) {
    return renderDialerCard({ code: codeParam || extractCode(text), headline: text });
  }

  // B. Financial & Scam Alerts (বিকাশ, নগদ, ওটিপি, স্ক্যাম, প্রতারণা, ফিশিং)
  if (lower.includes('বিকাশ') || lower.includes('নগদ') || lower.includes('ওটিপি') || lower.includes('otp') || lower.includes('স্ক্যাম') || lower.includes('প্রতারণা') || lower.includes('ফাঁদ') || lower.includes('জালিয়াতি')) {
    return renderScamCard({ headline: text });
  }

  // C. AI & Computer Hacks (ai, chatgpt, রোবট, এআই, কম্পিউটার, উইন্ডোজ, পিসি)
  if (lower.includes('ai') || lower.includes('এআই') || lower.includes('chatgpt') || lower.includes('কম্পিউটার') || lower.includes('উইন্ডোজ') || lower.includes('পিসি') || lower.includes('ল্যাপটপ')) {
    return renderAiCard({ headline: text });
  }

  // D. Social Media & Messaging (WhatsApp, Facebook, etc.)
  const isFb = lower.includes('facebook') || lower.includes('ফেসবুক') || lower.includes('মেটা') || lower.includes('আইডি');
  const brand = isFb ? {
    name: 'facebook', tag: 'ফেসবুক নিরাপত্তা', color: '#1877F2', lightColor: '#4294FF', darkColor: '#0C53B7', glow: 'rgba(24, 119, 242, 0.18)'
  } : {
    name: 'whatsapp', tag: 'হোয়াটসঅ্যাপ টিপস', color: '#00A843', lightColor: '#25D366', darkColor: '#007A30', glow: 'rgba(0, 168, 67, 0.18)'
  };
  return renderSocialCard({ brand, headline: text });
}

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Tech Bangla 4-Slot Multi-Template Engine is running!' });
});

// Dynamic Card Endpoint
app.get(['/card', '/card.jpg', '/image.jpg'], (req, res) => {
  try {
    const headline = req.query.title || 'ফোনের কল ফরোয়ার্ডিং চেক করার কোড *#21#? এখনই দেখে নিন!';
    const requestedTemplate = req.query.template;
    const codeParam = req.query.code;

    const imageBuffer = renderSmartCard({ headline, requestedTemplate, codeParam });
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=3600',
      'Accept-Ranges': 'bytes'
    });
    res.send(imageBuffer);
  } catch (err) {
    console.error('Render error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 4-Slot Multi-Template Card Generator running on port ${PORT}`);
});
