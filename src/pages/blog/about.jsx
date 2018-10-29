import React from 'react'
import PageWrapper from 'components/blog/page-wrapper'
import 'stylus/admin/about'
export default class About extends React.Component {
  render() {
    return (
      <PageWrapper>
        <div className="about-content">
          <h1 style={{ textAlign: 'center' }}>about</h1>
          <ul className="time-line">
            <li className="success">对项目js进行拆包，加快加载速度。&lt;1540818550373&gt;</li>
            <li className="success">v1.0成功上线</li>
          </ul>
        </div>
      </PageWrapper>
    )
  }
} 