import elf from '@silly/elf'

const apps = [
  {
    app: 'hello-world',
    html: `<hello-world></hello-world>`
  },
  {
    app: 'tiny-ssb',
    html: `<tiny-ssb></tiny-ssb>`
  }
]

const $ = elf('app-root', {
  index: 0,
  light: true
})

$.draw((target) => {
  const { index, light } = $.learn()
  return `
    <div class="watch ${light?'light':''}">
      <div class="action-row">
        <button data-press="Y">Light</button>
        <button data-press="A">Start/Stop</button>
      </div>

      <div class="widget-frame">
        <div class="viewport">
          ${apps[index].html}
        </div>
      </div>

      <div class="action-row">
        <button data-press="X">Mode</button>
        <button data-press="B">Reset</button>
      </div>
  `
}, {
  beforeUpdate: (target) => {},
  afterUpdate: (target) => {},
})

const actions = {
  A: (target) => {
    const { index } = $.learn()
    const node = target.querySelector(apps[index].app)

    if(node) {
      node.dispatchEvent(new CustomEvent('json-rpc', {
        detail: {
          jsonrpc: "2.0",
          method: 'start/stop',
          params: {

          }
        }
      }))
    }
  },
  B: (target) => {
    const { index } = $.learn()
    const node = target.querySelector(apps[index].app)

    if(node) {
      node.dispatchEvent(new CustomEvent('json-rpc', {
        detail: {
          jsonrpc: "2.0",
          method: 'reset',
          params: {

          }
        }
      }))

    }
  },
  X: (target) => {
    const { index } = $.learn()
    $.teach({
      index: (index + 1) % apps.length
    })
  },
  Y: (target) => {
    const { light } = $.learn()

    $.teach({ light: !light })
  }
}

$.when('click', '[data-press]', (event) => {
  const { press } = event.target.dataset
  const action = actions[press]

  if(action) {
    action(event.target.closest($.link))
  }
})

$.style(`
  & {
    display: block;
    height: 100%;
    background: black;
  }

  & .watch {
    display: grid;
    height: 100%;
    grid-template-rows: auto 1fr auto;
  }

  & .action-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0;
  }

  & .action-row button {
    background: black;
    border: none;
    border-radius: 0;
    color: white;
    font-weight: bold;
    padding: .5rem 1rem;
  }

  & .viewport {
    overflow: auto;
    display: none;
    background: white;
    height: 100%;
  }

  & .watch.light .viewport {
    display: block;
  }
`)
