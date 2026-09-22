const express = require('express');
const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-Bold.ttf'), 'HindSiliguri');
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-SemiBold.ttf'), 'HindSiliguriSemiBold');

const BACKGROUND_URLS = {
  mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1080&h=1080&fit=crop&q=80',
  security: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1080&h=1080&fit=crop&q=80',
  cyber: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1080&h=1080&fit=crop&q=80',
  ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1080&h=1080&fit=crop&q=80',
  matrix: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1080&h=1080&fit=crop&q=80'
};

const backgrounds = {};

async function preloadImages() {
  for (const [key, remoteUrl] of Object.entries(BACKGROUND_URLS)) {
    try {
      backgrounds[key] = await loadImage(remoteUrl);
    } catch (err) {}
  }
}
preloadImages();

function hasBengali(text) {
  return /[\u0980-\u09FF]/.test(text);
}

function sanitizeHeadline(text) {
  if (!text || text.trim() === '') {
    return 'স্মার্টফোনের জরুরি নিরাপত্তা টিপস! এখনই জেনে রাখুন';
  }
  const clean = text.trim();
  if (!hasBengali(clean)) {
    const lower = clean.toLowerCase();
    if (lower.includes('whatsapp') || lower.includes('call') || lower.includes('phone')) {
      return 'হোয়াটসঅ্যাপে অচেনা নাম্বার থেকে কল? এখনই এই সেটিংসটি অন করুন!';
    }
    if (lower.includes('password') || lower.includes('hack') || lower.includes('security')) {
      return 'আপনার ফেসবুক পাসওয়ার্ড কি হ্যাক হয়েছে? এখনই চেক করুন!';
    }
    if (lower.includes('battery') || lower.includes('charge')) {
      return 'ফোনের ব্যাটারি দ্রুত শেষ হওয়ার কারণ ও স্থায়ী সমাধান!';
    }
    if (lower.includes('ai') || lower.includes('chatgpt') || lower.includes('future')) {
      return 'আর্টিফিশিয়াল ইন্টেলিজেন্সের নতুন চমক! জেনে নিন বিস্তারিত';
    }
    return 'স্মার্টফোনের জরুরি সাইবার টিপস! এখনই জেনে রাখুন';
  }
  return clean;
}

