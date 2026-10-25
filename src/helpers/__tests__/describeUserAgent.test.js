import { describeUserAgent } from '../describeUserAgent'

describe('describeUserAgent', () => {
  it('names browser and system', () => {
    expect(
      describeUserAgent(
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0 Safari/537.36',
      ),
    ).toBe('Chrome · Linux')
    expect(
      describeUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36 Edg/120',
      ),
    ).toBe('Edge · Windows')
    expect(
      describeUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605 Version/17 Mobile Safari/604.1',
      ),
    ).toBe('Safari · iOS')
    expect(
      describeUserAgent(
        'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/118 YaBrowser/23.11 Safari/537.36',
      ),
    ).toBe('Яндекс Браузер · Windows')
  })

  it('falls back for unknown or empty agents', () => {
    expect(describeUserAgent('')).toBe('')
    expect(describeUserAgent('curl/7.81.0')).toBe('curl/7.81.0')
  })
})
