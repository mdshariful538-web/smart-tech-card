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
  ctx.fillText('এক নজরে সঠিক পছন্দ', width * 0.5, guideY + 26);

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
  ctx.fillText('facebook.com/SmartTechBangla   •   @smart_techbangla', width * 0.5, 1360);
  ctx.restore();

  return canvas.toBuffer('image/jpeg', { quality: 1.0 });
}

// -------------------------------------------------------------
// VIRAL INFOGRAPHIC CHEAT SHEETS (Karvion Labs Quality)
// -------------------------------------------------------------
const INFOGRAPHIC_TOPICS = {
  // 1. AI Tools
  ai_tools: {
    title: 'কোন কাজের জন্য কোন এআই (AI) টুল ব্যবহার করবেন?',
    subtitle: 'শিখুন • বেছে নিন • সময় বাঁচান',
    columns: [
      {
        badge: 'ChatGPT',
        name: 'লেখা ও রিসার্চ',
        role: 'OpenAI',
        color: '#10A37F',
        points: [
          { bold: 'ইমেইল ও মেসেজ', desc: 'অফিসিয়াল মেইল দ্রুত লিখুন' },
          { bold: 'কনটেন্ট আইডিয়া', desc: 'সোশ্যাল মিডিয়া পোস্ট ও প্ল্যান' },
          { bold: 'যেকোনো ব্যাখ্যা', desc: 'কঠিন বিষয় সহজ করে বোঝা' },
          { bold: 'ভাষা অনুবাদ', desc: 'নিখুঁত ও প্রাঞ্জল অনুবাদ' }
        ]
      },
      {
        badge: 'Claude',
        name: 'কোডিং ও বিশ্লেষণ',
        role: 'Anthropic',
        color: '#D97706',
        points: [
          { bold: 'বড় ফাইল অ্যানালাইসিস', desc: 'শত পাতার পিডিএফ সারাংশ' },
          { bold: 'জটিল কোড ডিবাগ', desc: 'এরর খুঁজে নিখুঁত সমাধান' },
          { bold: 'লজিক্যাল লেখা', desc: 'গবেষণামূলক ও গভীর লেখা' },
          { bold: 'ডেটা প্রসেসিং', desc: 'তথ্য থেকে চার্ট ও সামারি' }
        ]
      },
      {
        badge: 'Midjourney',
        name: 'ছবি তৈরি',
        role: 'AI Image Generator',
        color: '#2563EB',
        points: [
          { bold: 'সিনেমাটিক আর্ট', desc: '৪K বাস্তবধর্মী ছবি তৈরি' },
          { bold: 'লোগো ডিজাইন', desc: 'ব্র্যান্ডের আধুনিক কনসেপ্ট' },
          { bold: 'পোস্টার ও ব্যানার', desc: 'বিজ্ঞাপনের আকর্ষণীয় ছবি' },
          { bold: 'প্রোডাক্ট মডেল', desc: 'নতুন গ্যাজেটের থ্রিডি লুক' }
        ]
      },
      {
        badge: 'Canva AI',
        name: 'সোশ্যাল ডিজাইন',
        role: 'Magic Studio',
        color: '#06B6D4',
        points: [
          { bold: 'দ্রুত সোশ্যাল পোস্ট', desc: 'রেডিমেড টেমপ্লেটে ডিজাইন' },
          { bold: 'ব্যাকগ্রাউন্ড রিমুভ', desc: 'মাত্র ১ ক্লিকে অবজেক্ট কাটা' },
          { bold: 'ম্যাজিক ইরেজার', desc: 'ছবি থেকে অবাঞ্ছিত অংশ মোছা' },
          { bold: 'ভিডিও ও রিলস', desc: 'সহজে এডিটিং ও সাউন্ড অ্যাড' }
        ]
      }
    ],
    bottomTags: [
      { need: 'কনটেন্ট', use: 'ChatGPT' },
      { need: 'কোডিং', use: 'Claude' },
      { need: 'ছবি তৈরি', use: 'Midjourney' },
      { need: 'সোশ্যাল ডিজাইন', use: 'Canva' }
    ],
    takeaway: 'একটি টুল সব কাজের জন্য নয় — প্রজেক্ট ও প্রয়োজন অনুযায়ী টুল নির্বাচন করুন।'
  },

  // 2. Secret Dialer Codes
  secret_codes: {
    title: 'স্মার্টফোনের জরুরি ৪টি সিক্রেট কোড: কোন কোড কোন কাজে?',
    subtitle: 'যাচাই করুন • ডায়াল করুন • নিরাপদ থাকুন',
    columns: [
      {
        badge: '*#21#',
        name: 'কল ফরোয়ার্ডিং',
        role: 'Spying Detection',
        color: '#0EA5E9',
        points: [
          { bold: 'কল হ্যাকিং চেক', desc: 'কল গোপনে অন্য কোথাও যাচ্ছে?' },
          { bold: 'এসএমএস ডাইভার্ট', desc: 'মেসেজ ফরওয়ার্ড চেক করুন' },
          { bold: 'ডেটা ট্র্যাকিং', desc: 'ইন্টারনেট ট্রাফিক ডাইভার্ট' },
          { bold: 'তাত্ক্ষণিক স্ট্যাটাস', desc: 'স্ক্রিনে রিপোর্ট দেখুন' }
        ]
      },
      {
        badge: '##002#',
        name: 'সব ফরোয়ার্ড বাতিল',
        role: 'Master Reset',
        color: '#EF4444',
        points: [
          { bold: '১ ক্লিকে বন্ধ', desc: 'সকল ডাইভার্ট সাথে সাথে বাতিল' },
          { bold: 'হ্যাকিং থেকে মুক্তি', desc: 'অপরিচিত ফরোয়ার্ডিং বিচ্ছিন্ন' },
          { bold: 'ভয়েস ও ডেটা সুরক্ষা', desc: 'কল সম্পূর্ণ ব্যক্তিগত রাখুন' },
          { bold: 'সব সিমে কাজ করে', desc: 'যেকোনো অপারেটরে কার্যকর' }
        ]
      },
      {
        badge: '*#06#',
        name: 'IMEI নাম্বার চেক',
        role: 'Phone Identity',
        color: '#F59E0B',
        points: [
          { bold: 'আসল পরিচয়', desc: 'ফোনের অফিশিয়াল ১৫ ডিজিট কোড' },
          { bold: 'চুরি হলে উদ্ধার', desc: 'জিডি ও ট্র্যাকিংয়ে কাজে লাগে' },
          { bold: 'অফিসিয়াল ফোন যাচাই', desc: 'বিটিআরসি ডাটাবেসে চেক' },
          { bold: 'নকল ফোন শনাক্ত', desc: 'বক্সের নাম্বারের সাথে মেলান' }
        ]
      },
      {
        badge: '*#*#4636#*#*',
        name: 'ব্যাটারি ও নেটওয়ার্ক',
        role: 'Testing Menu',
        color: '#10B981',
        points: [
          { bold: 'ব্যাটারি হেলথ', desc: 'চার্জের তাপমাত্রা ও স্থায়িত্ব' },
          { bold: 'লাইভ সিগন্যাল', desc: 'নেটওয়ার্কের আসল শক্তি যাচাই' },
          { bold: 'অ্যাপ ব্যবহারের হিসেব', desc: 'কোন অ্যাপ কতক্ষণ চলেছে' },
          { bold: 'ওয়াইফাই ডিটেইলস', desc: 'রাউটারের স্পিড ও পিং টেস্ট' }
        ]
      }
    ],
    bottomTags: [
      { need: 'কল চেক', use: '*#21#' },
      { need: 'সব বন্ধ', use: '##002#' },
      { need: 'IMEI যাচাই', use: '*#06#' },
      { need: 'ব্যাটারি হেলথ', use: '*#*#4636#*#*' }
    ],
    takeaway: 'সন্দেহ হলে এখনই কোডগুলো ডায়াল করে আপনার ফোনের নিরাপত্তা নিশ্চিত করুন।'
  },

  // 3. Scam Defense
  scam_defense: {
    title: 'অনলাইন প্রতারণা চেনার উপায়: কোন ফাঁদ কীভাবে কাজ করে?',
    subtitle: 'সচেতন হোন • ফাঁদ চিনুন • টাকা বাঁচান',
    columns: [
      {
        badge: 'OTP Scam',
        name: 'ভুয়া বিকাশ/ব্যাংক কল',
        role: 'বিকাশ ও নগদ ফাঁদ',
        color: '#E11D48',
        points: [
          { bold: 'ভুয়া ভেরিফিকেশন', desc: 'অফিসের পরিচয়ে ওটিপি দাবি' },
          { bold: 'লটারি ও বোনাসের লোভ', desc: 'অ্যাকাউন্ট ব্লক হওয়ার ভয়' },
          { bold: 'টাকা উধাও মুহূর্তেই', desc: 'ওটিপি দিলে অ্যাকাউন্ট শেষ' },
          { bold: 'সমাধান', desc: 'ওটিপি বা পিন কাউকে বলবেন না' }
        ]
      },
      {
        badge: 'Job Scam',
        name: 'অনলাইন কাজের ফাঁদ',
        role: 'টেলিগ্রাম প্রতারণা',
        color: '#8B5CF6',
        points: [
          { bold: 'সহজ আয়ের টোপ', desc: 'লাইক বা রিভিউ দিয়ে ইনকাম' },
          { bold: 'শুরুতে সামান্য লাভ', desc: 'বিশ্বাস অর্জনের পর ফাঁদ' },
          { bold: 'মোটা অঙ্কের বিনিয়োগ', desc: 'টাকা জমা দিতে বলে গায়েব' },
          { bold: 'সমাধান', desc: 'আগে টাকা চাইলে কাজ এড়িয়ে চলুন' }
        ]
      },
      {
        badge: 'Phishing',
        name: 'ভুয়া লিংক ও গিফট',
        role: 'ফেসবুক ও মেসেঞ্জার',
        color: '#F97316',
        points: [
          { bold: 'ফ্রি রিচার্জের অফার', desc: '২৫ জিবি ফ্রি ইন্টারনেটের ফাঁদ' },
          { bold: 'আইডি ক্লোন ও হ্যাকিং', desc: 'লিংকে ঢুকলেই পাসওয়ার্ড চুরি' },
          { bold: 'বন্ধু সেজে লিংক পাঠানো', desc: 'হ্যাকড আইডি থেকে মেসেজ' },
          { bold: 'সমাধান', desc: 'অচেনা কোনো লিংকে ক্লিক নয়' }
        ]
      },
      {
        badge: 'Deepfake',
        name: 'এআই ভয়েস ক্লোনিং',
        role: 'ডিজিটাল প্রতারণা',
        color: '#06B6D4',
        points: [
          { bold: 'কণ্ঠ নকল করে কল', desc: 'পরিচিত মানুষের গলায় মেসেজ' },
          { bold: 'দুর্ঘটনার ভুয়া খবর', desc: 'জরুরি টাকার জন্য চাপ' },
          { bold: 'আতঙ্ক তৈরি করে প্রতারণা', desc: 'দ্রুত টাকা পাঠানোর হুমকি' },
          { bold: 'সমাধান', desc: 'অন্য নাম্বারে কল করে যাচাই করুন' }
        ]
      }
    ],
    bottomTags: [
      { need: 'ভুয়া ওটিপি', use: 'কখনোই দেবেন না' },
      { need: 'অনলাইন জব', use: 'আগে টাকা দেবেন না' },
      { need: 'অচেনা লিংক', use: 'ক্লিক করবেন না' },
      { need: 'ভয়েস কল', use: 'যাচাই করুন' }
    ],
    takeaway: 'কোনো ব্যাংক বা প্রতিষ্ঠান কখনোই আপনার গোপন পিন বা ওটিপি জানতে চায় না।'
  },

  // 4. PC Shortcuts
  pc_shortcuts: {
    title: 'পিসি ব্যবহারকারীদের জন্য ৪টি সুপার দরকারি শর্টকাট!',
    subtitle: 'কিবোর্ড ট্রিকস • কাজের গতি বাড়ান',
    columns: [
      {
        badge: 'Win + V',
        name: 'ক্লিপবোর্ড হিস্ট্রি',
        role: 'স্মার্ট কপি পেস্ট',
        color: '#3B82F6',
        points: [
          { bold: 'আগের সব কপি সংরক্ষণ', desc: 'একসাথে অনেক টেক্সট কপি' },
          { bold: 'স্ক্রিনশটের হিস্ট্রি', desc: 'আগের ছবিগুলো আবার পান' },
          { bold: 'বারবার টাইপ নয়', desc: 'এক ক্লিকে পেস্ট করুন' },
          { bold: 'কাজ দ্রুত শেষ', desc: 'অফিস ও স্টুডেন্টদের জন্য বেস্ট' }
        ]
      },
      {
        badge: 'Win+Shift+S',
        name: 'স্মার্ট স্ক্রিনশট',
        role: 'স্নিপিং টুল শর্টকাট',
        color: '#10B981',
        points: [
          { bold: 'নির্দিষ্ট অংশ ক্রপ', desc: 'স্ক্রিনের যতটুকু দরকার কাটুন' },
          { bold: 'অটো ক্লিপবোর্ডে কপি', desc: 'কোনো অ্যাপ খোলার দরকার নেই' },
          { bold: 'সরাসরি পেস্ট', desc: 'মেসেঞ্জার বা ফাইলে পাঠান' },
          { bold: 'নিখুঁত কোয়ালিটি', desc: 'হাই রেজোলিউশন ক্যাপচার' }
        ]
      },
      {
        badge: 'Ctrl+Shift+Esc',
        name: 'টাস্ক ম্যানেজার',
        role: 'হ্যাং পিসি ফিক্স',
        color: '#EF4444',
        points: [
          { bold: 'পিসি হ্যাং হলে সমাধান', desc: 'আটকে থাকা সফটওয়্যার বন্ধ' },
          { bold: 'র‍্যাম ও সিপিইউ লোড', desc: 'কোন অ্যাপে স্লো হচ্ছে দেখুন' },
          { bold: 'স্টার্টআপ অ্যাপ অফ', desc: 'পিসি দ্রুত অন করার উপায়' },
          { bold: 'সরাসরি ওপেন', desc: 'কোনো অতিরিক্ত ক্লিক ছাড়া' }
        ]
      },
      {
        badge: 'Win + . (ডট)',
        name: 'ইমোজি ও সিম্বল',
        role: 'টাইপিং বুস্টার',
        color: '#8B5CF6',
        points: [
          { bold: 'সব ইমোজি এক ক্লিকে', desc: 'সোশ্যাল পোস্টে ইমোজি দিন' },
          { bold: 'স্পেশাল সিম্বল', desc: 'ডিগ্রি, অ্যারো ও স্পেশাল সাইন' },
          { bold: 'জিআইএফ প্যানেল', desc: 'চ্যাটিংয়ে দ্রুত রিঅ্যাকশন' },
          { bold: 'যেকোনো অ্যাপে সচল', desc: 'ব্রাউজার বা ওয়ার্ডে কাজ করে' }
        ]
      }
    ],
    bottomTags: [
      { need: 'ক্লিপবোর্ড', use: 'Win + V' },
      { need: 'স্ক্রিনশট', use: 'Win + Shift + S' },
      { need: 'হ্যাং ফিক্স', use: 'Ctrl + Shift + Esc' },
      { need: 'ইমোজি', use: 'Win + .' }
    ],
    takeaway: 'শর্টকাট কিবোর্ড কমান্ড ব্যবহার করলে প্রতিদিন কাজের গতি দ্বিগুণ হয়ে যায়।'
  },

  // 5. Social & Messaging Privacy (Covers WhatsApp, Facebook Chat Lock)
  social_privacy: {
    title: 'সোশ্যাল মিডিয়ায় ব্যক্তিগত নিরাপত্তা: ৪টি জরুরি সেটিংস!',
    subtitle: 'যাচাই করুন • অন করুন • চ্যাট নিরাপদ রাখুন',
    columns: [
      {
        badge: 'Chat Lock',
        name: 'হোয়াটসঅ্যাপ চ্যাট লক',
        role: 'ফিঙ্গারপ্রিন্ট প্রটেকশন',
        color: '#22C55E',
        points: [
          { bold: 'ফিঙ্গারপ্রিন্ট ছাড়া লক খুলবে না', desc: 'অন্য কেউ ফোন নিলেও নিরাপদ' },
          { bold: 'গোপন চ্যাট ফোল্ডার', desc: 'হোম স্ক্রিন থেকে হাইড থাকে' },
          { bold: 'নোটিফিকেশন প্রিভিউ অফ', desc: 'মেসেজের নাম বা টেক্সট লুকানো' },
          { bold: 'ব্যক্তিগত তথ্য সুরক্ষিত', desc: 'যেকোনো ব্যক্তিগত চ্যাটে কার্যকর' }
        ]
      },
      {
        badge: 'Profile Lock',
        name: 'ফেসবুক প্রোফাইল গার্ড',
        role: 'আইডি ক্লোনিং রোধ',
        color: '#1877F2',
        points: [
          { bold: 'ছবি ডাউনলোড বন্ধ', desc: 'প্রোফাইল পিকচার কেউ নিতে পারবে না' },
          { bold: 'স্ক্রিনশট প্রটেকশন', desc: 'আইডি থেকে স্ক্রিনশট ব্লক' },
          { bold: 'অচেনা ফ্রেন্ড ফিল্টার', desc: 'অপরিচিত মানুষ দেখতে পারবে না' },
          { bold: 'ভুয়া অ্যাকাউন্ট রোধ', desc: 'আপনার ছবি দিয়ে ভুয়া আইডি বন্ধ' }
        ]
      },
      {
        badge: '2-Factor',
        name: 'টু-ফ্যাক্টর ভেরিফিকেশন',
        role: 'হ্যাকিং প্রতিরোধ',
        color: '#F59E0B',
        points: [
          { bold: 'পাসওয়ার্ড পেলেও লগইন অসম্ভব', desc: 'ওটিপি কোড ছাড়া নো এন্ট্রি' },
          { bold: 'নতুন ডিভাইসে অ্যালার্ট', desc: 'কেউ ঢোকার চেষ্টা করলেই নোটিফিকেশন' },
          { bold: 'সিম সোয়াপিং থেকে রক্ষা', desc: 'অথেনটিকেটর অ্যাপ ব্যবহার করুন' },
          { bold: 'সব অ্যাকাউন্টে জরুরি', desc: 'ফেসবুক ও জিমেইলে এখনই অন রাখুন' }
        ]
      },
      {
        badge: 'Silence Call',
        name: 'অচেনা কল সাইলেন্স',
        role: 'স্প্যাম ও স্ক্যাম রোধ',
        color: '#06B6D4',
        points: [
          { bold: 'অচেনা নাম্বার রিং হবে না', desc: 'হোয়াটসঅ্যাপে সরাসরি মিউট থাকবে' },
          { bold: 'স্প্যাম ও প্রতারণা থেকে মুক্তি', desc: 'আন্তর্জাতিক ভুয়া কল বন্ধ' },
          { bold: 'কল লগ হিস্ট্রিতে দেখতে পাবেন', desc: 'জরুরি হলে পরে কলব্যাক করতে পারেন' },
          { bold: 'সাইবার ট্র্যাকিং বন্ধ', desc: 'আইপি অ্যাড্রেস গোপন রাখে' }
        ]
      }
    ],
    bottomTags: [
      { need: 'গোপন চ্যাট', use: 'চ্যাট লক' },
      { need: 'ছবি সুরক্ষা', use: 'প্রোফাইল গার্ড' },
      { need: 'হ্যাক রোধ', use: '2-Factor অন' },
      { need: 'স্প্যাম কল', use: 'সাইলেন্স কল' }
    ],
    takeaway: 'সোশ্যাল মিডিয়া অ্যাকাউন্ট সুরক্ষিত রাখতে এই ৪টি সেটিংস আজই অন করে নিন।'
  },

  // 6. Smartphone Battery Health Care
  battery_care: {
    title: 'ফোনের ব্যাটারি দীর্ঘস্থায়ী করার ৪টি গোল্ডেন রুল!',
    subtitle: 'নিয়ম জানুন • চার্জ দিন • ব্যাটারির আয়ু বাড়ান',
    columns: [
      {
        badge: '20-80% Rule',
        name: 'সঠিক চার্জিং রুল',
        role: 'লিথিয়াম ব্যাটারি কেয়ার',
        color: '#10B981',
        points: [
          { bold: '২০% এর নিচে নামাবেন না', desc: 'ব্যাটারির ওপর অতিরিক্ত চাপ পড়ে' },
          { bold: '৮০-৮৫% হলে চার্জার খুলুন', desc: 'ব্যাটারির সাইকেল লাইফ দ্বিগুণ হয়' },
          { bold: 'সারারাত চার্জে নয়', desc: 'ওভারহিটিং ও ব্যাটারি ফোলা রোধ' },
          { bold: 'স্বাভাবিক তাপমাত্রায় চার্জ', desc: 'রোদে বা বালিশের নিচে নয়' }
        ]
      },
      {
        badge: 'Background',
        name: 'ব্যাকগ্রাউন্ড অ্যাপস',
        role: 'চার্জ ড্রেন প্রতিরোধ',
        color: '#3B82F6',
        points: [
          { bold: 'অব্যবহৃত ব্যাকগ্রাউন্ড অফ', desc: 'ফেসবুক/ইনস্টা ব্যাকগ্রাউন্ড মিউট' },
          { bold: 'জিপিএস ও লোকেশন নিয়ন্ত্রণ', desc: 'প্রয়োজন ছাড়া লোকেশন অফ রাখুন' },
          { bold: 'অটো সিঙ্ক বন্ধ করুন', desc: 'ক্লাউড সিঙ্ক ম্যানুয়ালি করুন' },
          { bold: 'প্রসেসর ঠান্ডা রাখে', desc: 'ফোন স্লো হওয়া থেকে রক্ষা' }
        ]
      },
      {
        badge: 'Dark Mode',
        name: 'ডার্ক মোড ব্যবহার',
        role: 'ডিসপ্লে পাওয়ার সেভিং',
        color: '#8B5CF6',
        points: [
          { bold: 'AMOLED স্ক্রিনে বিদ্যুৎ সাশ্রয়', desc: 'কালো পিক্সেলে শূন্য বিদ্যুৎ খরচ' },
          { bold: '৩০% পর্যন্ত চার্জ সাশ্রয়', desc: 'ব্যাটারি ব্যাকআপ উল্লেখযোগ্য বাড়ে' },
          { bold: 'চোখের ওপর চাপ কমায়', desc: 'রাতের বেলা চোখের ক্লান্তি হ্রাস' },
          { bold: 'সব সিস্টেমে অন রাখুন', desc: 'সিস্টেম ও ব্রাউজারে ডার্ক থিম' }
        ]
      },
      {
        badge: 'Adapter',
        name: 'অরিজিনাল চার্জার',
        role: 'ভোল্টেজ প্রটেকশন',
        color: '#F43F5E',
        points: [
          { bold: 'অফিসিয়াল চার্জার ব্যবহার', desc: 'সঠিক ওয়াট ও ভোল্টেজ নিশ্চিত' },
          { bold: 'লোকাল সস্তা ক্যাবল নয়', desc: 'ব্যাটারির সেল নষ্ট হওয়া থেকে রক্ষা' },
          { bold: 'চার্জ দেওয়ার সময় গেমিং নয়', desc: 'ব্যাটারি অতিরিক্ত গরম হয়ে ক্ষতিগ্রস্ত' },
          { bold: 'শর্ট সার্কিট ঝুঁকি শূন্য', desc: 'নিরাপদ পাওয়ার ট্রান্সফার' }
        ]
      }
    ],
    bottomTags: [
      { need: 'চার্জিং রুল', use: '২০-৮০% নিয়ম' },
      { need: 'অ্যাপস নিয়ন্ত্রণ', use: 'ব্যাকগ্রাউন্ড অফ' },
      { need: 'ডিসপ্লে মোড', use: 'ডার্ক মোড' },
      { need: 'অ্যাডাপ্টার', use: 'অরিজিনাল চার্জার' }
    ],
    takeaway: 'সঠিক নিয়মে চার্জ দিলে ফোনের ব্যাটারি ৩-৪ বছর নতুনের মতো সার্ভিস দেবে।'
  }
};

