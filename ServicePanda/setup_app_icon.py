#!/usr/bin/env python3
"""
Script to set up app icons for both Android and iOS platforms.
This script will generate all required icon sizes from a source image.
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys
import shutil

def create_icon_from_source(source_path, size, output_path):
    """Create an icon of specified size from source image."""
    try:
        # Open the source image
        with Image.open(source_path) as source:
            # Convert to RGBA if not already
            if source.mode != 'RGBA':
                source = source.convert('RGBA')
            
            # Create a new image with the target size
            icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            
            # Calculate scaling to fit the image while maintaining aspect ratio
            source_width, source_height = source.size
            scale = min(size / source_width, size / source_height)
            
            # Calculate new dimensions
            new_width = int(source_width * scale)
            new_height = int(source_height * scale)
            
            # Resize the source image
            resized = source.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Calculate position to center the image
            x = (size - new_width) // 2
            y = (size - new_height) // 2
            
            # Paste the resized image onto the icon
            icon.paste(resized, (x, y), resized)
            
            # Save the icon
            icon.save(output_path, 'PNG')
            print(f'Created {output_path} ({size}x{size})')
            return True
            
    except Exception as e:
        print(f'Error creating {output_path}: {e}')
        return False

def create_fallback_icon(size, output_path):
    """Create a fallback icon with ServicePanda branding."""
    try:
        # Create a blue background similar to the ServicePanda brand
        img = Image.new('RGBA', (size, size), (59, 130, 246, 255))  # Blue background
        draw = ImageDraw.Draw(img)
        
        # Draw a simple 'SP' text
        try:
            font_size = max(12, size // 3)
            # Try to use a system font, fallback to default
            font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()
        
        text = 'SP'
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (size - text_width) // 2
        y = (size - text_height) // 2
        
        draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
        img.save(output_path, 'PNG')
        print(f'Created fallback {output_path} ({size}x{size})')
        return True
        
    except Exception as e:
        print(f'Error creating fallback {output_path}: {e}')
        return False

def setup_android_icons(source_path=None):
    """Set up Android app icons in all required mipmap directories."""
    print("Setting up Android app icons...")
    
    # Android icon sizes and directories
    android_icons = [
        (48, 'mipmap-mdpi', 'ic_launcher.png'),
        (72, 'mipmap-hdpi', 'ic_launcher.png'),
        (96, 'mipmap-xhdpi', 'ic_launcher.png'),
        (144, 'mipmap-xxhdpi', 'ic_launcher.png'),
        (192, 'mipmap-xxxhdpi', 'ic_launcher.png'),
        (48, 'mipmap-mdpi', 'ic_launcher_round.png'),
        (72, 'mipmap-hdpi', 'ic_launcher_round.png'),
        (96, 'mipmap-xhdpi', 'ic_launcher_round.png'),
        (144, 'mipmap-xxhdpi', 'ic_launcher_round.png'),
        (192, 'mipmap-xxxhdpi', 'ic_launcher_round.png'),
    ]
    
    base_path = 'android/app/src/main/res'
    
    for size, directory, filename in android_icons:
        dir_path = os.path.join(base_path, directory)
        output_path = os.path.join(dir_path, filename)
        
        # Create directory if it doesn't exist
        os.makedirs(dir_path, exist_ok=True)
        
        # Create the icon
        if source_path and os.path.exists(source_path):
            success = create_icon_from_source(source_path, size, output_path)
        else:
            success = create_fallback_icon(size, output_path)
        
        if not success:
            print(f'Failed to create {output_path}')

def setup_ios_icons(source_path=None):
    """Set up iOS app icons in the AppIcon.appiconset directory."""
    print("Setting up iOS app icons...")
    
    # iOS icon sizes
    ios_icons = [
        (20, 'AppIcon-20@2x.png'),
        (60, 'AppIcon-20@3x.png'),
        (40, 'AppIcon-20@2x.png'),
        (120, 'AppIcon-20@3x.png'),
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
    
    base_path = 'ios/ServicePanda/Images.xcassets/AppIcon.appiconset'
    
    for size, filename in ios_icons:
        output_path = os.path.join(base_path, filename)
        
        # Create directory if it doesn't exist
        os.makedirs(base_path, exist_ok=True)
        
        # Create the icon
        if source_path and os.path.exists(source_path):
            success = create_icon_from_source(source_path, size, output_path)
        else:
            success = create_fallback_icon(size, output_path)
        
        if not success:
            print(f'Failed to create {output_path}')

def update_android_manifest():
    """Update AndroidManifest.xml to include app icon reference."""
    print("Updating AndroidManifest.xml...")
    
    manifest_path = 'android/app/src/main/AndroidManifest.xml'
    
    try:
        with open(manifest_path, 'r') as f:
            content = f.read()
        
        # Check if android:icon is already set
        if 'android:icon=' not in content:
            # Add android:icon to the application tag
            content = content.replace(
                '<application',
                '<application\n        android:icon="@mipmap/ic_launcher"'
            )
            
            with open(manifest_path, 'w') as f:
                f.write(content)
            
            print("Updated AndroidManifest.xml with app icon reference")
        else:
            print("AndroidManifest.xml already has app icon reference")
            
    except Exception as e:
        print(f'Error updating AndroidManifest.xml: {e}')

def main():
    """Main function to set up app icons."""
    print("ServicePanda App Icon Setup")
    print("=" * 40)
    
    # Check if source image path is provided
    source_path = None
    if len(sys.argv) > 1:
        source_path = sys.argv[1]
        if not os.path.exists(source_path):
            print(f"Warning: Source image not found at {source_path}")
            source_path = None
    
    if not source_path:
        print("No source image provided. Using fallback icons.")
        print("Usage: python setup_app_icon.py <path_to_source_image.png>")
    
    # Set up icons for both platforms
    setup_android_icons(source_path)
    setup_ios_icons(source_path)
    update_android_manifest()
    
    print("\nApp icon setup completed!")
    print("Next steps:")
    print("1. For Android: Clean and rebuild your project")
    print("2. For iOS: Open Xcode and verify the icons in the AppIcon.appiconset")
    print("3. Test the app on both platforms to ensure icons appear correctly")

if __name__ == '__main__':
    main()
