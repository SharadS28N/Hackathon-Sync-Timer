from PIL import Image
import os
import glob

def remove_background(img):
    img = img.convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        # If very dark, make transparent
        if item[0] < 25 and item[1] < 25 and item[2] < 25:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img

def process():
    top_path = 'public/logos/top_sponsors.png'
    bottom_path = 'public/logos/bottom_sponsors.png'
    
    if os.path.exists(top_path):
        img_top = remove_background(Image.open(top_path))
        img_top.save('public/logos/transparent_top_sponsors.png')
        print("Generated transparent top sponsors.")
        
    if os.path.exists(bottom_path):
        img_bottom = remove_background(Image.open(bottom_path))
        img_bottom.save('public/logos/transparent_bottom_sponsors.png')
        print("Generated transparent bottom sponsors.")

process()
