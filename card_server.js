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
