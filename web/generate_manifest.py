import os
import json
import re

ROOTS = ['release', 'temporary', 'interesting']
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

def extract_title(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith('# '):
                    title = line[2:].strip()
                    title = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', title)
                    title = re.sub(r'[*`_]', '', title)
                    return title
    except Exception:
        pass
    base = os.path.basename(filepath)
    if base.lower() == 'readme.md':
        parent = os.path.basename(os.path.dirname(filepath))
        return parent.replace('_', ' ').title() or 'README'
    name, _ = os.path.splitext(base)
    return name.replace('_', ' ').capitalize()

def generate():
    all_docs = []
    for r in ROOTS:
        category_dir = os.path.join(PROJECT_ROOT, r)
        if not os.path.exists(category_dir):
            continue
        for root, dirs, files in os.walk(category_dir):
            dirs.sort()
            for f in sorted(files):
                if f.endswith('.md'):
                    abs_path = os.path.join(root, f)
                    rel_path = os.path.relpath(abs_path, PROJECT_ROOT).replace('\\', '/')
                    title = extract_title(abs_path)
                    folder_rel = os.path.dirname(rel_path)
                    all_docs.append({
                        'path': rel_path,
                        'title': title,
                        'category': r,
                        'folder': folder_rel
                    })

    manifest_json_path = os.path.join(SCRIPT_DIR, 'manifest.json')
    manifest_js_path = os.path.join(SCRIPT_DIR, 'manifest.js')

    with open(manifest_json_path, 'w', encoding='utf-8') as f:
        json.dump(all_docs, f, ensure_ascii=False, indent=2)

    with open(manifest_js_path, 'w', encoding='utf-8') as f:
        f.write('// Auto-generated manifest of markdown documents\n')
        f.write('window.DOCS_MANIFEST = ')
        json.dump(all_docs, f, ensure_ascii=False, indent=2)
        f.write(';\n')

    print(f"Generated manifest with {len(all_docs)} documents.")

if __name__ == '__main__':
    generate()
