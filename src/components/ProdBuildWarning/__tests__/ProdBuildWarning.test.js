import { prodApiOnLocalhost } from '../ProdBuildWarning'

describe('prodApiOnLocalhost', () => {
  it('flags a production API opened from localhost', () => {
    expect(prodApiOnLocalhost('localhost', 'https://lk.edu.robbo.ru/')).toBe('lk.edu.robbo.ru')
    expect(prodApiOnLocalhost('127.0.0.1', 'https://lk.edu.robbo.ru')).toBe('lk.edu.robbo.ru')
  })

  it('stays quiet for a local stand and for production itself', () => {
    expect(prodApiOnLocalhost('localhost', 'http://localhost:8080/')).toBeNull()
    expect(prodApiOnLocalhost('lk.edu.robbo.ru', 'https://lk.edu.robbo.ru/')).toBeNull()
    expect(prodApiOnLocalhost('localhost', 'not a url')).toBeNull()
  })
})
