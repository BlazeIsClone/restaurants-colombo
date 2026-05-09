#!/usr/bin/env python3
"""
Crawl restaurant detail pages from restaurantsinsrilanka.com and append to restaurants.json.

Usage:
  # Single restaurant by URL
  python3 scripts/crawl_restaurant.py https://www.restaurantsinsrilanka.com/restaurant/taco-shack/

  # Multiple URLs
  python3 scripts/crawl_restaurant.py <url1> <url2> ...

  # Dry run (print JSON, don't write)
  python3 scripts/crawl_restaurant.py --dry-run <url>

Output is appended to src/data/restaurants.json (skips if id already exists).
"""

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.parse

RESTAURANTS_JSON = os.path.join(os.path.dirname(__file__), "../src/data/restaurants.json")

CURL_HEADERS = [
    "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "-H", "Accept-Language: en-US,en;q=0.5",
    "-H", "Accept-Encoding: gzip, deflate, br",
    "-H", "Connection: keep-alive",
]

TYPE_MAP = {
    "cafe": "cafe", "coffee-shop": "cafe", "bakery": "bakery",
    "fine-dining": "fine_dining", "bar": "bar", "grill-bbq-restaurant": "bar",
    "asian-fusion": "casual_dining", "chinese": "casual_dining", "indian": "casual_dining",
    "italian": "casual_dining", "japanese": "casual_dining", "mexican-restaurant": "casual_dining",
    "mongolian": "casual_dining", "seafood": "casual_dining", "sri-lankan": "casual_dining",
    "vegetarian": "casual_dining", "english": "casual_dining", "healthy-food": "casual_dining",
}
TYPE_PRIORITY = ["bakery", "fine_dining", "bar", "cafe", "casual_dining"]

DAY_FIXES = {"Momday": "Monday", "Wednsday": "Wednesday", "Satarday": "Saturday"}
ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

TYPE_DEFAULTS = {
    "cafe":         ["coffee lovers", "casual dining", "remote work"],
    "bakery":       ["breakfast", "casual dining", "dessert lovers"],
    "bar":          ["date night", "group dining", "drinks"],
    "fine_dining":  ["date night", "fine dining", "special occasions"],
    "casual_dining":["casual dining", "family dining", "group dining"],
}


def fetch_html(url: str) -> str:
    result = subprocess.run(
        ["curl", "-s", "-L", "--compressed"] + CURL_HEADERS + [url],
        capture_output=True, text=True, timeout=30,
    )
    if result.returncode != 0:
        raise RuntimeError(f"curl failed: {result.stderr}")
    return result.stdout


def slug_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path.strip("/")
    return path.split("/")[-1]


def pick_type(types_raw: list[str]) -> str:
    mapped = [TYPE_MAP[t] for t in types_raw if t in TYPE_MAP]
    for prio in TYPE_PRIORITY:
        if prio in mapped:
            return prio
    return "casual_dining"


def fix_hours(h: str) -> str:
    """Normalize hours string: dots to colons, fix obvious AM/PM flips."""
    h = h.replace(".", ":")
    parts = re.split(r"\s*[-–]\s*", h)
    if len(parts) == 2:
        s, e = parts
        if "PM" in s and "AM" not in s:
            m = re.search(r"(\d+):", s)
            if m and int(m.group(1)) <= 9:
                s = s.replace("PM", "AM")
        h = f"{s} - {e}"
    return h