// -------------------------------------------------------------
// INTELLIGENT TOPIC SELECTOR
// -------------------------------------------------------------
function resolveInfographicTopic(rawQuery) {
  if (!rawQuery) return INFOGRAPHIC_TOPICS.secret_codes;

  const text = (rawQuery.topic || rawQuery.title || '').toLowerCase();

  // 1. Direct Topic Matching
  if (text.includes('whatsapp') || text.includes('হোয়াটসঅ্যাপ') || text.includes('facebook') || text.includes('ফেসবুক') || text.includes('চ্যাট') || text.includes('লক') || text.includes('মেসেঞ্জার') || text.includes('social')) {
    return INFOGRAPHIC_TOPICS.social_privacy;
  }
  if (text.includes('battery') || text.includes('ব্যাটারি') || text.includes('চার্জ') || text.includes('charge')) {
    return INFOGRAPHIC_TOPICS.battery_care;
  }
  if (text.includes('ai') || text.includes('এআই') || text.includes('chatgpt') || text.includes('টুল')) {
    return INFOGRAPHIC_TOPICS.ai_tools;
  }
  if (text.includes('dial') || text.includes('code') || text.includes('কোড') || text.includes('*#') || text.includes('কল') || text.includes('ডায়াল') || text.includes('ডায়াল')) {
    return INFOGRAPHIC_TOPICS.secret_codes;
  }
  if (text.includes('scam') || text.includes('স্ক্যাম') || text.includes('প্রতারণা') || text.includes('বিকাশ') || text.includes('নগদ') || text.includes('ওটিপি') || text.includes('otp')) {
    return INFOGRAPHIC_TOPICS.scam_defense;
  }
  if (text.includes('pc') || text.includes('পিসি') || text.includes('কম্পিউটার') || text.includes('উইন্ডোজ') || text.includes('শর্টকাট') || text.includes('shortcut')) {
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
      subtitle: subtitle || 'সম্পূর্ণ গাইডলাইন',
      columns,
      bottomTags: bottomTags || [],
      takeaway: takeaway || 'প্রয়োজন অনুযায়ী সঠিক টুল নির্বাচন করুন।'
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
  console.log(`🚀 Smart Tech Bangla Karvion-Style Infographic Server running on port ${PORT}`);
});
