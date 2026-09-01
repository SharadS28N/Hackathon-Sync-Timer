from PIL import Image
import os

os.makedirs('public/logos', exist_ok=True)

def remove_background(img):
    img = img.convert("RGBA")
    data = img.getdata()
    new_data = []
    # Convert very dark pixels to transparent
    for item in data:
        if item[0] < 25 and item[1] < 25 and item[2] < 25:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img

def process_top_strip():
    img_path = 'public/logos/top_sponsors.png'
    if not os.path.exists(img_path): return
    img = remove_background(Image.open(img_path))
    w, h = img.size
    
    # TSN is left ~33%
    img.crop((0, 0, int(w*0.33), h)).save('public/logos/startup-network.png')
    # US Embassy is middle ~33%
    img.crop((int(w*0.33), 0, int(w*0.66), h)).save('public/logos/us-embassy.png')
    # Embark is right ~33%
    img.crop((int(w*0.66), 0, w, h)).save('public/logos/embark-college.png')
    print("Processed top strip")

def process_bottom_strip():
    img_path = 'public/logos/bottom_sponsors.png'
    if not os.path.exists(img_path): return
    img = remove_background(Image.open(img_path))
    w, h = img.size
    
    # Nimbace: Top Left
    img.crop((0, 0, int(w*0.5), int(h*0.5))).save('public/logos/nimbace.png')
    # NIBL: Top Right
    img.crop((int(w*0.5), 0, w, int(h*0.5))).save('public/logos/nibl.png')
    # Doodle: Bottom Left
    img.crop((0, int(h*0.5), int(w*0.5), h)).save('public/logos/doodle-dough.png')
    # Nexalaris: Bottom Right
    img.crop((int(w*0.5), int(h*0.5), w, h)).save('public/logos/nexalaris.png')
    print("Processed bottom strip")

process_top_strip()
process_bottom_strip()