async function renderCard({ headline, category = 'জরুরি সতর্কতা', subtitle }) {
  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const cleanHeadline = sanitizeHeadline(headline);
  const lowerHeadline = (cleanHeadline + ' ' + (category || '')).toLowerCase();

  let bgImg = backgrounds['mobile'];
  if (lowerHeadline.includes('ai') || lowerHeadline.includes('রোবট') || lowerHeadline.includes('chatgpt')) {
    bgImg = backgrounds['ai'] || bgImg;
  } else if (lowerHeadline.includes('হ্যাক') || lowerHeadline.includes('কোড') || lowerHeadline.includes('ডার্ক') || lowerHeadline.includes('সার্ভার')) {
    bgImg = backgrounds['matrix'] || backgrounds['cyber'] || bgImg;
  } else if (lowerHeadline.includes('পাসওয়ার্ড') || lowerHeadline.includes('লক') || lowerHeadline.includes('সিকিউরিটি') || lowerHeadline.includes('ভাইরাস') || lowerHeadline.includes('অ্যাকাউন্ট')) {
    bgImg = backgrounds['security'] || bgImg;
  } else if (lowerHeadline.includes('whatsapp') || lowerHeadline.includes('কল') || lowerHeadline.includes('মোবাইল') || lowerHeadline.includes('ফোন') || lowerHeadline.includes('ব্যাটারি')) {
    bgImg = backgrounds['mobile'] || bgImg;
  }

  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, width, height);
  } else {
    const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.5, 700);
    grad.addColorStop(0, '#0c1a30');
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  const overlay = ctx.createLinearGradient(0, 0, 0, height);
  overlay.addColorStop(0, 'rgba(4, 9, 20, 0.72)');
  overlay.addColorStop(0.35, 'rgba(4, 9, 20, 0.65)');
  overlay.addColorStop(0.65, 'rgba(2, 6, 16, 0.88)');
  overlay.addColorStop(1, 'rgba(1, 3, 8, 0.98)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, width, height);

  const topGlow = ctx.createRadialGradient(width * 0.5, 480, 50, width * 0.5, 480, 450);
  topGlow.addColorStop(0, 'rgba(0, 229, 255, 0.18)');
  topGlow.addColorStop(1, 'rgba(0, 229, 255, 0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, width, height);

  // Top Left Alert Pill
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(60, 60, 270, 56, 28);
  ctx.fillStyle = '#ff1744';
  ctx.shadowColor = '#ff1744';
  ctx.shadowBlur = 24;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(95, 88, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 10;
  ctx.fill();

  const badgeText = category && category.length > 2 ? category.replace('#', '') : 'জরুরি সতর্কতা';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.fillText(badgeText, 118, 96);
  ctx.restore();

  // Top Right Branding
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width - 320, 60, 260, 56, 28);
  ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = 'bold 20px HindSiliguri';
  ctx.fillStyle = '#00e5ff';
  ctx.fillText('SMART TECH BANGLA', width - 190, 96);
  ctx.restore();

  // Center Shield Emblem
  ctx.save();
  const iconY = 320;
  ctx.beginPath();
  ctx.arc(width * 0.5, iconY, 82, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';
  ctx.fill();
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 32;
  ctx.stroke();

  ctx.translate(width * 0.5, iconY);
  ctx.beginPath();
  ctx.moveTo(0, -42);
  ctx.lineTo(36, -24);
  ctx.lineTo(30, 20);
  ctx.lineTo(0, 42);
  ctx.lineTo(-30, 20);
  ctx.lineTo(-36, -24);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 229, 255, 0.22)';
  ctx.fill();
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -4, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.lineTo(4, -2);
  ctx.lineTo(7, 16);
  ctx.lineTo(-7, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Headline
  const words = cleanHeadline.split(' ');
  let line1 = '';
  let line2 = '';
  if (words.length <= 4) {
    line1 = cleanHeadline;
  } else {
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');
  }

  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 64px HindSiliguri';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 8;

  if (line2) {
    ctx.fillStyle = '#ffe600';
    ctx.fillText(line1, width * 0.5, 520);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(line2, width * 0.5, 608);
  } else {
    ctx.fillStyle = '#ffe600';
    ctx.fillText(line1, width * 0.5, 560);
  }
  ctx.restore();

  // Subtitle Hook
  const actionText = subtitle || 'স্ক্যামারদের ফাঁদ থেকে বাঁচতে পুরো পোস্টটি পড়ুন >>';
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(120, 685, 840, 72, 36);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#00e5ff';
  ctx.font = '600 28px HindSiliguri';
  ctx.fillText(actionText, width * 0.5, 731);
  ctx.restore();

  // Footer
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 950);
  ctx.lineTo(width - 80, 950);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 24px HindSiliguri';
  ctx.fillText('facebook.com/SmartTechBangla   •   @smart_techbangla', width * 0.5, 1000);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 0.92 });
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Tech Bangla High-Impact Card Generator API is running!' });
});

app.get('/card', async (req, res) => {
  try {
    const headline = req.query.title || 'হোয়াটসঅ্যাপে অচেনা নাম্বার থেকে কল? এখনই এই সেটিংসটি অন করুন!';
    const category = req.query.category || 'জরুরি সতর্কতা';
    const subtitle = req.query.subtitle;

    const imageBuffer = await renderCard({ headline, category, subtitle });
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(imageBuffer);
  } catch (err) {
    console.error('Render error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Viral Card Generator server running on port ${PORT}`);
});
