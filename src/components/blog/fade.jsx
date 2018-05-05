import React from 'react'

export default class Fade extends React.Component {
    static defaultProps = {
        duration: 1,
    }
    animate = false
    transitionEnd() {
        !this.animate && (this.target.style = 'display:none')
    }
    componentDidMount() {
        this.target = this.refs.wrapper.children[0]
        this.target.addEventListener("webkitTransitionEnd", () => this.transitionEnd())
    }
    fadeIn() {
        this.target.style = 'display:block; opacity:0;'
        this.timer = setTimeout(() => {
            this.target.style = `display:block; opacity:1; transition:opacity ${this.props.duration}s ease-in-out`
        })
    }
    fadeOut() {
        this.target.style = `display:block; opacity:0; transition:opacity ${this.props.duration}s ease-in-out`
    }
    componentWillReceiveProps(nVal) {
        const animate = nVal.animate
        if (this.animate === animate) return
        this.animate = animate
        if (animate) {
            this.fadeIn()
        } else {
            this.fadeOut()
        }
    }
    componentWillUpdate(nVal){
        if(nVal.animate === this.animate) return false
        else return true
    }
    componentWillUnmount() {
        clearTimeout(this.timer)
    }
    render() {
        return (
            <div ref='wrapper'>{this.props.view ? this.props.view : null}</div>
        )
    }

}