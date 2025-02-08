import elf from '@silly/elf'

const $ = elf('hello-world')

$.draw(() => {
  return `
    hello world
  `
})

$.style(`
  & {
    padding: 1rem;
    display: block;
  }
`)
