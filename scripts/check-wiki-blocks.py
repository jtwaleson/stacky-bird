#!/usr/bin/env python3
"""
Check that the BlockWiki contains examples for all instruction blocks.

This script:
1. Extracts all instruction names from src/instructions.ts
2. Extracts all block demo names from src/components/BlockWiki.vue
3. Reports any missing blocks in the wiki
"""

import re
import sys
from pathlib import Path


def extract_instruction_names(instructions_file: Path) -> set[str]:
    """Extract all instruction names from instructions.ts."""
    if not instructions_file.exists():
        print(f"Error: {instructions_file} not found", file=sys.stderr)
        sys.exit(1)

    content = instructions_file.read_text(encoding='utf-8')

    # Find the export default { ... } block
    # Look for patterns like "    INSTRUCTION_NAME: {"
    pattern = r'^\s+([A-Z0-9]+)\s*:\s*\{'
    matches = re.findall(pattern, content, re.MULTILINE)

    return set(matches)


def extract_wiki_block_names(wiki_file: Path) -> set[str]:
    """Extract all block demo names from BlockWiki.vue."""
    if not wiki_file.exists():
        print(f"Error: {wiki_file} not found", file=sys.stderr)
        sys.exit(1)

    content = wiki_file.read_text(encoding='utf-8')

    # Find block demo definitions: name: 'BLOCK_NAME'
    pattern = r"name:\s*['\"]([A-Z0-9]+)['\"]"
    matches = re.findall(pattern, content)

    return set(matches)


def main():
    """Main function to check wiki completeness."""
    project_root = Path(__file__).parent.parent
    instructions_file = project_root / 'src' / 'instructions.ts'
    wiki_file = project_root / 'src' / 'components' / 'BlockWiki.vue'

    # Extract instruction names and wiki block names
    all_instructions = extract_instruction_names(instructions_file)
    wiki_blocks = extract_wiki_block_names(wiki_file)

    # FINI is the finish marker, not a block that needs demonstration
    # So we exclude it from the check
    instructions_to_check = all_instructions - {'FINI'}

    # Find missing blocks
    missing_blocks = instructions_to_check - wiki_blocks

    if missing_blocks:
        print(
            f"Error: The following blocks are missing from the wiki: {sorted(missing_blocks)}",
            file=sys.stderr
        )
        sys.exit(1)

    # Also check for extra blocks in wiki that don't exist as instructions
    extra_blocks = wiki_blocks - all_instructions
    if extra_blocks:
        print(
            f"Warning: The following blocks are in the wiki but not in instructions.ts: {sorted(extra_blocks)}",
            file=sys.stderr
        )
        # This is a warning, not an error, so we don't exit

    print("✓ All instruction blocks are present in the wiki!")
    return 0


if __name__ == '__main__':
    sys.exit(main())
