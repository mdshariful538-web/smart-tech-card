const express = require('express');
const { createCanvas, GlobalFonts, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Register Bengali Fonts
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-Bold.ttf'), 'HindSiliguri');
GlobalFonts.registerFromPath(path.join(__dirname, 'HindSiliguri-SemiBold.ttf'), 'HindSiliguriSemiBold');

// High-Res Photography Backgrounds (CDN)
const BACKGROUND_URLS = {
  mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1080&h=700&fit=crop&q=85',
  security: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1080&h=700&fit=crop&q=85',
  cyber: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1080&h=700&fit=crop&q=85',
  ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1080&h=700&fit=crop&q=85',
  laptop: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&h=700&fit=crop&q=85'
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
    if (lower.includes('mail') || lower.includes('gmail') || lower.includes('spam')) {
      return 'জিমেইলে অতিরিক্ত স্প্যাম মেইল? এখনই বন্ধ করার গোপন ট্রিক!';
    }
    if (lower.includes('whatsapp') || lower.includes('call') || lower.includes('phone')) {
      return 'হোয়াটসঅ্যাপে অচেনা নাম্বার থেকে কল? এখনই এই সেটিংসটি অন করুন!';
    }
    if (lower.includes('facebook') || lower.includes('password') || lower.includes('hack')) {
      return 'আপনার ফেসবুক অ্যাকাউন্ট কি নিরাপদ? এখনই চেক করুন!';
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

// Crisp Pro Media Split-Card (Zero Blur)
async function renderCard({ headline, category = 'জরুরি সতর্কতা', subtitle }) {
  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const cleanHeadline = sanitizeHeadline(headline);
  const lowerHeadline = (cleanHeadline + ' ' + (category || '')).toLowerCase();

  let bgImg = backgrounds['mobile'];
  if (lowerHeadline.includes('mail') || lowerHeadline.includes('gmail') || lowerHeadline.includes('spam')) {
    bgImg = backgrounds['laptop'] || backgrounds['security'] || bgImg;
  } else if (lowerHeadline.includes('ai') || lowerHeadline.includes('রোবট') || lowerHeadline.includes('chatgpt')) {
    bgImg = backgrounds['ai'] || bgImg;
  } else if (lowerHeadline.includes('পাসওয়ার্ড') || lowerHeadline.includes('লক') || lowerHeadline.includes('সিকিউরিটি') || lowerHeadline.includes('হ্যাক')) {
    bgImg = backgrounds['security'] || bgImg;
  } else if (lowerHeadline.includes('whatsapp') || lowerHeadline.includes('কল') || lowerHeadline.includes('মোবাইল') || lowerHeadline.includes('ফোন')) {
    bgImg = backgrounds['mobile'] || bgImg;
  } else {
    bgImg = backgrounds['laptop'] || bgImg;
  }

  // 1. Solid Dark Background
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, width, height);

  // 2. Top Image Section (Height: 580px - Bright & Crystal Clear)
  const imgH = 580;
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, width, imgH);
  }

  // Smooth Clean Transition
  const blend = ctx.createLinearGradient(0, imgH - 120, 0, imgH);
  blend.addColorStop(0, 'rgba(7, 11, 20, 0)');
  blend.addColorStop(1, '#070b14');
  ctx.fillStyle = blend;
  ctx.fillRect(0, imgH - 120, width, 120);

  // Solid Red Alert Badge (Sharp, No Blur!)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(50, 40, 210, 50, 10);
  ctx.fillStyle = '#e50914';
  ctx.fill();

  const badgeText = category && category.length > 2 ? category.replace('#', '') : 'জরুরি সতর্কতা';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, 155, 74);
  ctx.restore();

  // Branding Badge (Clean, Sharp)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(width - 300, 40, 250, 50, 10);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#00e5ff';
  ctx.font = 'bold 20px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.fillText('SMART TECH BANGLA', width - 175, 74);
  ctx.restore();

  // 3. Bottom Content Card Section
  const bottomY = imgH;

  // Sharp Cyan Divider
  const lineGrad = ctx.createLinearGradient(50, bottomY, width - 50, bottomY);
  lineGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
  lineGrad.addColorStop(0.5, '#00e5ff');
  lineGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(50, bottomY);
  ctx.lineTo(width - 50, bottomY);
  ctx.stroke();

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

  // Razor Sharp Typography
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 54px HindSiliguri';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 4;

  if (line2) {
    ctx.fillStyle = '#ffd600'; // Golden Yellow
    ctx.fillText(line1, width * 0.5, bottomY + 90);

    ctx.fillStyle = '#ffffff'; // Pure White
    ctx.fillText(line2, width * 0.5, bottomY + 175);
  } else {
    ctx.fillStyle = '#ffd600';
    ctx.fillText(line1, width * 0.5, bottomY + 130);
  }
  ctx.restore();

  // Sharp Flat Button (Zero Blur!)
  const actionText = subtitle || 'বিস্তারিত সমাধান ও নিয়ম জানতে ক্যাপশনটি পড়ুন >>';
  ctx.save();
  const ctaY = bottomY + 250;
  ctx.beginPath();
  ctx.roundRect(120, ctaY, 840, 66, 12);
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 26px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.fillText(actionText, width * 0.5, ctaY + 44);
  ctx.restore();

  // Footer
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 1010);
  ctx.lineTo(width - 50, 1010);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '500 22px HindSiliguri';
  ctx.textAlign = 'center';
  ctx.fillText('facebook.com/SmartTechBangla   •   @smart_techbangla', width * 0.5, 1050);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Tech Bangla Pro Card Generator is running!' });
});

// Dynamic Card Endpoint
app.get('/card', async (req, res) => {
  try {
    const headline = req.query.title || 'স্মার্টফোনের জরুরি সাইবার টিপস! এখনই জেনে রাখুন';
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
  console.log(`🚀 Pro Media Card Generator server running on port ${PORT}`);
});
