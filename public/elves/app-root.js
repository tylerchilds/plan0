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
  light: true,
  timers: {}
})

$.draw((target) => {
  const { index, light } = $.learn()
  return `
    <div class="watch ${light?'light':''}">
      <div class="action-row">
        <button class="yellow" data-press="Y">Y</button>
        <button class="blue" data-press="X">X</button>
      </div>

      <div class="widget-frame">
        <div class="viewport">
          ${apps[index].html}
        </div>
      </div>

      <div class="action-row">
        <button class="red" data-press="B">B</button>
        <button class="green" data-press="A">A</button>
      </div>
  `
}, {
  beforeUpdate: (target) => {},
  afterUpdate: (target) => {},
})

const actions = {
  A: (target, type) => {
    const { index } = $.learn()
    const node = target.querySelector(apps[index].app)

    if(node) {
      node.dispatchEvent(new CustomEvent('json-rpc', {
        detail: {
          jsonrpc: "2.0",
          method: 'a',
          params: {
            type
          }
        }
      }))
    }
  },
  B: (target, type) => {
    const { index } = $.learn()
    const node = target.querySelector(apps[index].app)

    if(node) {
      node.dispatchEvent(new CustomEvent('json-rpc', {
        detail: {
          jsonrpc: "2.0",
          method: 'b',
          params: {
            type
          }
        }
      }))
    }
  },
  X: (target, type) => {
    const { index } = $.learn()
    $.teach({
      index: (index + 1) % apps.length
    })
  },
  Y: (target, type) => {
    const { light } = $.learn()

    $.teach({ light: !light })
  }
}

$.when('pointerdown', '[data-press]', (event) => {
  const { press } = event.target.dataset
  const root = event.target.closest($.link)
  const timerId = setTimeout(() => {
    $.teach({ [press]: null }, clearTimerReducer)
    const action = actions[press]

    if(action) {
      action(root, 'hold')
    }
  }, 500)

  $.teach({ [press]: timerId }, setTimerReducer)
})

function setTimerReducer(state, payload) {
  return {
    ...state,
    timers: {
      ...state.durations,
      ...payload
    }
  }
}

$.when('pointerup', '[data-press]', (event) => {
  const { press } = event.target.dataset
  const root = event.target.closest($.link)

  const timerId = $.learn().timers[press]

  if(timerId) {
    clearTimeout(timerId)
    $.teach({ [press]: null }, clearTimerReducer)
    const action = actions[press]

    if(action) {
      action(root, 'click')
    }
  }
})

function clearTimerReducer(state, payload) {
  return {
    ...state,
    timers: {
      ...state.durations,
      ...payload
    }
  }
}


$.when('click', '[data-press]', (event) => {
  const { press } = event.target.dataset
  const action = actions[press]

  if(action) {
    action(event.target.closest($.link), 'click')
  }
})

$.style(`
  & {
    display: block;
    height: 100%;
    background: black;
    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    touch-action: none;
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
    border: none;
    border-radius: 0;
    font-weight: bold;
    padding: .5rem 1rem;
  }

  & .widget-frame {
    overflow: auto;
  }

  & .viewport {
    display: none;
    background: white;
    height: 100%;
  }

  & .watch.light .viewport {
    display: block;
  }

  & .yellow {
    background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.75)), var(--yellow);
    color: rgba(255,255,255,.85);
  }

  & .yellow:hover,
  & .yellow:focus {
    background: linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.3)), var(--yellow);
    color: rgba(255,255,255,1);
  }

  & .blue {
    background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.75)), var(--blue);
    color: rgba(255,255,255,.85);
  }

  & .blue:hover,
  & .blue:focus {
    background: linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.3)), var(--blue);
    color: rgba(255,255,255,1);
  }

  & .red {
    background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.75)), var(--red);
    color: rgba(255,255,255,.85);
  }

  & .red:hover,
  & .red:focus {
    background: linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.3)), var(--red);
    color: rgba(255,255,255,1);
  }

  & .green {
    background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.75)), var(--green);
    color: rgba(255,255,255,.85);
  }

  & .green:hover,
  & .green:focus {
    background: linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.3)), var(--green);
    color: rgba(255,255,255,1);
  }
`)
