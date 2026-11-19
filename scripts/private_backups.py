"""Private, non-overwriting backup primitives; existing archives remain untouched."""
from pathlib import Path
import hashlib
import os
import secrets
import shutil
import stat


def private_directory(path, root):
    path, root = Path(os.path.abspath(path)), Path(os.path.abspath(root))
    if path != root and root not in path.parents:
        raise ValueError('O destino deve ficar no diretório privado de backups.')
    paths = [root]
    current = root
    for part in path.relative_to(root).parts:
        current = current / part
        paths.append(current)
    for folder in paths:
        try:
            folder.mkdir(mode=0o700)
        except FileExistsError:
            info = folder.lstat()
            if not stat.S_ISDIR(info.st_mode) or stat.S_IMODE(info.st_mode) != 0o700:
                raise PermissionError('Diretório existente inseguro; operação recusada sem o alterar.')
    return path


def private_write_new(path, content, root):
    path = Path(path)
    private_directory(path.parent, root)
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    try:
        with os.fdopen(descriptor, 'wb') as output:
            output.write(content.encode('utf-8') if isinstance(content, str) else content)
            output.flush()
            os.fsync(output.fileno())
    except BaseException:
        path.unlink()  # Only the new, incomplete file created by this call.
        raise
    return path


def private_report(path, content, root):
    path = Path(path)
    if path.exists() or path.is_symlink():
        path = path.with_name(f'{path.stem}-{secrets.token_hex(8)}{path.suffix}')
    return private_write_new(path, content, root)


def private_copy(source, destination, root):
    source, destination = Path(source), Path(destination)
    private_directory(destination.parent, root)
    if destination.exists() or destination.is_symlink():
        info = destination.lstat()
        if not stat.S_ISREG(info.st_mode) or stat.S_IMODE(info.st_mode) != 0o600:
            raise PermissionError('Backup existente inseguro; operação recusada.')
        def digest(path):
            with path.open('rb') as stream:
                return hashlib.file_digest(stream, 'sha256').digest()
        if digest(source) != digest(destination):
            raise FileExistsError('O backup existente é diferente e foi preservado.')
        return False
    descriptor = os.open(destination, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    try:
        with os.fdopen(descriptor, 'wb') as output, source.open('rb') as original:
            shutil.copyfileobj(original, output)
            output.flush()
            os.fsync(output.fileno())
    except BaseException:
        destination.unlink()
        raise
    return True
