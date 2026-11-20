"""Regenera data/jogadores.js (e opcionalmente data/clubes.js) a partir da sua planilha.
Uso:  python tools/extrair_planilha.py Temporada_2035-36.xlsx [--cores]
Requer: pip install openpyxl
CUIDADO: --cores sobrescreve as cores que você editou em data/clubes.js."""
import sys, json, warnings
warnings.filterwarnings('ignore')
from openpyxl import load_workbook
POS = {'GK','LE','LD','ZGE','ZGD','VOL','MC','MEIA','PE','PD','ATA','SA'}
wb = load_workbook(sys.argv[1])
wv = load_workbook(sys.argv[1], data_only=True)
def extrair(aba, lg, n):
    out, cores, cur = [], {}, None
    ws, wc = wv[aba], wb[aba]
    for r in range(1, ws.max_row + 1):
        v = [ws.cell(r, c).value for c in range(1, 11)]
        if v[8] == 'ESCALAÇÕES' and v[2]:
            if len(out) >= n: break
            cur = {'n': v[2], 'lg': lg, 'p': [], 't': ['SEM TÉCNICO', 75]}; out.append(cur)
            f = wc.cell(r, 3).fill; c = f.fgColor if f and f.fill_type == 'solid' else None
            if c is not None and c.type == 'rgb' and len(str(c.rgb)) == 8: cores[v[2]] = '#' + c.rgb[2:]
        elif cur and v[0] in POS and v[2]:
            cur['p'].append([v[0], v[1], v[2], v[3], int(v[5]), int(v[6] or 60)])
        elif cur and v[0] == 'TÉC.':
            cur['t'] = [v[2], int(v[6] or 75)]
    return out, cores
a, ca = extrair('GL', 'ING', 18)   # Golden League: 18 clubes
b, cb = extrair('SL', 'ITA', 18)   # Superlegea: 18 clubes
dados = a + b
with open('data/jogadores.js', 'w', encoding='utf-8') as f:
    f.write('const DATA=[\n' + ',\n'.join(json.dumps(x, ensure_ascii=False, separators=(',', ':')) for x in dados) + '\n];\n')
if '--cores' in sys.argv:
    with open('data/clubes.js', 'w', encoding='utf-8') as f:
        f.write('const COL=' + json.dumps({**ca, **cb}, ensure_ascii=False, indent=1) + ';\n')
print(len(dados), 'clubes,', sum(len(c['p']) for c in dados), 'jogadores')
