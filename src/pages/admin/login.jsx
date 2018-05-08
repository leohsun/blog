import { http } from '../../util'
import React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
const FormItem = Form.Item

@Form.create()
export default class Login extends React.Component {
  state = {
    isLogin: true
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { userName } = values
        const { password } = values
        this.postData(values)
      }
    });
  }
  postData(data) {
    const url = this.state.isLogin ? '/user/login' : '/user/register'
    http('adminLoading').post(url, data)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  comparePWD = (rule, value, callback) => {
    const form = this.props.form;
    console.log(value, form.getFieldValue('password'))
    if (value && value !== form.getFieldValue('password')) {
      callback('密码输入不一致!');
    } else {
      callback();
    }
  }
  handleRegeister = (val) => {
    this.setState({ isLogin: val })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div style={{ width: '280px', margin: '80px auto 0' }}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
            )}
          </FormItem>
          {!this.state.isLogin && <FormItem>
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: '请输入有效的邮箱!',
              }, { required: true, message: '请输入邮箱!' }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入邮箱" />
            )}
          </FormItem>}
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
            )}
          </FormItem>
          {!this.state.isLogin && <FormItem>
            {getFieldDecorator('repPassword', {
              rules: [{
                validator: this.comparePWD,
              }, { required: true, message: '确认密码' }],
            })(
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><Input style={{ flex: 1 }} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" />
                <a style={{ marginLeft: '10px' }} href="#/" onClick={_ => this.handleRegeister(true)} className="login-form-forgot" >登录</a></div>
            )}
          </FormItem>}
          {this.state.isLogin && <FormItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住</Checkbox>
              )}
              <a href="#/" className="login-form-forgot" >忘记密码</a>
              <a href="#/" onClick={_ => this.handleRegeister(false)} className="login-form-forgot" >注册</a>
            </div>
            <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>

          </FormItem>}
          {!this.state.isLogin && <FormItem>
            <Button disabled={this.state.isLogin} style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
              注册
            </Button>
          </FormItem>}
        </Form>
      </div>
    )
  }
}