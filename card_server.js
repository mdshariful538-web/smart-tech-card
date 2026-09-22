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

// Intelligent Headline Fallback if English slug is passed
function sanitizeHeadline(text) {
  if (!text || text.trim() === '') {
    return 'স্মার্টফোনের জরুরি সাইবার টিপস? এখনই জেনে রাখুন!';
  }
  const clean = text.trim();
  if (!hasBengali(clean)) {
    const lower = clean.toLowerCase();
    if (lower.includes('mail') || lower.includes('gmail') || lower.includes('spam')) {
      return 'জিমেইলে অতিরিক্ত স্প্যাম মেইল? অবাঞ্ছিত মেইল বন্ধ করার ট্রিক!';
    }
    if (lower.includes('whatsapp') || lower.includes('call') || lower.includes('phone')) {
      return 'হোয়াটসঅ্যাপে অচেনা নাম্বার থেকে কল? বন্ধ করার সহজ সেটিংস!';
    }
    if (lower.includes('facebook') || lower.includes('password') || lower.includes('hack')) {
      return 'আপনার ফেসবুক পাসওয়ার্ড কি হ্যাক হয়েছে? এখনই চেক করার সহজ উপায়!';
    }
    if (lower.includes('battery') || lower.includes('charge')) {
      return 'ফোনের ব্যাটারি দ্রুত শেষ হওয়ার কারণ? স্থায়ী সমাধানের সহজ ট্রিক!';
    }
    if (lower.includes('ai') || lower.includes('chatgpt') || lower.includes('future')) {
      return 'আর্টিফিশিয়াল ইন্টেলিজেন্সের নতুন চমক? জেনে নিন বিস্তারিত!';
    }
    return 'স্মার্টফোনের জরুরি নিরাপত্তা টিপস? এখনই জেনে রাখুন!';
  }
  return clean;
}

// Detect Brand & Topic from Headline
function detectBrand(headline) {
  const lower = headline.toLowerCase();
  if (lower.includes('whatsapp') || lower.includes('হোয়াটসঅ্যাপ') || lower.includes('হোয়াটসঅ্যাপ') || lower.includes('কল')) {
    return { name: 'whatsapp', color: '#16a34a', bgAccent: 'rgba(37, 211, 102, 0.05)', subhead: 'স্ক্যাম ও স্প্যাম কল এড়াতে পোস্টটি সম্পূর্ণ পড়ুন' };
  }
  if (lower.includes('facebook') || lower.includes('ফেসবুক') || lower.includes('পাসওয়ার্ড') || lower.includes('আইডি')) {
    return { name: 'facebook', color: '#1877F2', bgAccent: 'rgba(24, 119, 242, 0.05)', subhead: 'অ্যাকাউন্ট নিরাপদ রাখতে পোস্টটি সম্পূর্ণ পড়ুন' };
  }
  if (lower.includes('mail') || lower.includes('gmail') || lower.includes('জিমেইল') || lower.includes('স্প্যাম')) {
    return { name: 'gmail', color: '#ea4335', bgAccent: 'rgba(234, 67, 53, 0.05)', subhead: 'তথ্য সুরক্ষিত রাখতে পোস্টটি সম্পূর্ণ পড়ুন' };
  }
  if (lower.includes('youtube') || lower.includes('ইউটিউব') || lower.includes('ভিডিও')) {
    return { name: 'youtube', color: '#ff0000', bgAccent: 'rgba(255, 0, 0, 0.05)', subhead: 'নতুন আপডেট জানতে পোস্টটি সম্পূর্ণ পড়ুন' };
  }
  if (lower.includes('battery') || lower.includes('ব্যাটারি') || lower.includes('android') || lower.includes('অ্যান্ড্রয়েড') || lower.includes('ফোন') || lower.includes('মোবাইল')) {
    return { name: 'android', color: '#3ddc84', bgAccent: 'rgba(61, 220, 132, 0.05)', subhead: 'ব্যাটারি ব্যাকআপ বাড়াতে পোস্টটি সম্পূর্ণ পড়ুন' };
  }
  if (lower.includes('ai') || lower.includes('রোবট') || lower.includes('chatgpt') || lower.includes('এআই')) {
    return { name: 'ai', color: '#8b5cf6', bgAccent: 'rgba(139, 92, 246, 0.05)', subhead: 'প্রযুক্তির নতুন খবর জানতে পোস্টটি সম্পূর্ণ পড়ুন' };
  }
  return { name: 'security', color: '#0284c7', bgAccent: 'rgba(2, 132, 199, 0.05)', subhead: 'সাইবার সতর্কতা জানতে পোস্টটি সম্পূর্ণ পড়ুন' };
}

