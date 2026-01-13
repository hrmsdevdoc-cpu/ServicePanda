#!/usr/bin/env python3
"""
Script to generate app icons for ServicePandaProvider from app_icon_provider.png
This script creates all required icon sizes for both Android and iOS platforms.
"""

from PIL import Image
import os
import shutil

def create_icon_from_source(source_path, size, output_path):
    """Create an icon of specified size from source image"""
    try:
        # Open the source image
        with Image.open(source_path) as img:
            # Convert to RGBA if not already
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # Resize the image to the required size
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Create output directory if it doesn't exist
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Save the resized image
            resized_img.save(output_path, 'PNG')
            print(f'Created {output_path} ({size}x{size})')
            return True
    except Exception as e:
        print(f'Error creating {output_path}: {e}')
        return False

def setup_android_icons(source_path):
    """Create Android app icons in all required drawable folders"""
    android_icons = [
        # (size, folder_name, filename)
        (48, 'mipmap-mdpi', 'ic_launcher.png'),
        (72, 'mipmap-hdpi', 'ic_launcher.png'),
        (96, 'mipmap-xhdpi', 'ic_launcher.png'),
        (144, 'mipmap-xxhdpi', 'ic_launcher.png'),
        (192, 'mipmap-xxxhdpi', 'ic_launcher.png'),
        # Round icons
        (48, 'mipmap-mdpi', 'ic_launcher_round.png'),
        (72, 'mipmap-hdpi', 'ic_launcher_round.png'),
        (96, 'mipmap-xhdpi', 'ic_launcher_round.png'),
        (144, 'mipmap-xxhdpi', 'ic_launcher_round.png'),
        (192, 'mipmap-xxxhdpi', 'ic_launcher_round.png'),
    ]
    
    base_path = 'android/app/src/main/res'
    
    for size, folder, filename in android_icons:
        output_path = os.path.join(base_path, folder, filename)
        create_icon_from_source(source_path, size, output_path)

def setup_ios_icons(source_path):
    """Create iOS app icons in AppIcon.appiconset folder"""
    ios_icons = [
        # (size, filename)
        (20, 'AppIcon-20@2x.png'),
        (60, 'AppIcon-20@3x.png'),
        (58, 'AppIcon-29@2x.png'),
        (87, 'AppIcon-29@3x.png'),
        (80, 'AppIcon-40@2x.png'),
        (120, 'AppIcon-40@3x.png'),
        (120, 'AppIcon-60@2x.png'),
        (180, 'AppIcon-60@3x.png'),
        (152, 'AppIcon-76@2x.png'),
        (167, 'AppIcon-83.5@2x.png'),
        (1024, 'AppIcon-1024@1x.png'),
    ]
    
    base_path = 'ios/ServicePandaProvider/Images.xcassets/AppIcon.appiconset'
    
    for size, filename in ios_icons:
        output_path = os.path.join(base_path, filename)
        create_icon_from_source(source_path, size, output_path)

def main():
    """Main function to set up app icons"""
    source_icon = 'app_icon_provider.png'
    
    # Check if source icon exists
    if not os.path.exists(source_icon):
        print(f'Error: Source icon {source_icon} not found!')
        print('Please make sure app_icon_provider.png is in the ServicePandaProvider directory.')
        return False
    
    print(f'Setting up app icons from {source_icon}...')
    print('Creating Android icons...')
    setup_android_icons(source_icon)
    
    print('Creating iOS icons...')
    setup_ios_icons(source_icon)
    
    print('\nApp icon setup completed successfully!')
    print('\nNext steps:')
    print('1. For Android: The icons are automatically referenced in AndroidManifest.xml')
    print('2. For iOS: The icons are placed in the correct AppIcon.appiconset folder')
    print('3. Clean and rebuild your app to see the new icons')
    
    return True

if __name__ == '__main__':
    main()
