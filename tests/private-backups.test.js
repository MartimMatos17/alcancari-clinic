import test from 'node:test'
import { execFileSync } from 'node:child_process'

test('ferramentas Python criam backups privados sem alterar os existentes', () => {
  execFileSync('python3', ['-B', '-c', `
import sys, os, tempfile
from pathlib import Path
sys.path.insert(0, str(Path.cwd()/'scripts'))
from private_backups import private_directory, private_copy, private_report
with tempfile.TemporaryDirectory() as directory:
 root=Path(directory)/'backups'
 previous=os.umask(0)
 try:
  target=private_directory(root/'nested'/'copies',root)
  assert all(p.stat().st_mode & 0o777 == 0o700 for p in [root,root/'nested',target])
  source=Path(directory)/'source';source.write_bytes(b'original');source.chmod(0o644)
  backup=target/'original';assert private_copy(source,backup,root)
  before=backup.stat()
  assert backup.stat().st_mode & 0o777 == 0o600
  assert not private_copy(source,backup,root)
  source.write_bytes(b'changed')
  try:private_copy(source,backup,root);raise AssertionError('overwrite accepted')
  except FileExistsError:pass
  assert backup.read_bytes()==b'original' and backup.stat().st_mtime_ns==before.st_mtime_ns
  report=private_report(target/'report.json','first',root)
  other=private_report(target/'report.json','second',root)
  assert report != other and report.read_text()=='first' and other.stat().st_mode & 0o777 == 0o600
  external=Path(directory)/'external';external.mkdir()
  (root/'escape').symlink_to(external)
  try:private_directory(root/'escape'/'child',root);raise AssertionError('symlink accepted')
  except PermissionError:pass
  assert not (external/'child').exists()
 finally:os.umask(previous)
`], { stdio: 'pipe' })
})
