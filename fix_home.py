path = r'c:\Users\patharsh10\Desktop\portfolio_\client\src\pages\Home.tsx'
content = open(path, 'r', encoding='utf-8').read()
marker = 'export default Home;'
idx = content.find(marker)
result = content[:idx + len(marker)] + '\n'
open(path, 'w', encoding='utf-8').write(result)
print(f'Done. Kept {result.count(chr(10))} lines.')
