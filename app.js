const fs = require('fs')

// 声母
const shengmu = {
  q: 'q',
  w: 'w',
  r: 'r',
  t: 't',
  y: 'y',
  p: 'p',
  s: 's',
  d: 'd',
  f: 'f',
  g: 'g',
  h: 'h',
  j: 'j',
  k: 'k',
  l: 'l',
  z: 'z',
  x: 'x',
  c: 'c',
  b: 'b',
  n: 'n',
  m: 'm',
  zh: 'v',
  ch: 'i',
  sh: 'u'
}

// 韵母
const yunmu = {
  a: 'a',
  o: 'o',
  u: 'u',
  e: 'e',
  i: 'i',
  v: 'y',
  iang: 'd',
  uang: 'd',
  iong: 's',

  iao: 'c',
  ian: 'm',
  ing: 'y',
  ang: 'h',
  eng: 'g',
  ong: 's',
  uan: 'r',
  uai: 'y',

  ia: 'w',
  ai: 'l',
  ei: 'z',
  ui: 'v',
  ao: 'k',
  ou: 'b',
  iu: 'q',
  ie: 'x',
  ue: 't',
  an: 'j',
  en: 'f',
  in: 'n',
  ua: 'w',
  un: 'p',
  uo: 'o',
  er: 'er'
}

const quanpins = []
const shuangpins = []

for (const [shengmuQuanpin, shengmuShuangpin] of Object.entries(shengmu)) {
  for (const [yunmuQuanpin, yunmuShuangpin] of Object.entries(yunmu)) {
    if (quanpins.includes(shengmuQuanpin + yunmuQuanpin)) {
      throw new Error(`repeat: ${shengmuQuanpin} ${yunmuQuanpin}`)
    }
    quanpins.push(shengmuQuanpin + yunmuQuanpin)
    shuangpins.push(shengmuShuangpin + yunmuShuangpin)
  }
}

console.log('音节数', quanpins.length, shuangpins.length)

const quanpinDic = fs.readFileSync('1.txt', 'utf8')
console.log('read from 1.txt')

const shuangpinDic = quanpinDic
  .split('\n')
  .map((line) => {
    if (line.trim().length == 0) {
      return ''
    }
    const [wordQuanpin, wordHanzi] = line.split(' ')
    const wordShuangpin = wordQuanpin
      .split("'")
      .filter((s) => s != '')
      .map((quanpin) => {
        const i = quanpins.indexOf(quanpin)
        if (i == -1) {
          if (quanpin.length === 1) quanpin = quanpin + quanpin // 自然码零声母转换成aa，oo这样的格式，也可以使用o+韵母格式
          return quanpin
        } else {
          return shuangpins[i]
        }
      })
      .join('')
    return `${wordShuangpin}\t${wordHanzi.trim()}\tzh-CN`
  })
  .join('\n')

fs.writeFileSync('dictionary.txt', '# Gboard Dictionary version:1\n', {flag: 'w'})
fs.writeFileSync('dictionary.txt', shuangpinDic, {flag: 'a'})
console.log('output to dictionary.txt')