#!/usr/bin/env python3
"""Initialize a new skill directory with template files."""

import argparse
import os
from pathlib import Path

SKILL_TEMPLATE = '''---
name: {name}
description: TODO - Brief, action-oriented description for skill selection
allowed-tools: "Read,Write"
version: 1.0.0
---

# {title}

TODO: Brief purpose statement (1-2 sentences)

## Overview

TODO: What this skill does and when to use it

## Instructions

### Step 1: TODO

TODO: First imperative instruction

### Step 2: TODO

TODO: Next imperative instruction

## Output Format

TODO: How to structure results

## Resources

- Scripts: `{{baseDir}}/scripts/`
- References: `{{baseDir}}/references/`
- Assets: `{{baseDir}}/assets/`
'''

GITKEEP_CONTENT = "# This directory is for skill resources\n"


def init_skill(name: str, path: str) -> None:
    """Create a new skill directory with template structure."""
    skill_dir = Path(path) / name

    if skill_dir.exists():
        print(f"Error: Skill directory already exists: {skill_dir}")
        return

    skill_dir.mkdir(parents=True, exist_ok=True)

    # Create subdirectories
    (skill_dir / "scripts").mkdir(exist_ok=True)
    (skill_dir / "references").mkdir(exist_ok=True)
    (skill_dir / "assets").mkdir(exist_ok=True)

    # Create SKILL.md
    title = name.replace("-", " ").title()
    content = SKILL_TEMPLATE.format(name=name, title=title)
    (skill_dir / "SKILL.md").write_text(content)

    # Create .gitkeep files
    (skill_dir / "scripts" / ".gitkeep").write_text(GITKEEP_CONTENT)
    (skill_dir / "references" / ".gitkeep").write_text(GITKEEP_CONTENT)
    (skill_dir / "assets" / ".gitkeep").write_text(GITKEEP_CONTENT)

    print(f"Created skill: {skill_dir}")
    print(f"")
    print(f"Structure:")
    print(f"  {name}/")
    print(f"  ├── SKILL.md        <- Edit this with your instructions")
    print(f"  ├── scripts/        <- Add executable scripts here")
    print(f"  ├── references/     <- Add docs Claude should read")
    print(f"  └── assets/         <- Add templates referenced by path")
    print(f"")
    print(f"Next steps:")
    print(f"  1. Edit SKILL.md with your skill's instructions")
    print(f"  2. Update the description for skill discovery")
    print(f"  3. Add any scripts, references, or assets needed")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Initialize a new Claude Agent Skill",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python init_skill.py my-skill --path .claude/skills/
  python init_skill.py code-reviewer --path ~/.config/claude/skills/
        """
    )
    parser.add_argument("name", help="Skill name in kebab-case (e.g., my-skill)")
    parser.add_argument(
        "--path",
        default=".claude/skills",
        help="Output directory (default: .claude/skills)"
    )
    args = parser.parse_args()

    # Validate name
    if not args.name.replace("-", "").replace("_", "").isalnum():
        print("Error: Skill name should be alphanumeric with hyphens/underscores")
        exit(1)

    init_skill(args.name, args.path)