def parse(html: str, slug: str) -> dict:
    # Name
    m = re.search(r"<h1[^>]*>([^<]+)</h1>", html)
    name = m.group(1).replace("&#8211;", "–").replace("&#038;", "&").strip() if m else slug

    # Cuisine types
    types_raw = list(dict.fromkeys(re.findall(r"restaurant-type/([^/]+)/\">", html)))
    rtype = pick_type(types_raw)

    # Coordinates from Google Maps embed (skip zoomed-out maps where d1 > 10000)
    lat = lng = None
    m = re.search(r"maps/embed\?pb=[^\"]*?!1d(\d+\.\d+)!2d([\d.\-]+).*?!3d([\d.\-]+)", html)
    if m and float(m.group(1)) <= 10000:
        lat = float(m.group(3))
        lng = float(m.group(2))

    # Rating (site is /5, we store /10)
    m = re.search(r'google-place-rating__value">([\d.]+)<', html)
    rating = round(float(m.group(1)) * 2, 1) if m else 7.0

    # Address: first fa-location-dot with a plain <p> (no <a> link inside)
    address = ""
    for m in re.finditer(r"fa-location-dot[^>]*></i>\s*<p>(.*?)</p>", html, re.DOTALL):
        inner = m.group(1)
        if "<a " in inner:
            continue
        clean = re.sub(r"<[^>]+>", "", inner).strip().replace("\n", " ").replace("  ", " ")
        if clean:
            address = clean
            break

    # Phone
    m = re.search(r'href="tel:([^"]+)"', html)
    phone = m.group(1).strip() if m else ""

    # Opening hours
    days, hours_str = [], ""
    m = re.search(r'open-hours">(.*?)</div>\s*</div>', html, re.DOTALL)
    if m:
        entries = re.findall(r"<p>(\w+)<span>([^<]+)</span></p>", m.group(1))
        open_days, time_val = [], ""
        for day, time in entries:
            day = DAY_FIXES.get(day, day)
            if time.strip().lower() != "closed":
                open_days.append(day)
                time_val = time.strip()
        days = open_days or ALL_DAYS
        hours_str = fix_hours(time_val) if time_val else "10:00 AM - 10:00 PM"
    if not hours_str:
        hours_str = "10:00 AM - 10:00 PM"
    if not days:
        days = ALL_DAYS

    # Main image
    m = re.search(r'og:image.*?content="([^"]+)"', html)
    main_image = m.group(1) if m else ""

    # Gallery (up to 4 unique images, no thumbnails, no logos)
    all_imgs = re.findall(r"wp-content/uploads/(\d+/\d+/[^\"]+\.(?:webp|jpg|jpeg|png))", html)
    seen, gallery = set(), []
    main_file = main_image.split("uploads/")[-1] if main_image else ""
    for img in all_imgs:
        if re.search(r"-\d+x\d+\.", img):
            continue
        if re.search(r"(logo|favicon|fevicon)", img, re.IGNORECASE):
            continue
        if img == main_file or img in seen:
            continue
        seen.add(img)
        gallery.append("https://www.restaurantsinsrilanka.com/wp-content/uploads/" + img)
        if len(gallery) >= 4:
            break

    # FAQ: cuisine description and perfect_for
    faq_items = re.findall(
        r'<h4 class="title">([^<]+)</h4>\s*<div class="content-wrapper"><p>(.*?)</p>',
        html, re.DOTALL,
    )
    description, perfect_for = "", []
    for question, answer in faq_items:
        ac = re.sub(r"<[^>]+>", "", answer).strip()
        ql = question.lower()
        if not description and any(k in ql for k in ["cuisine", "type of food", "menu offer", "food offer", "specialise", "specialize"]):
            description = ac
        if not perfect_for:
            if any(k in ql for k in ["perfect for", "best for", "ideal for", "suitable for"]):
                perfect_for = [p.strip().lower() for p in re.split(r"[,;]", ac) if p.strip() and len(p.strip()) < 40]
            elif "family" in ql and "yes" in ac.lower():
                perfect_for = ["family dining"]

    if not description:
        description = f"A dining spot in Sri Lanka."
    if not perfect_for:
        perfect_for = TYPE_DEFAULTS.get(rtype, ["casual dining"])

    return {
        "id": slug,
        "name": name,
        "type": rtype,
        "lat": lat,
        "lng": lng,
        "main_image": main_image,
        "gallery": gallery,
        "opening_hours": {"days": days, "hours": hours_str},
        "address": address,
        "phone": phone,
        "rating": rating,
        "perfect_for": perfect_for,
        "description": description,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("urls", nargs="+", help="Restaurant detail page URL(s)")
    parser.add_argument("--dry-run", action="store_true", help="Print JSON without writing to file")
    args = parser.parse_args()

    with open(RESTAURANTS_JSON) as f:
        existing = json.load(f)
    existing_ids = {r["id"] for r in existing}

    added = []
    for url in args.urls:
        slug = slug_from_url(url)
        if slug in existing_ids:
            print(f"SKIP {slug} (already exists)", file=sys.stderr)
            continue

        print(f"Fetching {url} ...", file=sys.stderr)
        try:
            html = fetch_html(url)
        except Exception as e:
            print(f"ERROR fetching {url}: {e}", file=sys.stderr)
            continue

        if "404" in html[:200] or len(html) < 500:
            print(f"ERROR bad response for {url}", file=sys.stderr)
            continue

        restaurant = parse(html, slug)
        added.append(restaurant)

        if restaurant["lat"] is None:
            print(f"  WARNING: could not extract coordinates for {slug} (zoomed-out map embed)", file=sys.stderr)

    if not added:
        print("Nothing to add.", file=sys.stderr)
        return

    if args.dry_run:
        print(json.dumps(added, indent="\t", ensure_ascii=False))
        return

    merged = existing + added
    with open(RESTAURANTS_JSON, "w") as f:
        json.dump(merged, f, indent="\t", ensure_ascii=False)
        f.write("\n")

    print(f"Added {len(added)} restaurant(s). Total: {len(merged)}", file=sys.stderr)
    for r in added:
        print(f"  + {r['id']}: {r['name']}", file=sys.stderr)


if __name__ == "__main__":
    main()
