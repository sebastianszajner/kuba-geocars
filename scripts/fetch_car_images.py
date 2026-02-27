#!/usr/bin/env python3
"""
Fetch car images from Wikimedia Commons, remove backgrounds with rembg.
Output: public/images/cars/{brand}-{model}.png (transparent, 400px max)
"""

from __future__ import annotations
import json, os, sys, time, subprocess, urllib.request, urllib.parse
from pathlib import Path
from typing import Optional

# rembg + PIL
from rembg import remove
from PIL import Image
import io

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "cars"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Top 3 models per brand (100 total) — Wikipedia article titles
# Format: (file_slug, wikipedia_title)
CARS = [
    # === JAPAN ===
    # Toyota (3)
    ("toyota-land-cruiser",    "Toyota Land Cruiser"),
    ("toyota-supra",           "Toyota Supra"),
    ("toyota-corolla",         "Toyota Corolla"),
    # Honda (3)
    ("honda-civic",            "Honda Civic"),
    ("honda-nsx",              "Honda NSX"),
    ("honda-cr-v",             "Honda CR-V"),
    # Nissan (3)
    ("nissan-gt-r",            "Nissan GT-R"),
    ("nissan-patrol",          "Nissan Patrol"),
    ("nissan-qashqai",         "Nissan Qashqai"),
    # Mazda (3)
    ("mazda-mx5",              "Mazda MX-5"),
    ("mazda-rx7",              "Mazda RX-7"),
    ("mazda-3",                "Mazda3"),
    # Suzuki (3)
    ("suzuki-jimny",           "Suzuki Jimny"),
    ("suzuki-swift",           "Suzuki Swift"),
    ("suzuki-vitara",          "Suzuki Vitara"),
    # Lexus (3)
    ("lexus-lfa",              "Lexus LFA"),
    ("lexus-rx",               "Lexus RX"),
    ("lexus-lc",               "Lexus LC"),

    # === GERMANY ===
    # BMW (3)
    ("bmw-m3",                 "BMW M3"),
    ("bmw-x5",                 "BMW X5"),
    ("bmw-i8",                 "BMW i8"),
    # Mercedes-Benz (3)
    ("mercedes-g-class",       "Mercedes-Benz G-Class"),
    ("mercedes-amg-gt",        "Mercedes-AMG GT"),
    ("mercedes-s-class",       "Mercedes-Benz S-Class"),
    # Volkswagen (3)
    ("vw-beetle",              "Volkswagen Beetle"),
    ("vw-golf",                "Volkswagen Golf"),
    ("vw-t1",                  "Volkswagen Type 2"),
    # Audi (3)
    ("audi-r8",                "Audi R8"),
    ("audi-tt",                "Audi TT"),
    ("audi-q5",                "Audi Q5"),
    # Porsche (3)
    ("porsche-911",            "Porsche 911"),
    ("porsche-cayenne",        "Porsche Cayenne"),
    ("porsche-taycan",         "Porsche Taycan"),
    # Opel (3)
    ("opel-corsa",             "Opel Corsa"),
    ("opel-astra",             "Opel Astra"),
    ("opel-mokka",             "Opel Mokka"),

    # === USA ===
    # Ford (3)
    ("ford-mustang",           "Ford Mustang"),
    ("ford-f150",              "Ford F-Series"),
    ("ford-bronco",            "Ford Bronco"),
    # Chevrolet (3)
    ("chevrolet-corvette",     "Chevrolet Corvette"),
    ("chevrolet-camaro",       "Chevrolet Camaro"),
    ("chevrolet-silverado",    "Chevrolet Silverado"),
    # Tesla (3)
    ("tesla-model-s",          "Tesla Model S"),
    ("tesla-model-3",          "Tesla Model 3"),
    ("tesla-cybertruck",       "Tesla Cybertruck"),
    # Jeep (3)
    ("jeep-wrangler",          "Jeep Wrangler"),
    ("jeep-grand-cherokee",    "Jeep Grand Cherokee"),
    ("jeep-gladiator",         "Jeep Gladiator (JT)"),
    # Dodge (3)
    ("dodge-challenger",       "Dodge Challenger"),
    ("dodge-charger",          "Dodge Charger (LX/LD)"),
    ("dodge-viper",            "Dodge Viper"),

    # === SOUTH KOREA ===
    # Hyundai (3)
    ("hyundai-tucson",         "Hyundai Tucson"),
    ("hyundai-ioniq5",         "Hyundai Ioniq 5"),
    ("hyundai-i20",            "Hyundai i20"),
    # Kia (3)
    ("kia-sportage",           "Kia Sportage"),
    ("kia-ev6",                "Kia EV6"),
    ("kia-stinger",            "Kia Stinger"),

    # === FRANCE ===
    # Renault (3)
    ("renault-clio",           "Renault Clio"),
    ("renault-5",              "Renault 5"),
    ("renault-captur",         "Renault Captur"),
    # Peugeot (3)
    ("peugeot-208",            "Peugeot 208"),
    ("peugeot-3008",           "Peugeot 3008"),
    ("peugeot-205",            "Peugeot 205"),
    # Citroën (3)
    ("citroen-2cv",            "Citroën 2CV"),
    ("citroen-ds",             "Citroën DS"),
    ("citroen-c3",             "Citroën C3"),

    # === ITALY ===
    # Ferrari (3)
    ("ferrari-f40",            "Ferrari F40"),
    ("ferrari-testarossa",     "Ferrari Testarossa"),
    ("ferrari-laferrari",      "LaFerrari"),
    # Lamborghini (3)
    ("lamborghini-countach",   "Lamborghini Countach"),
    ("lamborghini-aventador",  "Lamborghini Aventador"),
    ("lamborghini-huracan",    "Lamborghini Huracán"),
    # Fiat (3)
    ("fiat-500",               "Fiat 500"),
    ("fiat-panda",             "Fiat Panda"),
    ("fiat-punto",             "Fiat Punto"),
    # Alfa Romeo (3)
    ("alfa-romeo-giulia",      "Alfa Romeo Giulia (952)"),
    ("alfa-romeo-4c",          "Alfa Romeo 4C"),
    ("alfa-romeo-stelvio",     "Alfa Romeo Stelvio"),

    # === SWEDEN ===
    # Volvo (3)
    ("volvo-xc90",             "Volvo XC90"),
    ("volvo-xc40",             "Volvo XC40"),
    ("volvo-p1800",            "Volvo P1800"),

    # === CZECH ===
    # Škoda (3)
    ("skoda-octavia",          "Škoda Octavia"),
    ("skoda-fabia",            "Škoda Fabia"),
    ("skoda-kodiaq",           "Škoda Kodiaq"),

    # === SPAIN ===
    # SEAT (2)
    ("seat-ibiza",             "SEAT Ibiza"),
    ("seat-leon",              "SEAT León"),

    # === ROMANIA ===
    # Dacia (2)
    ("dacia-duster",           "Dacia Duster"),
    ("dacia-sandero",          "Dacia Sandero"),

    # === CHINA ===
    # BYD (2)
    ("byd-seal",               "BYD Seal"),
    ("byd-dolphin",            "BYD Dolphin"),

    # === UK ===
    # Jaguar (3)
    ("jaguar-e-type",          "Jaguar E-Type"),
    ("jaguar-f-type",          "Jaguar F-Type"),
    ("jaguar-f-pace",          "Jaguar F-Pace"),
    # Land Rover (3)
    ("land-rover-defender",    "Land Rover Defender"),
    ("land-rover-range-rover", "Range Rover"),
    ("land-rover-discovery",   "Land Rover Discovery"),
]

