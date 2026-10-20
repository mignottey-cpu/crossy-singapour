# Packs an exported web build (index.html + js/game.js + assets/) into one
# self-contained HTML file that can be opened directly in a browser.
# Usage: python3 scripts/build-single-html.py <web-folder> <output.html>
import base64, re, sys, os, mimetypes
web = sys.argv[1]; out = sys.argv[2]
js = open(os.path.join(web, 'js/game.js'), encoding='utf-8').read()
types = {'.png':'image/png','.wav':'audio/wav','.mp3':'audio/mpeg','.ttf':'font/ttf','.obj':'text/plain'}
def repl(m):
    rel = m.group(1)
    path = os.path.join(web, rel[2:])
    if not os.path.exists(path):
        print('skipped (not exported):', rel)
        return m.group(0)
    ext = os.path.splitext(path)[1].lower()
    data = base64.b64encode(open(path,'rb').read()).decode()
    return '"data:%s;base64,%s"' % (types[ext], data)
js2, n = re.subn(r'"(\./assets/[^"\\]+)"', repl, js)
js2 = js2.replace('</script', '<\\/script')
html = open(os.path.join(web, 'index.html'), encoding='utf-8').read()
tag = re.search(r'<script src="\./js/game\.js"[^>]*></script>', html).group(0)
html = html.replace(tag, '')
html = html.replace('</body>', '<script>' + js2 + '</script></body>')
open(out, 'w', encoding='utf-8').write(html)
print(n, 'assets embedded,', round(os.path.getsize(out)/1e6, 1), 'MB')
