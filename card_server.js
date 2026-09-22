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

// Fallback headline if English slug is passed
function sanitizeHeadline(text) {
  if (!text || text.trim() === '') {
    return 'স্মার্টফোনের জরুরি সাইবার নিরাপত্তা? আজই জেনে নিন!';
  }
  const clean = text.trim();
  if (!hasBengali(clean)) {
    const lower = clean.toLowerCase();
    if (lower.includes('mail') || lower.includes('gmail') || lower.includes('spam')) {
      return 'জিমেইলে অতিরিক্ত স্প্যাম মেইল? বন্ধ করার সহজ উপায়!';
    }
    if (lower.includes('whatsapp') || lower.includes('call') || lower.includes('phone')) {
      return 'হোয়াটসঅ্যাপে অচেনা নাম্বার থেকে কল? বন্ধ করার গোপন সেটিংস!';
    }
    if (lower.includes('facebook') || lower.includes('password') || lower.includes('hack')) {
      return 'আপনার ফেসবুক অ্যাকাউন্ট কি নিরাপদ? এখনই চেক করার উপায়!';
    }
    if (lower.includes('battery') || lower.includes('charge')) {
      return 'ফোনের ব্যাটারি দ্রুত শেষ হওয়ার কারণ? স্থায়ী সমাধানের ট্রিক!';
    }
    if (lower.includes('ai') || lower.includes('chatgpt') || lower.includes('future')) {
      return 'আর্টিফিশিয়াল ইন্টেলিজেন্সের নতুন চমক? জেনে নিন বিস্তারিত!';
    }
    return 'স্মার্টফোনের জরুরি সাইবার নিরাপত্তা? আজই জেনে নিন!';
  }
  return clean;
}

// Detect Brand & Topic from Headline
function detectBrand(headline) {
  const lower = headline.toLowerCase();

  // WhatsApp
  if (lower.includes('whatsapp') || lower.includes('হোয়াটসঅ্যাপ') || lower.includes('হোয়াটসঅ্যাপ')) {
    return {
      name: 'whatsapp',
      tag: 'হোয়াটসঅ্যাপ টিপস',
      color: '#00A843',
      darkColor: '#007A30',
      glowColor: 'rgba(0, 168, 67, 0.18)',
      accentLight: '#25D366'
    };
  }

  // Facebook
  if (lower.includes('facebook') || lower.includes('ফেসবুক') || lower.includes('মেটা')) {
    return {
      name: 'facebook',
      tag: 'ফেসবুক নিরাপত্তা',
      color: '#1877F2',
      darkColor: '#0C53B7',
      glowColor: 'rgba(24, 119, 242, 0.18)',
      accentLight: '#4294FF'
    };
  }

  // Gmail / Email
  if (lower.includes('mail') || lower.includes('gmail') || lower.includes('জিমেইল') || lower.includes('ইমেইল')) {
    return {
      name: 'gmail',
      tag: 'জিমেইল টিপস',
      color: '#EA4335',
      darkColor: '#B31412',
      glowColor: 'rgba(234, 67, 53, 0.18)',
      accentLight: '#FF6B5E'
    };
  }

  // YouTube
  if (lower.includes('youtube') || lower.includes('ইউটিউব') || lower.includes('ভিডিও')) {
    return {
      name: 'youtube',
      tag: 'ইউটিউব আপডেট',
      color: '#FF0000',
      darkColor: '#B80000',
      glowColor: 'rgba(255, 0, 0, 0.18)',
      accentLight: '#FF3838'
    };
  }

  // Battery (ONLY if specifically about battery or charging!)
  if (lower.includes('battery') || lower.includes('ব্যাটারি') || lower.includes('চার্জ')) {
    return {
      name: 'battery',
      tag: 'ব্যাটারি গাইড',
      color: '#059669',
      darkColor: '#047857',
      glowColor: 'rgba(5, 150, 105, 0.18)',
      accentLight: '#10B981'
    };
  }

  // AI / ChatGPT
  if (lower.includes('ai') || lower.includes('chatgpt') || lower.includes('রোবট') || lower.includes('এআই')) {
    return {
      name: 'ai',
      tag: 'এআই প্রযুক্তি',
      color: '#7C3AED',
      darkColor: '#5B21B6',
      glowColor: 'rgba(124, 58, 237, 0.18)',
      accentLight: '#9333EA'
    };
  }

  // Android specific
  if (lower.includes('android') || lower.includes('অ্যান্ড্রয়েড')) {
    return {
      name: 'android',
      tag: 'অ্যান্ড্রয়েড টিপস',
      color: '#0D9488',
      darkColor: '#0F766E',
      glowColor: 'rgba(13, 148, 136, 0.18)',
      accentLight: '#14B8A6'
    };
  }

  // Default Cyber Security & Tech Tips (Phone, Mobile, Hack, Password, Camera, Settings, etc.)
  return {
    name: 'security',
    tag: 'সাইবার সিকিউরিটি',
    color: '#0284C7',
    darkColor: '#0369A1',
    glowColor: 'rgba(2, 132, 199, 0.18)',
    accentLight: '#38BDF8'
  };
}