// Draw Brand Vector Logo in Center
function drawBrandHero(ctx, brand, x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, 150, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = brand.color + '30';
  ctx.shadowOffsetY = 15;
  ctx.shadowBlur = 40;
  ctx.fill();

  if (brand.name === 'whatsapp') {
    ctx.beginPath();
    ctx.arc(x, y, 125, 0, Math.PI * 2);
    ctx.fillStyle = '#25D366';
    ctx.fill();

    const waPath = new Path2D('M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z');
    ctx.translate(x - 78, y - 79);
    ctx.scale(0.35, 0.35);
    ctx.fillStyle = '#ffffff';
    ctx.fill(waPath);
  } else if (brand.name === 'facebook') {
    ctx.beginPath();
    ctx.arc(x, y, 125, 0, Math.PI * 2);
    ctx.fillStyle = '#1877F2';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 170px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('f', x + 20, y + 62);
  } else if (brand.name === 'gmail') {
    ctx.beginPath();
    ctx.arc(x, y, 125, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.moveTo(-60, 42);
    ctx.lineTo(-60, -36);
    ctx.lineTo(0, 12);
    ctx.stroke();

    ctx.strokeStyle = '#34A853';
    ctx.beginPath();
    ctx.moveTo(60, 42);
    ctx.lineTo(60, -36);
    ctx.lineTo(0, 12);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.moveTo(-54, -36);
    ctx.lineTo(0, 12);
    ctx.lineTo(54, -36);
    ctx.stroke();
    ctx.restore();
  } else if (brand.name === 'youtube') {
    ctx.beginPath();
    ctx.roundRect(x - 110, y - 75, 220, 150, 40);
    ctx.fillStyle = '#ff0000';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - 25, y - 40);
    ctx.lineTo(x + 40, y);
    ctx.lineTo(x - 25, y + 40);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  } else if (brand.name === 'android') {
    ctx.beginPath();
    ctx.arc(x, y, 125, 0, Math.PI * 2);
    ctx.fillStyle = '#3ddc84';
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 20, 65, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#3ddc84';
    ctx.beginPath();
    ctx.arc(-26, -10, 7, 0, Math.PI * 2);
    ctx.arc(26, -10, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-35, -35);
    ctx.lineTo(-50, -58);
    ctx.moveTo(35, -35);
    ctx.lineTo(50, -58);
    ctx.stroke();
    ctx.restore();
  } else {
    // Security Shield
    ctx.beginPath();
    ctx.arc(x, y, 125, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.lineTo(44, -30);
    ctx.lineTo(38, 25);
    ctx.lineTo(0, 54);
    ctx.lineTo(-38, 25);
    ctx.lineTo(-44, -30);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -6, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, -4);
    ctx.lineTo(5, -4);
    ctx.lineTo(8, 22);
    ctx.lineTo(-8, 22);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// Render Pure Light Modern Brand-Customized Card
function renderLightCard({ headline, subtitle }) {
  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const cleanHeadline = sanitizeHeadline(headline);
  const brand = detectBrand(cleanHeadline);

  // 1. Soft, Premium Light Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#f8fafc');
  bgGrad.addColorStop(0.5, '#f1f5f9');
  bgGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.beginPath();
  ctx.arc(width * 0.85, 180, 320, 0, Math.PI * 2);
  ctx.fillStyle = brand.bgAccent;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(140, height * 0.85, 280, 0, Math.PI * 2);
  ctx.fillStyle = brand.bgAccent;
  ctx.fill();
  ctx.restore();

  // 2. Small, Subtle Branding in Top Left Corner
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(60, 50, 250, 48, 24);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 8;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(84, 74, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#2563eb';
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 18px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.fillText('Smart Tech Bangla', 105, 81);
  ctx.restore();

  // 3. Central Brand Hero Element
  const heroY = 380;
  drawBrandHero(ctx, brand, width * 0.5, heroY);

  // 4. Headline Processing
  let line1 = '';
  let line2 = '';
  if (cleanHeadline.includes('?') && cleanHeadline.indexOf('?') < cleanHeadline.length - 2) {
    const parts = cleanHeadline.split('?');
    line1 = parts[0].trim() + '?';
    line2 = parts.slice(1).join('?').trim();
  } else {
    const words = cleanHeadline.split(' ');
    if (words.length <= 4) {
      line1 = cleanHeadline;
    } else {
      const mid = Math.ceil(words.length / 2);
      line1 = words.slice(0, mid).join(' ');
      line2 = words.slice(mid).join(' ');
    }
  }

  // 5. Clean, Bold Bengali Headline (Slate + Brand Color)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 58px HindSiliguri';

  if (line2) {
    ctx.fillStyle = '#0f172a';
    ctx.fillText(line1, width * 0.5, 650);

    ctx.fillStyle = brand.color;
    ctx.fillText(line2, width * 0.5, 735);
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.fillText(line1, width * 0.5, 690);
  }
  ctx.restore();

  // 6. Natural Subhead
  const subText = subtitle || brand.subhead;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = '500 28px HindSiliguri';
  ctx.fillText(subText, width * 0.5, 830);
  ctx.restore();

  // 7. Minimal Footer Branding
  ctx.save();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 990);
  ctx.lineTo(width - 100, 990);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 20px HindSiliguri';
  ctx.fillText('facebook.com/SmartTechBangla   •   @smart_techbangla', width * 0.5, 1025);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 0.96 });
}

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Tech Bangla Clean Light Card Generator is running!' });
});

// Dynamic Card Endpoint (Supports /card, /card.jpg, and /image.jpg for Instagram)
app.get(['/card', '/card.jpg', '/image.jpg'], (req, res) => {
  try {
    const headline = req.query.title || 'হোয়াটসঅ্যাপে অচেনা নাম্বার থেকে কল? বন্ধ করার সহজ সেটিংস!';
    const subtitle = req.query.subtitle;

    const imageBuffer = renderLightCard({ headline, subtitle });
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
  console.log(`🚀 Clean Light Card Generator running on port ${PORT}`);
});
