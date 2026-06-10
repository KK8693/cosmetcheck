import json
import re
import random

# Category inference patterns
CATEGORY_PATTERNS = {
    'preservative': ['paraben', 'formaldehyde', 'hydantoin', 'urea', 'isothiazolinone', 'phenoxyethanol', 'benzoic', 'sorbic', 'triclosan'],
    'skin_lightening': ['hydroquinone', 'arbutin', 'kojic', 'niacinamide', 'mequinol', 'whitening', 'lightening'],
    'hair_coloring': ['phenylenediamine', 'aminophenol', 'nitrophenol', 'pyrogallol', 'resorcinol', 'ammonia', 'peroxide', 'thio', 'dye'],
    'actives': ['retino', 'salicylic', 'glycolic', 'lactic', 'benzoyl', 'vitamin', 'acid', 'niacinamide'],
    'surfactant': ['sulfate', 'lauryl', 'sulfonate', 'betaine', 'glucoside', 'dea', 'tea', 'amine'],
    'corticosteroid': ['cortico', 'betamethasone', 'hydrocortisone', 'dexamethasone', 'prednisone'],
    'other': []
}

COMMON_ALTERNATIVES = {
    'preservative': ['phenoxyethanol', 'sodium-benzoate', 'potassium-sorbate', 'ethylhexylglycerin'],
    'skin_lightening': ['niacinamide', 'alpha-arbutin', 'vitamin-c', 'kojic-acid', 'licorice-extract'],
    'hair_coloring': ['p-phenylenediamine-safe', 'henna', 'vegetable-dye'],
    'actives': ['niacinamide', 'hyaluronic-acid', 'vitamin-c', 'peptides'],
    'surfactant': ['sodium-cocoyl-isetionate', 'decyl-glucoside', 'coco-glucoside'],
    'corticosteroid': ['niacinamide', 'centella-asiatica', 'allantoin'],
    'other': ['niacinamide', 'hyaluronic-acid', 'vitamin-c', 'glycerin']
}

COMMON_USES = {
    'preservative': 'Widely used as a preservative to prevent microbial growth in cosmetics and personal care products.',
    'skin_lightening': 'Used in skin lightening, brightening, and anti-hyperpigmentation cosmetic products.',
    'hair_coloring': 'Used in hair dyes, hair colorants, and oxidative hair coloring products.',
    'actives': 'Used as an active ingredient in skincare products for treating acne, aging, or skin texture concerns.',
    'surfactant': 'Used as a cleansing or foaming agent in shampoos, body washes, and facial cleansers.',
    'corticosteroid': 'Used illegally in some cosmetic products for anti-inflammatory or skin-whitening effects.',
    'other': 'Used as a cosmetic ingredient in various personal care and beauty products.'
}

HEALTH_RISKS = {
    'banned': [
        'May cause severe skin irritation or allergic reactions',
        'Potential carcinogenic or toxic effects with repeated exposure',
        'Can accumulate in the body and cause systemic toxicity',
        'May trigger contact dermatitis in sensitive individuals',
        'Banned due to documented safety concerns in cosmetic use'
    ],
    'restricted': [
        'May cause irritation if used above permitted concentrations',
        'Can trigger allergic reactions in sensitive individuals',
        'Requires careful formulation within regulatory limits',
        'Long-term safety depends on adherence to concentration restrictions',
        'May be unsafe for use on damaged or sensitive skin'
    ],
    'allowed': [
        'Generally recognized as safe within regulated concentrations',
        'May cause mild irritation in rare cases of sensitivity',
        'Widely used with established safety profiles'
    ]
}

def infer_category(name):
    name_lower = name.lower()
    for cat, patterns in CATEGORY_PATTERNS.items():
        if cat == 'other':
            continue
        for p in patterns:
            if p in name_lower:
                return cat
    return 'other'

def generate_description(name, category, brazil, mexico):
    use = COMMON_USES.get(category, COMMON_USES['other'])
    status_parts = []
    if brazil:
        status_parts.append(f"Brazil ({brazil['status']})")
    if mexico:
        status_parts.append(f"Mexico ({mexico['status']})")
    status_str = ', '.join(status_parts) if status_parts else 'regulated in Brazil and Mexico'
    return f"{name} is a cosmetic ingredient {use.lower()} It is currently {status_str} under ANVISA/COFEPRIS regulations. Sellers must verify product formulations before listing in Latin American marketplaces."

