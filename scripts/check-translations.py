#!/usr/bin/env python3
"""
Translation key linter for Stacky Bird.

Checks:
1. All translation keys used in JS/Vue/TS files exist in English translation file
2. All English translation keys are referenced (unused keys are errors)
3. Translation keys are identical across English, Dutch, and Spanish
"""

import json
import re
import sys
from pathlib import Path
from typing import Set, Dict, List


def get_all_keys_from_json(obj: Dict, prefix: str = "") -> Set[str]:
    """Recursively extract all keys from nested JSON object."""
    keys = set()
    for key, value in obj.items():
        full_key = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            keys.update(get_all_keys_from_json(value, full_key))
        else:
            keys.add(full_key)
    return keys


def find_empty_values(obj: Dict, prefix: str = "") -> List[str]:
    """Recursively find all keys with empty string values."""
    empty_keys = []
    for key, value in obj.items():
        full_key = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            empty_keys.extend(find_empty_values(value, full_key))
        elif value == "":
            empty_keys.append(full_key)
    return empty_keys


def sort_json_keys(obj: Dict) -> Dict:
    """Recursively sort all keys in a JSON object alphabetically."""
    if isinstance(obj, dict):
        sorted_dict = {}
        for key in sorted(obj.keys()):
            sorted_dict[key] = sort_json_keys(obj[key])
        return sorted_dict
    elif isinstance(obj, list):
        return [sort_json_keys(item) for item in obj]
    else:
        return obj


def find_translation_keys_in_file(file_path: Path) -> Set[str]:
    """Extract all translation keys from a JS/Vue/TS file."""
    keys = set()
    wildcard_patterns = set()

    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"Warning: Could not read {file_path}: {e}", file=sys.stderr)
        return keys

    # Pattern 1: $tr('key') or $tr("key")
    pattern1 = r'\$tr\s*\(\s*["\']([^"\']+)["\']'
    matches = re.findall(pattern1, content)
    keys.update(matches)

    # Pattern 2: textKey="key" or textKey='key' (static strings)
    pattern2 = r'textKey\s*=\s*["\']([^"\']+)["\']'
    matches = re.findall(pattern2, content)
    keys.update(matches)

    # Pattern 3: :textKey="'key'" (bound prop with string)
    pattern3 = r':textKey\s*=\s*["\']([^"\']+)["\']'
    matches = re.findall(pattern3, content)
    keys.update(matches)

    # Pattern 4: Template literals like `levels.${name}.displayName`
    # Extract the pattern and convert to wildcard
    pattern4 = r':textKey\s*=\s*`([^`]+)`'
    template_matches = re.findall(pattern4, content)
    for match in template_matches:
        # Handle ternary operators: level.displayName ? `levels.${level.name}.displayName` : ''
        # Extract just the template literal part
        if '?' in match:
            # Split by ? and take the part with the template
            parts = match.split('?')
            if len(parts) > 1:
                # Find the template literal part (contains ${)
                for part in parts:
                    if '${' in part:
                        match = part.strip()
                        break

        # Replace ${...} with * to create wildcard pattern
        wildcard = re.sub(r'\$\{[^}]+\}', '*', match)
        # Clean up any extra spaces, quotes, or operators
        wildcard = re.sub(r'[\'"]', '', wildcard)  # Remove quotes
        wildcard = wildcard.strip()
        if wildcard and '.' in wildcard and wildcard.startswith('levels.'):
            wildcard_patterns.add(wildcard)

    # Pattern 5: String literals that look like translation keys
    # Look for patterns like 'errors.something' or "board.something"
    # But exclude those inside template literals
    # First, mark all template literal regions
    template_regions = []
    for match in re.finditer(r'`[^`]*`', content):
        template_regions.append((match.start(), match.end()))

    # Now find string literals, but skip if they're inside template regions
    pattern5 = r'["\']((?:errors|board|menu|instructions|common|levels)\.[^"\']+)["\']'
    for match in re.finditer(pattern5, content):
        start, end = match.span(1)  # Get the key part, not the quotes
        # Check if this match is inside a template literal region
        in_template = any(region[0] <= start < region[1] for region in template_regions)
        if not in_template:
            keys.add(match.group(1))

    # Pattern 6: Error messages passed to dieBird or similar functions
    # Look for: dieBird('errors.xxx', ...) or await board.dieBird('errors.xxx', ...)
    pattern6 = r'(?:dieBird|board\.dieBird)\s*\(\s*["\']([^"\']+)["\']'
    matches = re.findall(pattern6, content)
    keys.update(matches)

    return keys, wildcard_patterns


