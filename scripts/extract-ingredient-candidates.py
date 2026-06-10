import json
import re
from collections import defaultdict

def normalize_target(t):
    t = t.lower().strip()
    t = re.sub(r'[^\w\s-]', '', t)
    t = re.sub(r'\s+', '-', t)
    return t.strip('-')

def slugify(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def is_valid_target(target):
    if not target:
        return False
    target = target.strip()
    bad_patterns = [
        r'^Range\s+\d+', r'^\d+\s+a\s+\d+', r'^\d+\.\s+a\s+\d+',
        r'^\d+$', r'^\d+\.', r'^(NA|N/A)$',
        r'^Anexo', r'^Tabla', r'^Tabela', r'^Figura',
        r'^[\d\s,]+$',
    ]
    for p in bad_patterns:
        if re.search(p, target, re.I):
            return False
    if len(target) < 3 or len(target) > 80:
        return False
    if target.count(',') >= 2 or ' and ' in target.lower():
        return False
    # Skip entries with many tabs or very broken names
    if '\t' in target or len(re.sub(r'[a-zA-Z0-9\s-]', '', target)) > 8:
        return False
    return True

def extract_ingredients():
    data_files = {
        'brazil_banned': './src/data/regulations/brazil/banned.json',
        'brazil_restricted': './src/data/regulations/brazil/restricted.json',
        'mexico_banned': './src/data/regulations/mexico/banned.json',
        'mexico_restricted': './src/data/regulations/mexico/restricted.json',
    }

    all_rules = []
    for source, path in data_files.items():
        with open(path) as f:
            data = json.load(f)
        rules = data.get('rules', [])
        for r in rules:
            r['_source'] = source
        all_rules.extend(rules)

    valid_rules = [r for r in all_rules if is_valid_target(r.get('target', ''))]

    ingredients = defaultdict(lambda: {
        'name': '',
        'aliases': set(),
        'cas': '',
        'brazil': None,
        'mexico': None,
    })

    for r in valid_rules:
        target = r['target'].strip()
        key = slugify(target)
        if len(key) < 2 or len(key) > 60:
            continue
        ing = ingredients[key]
        ing['name'] = target
        if r.get('cas') and r['cas'] not in ('NA', 'N/A', '', None):
            ing['cas'] = r['cas']
        if r.get('aliases'):
            ing['aliases'].update(a for a in r['aliases'] if a and a != target)

        country = 'brazil' if 'brazil' in r['_source'] else 'mexico'
        status = 'banned' if 'banned' in r['_source'] else 'restricted'

        if ing[country] is None:
            regulation_map = {
                'brazil_banned': 'RDC 907/2024',
                'brazil_restricted': 'RDC 529/2021',
                'mexico_banned': 'NOM-141-SSA1',
                'mexico_restricted': 'NOM-141-SSA1',
            }
            ing[country] = {
                'status': status,
                'regulation': regulation_map.get(r['_source'], r.get('source', country.upper())),
                'condition': r.get('condition', ''),
                'message': r.get('message', ''),
            }

    # Score and rank
    def score_ing(ing):
        score = 0
        if ing['cas']:
            score += 2
        if ing['brazil'] and ing['mexico']:
            score += 2
        elif ing['brazil'] or ing['mexico']:
            score += 1
        if 5 <= len(ing['name']) <= 50:
            score += 1
        return score

    scored = [(key, ing, score_ing(ing)) for key, ing in ingredients.items()]
    scored.sort(key=lambda x: (-x[2], x[1]['name']))
    return scored

if __name__ == '__main__':
    scored = extract_ingredients()
    
    # Load existing slugs to deduplicate
    try:
        with open('./src/data/ingredients-database.ts', 'r') as f:
            db_content = f.read()
        existing = set(re.findall(r'^\s+"([a-z0-9-]+)":\s*\{', db_content, re.MULTILINE))
    except:
        existing = set()
    
    candidates = []
    for key, ing, s in scored:
        if key in existing:
            continue
        candidates.append({
            'slug': key,
            'name': ing['name'],
            'inci': ing['name'],
            'cas': ing['cas'],
            'category': 'other',
            'brazil': ing['brazil'],
            'mexico': ing['mexico'],
            'aliases': list(ing['aliases'])[:5],
            'score': s,
        })
    
    # Take top 280 to reach ~300 total with existing 54
    top_candidates = candidates[:280]
    
    with open('./data-import/ingredient-candidates-280.json', 'w') as f:
        json.dump(top_candidates, f, indent=2, ensure_ascii=False)
    
    print(f'Selected {len(top_candidates)} new ingredients')
    print(f'With CAS: {sum(1 for c in top_candidates if c["cas"])}')
    print(f'Both countries: {sum(1 for c in top_candidates if c["brazil"] and c["mexico"])}')
    print(f'Brazil only: {sum(1 for c in top_candidates if c["brazil"] and not c["mexico"])}')
    print(f'Mexico only: {sum(1 for c in top_candidates if c["mexico"] and not c["brazil"])}')
