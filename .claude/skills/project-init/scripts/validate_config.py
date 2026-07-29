#!/usr/bin/env python3
"""Validate project initialization completed successfully."""

import json
import re
import sys
from pathlib import Path


def check_no_placeholders() -> list[str]:
    """Ensure no {{PLACEHOLDERS}} remain in key files."""
    errors = []
    files_to_check = [
        "README.md",
        "CLAUDE.md",
        "AGENTS.md",
        "docs/setup.md",
        "docs/architecture.md"
    ]

    # Pattern to find unreplaced placeholders
    pattern = re.compile(r"{{[A-Z_]+}}")

    for file in files_to_check:
        path = Path(file)
        if not path.exists():
            continue

        content = path.read_text()
        matches = pattern.findall(content)

        if matches:
            unique_matches = set(matches)
            errors.append(f"{file}: Unreplaced placeholders: {', '.join(sorted(unique_matches))}")

    return errors


def validate_json_files() -> list[str]:
    """Ensure JSON config files are valid."""
    errors = []
    json_files = ["package.json", ".eslintrc.json"]

    for file in json_files:
        path = Path(file)
        if not path.exists():
            continue

        try:
            json.loads(path.read_text())
        except json.JSONDecodeError as e:
            errors.append(f"{file}: Invalid JSON - {e}")

    return errors


def validate_toml_files() -> list[str]:
    """Ensure TOML config files are valid (basic check)."""
    errors = []
    toml_files = ["pyproject.toml", "Cargo.toml"]

    for file in toml_files:
        path = Path(file)
        if not path.exists():
            continue

        try:
            # Try to import tomllib (Python 3.11+) or fallback
            try:
                import tomllib
            except ImportError:
                import tomli as tomllib  # type: ignore

            with open(path, "rb") as f:
                tomllib.load(f)
        except Exception as e:
            errors.append(f"{file}: Invalid TOML - {e}")

    return errors


def check_gitignore_updated() -> list[str]:
    """Check if .gitignore was updated (basic heuristic)."""
    errors = []
    gitignore = Path(".gitignore")

    if not gitignore.exists():
        return ["No .gitignore file found"]

    content = gitignore.read_text()

    # At least some stack-specific entries should be present
    stack_patterns = [
        "node_modules",  # Node
        "__pycache__",   # Python
        "target/",       # Rust
        "vendor/",       # Go
    ]

    has_stack_entries = any(pattern in content for pattern in stack_patterns)
    if not has_stack_entries:
        errors.append(".gitignore: No stack-specific entries found (may not be updated)")

    return errors


def main():
    """Run all validations."""
    all_errors = []

    # Run checks
    all_errors.extend(check_no_placeholders())
    all_errors.extend(validate_json_files())
    all_errors.extend(validate_toml_files())
    all_errors.extend(check_gitignore_updated())

    # Report results
    if all_errors:
        print("❌ Validation failed:")
        for i, error in enumerate(all_errors, 1):
            print(f"  {i}. {error}")
        return 1
    else:
        print("✅ All validations passed")
        print("   - No unreplaced placeholders")
        print("   - JSON/TOML configs are valid")
        print("   - .gitignore appears updated")
        return 0


if __name__ == "__main__":
    sys.exit(main())
