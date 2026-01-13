#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Create a simple icon with blue background and white 'SP' text
    img = Image.new('RGBA', (size, size), (0, 123, 255, 255))  # Blue background
    draw = ImageDraw.Draw(img)
    
    # Draw a simple 'SP' text
    try:
        font_size = max(12, size // 3)
        font = ImageFont.truetype('/System/Library/Fonts/Arial.ttf', font_size)
    except:
        font = ImageFont.load_default()
    
    text = 'SP'
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    img.save(filename)
    print(f'Created {filename} ({size}x{size})')

# Create all required icon sizes
icons = [
    (120, 'AppIcon-120@2x.png'),
    (60, 'AppIcon-60@2x.png'),
    (180, 'AppIcon-60@3x.png'),
    (40, 'AppIcon-40@2x.png'),
    (120, 'AppIcon-40@3x.png'),
    (58, 'AppIcon-29@2x.png'),
    (87, 'AppIcon-29@3x.png'),
    (20, 'AppIcon-20@2x.png'),
    (60, 'AppIcon-20@3x.png'),
    (152, 'AppIcon-76@2x.png'),
    (167, 'AppIcon-83.5@2x.png'),
    (1024, 'AppIcon-1024@1x.png')
]

# Change to the AppIcon directory
os.chdir('/Users/cdp/Desktop/ServicePanda/ServicePandaProvider/ios/ServicePandaProvider/Images.xcassets/AppIcon.appiconset')

# Create all icons
for size, filename in icons:
    create_icon(size, filename)

print("All icon files created successfully!")