print(f"Total cars to fetch: {len(CARS)}")


def get_wiki_image_url(title: str, thumb_width: int = 960) -> Optional[str]:
    """Get the main image URL for a Wikipedia article via curl."""
    api = "https://en.wikipedia.org/w/api.php"
    params = urllib.parse.urlencode({
        "action": "query",
        "titles": title,
        "prop": "pageimages",
        "format": "json",
        "pithumbsize": thumb_width,
    })
    url = f"{api}?{params}"
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", "--max-time", "15", url],
            capture_output=True, text=True
        )
        data = json.loads(result.stdout)
        pages = data.get("query", {}).get("pages", {})
        for pid, page in pages.items():
            if "thumbnail" in page:
                return page["thumbnail"]["source"]
    except Exception as e:
        print(f"  ⚠️  API error for '{title}': {e}")
    return None


def download_image(url: str, dest: str) -> bool:
    """Download image to file via curl."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", "--max-time", "30", "-o", dest, url],
            capture_output=True
        )
        return result.returncode == 0 and os.path.getsize(dest) > 1000
    except Exception as e:
        print(f"  ⚠️  Download error: {e}")
    return False


def process_image(src_path: str, out_path: Path) -> bool:
    """Remove background and save as optimized transparent PNG."""
    try:
        img = Image.open(src_path).convert("RGBA")
        # Remove background
        output = remove(img)
        # Resize to max 400x400 keeping aspect
        output.thumbnail((400, 400), Image.LANCZOS)
        # Crop to bounding box (trim transparent edges)
        bbox = output.getbbox()
        if bbox:
            output = output.crop(bbox)
        output.save(str(out_path), "PNG", optimize=True)
        size_kb = out_path.stat().st_size / 1024
        print(f"  ✅ Saved {out_path.name} ({output.size[0]}x{output.size[1]}, {size_kb:.0f}KB)")
        return True
    except Exception as e:
        print(f"  ❌ Process error: {e}")
    return False


def main():
    success = 0
    failed = []
    tmp_dir = "/tmp/geocars_raw"
    os.makedirs(tmp_dir, exist_ok=True)

    for i, (slug, wiki_title) in enumerate(CARS):
        out_path = OUT_DIR / f"{slug}.png"
        if out_path.exists():
            print(f"[{i+1}/{len(CARS)}] {slug} — already exists, skipping")
            success += 1
            continue

        print(f"[{i+1}/{len(CARS)}] {slug} ← Wikipedia: '{wiki_title}'")

        # Step 1: Get image URL from Wikipedia
        img_url = get_wiki_image_url(wiki_title)
        if not img_url:
            print(f"  ❌ No image found on Wikipedia")
            failed.append((slug, wiki_title, "no wiki image"))
            continue

        # Step 2: Download to temp
        ext = img_url.rsplit(".", 1)[-1].split("?")[0][:4]
        tmp_path = f"{tmp_dir}/{slug}.{ext}"
        ok = download_image(img_url, tmp_path)
        if not ok:
            failed.append((slug, wiki_title, "download failed"))
            continue

        # Step 3: Remove background + save
        ok = process_image(tmp_path, out_path)
        if ok:
            success += 1
        else:
            failed.append((slug, wiki_title, "processing failed"))

        # Rate limit: be nice to Wikipedia
        time.sleep(0.5)

    print(f"\n{'='*50}")
    print(f"Done! {success}/{len(CARS)} succeeded")
    if failed:
        print(f"\nFailed ({len(failed)}):")
        for slug, title, reason in failed:
            print(f"  - {slug}: {reason} (wiki: '{title}')")


if __name__ == "__main__":
    main()
