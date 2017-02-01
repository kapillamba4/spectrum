import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFrequency, setActiveFrequency } from '../../../actions/frequencies'
import { setStories } from '../../../actions/stories'
import { setMessages } from '../../../actions/messages'
import { signOut, login } from '../../../actions/user'
import { Column, Header, HeaderLogo, Login, Avatar, MetaWrapper, Name, MetaLink, FreqList, FreqListHeading, Freq, FreqLabel, FreqIcon, Footer, FooterLogo, FooterMeta, Form, Input, Button } from './style';

class NavBar extends Component{
  constructor() {
    super()

    this.state = {
      frequencyName: ''
    }
  }

  login = (e) => {
    e.preventDefault();
    this.props.dispatch(login())
  }

  signOut = (e) => {
    e.preventDefault();
    this.props.dispatch(signOut())
  }

  updateFrequencyName = (e) => {
    this.setState({
      frequencyName: e.target.value
    })
  }

  setActiveFrequency = (e) => {
    this.props.dispatch(setActiveFrequency(e.target.id))
    this.props.dispatch(setStories())
    this.props.dispatch(setMessages(''))
  }

  addFrequency = (e) => {
    e.preventDefault()
    this.props.dispatch(addFrequency(this.state.frequencyName))
    this.setState({
      frequencyName: ''
    })
  }

  render() {
    const frequencies = this.props.frequencies.frequencies
    const activeFrequency = this.props.frequencies.active
    const usersFrequencies = this.props.user.frequencies

    let myFrequencies = [], allFrequencies = []
    if (frequencies && usersFrequencies) {
      for (let i = 0; i < frequencies.length; i++) {
        if (usersFrequencies.indexOf(frequencies[i].id) > -1) {
          myFrequencies.push(
            {
              id: frequencies[i].id,
              name: frequencies[i].name
            }
          )
        } else {
          allFrequencies.push(
            {
              id: frequencies[i].id,
              name: frequencies[i].name
            }
          )
        }
      }
    } else {
      for (let i = 0; i < frequencies.length; i++) {
        allFrequencies.push(
          {
            id: frequencies[i].id,
            name: frequencies[i].name
          }
        )
      }
    }

    return(
      <Column>
          { this.props.user.uid
            ? 
              <Header>
                <Avatar src={this.props.user.photoURL} title="Bryn Jackson" />
                <MetaWrapper>
                  <Name>{this.props.user.displayName}</Name> 
                  <MetaLink onClick={this.signOut}>Sign Out</MetaLink>
                </MetaWrapper>
              </Header>
            : 
              <Header login>
                <HeaderLogo src="/img/logo.png" role="presentation"/>
                <Login onClick={this.login}>Join</Login>
              </Header>
          }
          <FreqList>
            <FreqListHeading>My Frequencies</FreqListHeading>
            <Freq 
              onClick={this.setActiveFrequency} 
              id={'all'}
              active={this.props.frequencies.active === 'all'}>
              <FreqIcon src="/img/everything-icon.svg"/>
              <FreqLabel>Everything</FreqLabel>
            </Freq>

            { myFrequencies &&
              myFrequencies.map((frequency, i) => {                
                return <Freq 
                        key={i} 
                        onClick={this.setActiveFrequency} 
                        id={frequency.id}
                        active={frequency.id === activeFrequency}>
                        <FreqIcon src="/img/freq-icon.svg"/>
                        <FreqLabel>{ frequency.name }</FreqLabel>
                      </Freq>
              })
            }

            <FreqListHeading style={{marginTop:"16px"}}>Other Frequencies</FreqListHeading>
            { allFrequencies &&
              allFrequencies.map((frequency, i) => {
                return <Freq 
                        key={i} 
                        onClick={this.setActiveFrequency} 
                        id={frequency.id}
                        active={frequency.id === activeFrequency}>
                        <FreqIcon src="/img/freq-icon.svg"/>
                        <FreqLabel>{ frequency.name }</FreqLabel>
                      </Freq>
              })
            }
          </FreqList>
          <Form onSubmit={this.addFrequency}>
            <Input type="text" onChange={this.updateFrequencyName} value={this.state.frequencyName} placeholder="+ Frequency" />            
            <Button type="submit">~</Button>
          </Form>
          
          <Footer>
            <FooterLogo src="/img/mark.svg" />
            <MetaWrapper>
              <FooterMeta>© 2017 Spec Network, Inc.</FooterMeta>
              <FooterMeta>
                <MetaLink href="https://spec.fm/about"> About</MetaLink>&nbsp;·&nbsp;<MetaLink href="mailto:spectrum@spec.fm">Contact</MetaLink>
              </FooterMeta>
            </MetaWrapper>
          </Footer>

      </Column>
    )
  }
};

const mapStateToProps = (state) => ({
  user: state.user,
  frequencies: state.frequencies
})

export default connect(mapStateToProps)(NavBar);