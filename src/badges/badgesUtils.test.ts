import { BadgeParams, createURL } from './badgesUtils'

describe('Create badge URL', () => {
  test('works with valid parameters', () => {
    const params: BadgeParams = {
      label: 'Mocked Label',
      color: 'ffffff',
      labelColor: '000000',
      logo: 'Mocked Logo',
      logoColor: 'bbbbbb',
      logoWidth: '20',
      style: 'Mocked Style',
      message: 'Mocked Message'
    }

    const url = 'https://img.shields.io/static/v1?label=Mocked%20Label&color=ffffff&labelColor=000000&logo=Mocked%20Logo&logoColor=bbbbbb&logoWidth=20&style=Mocked%20Style&message=Mocked%20Message'
    expect(createURL(params)).toBe(url)
  })

  test('works with invalid parameters', () => {
    const params = {
      label: 'Mocked Label',
      color: 'ffffff',
      labelColor: '000000',
      logo: 'Mocked Logo',
      logoColor: 'bbbbbb',
      logoWidth: '20'
    }

    const url = 'https://img.shields.io/static/v1?label=Mocked%20Label&color=ffffff&labelColor=000000&logo=Mocked%20Logo&logoColor=bbbbbb&logoWidth=20'
    expect(createURL(params as BadgeParams)).toBe(url)
  })
})
