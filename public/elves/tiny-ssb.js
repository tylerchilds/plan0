import elf from '@silly/elf'

const $ = elf('tiny-ssb', {
  index: 0,
  messages: {
    [self.crypto.randomUUID()]: {
      text: 'hello mercury',
      state: 'unacknowledged'
    },
    [self.crypto.randomUUID()]: {
      text: 'hello venus',
      state: 'unacknowledged'
    },
    [self.crypto.randomUUID()]: {
      text: 'hello earth',
      state: 'unacknowledged'
    },
    [self.crypto.randomUUID()]: {
      text: 'hello mars',
      state: 'unacknowledged'
    },
    [self.crypto.randomUUID()]: {
      text: 'hello jupiter',
      state: 'unacknowledged'
    },
    [self.crypto.randomUUID()]: {
      text: 'hello saturn',
      state: 'unacknowledged'
    },
    [self.crypto.randomUUID()]: {
      text: 'hello uranus',
      state: 'unacknowledged'
    },
    [self.crypto.randomUUID()]: {
      text: 'hello neptune',
      state: 'unacknowledged'
    },
    [self.crypto.randomUUID()]: {
      text: 'hello pluto',
      state: 'unacknowledged'
    },
  }
})

$.draw(() => {
  const { messages, index } = $.learn()

  const message = messages[Object.keys(messages)[index]]
  return `
    <div class="message ${message.state === 'unacknowledged' ? 'red':'green'}">
      ${message.text}
    </div>
  `
})

const jsonrpc = {
  'start/stop': (params) => {
    const { index, messages } = $.learn()
    $.teach({
      index: (index + 1) % Object.keys(messages).length
    })
  },
  'reset': (params) => {
    const { index, messages } = $.learn()
    const id = Object.keys(messages)[index]
    const { state } = messages[id]

    const newState = state === 'unacknowledged'
      ? 'acknowledged'
      : 'unacknowledged'
    $.teach({ id, newState }, messageStateReducer)
  },
}

function messageStateReducer(state, payload) {
  return {
    ...state,
    messages: {
      ...state.messages,
      [payload.id]: {
        ...state.messages[payload.id],
        state: payload.newState
      }
    }
  }
}

$.when('json-rpc', '', (event) => {
  const { method, params } = event.detail

  if(jsonrpc[method]) {
    jsonrpc[method](params)
  }
})

$.style(`
  & {
    display: block;
    height: 100%;
  }

  & .message {
    display: block;
    height: 100%;
    font-size: 2rem;
    font-weight: bold;
    padding: 1rem;
    color: white;
  }

  & .message.red {
    background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.85)), var(--red);
  }

  & .message.green {
    background: linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.85)), var(--green);
  }
`)