// 3D Glossy Sphere Platter (Apple Studio / Glass Orb Style)
function drawGlossySphere(ctx, x, y, radius, brand) {
  ctx.save();

  // 1. Soft Ambient Colored Aura
  const aura = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2.2);
  aura.addColorStop(0, brand.glowColor);
  aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 2. Porcelain 3D Outer Platter with Multi-layer Shadow
  ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
  ctx.shadowOffsetY = 24;
  ctx.shadowBlur = 48;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  const platterGrad = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
  platterGrad.addColorStop(0, '#FFFFFF');
  platterGrad.addColorStop(0.5, '#F8FAFC');
  platterGrad.addColorStop(1, '#EEF2F6');
  ctx.fillStyle = platterGrad;
  ctx.fill();

  // Thin metallic border on platter
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 3. Vibrant 3D Sphere Body
  const sphereR = radius * 0.82;
  ctx.beginPath();
  ctx.arc(x, y, sphereR, 0, Math.PI * 2);
  const bodyGrad = ctx.createRadialGradient(x - sphereR * 0.35, y - sphereR * 0.45, sphereR * 0.1, x, y, sphereR);
  bodyGrad.addColorStop(0, brand.accentLight);
  bodyGrad.addColorStop(0.65, brand.color);
  bodyGrad.addColorStop(1, brand.darkColor);
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // 4. Ultra-Glossy 3D Glass Specular Highlight (The "চকচকে" Glass Orb Effect)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y - sphereR * 0.42, sphereR * 0.72, sphereR * 0.38, 0, 0, Math.PI * 2);
  const glassShine = ctx.createLinearGradient(x, y - sphereR * 0.8, x, y - sphereR * 0.05);
  glassShine.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
  glassShine.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
  glassShine.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glassShine;
  ctx.fill();
  ctx.restore();

  // 5. Subtle Bottom Reflected Rim Light
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, sphereR - 2, Math.PI * 0.15, Math.PI * 0.85, false);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// Draw Brand Vector Logo in Center
function drawHeroIcon(ctx, brand, x, y) {
  const radius = 175;
  drawGlossySphere(ctx, x, y, radius, brand);

  ctx.save();
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
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowOffsetY = 8;
    ctx.shadowBlur = 14;
    ctx.fillText('f', 24, 28);
  } else if (brand.name === 'gmail') {
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 10;

    // Envelope frame
    ctx.strokeRect(-72, -48, 144, 96);
    // Envelope fold
    ctx.beginPath();
    ctx.moveTo(-72, -48);
    ctx.lineTo(0, 12);
    ctx.lineTo(72, -48);
    ctx.stroke();
  } else if (brand.name === 'battery') {
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 12;

    // Battery body
    ctx.beginPath();
    ctx.roundRect(-75, -42, 130, 84, 16);
    ctx.stroke();

    // Terminal cap
    ctx.beginPath();
    ctx.roundRect(58, -18, 18, 36, 6);
    ctx.fill();

    // Lightning bolt in center
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.lineTo(-24, 6);
    ctx.lineTo(-4, 6);
    ctx.lineTo(-12, 28);
    ctx.lineTo(16, -4);
    ctx.lineTo(-2, -4);
    ctx.closePath();
    ctx.fill();
  } else if (brand.name === 'youtube') {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(-28, -48);
    ctx.lineTo(44, 0);
    ctx.lineTo(-28, 48);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  } else if (brand.name === 'ai') {
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.roundRect(-50, -50, 100, 100, 20);
    ctx.fill();

    ctx.fillStyle = brand.darkColor;
    ctx.beginPath();
    ctx.roundRect(-30, -30, 60, 60, 12);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    for (let i = -24; i <= 24; i += 24) {
      ctx.moveTo(i, -50); ctx.lineTo(i, -64);
      ctx.moveTo(i, 50); ctx.lineTo(i, 64);
      ctx.moveTo(-50, i); ctx.lineTo(-64, i);
      ctx.moveTo(50, i); ctx.lineTo(64, i);
    }
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI', 0, 0);
  } else if (brand.name === 'android') {
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowOffsetY = 6;
    ctx.shadowBlur = 12;

    // Android head
    ctx.beginPath();
    ctx.arc(0, 24, 75, Math.PI, 0, false);
    ctx.fill();

    // Eyes
    ctx.fillStyle = brand.darkColor;
    ctx.beginPath();
    ctx.arc(-30, -10, 8, 0, Math.PI * 2);
    ctx.arc(30, -10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-42, -40);
    ctx.lineTo(-58, -68);
    ctx.moveTo(42, -40);
    ctx.lineTo(58, -68);
    ctx.stroke();
  } else {
    // Cyber Security Shield
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowOffsetY = 8;
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.moveTo(0, -72);
    ctx.lineTo(60, -42);
    ctx.lineTo(50, 32);
    ctx.lineTo(0, 72);
    ctx.lineTo(-50, 32);
    ctx.lineTo(-60, -42);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Keyhole
    ctx.beginPath();
    ctx.arc(0, -8, 14, 0, Math.PI * 2);
    ctx.fillStyle = brand.color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.lineTo(7, -4);
    ctx.lineTo(11, 28);
    ctx.lineTo(-11, 28);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// Render Pure Light Ultra-HD 1440x1440 Card
function renderCard({ headline, subtitle }) {
  const width = 1440;
  const height = 1440;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const cleanHeadline = sanitizeHeadline(headline);
  const brand = detectBrand(cleanHeadline);

  // 1. Crystal-Clear Pure White Studio Canvas
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(0.6, '#F8FAFC');
  bgGrad.addColorStop(1, '#F1F5F9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Ambient Studio Lighting
  ctx.save();
  const auraTop = ctx.createRadialGradient(width * 0.82, 220, 50, width * 0.82, 220, 500);
  auraTop.addColorStop(0, brand.glowColor);
  auraTop.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = auraTop;
  ctx.beginPath();
  ctx.arc(width * 0.82, 220, 500, 0, Math.PI * 2);
  ctx.fill();

  const auraBottom = ctx.createRadialGradient(180, height * 0.82, 50, 180, height * 0.82, 450);
  auraBottom.addColorStop(0, brand.glowColor);
  auraBottom.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = auraBottom;
  ctx.beginPath();
  ctx.arc(180, height * 0.82, 450, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Corner Verified Branding (Top Left)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(80, 70, 360, 68, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 16;
  ctx.fill();

  // Blue Verified Badge Circle
  ctx.beginPath();
  ctx.arc(118, 104, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#2563EB';
  ctx.fill();

  // White Checkmark
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(112, 104);
  ctx.lineTo(116, 108);
  ctx.lineTo(124, 99);
  ctx.stroke();

  // Page Name
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 26px HindSiliguri';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Smart Tech Bangla', 148, 106);
  ctx.restore();

  // 3. Dynamic Topic Pill (Top Right)
  ctx.save();
  const pillW = 280;
  ctx.beginPath();
  ctx.roundRect(width - pillW - 80, 70, pillW, 68, 34);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 16;
  ctx.fill();

  // Decorative colored topic dot
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

  // 4. 3D Glossy Hero Emblem (Center)
  const heroY = 480;
  drawHeroIcon(ctx, brand, width * 0.5, heroY);

  // 5. Headline Text Processing
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

  // 6. Massive, Razor-Sharp Bengali Typography
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (line2) {
    ctx.font = 'bold 72px HindSiliguri';
    ctx.fillStyle = '#090D16'; // Deep Pitch Obsidian
    ctx.fillText(line1, width * 0.5, 820);

    ctx.font = 'bold 76px HindSiliguri';
    ctx.fillStyle = brand.color; // Vibrant Brand Accent
    ctx.fillText(line2, width * 0.5, 930);
  } else {
    ctx.font = 'bold 78px HindSiliguri';
    ctx.fillStyle = '#090D16';
    ctx.fillText(line1, width * 0.5, 875);
  }
  ctx.restore();

  // 7. Universal Action Pill (NO FALSE/HARDCODED SUBHEADS!)
  const actionText = subtitle || 'বিস্তারিত নিয়ম জানতে সম্পূর্ণ পোস্টটি পড়ুন';
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
  ctx.fillText(actionText, width * 0.5, 1122);
  ctx.restore();

  // 8. Minimalist Luxury Footer
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

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Tech Bangla Ultra-HD 3D Glossy Card Generator is running!' });
});

// Dynamic Card Endpoint (Supports /card, /card.jpg, and /image.jpg for Instagram)
app.get(['/card', '/card.jpg', '/image.jpg'], (req, res) => {
  try {
    const headline = req.query.title || 'স্মার্টফোনের জরুরি সাইবার সিকিউরিটি সেটিংস? আজই জেনে নিন!';
    const subtitle = req.query.subtitle;

    const imageBuffer = renderCard({ headline, subtitle });
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
  console.log(`🚀 Ultra-HD 3D Glossy Card Generator running on port ${PORT}`);
});
