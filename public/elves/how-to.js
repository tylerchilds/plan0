import elf from '@silly/elf'

const $ = elf('how-to')

$.draw(() => {
  return `
    <h1>How To</h1>

    <p>
      Welcome to the watch. Spam buttons or continue reading.
    </p>

    <h2>Buttons</h2>

    <ul>
      <li>
        <strong>Y</strong>: Turn the screen on or off
      </li>
      <li>
        <strong>X</strong>: Rotate through apps
      </li>
      <li>
        <strong>B</strong>: Secondary App Action
      </li>
      <li>
        <strong>A</strong>: Primary App Action
      </li>
    </ul>
  `
})

$.style(`
  & {
    display: block;
    overflow: auto;
    padding: 1rem;
    height: 100%;
  }
`)
