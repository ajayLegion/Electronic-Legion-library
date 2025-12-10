"""
validate.py

Repository-wide YAML -> JSON Schema validator.

Usage:
    python validate.py

Exits with 0 on success, 1 on failure.

Dependencies:
    - jsonschema
    - pyyaml

Behavior:
    - Loads /schemas/component_schema.json
    - Walks /components recursively, finds .yml/.yaml files
    - Attempts to parse each YAML file. Malformed/empty files are handled and reported as errors.
    - Validates parsed data against the master schema and reports any jsonschema errors.
"""

import os
import sys
import json
import argparse
from jsonschema import validate as js_validate, exceptions as js_exceptions

# Try to import yaml but fail gracefully with an informative error
try:
    import yaml
except Exception as e:
    print("Missing dependency: pyyaml is required. Install with: pip install pyyaml")
    raise


def load_master_schema(schema_path):
    if not os.path.exists(schema_path):
        print(f"Schema not found at {schema_path}")
        sys.exit(1)
    try:
        with open(schema_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Failed to read/parse master schema: {e}")
        sys.exit(1)


def find_yaml_files(root_dir):
    for dirpath, _, filenames in os.walk(root_dir):
        for fname in filenames:
            if fname.lower().endswith(('.yml', '.yaml')):
                yield os.path.join(dirpath, fname)


def safe_load_yaml(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            if not content.strip():
                # Empty file
                return None, 'EMPTY_FILE'
            data = yaml.safe_load(content)
            return data, None
    except yaml.YAMLError as ye:
        return None, f'YAML_ERROR: {ye}'
    except Exception as e:
        return None, f'IO_ERROR: {e}'


def main():
    parser = argparse.ArgumentParser(description='Repository-wide component YAML -> JSONSchema validator')
    parser.add_argument('--schema', default='schemas/component_schema.json', help='Path to master component schema')
    parser.add_argument('--components', default='components', help='Path to components directory')
    args = parser.parse_args()

    schema = load_master_schema(args.schema)

    checked = 0
    errors = []

    if not os.path.isdir(args.components):
        print(f"Components directory not found: {args.components}")
        sys.exit(1)

    for yaml_path in find_yaml_files(args.components):
        checked += 1
        data, err = safe_load_yaml(yaml_path)
        if err is not None:
            errors.append((yaml_path, err))
            print(f"{yaml_path}: {err}")
            continue

        if data is None:
            errors.append((yaml_path, 'PARSE_EMPTY_OR_NULL'))
            print(f"{yaml_path}: Parsed to None / empty structure")
            continue

        # Validate using jsonschema
        try:
            js_validate(instance=data, schema=schema)
        except js_exceptions.ValidationError as ve:
            # Provide useful context
            err_msg = f"ValidationError: {ve.message}"
            # include path if possible
            if ve.absolute_path:
                err_msg += f" at path: {'/'.join(map(str, ve.absolute_path))}"
            errors.append((yaml_path, err_msg))
            print(f"{yaml_path}: {err_msg}")
        except js_exceptions.SchemaError as se:
            errors.append((yaml_path, f"SCHEMA_ERROR: {se}"))
            print(f"{yaml_path}: SCHEMA_ERROR: {se}")
        except Exception as e:
            errors.append((yaml_path, f"UNKNOWN_VALIDATION_ERROR: {e}"))
            print(f"{yaml_path}: UNKNOWN_VALIDATION_ERROR: {e}")

    if not errors:
        print(f"✅ Validation SUCCESS: {checked} component files checked.")
        sys.exit(0)
    else:
        print(f"\n❌ Validation FAILED: {len(errors)} errors found.")
        sys.exit(1)


if __name__ == '__main__':
    main()