def generate_why(name, brazil, mexico):
    messages = []
    if brazil and brazil.get('message'):
        messages.append(brazil['message'])
    if mexico and mexico.get('message'):
        messages.append(mexico['message'])
    
    if messages:
        return ' '.join(messages)
    
    if brazil and brazil['status'] == 'banned':
        return f"{name} is banned due to safety concerns documented in cosmetic regulatory frameworks. Its use in consumer products poses unacceptable health risks."
    elif brazil and brazil['status'] == 'restricted':
        return f"{name} is restricted because it can be safely used only within specific concentration limits and product categories. Exceeding these limits may pose health risks."
    return f"{name} is subject to cosmetic regulation to ensure consumer safety."

def generate_health_risks(status):
    base = HEALTH_RISKS.get(status, HEALTH_RISKS['restricted'])
    return base[:3]  # Use top 3

def generate_alternatives(category, existing_slugs=None):
    alts = COMMON_ALTERNATIVES.get(category, COMMON_ALTERNATIVES['other'])
    if existing_slugs:
        # Prefer alternatives that exist in database
        alts = [a for a in alts if a in existing_slugs] + [a for a in alts if a not in existing_slugs]
    return alts[:3]

def process_candidates():
    with open('./data-import/ingredient-candidates-280.json') as f:
        candidates = json.load(f)
    
    # Load existing slugs for alternative matching
    try:
        with open('./src/data/ingredients-database.ts', 'r') as f:
            db_content = f.read()
        existing_slugs = set(re.findall(r'^\s+"([a-z0-9-]+)":\s*\{', db_content, re.MULTILINE))
    except:
        existing_slugs = set()
    
    entries = {}
    for c in candidates:
        category = infer_category(c['name'])
        br_status = c['brazil']['status'] if c.get('brazil') else 'pending'
        mx_status = c['mexico']['status'] if c.get('mexico') else None
        primary_status = br_status if br_status != 'pending' else (mx_status or 'pending')
        
        entries[c['slug']] = {
            'name': c['name'],
            'inci': c.get('inci') or c['name'],
            'cas': c.get('cas', ''),
            'category': category,
            'commonUse': COMMON_USES.get(category, COMMON_USES['other']),
            'description': generate_description(c['name'], category, c.get('brazil'), c.get('mexico')),
            'whyBanned': generate_why(c['name'], c.get('brazil'), c.get('mexico')) if primary_status in ('banned', 'restricted') else None,
            'healthRisks': generate_health_risks(primary_status),
            'alternatives': generate_alternatives(category, existing_slugs),
            'status': {
                'brazil': {
                    'status': br_status,
                    'regulation': c['brazil']['regulation'] if c.get('brazil') else 'RDC 529/2021',
                    'since': '',
                    'limit': extract_limit(c['brazil']['condition']) if c.get('brazil') and c['brazil']['status'] == 'restricted' else None,
                    'note': c['brazil']['message'] if c.get('brazil') else ''
                },
                'mexico': {
                    'status': mx_status,
                    'regulation': c['mexico']['regulation'] if c.get('mexico') else 'NOM-141-SSA1',
                    'since': '',
                    'limit': extract_limit(c['mexico']['condition']) if c.get('mexico') and c['mexico']['status'] == 'restricted' else None,
                    'note': c['mexico']['message'] if c.get('mexico') else ''
                } if mx_status else None
            }
        }
    
    with open('./data-import/ingredient-extension-280.json', 'w') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    
    print(f'Generated {len(entries)} ingredient entries')

def extract_limit(condition):
    if not condition:
        return None
    # Look for patterns like "X%", "maximo X%", "no debe exceder de X%"
    match = re.search(r'(\d+(?:[.,]\d+)?\s*%|máximo\s+\d+(?:[.,]\d+)?\s*%|no\s+debe\s+exceder\s+de\s+\d+(?:[.,]\d+)?\s*%)', condition, re.I)
    if match:
        return match.group(1)
    return None

if __name__ == '__main__':
    process_candidates()
