# Forever Us ❤️ — Public Deployment Script for Google Firebase Hosting & Database
param (
    [string]$ProjectId = ""
)

$ErrorActionPreference = "Stop"

Write-Host "`n💖 ==========================================" -ForegroundColor Magenta
Write-Host "   Forever Us ❤️ — Production Deployment" -ForegroundColor Yellow
Write-Host "==========================================`n" -ForegroundColor Magenta

# Step 1: Check Firebase Authentication
Write-Host "🔍 [1/4] Verifying Firebase Authentication..." -ForegroundColor Cyan
try {
    $projects = npx.cmd -y firebase-tools projects:list --json | ConvertFrom-Json
    Write-Host "✅ Authenticated with Firebase!" -ForegroundColor Green
} catch {
    Write-Host "`n⚠️  You are not logged into Firebase yet." -ForegroundColor Yellow
    Write-Host "👉 Please run the following command in your terminal to log in with your Google account:" -ForegroundColor White
    Write-Host "   npx.cmd -y firebase-tools login`n" -ForegroundColor Cyan
    exit 1
}

# Step 2: Configure Project ID
if (-not $ProjectId) {
    if (Test-Path ".firebaserc") {
        $rc = Get-Content ".firebaserc" | ConvertFrom-Json
        $ProjectId = $rc.projects.default
    }
}

if (-not $ProjectId) {
    Write-Host "`n👉 Please specify your Firebase Project ID." -ForegroundColor Yellow
    Write-Host "Available projects:" -ForegroundColor White
    npx.cmd -y firebase-tools projects:list
    Write-Host "`nExample usage: .\deploy.ps1 -ProjectId your-firebase-project-id" -ForegroundColor Cyan
    exit 1
}

Write-Host "🎯 [2/4] Linking Firebase Project: $ProjectId..." -ForegroundColor Cyan
npx.cmd -y firebase-tools use $ProjectId

# Step 3: Build the Optimized Static Production Bundle
Write-Host "`n📦 [3/4] Building Next.js static export bundle..." -ForegroundColor Cyan
npm.cmd run build

# Step 4: Deploy to Firebase Hosting & Security Rules
Write-Host "`n🚀 [4/4] Deploying to Google Firebase (Hosting + Database Rules)..." -ForegroundColor Cyan
npx.cmd -y firebase-tools deploy --project $ProjectId

Write-Host "`n🎉 ========================================================" -ForegroundColor Green
Write-Host "   Forever Us ❤️ is now PUBLICLY ACCESSIBLE ON GOOGLE!" -ForegroundColor Green
Write-Host "========================================================`n" -ForegroundColor Green
Write-Host "🌐 Live Website URL: https://$ProjectId.web.app" -ForegroundColor Cyan
Write-Host "🌐 Alternate URL:   https://$ProjectId.firebaseapp.com" -ForegroundColor Cyan
Write-Host "`n📱 Share this link with your partner on WhatsApp or any device!`n" -ForegroundColor Magenta
