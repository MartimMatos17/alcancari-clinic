from pathlib import Path
import json
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "public" / "images"
BACKUP = ROOT / "backups" / "image-originals"
MANIFEST = ROOT / "backups" / "image-optimization.json"

TEXT_EXTENSIONS = {
    ".js", ".jsx", ".ts", ".tsx", ".css",
    ".html", ".json", ".mjs", ".cjs",
    ".md", ".xml", ".svg", ".webmanifest", ".txt"
}

SEARCH_DIRS = ["src", "scripts", "tests", "public"]
ROOT_FILES = [
    "index.html", "vite.config.js", "README.md"
]

def source_files():
    files = []

    for directory in SEARCH_DIRS:
        base = ROOT / directory
        if base.exists():
            files.extend(
                p for p in base.rglob("*")
                if p.is_file()
                and p.suffix.lower() in TEXT_EXTENSIONS
                and "node_modules" not in p.parts
            )

    files.extend(
        ROOT / name for name in ROOT_FILES
        if (ROOT / name).exists()
    )

    return sorted(set(files))

def image_dimensions(path):
    result = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        capture_output=True,
        text=True,
        check=True
    )

    width = height = None
    for line in result.stdout.splitlines():
        if "pixelWidth:" in line:
            width = int(line.split(":")[-1])
        if "pixelHeight:" in line:
            height = int(line.split(":")[-1])

    return width, height

def convert():
    BACKUP.mkdir(parents=True, exist_ok=True)

    images = sorted(
        p for p in IMAGES.rglob("*")
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png"}
    )

    replacements = {}
    converted = []
    original_bytes = 0
    optimized_bytes = 0

    for source in images:
        relative = source.relative_to(ROOT)
        output = source.with_suffix(".webp")

        if output.exists():
            print(f"IGNORADO (WebP existente): {relative}")
            continue

        width, height = image_dimensions(source)

        if not width or not height:
            print(f"IGNORADO (dimensões indisponíveis): {relative}")
            continue

        is_logo = "logo" in source.name.lower()
        is_team = "equipa" in source.parts
        is_hero = "hero" in source.name.lower()

        max_width = (
            1000 if is_logo else
            1400 if is_team else
            2200 if is_hero else
            1700
        )

        command = [
            "cwebp", "-quiet",
            "-m", "6",
            "-mt",
            "-metadata", "none",
        ]

        if is_logo:
            command.append("-lossless")
        else:
            command.extend([
                "-q", "85",
                "-sharp_yuv",
            ])

        if width > max_width:
            command.extend(["-resize", str(max_width), "0"])

        command.extend([str(source), "-o", str(output)])

        subprocess.run(command, check=True)

        before = source.stat().st_size
        after = output.stat().st_size

        # Manter o original se o WebP não trouxer poupança.
        if after >= before:
            output.unlink()
            print(f"MANTIDO (já eficiente): {relative}")
            continue

        backup_path = BACKUP / relative.relative_to("public")
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, backup_path)

        replacements[source.name] = output.name
        converted.append(str(relative))
        original_bytes += before
        optimized_bytes += after

        percent = (1 - after / before) * 100
        print(f"OK {relative}: -{percent:.1f}%")

    changed = []

    for file in source_files():
        text = file.read_text(encoding="utf-8")
        updated = text

        for old, new in replacements.items():
            updated = updated.replace(old, new)

        if updated != text:
            file.write_text(updated, encoding="utf-8")
            changed.append(str(file.relative_to(ROOT)))

    MANIFEST.write_text(
        json.dumps({
            "images": converted,
            "updated_files": changed
        }, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print("\n===== RESULTADO =====")
    print("Imagens convertidas:", len(converted))
    print("Ficheiros atualizados:", len(changed))
    print("Peso original:", round(original_bytes / 1048576, 2), "MiB")
    print("Peso WebP:", round(optimized_bytes / 1048576, 2), "MiB")
    print("Poupança:", round(
        (original_bytes - optimized_bytes) / 1048576, 2
    ), "MiB")
    print("Originais preservados em:", BACKUP)
    print("\nAinda não foram removidos os originais públicos.")

def finalize():
    if not MANIFEST.exists():
        raise SystemExit("Não existe relatório de otimização.")

    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    originals = [ROOT / name for name in data["images"]]

    for original in originals:
        if not original.exists():
            continue

        backup = BACKUP / original.relative_to(ROOT / "public")
        webp = original.with_suffix(".webp")

        if not backup.exists() or not webp.exists():
            raise SystemExit(f"Falta backup ou WebP: {original}")

    # Não remover originais se ainda houver referências nos ficheiros.
    for file in source_files():
        text = file.read_text(encoding="utf-8")

        for original in originals:
            if original.exists() and original.name in text:
                raise SystemExit(
                    f"Referência antiga em {file}: {original.name}"
                )

    for original in originals:
        if original.exists():
            original.unlink()

    print("Originais públicos removidos.")
    print("Backups privados preservados em:", BACKUP)
    print("Executa npm run build para validar novamente.")

if __name__ == "__main__":
    if "--finalize" in sys.argv:
        finalize()
    else:
        convert()
