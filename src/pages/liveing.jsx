import React, { Component } from 'react'
import axios from 'axios'
import io from 'socket.io-client'

const chat = io('http://localhost:3001')
let pc, pc1
export default class Live extends Component {
  constructor(props) {
    super(props)
    this.constraints = { audio: true, video: true }
    this.state = {
      stream: null
    }
  }
  startLive = async () => {
    this.send({ type: 1, name: 2, data: 3 })
    try {
      const onIceCandidate = (arg, e) => {
        console.log(arg)
        this.send('iceCandidate', { name: 'zhubo', data: e.candidate })
        ;(arg === pc ? pc1 : pc).addIceCandidate(e.candidate)
      }

      const stream = await navigator.mediaDevices.getUserMedia(this.constraints)
      this.setState({ stream })
      this.$video.srcObject = stream
      // 创建WebRTC连接
      pc = new RTCPeerConnection({})
      stream.getTracks().forEach(track => pc.addTrack(track, stream))
      pc.addEventListener('icecandidate', e => onIceCandidate(pc, e))
      pc1 = new RTCPeerConnection({})
      pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e))
      const that = this
      pc1.addEventListener('track', e => {
        that.$video1.srcObject = e.streams[0]
      })
      const offer = await pc.createOffer()
      pc.setLocalDescription(offer)
      pc1.setRemoteDescription(offer)
      const answer = await pc1.createAnswer()
      pc1.setLocalDescription(answer)
      pc.setRemoteDescription(answer)
    } catch (e) {
      console.log('getUserMedia' + e)
    }
  }
  send = ({ type, data }) => {
    chat.emit(type, data)
  }
  close = () => {
    this.send({ type: 1, name: 2, data: 3 })
    pc.close()
  }
  render() {
    const { stream } = this.state
    return (
      <div>
        <h5>live</h5>
        <button onClick={this.startLive}>我要直播</button>
        <button onClick={this.close}>我要guan播</button>
        {stream && <video ref={video => (this.$video = video)} autoPlay />}
        <video ref={video => (this.$video1 = video)} autoPlay />
      </div>
    )
  }
}