def check_wildcard_key(key: str, all_keys: Set[str]) -> bool:
    """Check if a wildcard key pattern matches any actual keys."""
    if '*' not in key:
        return key in all_keys

    # Convert wildcard pattern to regex
    pattern = key.replace('*', '[^.]+')
    regex = re.compile(f'^{pattern}$')

    # Check if any key matches
    for actual_key in all_keys:
        if regex.match(actual_key):
            return True

    return False


def get_existing_level_names(levels_dir: Path) -> Set[str]:
    """Get set of level names from existing level files."""
    level_names = set()
    if not levels_dir.exists():
        return level_names

    for level_file in levels_dir.glob('*.ts'):
        # Extract level name from filename (e.g., "0001.ts" -> "0001")
        level_name = level_file.stem
        # Skip template file
        if level_name != 'template':
            level_names.add(level_name)

    return level_names


def main():
    """Main function to run translation checks."""
    project_root = Path(__file__).parent.parent
    src_dir = project_root / 'src'
    translations_dir = project_root / 'src' / 'translations'
    levels_dir = project_root / 'src' / 'levels'

    # Get list of existing level files
    existing_levels = get_existing_level_names(levels_dir)

    # Load translation files
    en_file = translations_dir / 'en.json'
    nl_file = translations_dir / 'nl.json'
    es_file = translations_dir / 'es.json'

    if not en_file.exists():
        print(f"Error: {en_file} not found", file=sys.stderr)
        sys.exit(1)

    with open(en_file, 'r', encoding='utf-8') as f:
        en_translations = json.load(f)

    en_keys = get_all_keys_from_json(en_translations)

    # Load other language files if they exist
    nl_keys = set()
    es_keys = set()

    if nl_file.exists():
        with open(nl_file, 'r', encoding='utf-8') as f:
            nl_translations = json.load(f)
        nl_keys = get_all_keys_from_json(nl_translations)

    if es_file.exists():
        with open(es_file, 'r', encoding='utf-8') as f:
            es_translations = json.load(f)
        es_keys = get_all_keys_from_json(es_translations)

    # Find all translation keys used in source files
    used_keys = set()
    wildcard_patterns = set()

    # Find all JS/Vue/TS files
    for ext in ['*.js', '*.ts', '*.vue']:
        for file_path in src_dir.rglob(ext):
            file_keys, file_wildcards = find_translation_keys_in_file(file_path)
            used_keys.update(file_keys)
            wildcard_patterns.update(file_wildcards)

    # Filter out keys that look like template literal syntax (should have been handled as wildcards)
    used_keys = {k for k in used_keys if not (k.startswith('`') or '${' in k or '?' in k)}

    # Define helper function to check if a level key corresponds to an existing level
    def is_valid_level_key(key: str) -> bool:
        """Check if a level key corresponds to an existing level file."""
        match = re.match(r'levels\.(\d+)\.(displayName|description)', key)
        if match:
            level_name = match.group(1)
            return level_name in existing_levels
        return True  # Non-level keys are always valid

    # Check 1: All used keys exist in English
    errors = []
    warnings = []

    missing_keys = used_keys - en_keys
    if missing_keys:
        errors.append(f"Missing translation keys in en.json: {sorted(missing_keys)}")

    # Check for empty translation values
    empty_en = find_empty_values(en_translations)
    empty_nl = find_empty_values(nl_translations) if nl_file.exists() else []
    empty_es = find_empty_values(es_translations) if es_file.exists() else []

    if empty_en:
        errors.append(f"Empty translation values in en.json: {sorted(empty_en)}")
    if empty_nl:
        errors.append(f"Empty translation values in nl.json: {sorted(empty_nl)}")
    if empty_es:
        errors.append(f"Empty translation values in es.json: {sorted(empty_es)}")

    # Check wildcard patterns
    for wildcard in wildcard_patterns:
        if not check_wildcard_key(wildcard, en_keys):
            # This might be okay for dynamic keys, so we'll warn instead of error
            warnings.append(f"Wildcard pattern '{wildcard}' doesn't match any keys in en.json")

    # Check 2: All English keys are used (unused keys are errors)
    # But exclude keys that match wildcard patterns (dynamically referenced)
    unused_keys = en_keys.copy()

    # Remove directly used keys
    unused_keys -= used_keys

    # Remove keys that match wildcard patterns
    for wildcard in wildcard_patterns:
        pattern = wildcard.replace('*', '[^.]+')
        regex = re.compile(f'^{pattern}$')
        matching_keys = {k for k in unused_keys if regex.match(k)}
        unused_keys -= matching_keys

    # Also exclude keys that are part of known dynamic patterns
    # These are referenced but not directly in code
    dynamic_patterns = [
        r'errors\..+',  # Error messages are used dynamically
        r'instructions\..+',  # Instruction descriptions are used dynamically
        r'levels\.\d+\.(displayName|description)',  # Level keys are dynamically referenced via template literals
    ]

    for pattern in dynamic_patterns:
        regex = re.compile(pattern)
        matching_keys = {k for k in unused_keys if regex.match(k)}
        unused_keys -= matching_keys

    # Exclude level keys that don't have corresponding level files (shouldn't be any left after above filter)
    unused_keys = {k for k in unused_keys if is_valid_level_key(k)}

    if unused_keys:
        errors.append(f"Unused translation keys in en.json: {sorted(unused_keys)}")

    # Filter keys to only check those for existing levels
    en_keys_filtered = {k for k in en_keys if is_valid_level_key(k)}
    nl_keys_filtered = {k for k in nl_keys if is_valid_level_key(k)} if nl_keys else set()
    es_keys_filtered = {k for k in es_keys if is_valid_level_key(k)} if es_keys else set()

    # Check 3: Keys are identical across languages (only for existing levels)
    if nl_keys and nl_keys_filtered != en_keys_filtered:
        missing_in_nl = en_keys_filtered - nl_keys_filtered
        extra_in_nl = nl_keys_filtered - en_keys_filtered
        if missing_in_nl:
            errors.append(f"Keys missing in nl.json: {sorted(missing_in_nl)}")
        if extra_in_nl:
            errors.append(f"Extra keys in nl.json: {sorted(extra_in_nl)}")

    if es_keys and es_keys_filtered != en_keys_filtered:
        missing_in_es = en_keys_filtered - es_keys_filtered
        extra_in_es = es_keys_filtered - en_keys_filtered
        if missing_in_es:
            errors.append(f"Keys missing in es.json: {sorted(missing_in_es)}")
        if extra_in_es:
            errors.append(f"Extra keys in es.json: {sorted(extra_in_es)}")

    # Sort and write translation files
    translation_files = [
        ('en.json', en_file, en_translations),
        ('nl.json', nl_file, nl_translations) if nl_file.exists() else None,
        ('es.json', es_file, es_translations) if es_file.exists() else None,
    ]

    files_sorted = []
    for file_info in translation_files:
        if file_info is None:
            continue
        filename, file_path, translations = file_info
        sorted_translations = sort_json_keys(translations)

        # Check if sorting is needed by comparing JSON strings
        original_json = json.dumps(translations, indent=2, ensure_ascii=False, sort_keys=False)
        sorted_json = json.dumps(sorted_translations, indent=2, ensure_ascii=False, sort_keys=False)

        if original_json != sorted_json:
            # Write sorted version
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(sorted_translations, f, indent=2, ensure_ascii=False, sort_keys=False)
                f.write('\n')  # Add trailing newline
            files_sorted.append(filename)

    if files_sorted:
        print(f"✓ Sorted keys alphabetically in: {', '.join(files_sorted)}", file=sys.stderr)

    # Print results
    if warnings:
        for warning in warnings:
            print(f"Warning: {warning}", file=sys.stderr)

    if errors:
        for error in errors:
            print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)

    print("✓ All translation checks passed!")
    return 0


if __name__ == '__main__':
    sys.exit(main())
