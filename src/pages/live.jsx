import React, { Component } from 'react'
import axios from 'axios'
import io from 'socket.io-client'

// import { listenerCount } from 'cluster'

let socket = io('https://audi.xyz')

let pc, pc1
export default class Live extends Component {
  constructor(props) {
    super(props)
    this.constraints = { audio: true, video: true }
    this.state = {
      stream: null,
      id: null,
      name: null,
      lists: []
    }
  }
  componentDidMount() {
    const that = this
    socket.on('usersChange', list => {
      that.setState({ lists })
    })
    socket.on('setRemotIce', ({ name, data }) => {
      console.log(name + 'setRemotIce')
      // const d = new RTCIceCandidate(data)
      name === 'zhubo' ? pc1.addIceCandidate(data) : pc.addIceCandidate(data)
    })
    // socket.on('answer', async ({ name, data }) => {
    //   console.log(name + 'answer')
    //   // name === 'zhubo'
    //   //   ? pc1.setRemoteDescription(data)
    //   //   : pc.setRemoteDescription(data)
    //   if (name === 'zhubo') {
    //     pc1.setRemoteDescription(data)
    //     const answer = await pc1.createAnswer()
    //     pc1.setLocalDescription(answer)
    //     io.emit('offer', { name: 'zhibo', data: answer })
    //   } else {
    //     pc.setRemoteDescription(data)
    //   }
    // })
  }

  // startLive = async () => {
  //   try {
  //     const onIceCandidate = (name, e) => {
  //       this.emitEvent('iceCandidate', { name, data: e.candidate })
  //     }

  //     const stream = await navigator.mediaDevices.getUserMedia(this.constraints)
  //     this.setState({ stream })
  //     this.$video.srcObject = stream
  //     // 创建WebRTC连接
  //     pc = new RTCPeerConnection({})
  //     stream.getTracks().forEach(track => pc.addTrack(track, stream))
  //     pc.addEventListener('icecandidate', e => onIceCandidate('zhubo', e))
  //     // chat.on('clientCandidate', data => {
  //     //   pc.addIceCandidate(data)
  //     // })
  //     // chat.on('answer', data => {
  //     //   pc.setRemoteDescription(data)
  //     // })
  //     // pc1 = new RTCPeerConnection({})
  //     // pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e))
  //     // const that = this
  //     // pc1.addEventListener('track', e => {
  //     //   that.$video1.srcObject = e.streams[0]
  //     // })
  //     const offer = await pc.createOffer()
  //     pc.setLocalDescription(offer)
  //     this.emitEvent('offer', { name: 'zhubo', data: offer })
  //     // pc1.setRemoteDescription(offer)
  //     // const answer = await pc1.createAnswer()
  //     // pc1.setLocalDescription(answer)
  //     // pc.setRemoteDescription(answer)
  //   } catch (e) {
  //     console.log('getUserMedia' + e)
  //   }
  // }
  join = async () => {
    const that = this
    const name = this.input.value
    socket = io('https://audi.xyz')
    socket.on('setId', id => {
      this.setState({ id, name })
      this.emitEvent('setName', { name })
    })
    socket.on('lists', lists => {
      this.setState({ lists })
    })
    socket.on('message', msg => {
      const { type, data } = msg
      switch (type) {
        case 'icecandidate':
          console.log(data)
          pc.addIceCandidate(data)
          break
        case 'offer':
          this.handleOfferEvent(msg)
          break
        case 'answer':
          this.handleAnswerEvent(msg)
          break
      }
    })
  }
  emitEvent = (type, data) => {
    const date = new Date().toLocaleString()
    console.log(`emit ${type} data is ${data} ${date}`)
    socket.emit(type, data)
  }
  sendEvent = msg => {
    const { data, type } = msg
    const date = new Date().toLocaleString()
    console.log(`send ${type} data is ${data} ${date}`)
    socket.send(msg)
  }
  // 　　　　var servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }], sdpSemantics: 'plan-b' };
  initPc = list => {
    pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      sdpSemantics: 'plan-b'
    })

    pc.onicecandidate = e => {
      const candidate = e.candidate
      const msg = {
        to: list,
        from: this.state.name,
        type: 'icecandidate',
        data: candidate
      }
      this.sendEvent(msg)
    }
    pc.onnegotiationneeded = async e => {
      const offer = await pc.createOffer()
      pc.setLocalDescription(offer).then(() => {
        const msg = {
          from: this.state.name,
          to: list,
          type: 'offer',
          data: offer
        }
        this.sendEvent(msg)
      })
      // pc.setLocalDescription(offer).then(() => {
      //   const msg = {
      //     from: this.state.name,
      //     to: list,
      //     type: 'offer',
      //     data: offer
      //   }
      //   this.sendEvent(msg)
      // })
    }
  }
  handleOfferEvent = async msg => {
    const { from, data } = msg
    pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      sdpSemantics: 'plan-b'
    })

    pc.onicecandidate = e => {
      const candidate = e.candidate
      console.log(candidate + 'on')
      const msg = {
        to: from,
        from: this.state.name,
        type: 'icecandidate',
        data: candidate
      }
      this.sendEvent(msg)
    }
    pc.ontrack = e => {
      this.$video1.srcObject = e.streams[0]
    }

    pc.setRemoteDescription(msg.data).then(() => {
      console.log('set offer')
    })
    const stream = await navigator.mediaDevices.getUserMedia(this.constraints)
    stream.getTracks().forEach(track => pc.addTrack(track, stream))

    const answer = await pc.createAnswer()
    console.log(answer)
    await pc.setLocalDescription(answer)
    const sendMsg = {
      type: 'answer',
      data: answer,
      from: this.state.name,
      to: from
    }
    this.sendEvent(sendMsg)
  }
  handleAnswerEvent = async msg => {
    pc.setRemoteDescription(msg.data)
  }

  connet = async list => {
    this.initPc(list)
    const stream = await navigator.mediaDevices.getUserMedia(this.constraints)
    this.setState({ stream })
    this.$video.srcObject = stream
    stream.getTracks().forEach(track => pc.addTrack(track, stream))
  }

  close = () => {
    pc.close()
  }
  render() {
    const { stream, lists } = this.state
    return (
      <div>
        <h5>live</h5>
        <input type="text" ref={input => (this.input = input)} />
        <button onClick={this.join}>加入</button>
        <button onClick={this.startLive}>我要直播</button>
        <button onClick={this.close}>我要guan播</button>
        <div>
          <ul>
            {lists.map(list => (
              <li
                onClick={() => {
                  this.connet(list)
                }}
                key={list}
              >
                {list}
              </li>
            ))}
          </ul>
        </div>
        {stream && <video ref={video => (this.$video = video)} autoPlay />}
        <video ref={video => (this.$video1 = video)} autoPlay />
      </div>
    )
  }
}
