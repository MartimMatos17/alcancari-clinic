import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { articlePreview, previewResource } from '../scripts/admin-preview.mjs'

test('preview mostra somente rascunho publico e texto original com HTML escapado', () => {
  const root = mkdtempSync(join(tmpdir(), 'alcancari-preview-'))
  const url = pathToFileURL(root + '/')
  const original = { slug:'fixture', title:'Original', category:'Blog', summary:'Original', blocks:[{ type:'heading',text:'Secção' },{ type:'paragraph',text:'Texto integral original.' },{ type:'list', items:['<script>invalid</script>'] }] }
  const options = { nonce:'fixture', root:url, posts:[original], drafts:{ fixture:{ title:'<script>alterado</script>', category:'Teste', summary:'Resumo revisto', note:'PRIVATE-NOTE' } } }
  try {
    assert.equal(articlePreview('fixture',options).code,503)
    mkdirSync(join(root,'dist/assets'),{recursive:true})
    for(const name of ['index-fixture.css','blog-editorial-fixture.css'])writeFileSync(join(root,'dist/assets',name),'body{}')
    const result=articlePreview('fixture',options)
    assert.ok(result.body.indexOf('index-fixture.css') < result.body.indexOf('blog-editorial-fixture.css'));
    assert.equal(result.code,200);assert.match(result.body,/Texto integral original/);assert.match(result.body,/Resumo revisto/)
    assert.ok(!result.body.includes('<script>'));assert.ok(!result.body.includes('PRIVATE-NOTE'));assert.match(result.body,/&lt;script&gt;/)
    assert.equal(articlePreview('unknown',options).code,404)
    assert.equal(previewResource('/preview-assets/index-fixture.css',url).type,'text/css; charset=utf-8')
    assert.equal(previewResource('/preview-assets/../../.env',url),null)
    assert.equal(previewResource('/preview-media/images/../../.env',url),null)
    mkdirSync(join(root,'public/images'),{recursive:true})
    writeFileSync(join(root,'private.webp'),'private')
    symlinkSync(join(root,'private.webp'),join(root,'public/images/escape.webp'))
    assert.equal(previewResource('/preview-media/images/escape.webp',url),null)
  } finally { rmSync(root,{recursive:true,force:true}) }
})
