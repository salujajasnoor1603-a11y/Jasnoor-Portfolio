#!/usr/bin/env python3
"""
Download Instagram and TikTok video thumbnails using yt-dlp
This is a more reliable method that works with Instagram and TikTok
"""

import subprocess
import sys
from pathlib import Path

# Project URLs and their corresponding filenames
PROJECTS = [
    ('https://www.instagram.com/reel/DHBWYqbMLMK/', 'project1.jpg'),
    ('https://www.instagram.com/reel/DEkLYkBpfUV/', 'project2.jpg'),
    ('https://www.instagram.com/reel/DFtAvD1p38y/', 'project3.jpg'),
    ('https://vt.tiktok.com/ZSa8PQkQ5/', 'project4.jpg'),
    ('https://vt.tiktok.com/ZSa8fcmNP/', 'project5.jpg'),
    ('https://vt.tiktok.com/ZSa8PMMrm/', 'project6.jpg'),
    ('https://vt.tiktok.com/ZSa8f7yog/', 'project7.jpg'),
    ('https://vt.tiktok.com/ZSa8P8o9N/', 'project8.jpg'),
    ('https://vt.tiktok.com/ZSa8PVNxv/', 'project9.jpg'),
    ('https://www.instagram.com/reel/CzPvjSEOeTs/', 'project10.jpg'),
    ('https://www.instagram.com/reel/DPYPlCsDs4Z/', 'project11.jpg'),
]

def check_yt_dlp():
    """Check if yt-dlp is installed"""
    try:
        subprocess.run(['yt-dlp', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_yt_dlp():
    """Install yt-dlp using pip"""
    print("📦 Installing yt-dlp...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '--user', 'yt-dlp'], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def download_thumbnail(url, output_path):
    """Download thumbnail using yt-dlp"""
    try:
        # Use yt-dlp to get the thumbnail
        cmd = [
            'yt-dlp',
            '--skip-download',
            '--write-thumbnail',
            '--convert-thumbnails', 'jpg',
            '-o', str(output_path.with_suffix('')),
            url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        # yt-dlp creates files with various extensions, find the jpg one
        for ext in ['.jpg', '.webp']:
            possible_file = output_path.with_suffix(ext)
            if possible_file.exists():
                if ext != '.jpg':
                    # Rename to .jpg
                    possible_file.rename(output_path)
                return True
        
        return False
        
    except Exception as e:
        print(f"   Error: {e}")
        return False

def main():
    print("🎬 Instagram & TikTok Thumbnail Downloader\n")
    
    # Check/install yt-dlp
    if not check_yt_dlp():
        print("yt-dlp not found. Installing...")
        if not install_yt_dlp():
            print("❌ Failed to install yt-dlp")
            print("Please install manually: pip3 install yt-dlp")
            return
        print("✅ yt-dlp installed successfully\n")
    
    # Create images directory
    images_dir = Path(__file__).parent / 'images'
    images_dir.mkdir(exist_ok=True)
    
    print("🔄 Fetching thumbnails...\n")
    
    success_count = 0
    
    for url, filename in PROJECTS:
        print(f"📥 {filename}: {url}")
        output_path = images_dir / filename
        
        if download_thumbnail(url, output_path):
            if output_path.exists():
                print(f"   ✅ Saved successfully\n")
                success_count += 1
            else:
                print(f"   ❌ File not created\n")
        else:
            print(f"   ❌ Download failed\n")
    
    print(f"{'='*60}")
    print(f"✨ Downloaded {success_count}/{len(PROJECTS)} thumbnails")
    print(f"{'='*60}\n")
    
    if success_count > 0:
        print("✅ Thumbnails saved to images/ folder")
        print("Next: Update HTML to use local images")

if __name__ == '__main__':
    main()
